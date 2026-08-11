"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import CategoryPillsSlider from "@/components/shared/CategoryPillsSlider";
import VirtualTryOnBanner from "@/components/shared/VirtualTryOnBanner";
// import BestSellers from "@/components/shared/BestSellers";
import NewArrivals from "@/components/home/NewArrivals";
import OfferPopup from "@/components/home/OfferPopup";
import SeasonCollection from "@/components/shared/SeasonCollection";
import RecentlyViewed from "@/components/shared/RecentlyViewed";
import ProductCard from "@/components/shared/ProductCard";
import HeroSlider from "@/components/home/HeroSlider";
import FeaturedProducts from "@/components/shared/FeaturedProducts";

export default function Home() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="flex flex-col min-h-screen">
        {/* 1. Hero Section (Image Carousel) */}
        <section className="relative w-full pb-8">
          <HeroSlider />
        </section>

        {/* 2. Shop by Category / Curated Picks */}
        <CategoryPillsSlider />

        {/* 3. Virtual Try On Promo */}
        {/* <VirtualTryOnBanner /> */}

        {/* 3.5 Featured Products */}
        <FeaturedProducts />

        {/* 4. Best Sellers (Horizontal Carousel) - OLD */}
        {/* <BestSellers /> */}

        {/* 5. Season Collection */}
        <SeasonCollection />
        {/* 4. New Arrivals */}
        <NewArrivals />

        {/* 4.5 Offers */}
        <OfferPopup />

        {/* 6. Recently Viewed (Client Side) */}
        <RecentlyViewed />
      </div>
    </LazyMotion>
  );
}
