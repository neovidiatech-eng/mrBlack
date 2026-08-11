"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle2, Trash2, Check } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { getAccessToken } from "@/lib/axios";
import Link from "next/link";

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!getAccessToken());
  }, []);

  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!hasToken) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-black transition-colors rounded-full hover:bg-gray-50"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-[340px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100]">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-900">الإشعارات</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                تحديد الكل كمقروء
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm">لا توجد إشعارات جديدة</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-gray-50 last:border-0 relative group transition-colors ${
                      notif.isRead ? "bg-white" : "bg-blue-50/30"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Link
                          href={notif.link || "#"}
                          onClick={() => {
                            if (!notif.isRead) markAsRead(notif.id);
                            setIsOpen(false);
                          }}
                          className="block"
                        >
                          <h4
                            className={`text-sm mb-1 ${notif.isRead ? "font-medium text-gray-800" : "font-bold text-black"}`}
                          >
                            {notif.title}
                          </h4>
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-gray-400 mt-2 block">
                            {new Date(notif.createdAt).toLocaleDateString(
                              "ar-EG",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* Actions on hover */}
                    <div className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                      {!notif.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
                          title="تحديد كمقروء"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-full"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
