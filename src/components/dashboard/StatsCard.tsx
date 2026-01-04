import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'glow' | 'warning' | 'critical' | 'success';
}

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}: StatsCardProps) => {
  const iconColorClass = {
    default: 'text-primary',
    glow: 'text-primary',
    warning: 'text-warning',
    critical: 'text-destructive',
    success: 'text-success',
  };

  const cardVariant = variant === 'default' ? 'glass' : variant === 'success' ? 'glow' : variant;

  return (
    <Card variant={cardVariant as any} className="group hover:scale-[1.02] transition-transform duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <p
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          <div
            className={cn(
              'p-3 rounded-xl bg-secondary/50 group-hover:scale-110 transition-transform duration-300',
              iconColorClass[variant]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
