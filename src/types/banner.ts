export interface BannerItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
  expiresAt: string | null;
}

export interface BannerResponse {
  success: boolean;
  data: BannerItem[];
}
