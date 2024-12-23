import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DefaultLayout from "@/layouts/default";
import { addMealRecord } from "@/apis/record";
import { generateRecommendation } from "@/apis/chat";
import { getUserData } from "@/apis/user";
import { getSingleMealRecord } from "@/apis/record";

type FoodEntry = {
  name: string;
  weight: string;
  calories: string;
};

export default function FoodRecordPage() {
  const [mealType, setMealType] = useState<string>("Dinner");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([
    { name: "", weight: "", calories: "" },
  ]);
  const [recommendation, setRecommendation] = useState<string>("");

  const navigate = useNavigate();

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

  useEffect(() => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedDate = now.toISOString().split("T")[0]; 
    setCurrentTime(formattedTime);
    setCurrentDate(formattedDate);
  }, []);

  const handleAddEntry = () => {
    setFoodEntries((prev) => [...prev, { name: "", weight: "", calories: "" }]);
  };

  const handleInputChange = (
    index: number,
    field: keyof FoodEntry,
    value: string
  ) => {
    setFoodEntries((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleDeleteEntry = (index: number) => {
    setFoodEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const apiDate = new Date().toLocaleDateString("en-CA");

  const handleGenerateRecommendation = async () => {
    if (foodEntries.some((entry) => !entry.name.trim())) {
      alert("請確認所有食物條目已填寫名稱！");
      return;
    }
  
    const records = await getSingleMealRecord({ date: apiDate }); 
  
    const existingMeal = (records || []).filter((record: any) => record.whichMeal === mealType);
  
    if (existingMeal.length > 0) {
      alert(`${mealType} 記錄已存在。`);
      return;
    }
  
    const mealInfo = {
      whichMeal: mealType,
      mealTime: currentDate + " " + currentTime,
      foodContent: foodEntries.map((entry) => ({
        foodName: entry.name,
        weightInGram: parseFloat(entry.weight) || 0,
        calories: parseFloat(entry.calories) || 0,
      })),
      calories: foodEntries.reduce((total, entry) => {
        const entryCalories = parseFloat(entry.calories);
        return total + (isNaN(entryCalories) ? 0 : entryCalories);
      }, 0),
    };
  
    console.log("生成的餐點資訊：", mealInfo);
  
    const suggestion = await generateRecommendation(mealInfo);
  
    if (suggestion) {
      setRecommendation(suggestion);
    } else {
      alert("無法產生建議");
    }
  };
  
  
    const handleSubmitResults = async () => {
      if (foodEntries.some((entry) => !entry.name.trim())) {
        alert("請確認所有食物條目已填寫名稱！");
        return;
      }
    
      const records = await getSingleMealRecord({ date: apiDate }); 
    
      const existingMeal = (records || []).filter((record: any) => record.whichMeal === mealType);
    
      if (existingMeal.length > 0) {
        alert(`${mealType} 記錄已存在。`);
        return;
      }
      
      if (foodEntries.some((entry) => !entry.name.trim())) {
        alert("請確認所有食物條目已填寫名稱！");
        return;
      }

      const now = new Date();
      const taiwanTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
      const formattedMealTime = taiwanTime.toISOString(); 

      const mealData = {
        mealTime: formattedMealTime,
        whichMeal: mealType,
        foodContent: foodEntries.map((entry) => ({
          foodName: entry.name,
          weightInGram: parseFloat(entry.weight) || 0,
          calories: parseFloat(entry.calories) || 0,
        })),
        calories: foodEntries.reduce((total, entry) => {
          const entryCalories = parseFloat(entry.calories);
          return total + (isNaN(entryCalories) ? 0 : entryCalories);
        }, 0),
        suggestion: recommendation,
      };

      try {
        const result = await addMealRecord(mealData);
        if (result) {
          alert("紀錄成功！");
          setFoodEntries([{ name: "", weight: "", calories: "" }]);
          setRecommendation(""); 
        } else {
          throw new Error("紀錄失敗");
        }
      } catch (error) {
        console.error("Error submitting meal record:", error);
        alert("提交失敗，請稍後再試");
      }
    };

    return (
      <DefaultLayout>
        <div className="p-4 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">What did you eat?</h1>
          {/* 餐類型與時間顯示 */}
          <div className="flex items-center gap-4 mb-6">
            <select
              className="bg-gray-200 text-gray-600 py-2 px-4 rounded"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
            >
              <option value="Breakfast">早餐</option>
              <option value="Lunch">午餐</option>
              <option value="Dinner">晚餐</option>
              <option value="Other">其他</option>
            </select>
            <span className="text-gray-600">{currentTime}</span>
            <span className="text-gray-600 ml-auto">{currentDate}</span>
          </div>

          {/* 食物紀錄區域 */}
          <div className="border p-4 rounded-lg shadow h-64 flex flex-col justify-between">
            <div className="overflow-y-auto flex-grow space-y-4">
              {foodEntries.map((entry, index) => (
                <div key={index} className="flex items-center gap-4">
                  {/* 刪除按鈕 */}
                  <button
                    aria-label="刪除條目"
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDeleteEntry(index)}
                  >
                    ✕
                  </button>
                  {/* 食物名稱輸入框 */}
                  <input
                    className="border p-2 rounded text-sm flex-1"
                    placeholder="食物名稱"
                    type="text"
                    value={entry.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                  {/* 重量輸入框 */}
                  <input
                    className="border p-2 rounded text-sm flex-1"
                    placeholder="重量 (克)"
                    type="text"
                    value={entry.weight}
                    onChange={(e) =>
                      handleInputChange(index, "weight", e.target.value)
                    }
                  />
                  {/* 卡路里輸入框 */}
                  <input
                    className="border p-2 rounded text-sm flex-1"
                    placeholder="卡路里"
                    type="text"
                    value={entry.calories}
                    onChange={(e) =>
                      handleInputChange(index, "calories", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            {/* 新增條目按鈕 */}
            <button
              className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 w-full mt-4"
              onClick={handleAddEntry}
            >
              新增條目 +
            </button>
          </div>

          {/* 生成建議按鈕 */}
          <button
            className="w-full bg-green-500 text-white py-2 rounded-lg mt-4 hover:bg-green-600"
            onClick={handleGenerateRecommendation}
          >
            生成飲食建議
          </button>

          {/* 顯示建議區域 */}
          <h2 className="text-xl font-bold mt-6">飲食建議</h2>
          <div className="border p-4 rounded-lg bg-gray-100 mt-2">
            {recommendation || "目前無建議"}
          </div>

          {/* 提交按鈕 */}
          <button
            className="w-full bg-purple-500 text-white py-2 rounded-lg mt-4 hover:bg-purple-600"
            onClick={handleSubmitResults}
          >
            提交紀錄
          </button>
        </div>
      </DefaultLayout>
    );
  }
