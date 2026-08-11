import Image from "next/image";
import { ShieldCheck, Heart, Sparkles, Award } from "lucide-react";
import aboutImg from "../../../public/images/luxury_sneaker_black_1784035395401.jpg";
import aboutHero from "../../../public/images/about.png";
export const metadata = {
  title: "من نحن | MR.BLACK",
  description:
    "تعرف على قصة MR.BLACK، وجهتك للأحذية العصرية التي تجمع بين التصميم والجودة والراحة.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src={aboutHero}
          alt="About MR.BLACK"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            خطوات واثقة،
            <br />
            أناقة لا تتلاشى.
          </h1>
          <p className="text-xl text-gray-200 leading-relaxed font-light">
            نحن في MR.BLACK لا نبيع الأحذية فحسب، بل نقدم لك تجربة فريدة تعكس
            شخصيتك وتبرز أناقتك من خلال أحدث التصميمات العالمية.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-3">
                قصتنا
              </h2>
              <h3 className="text-4xl font-black text-gray-900 mb-6">
                منذ عام 2010، ونحن نضع العالم في إطار أجمل.
              </h3>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  بدأت رحلتنا بشغف بسيط: تقديم أحذية فاخرة تجمع بين الجودة العالية
                  والتصاميم العصرية. كنا نؤمن دائماً أن الحذاء ليس مجرد قطعة ملبوسة،
                  بل هو الأساس الذي يكمل إطلالتك اليومية ويعبر عن ذوقك الرفيع.
                </p>
                <p>
                  اليوم، نفخر بكوننا الوجهة الأولى لآلاف العملاء الذين يثقون في
                  ذوقنا واختياراتنا من أفضل الماركات العالمية والمحلية، مع
                  الالتزام التام بأعلى معايير الجودة وخدمة العملاء.
                </p>
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden relative shadow-2xl">
                <Image
                  src={aboutImg}
                  alt="Our Craft"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-black text-white p-10 rounded-3xl shadow-xl hidden md:block">
                <p className="text-6xl font-black mb-2">+10</p>
                <p className="text-lg font-medium text-gray-300">
                  سنوات من
                  <br />
                  الخبرة والتميز
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              قيمنا ومبادئنا
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              نعمل دائماً لتقديم الأفضل لعملائنا من خلال مجموعة من القيم التي لا
              نحيد عنها.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gray-50 text-black rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">جودة مضمونة</h3>
              <p className="text-gray-500 leading-relaxed">
                جميع منتجاتنا أصلية 100% وتخضع لفحوصات جودة صارمة قبل وصولها
                إليك.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gray-50 text-black rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">تصاميم عصرية</h3>
              <p className="text-gray-500 leading-relaxed">
                نواكب أحدث صيحات الموضة العالمية لنوفر لك تشكيلة متجددة دائماً.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gray-50 text-black rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">راحة مطلقة</h3>
              <p className="text-gray-500 leading-relaxed">
                نحرص على استخدام أفضل الخامات وتقنيات الصناعة الحديثة لضمان
                أقصى درجات الراحة لقدميك طوال اليوم.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gray-50 text-black rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">خدمة ممتازة</h3>
              <p className="text-gray-500 leading-relaxed">
                فريقنا متواجد دائماً لخدمتك ومساعدتك في اختيار ما يناسبك بكل حب.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
