"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrencies } from "@/hooks/useCurrencies";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { ChevronDown, Globe } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function CurrencySelector() {
  const { data: currenciesData, isLoading } = useCurrencies();
  const currencies = currenciesData?.data || [];
  const { currencyCode, setCurrency } = useCurrencyStore();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading || currencies.length === 0) return null;

  // Find the currently selected currency, or default to the base currency
  const activeCurrency =
    currencies.find((c) => c.code === currencyCode) ||
    currencies.find((c) => c.isBase) ||
    currencies[0];

  const handleSelect = (code: string, symbol: string) => {
    setCurrency(code, symbol);
    setIsOpen(false);

    // Invalidate all queries to refetch products, cart, etc. with the new currency
    queryClient.invalidateQueries();

    // A slight delay then reload to guarantee SSR components (if any) also refresh
    // Not strictly needed if everything is client-fetched, but safe for e-commerce.
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-2 text-sm font-medium text-white transition-colors "
      >
        <Globe className="w-4 h-4" />
        <span>{activeCurrency.code}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          {currencies.map((currency) => (
            <button
              key={currency.id}
              onClick={() => handleSelect(currency.code, currency.symbol)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm text-right transition-colors ${
                activeCurrency.code === currency.code
                  ? "bg-gray-50 text-black font-bold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              }`}
            >
              <div className="flex flex-col text-right">
                <span>{currency.name}</span>
                <span className="text-xs text-black font-medium">
                  {currency.code}
                </span>
              </div>
              <span className="text-black font-bold">{currency.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
