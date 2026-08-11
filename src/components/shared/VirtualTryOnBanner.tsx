"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { m } from "framer-motion";

export default function VirtualTryOnBanner() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative w-full max-w-6xl mx-auto rounded-[30px] overflow-hidden flex flex-col md:flex-row bg-gradient-to-r from-[#F9F6F0] to-[#F3EBE0]">
          
          {/* Text Content */}
          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center items-center text-center md:items-start md:text-start z-10">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-5xl font-black leading-[45px] mb-4 md:leading-[65px] text-gray-900">
                جربها في أي وقت<br />ومن أي مكان!
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-sm leading-relaxed">
                اختار شكل النظارة أو لون العدسات وإنت في مكانك مع خاصية التجربة الإفتراضية!
              </p>
              
              <Link 
                href="/shop" 
                className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:-translate-y-1 transition-all"
              >
               تسوق الان<ArrowLeft className="w-5 h-5" />
              </Link>
            </m.div>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-[400px]">
            <Image
              src="/jocelyn-morales-Mv7kokwzIMw-unsplash.jpg"
              alt="Virtual Try On"
              fill
              className="object-cover object-center"
            />
            {/* Gradient overlay to blend image edge smoothly into background on desktop */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#F9F6F0] hidden md:block"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#F3EBE0] via-transparent to-transparent md:hidden"></div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
