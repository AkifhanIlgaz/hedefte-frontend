"use client";

import { siteConfig } from "@/src/config/site";
import { createClient } from "@/src/lib/supabase/client";
import { Logo } from "@/src/shared/components/icons";
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
import { Dispatch, SetStateAction, useState } from "react";
import SidebarLink from "./sidebarLink";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpenAction: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpenAction,
}: SidebarProps) {
  const logOut = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      console.error("Sign out error:", error.message);
    }
  };

  return (
    <div
      className={clsx(
        "flex flex-col border-r border-default-300 rounded-2xl bg-background transition-width duration-300 ease-in-out",
        isSidebarOpen ? "w-64" : "w-16", // kapalıyken daralt
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-[3rem] px-4 border-b border-default-500/50">
        {isSidebarOpen && (
          <div className="flex items-center gap-2">
            <Logo />
            <p className="font-bold text-md">HEDEFTE</p>
          </div>
        )}

        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={() => setIsSidebarOpenAction(!isSidebarOpen)}
        >
          {isSidebarOpen ? <ChevronsLeft /> : <ChevronsRight />}
        </Button>
      </div>
      <div className="flex flex-col justify-between h-full">
        {/* Sidebar Links */}
        <ul className="flex flex-col gap-2 p-2">
          {siteConfig.dashboardNavItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isSidebarOpen={isSidebarOpen}
            />
          ))}
        </ul>

        <div>
          <ul className="flex flex-col gap-2 p-2">
            {siteConfig.sidebarFooterItems.map((item) => (
              <SidebarLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isSidebarOpen={isSidebarOpen}
              />
            ))}
            <Link
              className={clsx(
                "px-2 py-2 rounded-md transition-colors duration-300 cursor-pointer flex items-center gap-3",
                "text-sm font-medium",
                "hover:bg-danger hover:text-danger-foreground",
                !isSidebarOpen &&
                  "justify-center transition-colors duration-300",
              )}
              color="danger"
              onPress={logOut}
            >
              <LogOut className="size-4 shrink-0 text-danger" />
              {isSidebarOpen && (
                <span className=" whitespace-nowrap overflow-hidden text-ellipsis">
                  Çıkış Yap
                </span>
              )}
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
