import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { Lesson } from "../../types";

export default function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Card
      as={Link}
      className={`transition-transform duration-150 cursor-pointer hover:-translate-y-0.5 hover:shadow  `}
      isPressable
      href={`${window.location.href}/${lesson.name.toLowerCase()}`}
    >
      <CardHeader className="p-0"></CardHeader>
      <CardBody className="flex items-center gap-4">
        <div className={`p-2 ${lesson.bgClass} rounded-lg`}>
          <lesson.icon className={`w-6 h-6 ${lesson.iconColor}`} />
        </div>
        <div>
          <p className={`text-md ${lesson.iconColor}`}>{lesson.name}</p>
        </div>
      </CardBody>
    </Card>
  );
}
