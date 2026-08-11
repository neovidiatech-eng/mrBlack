"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useHomeData } from "@/hooks/useHome";
import { X } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
import { useCurrencyStore } from "@/store/useCurrencyStore";

const TimerBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center justify-center bg-white border border-gray-100 shadow-sm rounded-2xl w-16 h-16 md:w-[72px] md:h-[72px]">
    <span className="text-xl md:text-2xl font-black text-zinc-800">
      {value.toString().padStart(2, "0")}
    </span>
    <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
      {label}
    </span>
  </div>
);

export default function OfferPopup() {
  const { data: homeData, isLoading } = useHomeData();
  const offers = homeData?.data?.offers || [];
  const [isOpen, setIsOpen] = useState(false);
  const [activeOffer, setActiveOffer] = useState<any>(null);
  const { currencySymbol } = useCurrencyStore();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!isLoading && offers.length > 0) {
      const hasSeenPopup = sessionStorage.getItem("hasSeenOfferPopup");
      if (!hasSeenPopup) {
        setActiveOffer(offers[0]);
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, offers]);

  useEffect(() => {
    if (!activeOffer?.endDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      let end = new Date(activeOffer.endDate).getTime();

      if (isNaN(end) && typeof activeOffer.endDate === "string") {
        end = new Date(activeOffer.endDate.replace(" ", "T")).getTime();
      }

      if (isNaN(end)) {
        // Fallback to the exact date from the original JSON if the API date format is unparseable
        end = new Date("2026-10-31T19:00:00.000Z").getTime();
      }

      const distance = end - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft(); // Initial call
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [activeOffer]);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenOfferPopup", "true");
  };

  if (!activeOffer) return null;

  const product = activeOffer.product;
  const isWorldCup =
    activeOffer.title.includes("كاس العالم") ||
    activeOffer.title.includes("كأس العالم");

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          dir="rtl"
        >
          {/* Shadcn-style Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closePopup}
          />

          {/* Main Popup Container */}
          <m.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-[850px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[450px] md:min-h-[500px]"
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute left-4 top-4 z-50 bg-gray-100/80 text-gray-500 hover:text-black hover:bg-gray-200 rounded-full p-2 transition-all"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">إغلاق</span>
            </button>

            {/* Right Side (Image Area) - first child in DOM, so goes to right in RTL */}
            <div className="w-full bg-primary md:w-[48%] p-3 md:p-2 flex flex-col">
              <div className="relative w-full h-[280px] md:min-h-full rounded-[1.5rem] overflow-hidden bg-zinc-900 shadow-inner group flex-1">
                <Image
                  src={activeOffer.imageUrl}
                  alt={activeOffer.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />

                {/* Discount Badge */}
                <div className="absolute top-4 -right-7 bg-[#ff6b00] text-white px-6 ps-10 py-3 rounded-full font-black text-sm md:text-base shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform duration-300 z-10">
                  {product?.discountPrice 
                    ? `خصم ${Math.round(((Number(product.price) - Number(product.discountPrice)) / Number(product.price)) * 100)}%` 
                    : 'OFFER'}
                </div>

                {/* Bottom Overlay Details */}
                <div className="absolute bottom-0 right-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-right z-10">
                  <p className="text-[#ffb347] text-xs font-bold tracking-widest uppercase mb-1 drop-shadow-md">
                    Limited Edition
                  </p>
                  <p className="text-xl md:text-2xl font-serif italic text-white drop-shadow-md">
                    {product?.name || "Exclusive Offer"}
                  </p>
                </div>
              </div>
            </div>

            {/* Left Side (Text Area) - second child in DOM, so goes to left in RTL */}
            <div className="w-full md:w-[52%] p-6 md:px-10 md:py-8 flex flex-col justify-center">
              {/* Top Section */}
              <div className="text-center space-y-4 md:space-y-5">
                <div className="flex items-center justify-center gap-3 text-gray-400 text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase">
                  <span className="w-8 md:w-12 h-[2px] bg-gray-100 rounded-full"></span>
                  {isWorldCup
                    ? "WORLD CUP SPECIAL EDITION"
                    : "SPECIAL EXCLUSIVE OFFER"}
                  <span className="w-8 md:w-12 h-[2px] bg-gray-100 rounded-full"></span>
                </div>

                <h2 className="text-3xl md:text-[2.75rem] font-black text-zinc-900 leading-[1.15]">
                  {isWorldCup ? (
                    <>
                      خصم بمناسبة <br />
                      <span className="text-[#ff6b00] drop-shadow-sm">
                        كأس العالم
                      </span>{" "}
                      <span className="inline-block transform hover:scale-110 transition-transform cursor-default">
                        😎😍😍
                      </span>
                    </>
                  ) : (
                    activeOffer.title
                  )}
                </h2>

                <p className="text-gray-500 text-sm leading-relaxed px-2">
                  {activeOffer.subtitle ||
                    "احتفل بانتصارات كأس العالم مع أزهى باقات الزهور الفاخرة وأضف لمسة ملكية لمناسباتك."}
                </p>
              </div>

              {product && (
                <>
                  {/* Price Section */}
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <div className="flex justify-between items-center mb-4 px-2">
                      <div className="text-right flex-1 border-b border-gray-100 pb-2 mr-4">
                        <p className="font-bold text-lg text-zinc-800">
                          {product.name}
                        </p>
                      </div>
                      <div className="text-left flex flex-col items-end">
                        {product.discountPrice ? (
                          <>
                            <p className="text-gray-400 line-through text-xs md:text-sm mb-0.5">
                              {currencySymbol} {product.price}
                            </p>
                            <p className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
                              {currencySymbol} {product.discountPrice}
                            </p>
                          </>
                        ) : (
                          <p className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
                            {currencySymbol} {product.price}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="mt-2 md:mt-4">
                    <p className="text-center text-[10px] md:text-[11px] text-gray-400 tracking-[0.2em] uppercase mb-3">
                      Ending In
                    </p>
                    <div
                      className="flex justify-center gap-3 md:gap-4"
                      dir="ltr"
                    >
                      <TimerBox value={timeLeft.days} label="Days" />
                      <TimerBox value={timeLeft.hours} label="Hours" />
                      <TimerBox value={timeLeft.minutes} label="Mins" />
                      <TimerBox value={timeLeft.seconds} label="Secs" />
                    </div>
                  </div>

                  {/* Button */}
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={closePopup}
                    className="mt-8 w-full bg-zinc-900 hover:bg-black text-white rounded-xl py-4 flex items-center justify-center gap-3 font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/10 group"
                  >
                    <span className="text-lg md:text-xl">تسوق الان</span>
                    <span className="text-xl group-hover:-translate-x-1 transition-transform">
                      🛍️
                    </span>
                  </Link>
                </>
              )}
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
