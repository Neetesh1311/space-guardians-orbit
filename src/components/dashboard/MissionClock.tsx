import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export const MissionClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timezone: string, label: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: timezone,
    };
    return {
      time: date.toLocaleTimeString('en-US', options),
      label,
    };
  };

  const timezones = [
    formatTime(time, 'UTC', 'UTC'),
    formatTime(time, 'America/New_York', 'EST'),
    formatTime(time, 'Europe/London', 'GMT'),
    formatTime(time, 'Asia/Kolkata', 'IST'),
  ];

  return (
    <Card variant="glass" className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Mission Time
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {timezones.map(({ time, label }) => (
            <div key={label} className="text-center">
              <div className="font-mono text-lg font-bold tracking-wider">
                {time}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase">
                {label}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Mission Day:</span>
            <span className="font-mono font-medium">
              {Math.floor((time.getTime() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
