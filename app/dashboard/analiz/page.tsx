import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

export default function Page() {
  return (
    <Button as={Link} href="/dashboard/analiz/ekle">
      Analiz Ekle
    </Button>
  );
}
