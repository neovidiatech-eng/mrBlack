export interface PageItem {
  slug: string;
  content: string;
  updatedAt: string;
}

export interface PagesResponse {
  success: boolean;
  data: PageItem[];
}

export interface SinglePageResponse {
  success: boolean;
  data: PageItem;
}
