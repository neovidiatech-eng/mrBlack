import api from "@/lib/axios";
import { SettingsResponse } from "@/types/settings";

export const settingsService = {
  getSettings: async () => {
    const response = await api.get<SettingsResponse>("/settings");
    return response.data;
  },
};
