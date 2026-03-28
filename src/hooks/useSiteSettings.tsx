import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteSettings {
  isOpenToWork: boolean;
  currentLocation: string;
  currentStatus: string;
  enableHeavy3D: boolean;
  enableEasterEggs: boolean;
  loaded: boolean;
}

const defaultSettings: SiteSettings = {
  isOpenToWork: true,
  currentLocation: 'Philadelphia, PA',
  currentStatus: 'Training ML Models',
  enableHeavy3D: true,
  enableEasterEggs: true,
  loaded: false,
};

const SiteSettingsContext = createContext<SiteSettings>(defaultSettings);

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('site_settings').select('key, value');
      if (data) {
        const next = { ...defaultSettings, loaded: true };
        data.forEach((row) => {
          if (row.key === 'is_open_to_work') next.isOpenToWork = row.value === 'true';
          if (row.key === 'current_location') next.currentLocation = row.value;
          if (row.key === 'current_status') next.currentStatus = row.value;
        });
        setSettings(next);
      } else {
        setSettings((s) => ({ ...s, loaded: true }));
      }
    };
    fetch();
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
