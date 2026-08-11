import { Metadata } from "next";
import { categoryService } from "@/services/category.service";
import ProductCard from "@/components/shared/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Category } from "@/types/product";
import { LayoutGrid, FolderOpen, PackageOpen, AlertCircle } from "lucide-react";

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate Dynamic Metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = params;
  try {
    const categoriesResponse = await categoryService.getCategories();
    const categories = categoriesResponse.data || [];

    // Find the category (main or child)
    let currentCategory: Category | undefined = categories.find(
      (c) => c.slug === slug,
    );
    if (!currentCategory) {
      for (const cat of categories) {
        const child = cat.children?.find((c: any) => c.slug === slug);
        if (child) {
          currentCategory = child;
          break;
        }
      }
    }

    if (!currentCategory) {
      return { title: "القسم غير موجود" };
    }

    return {
      title: `${currentCategory.name} | الاحمدي بصريات`,
      description: `تسوق أفضل المنتجات في قسم ${currentCategory.name} بأفضل الأسعار.`,
      openGraph: {
        title: `${currentCategory.name} | الاحمدي بصريات`,
        description: `تسوق أفضل المنتجات في قسم ${currentCategory.name} بأفضل الأسعار.`,
        images: currentCategory.imageUrl
          ? [{ url: currentCategory.imageUrl }]
          : undefined,
      },
    };
  } catch (error) {
    return { title: "الأقسام" };
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = params;

  try {
    // Fetch categories and products in parallel
    const [categoriesResponse, productsResponse] = await Promise.all([
      categoryService.getCategories(),
      categoryService.getCategoryProducts(slug, 1, 50),
    ]);

    const categories = categoriesResponse.data || [];
    const products = productsResponse?.items || [];

    // Find the current category and determine its parent
    let currentCategory = categories.find((c) => c.slug === slug);
    let parentCategory = currentCategory;
    let isChild = false;

    if (!currentCategory) {
      for (const cat of categories) {
        const child = cat.children?.find((c: any) => c.slug === slug);
        if (child) {
          currentCategory = child;
          parentCategory = cat; // The parent is the main category
          isChild = true;
          break;
        }
      }
    }

    if (!currentCategory) {
      notFound();
    }

    // Determine what children to show in the sidebar
    // If we are viewing a main category, show its children
    // If we are viewing a child category, show its siblings (the parent's children)
    const childrenToDisplay = parentCategory?.children || [];

    return (
      <div className="container mx-auto px-4 py-8 min-h-screen ">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Right Sidebar - Subcategories */}
          <div className="w-full lg:w-1/4 shrink-0">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-black text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
                <span className="w-2 h-6 bg-black rounded-full block"></span>
                {parentCategory?.name}
              </h2>

              <div className="flex flex-col gap-3">
                {/* Option to view all products of the main category */}
                <Link
                  href={`/category/${parentCategory?.slug}`}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-all font-bold text-sm ${!isChild ? "bg-black text-white shadow-lg shadow-black/20 scale-[1.02]" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!isChild ? "bg-white/20" : "bg-white shadow-sm"}`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  عرض الكل
                </Link>

                {childrenToDisplay.map((child: any) => (
                  <Link
                    key={child.id}
                    href={`/category/${child.slug}`}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all font-bold text-sm ${slug === child.slug ? "bg-black text-white shadow-lg shadow-black/20 scale-[1.02]" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                  >
                    {child.imageUrl ? (
                      <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0 shadow-sm bg-white p-1">
                        <Image
                          src={child.imageUrl}
                          alt={child.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${slug === child.slug ? "bg-white/20" : "bg-white shadow-sm"}`}
                      >
                        <FolderOpen className="w-5 h-5" />
                      </div>
                    )}
                    {child.name}
                  </Link>
                ))}

                {childrenToDisplay.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-4">
                    لا توجد أقسام فرعية
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Left Content - Products */}
          <div className="flex-1">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">
                  {currentCategory.name}
                </h1>
                <p className="text-gray-500 font-medium">
                  عرض {products.length} منتج
                </p>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map((product: any) => (
                  <div key={product.id} className="h-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-3xl p-16 flex flex-col items-center justify-center text-center border border-gray-100 border-dashed">
                <div className="text-gray-300 mb-6 bg-white p-6 rounded-full shadow-sm">
                  <PackageOpen className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  لا توجد منتجات حالياً
                </h3>
                <p className="text-gray-500 max-w-sm">
                  جاري إضافة المزيد من المنتجات المميزة في هذا القسم قريباً، عد
                  لاحقاً!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-32 text-center flex flex-col items-center">
        <div className="text-red-500 mb-6 bg-red-50 p-6 rounded-full">
          <AlertCircle className="w-16 h-16" />
        </div>
        <h1 className="text-3xl font-black mb-4">
          عذراً، حدث خطأ أثناء تحميل القسم
        </h1>
        <p className="text-gray-500 mb-8 max-w-md">
          نواجه مشكلة مؤقتة في جلب بيانات هذا القسم. يرجى المحاولة مرة أخرى أو
          العودة للصفحة الرئيسية.
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-black text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-black/20"
        >
          العودة للرئيسية
        </Link>
      </div>
    );
  }
}
