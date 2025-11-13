"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@heroui/button";
import Hero from "@/src/features/landing/hero";
import Numbers from "@/src/features/landing/numbers";
import Properties from "@/src/features/landing/properties";
import Testimonials from "@/src/features/landing/testimonials";
import FAQ from "@/src/features/landing/faq";
import Blogs from "@/src/features/landing/blogs";
import Subscription from "@/src/features/landing/subscription";
import { Divider } from "@heroui/divider";
import { createClient } from "@/src/lib/supabase/client";
import { Navbar } from "@/src/shared/components/navbar";
import Footer from "@/src/shared/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-full  bg-background ">
        <Hero />
        <Divider />
        <Properties />
        <Testimonials />
        <Blogs />
        <FAQ />
        <Subscription />
      </main>
      <Footer />
    </>
  );
}
