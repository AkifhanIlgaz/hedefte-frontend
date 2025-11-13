"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";

export default function FAQ() {
  return (
    <section id="sss" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-lg text-muted-foreground">
            Merak ettiklerinizin yanıtları burada.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion
            className="space-y-4"
            selectionMode="single"
            variant="light"
          >
            <AccordionItem
              key="item-1"
              title="Denemelerimi nasıl analiz edebilirim?"
              className="text-sm text-muted-foreground"
            >
              HEDEFTE sayesinde deneme netlerinizi analiz edebilir, güçlü ve
              zayıf yönlerinizi görebilirsiniz.
            </AccordionItem>

            <AccordionItem
              key="item-2"
              title="  Konu takibini nasıl yaparım?"
              className="text-sm text-muted-foreground"
            >
              Tüm konuları sistematik olarak takip edebilir, ilerlemenizi
              görselleştirebilirsiniz.
            </AccordionItem>

            <AccordionItem
              key="item-3"
              title="Hızlı okuma bana ne kazandırır?"
              className="text-sm text-muted-foreground"
            >
              Paragraf sorularını daha hızlı çözebilir, okuma ve anlama hızınızı
              artırabilirsiniz.
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
