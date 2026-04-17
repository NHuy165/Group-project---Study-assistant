import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { HomePage } from "./pages/HomePage";
import { InteractionPage } from "./pages/InteractionPage";

// 1. TẠO CHỐT KIỂM TRA (Protected Route)
// Chốt này sẽ bọc ngoài các trang quan trọng. Nó sẽ kiểm tra vé (token).
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  // Nếu không có token -> Lập tức "đá" về trang Đăng nhập
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Nếu có token -> Cho phép đi tiếp vào giao diện bên trong
  return children;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* --- CÁC TRANG CÔNG KHAI (Public) --- */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPage />} />

        {/* --- CÁC TRANG NỘI BỘ (Private - Phải qua Chốt bảo vệ) --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/interaction/:interactionId"
          element={
            <ProtectedRoute>
              <InteractionPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;