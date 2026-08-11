"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Grid2X2, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useCartQuery } from "@/hooks/useCart";
import { useEffect, useState } from "react";

export default function MobileNav() {
  const pathname = usePathname();
  const { data: cartData } = useCartQuery();
  const items = cartData?.data?.items || [];
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "الرئيسية", href: "/", icon: Home },
    { name: "الاقسام", href: "/categories", icon: Grid2X2 },
    { name: "المتجر", href: "/shop", icon: Store },
    // Cart is handled separately to toggle the drawer
    { name: "حسابي", href: "/account", icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 z-40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between px-6 h-16">
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive ? 'text-black' : 'text-gray-400'}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-black/5' : ''}`} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-black' : 'text-gray-500'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* Cart Button */}
        <button
          onClick={() => useCartStore.getState().setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center gap-1 text-gray-400 transition-colors hover:text-black -mt-6"
        >
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white relative">
            <ShoppingCart className="w-5 h-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-gray-500">
            السلة
          </span>
        </button>

        {navItems.slice(2).map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive ? 'text-black' : 'text-gray-400'}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-black/5' : ''}`} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-black' : 'text-gray-500'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
