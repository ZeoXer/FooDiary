import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, DatePicker, Spinner } from "@nextui-org/react";
import { DateValue, today, getLocalTimeZone } from "@internationalized/date";

import DefaultLayout from "@/layouts/default";
import { addMealRecord } from "@/apis/record";
import { generateRecommendation } from "@/apis/chat";
import { getUserData } from "@/apis/user";
import MarkdownDisplay from "@/components/markdown-display";

// import { getSingleMealRecord } from "@/apis/record";

type FoodEntry = {
  name: string;
  weight: string;
  calories: string;
};

export default function FoodRecordPage() {
  const [mealType, setMealType] = useState<string>("Dinner");
  const [date, setDate] = useState<DateValue | null>(today(getLocalTimeZone()));
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([
    { name: "", weight: "", calories: "" },
  ]);
  const [recommendation, setRecommendation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleGenerateRecommendation = async () => {
    // 驗證卡路里是否為有效正數且不能包含特殊字符
    const invalidCalories = foodEntries.some(
      (entry) =>
        !entry.calories.trim() ||
        isNaN(parseFloat(entry.calories.trim())) ||
        parseFloat(entry.calories.trim()) <= 0 ||
        /[^0-9.]/.test(entry.calories.trim())
    );

    if (invalidCalories) {
      alert(
        "請確認所有食物條目已填寫有效的卡路里數字（卡路里應為正數，且不能包含特殊字符）！"
      );

      return;
    }

    // 驗證食物重量是否為有效正數且不能包含特殊字符
    const invalidWeight = foodEntries.some(
      (entry) =>
        !entry.weight.trim() ||
        isNaN(parseFloat(entry.weight.trim())) ||
        parseFloat(entry.weight.trim()) <= 0 ||
        /[^0-9.]/.test(entry.weight.trim())
    );

    if (invalidWeight) {
      alert(
        "請確認所有食物條目已填寫有效的食物重量數字（重量應為正數，且不能包含特殊字符）！"
      );

      return;
    }

    // 驗證食物名稱是否為有效字串，只允許字母、數字和空格，不能有特殊符號
    const invalidName = foodEntries.some(
      (entry) =>
        !entry.name.trim() ||
        /[^a-zA-Z0-9\s\u4e00-\u9fa5]/.test(entry.name.trim())
    );

    if (invalidName) {
      alert(
        "請確認所有食物條目已填寫有效的名稱（名稱應僅包含字母、數字、空格或中文，且不能有特殊字符）！"
      );

      return;
    }

    const mealInfo = {
      whichMeal: mealType,
      mealTime: (date || today(getLocalTimeZone())).toString(),
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

    setIsLoading(true);
    const suggestion = await generateRecommendation(mealInfo);

    setIsLoading(false);

    if (suggestion) {
      setRecommendation(suggestion);
    } else {
      alert("無法產生建議");
    }
  };

  const handleSubmitResults = async () => {
    // 驗證卡路里是否為有效正數且不能包含特殊字符
    const invalidCalories = foodEntries.some(
      (entry) =>
        !entry.calories.trim() ||
        isNaN(parseFloat(entry.calories.trim())) ||
        parseFloat(entry.calories.trim()) <= 0 ||
        /[^0-9.]/.test(entry.calories.trim())
    );

    if (invalidCalories) {
      alert(
        "請確認所有食物條目已填寫有效的卡路里數字（卡路里應為正數，且不能包含特殊字符）！"
      );

      return;
    }

    // 驗證食物重量是否為有效正數且不能包含特殊字符
    const invalidWeight = foodEntries.some(
      (entry) =>
        !entry.weight.trim() ||
        isNaN(parseFloat(entry.weight.trim())) ||
        parseFloat(entry.weight.trim()) <= 0 ||
        /[^0-9.]/.test(entry.weight.trim())
    );

    if (invalidWeight) {
      alert(
        "請確認所有食物條目已填寫有效的食物重量數字（重量應為正數，且不能包含特殊字符）！"
      );

      return;
    }

    // 驗證食物名稱是否為有效字串，只允許字母、數字和空格，不能有特殊符號
    const invalidName = foodEntries.some(
      (entry) =>
        !entry.name.trim() ||
        /[^a-zA-Z0-9\s\u4e00-\u9fa5]/.test(entry.name.trim())
    );

    if (invalidName) {
      alert(
        "請確認所有食物條目已填寫有效的名稱（名稱應僅包含字母、數字、空格或中文，且不能有特殊字符）！"
      );

      return;
    }

    const mealData = {
      mealTime: (date || today(getLocalTimeZone())).toString(),
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
        navigate("/dashboard");
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
      <div className="p-6 max-w-4xl mx-auto bg-gray-50">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 tracking-tight">
          今天吃了什麼呢？
        </h1>

        {/* 餐類型與時間顯示 */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8 bg-white p-5 rounded-xl shadow-sm">
          <select
            className="bg-white border-2 border-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:border-gray-300 transition-colors"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          >
            <option value="Breakfast">早餐</option>
            <option value="Lunch">午餐</option>
            <option value="Dinner">晚餐</option>
            <option value="Other">其他</option>
          </select>
          <DatePicker
            className="col-span-2"
            maxValue={today(getLocalTimeZone())}
            value={date}
            variant="bordered"
            onChange={setDate}
          />
        </div>

        {/* 食物紀錄區域 */}
        <div className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white mb-8">
          <div className="overflow-y-auto max-h-[400px] space-y-4">
            {foodEntries.map((entry, index) => (
              <div key={index} className="flex items-center gap-4">
                <button
                  aria-label="刪除條目"
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  onClick={() => handleDeleteEntry(index)}
                >
                  ✕
                </button>
                <input
                  className="border-2 border-gray-200 p-3 rounded-lg text-base flex-1 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all placeholder-gray-400"
                  placeholder="食物名稱"
                  type="text"
                  value={entry.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
                <input
                  className="border-2 border-gray-200 p-3 rounded-lg text-base flex-1 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all placeholder-gray-400"
                  placeholder="重量 (克)"
                  type="text"
                  value={entry.weight}
                  onChange={(e) =>
                    handleInputChange(index, "weight", e.target.value)
                  }
                />
                <input
                  className="border-2 border-gray-200 p-3 rounded-lg text-base flex-1 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all placeholder-gray-400"
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

          <button
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all mt-6 font-medium text-lg shadow-sm hover:shadow"
            onClick={handleAddEntry}
          >
            新增條目 +
          </button>
        </div>

        {/* 按鈕和建議區域 */}
        <div className="space-y-6">
          <Button
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-6 rounded-lg hover:bg-gray-50 transition-all font-medium text-lg shadow-sm hover:shadow"
            isDisabled={isLoading}
            onPress={handleGenerateRecommendation}
          >
            {isLoading && <Spinner />}
            生成飲食建議
          </Button>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">飲食建議</h2>
            <div className="border-2 border-gray-100 p-4 rounded-lg bg-gray-50 min-h-[100px] text-gray-700 leading-relaxed">
              <MarkdownDisplay content={recommendation || "目前無建議"} />
            </div>
          </div>

          <button
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium text-lg shadow-sm hover:shadow"
            onClick={handleSubmitResults}
          >
            提交紀錄
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
}
