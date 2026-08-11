"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Globe,
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  LogOut,
  Bell,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import OfferMarquee from "./OfferMarquee";
import logoImg from "../../../public/logo.png";
import { useCartStore } from "@/store/useCartStore";
import { useCartQuery } from "@/hooks/useCart";
import CartDrawer from "./CartDrawer";
import CurrencySelector from "./CurrencySelector";
import { useFavorites } from "@/hooks/useFavorites";
import { getAccessToken } from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/useProfile";
import { useCategories } from "@/hooks/useCategories";
import { useHomeData } from "@/hooks/useHome";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { useNotifications } from "@/hooks/useNotifications";

export default function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMegaMenu, setShowMegaMenu] = useState<string | null>(null);
  const [lang, setLang] = useState("AR");
  const [activeSection, setActiveSection] = useState("home");
  const [mounted, setMounted] = useState(false);

  const { logout } = useAuth();
  const { isCartOpen, setIsCartOpen } = useCartStore();
  const { data: cartData } = useCartQuery();
  const items = cartData?.data?.items || [];
  const totalCartItems = items.reduce(
    (total: number, item: any) => total + item.quantity,
    0,
  );

  const { favorites } = useFavorites();
  const { profile } = useProfile();

  const token = mounted ? getAccessToken() : null;
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const unreadNotificationsCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  const firstLetter = profile?.name
    ? profile.name.charAt(0).toUpperCase()
    : "U";

  const handleFavoritesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) {
      router.push("/account");
    } else {
      router.push("/account/favorites");
    }
  };

  const { data: productsData } = useProducts(1, 100);
  const productsResponse = productsData as any;
  const allProducts = productsResponse?.items || productsResponse?.data?.items || productsResponse?.data || [];

  const filteredSearchProducts =
    searchQuery.trim() === ""
      ? []
      : allProducts.filter(
          (p: any) =>
            p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const groupedSearchProducts = filteredSearchProducts.reduce((acc: any, product: any) => {
    const categoryName = product.category?.name || "منتجات أخرى";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {});

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  const { data: homeData } = useHomeData();
  const newArrivals = homeData?.data?.newArrivals || [];
  interface NavItem {
    id: string;
    label: string;
    href: string;
    mega?: string;
  }
  const navItems: NavItem[] = [
    { id: "home", label: "الرئيسية", href: "/" },
    ...categories.map((cat: any) => ({
      id: cat.id,
      label: cat.name,
      mega: cat.id,
      href: `/shop?category=${cat.slug}`,
    })),
    { id: "about", label: "من نحن", href: "/about" },
    { id: "contact", label: "اتصل بنا", href: "/contact" },
  ];

  const onSelectProduct = (productId: string | null) => {
    console.log("Selected product", productId);
  };

  return (
    <>
      <OfferMarquee />

      {/* HEADER BAR */}
      <motion.header
        id="luxury-header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? "bg-black/95 backdrop-blur-md border-b border-white/10 py-1 shadow-sm"
            : "bg-black border-b border-white/5 py-2"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Right Section: Logo */}

          <div className="flex items-center gap-2">
            <Image
              src={logoImg}
              alt="MR.BLACK"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            <Link
              href="/"
              onClick={() => {
                setActiveSection("home");
                if (onSelectProduct) onSelectProduct(null);
              }}
              className="flex flex-col items-start leading-none group"
            >
              <span className="md:text-2xl text-[1.15rem] font-bold tracking-widest text-white transition-colors duration-300 group-hover:text-[#C21913]">
                MR.BLACK
              </span>
              <span className="text-[9px] text-[#BABABA] tracking-[0.2em] font-mono mt-1">
                LUXURY ARABIC FOOTWEAR
              </span>
            </Link>
          </div>
          {/* Center Section: Main Nav (Hidden on Mobile) */}
          <nav className="hidden lg:flex items-center space-x-reverse space-x-8">
            {navItems.map((item) => (
              <div
                key={item.id}
                className="relative py-2"
                onMouseEnter={() => item.mega && setShowMegaMenu(item.mega)}
                onMouseLeave={() => setShowMegaMenu(null)}
              >
                <Link
                  href={item.href}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (onSelectProduct) onSelectProduct(null);
                  }}
                  className={`text-[13px] font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
                    activeSection === item.id || showMegaMenu === item.mega
                      ? "text-[#C21913]"
                      : "text-white hover:text-[#C21913]"
                  }`}
                >
                  {item.label}
                </Link>
                {activeSection === item.id && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#C21913]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Left Section: Controls */}
          <div className="flex items-center space-x-reverse space-x-3 sm:space-x-5 text-white">
            {/* Currency Selector */}
            <div className="hidden sm:block">
              <CurrencySelector />
            </div>

            {/* Language Selector */}

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-[#C21913] transition-colors relative p-1.5"
              id="header_search_btn"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={handleFavoritesClick}
              className="p-1.5 hover:text-[#C21913] transition-colors cursor-pointer relative text-white"
              id="wishlist-btn"
              title="المفضلة"
            >
              <Heart className="w-5.5 h-5.5" />
              {mounted && favorites.length > 0 && (
                <span className="absolute -top-1 -left-1 bg-[#C21913] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 hover:text-[#C21913] transition-colors cursor-pointer relative text-white"
              id="cart-btn"
              title="سلة التسوق"
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {mounted && totalCartItems > 0 && (
                <span className="absolute -top-1 -left-1 bg-[#C21913] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Notifications Trigger */}
            {token && (
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1.5 hover:text-[#C21913] transition-colors cursor-pointer relative text-white"
                    title="الإشعارات"
                  >
                    <Bell className="w-5.5 h-5.5" />
                    {mounted && unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -left-1 bg-[#C21913] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotificationsCount > 9 ? "+9" : unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-80 bg-white border-gray-100 rounded-xl shadow-xl mt-2 p-0 z-[100] max-h-[400px] overflow-y-auto"
                >
                  <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl sticky top-0 z-10">
                    <h4 className="font-bold text-sm text-gray-900">الإشعارات</h4>
                    {unreadNotificationsCount > 0 && (
                      <button 
                        onClick={() => markAllAsRead()}
                        className="text-xs text-[#C21913] hover:underline font-medium"
                      >
                        تحديد الكل كمقروء
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col">
                    {!notifications || notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-sm">
                        لا توجد إشعارات حالياً
                      </div>
                    ) : (
                      notifications.map((notification: any) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                          onClick={() => {
                            if (!notification.isRead) markAsRead(notification.id);
                          }}
                        >
                          <p className="text-sm font-bold text-gray-900 mb-1">{notification.title}</p>
                          <p className="text-xs text-gray-600 leading-relaxed">{notification.message}</p>
                          <span className="text-[10px] text-gray-400 mt-2 block">
                            {new Date(notification.createdAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User Account */}
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <button
                  className="hidden sm:block p-1.5 hover:text-[#C21913] transition-colors cursor-pointer text-white focus:outline-none relative"
                  title="الحساب الشخصي"
                >
                  {token ? (
                    <div className="relative w-10 h-10">
                      <Avatar className="w-10 h-10 border-2 border-white/20">
                        <AvatarImage
                          src={profile?.imageUrl || ""}
                          alt={profile?.name || "User"}
                        />
                        <AvatarFallback className="bg-neutral-800 text-white text-md font-bold">
                          {firstLetter}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                    </div>
                  ) : (
                    <User className="w-5.5 h-5.5" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white border-gray-100 rounded-xl shadow-xl mt-2 p-1 z-[100]"
              >
                {token ? (
                  <>
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {profile?.name || "المستخدم"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {profile?.email || ""}
                      </p>
                    </div>
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg mb-2 cursor-pointer hover:bg-gray-50 text-sm font-medium focus:bg-gray-50"
                    >
                      <Link href="/account" className="w-full">
                        حسابي
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg cursor-pointer hover:bg-[#c21913] hover:text-black text-sm font-medium focus:bg-gray-50"
                    >
                      <button
                        onClick={logout}
                        className="w-full  bg-[#c21913]/95 text-white"
                      >
                        <LogOut className="w-4 h-4 me-4" />
                        تسجيل الخروج
                      </button>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium focus:bg-gray-50"
                    >
                      <Link href="/account" className="w-full">
                        تسجيل الدخول
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium focus:bg-gray-50"
                    >
                      <Link href="/account?tab=register" className="w-full">
                        إنشاء حساب
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Nav Button */}
            {/* <div className="lg:hidden flex items-center">
              <Link
                href="/shop"
                className="bg-white hover:bg-[#C21913] text-white hover:text-white text-[11px] font-black py-2 px-4 rounded-none transition-all cursor-pointer shadow-sm"
              >
                تصفح المنتجات
              </Link>
            </div> */}
          </div>
        </div>

        {/* MEGA MENU DROP DOWN */}
        <AnimatePresence>
          {showMegaMenu && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.3 }}
              className="absolute left-0 right-0 top-full bg-black border-t border-b border-gray-100 shadow-xl py-8 z-40 hidden lg:block text-white"
              onMouseEnter={() => setShowMegaMenu(showMegaMenu)}
              onMouseLeave={() => setShowMegaMenu(null)}
            >
              <div className="max-w-7xl mx-auto px-8 grid grid-cols-4 gap-8">
                {(() => {
                  const activeCategory = categories.find(
                    (c: any) => c.id === showMegaMenu,
                  );
                  if (!activeCategory) return null;

                  return (
                    <>
                      <div className="col-span-1 border-l border-gray-100 pl-8">
                        <h4 className="text-[#C21913] font-bold text-sm mb-4">
                          حسب التصنيف
                        </h4>
                        <ul className="space-y-3">
                          {activeCategory.children &&
                          activeCategory.children.length > 0 ? (
                            activeCategory.children.map((child: any) => (
                              <li key={child.id}>
                                <Link
                                  href={`/shop?category=${child.slug}`}
                                  onClick={() => setShowMegaMenu(null)}
                                  className="text-white hover:text-[#C21913] transition-colors text-sm font-semibold"
                                >
                                  {child.name}
                                </Link>
                              </li>
                            ))
                          ) : (
                            <li>
                              <Link
                                href={`/shop?category=${activeCategory.slug}`}
                                onClick={() => setShowMegaMenu(null)}
                                className="text-white hover:text-[#C21913] transition-colors text-sm font-semibold"
                              >
                                تصفح كل {activeCategory.name}
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                      <div className="col-span-1 border-l border-gray-100 pl-8">
                        <h4 className="text-[#C21913] font-bold text-sm mb-4">
                          وصل حديثاً
                        </h4>
                        <ul className="space-y-3">
                          {newArrivals.slice(0, 3).map((product: any) => (
                            <li key={product.id}>
                              <Link
                                href={`/product/${product.slug}`}
                                onClick={() => setShowMegaMenu(null)}
                                className="text-white hover:text-[#C21913] transition-colors text-sm font-semibold truncate block"
                              >
                                {product.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-span-2 relative h-48 rounded-xl overflow-hidden group">
                        {activeCategory.imageUrl ? (
                          <img
                            src={activeCategory.imageUrl}
                            alt={activeCategory.name}
                            className="w-full h-full object-cover filter brightness-75 group-hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                            <span className="text-neutral-600">MR.BLACK</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-right">
                          <span className="text-[#C21913] text-xs font-bold mb-1">
                            تشكيلة جديدة
                          </span>
                          <h4 className="text-white font-black text-lg mb-2">
                            {activeCategory.name}
                          </h4>
                          <p className="text-[#f2f2f2]/80 text-xs font-light">
                            اكتشف أحدث التصاميم العصرية الحصرية.
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* FULL SCREEN SEARCH MODAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-900 z-50 flex flex-col p-6 overflow-y-auto"
              dir="rtl"
            >
              <div className="max-w-4xl mx-auto w-full pt-16">
                <div className="flex justify-between items-center mb-12">
                  <span className="text-xs tracking-[0.2em] font-mono text-[#BABABA]">
                    MR.BLACK LUXURY SEARCH
                  </span>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="text-white hover:text-[#C21913] p-2 border border-white/10 rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative mb-12">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#BABABA] w-7 h-7" />
                  <input
                    type="text"
                    placeholder="ابحث عن حذاء، موديل، مقاس..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full bg-neutral-900 border border-white/10 focus:border-[#C21913] text-white text-2xl px-6 py-5 pr-14 rounded-2xl outline-none transition-all placeholder:text-neutral-600 font-medium"
                  />
                </div>

                {/* Search Results */}
                <div>
                  {searchQuery === "" ? (
                    <div>
                      <h4 className="text-sm font-semibold text-[#BABABA] mb-4">
                        كلمات البحث الأكثر تداولاً
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {[
                          "الزبيري الملكي",
                          "جلد نعام طبيعي",
                          "سنيكرز أسود",
                          "حذاء البشت الملكي",
                          "لوفر كلاسيك",
                        ].map((tag, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSearchQuery(tag)}
                            className="bg-neutral-900 border border-white/10 hover:border-[#C21913] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : filteredSearchProducts.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-xl text-[#BABABA]">
                        لا توجد نتائج مطابقة لـ "{searchQuery}"
                      </p>
                      <p className="text-sm text-neutral-600 mt-2">
                        الرجاء محاولة البحث بكلمات أخرى أو تصفح المجموعات.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <h4 className="text-sm font-semibold text-[#BABABA]">
                          نتائج البحث ({filteredSearchProducts.length})
                        </h4>
                      </div>
                      
                      {Object.entries(groupedSearchProducts).map(([categoryName, catProducts]: [string, any]) => (
                        <div key={categoryName} className="mb-8">
                          <h5 className="text-[#C21913] font-bold text-lg mb-4 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-[#C21913]"></div>
                             {categoryName}
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {catProducts.map((product: any) => (
                              <div
                                key={product.id}
                                onClick={() => {
                                  onSelectProduct(product.id);
                                  router.push(`/product/${product.slug}`);
                                  setIsSearchOpen(false);
                                  setSearchQuery("");
                                }}
                                className="flex gap-4 p-3 bg-neutral-900/50 hover:bg-neutral-900 border border-white/10 hover:border-[#C21913] rounded-xl cursor-pointer transition-all duration-300 group"
                              >
                                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
                                  <img
                                    src={product.images?.[0]?.url || "/placeholder.png"}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-sm font-bold text-white group-hover:text-[#C21913] transition-colors line-clamp-1">
                                    {product.name}
                                  </h5>
                                  <span className="text-xs text-[#BABABA] bg-black/50 px-2 py-0.5 rounded mt-1 inline-block">
                                    {product.brand || "متنوع"}
                                  </span>
                                  <p className="text-sm font-bold text-white mt-1">
                                    {product.discountPrice || product.price} ر.س
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
