import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteSettings {
  isOpenToWork: boolean;
  currentLocation: string;
  currentStatus: string;
  enableHeavy3D: boolean;
  enableEasterEggs: boolean;
  primaryAccentColor: string;
  loaded: boolean;
}

const defaultSettings: SiteSettings = {
  isOpenToWork: true,
  currentLocation: 'Philadelphia, PA',
  currentStatus: 'Training ML Models',
  enableHeavy3D: true,
  enableEasterEggs: true,
  primaryAccentColor: '#7C3AED',
  loaded: false,
};

const SiteSettingsContext = createContext<SiteSettings>(defaultSettings);

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

function hexToHSL(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function applyAccentColor(hex: string) {
  const hsl = hexToHSL(hex);
  const root = document.documentElement;
  root.style.setProperty('--accent', hsl);
  root.style.setProperty('--ring', hsl);
  root.style.setProperty('--electric', hsl);
  root.style.setProperty('--sidebar-primary', hsl);
  root.style.setProperty('--sidebar-ring', hsl);
  root.style.setProperty('--electric-glow', `0 0 25px hsl(${hsl} / 0.4)`);
}

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('site_settings').select('key, value');
      if (data) {
        const next = { ...defaultSettings, loaded: true };
        data.forEach((row) => {
          if (row.key === 'is_open_to_work') next.isOpenToWork = row.value === 'true';
          if (row.key === 'current_location') next.currentLocation = row.value;
          if (row.key === 'current_status') next.currentStatus = row.value;
          if (row.key === 'enable_heavy_3d') next.enableHeavy3D = row.value === 'true';
          if (row.key === 'enable_easter_eggs') next.enableEasterEggs = row.value === 'true';
          if (row.key === 'primary_accent_color') next.primaryAccentColor = row.value;
        });
        setSettings(next);
      } else {
        setSettings((s) => ({ ...s, loaded: true }));
      }
    };
    fetchData();
  }, []);

  // Apply accent color to CSS variables whenever it changes
  useEffect(() => {
    if (settings.loaded && settings.primaryAccentColor) {
      applyAccentColor(settings.primaryAccentColor);
    }
  }, [settings.primaryAccentColor, settings.loaded]);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
