import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@nextui-org/react";

import DefaultLayout from "@/layouts/default";
import {
  getSingleMealRecord,
  deleteMealRecord,
  editMealRecord,
} from "@/apis/record";
import { getUserData } from "@/apis/user";
import MarkdownDisplay from "@/components/markdown-display";

type FoodContent = {
  foodName: string;
  weightInGram: number;
  calories: number;
};

type MealRecord = {
  whichMeal: "Breakfast" | "Lunch" | "Dinner" | "Other";
  mealTime: string;
  calories: number;
  foodContent: Array<FoodContent>;
  suggestion: string;
};

export default function MealDetailPage() {
  const [mealRecord, setMealRecord] = useState<MealRecord | undefined>();
  const [foodContent, setFoodContent] = useState<FoodContent[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const recordId = queryParams.get("id") || "";

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

  const fetchData = async () => {
    if (!recordId) return;

    try {
      const meal = await getSingleMealRecord({ recordId });

      setMealRecord(meal);
      setFoodContent(meal.foodContent);
    } catch (error) {
      console.error("獲取餐點數據時出錯:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleDelete = async () => {
    try {
      if (!recordId) {
        alert("無效的餐點紀錄 ID");

        return;
      }
      const response = await deleteMealRecord({ recordID: recordId });

      if (response?.success) {
        alert("餐點紀錄已刪除");
        navigate("/dashboard");
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
      const isValidFoodName = (name: any) =>
        /^[a-zA-Z\u4e00-\u9fa5]+$/.test(name);

      // 檢查所有食物名稱
      for (const entry of foodContent) {
        if (!isValidFoodName(entry.foodName)) {
          alert(
            `食物名稱 "${entry.foodName}" 含有無效字符。只能包含中文和英文。`
          );

          return;
        }
      }

      const response = await editMealRecord({
        recordID: recordId,
        foodContent: foodContent,
      });

      if (response?.success) {
        alert("餐點紀錄已更新");
        setIsEditing(false);
        fetchData();
      } else {
        alert("更新餐點紀錄失敗");
      }
    } catch (error) {
      console.error("更新餐點紀錄時出錯:", error);
    }
  };

  if (!mealRecord) return null;

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
          <h1 className="text-2xl font-bold ml-4">{mealRecord?.whichMeal}</h1>
        </div>

        <p className="w-full max-w-lg text-gray-500">
          {new Date(mealRecord.mealTime).toLocaleDateString("zh-TW", {
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="w-full max-w-lg mt-4">
          <h2 className="text-xl font-semibold mb-2">今日飲食</h2>
          <div className="border p-4 rounded-lg shadow space-y-4 bg-gray-50">
            {mealRecord.foodContent.length > 0 ? (
              mealRecord.foodContent.map((entry, index) => (
                <div key={index} className="flex flex-col">
                  {isEditing ? (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-5 items-center gap-2">
                        <h3>食物名稱</h3>
                        <Input
                          className="col-span-2"
                          type="text"
                          value={entry.foodName}
                          variant="bordered"
                          onValueChange={(value) => {
                            const updatedEntries = [...foodContent];

                            updatedEntries[index].foodName = value;
                            setFoodContent(updatedEntries);
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-5 items-center gap-2">
                        <h3>克數</h3>
                        <Input
                          className="col-span-2"
                          type="number"
                          value={entry.weightInGram.toString()}
                          variant="bordered"
                          onValueChange={(value) => {
                            const updatedEntries = [...foodContent];

                            updatedEntries[index].weightInGram = +value;
                            setFoodContent(updatedEntries);
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-5 items-center gap-2">
                        <h3>卡路里</h3>
                        <Input
                          className="col-span-2"
                          type="number"
                          value={entry.calories.toString()}
                          variant="bordered"
                          onValueChange={(value) => {
                            const updatedEntries = [...foodContent];

                            updatedEntries[index].calories = +value;
                            setFoodContent(updatedEntries);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-lg">
                        {entry.foodName}
                      </h3>
                      {entry.weightInGram && (
                        <p className="font-normal">{entry.weightInGram} 克</p>
                      )}
                      {entry.calories && (
                        <p className="font-normal">{entry.calories} kcal</p>
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
            {mealRecord.calories}
            <span className="text-xl font-light text-gray-500"> Kcal</span>
          </p>
        </div>

        {/* Suggestions */}
        <div className="w-full max-w-lg mt-6">
          <h2 className="text-lg font-semibold mb-2">飲食建議</h2>
          <div className="border p-4 rounded-lg shadow bg-gray-50">
            {mealRecord.suggestion ? (
              <p className="text-sm text-gray-700">
                <MarkdownDisplay content={mealRecord.suggestion} />
              </p>
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
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              href="/chatbox"
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
