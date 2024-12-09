import { useState } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { RadioGroup, Radio } from "@nextui-org/radio";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function InfoFormPage() {
  const [biologicalSex, setBiologicalSex] = useState("");
  const [exerciseFrequency, setExerciseFrequency] = useState("");

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
              <DatePicker showMonthAndYearPickers label="出生日期" />
            </div>
            {/* 身高和體重 */}
            <Input label="身高 (cm)" size="lg" type="number" />
            <Input label="體重 (kg)" size="lg" type="number" />
            {/* 性別選擇 */}
            <div>
              <RadioGroup
                color="primary"
                defaultValue="male"
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
              <Button size="lg">提交</Button>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
