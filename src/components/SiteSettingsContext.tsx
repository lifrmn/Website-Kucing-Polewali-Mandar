'use client';

import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

import {
  defaultSiteSettings,
  type SiteSettings,
} from '@/lib/validations/settings';

const SiteSettingsContext = createContext<SiteSettings>(defaultSiteSettings);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaultSiteSettings);

  useEffect(() => {
    let canceled = false;
    fetch('/api/settings')
      .then((response) => response.json())
      .then((result) => {
        if (!canceled && result.success) setSettings(result.data);
      })
      .catch(() => undefined);
    return () => {
      canceled = true;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}