// "use client";

// import { motion } from "framer-motion";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";
// import { useHomeData } from "@/hooks/useHome";

// const heroArabicShoe = "/images/luxury_sneaker_black_1784035395401.jpg";
// const traditionalHandcraftedShoe =
//   "/images/traditional_handcrafted_shoe_1784035408087.jpg";

// export default function SeasonCollection() {
//   const { data: homeData, isLoading } = useHomeData();
//   const categories = homeData?.data?.categories || [];
  
//   const firstCat = categories.length > 0 ? categories[0] : null;
//   const secondCat = categories.length > 1 ? categories[1] : null;

//   return (
//     <section className="py-24 bg-white" id="season_collection_section">
//       <div className="max-w-7xl mx-auto px-6">
//         {/* Section Header */}
//         <div className="text-right mb-16" dir="rtl">
//           <span className="text-xs font-bold uppercase tracking-widest text-[#C21913] mb-2 block font-mono">
//             حملات مستر بلاك المصورة / THE MAGAZINE EDITORIAL
//           </span>
//           <h2 className="text-3xl md:text-5xl font-black text-black leading-tight">
//             مجموعة الموسم
//           </h2>
//         </div>

//         {/* Magazine split-panel layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" dir="rtl">
//           {/* Main Campaign Panel (lg:col-span-8) */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true, margin: "-100px" }}
//             transition={{ duration: 0.8 }}
//             className="lg:col-span-8 relative h-[620px] rounded-[40px] overflow-hidden group shadow-lg"
//           >
//             <Link href={firstCat ? `/category/${firstCat.slug}` : "#"} className="absolute inset-0 z-0">
//               {/* Absolute background image */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
//               <img
//                 src={firstCat?.imageUrl || traditionalHandcraftedShoe}
//                 alt={firstCat?.name || "traditional leather shoe campaign"}
//                 className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
//                 referrerPolicy="no-referrer"
//               />

//               {/* Campaign details overlay */}
//               <div className="absolute inset-0 z-20 p-8 md:p-16 flex flex-col justify-end items-start text-right w-full">
//                 <span className="text-xs bg-[#C21913] text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-4 font-mono">
//                   صيف 2026 - الإصدار الخاص
//                 </span>
//                 <h3 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
//                   {firstCat ? firstCat.name : "تطريز الزري الذهبي يدوي الصنع"}
//                 </h3>
//                 <p className="text-sm text-neutral-300 max-w-xl mb-8 leading-relaxed">
//                   {firstCat ? `استكشف أحدث تشكيلة من قسم ${firstCat.name} وتمتع بالفخامة والتميز الحرفي.` : `كل خيط زري يروي حكاية من حكايات الفخامة والتميز الحرفي. مجموعة صُنعت بالكامل بجلود إيطالية حصرية لتليق بطلّتك في الأعياد والمناسبات الكبرى.`}
//                 </p>
//                 <div className="bg-white group-hover:bg-[#C21913] text-black group-hover:text-white px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer">
//                   <span>{firstCat ? `استكشف ${firstCat.name}` : "اكتشف كتالوج التطريز اليدوي"}</span>
//                   <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
//                 </div>
//               </div>
//             </Link>
//           </motion.div>

//           {/* Secondary Campaign Panel (lg:col-span-4) */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true, margin: "-100px" }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="lg:col-span-4 flex flex-col justify-between bg-black text-white rounded-[40px] p-8 md:p-12 relative overflow-hidden h-[620px] shadow-lg border border-white/5"
//           >
//             <Link href={secondCat ? `/category/${secondCat.slug}` : "#"} className="absolute inset-0 z-20 flex flex-col justify-between p-8 md:p-12 group">
//               {/* Absolute visual preview at top/center */}
//               <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[#C21913]/10 rounded-full filter blur-3xl -z-10" />
//               <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-6 bg-neutral-950 border border-white/10">
//                 <img
//                   src={secondCat?.imageUrl || heroArabicShoe}
//                   alt={secondCat?.name || "casual shoe collection"}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                   referrerPolicy="no-referrer"
//                 />
//               </div>

//               <div className="text-right mt-auto">
//                 <span className="text-[10px] font-bold text-[#C21913] tracking-widest font-mono uppercase block mb-1.5">
//                   الجلد الملمّع المعتق / APATINA LEATHER
//                 </span>
//                 <h4 className="text-2xl font-bold mb-3">
//                   {secondCat ? secondCat.name : "أحذية لوفر رجال الأعمال"}
//                 </h4>
//                 <p className="text-xs text-neutral-400 leading-relaxed mb-6">
//                   {secondCat ? `تشكيلة استثنائية من ${secondCat.name} تمنحك الأناقة العصرية والراحة طوال اليوم.` : `جلد عجل فاخر يتم صبغه وتلميعه يدوياً طبقة تلو الأخرى لإيجاد تباين لوني معتق (Apatina) غاية في الروعة، يعطيك هيبة الحضور وراحة اللوفر الطبيعي.`}
//                 </p>
//                 <div className="text-xs font-bold text-white group-hover:text-[#C21913] transition-colors flex items-center gap-1.5 cursor-pointer">
//                   <span>{secondCat ? `استكشف ${secondCat.name}` : "استكشف مجموعة اللوفر"}</span>
//                   <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
//                 </div>
//               </div>
//             </Link>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }



"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";



import { useCategories } from "@/hooks/useCategories";

export default function SeasonCollection() {
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];
  
  // Get latest 3 categories
  const latestCategories = categories.slice(-3).map(c => ({
    id: c.id,
    title: c.name,
    image: c.imageUrl || "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80",
    link: `/shop?category=${c.slug}`
  }));

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Set initial expanded item when data loads
  if (latestCategories.length > 0 && !expandedId) {
    setExpandedId(latestCategories[0].id);
  }

  if (latestCategories.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-black text-gray-900 mb-8">تشكيلة الموسم</h2>
        
        {/* Desktop: Accordion layout. Mobile: Stacked or Horizontal */}
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[500px]">
          
          {latestCategories.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <m.div
                key={item.id}
                layout
                onClick={() => setExpandedId(item.id)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer group shrink-0 transition-all duration-500 ease-in-out ${
                  isExpanded ? 'h-[300px] md:h-full md:flex-[2.5]' : 'h-[100px] md:h-full md:flex-[1]'
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={`object-cover transition-transform duration-700 ${isExpanded ? 'scale-100 group-hover:scale-105' : 'scale-110 opacity-80'}`}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity"></div>
                
                {/* Text Content */}
                <AnimatePresence mode="wait">
                  {isExpanded ? (
                    <m.div 
                      key={`expanded-${item.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white"
                    >
                      <h3 className="font-bold text-2xl md:text-3xl mb-4">{item.title}</h3>
                      <Link 
                        href={item.link}
                        className="w-fit px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-[#c21913] hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()} // Prevent triggering accordion when clicking link
                      >
                        تسوق التشكيلة
                      </Link>
                    </m.div>
                  ) : (
                    <m.div 
                      key={`collapsed-${item.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 p-6 flex items-center justify-center md:items-end md:justify-end text-white"
                    >
                      {/* On mobile (horizontal layout), show horizontal text. On desktop (vertical slice), show vertical text */}
                      <h3 
                        className="font-bold text-xl md:text-2xl tracking-widest hidden md:block"
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                      >
                        {item.title}
                      </h3>
                      <h3 className="font-bold text-xl block md:hidden">
                        {item.title}
                      </h3>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
