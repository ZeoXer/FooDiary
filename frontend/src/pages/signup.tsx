import { useMemo, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { useNavigate } from "react-router-dom";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
  FacebookLogo,
  GoogleLogo,
} from "@/components/icons";
import { login, signup } from "@/apis/auth";
import { setAuthToken } from "@/apis/cookie";

export default function SignupPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const isEmailInvalid = useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);

  const validatePassword = (value: string) =>
    value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$%^&*!]{8,}$/);

  const isPasswordInvalid = useMemo(() => {
    if (password === "") return false;

    return validatePassword(password) ? false : true;
  }, [password]);

  const handleSignup = async () => {
    if (!userName || !email || !password) {
      alert("請填寫完整的註冊資料！");

      return;
    }

    try {
      const response = await signup(userName, email, password);

      if (response.message === "註冊成功") {
        const loginResponse = await login(email, password);

        if (loginResponse.message === "登入成功") {
          setAuthToken(loginResponse.token);
          navigate("/info-form");
        } else {
          alert(loginResponse.message || "登入失敗，請稍後再試");
        }
      } else {
        alert("註冊失敗");
      }
    } catch (error) {
      console.error("Signup or Login error:", error);
      alert("註冊失敗");
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg mb-4">
          <h1 className={title()}>成為新用戶</h1>
        </div>
        <div className="grid gap-4 max-w-lg w-full">
          <Input
            errorMessage="使用者名稱為必填"
            isInvalid={userName === ""}
            label="使用者名稱"
            size="lg"
            value={userName}
            onValueChange={setUserName}
          />
          <Input
            errorMessage="信箱格式不正確"
            isInvalid={isEmailInvalid}
            label="信箱"
            size="lg"
            type="email"
            value={email}
            onValueChange={setEmail}
          />
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
            errorMessage="密碼須大於 8 個字元，其中包含至少一個大寫字母、一個小寫字母和一個數字"
            isInvalid={isPasswordInvalid}
            label="密碼"
            size="lg"
            type={isVisible ? "text" : "password"}
            value={password}
            onValueChange={setPassword}
          />
          <Button size="lg" onPress={handleSignup}>
            註冊
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Button size="lg" startContent={<GoogleLogo className="w-6" />}>
              Google 註冊
            </Button>
            <Button
              size="lg"
              startContent={<FacebookLogo className="w-6 shrink-0" />}
            >
              Facebook 註冊
            </Button>
          </div>
          <div className="mt-4 text-center">
            <span>
              已經有帳號了？前往
              <Link href="/login" underline="hover">
                登入
              </Link>
            </span>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
