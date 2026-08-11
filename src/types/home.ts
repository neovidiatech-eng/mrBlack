import { BannerItem } from "./banner";
import { Product, ProductCategory } from "./product";

export interface StaticPageInfo {
  id: string;
  title: string;
  slug: string;
}

export interface OfferProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  discountPrice: string | null;
}

export interface OfferItem {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  endDate: string;
  product?: OfferProduct;
}

export interface HomeData {
  banners: BannerItem[];
  categories: ProductCategory[];
  featuredProducts: Product[];
  newArrivals: Product[];
  offers: OfferItem[];
  staticPages: StaticPageInfo[];
}

export interface HomeResponse {
  success: boolean;
  data: HomeData;
  currencyCode?: string;
  currencySymbol?: string;
}
