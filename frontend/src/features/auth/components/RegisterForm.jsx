import { useRegister } from "../hooks/useRegister";

export const RegisterForm = () => {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  } = useRegister();

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-[400px] flex-col gap-6 text-center"
    >
      <div>
        <label htmlFor="register-username" className="sr-only">
          Tên người dùng
        </label>
        <input
          id="register-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tên người dùng"
          className="w-full rounded-[16px] border-[2px] border-[#d0d0d0] bg-[#e8e8e8] px-4 py-4 text-[1.1rem] font-semibold leading-tight text-[#333] placeholder-[#888] outline-none transition focus:border-[#4ecdc4] focus:bg-white focus:ring-5 focus:ring-[#4ecdc4]/50"
        />
      </div>

      <div>
        <label htmlFor="register-email" className="sr-only">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="be@eduspark.vn"
          className="w-full rounded-[16px] border-[2px] border-[#d0d0d0] bg-[#e8e8e8] px-4 py-4 text-[1.1rem] font-semibold leading-tight text-[#333] placeholder-[#888] outline-none transition focus:border-[#4ecdc4] focus:bg-white focus:ring-5 focus:ring-[#4ecdc4]/50"
        />
      </div>

      <div>
        <label htmlFor="register-password" className="sr-only">
          Mật khẩu
        </label>
        <input
          id="register-password"
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
        className="mt-3 w-full rounded-[16px] border-[2px] border-[#005f6d] bg-[#00acc1] px-4 py-4 text-[1.2rem] font-bold leading-tight text-white transition duration-300 hover:scale-105 hover:bg-[#008ea0] disabled:cursor-not-allowed disabled:bg-[#aaa]"
      >
        {isLoading ? "Đang đăng ký..." : "Đăng ký"}
      </button>
    </form>
  );
};