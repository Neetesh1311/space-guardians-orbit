import { useTheme, themes } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Footer = () => {
  const { currentTheme, setTheme } = useTheme();

  return (
    <footer className="mt-8 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
      <p className="mb-2">
        <span className="font-semibold text-foreground">SpaceShield</span> — Ultimate Space Traffic & Satellite Protection System
      </p>
      <p className="mb-4">
        Developed by{' '}
        <a 
          href="https://www.neetesh.tech" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 transition-colors font-medium cursor-pointer"
        >
          Neetesh Kumar
        </a>{' '}
        •{' '}
        <a 
          href="mailto:neeteshk1104@gmail.com" 
          className="hover:text-primary transition-colors ml-1"
        >
          neeteshk1104@gmail.com
        </a>{' '}
        •{' '}
        <a 
          href="https://github.com/neetesh1541" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-primary transition-colors ml-1"
        >
          GitHub
        </a>{' '}
        •{' '}
        <a 
          href="https://in.linkedin.com/in/neetesh-kumar-846616287" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-primary transition-colors ml-1"
        >
          LinkedIn
        </a>
      </p>
      
      {/* Theme Switcher */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="text-muted-foreground mr-2">Theme:</span>
        {themes.map((theme) => (
          <Button
            key={theme.name}
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme.name)}
            className={cn(
              'text-xs px-3 py-1 h-7 relative z-10',
              currentTheme === theme.name && 'bg-primary/20 text-primary border border-primary/30'
            )}
          >
            {theme.label}
          </Button>
        ))}
      </div>
    </footer>
  );
};
