import { useState, useEffect, useCallback } from "react";
import { Chart } from "chart.js/auto";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { Link, useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { getMealRecord } from "@/apis/record";
import { HorizontalDotsIcon } from "@/components/icons";
import { getUserData } from "@/apis/user";

interface MealRecord {
  whichMeal: "Breakfast" | "Lunch" | "Dinner" | "Other";
  calories: number;
}

export default function DashboardPage() {
  const [BMR, setBMR] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState("Sun.");
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }));
  const [currentWeek, setCurrentWeek] = useState(0);
  const [weeklyCalories, setWeeklyCalories] = useState<
    Array<Array<{ date: string; day: string; totalCalories: number }>>
  >([]);
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState([
    { meal: "Breakfast", calories: 0, date: selectedDate },
    { meal: "Lunch", calories: 0, date: selectedDate },
    { meal: "Dinner", calories: 0, date: selectedDate },
    { meal: "Other", calories: 0, date: selectedDate },
  ]);
  const [Todaymeals, setTodaymeals] = useState([
    { meal: "Breakfast", calories: 0 },
    { meal: "Lunch", calories: 0 },
    { meal: "Dinner", calories: 0 },
    { meal: "Other", calories: 0 },
  ]);

  const [calorieData, setCalorieData] = useState<
    Array<{ date: string; day: string; totalCalories: number }>
  >([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDataAndWeeklyCalories = async () => {
      setLoading(true);
      try {
        const userDataResponse = await getUserData();
  
        if (!userDataResponse || userDataResponse.status === 401) {
          console.log("Unauthorized, redirecting to login.");
          navigate("/login");
          return;
        }
  
        if (userDataResponse.userData?.bmr) {
          setBMR(userDataResponse.userData.bmr);
        }
  
        const userEmail = userDataResponse.userData?.userID.email;
        const cacheKey = `user_${userEmail}_weeklyData`;
        const cacheTimestampKey = `${cacheKey}_timestamp`;
        const cacheExpirationTime = 1000 * 60 * 60;
  
        sessionStorage.setItem("currentUserEmail", userEmail);
  
        // 載入暫存資料 (如果有)
        const cachedData = sessionStorage.getItem(cacheKey);
        const cacheTimestamp = sessionStorage.getItem(cacheTimestampKey);
        const isCacheValid =
          cachedData &&
          cacheTimestamp &&
          Date.now() - parseInt(cacheTimestamp) < cacheExpirationTime;
  
         if (cachedData && isCacheValid) {
          const cached = JSON.parse(cachedData);
          setWeeklyCalories(cached.weeklyCalories);
        } else {
          const weeksData = [];
          for (let week = 1; week > -3; week--) {
            const startOfWeek = new Date();
            startOfWeek.setDate(
              startOfWeek.getDate() - startOfWeek.getDay() - (week + 2) * 7
            );
  
            const promises = Array.from({ length: 7 }, (_, i) => {
              const date = new Date(startOfWeek);
              date.setDate(date.getDate() + i);
              const formattedDate = date
                .toLocaleDateString("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replace(/\//g, "-");
  
              const dayName = [
                "Sun.",
                "Mon.",
                "Tue.",
                "Wed.",
                "Thr.",
                "Fri.",
                "Sat.",
              ][i];
  
              return getMealRecord({ date: formattedDate })
                .then((mealRecord) => {
                  const dailyMeals = { Breakfast: 0, Lunch: 0, Dinner: 0, Other: 0 };
                  mealRecord?.forEach((meal: MealRecord) => {
                    dailyMeals[meal.whichMeal] = meal.calories;
                  });
  
                  const totalCalories =
                    dailyMeals.Breakfast +
                    dailyMeals.Lunch +
                    dailyMeals.Dinner +
                    dailyMeals.Other;
  
                  return {
                    date: formattedDate,
                    day: dayName,
                    totalCalories,
                    meals: dailyMeals,
                  };
                })
                .catch((error) => {
                  console.error(
                    `Error fetching meal record for ${formattedDate}:`,
                    error
                  );
                  return {
                    date: formattedDate,
                    day: dayName,
                    totalCalories: 0,
                    meals: { Breakfast: 0, Lunch: 0, Dinner: 0, Other: 0 },
                  };
                });
            });
  
            const weekData = await Promise.all(promises);
            weeksData.push(weekData);
          }
  
          setWeeklyCalories(weeksData);
  
          // 儲存資料到暫存
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({ weeklyCalories: weeksData })
          );
          sessionStorage.setItem(cacheTimestampKey, Date.now().toString());
        }
  
        try {
          const mealRecords = await getMealRecord({ date: selectedDate });
          console.log(mealRecords);
  
          if (!mealRecords || mealRecords.message === "未找到該日期的用餐記錄") {
            console.log(`No meal records found for ${selectedDate}`);
            setMeals([
              { meal: "Breakfast", calories: 0, date: selectedDate },
              { meal: "Lunch", calories: 0, date: selectedDate },
              { meal: "Dinner", calories: 0, date: selectedDate },
              { meal: "Other", calories: 0, date: selectedDate },
            ]);
            setLoading(false);
            return;
          }
  
          const dailyMeals = { Breakfast: 0, Lunch: 0, Dinner: 0, Other: 0 };
          mealRecords.forEach((mealRecord: MealRecord) => {
            const { whichMeal, calories } = mealRecord;
            if (whichMeal === "Breakfast") dailyMeals.Breakfast = calories;
            if (whichMeal === "Lunch") dailyMeals.Lunch = calories;
            if (whichMeal === "Dinner") dailyMeals.Dinner = calories;
            if (whichMeal === "Other") dailyMeals.Other = calories;
          });
  
          setMeals([
            { meal: "Breakfast", calories: dailyMeals.Breakfast, date: selectedDate },
            { meal: "Lunch", calories: dailyMeals.Lunch, date: selectedDate },
            { meal: "Dinner", calories: dailyMeals.Dinner, date: selectedDate },
            { meal: "Other", calories: dailyMeals.Other, date: selectedDate },
          ]);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching daily meals:", error);
        } finally {
          setLoading(false);
        }
  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchUserDataAndWeeklyCalories();
  }, [navigate, selectedDate]);
  

  // useEffect(() => {
  //   const fetchDailyMeals = async () => {
  //     setLoading(true);
  //     try {
  //       const mealRecords = await getMealRecord({ date: selectedDate });
  //       console.log(mealRecords);

  //       if (!mealRecords || mealRecords.message === "未找到該日期的用餐記錄") {
  //         console.log(`No meal records found for ${selectedDate}`);
  //         setMeals([
  //           { meal: "Breakfast", calories: 0 },
  //           { meal: "Lunch", calories: 0 },
  //           { meal: "Dinner", calories: 0 },
  //           { meal: "Other", calories: 0 },
  //         ]);
  //         return;
  //       }

  //       const dailyMeals = { Breakfast: 0, Lunch: 0, Dinner: 0, Other: 0 };
  //       mealRecords.forEach((mealRecord: MealRecord) => {
  //         const { whichMeal, calories } = mealRecord;
  //         if (whichMeal === "Breakfast") dailyMeals.Breakfast = calories;
  //         if (whichMeal === "Lunch") dailyMeals.Lunch = calories;
  //         if (whichMeal === "Dinner") dailyMeals.Dinner = calories;
  //         if (whichMeal === "Other") dailyMeals.Other = calories;
  //       });

  //       setMeals([
  //         { meal: "Breakfast", calories: dailyMeals.Breakfast },
  //         { meal: "Lunch", calories: dailyMeals.Lunch },
  //         { meal: "Dinner", calories: dailyMeals.Dinner },
  //         { meal: "Other", calories: dailyMeals.Other },
  //       ]);
  //       setLoading(false);        
  //     } catch (error) {
  //       console.error("Error fetching daily meals:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDailyMeals();
  // }, [selectedDate]);



  // 更新 calorieData
  useEffect(() => {
    if (weeklyCalories[currentWeek]) {
      const updatedData = weeklyCalories[currentWeek].map((item) => {
        const date = item.date; 

        return {
          ...item,
          date: date, 
        };
      });

      setCalorieData(updatedData);
    }
  }, [currentWeek, weeklyCalories]);


  const handleBarClick = useCallback((day: string, date: string) => {
    setSelectedDay(day);
    setSelectedDate(date);
  }, []);

  useEffect(() => {
    const initializeChart = async () => {
      if (loading) return;
      try {
        const chartInstance = Chart.getChart("calories");
        if (chartInstance) {
          chartInstance.destroy();
        }
  
        const ctx = document.getElementById("calories") as HTMLCanvasElement | null;
        if (!ctx) return;
  
        const daysOfWeek = ["Sun.", "Mon.", "Tue.", "Wed.", "Thr.", "Fri.", "Sat."];
        const todayIndex = new Date().getDay();
        const todayLabel = daysOfWeek[todayIndex];
  
        const totalCaloriesSelectday = meals.reduce((sum, meal) => sum + meal.calories, 0);
        const totalCaloriesToday = Todaymeals.reduce((sum, meal) => sum + meal.calories, 0);
  
        const maxCalories = Math.max(
          ...calorieData.map((row) => row.totalCalories),
          totalCaloriesSelectday
        );
  
        const chart = new Chart(ctx, {
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
              legend: { display: true },
            },
            scales: {
              y: { beginAtZero: true, max: maxCalories + 200 },
            },
            onClick: (_, elements) => {
              if (elements.length > 0) {
                const index = elements[0].index;
                const selectedDay = calorieData[index].day;
                const selectedDate = calorieData[index].date;
                handleBarClick(selectedDay, selectedDate);
              }
            },
          },
        });
  
        // 獲取選擇日期的餐飲記錄
        const todayDate = new Date().toLocaleDateString("zh-TW");
        const mealRecords = await getMealRecord({ date: todayDate });
        if (!mealRecords || mealRecords.message === "未找到該日期的用餐記錄") {
          console.log(`No meal records found for ${selectedDate}`);
          setTodaymeals([
            { meal: "Breakfast", calories: 0 },
            { meal: "Lunch", calories: 0 },
            { meal: "Dinner", calories: 0 },
            { meal: "Other", calories: 0 },
          ]);
          return;
        }
  
        // 處理每日餐飲記錄
        const dailyMeals = { Breakfast: 0, Lunch: 0, Dinner: 0, Other: 0 };
        mealRecords.forEach((mealRecord: MealRecord) => {
          const { whichMeal, calories } = mealRecord;
          if (whichMeal in dailyMeals) {
            dailyMeals[whichMeal] = calories;
          }
        });
  
        setTodaymeals([
          { meal: "Breakfast", calories: dailyMeals.Breakfast },
          { meal: "Lunch", calories: dailyMeals.Lunch },
          { meal: "Dinner", calories: dailyMeals.Dinner },
          { meal: "Other", calories: dailyMeals.Other },
        ]);
  
        // 更新今日熱量資料
        const updateTodayCalories = () => {
          const barDataset = chart.data.datasets[0];
          if (currentWeek === 3) {
            const todayIndexInData = calorieData.findIndex((row) => row.day === todayLabel);
            if (todayIndexInData !== -1) {
              barDataset.data[todayIndexInData] = totalCaloriesToday;
            }
          }
          chart.update();
        };
  
        updateTodayCalories();
      } catch (error) {
        console.error("Error initializing chart:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeChart();
  }, [calorieData, meals, BMR, currentWeek]);
  

const daysOfWeek = ["Sun.", "Mon.", "Tue.", "Wed.", "Thr.", "Fri.", "Sat."];
const todayLabel = daysOfWeek[new Date().getDay()];

const totalCalories =
  selectedDay === todayLabel && currentWeek === 3
    ? meals.reduce((sum, meal) => sum + meal.calories, 0)
    : calorieData.find(({ day }) => day === selectedDay)?.totalCalories ?? 0;

return (
  <DefaultLayout>
    <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10 container mx-auto">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Week Navigation */}
          <div className="w-full max-w-screen-lg p-4 bg-gray-100 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <button
                aria-label="Previous Week"
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                onClick={() =>
                  setCurrentWeek((prev) => Math.max(prev - 1, 0))
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
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <h2 className="text-lg font-semibold">
                Week of {1 + currentWeek * 7}-{7 + currentWeek * 7}
              </h2>

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

          {/* Calories Chart */}
          <div className="w-full max-w-screen-lg">
            <canvas id="calories" />
          </div>

          {/* Meal Records */}
          <Card className="w-full max-w-screen-lg px-4">
            <CardHeader>
              <h3 className="block text-lg font-semibold">{selectedDay}</h3>
            </CardHeader>
            <CardBody>
              <div className="flex justify-between mb-2">
                <p>當日總熱量 (24小時內更新)</p>
                <p className="text-lg font-semibold">{totalCalories}</p>
              </div>
              <Divider />
              <div className="mb-2">
                {meals
                  .filter((item) => item.calories > 0)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center my-2"
                    >
                      <h4 className="text-sm">{item.meal}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-lg">{item.calories}</p>
                        <Link to={`/foodcontent?whichMeal=${item.meal}&date=${item.date}`}>
                          <Button isIconOnly radius="full" size="sm">
                            <HorizontalDotsIcon className="fill-white" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>


              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button
                  onClick={() => {
                    navigate(`/foodrecord?date=${new Date().toLocaleDateString("zh-TW")}`);
                  }}
                >
                  新增今天的紀錄
                </Button>
                <Button
                  onClick={() => {
                    navigate(`/foodrecord?date=${selectedDate}`);
                  }}
                >
                  新增點選的當日紀錄
                </Button>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </section>
  </DefaultLayout>
);
}
