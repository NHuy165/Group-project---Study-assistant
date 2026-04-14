import { useLogin } from "../hooks/useLogin";

export const LoginForm = () => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  } = useLogin();

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-[400px] flex-col gap-6 text-center"
    >
      <div>
        <label htmlFor="login-username" className="sr-only">
          Tên người dùng
        </label>
        <input
          id="login-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tên người dùng"
          className="w-full rounded-[16px] border-[2px] border-[#d0d0d0] bg-[#fafafa] px-4 py-3.5 text-[1.1rem] font-semibold leading-tight text-[#333] placeholder-[#888] outline-none transition focus:border-[#4ecdc4] focus:bg-white"
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
          className="w-full rounded-[16px] border-[2px] border-[#d0d0d0] bg-[#fafafa] px-4 py-3.5 text-[1.1rem] font-semibold leading-tight text-[#333] placeholder-[#888] outline-none transition focus:border-[#4ecdc4] focus:bg-white"
        />
      </div>

      {error && (
        <p className="mt-2 text-center font-bold text-[#ff4757]">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mx-auto mt-3 w-[92%] rounded-[20px] border-[2px] border-[#2d7a72] bg-[#4ecdc4] px-4 py-3 text-[1.2rem] font-bold leading-tight text-white transition duration-300 hover:scale-105 hover:bg-[#45b7aa] disabled:cursor-not-allowed disabled:bg-[#aaa]"
      >
        {isLoading ? "Đang đăng nhập..." : "Vào lớp thôi"}
      </button>
    </form>
  );
};
