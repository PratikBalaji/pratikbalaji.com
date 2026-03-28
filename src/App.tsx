import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ActiveSectionContext, useActiveSectionTracker } from "@/hooks/useActiveSection";
import { SiteSettingsProvider } from "@/hooks/useSiteSettings";

import NoiseOverlay from "@/components/NoiseOverlay";
import ChatAssistant from "@/components/sections/ChatAssistant";
import DarkSpaceBackground from "@/components/3d/DarkSpaceBackground";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

function AppInner() {
  const activeSection = useActiveSectionTracker();

  return (
    <ActiveSectionContext.Provider value={activeSection}>
      <DarkSpaceBackground />
      <NoiseOverlay />
      <ChatAssistant />
      <Toaster />
      <Sonner />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
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
