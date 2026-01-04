import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Collision Risk Detected',
    message: 'ISS and debris fragment approach within 2km',
    timestamp: '2 min ago',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Close Approach Alert',
    message: 'Asteroid 2024 YR4 passing within lunar distance',
    timestamp: '15 min ago',
  },
  {
    id: '3',
    type: 'info',
    title: 'Orbit Adjustment',
    message: 'Starlink-1234 completed maneuver successfully',
    timestamp: '1 hour ago',
  },
  {
    id: '4',
    type: 'warning',
    title: 'Solar Activity',
    message: 'CME detected, potential communication impact',
    timestamp: '3 hours ago',
  },
];

const AlertItem = ({ alert }: { alert: Alert }) => {
  const styles = {
    critical: {
      bg: 'bg-destructive/10 border-destructive/30',
      icon: XCircle,
      iconColor: 'text-destructive',
    },
    warning: {
      bg: 'bg-warning/10 border-warning/30',
      icon: AlertTriangle,
      iconColor: 'text-warning',
    },
    info: {
      bg: 'bg-primary/10 border-primary/30',
      icon: CheckCircle,
      iconColor: 'text-primary',
    },
  };

  const { bg, icon: Icon, iconColor } = styles[alert.type];

  return (
    <div
      className={cn(
        'p-3 rounded-lg border transition-all duration-200 hover:translate-x-1 cursor-pointer group',
        bg
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('mt-0.5', iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-sm truncate">{alert.title}</h4>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {alert.message}
          </p>
          <p className="text-[10px] text-muted-foreground/70 mt-1">
            {alert.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};

export const AlertsPanel = () => {
  const criticalCount = mockAlerts.filter(a => a.type === 'critical').length;
  const warningCount = mockAlerts.filter(a => a.type === 'warning').length;

  return (
    <Card variant="glass" className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Active Alerts
            {criticalCount > 0 && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
              </span>
            )}
          </CardTitle>
          <div className="flex gap-1.5">
            {criticalCount > 0 && (
              <Badge variant="outline" className="border-destructive/50 text-destructive text-xs px-1.5">
                {criticalCount}
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="outline" className="border-warning/50 text-warning text-xs px-1.5">
                {warningCount}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 pt-0 space-y-2">
        {mockAlerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
        
        <Button variant="ghost" size="sm" className="w-full mt-3 text-muted-foreground hover:text-foreground">
          View All Alerts
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};
