"use client";

import { Field } from "@/src/features/profil/data";
import { createClient } from "@/src/lib/supabase/client";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Award, BarChart3, Info, Plus, Target } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function Page() {
  const [field, setField] = useState<Field | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      const userField = user?.user_metadata?.examInfo?.field as Field;
      setField(userField ?? "Sayısal");
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Deneme Analizlerim"
        description="Çözdüğün denemelerinizi burada görebilirsiniz."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4 ">
          {/* Çözülen Deneme Sayısı */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 text-sm font-medium text-muted-foreground">
                Çözülen Deneme Sayısı
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardBody>
                <p className="text-3xl font-bold text-foreground">27</p>
              </CardBody>
            </Card>

            {/* Ortalama Net */}
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardHeader className="text-sm font-medium text-muted-foreground">
                  Ortalama Net
                </CardHeader>
                <Target className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardBody>
                <p className="text-3xl font-bold text-foreground">58.4</p>
              </CardBody>
            </Card>

            {/* Maksimum Net */}
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardHeader className="text-sm font-medium text-muted-foreground">
                  Maksimum Net
                </CardHeader>
                <Award className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardBody>
                <p className="text-3xl font-bold text-foreground">72</p>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 text-sm font-bold text-muted-foreground">
              <span>TYT Denemelerim</span>
              <Select
                size="sm"
                className="ml-auto h-7 text-xs w-24"
                defaultSelectedKeys={new Set(["all"])}
              >
                <SelectItem key="all">Tümü</SelectItem>
                <SelectItem key="lastMonth">Son Ay</SelectItem>
                <SelectItem key="lastYear">Son Yıl</SelectItem>
              </Select>
            </CardHeader>
            <CardBody>
              <LineChart
                style={{
                  width: "100%",
                  maxWidth: "700px",
                  maxHeight: "70vh",
                  aspectRatio: 1.618,
                }}
                responsive
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="uv"
                  stroke="#82ca9d"
                  strokeWidth={3}
                  isAnimationActive={true}
                />
              </LineChart>
            </CardBody>
            <CardFooter className="flex items-center justify-center gap-2">
              <Button
                className="w-full"
                color="secondary"
                startContent={<Info className="size-5" />}
              >
                Detayli Analiz
              </Button>
              <Button
                color="primary"
                className="w-full"
                startContent={<Plus className="size-5" />}
              >
                Deneme ekle
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          {/* Çözülen Deneme Sayısı */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 text-sm font-medium text-muted-foreground">
                Çözülen Deneme Sayısı
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardBody>
                <p className="text-3xl font-bold text-foreground">27</p>
              </CardBody>
            </Card>

            {/* Ortalama Net */}
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardHeader className="text-sm font-medium text-muted-foreground">
                  Ortalama Net
                </CardHeader>
                <Target className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardBody>
                <p className="text-3xl font-bold text-foreground">58.4</p>
              </CardBody>
            </Card>

            {/* Maksimum Net */}
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardHeader className="text-sm font-medium text-muted-foreground">
                  Maksimum Net
                </CardHeader>
                <Award className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardBody>
                <p className="text-3xl font-bold text-foreground">72</p>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 text-sm font-bold text-muted-foreground">
              <span>TYT Denemelerim</span>
              <Select
                size="sm"
                className="ml-auto h-7 text-xs w-24"
                defaultSelectedKeys={new Set(["all"])}
              >
                <SelectItem key="all">Tümü</SelectItem>
                <SelectItem key="lastMonth">Son Ay</SelectItem>
                <SelectItem key="lastYear">Son Yıl</SelectItem>
              </Select>
            </CardHeader>
            <CardBody>
              <LineChart
                style={{
                  width: "100%",
                  maxWidth: "700px",
                  maxHeight: "70vh",
                  aspectRatio: 1.618,
                }}
                responsive
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#8884d8"
                  strokeWidth={3}
                  isAnimationActive={true}
                />
              </LineChart>
            </CardBody>
            <CardFooter className="flex items-center justify-center gap-2">
              <Button
                className="w-full"
                color="secondary"
                startContent={<Info className="size-5" />}
              >
                Detayli Analiz
              </Button>
              <Button
                color="primary"
                className="w-full"
                startContent={<Plus className="size-5" />}
              >
                Deneme ekle
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 text-sm font-bold text-muted-foreground">
          <span>TYT Denemelerim</span>
          <Select
            size="sm"
            className="ml-auto h-7 text-xs w-24"
            defaultSelectedKeys={new Set(["all"])}
          >
            <SelectItem key="all">Tümü</SelectItem>
            <SelectItem key="lastMonth">Son Ay</SelectItem>
            <SelectItem key="lastYear">Son Yıl</SelectItem>
          </Select>
        </CardHeader>
        <CardBody>
          <LineChart
            style={{
              width: "100%",
              maxHeight: "70vh",
              aspectRatio: 1.618,
            }}
            responsive
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--muted)"
              strokeDasharray="3 3"
              opacity={0.4}
            />
            <XAxis
              dataKey="name"
              tickMargin={8}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              width="auto"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
              domain={["dataMin - 2", "dataMax + 2"]}
              label={{
                value: "Net",
                angle: -90,
                position: "insideLeft",
                style: {
                  textAnchor: "middle",
                  fill: "var(--muted-foreground)",
                },
              }}
            />
            <Tooltip
              wrapperStyle={{
                background: "var(--card)",
                color: "var(--card-foreground)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
              }}
              contentStyle={{
                background: "var(--card)",
                color: "var(--card-foreground)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
              }}
              itemStyle={{
                color: "var(--foreground)",
              }}
              labelStyle={{
                color: "var(--primary)",
              }}
            />
            <Legend
              wrapperStyle={{
                color: "var(--muted-foreground)",
              }}
            />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="var(--chart-1)"
              strokeWidth={3}
              isAnimationActive={true}
              dot={{ fill: "var(--accent)", strokeWidth: 2, r: 5 }}
              activeDot={{
                r: 8,
                fill: "var(--chart-4)",
                stroke: "var(--card)",
                strokeWidth: 2,
              }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="uv"
              stroke="var(--chart-2)"
              strokeWidth={3}
              isAnimationActive={true}
              dot={{ fill: "var(--accent)", strokeWidth: 2, r: 5 }}
              activeDot={{
                r: 8,
                fill: "var(--chart-5)",
                stroke: "var(--card)",
                strokeWidth: 2,
              }}
              connectNulls={false}
            />
          </LineChart>
        </CardBody>
        <CardFooter className="flex items-center justify-center gap-2">
          <Button
            className="w-full"
            color="secondary"
            startContent={<Info className="size-5" />}
          >
            Detayli Analiz
          </Button>
          <Button
            color="primary"
            className="w-full"
            startContent={<Plus className="size-5" />}
          >
            Deneme ekle
          </Button>
        </CardFooter>
      </Card>

      {/*<TYTExamsTable />

      <Button as={Link} href={`/dashboard/analiz/ekle?exam=TYT`}>
        TYT Analiz Ekle
      </Button>

      <Button as={Link} href={`/dashboard/analiz/ekle?exam=AYT&field=${field}`}>
        AYT Analiz Ekle
      </Button>*/}
    </div>
  );
}
