import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Bell, 
  Settings, 
  Menu,
  Rocket,
  Globe
} from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  return (
    <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">
                Space<span className="text-primary">Shield</span>
              </h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">
                Ultimate Space Protection System
              </p>
            </div>
          </div>
        </div>

        {/* Center Status */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Status:</span>
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              <span className="h-1.5 w-1.5 rounded-full bg-success mr-1.5 animate-pulse" />
              All Systems Operational
            </Badge>
          </div>
          
          <div className="h-8 w-px bg-border" />
          
          <div className="flex items-center gap-2 text-sm">
            <Rocket className="h-4 w-4 text-warning" />
            <span className="text-muted-foreground">Next Launch:</span>
            <span className="font-medium">SpaceX Starlink • 04:32:15</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="hidden sm:block ml-2 pl-2 border-l border-border">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-medium">Neetesh Kumar</p>
                <p className="text-[10px] text-muted-foreground">Mission Control</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                NK
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
