import { DatePicker } from "@nextui-org/date-picker";
import { Input } from "@nextui-org/input";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function InfoFormPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full max-w-lg justify-center">
          <div className="inline-block max-w-lg mb-8">
            <h1 className={title({ size: "sm" })}>我們需要您的一些資訊...</h1>
          </div>
          <div className="grid gap-4 max-w-lg w-full">
            <DatePicker showMonthAndYearPickers label="出生日期" />
            <Input label="身高 (cm)" size="lg" type="number" />
            <Input label="體重 (kg)" size="lg" type="number" />
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
