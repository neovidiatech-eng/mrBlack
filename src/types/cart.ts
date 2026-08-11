export interface CartProduct {
  id: string;
  name: string;
  price: string;
  discountPrice?: string | null;
  images: { url: string }[];
  isAvailable: boolean;
  stockQty: number;
}

export interface CartItem {
  id: string;
  lensId?: string | null;
  lensMaterialId?: string | null;
  quantity: number;
  product: CartProduct;
  variant?: any;
  lens?: {
    id: string;
    name: string;
    price: string | number;
  };
  lensMaterial?: {
    id: string;
    name: string;
    price: string | number;
  };
  prescription?: {
    rightEye?: {
      groupId?: string;
      groupName?: string;
      price?: string | number;
      sph?: number;
      cyl?: number;
      axis?: number;
      add?: number;
    };
    leftEye?: {
      groupId?: string;
      groupName?: string;
      price?: string | number;
      sph?: number;
      cyl?: number;
      axis?: number;
      add?: number;
    };
    notes?: string;
    prescriptionImage?: string;
  };
  price?: string | number;
  total?: string | number;
  lensPrice?: string | number;
  totalPrice?: string | null;
  subtotal?: string | null;
}

export interface CartDiscount {
  type: string;
  value: number;
  amount: number;
  source: string;
  title: string;
  couponCode?: string;
  couponId?: string;
}

export interface CartData {
  id: string;
  items: CartItem[];
  subtotal?: string | number | null;
  discount?: CartDiscount | null;
  finalTotal?: string | number | null;
  totalAmount?: string | number | null;
  total?: string | number | null;
}
