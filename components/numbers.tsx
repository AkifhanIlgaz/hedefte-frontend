export default function Numbers() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 ">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-primary">
              10K+
            </div>
            <div className="text-sm text-muted-foreground">Aktif Öğrenci</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-primary">
              50K+
            </div>
            <div className="text-sm text-muted-foreground">
              Analiz Edilen Deneme
            </div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-accent">
              %25
            </div>
            <div className="text-sm text-muted-foreground">
              Ortalama Net Artışı
            </div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-accent">
              4.8
            </div>
            <div className="text-sm text-muted-foreground">
              Öğrenci Memnuniyeti
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
