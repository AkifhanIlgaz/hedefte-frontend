import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

export default function Page() {
  return (
    <div>
      <Button as={Link} href="/dashboard/analiz/ekle?exam=TYT">
        TYT Analiz Ekle
      </Button>

      <Button as={Link} href="/dashboard/analiz/ekle?exam=AYT">
        AYT Analiz Ekle
      </Button>
    </div>
  );
}
