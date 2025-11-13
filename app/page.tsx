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

export default function Home() {
  return (
    <>
      <Hero />
      <Divider />
      <Properties />
      <Testimonials />
      <Blogs />
      <FAQ />
      <Subscription />
    </>
  );
}
