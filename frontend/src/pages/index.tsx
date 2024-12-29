import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/react";

import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      {/* Main Section */}
      <section className="flex flex-col items-center justify-center gap-6 py-10 md:py-16">
        {/* Logo Section */}
        <div className="flex justify-center">
          <img
            alt="FooDiary Logo"
            className="w-36 h-36 object-contain"
            src="/assets/FooDiary.png"
          />
        </div>

        {/* Title Section */}
        <div className="text-center max-w-xl">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            歡迎來到 <span className="text-violet-600">FooDiary</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 sm:text-xl">
            開始記錄你的飲食!
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex gap-4 mt-6">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "solid",
            })}
            href="/login"
          >
            前往登入
          </Link>
          <Link
            className={buttonStyles({
              color: "secondary",
              radius: "full",
              variant: "shadow",
            })}
            href="/signup"
          >
            前往註冊
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}
