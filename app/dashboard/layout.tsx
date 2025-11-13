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
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex w-full min-h-screen">
      <Drawer
        hideCloseButton
        backdrop="transparent"
        size="xs"
        placement="left"
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        classNames={{
          base: "max-w-[16rem]",
          header: "h-[3rem]",
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <div className="flex flex-col h-full border-r border-default-300 bg-background">
              <DrawerHeader className="flex px-4 py-2 border-b border-default-500/50 justify-between ">
                <div className="flex items-center">
                  <Logo />
                  <p className="font-bold text-md">HEDEFTE</p>
                </div>
              </DrawerHeader>
              <DrawerBody className="px-2">
                <ul className="flex flex-col gap-2 ">
                  {siteConfig.dashboardNavItems.map((item) => (
                    <Link
                      key={item.href}
                      className={clsx(
                        "block px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer",
                        "text-sm font-medium",
                        "hover:bg-primary hover:text-primary-foreground",
                      )}
                      color="foreground"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  ))}
                </ul>
              </DrawerBody>

              <DrawerFooter className="flex flex-col gap-1"></DrawerFooter>
            </div>
          )}
        </DrawerContent>
      </Drawer>
      <div
        className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isSidebarOpen ? "16rem" : "0px",
        }}
      >
        {/* Navbar */}
        <div className="flex items-center justify-between h-[3rem] px-4 border-b border-default-300 bg-background">
          {!isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Logo /> <p className="font-bold text-sm">HEDEFTE</p>
              </div>
              <Button
                isIconOnly
                onPress={() => setIsSidebarOpen(true)}
                className="text-default-800"
                size="sm"
                variant="light"
              >
                <ChevronsRight />
              </Button>
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
