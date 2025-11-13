import { CheckCircle } from "lucide-react";
import { Button } from "@heroui/button";
import Hero from "@/components/hero";
import Numbers from "@/components/numbers";
import Properties from "@/components/properties";
import Testimonials from "@/components/testimonials";
import FAQ from "@/components/faq";
import Blogs from "@/components/blogs";
import Subscription from "@/components/subscription";
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
