import React, { useState, useEffect } from "react";
import { useTheme } from "../../../components/theme/ThemeWrapper"; 

import { useExerciseStore } from "../hooks/useExerciseStore";

import { OpenEndedSidebar } from "./OpenEndedSidebar";
import { OpenEndedWorkspace } from "./OpenEndedWorkspace";


export const OpenEndedArea = ({ activityData, isLoading, isSubmitting, onSaveDraft, onSubmit, onExit }) => {
  const { isNight } = useTheme(); // Lấy trạng thái sáng/tối
  const [currentIndex, setCurrentIndex] = useState(0); // Quản lý câu hỏi đang xem
  const [drafts, setDrafts] = useState({}); // Lưu text học sinh gõ vào


  const getUnsureItems = useExerciseStore(state => state.getUnsureItems);
  const toggleUnsure = useExerciseStore(state => state.toggleUnsure);

  const unsureItems = activityData?.id ? getUnsureItems(activityData.id) : new Set();

  useEffect(() => {
    if (activityData?.items) {
      const initialDrafts = {};
      activityData.items.forEach(item => {
        initialDrafts[item.id] = item.attempt || "";
      });
      setDrafts(initialDrafts);
    }
  }, [activityData]);

  if (isLoading) {
    return (
      <div className="flex h-[600px] w-full animate-pulse flex-col items-center justify-center rounded-3xl bg-white/60 p-10 text-xl font-bold text-[#FF758F] shadow-xl backdrop-blur-md">
        <span className="mb-4 text-5xl">⏳</span>
        Đang tải bài tập... Bé đợi chút nhé!
      </div>
    );
  }

  if (!activityData || !activityData.items || activityData.items.length === 0) return null;

  const items = activityData.items;
  const currentItem = items[currentIndex];
  const isSubmitted = activityData.is_submitted;

  // Handlers
  const handleChange = (itemId, value) => setDrafts(prev => ({ ...prev, [itemId]: value }));

  // Khi học sinh rời chuột khỏi ô nhập liệu (onBlur) thì mới gọi hàm lưu nháp.
  // Giúp giảm tải request API liên tục so với việc lưu mỗi khi gõ phím (onChange).
  const handleBlur = (itemId) => {
    if (!isSubmitted && onSaveDraft) onSaveDraft(itemId, drafts[itemId]);
  };

  const handleToggleUnsure = (itemId) => {
    if (activityData?.id) {
        toggleUnsure(activityData.id, itemId);
    }
  };

  const goNext = () => currentIndex < items.length - 1 && setCurrentIndex(prev => prev + 1);
  
  const goPrev = () => currentIndex > 0 && setCurrentIndex(prev => prev - 1);

  return (
    <div className={`relative flex h-full w-full gap-8 p-8 transition-colors duration-500 ${
      isNight ? "bg-[#1a1c1e] text-gray-100" : "bg-[#f8fafc] text-gray-800"
    }`}>
      
      {/* ================= MÀN HÌNH CHỜ CHẤM BÀI (OVERLAY) ================= */}
      {isSubmitting && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[32px] bg-white/70 backdrop-blur-sm transition-all duration-500">
          
          {/* Vòng tròn hào quang tỏa ra */}
          <div className="relative flex h-32 w-32 items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full bg-[#4ecdc4] opacity-30"></div>
            <div className="absolute h-24 w-24 animate-pulse rounded-full bg-[#FF758F] opacity-50"></div>
            {/* Có thể thay icon Cú Mèo bằng hình ảnh thật của team bạn */}
            <span className="relative z-10 text-6xl drop-shadow-md">🦉</span>
          </div>

          <h3 className="mt-8 text-2xl font-black tracking-wide text-[#2d8680] animate-pulse">
            Cú Mèo đang chăm chú đọc bài...
          </h3>
          <p className="mt-3 text-lg font-bold text-gray-600">
            Bé đợi một chút xíu nhé, kết quả sắp có rồi! ✨
          </p>

        </div>
      )}
      
      <OpenEndedSidebar 
        items={items}
        currentIndex={currentIndex}
        drafts={drafts}
        unsureItems={unsureItems}
        onSelect={setCurrentIndex}
        onExit={onExit}
      />

      <OpenEndedWorkspace 
        currentItem={currentItem}
        currentIndex={currentIndex}
        totalItems={items.length}
        draftValue={drafts[currentItem.id] || ""}
        isSubmitted={isSubmitted}
        isUnsure={unsureItems.has(currentItem.id)}
        onChange={handleChange}
        onBlur={handleBlur}
        onToggleUnsure={handleToggleUnsure}
        onPrev={goPrev}
        onNext={goNext}
        onSubmit={onSubmit}
      />

    </div>
  );
};