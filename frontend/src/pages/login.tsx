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
import { login } from "@/apis/auth";
import { setAuthToken } from "@/apis/cookie";

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleLogin = async () => {
  
    if (!email || !password) {
      alert("請提供電子郵件和密碼！");
      return;
    }
  
    try {
      const response = await login(email, password);
  
      if (response.message === "登入成功") {
        setAuthToken(response.token);
        navigate("/dashboard");
      } else {
        alert(response.message || "發生錯誤，請稍後再試");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("登入過程中出現錯誤，請稍後再試");
    } 
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

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg mb-4">
          <h1 className={title()}>使用者登入</h1>
        </div>
        <div className="grid gap-4 max-w-lg w-full">
          <Input
            errorMessage="信箱格式不正確"
            isInvalid={isEmailInvalid}
            label="信箱"
            size="lg"
            type="email"
            value={email}
            onValueChange={setEmail}
          />
          <div>
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
            <div className="mt-2 text-right">
              <Link href="#" underline="hover">
                忘記密碼？
              </Link>
            </div>
          </div>
          <Button size="lg" onClick={handleLogin}>
            登入
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Button
              size="lg"
              startContent={<GoogleLogo className="w-6 shrink-0" />}
            >
              Google 登入
            </Button>
            <Button
              size="lg"
              startContent={<FacebookLogo className="w-6 shrink-0" />}
            >
              Facebook 登入
            </Button>
          </div>
          {/* 新增註冊文字 */}
          <div className="mt-4 text-center">
            <span>
              還沒有帳號嗎？前往
              <Link href="/signup" underline="hover">
                註冊
              </Link>
            </span>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}