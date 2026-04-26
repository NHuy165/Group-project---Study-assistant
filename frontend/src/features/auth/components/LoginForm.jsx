import { useLogin } from "../hooks/useLogin";

export const LoginForm = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  } = useLogin();

  return (
    <form // đoạn này tạo ra 1 cái khung, kéo từ đầu khung "tên người dùng" đến cuối "vào lớp thôi"
      onSubmit={handleSubmit} // gọi hành động submit khi bấm enter hoặc submit
      className="mx-auto flex w-full max-w-[400px] flex-col gap-6 text-center" 
    >
      <div>
        <label htmlFor="login-username" className="sr-only">
          Email người dùng
        </label>
        <input
          id="login-username"
          type="text"
          value={email} // dữ liệu quyết định giao diện
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email người dùng"
          className="w-full rounded-[16px] border-[2px] border-[#d0d0d0] bg-[#e8e8e8] px-4 py-4 text-[1.1rem] font-semibold leading-tight text-[#333] placeholder-[#888] outline-none transition focus:border-[#4ecdc4] focus:bg-white focus:ring-5 focus:ring-[#4ecdc4]/50"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="sr-only">
          Mật khẩu
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu"
          className="w-full rounded-[16px] border-[2px] border-[#d0d0d0] bg-[#e8e8e8] px-4 py-4 text-[1.1rem] font-semibold leading-tight text-[#333] placeholder-[#888] outline-none transition focus:border-[#4ecdc4] focus:bg-white focus:ring-5 focus:ring-[#4ecdc4]/50"
        />
      </div>

      {error && (
        <p className="mt-2 text-center font-bold text-[#ff4757]">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        // Đã thay đổi: w-full, py-4, rounded-[16px] và bỏ mx-auto
        className="mt-3 w-full rounded-[16px] border-[2px] border-[#2d7a72] bg-[#4ecdc4] px-4 py-4 text-[1.2rem] font-bold leading-tight text-white transition duration-300 hover:scale-105 hover:bg-[#45b7aa] disabled:cursor-not-allowed disabled:bg-[#aaa]"
      >
        {isLoading ? "Đang đăng nhập..." : "Vào lớp thôi"}
      </button>
    </form>
  );
};
