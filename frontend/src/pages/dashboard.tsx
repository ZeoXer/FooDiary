import { useState, useEffect } from "react";
import { Chart, ChartEvent } from "chart.js/auto";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";

import DefaultLayout from "@/layouts/default";

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
  const maxCalories = 2500; // Maximum calorie value (for scaling the chart)
  const BMR = 2000; // Basal Metabolic Rate (BMR)

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
        {/* Week navigation and chart */}
        <div className="w-full max-w-lg p-4 bg-gray-100 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setCurrentWeek((prev) => Math.max(prev - 1, 0))}
            >
              {"< Previous Week"}
            </button>
            <h2 className="text-lg font-semibold">
              2024 Oct. {7 + currentWeek * 7}-13
            </h2>
            <button
              className="text-blue-500 hover:underline"
              onClick={() =>
                setCurrentWeek((prev) =>
                  Math.min(prev + 1, weeklyCalories.length - 1)
                )
              }
            >
              {"Next Week >"}
            </button>
          </div>
          <div className="relative w-full h-40 bg-gray-200 rounded mt-4">
            <div className="absolute inset-0 flex items-end gap-2 justify-center">
              {calorieData.map(({ day, totalCalories }, index) => {
                const heightPercentage = (totalCalories / maxCalories) * 100;

                console.log(
                  "Day:",
                  day,
                  "Calories:",
                  totalCalories,
                  "Height:",
                  heightPercentage
                );

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center"
                    style={{ width: "40px" }}
                  >
                    <div
                      className="bg-blue-400 w-full rounded border border-black"
                      style={{
                        height: `${heightPercentage}%`, // Dynamic height
                        transition: "height 0.3s ease",
                      }}
                    />
                    <button
                      className={`text-xs mt-1 ${
                        selectedDay === day ? "font-bold text-blue-500" : ""
                      }`}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  </div>
                );
              })}
            </div>
            <div
              className="absolute left-0 right-0 border-t-2 border-red-500"
              style={{ top: `${(BMR / maxCalories) * 100}%` }}
            >
              <span className="absolute -top-4 left-2 text-xs font-medium text-red-500">
                BMR
              </span>
            </div>
          </div>
        </div>

        {/* Detailed calorie information */}
        <div className="w-full max-w-lg p-4 bg-gray-200 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{selectedDay}</h3>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">Total Calories</span>
            <span className="text-lg font-bold">
              {calorieData.find(({ day }) => day === selectedDay)
                ?.totalCalories ?? 0}
            </span>
          </div>
          <hr className="border-gray-400 mb-4" />
          {/* Meals */}
          {[
            { meal: "Breakfast", calories: 350 },
            { meal: "Lunch", calories: 850 },
            { meal: "Dinner", calories: 750 },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">{item.meal}</span>
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.calories}</span>
                <button className="w-6 h-6 bg-blue-300 rounded-full text-white flex items-center justify-center">
                  ...
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">
              Add
            </button>
          </div>
        </div>

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
