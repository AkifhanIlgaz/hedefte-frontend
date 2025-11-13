"use client";

import { siteConfig } from "@/src/config/site";
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
import { ChevronsLeft, ChevronsRight, Home } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar */}
      <div
        className={clsx(
          "flex flex-col border-r border-default-300 bg-background transition-width duration-300 ease-in-out",
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
            onPress={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <ChevronsLeft /> : <ChevronsRight />}
          </Button>
        </div>

        {/* Sidebar Links */}
        <ul className="flex flex-col gap-2 p-2">
          {siteConfig.dashboardNavItems.map((item) => (
            <Link
              key={item.href}
              className={clsx(
                "px-2 py-2 rounded-md transition-colors duration-300 cursor-pointer flex items-center gap-3",
                "text-sm font-medium",
                "hover:bg-primary hover:text-primary-foreground",
                !isSidebarOpen &&
                  "justify-center transition-colors duration-300",
              )}
              color="foreground"
              href={item.href}
            >
              <item.icon className="size-4 shrink-0" />
              {isSidebarOpen && (
                <span className=" whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col transition-all duration-300 ease-in-out relative"
        style={{
          marginLeft: isSidebarOpen ? undefined : 0,
        }}
      >
        {/* Navbar */}
        <div className="flex items-center justify-between h-[3rem] px-4 border-b border-default-300 bg-background">
          {!isSidebarOpen && (
            <div className="flex items-center gap-2">
              <Logo />
              <p className="font-bold text-sm">HEDEFTE</p>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <ThemeSwitch />
            <Avatar size="sm" />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
