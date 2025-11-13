import { Button } from "@heroui/button";
import { CheckCircle, Zap } from "lucide-react";
import Numbers from "./numbers";

export default function Hero() {
  return (
    <section className="py-16 md:py-24 " id="hero">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center rounded-md text-xs font-semibold  px-4 py-2">
            <Zap className="size-4 mr-2"></Zap>
            YKS 2025'e Hazır Mısın?
          </div>
          <h1 className="opacity-100 transform-none text-4xl md:text-6xl font-bold text-balance leading-tight">
            Bugün hedefinin peşine düşmeye{" "}
            <span className="text-primary">var mısın</span>?
          </h1>
          <p className="opacity-100 transform-none text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            <span className="text-primary font-bold">HEDEFTE</span> ile
            eksiklerini analiz et, planını oluştur, hızını artır — hepsi tek
            platformda. Çünkü senin hedefin, bizim önceliğimiz.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-100 transform-none">
            <a
              data-slot="button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md px-6 has-[&gt;svg]:px-4 w-full sm:w-auto"
              href="/?register=true"
            >
              Hemen Başla
            </a>
            <a
              data-slot="button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-10 rounded-md px-6 has-[&gt;svg]:px-4 w-full sm:w-auto bg-transparent"
              href="#sss"
            >
              Daha Fazla Öğren
            </a>
          </div>
          <Numbers />
        </div>
      </div>
    </section>
  );
}
