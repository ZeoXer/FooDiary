import { useMemo, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import { resetPassword } from "@/apis/auth";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token") || "";

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const validatePassword = (value: string) =>
    value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$%^&*!]{8,}$/);

  const isPasswordInvalid = useMemo(() => {
    if (password === "") return false;

    return validatePassword(password) ? false : true;
  }, [password]);

  const handleResetSubmit = async () => {
    const response = await resetPassword(token, password);

    if (response.message === "密碼重設成功") {
      alert("重置密碼成功，請重新登入");
      navigate("/login");

      return;
    }

    alert(response.message);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full max-w-lg">
          <h1 className={title({ size: "sm" })}>重設您的密碼</h1>
          <div className="rounded-xl border-2 p-4 mt-4">
            <Input
              className="mb-2"
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
              label="新的密碼"
              type={isVisible ? "text" : "password"}
              value={password}
              onValueChange={setPassword}
            />
            <Input
              className="mb-4"
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
              errorMessage="密碼不一致"
              isInvalid={confirmPassword !== password}
              label="再次確認新密碼"
              type={isVisible ? "text" : "password"}
              value={confirmPassword}
              onValueChange={setConfirmPassword}
            />
            <Button
              className="w-full font-semibold"
              color="primary"
              isDisabled={!password || isPasswordInvalid}
              variant="flat"
              onPress={handleResetSubmit}
            >
              確認重置
            </Button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
