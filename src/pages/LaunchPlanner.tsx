import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLaunchPlanner, LaunchPlanRequest } from '@/hooks/useLaunchPlanner';
import { 
  Rocket, 
  Target, 
  Gauge, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  ArrowRight,
  Fuel,
  Clock,
  Orbit
} from 'lucide-react';

const LAUNCH_SITES = [
  { value: 'kennedy', label: 'Kennedy Space Center, USA' },
  { value: 'vandenberg', label: 'Vandenberg SFB, USA' },
  { value: 'baikonur', label: 'Baikonur Cosmodrome, Kazakhstan' },
  { value: 'kourou', label: 'Guiana Space Centre, French Guiana' },
  { value: 'satish', label: 'Satish Dhawan, India' },
  { value: 'tanegashima', label: 'Tanegashima, Japan' },
  { value: 'jiuquan', label: 'Jiuquan, China' },
  { value: 'wenchang', label: 'Wenchang, China' },
  { value: 'starbase', label: 'Starbase, Texas' },
];

const LaunchPlanner = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { generatePlan, isPlanning, plan, reset } = useLaunchPlanner();
  
  const [formData, setFormData] = useState<LaunchPlanRequest>({
    missionName: '',
    satelliteName: '',
    targetOrbit: 'LEO',
    targetAltitude: 550,
    targetInclination: 53,
    launchSite: 'kennedy',
    payloadMass: 500,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generatePlan(formData);
  };

  const handleInputChange = (field: keyof LaunchPlanRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getEfficiencyColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-primary';
      case 'acceptable': return 'text-warning';
      default: return 'text-destructive';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-success/20 text-success border-success/30';
      case 'medium': return 'bg-warning/20 text-warning border-warning/30';
      default: return 'bg-destructive/20 text-destructive border-destructive/30';
    }
  };

  return (
    <div className="min-h-screen bg-background stars-bg">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              AI Launch Planner
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-powered satellite launch planning with collision avoidance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Launch Configuration Form */}
            <Card className="glass-panel border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-primary" />
                  Mission Configuration
                </CardTitle>
                <CardDescription>
                  Enter your satellite and mission parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="missionName">Mission Name</Label>
                      <Input
                        id="missionName"
                        placeholder="e.g., Starlink Group 6-1"
                        value={formData.missionName}
                        onChange={(e) => handleInputChange('missionName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="satelliteName">Satellite Name</Label>
                      <Input
                        id="satelliteName"
                        placeholder="e.g., Starlink-5001"
                        value={formData.satelliteName}
                        onChange={(e) => handleInputChange('satelliteName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="targetOrbit">Target Orbit</Label>
                      <Select
                        value={formData.targetOrbit}
                        onValueChange={(value) => handleInputChange('targetOrbit', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LEO">LEO (Low Earth Orbit)</SelectItem>
                          <SelectItem value="MEO">MEO (Medium Earth Orbit)</SelectItem>
                          <SelectItem value="GEO">GEO (Geostationary)</SelectItem>
                          <SelectItem value="HEO">HEO (Highly Elliptical)</SelectItem>
                          <SelectItem value="SSO">SSO (Sun-Synchronous)</SelectItem>
                          <SelectItem value="POLAR">Polar Orbit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="launchSite">Launch Site</Label>
                      <Select
                        value={formData.launchSite}
                        onValueChange={(value) => handleInputChange('launchSite', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LAUNCH_SITES.map((site) => (
                            <SelectItem key={site.value} value={site.value}>
                              {site.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="altitude">Altitude (km)</Label>
                      <Input
                        id="altitude"
                        type="number"
                        min={200}
                        max={50000}
                        value={formData.targetAltitude}
                        onChange={(e) => handleInputChange('targetAltitude', parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inclination">Inclination (°)</Label>
                      <Input
                        id="inclination"
                        type="number"
                        min={0}
                        max={180}
                        value={formData.targetInclination}
                        onChange={(e) => handleInputChange('targetInclination', parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mass">Payload (kg)</Label>
                      <Input
                        id="mass"
                        type="number"
                        min={1}
                        max={100000}
                        value={formData.payloadMass}
                        onChange={(e) => handleInputChange('payloadMass', parseInt(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full relative z-10" 
                    variant="glow"
                    disabled={isPlanning}
                  >
                    {isPlanning ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Launch Plan...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4 mr-2" />
                        Generate AI Launch Plan
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Launch Plan Results */}
            <Card className="glass-panel border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gauge className="h-5 w-5 text-primary" />
                  Launch Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!plan ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Orbit className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-sm">Configure your mission and generate an AI-powered launch plan</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {/* Launch Windows */}
                      {plan.optimal_launch_windows?.length > 0 && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                            <Calendar className="h-4 w-4 text-primary" />
                            Optimal Launch Windows
                          </h4>
                          <div className="space-y-2">
                            {plan.optimal_launch_windows.slice(0, 3).map((window, i) => (
                              <div key={i} className="flex items-center justify-between p-2 rounded bg-secondary/30">
                                <div>
                                  <p className="text-sm font-medium">{window.date}</p>
                                  <p className="text-xs text-muted-foreground">{window.time_utc} UTC • {window.window_duration_minutes} min window</p>
                                </div>
                                <Badge variant="outline" className="bg-primary/20 text-primary">
                                  {Math.round(window.confidence_score * 100)}% conf
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Trajectory */}
                      {plan.trajectory && (
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                            <ArrowRight className="h-4 w-4" />
                            Trajectory Profile
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 rounded bg-background/50">
                              <p className="text-muted-foreground">Max-Q Altitude</p>
                              <p className="font-medium">{plan.trajectory.max_q_altitude_km} km</p>
                            </div>
                            <div className="p-2 rounded bg-background/50">
                              <p className="text-muted-foreground">Stage 1 Sep</p>
                              <p className="font-medium">{plan.trajectory.stage1_separation_altitude_km} km</p>
                            </div>
                            <div className="p-2 rounded bg-background/50">
                              <p className="text-muted-foreground">Stage 2 Burn</p>
                              <p className="font-medium">{plan.trajectory.stage2_burn_duration_seconds}s</p>
                            </div>
                            <div className="p-2 rounded bg-background/50">
                              <p className="text-muted-foreground">Orbit Insert</p>
                              <p className="font-medium">{plan.trajectory.orbital_insertion_time_minutes} min</p>
                            </div>
                          </div>
                          {plan.trajectory.ascent_profile && (
                            <p className="text-xs text-muted-foreground mt-2">{plan.trajectory.ascent_profile}</p>
                          )}
                        </div>
                      )}

                      {/* Fuel Analysis */}
                      {plan.fuel_analysis && (
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                            <Fuel className="h-4 w-4" />
                            Fuel Analysis
                          </h4>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="p-2 rounded bg-background/50">
                              <p className="text-muted-foreground">Delta-V</p>
                              <p className="font-medium">{plan.fuel_analysis.estimated_delta_v_km_s} km/s</p>
                            </div>
                            <div className="p-2 rounded bg-background/50">
                              <p className="text-muted-foreground">Fuel Margin</p>
                              <p className="font-medium">{plan.fuel_analysis.fuel_margin_percent}%</p>
                            </div>
                            <div className="p-2 rounded bg-background/50">
                              <p className="text-muted-foreground">Efficiency</p>
                              <p className={`font-medium capitalize ${getEfficiencyColor(plan.fuel_analysis.efficiency_rating)}`}>
                                {plan.fuel_analysis.efficiency_rating}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Collision Avoidance */}
                      {plan.collision_avoidance && (
                        <div className={`p-3 rounded-lg border ${
                          plan.collision_avoidance.risk_level === 'high' ? 'bg-destructive/5 border-destructive/30' :
                          plan.collision_avoidance.risk_level === 'medium' ? 'bg-warning/5 border-warning/30' :
                          'bg-success/5 border-success/30'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Collision Avoidance
                            </h4>
                            <Badge variant="outline" className={getRiskColor(plan.collision_avoidance.risk_level)}>
                              {plan.collision_avoidance.risk_level} risk
                            </Badge>
                          </div>
                          {plan.collision_avoidance.conflicting_objects?.length > 0 && (
                            <p className="text-xs text-muted-foreground mb-2">
                              Potential conflicts: {plan.collision_avoidance.conflicting_objects.join(', ')}
                            </p>
                          )}
                          {plan.collision_avoidance.recommended_maneuvers?.length > 0 && (
                            <ul className="text-xs space-y-1">
                              {plan.collision_avoidance.recommended_maneuvers.map((m, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                                  {m}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}

                      {/* Recommendations */}
                      {plan.recommendations?.length > 0 && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <h4 className="text-sm font-medium mb-2">AI Recommendations</h4>
                          <ul className="text-xs space-y-1">
                            {plan.recommendations.map((rec, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 text-success mt-0.5 shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Summary */}
                      {plan.summary && (
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                          <p className="text-xs text-muted-foreground">{plan.summary}</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LaunchPlanner;