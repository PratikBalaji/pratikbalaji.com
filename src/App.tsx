import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ActiveSectionContext, useActiveSectionTracker } from "@/hooks/useActiveSection";
import { SiteSettingsProvider, useSiteSettings } from "@/hooks/useSiteSettings";

import NoiseOverlay from "@/components/NoiseOverlay";
import ChatAssistant from "@/components/sections/ChatAssistant";
import DarkSpaceBackground from "@/components/3d/DarkSpaceBackground";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

function CSSFallbackBackground() {
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--accent) / 0.15) 0%, hsl(var(--background)) 70%)',
      }}
    />
  );
}

function ConditionalBackground() {
  const { enableHeavy3D, loaded } = useSiteSettings();
  if (!loaded) return <CSSFallbackBackground />;
  return enableHeavy3D ? <DarkSpaceBackground /> : <CSSFallbackBackground />;
}

function ConditionalChatAssistant() {
  const { enableEasterEggs, loaded } = useSiteSettings();
  if (!loaded) return null;
  return enableEasterEggs ? <ChatAssistant /> : null;
}

function AppInner() {
  const activeSection = useActiveSectionTracker();

  return (
    <ActiveSectionContext.Provider value={activeSection}>
      <SiteSettingsProvider>
        <ConditionalBackground />
        <NoiseOverlay />
        <ConditionalChatAssistant />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SiteSettingsProvider>
    </ActiveSectionContext.Provider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <AppInner />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
