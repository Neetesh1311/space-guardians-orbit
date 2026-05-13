// Lightweight CSV + printable-PDF exporters (no heavy deps)
import type { Satellite, Asteroid } from '@/types/space';

const downloadBlob = (data: string, filename: string, mime: string) => {
  const blob = new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const csvRow = (vals: (string | number | undefined | null)[]) =>
  vals
    .map((v) => {
      const s = v == null ? '' : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    })
    .join(',');

const printablePDF = (title: string, html: string) => {
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) return;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
    <style>
      body{font-family:ui-sans-serif,system-ui,sans-serif;color:#111;padding:32px;max-width:780px;margin:auto}
      h1{font-size:22px;margin:0 0 4px} h2{font-size:15px;margin:18px 0 6px;color:#1d4ed8}
      .meta{color:#555;font-size:11px;margin-bottom:18px}
      table{width:100%;border-collapse:collapse;font-size:12px;margin:8px 0}
      td,th{border:1px solid #ddd;padding:6px 8px;text-align:left;vertical-align:top}
      th{background:#f3f4f6}
      .step{border:1px solid #ddd;border-radius:6px;padding:10px;margin:6px 0;font-size:12px}
      .badge{display:inline-block;padding:2px 6px;border:1px solid #ccc;border-radius:10px;font-size:10px;margin-right:6px}
      @media print { .noprint{display:none} body{padding:12px} }
    </style></head><body>
    <div class="noprint" style="text-align:right;margin-bottom:12px">
      <button onclick="window.print()" style="padding:6px 12px">Save as PDF</button>
    </div>
    <h1>${title}</h1>
    <div class="meta">Generated ${new Date().toLocaleString()} · SpaceShield</div>
    ${html}
  </body></html>`);
  w.document.close();
  setTimeout(() => w.focus(), 200);
};

export const exportSatelliteCSV = (sat: Satellite) => {
  const rows = [
    csvRow(['field', 'value']),
    ...Object.entries({
      id: sat.id,
      name: sat.name,
      orbitType: sat.orbitType,
      altitude_km: sat.altitude,
      inclination_deg: sat.inclination,
      velocity_kms: sat.velocity,
      riskLevel: sat.riskLevel,
      operator: sat.operator,
      country: sat.country,
      mission: sat.mission,
      launchDate: sat.launchDate,
      launchVehicle: sat.launchVehicle,
      mass_kg: sat.mass,
      power_w: sat.power,
      designLife_yr: sat.designLife,
      exported_at: new Date().toISOString(),
    }).map(([k, v]) => csvRow([k, v as any])),
  ].join('\n');
  downloadBlob(rows, `${sat.name.replace(/\W+/g, '_')}.csv`, 'text/csv');
};

export const exportSatellitesCSV = (sats: Satellite[], lastRefresh?: Date) => {
  const header = csvRow([
    'id', 'name', 'orbitType', 'altitude_km', 'inclination_deg',
    'velocity_kms', 'riskLevel', 'operator', 'country', 'mission', 'launchDate',
  ]);
  const rows = sats.map((s) =>
    csvRow([s.id, s.name, s.orbitType, s.altitude, s.inclination, s.velocity, s.riskLevel, s.operator, s.country, s.mission, s.launchDate]),
  );
  const meta = `# exported_at,${new Date().toISOString()}\n# last_refresh,${(lastRefresh ?? new Date()).toISOString()}\n# count,${sats.length}\n`;
  downloadBlob(meta + header + '\n' + rows.join('\n'), `satellites_${Date.now()}.csv`, 'text/csv');
};

export const exportSatellitePDF = (sat: Satellite, lastRefresh?: Date) => {
  const html = `
    <table>
      <tr><th>Field</th><th>Value</th></tr>
      <tr><td>Name</td><td>${sat.name}</td></tr>
      <tr><td>NORAD / ID</td><td>${sat.id}</td></tr>
      <tr><td>Orbit</td><td>${sat.orbitType}</td></tr>
      <tr><td>Altitude</td><td>${sat.altitude.toLocaleString()} km</td></tr>
      <tr><td>Inclination</td><td>${sat.inclination.toFixed(2)}°</td></tr>
      <tr><td>Velocity</td><td>${sat.velocity.toFixed(2)} km/s</td></tr>
      <tr><td>Risk level</td><td>${sat.riskLevel.toUpperCase()}</td></tr>
      <tr><td>Operator</td><td>${sat.operator ?? '—'}</td></tr>
      <tr><td>Country</td><td>${sat.country ?? '—'}</td></tr>
      <tr><td>Mission</td><td>${sat.mission ?? '—'}</td></tr>
      <tr><td>Launch date</td><td>${sat.launchDate ?? '—'}</td></tr>
      <tr><td>Launch vehicle</td><td>${sat.launchVehicle ?? '—'}</td></tr>
      <tr><td>Mass</td><td>${sat.mass ? sat.mass + ' kg' : '—'}</td></tr>
      <tr><td>Power</td><td>${sat.power ? sat.power + ' W' : '—'}</td></tr>
      <tr><td>Design life</td><td>${sat.designLife ? sat.designLife + ' yr' : '—'}</td></tr>
      <tr><td>Last refresh</td><td>${(lastRefresh ?? new Date()).toLocaleString()}</td></tr>
    </table>
    <h2>Trajectory note</h2>
    <p>Telemetry propagated from cataloged elements. Conjunction screening uses Lovable Cloud edge functions over NASA / Space-Track data.</p>`;
  printablePDF(`Satellite report — ${sat.name}`, html);
};

export const exportAsteroidCSV = (a: Asteroid) => {
  const rows = [
    csvRow(['field', 'value']),
    csvRow(['id', a.id]),
    csvRow(['name', a.name]),
    csvRow(['diameter_min_km', a.estimatedDiameter.min]),
    csvRow(['diameter_max_km', a.estimatedDiameter.max]),
    csvRow(['hazardous', String(a.isPotentiallyHazardous)]),
    csvRow(['close_approach', a.closeApproachDate]),
    csvRow(['miss_distance_km', a.missDistance]),
    csvRow(['relative_velocity_kms', a.relativeVelocity]),
    csvRow(['orbiting_body', a.orbitingBody]),
    csvRow(['exported_at', new Date().toISOString()]),
  ].join('\n');
  downloadBlob(rows, `asteroid_${a.name.replace(/\W+/g, '_')}.csv`, 'text/csv');
};

export const exportAsteroidPDF = (a: Asteroid) => {
  const html = `<table>
    <tr><th>Field</th><th>Value</th></tr>
    <tr><td>Name</td><td>${a.name}</td></tr>
    <tr><td>NEO ID</td><td>${a.id}</td></tr>
    <tr><td>Diameter</td><td>${a.estimatedDiameter.min.toFixed(3)} – ${a.estimatedDiameter.max.toFixed(3)} km</td></tr>
    <tr><td>Potentially hazardous</td><td>${a.isPotentiallyHazardous ? 'YES' : 'No'}</td></tr>
    <tr><td>Close approach</td><td>${a.closeApproachDate}</td></tr>
    <tr><td>Miss distance</td><td>${a.missDistance.toLocaleString()} km</td></tr>
    <tr><td>Relative velocity</td><td>${a.relativeVelocity.toFixed(2)} km/s</td></tr>
    <tr><td>Orbiting body</td><td>${a.orbitingBody}</td></tr>
  </table>
  <p style="font-size:11px;color:#555">Source: NASA NEO API · NASA JPL Small-Body Database.</p>`;
  printablePDF(`Asteroid report — ${a.name}`, html);
};

export interface AvoidanceManeuver {
  step: number;
  burn: string;
  dv: number;
  when: string;
  duration: string;
  thrust: string;
  purpose: string;
  conjunction: string;
  pre: string;
}

export const exportAvoidancePlanCSV = (
  maneuvers: AvoidanceManeuver[],
  meta: { kesslerIndex: number; level: string; lastRefresh?: Date },
) => {
  const totalDv = maneuvers.reduce((s, m) => s + m.dv, 0);
  const head = csvRow(['step', 'burn', 'dv_ms', 'when', 'duration', 'thrust', 'purpose', 'conjunction', 'pre_burn']);
  const body = maneuvers.map((m) =>
    csvRow([m.step, m.burn, m.dv, m.when, m.duration, m.thrust, m.purpose, m.conjunction, m.pre]),
  );
  const metaLines = `# kessler_index,${meta.kesslerIndex}\n# level,${meta.level}\n# total_dv_ms,${totalDv.toFixed(2)}\n# last_refresh,${(meta.lastRefresh ?? new Date()).toISOString()}\n`;
  downloadBlob(metaLines + head + '\n' + body.join('\n'), `avoidance_plan_${Date.now()}.csv`, 'text/csv');
};

export const exportAvoidancePlanPDF = (
  maneuvers: AvoidanceManeuver[],
  meta: { kesslerIndex: number; level: string; lastRefresh?: Date },
) => {
  const totalDv = maneuvers.reduce((s, m) => s + m.dv, 0);
  const steps = maneuvers
    .map(
      (m) => `<div class="step">
      <div><span class="badge">Step ${m.step}</span><strong>${m.burn}</strong> · Δv ${m.dv} m/s</div>
      <div>⏱ ${m.when} · 🔥 ${m.duration} @ ${m.thrust}</div>
      <div>🎯 ${m.purpose}</div>
      <div>⚠ Conjunction: ${m.conjunction}</div>
      <div><em>Pre-burn:</em> ${m.pre}</div>
    </div>`,
    )
    .join('');
  const html = `
    <h2>Risk summary</h2>
    <table>
      <tr><th>Kessler index</th><td>${meta.kesslerIndex} / 100 (${meta.level})</td></tr>
      <tr><th>Total Δv budget</th><td>${totalDv.toFixed(2)} m/s</td></tr>
      <tr><th>Last refresh</th><td>${(meta.lastRefresh ?? new Date()).toLocaleString()}</td></tr>
    </table>
    <h2>Maneuver sequence</h2>
    ${steps}
    <p style="font-size:11px;color:#555;margin-top:18px">Computed from on-board conjunction screening over NASA / Space-Track tracked debris. Not for operational use without GNC verification.</p>
  `;
  printablePDF('Collision-avoidance plan', html);
};
