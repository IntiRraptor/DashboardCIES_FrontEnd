// src/components/dashboard/dashboard-layout.tsx

import { Menu } from "@/components/dashboard/menu";
import { Sidebar } from "@/components/dashboard/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CIES - Mantenimiento de equipos",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ]
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col h-screen w-screen">
        <Menu />
        <div className="flex flex-1 overflow-hidden border-t">
          <Sidebar className="hidden lg:block lg:w-2/12 border-r" />
          <div className="flex flex-col flex-1 h-full overflow-hidden">
            <div className="h-full overflow-y-auto overflow-x-hidden  py-6 lg:px-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}