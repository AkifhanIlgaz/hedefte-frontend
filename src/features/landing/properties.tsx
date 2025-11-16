import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  BookOpen,
  Calendar,
  ChartColumn,
  Target,
  Users,
  Zap,
} from "lucide-react";

export default function Properties() {
  const features = [
    {
      title: "Deneme Analizi",
      description: "Denemelerinizi analiz edin ve yanlışlarınızı görün.",
      icon: <ChartColumn className="h-6 w-6 text-primary" />,
      iconBg: "bg-primary/10",
      bullets: [
        "Her soruda güçlü ve zayıf yönlerini keşfet.",
        "Konu performansını detaylı raporlarla incele.",
        "Gelişimini grafiklerle adım adım takip et.",
      ],
    },
    {
      title: "Hızlı Okuma",
      description: "Okuma hızınızı artırın, anlama seviyenizi yükseltin.",
      icon: <Zap className="h-6 w-6 text-accent" />,
      iconBg: "bg-accent/10",
      bullets: [
        "Okuma hızını bilimsel yöntemlerle geliştir.",
        "Günlük egzersizlerle istikrarlı ilerle.",
        "Hızını ve anlama gücünü düzenli olarak ölç.",
      ],
    },
    {
      title: "Kişisel Çalışma Planı",
      description: "Kendinize özel çalışma programı oluşturun.",
      icon: <Calendar className="h-6 w-6 text-primary" />,
      iconBg: "bg-primary/10",
      bullets: [
        "Hedeflerine göre kişisel çalışma planı oluştur.",
        "Her gün için net görevlerle ilerlemeni koru.",
        "Gelişimini ve motivasyonunu birlikte takip et.",
      ],
    },
    {
      title: "Konu Takibi",
      description: "Tamamladığınız konuları sistematik şekilde izleyin.",
      icon: <BookOpen className="h-6 w-6 text-accent" />,
      iconBg: "bg-accent/10",
      bullets: [
        "TYT ve AYT tüm konular tek ekranda.",
        "Nerede kaldığını gör, ilerlemeni takip et.",
        "Eksik konularını hatırlatmalarla tamamla.",
      ],
    },
    {
      title: "Topluluk Desteği",
      description: "Binlerce öğrenci ile bilgi paylaşın.",
      icon: <Users className="h-6 w-6 text-primary" />,
      iconBg: "bg-primary/10",
      bullets: [
        "Yalnız değilsin; seninle birlikte bir topluluk var.",
        " Sorularını sor, cevap al, birlikte öğren.",
        "Deneyimlerini paylaş, başkalarına ilham ol.",
      ],
    },
    {
      title: "Hedef Takibi",
      description: "Hedefinize olan mesafenizi görün.",
      icon: <Target className="h-6 w-6 text-accent" />,
      iconBg: "bg-accent/10",
      bullets: [
        "Performansını anlık olarak gör ve değerlendir.",
        "Başarı grafikleriyle ilerlemeni takip et.",
        "Hedeflerine göre stratejini güncelle.",
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24" id="properties">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            Başarıya Giden Yolda Yanınızdayız !
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            <span className="text-pretty text-primary font-semibold">
              HEDEFTE
            </span>{" "}
            , sınav sürecinde seni analizlerle, planlamayla ve verimli çalışma
            alışkanlıklarıyla destekler.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="flex flex-col gap-2 rounded-xl py-3 shadow-sm border-2 hover:border-primary/50  hover:shadow-lg h-full   transition-all duration-300 ease-out
              hover:-translate-y-1"
            >
              <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-6">
                <div
                  className={`size-12 rounded-lg flex items-center justify-center mb-2 ${feature.iconBg}`}
                >
                  {feature.icon}
                </div>
                <div className="leading-none font-semibold">
                  {feature.title}
                </div>
              </CardHeader>
              <CardBody className="px-6 pt-0 ">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {feature.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          feature.iconBg.includes("primary")
                            ? "bg-primary"
                            : "bg-accent"
                        }`}
                      ></div>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
