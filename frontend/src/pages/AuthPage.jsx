import { useState } from "react";
import { LoginForm } from "../features/auth/components/LoginForm";
import { RegisterForm } from "../features/auth/components/RegisterForm";
import backgroundImage from "../assets/background.png";

export const AuthPage = () => {
  const [mode, setMode] = useState("login");

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="auth-card w-full max-w-[500px] min-h-[620px] rounded-[30px] px-8 py-[72px] text-center shadow-[0_12px_32px_rgba(0,0,0,0.16)]">
        <h1 className="m-0 text-[2.2rem] font-bold leading-tight tracking-[0.3px] text-[#ff6b6b]">
          {mode === "login" ? "Cổng Trường" : "Tạo tài khoản"}
        </h1>
        <p className="mt-2 text-[1.1rem] font-semibold tracking-[0.2px] text-[#626262]">
          {mode === "login"
            ? "Bé hãy nhập tài khoản để vào lớp nhé!"
            : "Đăng ký nhanh để bắt đầu học cùng Cú Mèo."}
        </p>

        <div className="mx-auto mb-12 mt-10 flex max-w-[380px] justify-center gap-5 rounded-full p-0">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`w-[170px] rounded-[25px] border-[2.5px] px-4 py-2.5 text-[1rem] font-bold leading-tight transition ${
              mode === "login"
                ? "border-[#2d8680] bg-[#4ecdc4] text-white"
                : "border-[#555] bg-white text-[#333] hover:bg-[#f5f5f5]"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`w-[170px] rounded-[25px] border-[2.5px] px-4 py-2.5 text-[1rem] font-bold leading-tight transition ${
              mode === "register"
                ? "border-[#006d7d] bg-[#00acc1] text-white"
                : "border-[#555] bg-white text-[#333] hover:bg-[#f5f5f5]"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {mode === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};
