-- Drop overly permissive public write policies (keep public SELECT for dashboard)

-- satellites
DROP POLICY IF EXISTS "Allow public insert on satellites" ON public.satellites;
DROP POLICY IF EXISTS "Allow public update on satellites" ON public.satellites;

-- space_debris
DROP POLICY IF EXISTS "Allow public insert on space_debris" ON public.space_debris;

-- solar_weather
DROP POLICY IF EXISTS "Allow public insert on solar_weather" ON public.solar_weather;

-- system_alerts
DROP POLICY IF EXISTS "Allow public insert on system_alerts" ON public.system_alerts;
DROP POLICY IF EXISTS "Allow public update on system_alerts" ON public.system_alerts;

-- collision_predictions
DROP POLICY IF EXISTS "Allow public insert on collision_predictions" ON public.collision_predictions;
DROP POLICY IF EXISTS "Allow public update on collision_predictions" ON public.collision_predictions;

-- launch_plans
DROP POLICY IF EXISTS "Allow public insert on launch_plans" ON public.launch_plans;
DROP POLICY IF EXISTS "Allow public update on launch_plans" ON public.launch_plans;

-- Harden function search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;