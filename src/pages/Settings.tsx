import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Settings as SettingsIcon,
  Bell,
  Palette,
  Globe,
  Shield,
  Database,
} from 'lucide-react';
import { useTheme, themes, ThemeName } from '@/hooks/useTheme';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentTheme, setTheme } = useTheme();
  
  // Settings state
  const [notifications, setNotifications] = useState({
    collisionAlerts: true,
    solarWeather: true,
    missionUpdates: false,
    systemAlerts: true,
  });
  
  const [display, setDisplay] = useState({
    showDebris: true,
    showOrbits: true,
    showLabels: true,
    animationSpeed: 50,
    quality: 'high',
  });
  
  const [data, setData] = useState({
    autoRefresh: true,
    refreshInterval: '30',
    units: 'metric',
    timezone: 'IST',
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <SettingsIcon className="h-8 w-8 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground">
              Customize your SpaceShield experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Appearance
                </CardTitle>
                <CardDescription>Customize the visual appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {themes.map((theme) => (
                      <Button
                        key={theme.name}
                        variant={currentTheme === theme.name ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme(theme.name)}
                        className="justify-start"
                      >
                        {theme.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Animation Speed</Label>
                  <Slider
                    value={[display.animationSpeed]}
                    onValueChange={(value) => setDisplay({ ...display, animationSpeed: value[0] })}
                    max={100}
                    step={10}
                  />
                  <p className="text-xs text-muted-foreground text-right">{display.animationSpeed}%</p>
                </div>

                <div className="space-y-3">
                  <Label>Graphics Quality</Label>
                  <Select 
                    value={display.quality} 
                    onValueChange={(value) => setDisplay({ ...display, quality: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Better Performance)</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High (Better Quality)</SelectItem>
                      <SelectItem value="ultra">Ultra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>Configure alert preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Collision Alerts</Label>
                    <p className="text-xs text-muted-foreground">Get notified about potential collisions</p>
                  </div>
                  <Switch
                    checked={notifications.collisionAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, collisionAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Solar Weather</Label>
                    <p className="text-xs text-muted-foreground">Solar flare and CME warnings</p>
                  </div>
                  <Switch
                    checked={notifications.solarWeather}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, solarWeather: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mission Updates</Label>
                    <p className="text-xs text-muted-foreground">Launch and mission notifications</p>
                  </div>
                  <Switch
                    checked={notifications.missionUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, missionUpdates: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Alerts</Label>
                    <p className="text-xs text-muted-foreground">App updates and maintenance</p>
                  </div>
                  <Switch
                    checked={notifications.systemAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, systemAlerts: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Display Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Display Options
                </CardTitle>
                <CardDescription>Configure 3D visualization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Space Debris</Label>
                    <p className="text-xs text-muted-foreground">Display tracked debris objects</p>
                  </div>
                  <Switch
                    checked={display.showDebris}
                    onCheckedChange={(checked) => setDisplay({ ...display, showDebris: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Orbital Paths</Label>
                    <p className="text-xs text-muted-foreground">Display satellite orbit lines</p>
                  </div>
                  <Switch
                    checked={display.showOrbits}
                    onCheckedChange={(checked) => setDisplay({ ...display, showOrbits: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Labels</Label>
                    <p className="text-xs text-muted-foreground">Display satellite names</p>
                  </div>
                  <Switch
                    checked={display.showLabels}
                    onCheckedChange={(checked) => setDisplay({ ...display, showLabels: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data & Units */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Data & Units
                </CardTitle>
                <CardDescription>Configure data preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Refresh</Label>
                    <p className="text-xs text-muted-foreground">Automatically update data</p>
                  </div>
                  <Switch
                    checked={data.autoRefresh}
                    onCheckedChange={(checked) => setData({ ...data, autoRefresh: checked })}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Refresh Interval</Label>
                  <Select 
                    value={data.refreshInterval}
                    onValueChange={(value) => setData({ ...data, refreshInterval: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Units</Label>
                  <Select 
                    value={data.units}
                    onValueChange={(value) => setData({ ...data, units: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric (km, kg)</SelectItem>
                      <SelectItem value="imperial">Imperial (mi, lb)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Timezone</Label>
                  <Select 
                    value={data.timezone}
                    onValueChange={(value) => setData({ ...data, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IST">IST (India Standard Time)</SelectItem>
                      <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                      <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                      <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Account */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Account & Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/30 border border-border/50">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">Current Plan</h3>
                      <Badge>Free</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to Pro for AI predictions, advanced simulations, and priority support
                    </p>
                  </div>
                  <Button variant="glow">
                    Upgrade to Pro
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;
