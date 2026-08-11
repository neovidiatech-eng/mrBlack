export interface SettingItem {
  key: string;
  value: string;
}

export interface SettingsResponse {
  success: boolean;
  data: SettingItem[];
}
