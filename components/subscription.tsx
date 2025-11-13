import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Send, Target } from "lucide-react";

export default function Subscription() {
  return (
    <section className="py-16 md:py-24 ">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-balance  mb-2">
            Hedefinize Ulaşmaya Bugün Başlayın !
          </h2>
          <p className="text-lg text-muted-foreground text-pretty ">
            Mail listemize katıl, yeni özelliklerden, çalışma ipuçlarından ve
            YKS stratejilerinden ilk sen haberdar ol.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Input
              type="email"
              required
              placeholder="E-posta adresinizi girin"
              className="flex-1 h-10"
            />
            <Button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md px-6 transition-all w-full sm:w-auto"
            >
              <Send className="h-4 w-4 mr-1" />
              Kaydol
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Ücretsiz Kaydol Button */}
            <Button
              as="a"
              href="/?register=true"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md px-6 transition-all w-full sm:w-auto"
            >
              <Target className="h-5 w-5 mr-2" />
              Ücretsiz Kaydol
            </Button>

            {/* Blog'u İncele Button */}
            <Button
              as="a"
              href="/blog"
              variant="bordered"
              className="border shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 bg-transparent h-10 rounded-md px-6 transition-all w-full sm:w-auto"
            >
              Blog'u İncele
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
