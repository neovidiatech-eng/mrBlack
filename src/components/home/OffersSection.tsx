"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useHomeData } from "@/hooks/useHome";
import { Timer, ArrowLeft, Tag } from "lucide-react";
import { useCurrencyStore } from "@/store/useCurrencyStore";

const CountdownTimer = ({ endDate }: { endDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center gap-2 md:gap-4 mt-6">
      <div className="flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-white shadow-lg">
        <span className="text-sm md:text-xl font-bold">{timeLeft.days}</span>
        <span className="text-[10px] md:text-xs">يوم</span>
      </div>
      <span className="text-white font-bold text-xl">:</span>
      <div className="flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-white shadow-lg">
        <span className="text-sm md:text-xl font-bold">{timeLeft.hours}</span>
        <span className="text-[10px] md:text-xs">ساعة</span>
      </div>
      <span className="text-white font-bold text-xl">:</span>
      <div className="flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-white shadow-lg">
        <span className="text-sm md:text-xl font-bold">{timeLeft.minutes}</span>
        <span className="text-[10px] md:text-xs">دقيقة</span>
      </div>
      <span className="text-white font-bold text-xl">:</span>
      <div className="flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-white shadow-lg">
        <span className="text-sm md:text-xl font-bold">{timeLeft.seconds}</span>
        <span className="text-[10px] md:text-xs">ثانية</span>
      </div>
    </div>
  );
};

export default function OffersSection() {
  const { data: homeData, isLoading } = useHomeData();
  const offers = homeData?.data?.offers || [];
  const { currencySymbol } = useCurrencyStore();

  if (isLoading || offers.length === 0) return null;

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <Tag className="w-8 h-8 text-accent" />
          <h2 className="text-3xl font-black text-gray-900">عروض حصرية</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="relative w-full h-[400px] md:h-[450px] rounded-[32px] overflow-hidden group shadow-xl"
            >
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white">
                <div className="flex items-center gap-2 mb-4 bg-red-600 w-fit px-4 py-1.5 rounded-full text-sm font-bold tracking-wider animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                  <Timer className="w-4 h-4" />
                  ينتهي قريباً
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black mb-2">{offer.title}</h3>
                {offer.subtitle && (
                  <p className="text-lg md:text-xl text-gray-200 mb-6">{offer.subtitle}</p>
                )}

                {offer.product && (
                  <div className="flex items-end gap-4 mb-6">
                    <span className="text-4xl font-black text-white drop-shadow-md">
                      {offer.product.discountPrice || offer.product.price} {currencySymbol}
                    </span>
                    {offer.product.discountPrice && (
                      <span className="text-xl text-gray-400 line-through mb-1">
                        {offer.product.price} {currencySymbol}
                      </span>
                    )}
                  </div>
                )}

                <CountdownTimer endDate={offer.endDate} />

                {offer.product && (
                  <Link
                    href={`/product/${offer.product.id}`}
                    className="absolute bottom-8 left-8 bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-accent hover:text-white transition-colors"
                  >
                    عرض المنتج
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
