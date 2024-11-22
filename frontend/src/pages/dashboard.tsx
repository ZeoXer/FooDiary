import { useEffect } from "react";
import { Chart, ChartEvent } from "chart.js/auto";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";

import DefaultLayout from "@/layouts/default";

export default function DashboardPage() {
  const data = [
    { weekDay: "Mon", count: 1000 },
    { weekDay: "Tue", count: 800 },
    { weekDay: "Wed", count: 2310 },
    { weekDay: "Thu", count: 1583 },
    { weekDay: "Fri", count: 2233 },
    { weekDay: "Sat", count: 1832 },
    { weekDay: "Sun", count: 1693 },
  ];

  const chartOption = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    onClick: (event: ChartEvent & Event) => {
      const activeElements = Chart.getChart(
        "calories"
      )?.getElementsAtEventForMode(
        event,
        "nearest",
        { intersect: true },
        false
      );

      if (activeElements && activeElements.length > 0) {
        const clickedIndex = activeElements[0].index;
        const clickedData = data[clickedIndex];

        handleBarClick(clickedData);
      }
    },
  };

  const handleBarClick = (data: any) => {
    alert(data.weekDay);
  };

  useEffect(() => {
    if (Chart.getChart("calories")) {
      Chart.getChart("calories")?.destroy();
    }

    (async function () {
      const ctx = document.getElementById(
        "calories"
      ) as HTMLCanvasElement | null;

      if (ctx) {
        new Chart(ctx, {
          data: {
            labels: data.map((row) => row.weekDay),
            datasets: [
              {
                type: "bar",
                label: "卡路里攝取量",
                data: data.map((row) => row.count),
              },
              {
                type: "line",
                label: "BMR",
                data: data.map((_) => 1504),
              },
            ],
          },
          options: chartOption,
        });
      }
    })();
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full max-w-lg justify-center">
          <canvas className="mb-12" id="calories" />
          <Card>
            <CardHeader className="flex gap-3">
              <div className="flex">本日總卡路里</div>
            </CardHeader>
            <Divider />
            <CardBody>test</CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
