import { MapPin, Phone, Mail, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "تواصل معنا | MR.BLACK",
  description: "نحن هنا لمساعدتك. تواصل مع فريق خدمة العملاء في MR.BLACK للاستفسارات والدعم.",
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gray-50 py-16 md:py-24 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">كيف يمكننا مساعدتك؟</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            فريقنا متواجد دائماً للرد على استفساراتك وتقديم المساعدة التي تحتاجها بأسرع وقت ممكن.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl mt-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Contact Form */}
          <div className="w-full lg:w-3/5">
            <h2 className="text-2xl font-black mb-8">أرسل لنا رسالة</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">الاسم بالكامل</label>
                  <input 
                    type="text" 
                    placeholder="أدخل اسمك" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">رقم الهاتف</label>
                  <input 
                    type="tel" 
                    placeholder="01xxxxxxxxx" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-left"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  placeholder="example@domain.com" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-left"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">موضوع الرسالة</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
                  <option>استفسار عن منتج</option>
                  <option>متابعة طلب</option>
                  <option>شكوى أو مقترح</option>
                  <option>أخرى</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">رسالتك</label>
                <textarea 
                  rows={5}
                  placeholder="اكتب رسالتك هنا..." 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all resize-none"
                />
              </div>
              <button 
                type="button"
                className="w-full h-14 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
              >
                إرسال الرسالة
                <ArrowLeft className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="w-full lg:w-2/5">
            <h2 className="text-2xl font-black mb-8">معلومات التواصل</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">العنوان</h3>
                  <p className="text-gray-500 leading-relaxed">
                    123 شارع التسعين، التجمع الخامس<br />
                    القاهرة، جمهورية مصر العربية
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">رقم الهاتف</h3>
                  <p className="text-gray-500" dir="ltr">+20 123 456 7890</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">البريد الإلكتروني</h3>
                  <p className="text-gray-500" dir="ltr">support@mrblack-eg.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">ساعات العمل</h3>
                  <p className="text-gray-500">
                    السبت - الخميس: 10:00 صباحاً - 10:00 مساءً<br />
                    الجمعة: 2:00 ظهراً - 11:00 مساءً
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links (Optional) */}
            <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-lg mb-4">تواصل معنا عبر السوشيال ميديا</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
