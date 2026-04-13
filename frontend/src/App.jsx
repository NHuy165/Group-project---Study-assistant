import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { HomePage } from "./pages/HomePage";
import { InteractionPage } from "./pages/InteractionPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/interaction/:interactionId"
          element={<InteractionPage />}
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
