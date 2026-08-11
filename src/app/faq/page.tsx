"use client";

import { usePage } from "@/hooks/usePages";
import FaqAccordion from "@/components/faq/FaqAccordion";
import { HelpCircle } from "lucide-react";

export default function FaqPage() {
  const { page, isLoading, error } = usePage("faq");

  let parsedFaqs = [];
  if (page && page.content) {
    try {
      parsedFaqs = JSON.parse(page.content);
    } catch (e) {
      console.error("Failed to parse FAQ content", e);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 py-20 px-4 border-b border-gray-100">
        <div className="container mx-auto text-center max-w-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white mb-6 shadow-xl">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-gray-900">
            الأسئلة الشائعة
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            جمعنا لك الإجابات على أكثر الأسئلة شيوعاً لتسهيل تجربتك في أوبتيكال. إذا لم تجد ما تبحث عنه، فريق الدعم دائماً في خدمتك.
          </p>
        </div>
      </div>

      {/* Accordion Section */}
      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-50 p-4 rounded-xl max-w-2xl mx-auto">
            عذراً، لم نتمكن من تحميل الأسئلة الشائعة. يرجى المحاولة لاحقاً.
          </div>
        ) : parsedFaqs.length > 0 ? (
          <FaqAccordion items={parsedFaqs} />
        ) : (
          <div className="text-center text-gray-500 py-10">
            لا توجد أسئلة شائعة مضافة حالياً.
          </div>
        )}
      </div>
    </div>
  );
}
