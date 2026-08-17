
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { useHomeData } from "@/hooks/useHome";
import Link from "next/link";

interface Slide {
  id: string | number;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  bgImage: string;
  shoeImage: string;
  ctaText: string;
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data, isLoading, isError } = useHomeData();

  const banners = data?.data?.banners || [];

  const defaultSlides: Slide[] = [
    {
      id: "default-1",
      title: "MR.BLACK ROYAL COLLECTION",
      subtitle: "مجموعة فاخرة تناسب جميع الأذواق",
      description: "تسوق أحدث صيحات الأحذية الفاخرة والإكسسوارات بأعلى جودة وأفضل الأسعار.",
      tag: "إصدار النخبة الملكية",
      bgImage: "/logo.jpeg",
      shoeImage: "/logo.jpeg",
      ctaText: "تسوق الآن",
    },
  ];

  const slides: Slide[] = banners.length > 0
    ? banners.map((banner: any, index: number) => ({
        id: banner.id,
        title: banner.title,
        subtitle: "",
        description: banner.description,
        tag:
          index === 0
            ? "إصدار النخبة الملكية"
            : index === 1
              ? "إصدار محدود حصري"
              : "مجموعة مميزة",
        bgImage: banner.imageUrl,
        shoeImage: banner.imageUrl,
        ctaText: "تسوق الآن",
      }))
    : defaultSlides;

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (slides.length || 1));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % (slides.length || 1),
    );
  };

  // ---------- LOADING STATE ----------
  if (isLoading) {
    return (
      <div className="relative w-full h-[500px] md:h-[650px] bg-neutral-950 overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            <div className="absolute inset-0 rounded-full border-2 border-t-[#C21913] border-transparent animate-spin" />
          </div>
          <span className="text-[12px] font-medium text-neutral-400">
            جاري تحميل المجموعة...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full md:min-h-screen h-[650px]  bg-black overflow-hidden flex items-center justify-center">
      {/* Background Underlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-black/80 z-10" />

      {/* Editorial Vertical Rail */}
      <div className="vertical-rail select-none opacity-40 hidden xl:block text-neutral-400">
        مجموعة صيف 2026 الحصرية • MR.BLACK ROYAL EDITORIAL
      </div>

      {/* Editorial Dot Pattern */}
      <div className="dot-pattern top-28 right-12 hidden lg:grid">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="dot bg-neutral-700"></div>
        ))}
      </div>

      {/* Slide Images & Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full -mt-6"
        >
          {/* Main Editorial Background Image */}
          <div className="absolute inset-0 w-full h-full scale-105 filter blur-[4px] opacity-30">
            <img
              src={slides[currentSlide].bgImage}
              alt="bg"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div
            className="max-w-7xl mx-auto px-6  h-full grid grid-cols-1 lg:grid-cols-12 items-center gap-12 relative z-20 "
            dir="rtl"
          >
            {/* Left Column: Descriptive Content */}
            <div className="lg:col-span-7 text-right flex flex-col items-start justify-center">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C21913]/10 border border-[#C21913]/20 text-[#C21913] md:text-xs text-lg font-bold uppercase tracking-wider mb-6"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {slides[currentSlide].tag}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.15] mb-4"
              >
                {slides[currentSlide].title}
              </motion.h1>

              {slides[currentSlide].subtitle && (
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl md:text-2xl font-medium text-[#BABABA] mb-6"
                >
                  {slides[currentSlide].subtitle}
                </motion.h2>
              )}

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-[16px] md:text-base text-neutral-400 max-w-xl leading-relaxed mb-10"
              >
                {slides[currentSlide].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col sm:flex-row  px-10 md:px-0 items-center gap-4 w-full sm:w-auto"
              >
                <Link
                  href="/shop"
                  className="w-full sm:w-auto bg-[#C21913] hover:bg-white text-white hover:text-black px-10 md:py-5 py-3 rounded-full md:text-sm text-lg font-semibold transition-all duration-300 shadow-xl shadow-[#C21913]/20 hover:shadow-white/10 flex items-center justify-center gap-2 group"
                >
                  <span>{slides[currentSlide].ctaText || "تسوق الآن"}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 text-white px-8 md:py-5 py-3 rounded-full md:text-sm text-lg font-medium transition-colors text-center flex items-center justify-center"
                >
                  احصل على استشارة
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Floating Product Composition */}
            <div className="lg:col-span-5 h-full hidden lg:flex items-center justify-center relative">
              <div className="shoe-shadow-text select-none text-[150px] font-black text-neutral-700/10 pointer-events-none uppercase absolute z-0 rotate-[-8deg] scale-110 tracking-widest leading-none">
                {currentSlide === 0
                  ? "ROYAL"
                  : currentSlide === 1
                    ? "CARBON"
                    : "CLASSIC"}
              </div>

              <div className="absolute w-[380px] h-[380px] rounded-full bg-[#C21913]/5 filter blur-3xl" />
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 100,
                  delay: 0.4,
                }}
                className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900/30 backdrop-blur-xl group cursor-pointer z-10"
              >
                <div className="w-full h-full p-6 flex items-center justify-center relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-full h-full relative"
                  >
                    <Image
                      src={slides[currentSlide].shoeImage}
                      alt={slides[currentSlide].title}
                      fill
                      priority
                      className="object-contain filter brightness-105"
                    />
                  </motion.div>
                </div>

                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-[10px] text-[#BABABA] uppercase font-mono tracking-wider">
                  MR.BLACK LAB
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 hidden -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/10 bg-black/40 backdrop-blur-md hover:bg-[#C21913] hover:border-[#C21913] text-white md:flex items-center justify-center transition-all duration-300 cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 hidden -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/10 bg-black/40 backdrop-blur-md hover:bg-[#C21913] hover:border-[#C21913] text-white md:flex items-center justify-center transition-all duration-300 cursor-pointer"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-reverse space-x-3">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentSlide
                ? "w-8 h-2 bg-[#C21913]"
                : "w-2 h-2 bg-[#BABABA]/40 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
