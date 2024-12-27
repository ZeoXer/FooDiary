import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import DefaultLayout from "@/layouts/default";
import { getSingleMealRecord, deleteMealRecord, getMealRecord, editMealRecord } from "@/apis/record";
import { getUserData } from "@/apis/user";

type Food = {
  foodName: string;
  weight?: string;
  calories?: string;
};

type FoodEntry = {
  name: string;
  weight?: string;
  calories?: string;
};

type FoodContent = {
  foodName: string;
  weightInGram: number;
  calories: number;
  _id: string;
};

type MealRecord = {
  _id: string;
  userID: string;
  whichMeal: "Breakfast" | "Lunch" | "Dinner";
  mealTime: string;
  foodContent: FoodContent[];
  calories: number;
  suggestion: string;
  __v: number;
};

export default function MealDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const mealType = queryParams.get("whichMeal") || "Lunch";
  const date = queryParams.get("date") || new Date().toLocaleDateString("zh-TW"); // 使用傳入的日期
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userDataResponse = await getUserData();

        if (!userDataResponse || userDataResponse.status === 401) {
          console.log("Unauthorized, redirecting to login.");
          navigate("/login"); 
          return; 
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    checkLoginStatus();
  }, [navigate]);

    const todayDate = new Date().toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const apiDate = new Date().toLocaleDateString("zh-TW");

    const [mealDetails, setMealDetails] = useState({
      meal: mealType,
      timestamp: todayDate,
      estimatedCalories: "0",
    });

    const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
    const [suggestions, setSuggestions] = useState<string>("");
    const [recordID, setRecordID] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const fetchData = async () => {
      try {
        console.log(date);
        console.log(mealType);
        const singleMealRecord = await getSingleMealRecord({ date: date });

        if (singleMealRecord?.length > 0) {
          const filteredRecords = singleMealRecord.filter((record: any) => record.whichMeal === mealType);

          if (filteredRecords.length > 0) {
            const fetchedFoodEntries: FoodEntry[] = filteredRecords.flatMap((record: any) =>
              record.foodDetails.map((food: Food) => ({
                name: food.foodName,
                weight: food.weight,
                calories: food.calories,
              }))
            );

            setFoodEntries(fetchedFoodEntries);

            const totalCalories = filteredRecords.reduce((sum: number, record: any) => {
              return (
                sum +
                record.foodDetails.reduce((foodSum: number, food: Food) => {
                  return foodSum + (food.calories ? parseInt(food.calories) : 0);
                }, 0)
              );
            }, 0);

            setMealDetails({
              meal: mealType,
              timestamp: filteredRecords[0].mealTime,
              estimatedCalories: totalCalories.toString(),
            });

            setRecordID(filteredRecords[0].recordID);

            const fetchedSuggestions: MealRecord[] = await getMealRecord({ date: date });

            const dinnerSuggestion = fetchedSuggestions.find((item: MealRecord) => item.whichMeal === mealType)?.suggestion;

            setSuggestions(dinnerSuggestion || "建議多攝取蔬菜和水果，避免高熱量飲食。");
          } else {
            console.warn("未找到符合餐點類型的紀錄");
          }
        } else {
          console.warn("未找到當前日期的用餐紀錄");
        }
      } catch (error) {
        console.error("獲取餐點數據時出錯:", error);
      }
    };

    const hasFetchedData = useRef(false);

    useEffect(() => {
      if (!hasFetchedData.current) {
        fetchData();
        hasFetchedData.current = true;
      }
    }, [date, queryParams]); 


    const handleBack = () => {
      navigate("/Dashboard");
    };

    const handleDelete = async () => {
      try {
        if (!recordID) {
          alert("無效的餐點紀錄 ID");
          return;
        }
        const response = await deleteMealRecord({ recordID });

        if (response?.success) {
          alert("餐點紀錄已刪除");
          setMealDetails({
            meal: "Lunch",
            timestamp: todayDate,
            estimatedCalories: "0",
          });
          setFoodEntries([]);
          setSuggestions("");
          setRecordID("");
        } else {
          alert("刪除餐點紀錄失敗");
        }
      } catch (error) {
        console.error("刪除餐點紀錄時出錯:", error);
      }
    };

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleSave = async () => {
      try {
        // 檢查食物名稱是否含有非中文或非英文字符
        const isValidFoodName = (name: any) => /^[a-zA-Z\u4e00-\u9fa5]+$/.test(name);
    
        // 檢查所有食物名稱
        for (const entry of foodEntries) {
          if (!isValidFoodName(entry.name)) {
            alert(`食物名稱 "${entry.name}" 含有無效字符。只能包含中文和英文。`);
            return;
          }
        }
    
        const singleMealRecord = await getSingleMealRecord({ date: date });
        console.log(apiDate);
    
        if (singleMealRecord?.length > 0) {
          const filteredRecords = singleMealRecord.filter((record: any) => record.whichMeal === mealType);
    
          if (filteredRecords.length > 0) {
            const recordID = filteredRecords[0].recordID;
            console.log(recordID);
    
            const updatedFoodContent = foodEntries.map((entry) => ({
              foodName: entry.name,
              weightInGram: entry.weight ? parseInt(entry.weight) : 0,
              calories: entry.calories ? parseInt(entry.calories) : 0,
            }));
            console.log(updatedFoodContent);
    
            const response = await editMealRecord({ recordID, foodContent: updatedFoodContent });
            console.log(response);
    
            if (response?.success) {
              alert("餐點紀錄已更新");
              setIsEditing(false);
              fetchData(); 
            } else {
              alert("更新餐點紀錄失敗");
            }
          } else {
            alert("未找到符合餐點類型的紀錄");
          }
        } else {
          alert("未找到當前日期的餐點紀錄");
        }
      } catch (error) {
        console.error("更新餐點紀錄時出錯:", error);
      }
    };
    

    

    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="w-full max-w-lg flex items-center mb-4">
            <button
              aria-label="返回"
              className="text-2xl font-bold text-gray-600 hover:text-gray-900"
              onClick={handleBack}
            >
              &lt;
            </button>
            <h1 className="text-2xl font-bold ml-4">{mealDetails.meal}</h1>
          </div>

          <p className="w-full max-w-lg text-sm text-gray-500">{mealDetails.timestamp}</p>

          <div className="w-full max-w-lg mt-4">
            <h2 className="text-lg font-semibold mb-2">今日飲食</h2>
            <div className="border p-4 rounded-lg shadow space-y-4 bg-gray-50">
              {foodEntries.length > 0 ? (
                foodEntries.map((entry, index) => (
                  <div key={index} className="flex flex-col">
                    {isEditing ? (
                      <div>
                        <label>
                          食物名稱:
                          <input
                            type="text"
                            value={entry.name}
                            onChange={(e) => {
                              const updatedEntries = [...foodEntries];
                              updatedEntries[index].name = e.target.value;
                              setFoodEntries(updatedEntries);
                            }}
                          />
                        </label>
                        <label>
                          克數:
                          <input
                            type="number"
                            value={entry.weight}
                            onChange={(e) => {
                              const updatedEntries = [...foodEntries];
                              updatedEntries[index].weight = e.target.value;
                              setFoodEntries(updatedEntries);
                            }}
                          />
                        </label>
                        <label>
                          熱量:
                          <input
                            type="number"
                            value={entry.calories}
                            onChange={(e) => {
                              const updatedEntries = [...foodEntries];
                              updatedEntries[index].calories = e.target.value;
                              setFoodEntries(updatedEntries);
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium">
                          食物名稱: <span className="font-normal">{entry.name}</span>
                        </p>
                        {entry.weight && (
                          <p className="text-sm font-medium">
                            克數: <span className="font-normal">{entry.weight} 克</span>
                          </p>
                        )}
                        {entry.calories && (
                          <p className="text-sm font-medium">
                            熱量: <span className="font-normal">{entry.calories} kcal</span>
                          </p>
                        )}
                      </div>
                    )}
                    <hr className="my-2 border-gray-300" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">目前沒有紀錄</p>
              )}
            </div>
          </div>

          {/* Estimated Calories */}
          <div className="text-center mt-6">
            <h2 className="text-lg font-semibold">熱量</h2>
            <p className="text-4xl font-bold mt-2">
              {mealDetails.estimatedCalories}
              <span className="text-xl font-light text-gray-500"> Kcal</span>
            </p>
          </div>

          {/* Suggestions */}
          <div className="w-full max-w-lg mt-6">
            <h2 className="text-lg font-semibold mb-2">飲食建議</h2>
            <div className="border p-4 rounded-lg shadow bg-gray-50">
              {suggestions ? (
                <p className="text-sm text-gray-700">{suggestions}</p>
              ) : (
                <p className="text-sm text-gray-500">目前沒有建議</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              onClick={() => console.log("Chat with AI")}
            >
              <a
                href="/chatbox"
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                聊天室
              </a>
            </button>
            {isEditing ? (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                onClick={handleSave}
              >
                保存
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleEdit}
              >
                編輯
              </button>
            )}
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={handleDelete}
            >
              刪除
            </button>
          </div>
        </div>
      </DefaultLayout>
    );
  }