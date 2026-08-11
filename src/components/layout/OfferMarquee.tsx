"use client";

import { useHomeData } from "@/hooks/useHome";
import Link from "next/link";
import { useCurrencyStore } from "@/store/useCurrencyStore";

export default function OfferMarquee() {
  const { data: homeData, isLoading } = useHomeData();
  let offers = homeData?.data?.offers || [];
  const { currencySymbol } = useCurrencyStore();

  // Fallback to mock data for UI testing if no offers are returned from API
  if (offers.length === 0 && !isLoading) {
    offers = [
      {
        id: "mock-1",
        title: "خصم إضافي 10% على جميع الأحذية الشرقية - استخدم الكود: MRB10",
      } as any,
      {
        id: "mock-2",
        title: "توصيل مجاني لجميع مدن المملكة للطلبات فوق 500 ريال",
      } as any,
    ];
  }

  if (isLoading) return null;

  // We duplicate the offers to ensure there is enough content to scroll seamlessly.
  // The animation moves the container by exactly 50% of its width, creating a perfect loop.
  const duplicatedOffers = [...offers, ...offers, ...offers, ...offers];

  // We need exactly two identical blocks to make the 50% translation trick work seamlessly.
  const halfContent = duplicatedOffers;
  const fullContent = [...halfContent, ...halfContent];

  return (
    <div
      className="bg-[#000000] text-white py-2 overflow-hidden relative flex items-center h-10 w-full z-50 flex-nowrap"
      dir="ltr"
    >
      <style jsx>{`
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            /* Translate by exactly half of the element's width */
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div className="animate-marquee items-center">
        {fullContent.map((offer, idx) => (
          <Link
            key={`${offer.id}-${idx}`}
            href={offer.product ? `/product/${offer.product.slug}` : "/shop"}
            className="flex items-center gap-3 px-8 text-sm font-bold hover:text-[#c21913] transition-colors shrink-0"
            dir="rtl" // Keep the text reading direction RTL
          >
            <span>{offer.title}</span>
            {offer.product && offer.product.discountPrice && (
              <span className="bg-black/20 px-2 py-0.5 rounded-full text-xs border border-white/20">
                بسعر {offer.product.discountPrice} {currencySymbol} بدلاً من{" "}
                {offer.product.price} {currencySymbol}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
