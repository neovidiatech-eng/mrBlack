"use client";

import { useState } from "react";
import { Package, Search, Truck, CheckCircle2, Clock } from "lucide-react";
import { useTrackOrder } from "@/hooks/useOrder";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState("");
  const { data, isLoading, isError, isFetching } = useTrackOrder(submittedOrderId, searched);

  const order = data?.data;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phone) return;
    setSubmittedOrderId(orderId.trim());
    setSearched(true);
  };

  const getStep = (status: string) => {
    switch (status) {
      case "pending": return 1;
      case "ready": return 2;
      case "shipped": return 3;
      case "delivered": return 4;
      default: return 1;
    }
  };

  const step = order ? getStep(order.status) : 1;
  const progressWidth = step === 1 ? 0 : step === 2 ? 33.33 : step === 3 ? 66.66 : 100;

  return (
    <div className="container mx-auto px-4 py-16 pb-24 min-h-[60vh] max-w-4xl">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-4xl font-black mb-4">تتبع طلبك</h1>
        <p className="text-gray-500">أدخل رقم الطلب ورقم الهاتف المرتبط به لمعرفة حالة طلبك الحالي.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-sm mb-12">
        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold mb-2">رقم الطلب</label>
            <input 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
              placeholder="مثال: ORD-12345"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold mb-2">رقم الهاتف</label>
            <input 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all text-right"
              placeholder="01xxxxxxxxx"
              dir="ltr"
            />
          </div>
          <div className="md:w-40 flex items-end">
            <button 
              type="submit"
              disabled={isLoading || !orderId || !phone}
              className="w-full h-14 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                "جاري البحث..."
              ) : (
                <>
                  <Search className="w-5 h-5" /> تتبع
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Status Result */}
      {(searched && order) && (
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold mb-8 text-center">حالة الطلب: <span className="text-black">{order.orderNumber}</span></h2>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-6 left-[12.5%] right-[12.5%] h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 right-0 h-full bg-green-500 transition-all duration-1000 rounded-full"
                style={{ width: `${progressWidth}%` }}
              ></div>
            </div>

            <div className="flex flex-col sm:flex-row w-full relative z-10 gap-8 sm:gap-0">
              
              {/* Step 1 */}
              <div className="flex-1 flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                <div className={`w-12 h-12 rounded-full ${step >= 1 ? 'bg-green-500 text-white shadow-md' : 'bg-white border-4 border-gray-200 text-gray-300'} flex items-center justify-center`}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-right sm:text-center">
                  <p className={`font-bold ${step >= 1 ? 'text-black' : 'text-gray-400'}`}>تم تأكيد الطلب</p>
                  <p className="text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }) : 'قريباً'}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex-1 flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                <div className={`w-12 h-12 rounded-full ${step >= 2 ? 'bg-green-500 text-white shadow-md' : step === 1 ? 'bg-white border-4 border-black text-black shadow-md' : 'bg-white border-4 border-gray-200 text-gray-300'} flex items-center justify-center`}>
                  <Package className={step >= 2 ? "w-6 h-6" : "w-5 h-5"} />
                </div>
                <div className="text-right sm:text-center">
                  <p className={`font-bold ${step >= 2 ? 'text-black' : step === 1 ? 'text-black' : 'text-gray-400'}`}>قيد التجهيز</p>
                  {step >= 2 && <p className="text-sm text-gray-500">مكتمل</p>}
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex-1 flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                <div className={`w-12 h-12 rounded-full ${step >= 3 ? 'bg-green-500 text-white shadow-md' : step === 2 ? 'bg-white border-4 border-black text-black shadow-md' : 'bg-white border-4 border-gray-200 text-gray-300'} flex items-center justify-center`}>
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-right sm:text-center">
                  <p className={`font-bold ${step >= 3 ? 'text-black' : step === 2 ? 'text-black' : 'text-gray-400'}`}>في الطريق إليك</p>
                  {step >= 3 && <p className="text-sm text-gray-500">مكتمل</p>}
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex-1 flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                <div className={`w-12 h-12 rounded-full ${step >= 4 ? 'bg-green-500 text-white shadow-md' : step === 3 ? 'bg-white border-4 border-black text-black shadow-md' : 'bg-white border-4 border-gray-200 text-gray-300'} flex items-center justify-center`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-right sm:text-center">
                  <p className={`font-bold ${step >= 4 ? 'text-black' : step === 3 ? 'text-black' : 'text-gray-400'}`}>تم التوصيل</p>
                  <p className="text-sm text-gray-400">{step >= 4 ? 'مكتمل' : 'قريباً'}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {searched && !isLoading && !order && !isError && (
        <div className="text-center py-12 text-gray-500 font-bold">
          لم يتم العثور على طلب بهذا الرقم.
        </div>
      )}
      {searched && isError && (
        <div className="text-center py-12 text-red-500 font-bold">
          حدث خطأ، يرجى التأكد من رقم الطلب والمحاولة مرة أخرى.
        </div>
      )}

    </div>
  );
}
