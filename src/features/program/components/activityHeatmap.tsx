import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { months, weekDays } from "../data";
import { Heatmap } from "../types";
import { getWeeks } from "../utils";
import ActivityTooltip from "./activityTooltip";

interface ActivityHeatmapProps {
  heatmap: Heatmap;
}

export default function ActivityHeatmap({ heatmap }: ActivityHeatmapProps) {
  const weeks = getWeeks(heatmap);

  return (
    <Card className="p-2 max-w-6xl">
      <CardHeader>
        <h1 className="text-xl font-bold mb-2">Çalışın Gardaş</h1>
      </CardHeader>
      <CardBody className="flex items-center">
        <div className="flex ">
          <div className="flex flex-col justify-end gap-1 mr-4 text-xs">
            {weekDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-flow-col text-xs mb-1">
              {months.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>

            <div className="flex">
              {weeks.map((week, i) => (
                <div key={i} className="flex flex-col gap-1 mr-1">
                  {week.map((activity, i) => (
                    <ActivityTooltip key={i} activity={activity} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter>
        <div className="flex  items-center justify-center text-xs  gap-1 ml-auto ">
          Az
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`size-3 rounded bg-activity-${i}`} />
          ))}
          Çok
        </div>
      </CardFooter>
    </Card>
  );
}
