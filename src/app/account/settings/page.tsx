"use client";

import { useProfile } from "@/hooks/useProfile";
import { ArrowRight, User, Settings, Camera, Save, Trash2, Loader2, Lock, Phone } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { profile, isLoadingProfile, updateProfile, isUpdatingProfile, deleteAccount, isDeletingAccount } = useProfile();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      if (profile.imageUrl) {
        setAvatarPreview(profile.imageUrl);
      }
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (name && name !== profile?.name) formData.append("name", name);
    if (phone && phone !== profile?.phone) formData.append("phone", phone);
    if (password) formData.append("password", password);
    if (avatarFile) formData.append("avatar", avatarFile);

    // If nothing changed, just return
    let hasChanges = false;
    formData.forEach(() => {
      hasChanges = true;
    });

    if (hasChanges) {
      await updateProfile(formData);
      setPassword(""); // Clear password after update
    }
  };

  const handleDelete = async () => {
    await deleteAccount();
  };

  if (isLoadingProfile) {
    return (
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-3xl flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
        <p className="text-gray-500 font-bold">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/account"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowRight className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-black">إعدادات الحساب</h1>
      </div>

      <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-6 md:p-10 mb-8">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">المعلومات الشخصية</h2>
            <p className="text-sm text-gray-500">
              تحديث بياناتك الشخصية وكلمة المرور.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="flex flex-col gap-6">
          <div className="flex flex-col items-center mb-4">
            <label className="relative cursor-pointer group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md flex items-center justify-center group-hover:border-gray-50 transition-colors">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400 group-hover:text-black transition-colors" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAvatarFile(file);
                    setAvatarPreview(URL.createObjectURL(file));
                  }
                }}
              />
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </label>
            <span className="text-sm text-gray-500 mt-3 font-bold">تغيير الصورة الشخصية</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="الاسم"
                  className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">رقم الهاتف</label>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="رقم الهاتف"
                  dir="ltr"
                  className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all text-right"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">كلمة المرور الجديدة <span className="text-gray-400 font-normal">(اتركها فارغة إذا لم ترد تغييرها)</span></label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  dir="ltr"
                  className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all text-right"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-900 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingProfile ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-3xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-red-600 mb-2">منطقة الخطر</h3>
            <p className="text-red-700/80 text-sm mb-6 max-w-lg">
              حذف الحساب هو إجراء نهائي ولا يمكن التراجع عنه. سيتم مسح جميع بياناتك، طلباتك، والمفضلة الخاصة بك نهائياً.
            </p>
            
            {showDeleteConfirm ? (
              <div className="bg-white p-4 rounded-2xl border border-red-200">
                <p className="font-bold text-red-600 mb-4 text-sm">هل أنت متأكد تماماً من رغبتبك في حذف الحساب؟</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={isDeletingAccount}
                    className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {isDeletingAccount ? <Loader2 className="w-5 h-5 animate-spin" /> : "نعم، احذف حسابي"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeletingAccount}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors text-sm"
              >
                حذف الحساب نهائياً
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
