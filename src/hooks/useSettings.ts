import { useState, useEffect } from "react";
import { settingsService } from "@/services/settings.service";
import { SettingItem } from "@/types/settings";

export function useSettings() {
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await settingsService.getSettings();
        if (isMounted && response.success) {
          setSettings(response.data);
          setError(null);
        } else if (isMounted) {
          setError("Failed to fetch settings.");
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "An error occurred while fetching settings.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper function to easily grab a specific setting value by key
  const getSettingValue = (key: string) => {
    const setting = settings.find((s) => s.key === key);
    return setting ? setting.value : null;
  };

  return { settings, getSettingValue, isLoading, error };
}
