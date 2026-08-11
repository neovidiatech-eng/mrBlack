"use client";

import { usePage } from "@/hooks/usePages";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function DynamicPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { page, isLoading, error } = usePage(slug);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-gray-400 mb-4" />
        <p className="text-gray-500">جاري تحميل الصفحة...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-red-50 text-red-600 px-8 py-6 rounded-2xl text-center">
          <h2 className="text-xl font-bold mb-2">عذراً، حدث خطأ!</h2>
          <p>{error || "الصفحة غير موجودة أو تم حذفها."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl min-h-[60vh]">
      <article className="bg-white rounded-[32px] p-8 md:p-12 lg:p-16 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="prose prose-lg prose-gray max-w-none prose-headings:font-black prose-a:text-black hover:prose-a:text-gray-600 prose-p:text-gray-600 leading-loose">
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
        
        {page.updatedAt && (
          <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400 flex items-center justify-between">
            <span>آخر تحديث:</span>
            <span dir="ltr">
              {new Date(page.updatedAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}
      </article>
    </div>
  );
}
