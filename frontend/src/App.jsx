import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/interaction/:interactionId" element={<InteractionPage />} />
      </Routes>
    </BrowserRouter>
  );
}