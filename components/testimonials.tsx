import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      initials: "AY",
      name: "Ayşe Yılmaz",
      field: "SAY Öğrencisi",
      comment:
        "Ben sayısal öğrencisiyim ve HEDEFTE’yi kullanmaya başladığımdan beri netlerim ciddi şekilde arttı. Analizlerde yanlış yaptığım konuları hemen görebiliyorum, ilerleme grafikleri hangi konularda eksik olduğumu gösteriyor. Eksik konularımı çalışma programıma eklemek çok kolay, hızlı okuma egzersizleriyle de sınav hızımı geliştirdim. Artık çalışmak hem daha verimli hem de daha eğlenceli!",
    },
    {
      initials: "MK",
      name: "Mehmet Kaya",
      field: "EA Öğrencisi",
      comment:
        "Hızlı okuma modülü sayesinde paragraf sorularını çok daha hızlı ve doğru çözebiliyorum. Günlük egzersizler ve ilerleme takibi gerçekten fark yaratıyor. Bu platform sayesinde sınav temposuna daha hazır hissediyorum!",
    },
    {
      initials: "ZD",
      name: "Zeynep Demir",
      field: "SÖZ Öğrencisi",
      comment:
        "Konu takibi sayesinde eksik olduğum konuları hemen görebiliyorum ve ilerleme grafikleriyle gelişimimi takip edebiliyorum. Eksik konuları çalışma planıma kolayca ekleyebiliyorum ve hatırlatıcılarla hiçbir şeyi unutmuyorum. Böylece çalışırken daha düzenli ve odaklı kalabiliyorum.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            Öğrencilerimiz Ne Diyor?
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, idx) => (
            <TestimonialCard key={idx} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface Testimonial {
  initials: string;
  name: string;
  field: string;
  comment: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card
      className="relative p-6 h-full shadow-sm border-2 hover:border-warning/50  hover:shadow-lg    transition-all duration-300 ease-out
    hover:-translate-y-1"
    >
      <CardHeader>
        <div className="flex gap-1 ">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
          ))}
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-muted-foreground leading-relaxed  italic">
          "{testimonial.comment}"
        </p>
      </CardBody>
      <CardFooter>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold">
              {testimonial.initials}
            </span>
          </div>
          <div>
            <p className="font-semibold text-foreground">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.field}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
