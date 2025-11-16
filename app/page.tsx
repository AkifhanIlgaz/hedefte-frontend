"use client";

import Blogs from "@/src/features/landing/blogs";
import FAQ from "@/src/features/landing/faq";
import Hero from "@/src/features/landing/hero";
import Properties from "@/src/features/landing/properties";
import Subscription from "@/src/features/landing/subscription";
import Testimonials from "@/src/features/landing/testimonials";
import Footer from "@/src/shared/components/footer";
import { Navbar } from "@/src/shared/components/navbar";
import { Divider } from "@heroui/divider";

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
