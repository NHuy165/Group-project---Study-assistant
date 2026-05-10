import React from 'react';
import './Flashcard.css'; // Cần thêm CSS bên dưới để chạy hiệu ứng lật

const Flashcard = ({ front, back, isFlipped, onClick }) => {
    return (
        <div className={`flashcard-container ${isFlipped ? 'flipped' : ''}`} onClick={onClick}>
        <div className="flashcard-inner">
            {/* Mặt trước */}
            <div className="flashcard-front">
            <div className="p-6 flex items-center justify-center text-center h-full">
                <h3 className="text-xl font-semibold text-gray-800">{front}</h3>
            </div>
            </div>
            {/* Mặt sau */}
            <div className="flashcard-back">
            <div className="p-6 flex items-center justify-center text-center h-full">
                <p className="text-lg text-white">{back}</p>
            </div>
            </div>
        </div>
        </div>
    );
};

export default Flashcard;