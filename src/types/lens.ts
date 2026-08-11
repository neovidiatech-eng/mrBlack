export interface Lens {
  id: string;
  name: string;
  description?: string;
  price: string | number;
  isActive: boolean;
  createdAt?: string;
}
