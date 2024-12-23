import { useState, useEffect  } from "react";
import { DatePicker } from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { DateValue, today, getLocalTimeZone } from "@internationalized/date";
import { useNavigate } from "react-router-dom";
import { getUserData} from "@/apis/user";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { informationMap } from "@/config/site";
import { createUserData } from "@/apis/user";

export default function InfoFormPage() {
  const [birthDate, setBirthDate] = useState<DateValue | null>(
    today(getLocalTimeZone())
  );
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [biologicalSex, setBiologicalSex] = useState("male");
  const [exerciseFrequency, setExerciseFrequency] = useState("never");

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

  const handleSubmit = async () => {
    if (!birthDate || !height || !weight) {
      return;
    }

    const data = {
      birthDate: birthDate.toString(),
      height: parseInt(height),
      weight: parseInt(weight),
      gender:
        informationMap.biologicalSex[
        biologicalSex as keyof typeof informationMap.biologicalSex
        ],
      exerciseFrequency: informationMap.exerciseFrequency[
        exerciseFrequency as keyof typeof informationMap.exerciseFrequency
      ] as number,
    };

    const response = await createUserData(data);

    if (response.message === "成功建立使用者資料") {
      navigate("/dashboard");

      return;
    }

    alert(response.message);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full max-w-lg justify-center">
          {/* 標題 */}
          <div className="inline-block max-w-lg mb-8 text-center">
            <h1 className={title({ size: "sm" })}>我們需要您的一些資訊...</h1>
          </div>
          {/* 表單內容 */}
          <div className="grid gap-6 max-w-lg w-full">
            {/* 日期選擇器 */}
            <div>
              <DatePicker
                showMonthAndYearPickers
                label="出生日期"
                maxValue={today(getLocalTimeZone())}
                value={birthDate}
                onChange={setBirthDate}
              />
            </div>
            {/* 身高和體重 */}
            <Input
              label="身高 (cm)"
              size="lg"
              type="number"
              value={height}
              onValueChange={setHeight}
            />
            <Input
              label="體重 (kg)"
              size="lg"
              type="number"
              value={weight}
              onValueChange={setWeight}
            />
            {/* 性別選擇 */}
            <div>
              <RadioGroup
                color="primary"
                defaultValue={biologicalSex}
                label="生理性別"
                orientation="horizontal"
                onValueChange={setBiologicalSex}
              >
                <Radio value="male">男性</Radio>
                <Radio value="female">女性</Radio>
              </RadioGroup>
            </div>
            {/* 運動頻率 */}
            <div>
              <RadioGroup
                color="primary"
                defaultValue="never"
                label="每周運動頻率？"
                orientation="horizontal"
                onValueChange={setExerciseFrequency}
              >
                <Radio value="never">從不</Radio>
                <Radio value="1-3">1 ~ 3 次</Radio>
                <Radio value="4-5">4 ~ 5 次</Radio>
                <Radio value="6-7">6 ~ 7 次</Radio>
              </RadioGroup>
            </div>
            {/* 提交按鈕 */}
            <div className="text-center">
              <Button size="lg" onClick={handleSubmit}>
                提交
              </Button>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
