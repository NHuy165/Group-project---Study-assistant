import React from 'react';
import { WarningCircle, House, ArrowUUpLeft, ShieldCheck, MaskHappy } from "@phosphor-icons/react";
import { useTheme } from "../../../components/theme/ThemeWrapper";

export const OpenEndedFallback = ({ error, onClose }) => {
    const { isNight } = useTheme();

    if (!error) return null;

    // Cấu hình UI dựa trên loại lỗi
    let config = {
        icon: <WarningCircle size={64} weight="duotone" className="text-orange-500" />,
        buttonText: "Đã hiểu",
        buttonAction: onClose, // Mặc định là đóng popup
        btnColor: "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30"
    };

    switch (error.type) {
        case 'RETURN_HOMEPAGE':
            config.icon = <House size={64} weight="duotone" className="text-blue-500" />;
            config.buttonText = "Về trang chủ ngay";
            config.buttonAction = () => { window.location.href = '#/dashboard'; }; // HashRouter về trang chủ
            config.btnColor = "bg-blue-500 hover:bg-blue-600 shadow-blue-500/30";
            break;
        case 'RETURN_INTERACTION':
            config.icon = <ArrowUUpLeft size={64} weight="duotone" className="text-indigo-500" />;
            config.buttonText = "Quay lại sổ tay";
            config.buttonAction = onClose; // Đóng bài tập để lộ ra màn hình sổ tay phía sau
            config.btnColor = "bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/30";
            break;
        case 'CONFLICT':
            config.icon = <ShieldCheck size={64} weight="duotone" className="text-green-500" />;
            config.buttonText = "Xem bài đã nộp";
            config.buttonAction = onClose; // Đóng popup để bé xem kết quả bài đã tự động fetch lại
            config.btnColor = "bg-green-500 hover:bg-green-600 shadow-green-500/30";
            break;
        case 'DEV_BUG':
        case 'ERROR':
        case 'RETRYABLE':
            config.icon = <MaskHappy size={64} weight="duotone" className="text-red-400" />;
            config.buttonText = "Thử lại sau nhé";
            config.buttonAction = onClose;
            config.btnColor = "bg-red-500 hover:bg-red-600 shadow-red-500/30";
            break;
        default:
            break;
    }

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`relative flex flex-col items-center max-w-md w-[90%] p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 ${
                isNight ? "bg-[#1e293b] border border-slate-700" : "bg-white"
            }`}>
                
                {/* Khu vực Icon */}
                <div className="mb-6 animate-bounce">
                    {config.icon}
                </div>

                {/* Tiêu đề dễ thương */}
                <h3 className={`text-2xl font-black text-center mb-4 ${isNight ? "text-slate-100" : "text-slate-800"}`}>
                    Ôi chao! 🦉
                </h3>

                {/* Lời nhắn (Lấy từ hook của bạn) */}
                <p className={`text-center text-lg font-medium leading-relaxed mb-8 ${isNight ? "text-slate-300" : "text-slate-600"}`}>
                    {error.message}
                </p>

                {/* Nút hành động động */}
                <button 
                    onClick={config.buttonAction}
                    className={`w-full py-4 rounded-2xl text-white font-black text-lg transition-all shadow-lg hover:-translate-y-1 active:scale-95 ${config.btnColor}`}
                >
                    {config.buttonText}
                </button>
            </div>
        </div>
    );
};