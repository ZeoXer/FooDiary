import { Tabs, Tab } from "@nextui-org/tabs";

import DefaultLayout from "@/layouts/default";

export default function DashboardPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full max-w-lg justify-center">
          <Tabs size="lg">
            <Tab key="sun" title="日" />
            <Tab key="mon" title="一" />
            <Tab key="tue" title="二" />
            <Tab key="wed" title="三" />
            <Tab key="thu" title="四" />
            <Tab key="fri" title="五" />
            <Tab key="sat" title="六" />
          </Tabs>
        </div>
      </section>
    </DefaultLayout>
  );
}
