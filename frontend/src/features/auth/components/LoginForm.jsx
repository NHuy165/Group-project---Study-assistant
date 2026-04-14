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
    <section className="rounded-[26px] border border-white/60 bg-white/88 p-7 text-left shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm md:p-9">
      <h2 className="mb-2 text-3xl font-extrabold text-[#ff6b6b]">Cổng Trường</h2>
      <p className="mb-6 text-sm text-slate-600">
        Bé hãy nhập tài khoản để vào lớp nhé.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Tên người dùng
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ví dụ: be_bi"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-[#4ecdc4]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Mật khẩu
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-[#4ecdc4]"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-[#4ecdc4] px-4 py-3 text-base font-bold text-white transition hover:bg-[#45b7aa] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLoading ? "Đang đăng nhập..." : "Vào lớp thôi"}
        </button>
      </form>
    </section>
  );
};
