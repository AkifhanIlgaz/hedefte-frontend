"use client";

import { siteConfig } from "@/src/config/site";
import { createClient } from "@/src/lib/supabase/client";
import { Logo } from "@/src/shared/components/icons";
import { Button, Link } from "@heroui/react";
import clsx from "clsx";
import { ChevronsLeft, ChevronsRight, LogOut, Menu } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
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
    <>
      {/* Mobile Toggle Button - Visible only on tablet/mobile when closed */}
      <div
        className={clsx(
          "fixed top-2 left-3 z-50 lg:hidden",
          isSidebarOpen ? "hidden" : "block",
        )}
      >
        <Button
          isIconOnly
          size="sm"
          className="bg-transparent"
          onPress={() => setIsSidebarOpenAction(true)}
        >
          <Menu className="size-5" />
        </Button>
      </div>

      {/* Overlay for mobile - Visible only on tablet/mobile when open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpenAction(false)}
        />
      )}

      <div
        className={clsx(
          "flex flex-col border-r border-default-300 rounded-2xl bg-background transition-all duration-300 ease-in-out shrink-0",
          // Mobile/Tablet (Default - fixed drawer)
          "fixed inset-y-0 left-0 z-50 h-full w-64",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",

          // Desktop (lg - relative sidebar)
          "lg:static lg:h-auto lg:translate-x-0",
          isSidebarOpen ? "lg:w-64" : "lg:w-16",
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
    </>
  );
}
