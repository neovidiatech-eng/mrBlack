import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import QueryProvider from "@/components/providers/QueryProvider";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  variable: "--font-plex",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://mrblack-eg.com"),
  title: {
    default: "MR.BLACK - متجر الأحذية الفاخرة والعصرية",
    template: "%s | MR.BLACK",
  },
  description:
    "تسوق أفضل وأحدث تشكيلات الأحذية الرجالية والنسائية والرياضية والرسمية بأفضل الأسعار وأعلى جودة من MR.BLACK.",
  keywords: [
    "أحذية",
    "أحذية رجالي",
    "أحذية حريمي",
    "كوتشيات",
    "أحذية رسمية",
    "أحذية رياضية",
    "سنيكرز",
    "مستر بلاك",
    "MR.BLACK",
    "shoes",
    "sneakers",
    "footwear",
  ],
  authors: [{ name: "MR.BLACK" }],
  creator: "MR.BLACK",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://mrblack-eg.com",
    title: "MR.BLACK - متجر الأحذية الفاخرة والعصرية",
    description:
      "تسوق أفضل وأحدث تشكيلات الأحذية الرجالية والنسائية والرياضية بأفضل الأسعار وأعلى جودة من MR.BLACK.",
    siteName: "MR.BLACK",
    images: [
      {
        url: "/logo.jpeg",
        width: 800,
        height: 600,
        alt: "MR.BLACK Shoes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MR.BLACK - متجر الأحذية الفاخرة والعصرية",
    description:
      "تسوق أفضل وأحدث تشكيلات الأحذية الرجالية والنسائية والرياضية بأفضل الأسعار وأعلى جودة من MR.BLACK.",
    images: ["/logo.jpeg"],
  },
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${plex.variable}  font-sans antialiased text-gray-900 bg-white flex flex-col min-h-screen overflow-x-hidden`}
      >
        <QueryProvider>
          <Suspense fallback={<div className="h-16" />}>
            <Header />
          </Suspense>
          <main className="flex-grow pb-16 lg:pb-0">{children}</main>
          <MobileNav />
          <Footer />
          <WhatsAppButton />
          <ToastContainer position="top-right" rtl />
        </QueryProvider>
      </body>
    </html>
  );
}
