import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const baseRef = process.env.BASE_REF || process.env.GITHUB_BASE_REF || 'main';
const hasGit = existsSync('.git');

const run = (cmd, args, options = {}) => {
  try {
    return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...options });
  } catch (error) {
    const stdout = error.stdout?.toString() || '';
    const stderr = error.stderr?.toString() || '';
    throw new Error(`${cmd} ${args.join(' ')} failed\n${stdout}\n${stderr}`.trim());
  }
};

const listChangedMigrations = () => {
  if (!hasGit) return [];
  const refsToTry = [`origin/${baseRef}...HEAD`, `${baseRef}...HEAD`, 'HEAD~1...HEAD'];
  for (const range of refsToTry) {
    try {
      const output = run('git', ['diff', '--name-only', range, '--', 'supabase/migrations']);
      const files = output.split('\n').filter((file) => file.endsWith('.sql'));
      if (files.length) return files;
    } catch {
      // Try the next range when CI did not fetch the base ref.
    }
  }
  try {
    return run('git', ['ls-files', 'supabase/migrations']).split('\n').filter((file) => file.endsWith('.sql'));
  } catch {
    return [];
  }
};

const normalize = (sql) => sql.replace(/--.*$/gm, '').replace(/\s+/g, ' ').toLowerCase();
const findings = [];

for (const file of listChangedMigrations()) {
  if (!existsSync(file)) continue;
  const sql = readFileSync(file, 'utf8');
  const compact = normalize(sql);
  const createdTables = [...compact.matchAll(/create\s+table\s+(?:if\s+not\s+exists\s+)?public\.([a-z0-9_]+)/g)].map((m) => m[1]);

  for (const table of createdTables) {
    const enablesRls = new RegExp(`alter\\s+table\\s+public\\.${table}\\s+enable\\s+row\\s+level\\s+security`).test(compact);
    if (!enablesRls) {
      findings.push({ level: 'critical', file, issue: `New table public.${table} does not enable row level security in the same migration.` });
    }
  }

  if (/alter\s+table\s+public\.[a-z0-9_]+\s+disable\s+row\s+level\s+security/.test(compact)) {
    findings.push({ level: 'critical', file, issue: 'Migration disables row level security on a public table.' });
  }

  const publicWritePolicy = /create\s+policy\s+[^;]+on\s+public\.[a-z0-9_]+\s+[^;]*for\s+(insert|update|delete|all)\s+[^;]*(using|with\s+check)\s*\(\s*true\s*\)/g;
  for (const match of compact.matchAll(publicWritePolicy)) {
    findings.push({ level: 'critical', file, issue: `Permissive public ${match[1].toUpperCase()} policy allows unrestricted writes.` });
  }

  const functionBlocks = compact.match(/create\s+(?:or\s+replace\s+)?function\s+public\.[^;]+?\$function\$/g) || [];
  for (const block of functionBlocks) {
    if (block.includes('security definer') && !block.includes('set search_path')) {
      findings.push({ level: 'critical', file, issue: 'SECURITY DEFINER function is missing an explicit search_path.' });
    }
  }
}

const canRunRemoteLint = process.env.SUPABASE_ACCESS_TOKEN && (process.env.SUPABASE_PROJECT_ID || process.env.SUPABASE_DB_URL);
if (canRunRemoteLint) {
  try {
    run('npx', ['--yes', 'supabase@latest', 'db', 'lint', '--linked', '--fail-on', 'error'], { stdio: ['ignore', 'pipe', 'pipe'] });
    console.log('Remote Supabase security lint passed.');
  } catch (error) {
    findings.push({ level: 'critical', file: 'Lovable Cloud security scan', issue: error.message });
  }
} else {
  console.log('Remote Supabase security lint skipped: configure SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_ID secrets to enable it in CI.');
}

if (findings.some((finding) => finding.level === 'critical')) {
  console.error('\nCritical Supabase security findings detected:');
  for (const finding of findings) {
    console.error(`- [${finding.level.toUpperCase()}] ${finding.file}: ${finding.issue}`);
  }
  process.exit(1);
}

console.log('Supabase migration security gate passed with no new critical findings.');
