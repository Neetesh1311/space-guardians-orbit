import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LaunchPlanner from "./pages/LaunchPlanner";
import SolarActivity from "./pages/SolarActivity";
import Satellites from "./pages/Satellites";
import SpaceDebris from "./pages/SpaceDebris";
import RocketLaunch from "./pages/RocketLaunch";
import SolarSystem from "./pages/SolarSystem";
import HelpDocs from "./pages/HelpDocs";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/launch-planner" element={<LaunchPlanner />} />
          <Route path="/solar-activity" element={<SolarActivity />} />
          <Route path="/satellites" element={<Satellites />} />
          <Route path="/space-debris" element={<SpaceDebris />} />
          <Route path="/rocket-launch" element={<RocketLaunch />} />
          <Route path="/solar-system" element={<SolarSystem />} />
          <Route path="/help-docs" element={<HelpDocs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
