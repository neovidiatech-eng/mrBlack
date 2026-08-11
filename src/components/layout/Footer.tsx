"use client";
import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/hooks/useSettings";
import { useCategories } from "@/hooks/useCategories";
import { Mail, MapPin, Phone } from "lucide-react";
import { Category } from "@/types/product";
import logoImg from "../../../public/logo.png";
export default function Footer() {
  const { getSettingValue } = useSettings();
  const { data: categoriesResponse } = useCategories();

  const facebookUrl = getSettingValue("facebook_url");
  const instagramUrl = getSettingValue("instagram_url");
  const twitterUrl = getSettingValue("twitter_url");
  const tiktokUrl = getSettingValue("tiktok_url");

  const contactNumber = getSettingValue("contact_numbers");
  const contactEmail = getSettingValue("contact_email");
  const storeAddress = getSettingValue("store_address");
  const latestCategories = [...(categoriesResponse?.data || [])]
    .sort((a: Category, b: Category) => (b.sortOrder || 0) - (a.sortOrder || 0))
    .slice(0, 3);
  console.log("twitter:", twitterUrl);
  return (
    <footer className="bg-black border-t border-white/10  text-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="block mb-4">
              {/* باستخدام نص مؤقت هنا أو إذا كان لديك صورة الشعار المفرغة استخدمها */}
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
                  className="flex flex-col items-start leading-none group"
                >
                  <span className="text-2xl font-bold tracking-widest text-white transition-colors duration-300 group-hover:text-[#C21913]">
                    MR.BLACK
                  </span>
                  <span className="text-[9px] text-[#BABABA] tracking-[0.2em] font-mono mt-1">
                    LUXURY ARABIC FOOTWEAR
                  </span>
                </Link>
              </div>
            </Link>
            <p className="text-sm text-[#BABABA] mb-6 leading-relaxed">
              وجهتك الأولى لأحدث وأفخم الأحذية الشرقية، بأسعار تنافسية وجودة لا
              تُضاهى.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
              {twitterUrl && (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.65-.43 3.32-1.33 4.67-1.65 2.52-4.8 3.86-7.86 3.1-2.92-.72-5.18-3.04-5.83-5.96-.5-2.22.06-4.63 1.48-6.4 1.76-2.2 4.65-3.23 7.33-2.62v4.06c-1.3-.2-2.73.08-3.76.98-1.36 1.16-1.74 3.25-.87 4.8.84 1.48 2.8 2.05 4.3 1.34 1.18-.56 1.87-1.86 1.87-3.15V.02z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold mb-4 text-white">تسوق معنا</h3>
            <ul className="space-y-3 text-sm text-[#BABABA]">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-[#C21913] transition-colors"
                >
                  جميع المنتجات
                </Link>
              </li>
              {latestCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="hover:text-[#C21913] transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold mb-4 text-white">خدمة العملاء</h3>
            <ul className="space-y-3 text-sm text-[#BABABA]">
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-[#C21913] transition-colors"
                >
                  تتبع طلبك
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/return-policy"
                  className="hover:text-[#C21913] transition-colors"
                >
                  سياسة الاسترجاع
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-[#C21913] transition-colors"
                >
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#C21913] transition-colors"
                >
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/terms-and-conditions"
                  className="hover:text-[#C21913] transition-colors"
                >
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/privacy-policy"
                  className="hover:text-[#C21913] transition-colors"
                >
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-4 text-white">معلومات التواصل</h3>
            <ul className="space-y-4 text-sm text-[#BABABA]">
              {storeAddress && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 shrink-0 text-[#C21913]" />
                  <span className="leading-relaxed">{storeAddress}</span>
                </li>
              )}
              {contactNumber && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 shrink-0 text-[#C21913]" />
                  <span dir="ltr" className="font-medium">
                    {contactNumber}
                  </span>
                </li>
              )}
              {contactEmail && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 shrink-0 text-[#C21913]" />
                  <a
                    href={`mailto:${contactEmail}`}
                    className="hover:text-[#C21913] transition-colors"
                  >
                    {contactEmail}
                  </a>
                </li>
              )}
              {!storeAddress && !contactNumber && !contactEmail && (
                <li>لا توجد معلومات تواصل حالياً</li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold mb-4 text-white">النشرة البريدية</h3>
            <p className="text-sm text-[#BABABA] mb-4">
              اشترك ليصلك أحدث العروض والخصومات الحصرية.
            </p>
            <form className="flex border border-white/10 rounded-md overflow-hidden">
              <input
                type="email"
                placeholder="البريد الإلكتروني..."
                className="w-full px-4 py-2 bg-neutral-900 focus:bg-neutral-800 text-white focus:outline-none text-sm transition-colors placeholder:text-neutral-500"
              />
              <button
                type="button"
                className="bg-[#C21913] text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                اشتراك
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-neutral-500">
          <p>
            © {new Date().getFullYear()} مستر بلاك للأحذية الشرقية. جميع الحقوق
            محفوظة.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden border-t border-gray-600 bg-gray-900">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-40 bg-gray-600 rounded-full blur-3xl" />
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-40 h-40 bg-gray-600 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-4 flex items-center justify-center">
          <a
            href="https://neovidia.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 hover:text-white transition-colors group"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>تم التصميم والتطوير بواسطة</span>
            <span className="font-extrabold tracking-wide bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-purple-400 transition-all duration-500">
              Neovidia
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
