-- Create enum for satellite orbit types
CREATE TYPE public.orbit_type AS ENUM ('LEO', 'MEO', 'GEO', 'HEO', 'SSO', 'POLAR');

-- Create enum for risk levels
CREATE TYPE public.risk_level AS ENUM ('safe', 'warning', 'critical');

-- Create enum for alert types
CREATE TYPE public.alert_type AS ENUM ('collision', 'debris', 'solar', 'launch', 'system');

-- Create enum for launch status
CREATE TYPE public.launch_status AS ENUM ('planning', 'scheduled', 'launched', 'completed', 'aborted');

-- Satellites table - stores all satellite data
CREATE TABLE public.satellites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    norad_id TEXT UNIQUE,
    name TEXT NOT NULL,
    country TEXT,
    orbit_type orbit_type NOT NULL DEFAULT 'LEO',
    altitude NUMERIC NOT NULL,
    inclination NUMERIC NOT NULL,
    velocity NUMERIC NOT NULL,
    risk_level risk_level NOT NULL DEFAULT 'safe',
    position_x NUMERIC NOT NULL DEFAULT 0,
    position_y NUMERIC NOT NULL DEFAULT 0,
    position_z NUMERIC NOT NULL DEFAULT 0,
    tle_line1 TEXT,
    tle_line2 TEXT,
    launch_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Space debris table
CREATE TABLE public.space_debris (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    size TEXT CHECK (size IN ('small', 'medium', 'large')),
    altitude NUMERIC NOT NULL,
    velocity NUMERIC NOT NULL,
    position_x NUMERIC NOT NULL DEFAULT 0,
    position_y NUMERIC NOT NULL DEFAULT 0,
    position_z NUMERIC NOT NULL DEFAULT 0,
    origin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Collision predictions table - AI-powered predictions
CREATE TABLE public.collision_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    object1_type TEXT NOT NULL,
    object1_id UUID NOT NULL,
    object1_name TEXT NOT NULL,
    object2_type TEXT NOT NULL,
    object2_id UUID NOT NULL,
    object2_name TEXT NOT NULL,
    probability NUMERIC NOT NULL CHECK (probability >= 0 AND probability <= 1),
    time_to_closest_approach NUMERIC NOT NULL,
    minimum_distance NUMERIC NOT NULL,
    risk_level risk_level NOT NULL,
    ai_analysis TEXT,
    recommended_action TEXT,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Launch plans table
CREATE TABLE public.launch_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_name TEXT NOT NULL,
    satellite_name TEXT NOT NULL,
    target_orbit orbit_type NOT NULL,
    target_altitude NUMERIC NOT NULL,
    target_inclination NUMERIC NOT NULL,
    launch_site TEXT NOT NULL,
    launch_window_start TIMESTAMP WITH TIME ZONE,
    launch_window_end TIMESTAMP WITH TIME ZONE,
    rocket_type TEXT,
    payload_mass NUMERIC,
    status launch_status DEFAULT 'planning',
    trajectory_data JSONB,
    ai_recommendations TEXT,
    collision_risk_assessment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Solar weather table
CREATE TABLE public.solar_weather (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    event_id TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    intensity TEXT,
    source_location TEXT,
    linked_events JSONB,
    impact_assessment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- System alerts table
CREATE TABLE public.system_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type alert_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity risk_level NOT NULL,
    related_object_id UUID,
    related_object_type TEXT,
    is_read BOOLEAN DEFAULT false,
    is_dismissed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.satellites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.space_debris ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collision_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launch_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solar_weather ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;

-- Public read policies (space data should be publicly accessible)
CREATE POLICY "Allow public read on satellites" ON public.satellites FOR SELECT USING (true);
CREATE POLICY "Allow public read on space_debris" ON public.space_debris FOR SELECT USING (true);
CREATE POLICY "Allow public read on collision_predictions" ON public.collision_predictions FOR SELECT USING (true);
CREATE POLICY "Allow public read on launch_plans" ON public.launch_plans FOR SELECT USING (true);
CREATE POLICY "Allow public read on solar_weather" ON public.solar_weather FOR SELECT USING (true);
CREATE POLICY "Allow public read on system_alerts" ON public.system_alerts FOR SELECT USING (true);

-- Public insert policies for system operations
CREATE POLICY "Allow public insert on satellites" ON public.satellites FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on space_debris" ON public.space_debris FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on collision_predictions" ON public.collision_predictions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on launch_plans" ON public.launch_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on solar_weather" ON public.solar_weather FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on system_alerts" ON public.system_alerts FOR INSERT WITH CHECK (true);

-- Public update policies
CREATE POLICY "Allow public update on satellites" ON public.satellites FOR UPDATE USING (true);
CREATE POLICY "Allow public update on collision_predictions" ON public.collision_predictions FOR UPDATE USING (true);
CREATE POLICY "Allow public update on launch_plans" ON public.launch_plans FOR UPDATE USING (true);
CREATE POLICY "Allow public update on system_alerts" ON public.system_alerts FOR UPDATE USING (true);

-- Create indexes for performance
CREATE INDEX idx_satellites_orbit_type ON public.satellites(orbit_type);
CREATE INDEX idx_satellites_risk_level ON public.satellites(risk_level);
CREATE INDEX idx_collision_predictions_risk ON public.collision_predictions(risk_level);
CREATE INDEX idx_collision_predictions_resolved ON public.collision_predictions(is_resolved);
CREATE INDEX idx_launch_plans_status ON public.launch_plans(status);
CREATE INDEX idx_system_alerts_type ON public.system_alerts(alert_type);
CREATE INDEX idx_system_alerts_dismissed ON public.system_alerts(is_dismissed);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.satellites;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collision_predictions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.solar_weather;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_satellites_updated_at BEFORE UPDATE ON public.satellites FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_collision_predictions_updated_at BEFORE UPDATE ON public.collision_predictions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_launch_plans_updated_at BEFORE UPDATE ON public.launch_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();