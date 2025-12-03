"use client";

import MissingProfileInfoModal from "@/src/features/profil/components/MissingProfileInfoModal";
import { PersonalInfo } from "@/src/features/profil/types";
import { createClient } from "@/src/lib/supabase/client";
import { Logo } from "@/src/shared/components/icons";
import Sidebar from "@/src/shared/components/sidebar";
import { ThemeSwitch } from "@/src/shared/components/theme-switch";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import clsx from "clsx";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [fullName, setFullName] = useState<string | null>(null);

  const logOut = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      console.error("Sign out error:", error.message);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      const personalInfo = data.user?.user_metadata["personalInfo"] as
        | PersonalInfo
        | undefined;

      if (personalInfo) {
        console.log(`${personalInfo.firstName} ${personalInfo.lastName}`);
        setFullName(`${personalInfo.firstName} ${personalInfo.lastName}`);
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
          <div className=" items-center gap-2 hidden md:flex">
            {!isSidebarOpen && (
              <>
                <Logo />
                <p className="font-bold text-sm">zozakademi</p>
              </>
            )}
          </div>

          <div className="flex items-center  justify-start gap-4 ml-auto ">
            <ThemeSwitch />
            <Dropdown>
              <DropdownTrigger>
                <span className="cursor-pointer text-sm">{fullName}</span>
              </DropdownTrigger>
              <DropdownMenu variant="faded">
                <DropdownItem
                  key={"profile"}
                  href={"/dashboard/profil"}
                  startContent={<User className="size-4 shrink-0" />}
                >
                  Profil
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  onPress={logOut}
                  className="text-danger"
                  color="danger"
                  startContent={
                    <LogOut className="size-4 shrink-0 text-danger" />
                  }
                >
                  Çıkış Yap
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <div className=" overflow-auto p-6 max-w-screen">
          {/*<Image
            src={
              "https://drive.google.com/thumbnail?id=1-mSFz9qlHN4NTV-VlT-4MxKLkPv_2fN-&sz=w1171-h676"
            }
          />*/}

          {children}
        </div>
      </div>
    </div>
  );
}
