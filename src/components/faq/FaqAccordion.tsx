"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        return (
          <div
            key={index}
            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
              isActive ? "border-black shadow-md bg-white" : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }`}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between p-6 text-right focus:outline-none"
            >
              <span className={`font-bold text-lg transition-colors ${isActive ? "text-black" : "text-gray-700"}`}>
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: isActive ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? "bg-black text-white" : "bg-white text-gray-400 border border-gray-200"
                }`}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 mt-2">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
