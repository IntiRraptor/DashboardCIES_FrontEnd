// src/components/sidebar.tsx
"use client";
import React from "react";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  CalendarIcon,
  ClipboardListIcon,
  MailIcon,
  FileTextIcon,
  ClipboardIcon,
  HistoryIcon,
  FileIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

// Define the interface for the Sidebar props
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

// Sidebar component definition
export function Sidebar({ className }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Function to determine if the button matches the current path
  const isActive = (route: string) => {
    if (!pathname) return false;
    // Ensure that both paths end with a slash for consistent comparison
    const formattedPathname = pathname.endsWith("/")
      ? pathname
      : `${pathname}/`;
    const formattedRoute = route.endsWith("/") ? route : `${route}/`;

    return formattedPathname === formattedRoute;
  };

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            General
          </h2>
          <div className="space-y-1">
            <Button
              variant={isActive("/dashboard") ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push("/dashboard")}
            >
              <HomeIcon className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={
                isActive("/dashboard/equipos-medicos") ? "secondary" : "ghost"
              }
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/equipos-medicos")}
            >
              <ClipboardListIcon className="mr-2 h-4 w-4" />
              Equipos Médicos
            </Button>
            <Button
              variant={
                isActive("/dashboard/cronograma-general")
                  ? "secondary"
                  : "ghost"
              }
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/cronograma-general")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Cronograma General
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Mantenimientos
          </h2>
          <div className="space-y-1">
            <Button
              variant={
                isActive("/dashboard/mantenimientos/programar")
                  ? "secondary"
                  : "ghost"
              }
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/mantenimientos/programar")}
            >
              <ClipboardIcon className="mr-2 h-4 w-4" />
              Programar
            </Button>
            <Button
              variant={
                isActive("/dashboard/mantenimientos/historial")
                  ? "secondary"
                  : "ghost"
              }
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/mantenimientos/historial")}
            >
              <HistoryIcon className="mr-2 h-4 w-4" />
              Historial
            </Button>
            <Button
              variant={
                isActive("/dashboard/mantenimientos/solicitudes-externas")
                  ? "secondary"
                  : "ghost"
              }
              className="w-full justify-start"
              onClick={() =>
                router.push("/dashboard/mantenimientos/solicitudes-externas")
              }
            >
              <FileIcon className="mr-2 h-4 w-4" />
              Solicitudes Externas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
