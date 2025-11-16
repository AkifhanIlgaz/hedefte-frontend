"use client";

import { siteConfig } from "@/src/config/site";
import MissingProfileInfoModal from "@/src/features/profil/components/MissingProfileInfoModal";
import { ExamInfo, PersonalInfo } from "@/src/features/profil/types";
import { createClient } from "@/src/lib/supabase/client";
import { hasUndefinedFields } from "@/src/lib/utils";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import clsx from "clsx";
import {
  ChevronsLeft,
  ChevronsRight,
  CircleAlert,
  FileWarning,
  Home,
  LogOut,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      const personalInfo = data.user?.user_metadata["personalInfo"] as
        | PersonalInfo
        | undefined;

      const examInfo = data.user?.user_metadata["examInfo"] as
        | ExamInfo
        | undefined;

      if (hasUndefinedFields(personalInfo) || hasUndefinedFields(examInfo)) {
        onOpen();
      }

      if (error) console.error("Kullanıcı bilgisi alınamadı:", error.message);
    };

    getUser();
  }, []);

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpenAction={setIsSidebarOpen}
      />
      <MissingProfileInfoModal isOpen={isOpen} onOpenChange={onOpenChange} />
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

        <div className="flex-1 overflow-auto p-6 ">{children}</div>
      </div>
    </div>
  );
}
