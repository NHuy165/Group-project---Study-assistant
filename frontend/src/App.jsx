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

// import TestLogic from './components/TestLogic' // Kiểm tra kỹ đường dẫn này

// function App() {
//   return (
//     <div className="App">
//       {/* Nếu TestLogic có lỗi, nó sẽ làm trắng cả trang. 
//           Phú có thể tạm thêm dòng chữ này để kiểm tra xem App có chạy không */}
//       <h1 style={{ textAlign: 'center' }}>Hệ thống AI Tutor - Dev Mode</h1>
      
//       <TestLogic />
//     </div>
//   )
// }

// export default App