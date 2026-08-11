export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
  isThumbnail: boolean;
  sortOrder: number;
  productId: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  sortOrder: number;
  parentId: string | null;
}

export interface Category extends ProductCategory {
  children?: Category[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  descShort: string;
  descLong: string;
  price: string;
  discountPrice: string | null;
  brand: string;
  gender: string;
  lensType: string;
  frameMaterial: string;
  color: string;
  size: string;
  stockQty: number;
  status?: string;
  isAvailable: boolean;
  isDraft: boolean;
  isFeatured?: boolean;
  featuredNote?: string | null;
  averageRating?: number | string | null;
  reviewsCount?: number;
  categoryId: string;
  subCategoryId: string | null;
  relatedIds: string[];
  createdAt: string;
  images: ProductImage[];
  category: ProductCategory;
  pricingMode?: string;
  variants?: any[];
  productAttributes?: any[];
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  items: T[];
  pagination: Pagination;
  currencyCode?: string;
  currencySymbol?: string;
}

export interface SingleProductData {
  product: Product;
  relatedProducts?: Product[];
}
