"use client";

import Footer from "@/src/shared/components/footer";
import { Navbar } from "@/src/shared/components/navbar";

export default function NotAuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="min-h-[93vh] flex items-center justify-center  bg-background">
        <div className=" max-w-md border p-4 rounded-2xl ">{children}</div>
      </div>
      <Footer />
    </>
  );
}
