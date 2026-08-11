export type PaymentMethod =
  | "INSTAPAY"
  | "VODAFONE_CASH"
  | "ORANGE_CASH"
  | "ETISALAT_CASH"
  | "WE_PAY";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_lab"
  | "processing"
  | "ready"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  paymentMethod: PaymentMethod;
  senderPhone: string;
  transferProofUrl: string;
  items?: CreateOrderItemPayload[];
  notes?: string;
  couponCode?: string;
  prescriptionFile?: File;
}

export interface UploadReceiptResponseData {
  url: string;
  publicId: string;
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  quantity: number;
  unitPrice?: number;
  price?: string | number;
  snapshot?: any;
}

export interface OrderResponseData {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  paymentMethod: PaymentMethod;
  senderPhone: string;
  transferProofUrl: string;
  notes?: string | null;
  status: OrderStatus | string;
  originalSubtotal?: number;
  discountAmount?: number;
  totalAmount: number | string;
  currency?: string;
  exchangeRate?: number;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: {
    productId: string;
    productName?: string;
    quantity: number;
    price: number;
    snapshot?: any;
  }[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface OrderHistoryResponse {
  success: boolean;
  data: OrderHistoryItem[];
  pagination: PaginationMeta;
}

