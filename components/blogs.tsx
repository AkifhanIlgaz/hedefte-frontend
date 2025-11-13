import { Card, CardHeader, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";

export default function Blogs() {
  const blogs = [
    {
      category: "Deneme Analizi",
      title: "Denemeleri Verimli Analiz Etmenin 5 Yolu",
      description:
        "Deneme sonuçlarınızı doğru analiz ederek performansınızı maksimize edin.",
      href: "/blog",
    },
    {
      category: "Hızlı Okuma",
      title: "Nesne Takibi ile Hızını Arttır",
      description: "Nesne takibi egzersizleri ile okuma hızınızı geliştirin.",
      href: "/blog",
    },
    {
      category: "Çalışma Planı",
      title: "Haftalık Plan Şablonu",
      description: "Verimli bir haftalık çalışma programı nasıl oluşturulur?",
      href: "/blog",
    },
  ];

  return (
    <section className="py-16 md:py-24" id="blogs">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            Son Blog Yazıları
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            YKS hazırlık sürecinizde size yardımcı olacak ipuçları ve
            stratejiler
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {blogs.map((blog, index) => (
            <Card
              key={index}
              className="flex flex-col gap-6 justify-between rounded-xl  py-6  shadow-sm border-2 hover:border-accent/50  hover:shadow-lg h-full   transition-all duration-300 ease-out
              hover:-translate-y-1"
            >
              <CardHeader className="px-6 flex flex-col items-start">
                <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold  text-secondary-foreground bg-primary-100  w-fit mb-2">
                  {blog.category}
                </div>
                <span className="font-semibold text-xl">{blog.title}</span>
                <span className="text-muted-foreground text-sm">
                  {blog.description}
                </span>
              </CardHeader>
              <CardFooter className="px-6 flex ">
                <Button
                  href={blog.href}
                  className="w-full h-9 px-4 py-2 text-warning-foreground"
                  color="warning"
                >
                  Devamını Oku
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
