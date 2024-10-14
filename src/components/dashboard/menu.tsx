"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { PersonIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter } from "next/navigation";

export function Menu() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    router.push("/");
  };

  const handleTitleClick = () => {
    if (pathname !== "/dashboard/") {
      router.push("/dashboard/");
    }
  };

  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4 h-[50px] flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="font-bold cursor-pointer" onClick={handleTitleClick}>
          CIES - Sistema de Mantenimiento de equipos
        </h1>
      </div>

      <div className="flex items-center">
        <MenubarMenu>
          <MenubarTrigger className="hidden md:block flex items-center align-middle">
            <PersonIcon
              className="mr-2 inline-block align-middle"
              style={{ fontSize: "24px", verticalAlign: "middle" }}
            />
            <span className="inline-block align-middle">Mi Cuenta</span>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={handleLogout}>Cerrar Sesión</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </div>
    </Menubar>
  );
}
