import { useMemo, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { forgetPassword } from "@/apis/auth";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const isEmailInvalid = useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);

  const handleForgetSubmit = async () => {
    if (!email || isEmailInvalid) return;

    const response = await forgetPassword(email);

    console.log(response);

    alert("信件將於 24 小時內寄出，請前往您的信箱查收");
    navigate("/login");
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full max-w-lg">
          <h1 className={title({ size: "sm" })}>找回您的密碼</h1>
          <div className="rounded-xl border-2 p-4 mt-4">
            <p className="mb-2">
              請輸入您註冊帳號時所使用的信箱，我們會將重置密碼的信件寄送到您的信箱裡
            </p>
            <Input
              className="md:w-3/5 mb-4"
              errorMessage="信箱格式不正確"
              isInvalid={isEmailInvalid}
              label="信箱"
              size="sm"
              type="email"
              value={email}
              onValueChange={setEmail}
            />
            <Button
              className="w-full font-semibold"
              color="primary"
              isDisabled={!email || isEmailInvalid}
              variant="flat"
              onPress={handleForgetSubmit}
            >
              確認發送
            </Button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
