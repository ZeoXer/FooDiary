import { useState, useEffect } from "react";
import { Chart } from "chart.js/auto";
import { Card, CardHeader, CardBody, Skeleton } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";

import DefaultLayout from "@/layouts/default";
import { getMealRecord } from "@/apis/record";
import { HorizontalDotsIcon } from "@/components/icons";
import { getUserData } from "@/apis/user";

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Other";

type MealRecord = {
  _id: string;
  whichMeal: MealType;
  mealTime: string;
  calories: number;
};

type WeeklyData = Array<{
  date: string;
  day: number;
  totalCalories: number;
  meal: Array<MealRecord>;
}>;

const daysOfWeek = ["Sun.", "Mon.", "Tue.", "Wed.", "Thr.", "Fri.", "Sat."];

export default function DashboardPage() {
  const [BMR, setBMR] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [weekRange, setWeekRange] = useState({ startDate: "", endDate: "" });
  const [selectedIdx, setSelectedIdx] = useState(new Date().getDay());
  const [weeklyData, setWeeklyData] = useState<WeeklyData | undefined>();

  const navigate = useNavigate();

  const getUserBMR = async () => {
    const userData = await getUserData();

    if (!userData || userData.status === 401) {
      console.log("Unauthorized, redirecting to login.");
      navigate("/login");

      return;
    }

    if (userData.userData?.bmr) {
      setBMR(userData.userData.bmr);
    }
  };

  const getStartAndEndDateOfAWeek = (date: Date) => {
    const dayOfWeek = date.getDay();

    const startDate = new Date(date);

    startDate.setDate(date.getDate() - dayOfWeek);
    const startDateString = startDate.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const endDate = new Date(startDate);

    endDate.setDate(startDate.getDate() + 6);
    const endDateString = endDate.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return { startDateString, endDateString };
  };

  const getMealRecords = async (startDate: string, endDate: string) => {
    const endDateOver = new Date(endDate);

    endDateOver.setDate(endDateOver.getDate() + 1);
    const endDateOverString = endDateOver.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const meals = await getMealRecord({
      startDate,
      endDate: endDateOverString,
    });

    return meals;
  };

  const initializeWeeklyData = (startDate: string) => {
    const weeklyData: WeeklyData = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);

      date.setDate(date.getDate() + i);
      weeklyData.push({
        date: date.toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        day: i,
        totalCalories: 0,
        meal: [],
      });
    }

    return weeklyData;
  };

  const renderWeeklyData = (
    weeklyData: WeeklyData,
    mealRecords: Array<MealRecord>
  ) => {
    mealRecords.forEach((mealRecord) => {
      console.log(mealRecord);
      const date = new Date(mealRecord.mealTime);
      const day = date.getDay();
      const meal: MealRecord = {
        _id: mealRecord._id,
        whichMeal: mealRecord.whichMeal,
        mealTime: date.toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        calories: mealRecord.calories,
      };
      const targetDay = weeklyData?.find((item) => item.day === day);

      if (targetDay) {
        targetDay.totalCalories += mealRecord.calories;
        targetDay.meal.push(meal);
      }
    });

    setWeeklyData(weeklyData);
  };

  const updateWeeklyData = async (date: Date = new Date()) => {
    // 取得起始日期  => 搜尋用餐記錄 => 整理資料(日期、週幾、卡路里、內容)
    const { startDateString, endDateString } = getStartAndEndDateOfAWeek(date);

    const weeklyData = initializeWeeklyData(startDateString);

    const mealRecords = await getMealRecords(startDateString, endDateString);

    setWeekRange({ startDate: startDateString, endDate: endDateString });
    renderWeeklyData(weeklyData, mealRecords);
  };

  const updateChart = () => {
    if (!weeklyData) return;

    try {
      const chartInstance = Chart.getChart("calories");

      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = document.getElementById(
        "calories"
      ) as HTMLCanvasElement | null;

      if (!ctx) return;

      const weeklyCalories = weeklyData.map((row) => row.totalCalories);
      const maxWeeklyCalories = Math.max(...weeklyCalories);

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: weeklyData!.map((row) => daysOfWeek[row.day]),
          datasets: [
            {
              type: "bar",
              label: "當日總熱量",
              data: weeklyData!.map((row) => row.totalCalories),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              type: "line",
              label: "BMR",
              data: weeklyData!.map(() => BMR),
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
            legend: { display: true },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: Math.max(maxWeeklyCalories, BMR) + 200,
            },
          },
          onClick: (_, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;

              setSelectedIdx(index);
            }
          },
        },
      });
    } catch (error) {
      console.error("Error initializing chart:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getUserBMR();
    updateWeeklyData();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (weeklyData) {
      updateChart();
    }
  }, [weeklyData]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-4 md:py-6 container mx-auto">
        {/* Week Navigation */}
        <div className="w-full max-w-screen-lg p-4 bg-gray-100 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <button
              aria-label="Previous Week"
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              onClick={() => {
                const startDate = new Date(weekRange.startDate);

                startDate.setDate(startDate.getDate() - 7);
                updateWeeklyData(startDate);
              }}
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

            <h2 className="md:text-lg font-semibold">
              {weekRange.startDate} - {weekRange.endDate}
            </h2>

            <button
              aria-label="Next Week"
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition disabled:cursor-not-allowed"
              onClick={() => {
                const startDate = new Date(weekRange.startDate);

                startDate.setDate(startDate.getDate() + 7);
                updateWeeklyData(startDate);
              }}
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

        {/* Calories Chart */}
        <div className="w-full max-w-screen-lg">
          {isLoading ? (
            <Skeleton className="w-full rounded-lg">
              <div className="h-60 bg-secondary" />
            </Skeleton>
          ) : (
            <canvas id="calories" />
          )}
        </div>

        {/* Meal Records */}
        <Card className="w-full max-w-screen-lg px-4">
          <CardHeader>
            <h3 className="block text-lg font-semibold">
              {daysOfWeek[selectedIdx]}
            </h3>
          </CardHeader>
          <CardBody>
            <div className="flex justify-between mb-2">
              <p>當日總熱量</p>
              <p className="text-lg font-semibold">
                {weeklyData && weeklyData[selectedIdx].totalCalories}
              </p>
            </div>
            <Divider />
            <div className="mb-2">
              {weeklyData &&
                weeklyData[selectedIdx].meal.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center my-2"
                  >
                    <h4 className="text-sm">{item.whichMeal}</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-lg">{item.calories}</p>
                      <Link to={`/foodcontent?id=${item._id}`}>
                        <Button isIconOnly radius="full" size="sm">
                          <HorizontalDotsIcon className="fill-white" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <Button
                color="primary"
                size="lg"
                variant="shadow"
                onPress={() => {
                  navigate("/foodrecord");
                }}
              >
                新增紀錄
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  );
}
