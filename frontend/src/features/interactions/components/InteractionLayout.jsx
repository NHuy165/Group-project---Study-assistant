import React from "react";
import { Link } from "react-router-dom";
import backgroundImg from "../../../assets/background.png";

export const InteractionLayout = ({ 
  children, 
  onNewChat, 
  headerTitle = "EduSpark",
  modals 
}) => {
  return (
    <div 
      className="flex h-screen w-screen flex-col bg-cover bg-center bg-no-repeat px-10 pb-10 pt-28 font-sans text-gray-800 shadow-inner"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* Logo với hiệu ứng chạy màu toàn bộ văn bản */}
      <Link 
        to="/dashboard"
        className="absolute left-10 top-10 z-50 text-4xl font-black tracking-tight drop-shadow-md transition-transform hover:scale-105 active:scale-95"
      >
        <span className="text-meteor">
          {headerTitle}.AI
        </span>
      </Link>

      <button 
        onClick={onNewChat} 
        className="absolute right-10 top-10 z-50 rounded-full bg-white/60 px-6 py-2.5 text-sm font-bold shadow-md backdrop-blur-md transition hover:scale-105 active:scale-95 text-gray-700 hover:bg-white"
      >
        + New chat
      </button>
      
      <main className="flex h-full w-full space-x-6 overflow-hidden">
        {children}
      </main>

      {modals}
    </div>
  );
};