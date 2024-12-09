import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
<<<<<<< HEAD
import { Link } from "@nextui-org/link";
=======
>>>>>>> main

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
  FacebookLogo,
  GoogleLogo,
} from "@/components/icons";

export default function SignupPage() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg mb-4">
          <h1 className={title()}>成為新用戶</h1>
        </div>
        <div className="grid gap-4 max-w-lg w-full">
<<<<<<< HEAD
          <Input label="使用者名稱" size="lg" />
          <Input label="信箱" size="lg" type="email" />
=======
          <Input label="Name" size="lg" />
          <Input label="Email" size="lg" type="email" />
>>>>>>> main
          <Input
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="w-7 fill-white text-2xl pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="w-7 fill-white text-2xl pointer-events-none" />
                )}
              </button>
            }
<<<<<<< HEAD
            label="密碼"
=======
            label="Password"
>>>>>>> main
            size="lg"
            type={isVisible ? "text" : "password"}
          />
          <Button size="lg">註冊</Button>
          <div className="grid grid-cols-2 gap-4">
            <Button size="lg" startContent={<GoogleLogo className="w-6" />}>
              Google 註冊
            </Button>
<<<<<<< HEAD
            <Button
              size="lg"
              startContent={<FacebookLogo className="w-6 shrink-0" />}
            >
=======
            <Button size="lg" startContent={<FacebookLogo className="w-6" />}>
>>>>>>> main
              Facebook 註冊
            </Button>
          </div>
          <div className="mt-4 text-center">
<<<<<<< HEAD
            <span>
              已經有帳號了？前往
              <Link href="/login" underline="hover">
                登入
              </Link>
=======
            <span className="text-sm">
              Already have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Log in here.
              </a>
>>>>>>> main
            </span>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
