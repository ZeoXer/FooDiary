import { useState, useEffect } from "react";
import { Chart } from "chart.js/auto";
import { Card, CardHeader, CardBody } from "@nextui-org/card";

import DefaultLayout from "@/layouts/default";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { HorizontalDotsIcon } from "@/components/icons";

export default function DashboardPage() {
  const [selectedDay, setSelectedDay] = useState("Sun."); // Default selected day
  const [currentWeek, setCurrentWeek] = useState(0); // Default week index

  // Weekly calorie data
  const weeklyCalories = [
    [
      { day: "Sun.", totalCalories: 1500 },
      { day: "Mon.", totalCalories: 2200 },
      { day: "Tue.", totalCalories: 1800 },
      { day: "Wed.", totalCalories: 2000 },
      { day: "Thr.", totalCalories: 1700 },
      { day: "Fri.", totalCalories: 2500 },
      { day: "Sat.", totalCalories: 2300 },
    ],
    [
      { day: "Sun.", totalCalories: 1600 },
      { day: "Mon.", totalCalories: 2100 },
      { day: "Tue.", totalCalories: 1900 },
      { day: "Wed.", totalCalories: 1800 },
      { day: "Thr.", totalCalories: 2400 },
      { day: "Fri.", totalCalories: 2600 },
      { day: "Sat.", totalCalories: 2200 },
    ],
  ];

  const calorieData = weeklyCalories[currentWeek]; // Get data for the current week
  const BMR = 2000; // Basal Metabolic Rate (BMR)
  const meals = [
    { meal: "Breakfast", calories: 350 },
    { meal: "Lunch", calories: 850 },
    { meal: "Dinner", calories: 750 },
  ];

  const handleBarClick = (day: string) => {
    setSelectedDay(day);
  };

  useEffect(() => {
    if (Chart.getChart("calories")) {
      Chart.getChart("calories")?.destroy();
    }

    const ctx = document.getElementById("calories") as HTMLCanvasElement | null;

    if (ctx) {
      const maxCalories = Math.max(
        ...calorieData.map((row) => row.totalCalories)
      );

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: calorieData.map((row) => row.day),
          datasets: [
            {
              type: "bar",
              label: "當日總熱量",
              data: calorieData.map((row) => row.totalCalories),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              type: "line",
              label: "BMR",
              data: calorieData.map(() => BMR),
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
              pointRadius: 0,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: maxCalories + 200,
            },
          },
          onClick: (_, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;

              handleBarClick(calorieData[index].day);
            }
          },
        },
      });
    }
  }, [currentWeek]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        {/* 周切換 */}
        <div className="w-full max-w-lg p-4 bg-gray-100 rounded-lg shadow">
          <div className="flex items-center justify-between">
            {/* Previous Week */}
            <button
              aria-label="Previous Week"
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transi2tion"
              onClick={() => setCurrentWeek((prev) => Math.max(prev - 1, 0))}
            >
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <h2 className="text-lg font-semibold">
              Week of {7 + currentWeek * 7}-{13 + currentWeek * 7}
            </h2>

            {/* Next Week */}
            <button
              aria-label="Next Week"
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              onClick={() =>
                setCurrentWeek((prev) =>
                  Math.min(prev + 1, weeklyCalories.length - 1)
                )
              }
            >
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 圖表 */}
        <div className="w-full max-w-lg">
          <canvas id="calories" />
        </div>

        {/* 詳細熱量信息 */}
        <Card className="w-full max-w-lg px-2">
          <CardHeader>
            <h3 className="block text-lg font-semibold">{selectedDay}</h3>
          </CardHeader>
          <CardBody>
            <div className="flex justify-between mb-2">
              <p>當日總熱量</p>
              <p className="text-lg font-semibold">
                {calorieData.find(({ day }) => day === selectedDay)
                  ?.totalCalories ?? 0}
              </p>
            </div>
            <Divider />
            <div className="mb-2">
              {meals.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center my-2"
                >
                  <h4 className="text-sm">{item.meal}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-lg">{item.calories}</p>
                    <Button isIconOnly radius="full" size="sm">
                      <HorizontalDotsIcon className="fill-white" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button>新增紀錄</Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  );
}
