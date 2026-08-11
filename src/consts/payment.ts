import { PaymentMethod } from "@/types/order";

export interface PaymentAccountInfo {
  method: PaymentMethod;
  label: string;
  typeLabel: string;
  value: string;
  copyButtonText: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  iconName: string;
  payLink?: string;
}

export const PAYMENT_ACCOUNTS: Record<PaymentMethod, PaymentAccountInfo> = {
  INSTAPAY: {
    method: "INSTAPAY",
    label: "إنستا باي (InstaPay)",
    typeLabel: "عنوان IPA",
    value: "rabeaazhari@instapay",
    payLink: "https://ipn.eg/S/rabeaazhari/instapay/5jVaYD",
    copyButtonText: "نسخ IPA",
    color: "text-purple-700",
    bgColor: "bg-purple-50/70",
    borderColor: "border-purple-200",
    badgeBg: "bg-purple-600 text-white",
    iconName: "Zap",
  },
  VODAFONE_CASH: {
    method: "VODAFONE_CASH",
    label: "فودافون كاش",
    typeLabel: "رقم المحفظة",
    value: "01017141725",
    copyButtonText: "نسخ الرقم",
    color: "text-red-700",
    bgColor: "bg-red-50/70",
    borderColor: "border-red-200",
    badgeBg: "bg-red-600 text-white",
    iconName: "Smartphone",
  },
  ORANGE_CASH: {
    method: "ORANGE_CASH",
    label: "أورنج كاش",
    typeLabel: "رقم المحفظة",
    value: "01017141725",
    copyButtonText: "نسخ الرقم",
    color: "text-orange-700",
    bgColor: "bg-orange-50/70",
    borderColor: "border-orange-200",
    badgeBg: "bg-orange-500 text-white",
    iconName: "Smartphone",
  },
  ETISALAT_CASH: {
    method: "ETISALAT_CASH",
    label: "اتصالات كاش",
    typeLabel: "رقم المحفظة",
    value: "01017141725",
    copyButtonText: "نسخ الرقم",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50/70",
    borderColor: "border-emerald-200",
    badgeBg: "bg-emerald-600 text-white",
    iconName: "Smartphone",
  },
  WE_PAY: {
    method: "WE_PAY",
    label: "وي باي (WE Pay)",
    typeLabel: "رقم المحفظة",
    value: "01017141725",
    copyButtonText: "نسخ الرقم",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50/70",
    borderColor: "border-indigo-200",
    badgeBg: "bg-indigo-600 text-white",
    iconName: "Smartphone",
  },
};

export const PAYMENT_METHODS_LIST = Object.values(PAYMENT_ACCOUNTS);
