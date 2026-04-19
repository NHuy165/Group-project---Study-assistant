import React from "react";

// Đảm bảo tên hàm đúng là HomePage và có từ khóa 'export'
export const HomePage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-100">
      <h1 className="text-4xl font-black text-slate-800">
        Đây là trang chủ mới của EduSpark.AI
      </h1>
    </div>
  );
};