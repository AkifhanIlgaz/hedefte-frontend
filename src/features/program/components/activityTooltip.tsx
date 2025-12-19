import { Chip, Tooltip } from "@heroui/react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Flag } from "lucide-react";
import { DailyActivity } from "../types";
import { getColor } from "../utils";

interface ActivityTooltipProps {
  activity: DailyActivity;
}

export default function ActivityTooltip({ activity }: ActivityTooltipProps) {
  const isExamDay =
    activity.date === "2026-06-20" || activity.date === "2026-06-21";
  const formattedDate = format(new Date(activity.date), "d LLLL", {
    locale: tr,
  });

  const examDayContent = (
    <div className="p-2 text-center text-sm ">
      <div className="font-bold">Sınav Günü</div>
      <div className="text-xs ">Başarılar!</div>
    </div>
  );

  const dayContent = (
    <div className="p-2 space-y-1">
      <div className="text-sm font-semibold text-center">{formattedDate}</div>
      <div className="flex items-center justify-center gap-2">
        <Chip className="text-[0.6rem]" size="sm" color="success" variant="dot">
          {activity.activity.sessions} oturum
        </Chip>
        <Chip className="text-[0.6rem]" size="sm" color="warning" variant="dot">
          {activity.activity.duration} dk
        </Chip>
        <Chip
          className="text-[0.6rem]"
          size="sm"
          color="secondary"
          variant="dot"
        >
          {activity.activity.questions} soru
        </Chip>
      </div>
    </div>
  );

  return (
    <Tooltip
      size="sm"
      closeDelay={0}
      delay={0}
      content={isExamDay ? examDayContent : dayContent}
    >
      <div
        className={`size-4 rounded flex items-center justify-center  ${
          isExamDay
            ? "bg-rose-600 dark:bg-rose-700  "
            : getColor(activity.activity)
        }`}
      >
        {isExamDay && <Flag className="size-3 text-white font-extrabold" />}
      </div>
    </Tooltip>
  );
}
