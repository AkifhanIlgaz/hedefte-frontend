"use client";

import { siteConfig } from "@/src/config/site";
import { createClient } from "@/src/lib/supabase/client";
import { Logo } from "@/src/shared/components/icons";
import Sidebar from "@/src/shared/components/sidebar";
import { ThemeSwitch } from "@/src/shared/components/theme-switch";
import {
  Avatar,
  AvatarGroup,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import clsx from "clsx";
import { ChevronsLeft, ChevronsRight, Home, LogOut } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpenAction={setIsSidebarOpen}
      />

      <div
        className={clsx(
          "flex-1 flex flex-col relative transition-all duration-300 ease-in-out",
          isSidebarOpen ? undefined : "ml-0",
        )}
      >
        <div className="flex items-center justify-between h-[2.9rem] px-4 border-b border-default-300 bg-background">
          {!isSidebarOpen && (
            <div className="flex items-center gap-2">
              <Logo />
              <p className="font-bold text-sm">HEDEFTE</p>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <ThemeSwitch />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
