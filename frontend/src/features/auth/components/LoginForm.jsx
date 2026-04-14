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
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Tên người dùng:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
};
