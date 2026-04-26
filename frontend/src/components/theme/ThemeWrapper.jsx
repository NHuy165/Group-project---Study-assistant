// src/components/ThemeWrapper.jsx
import React, { useState, createContext, useContext } from "react";
import backgroundDay from "../../assets/background/background_day.png";
import backgroundNight from "../../assets/background/background_night.png";

// 1. Import Custom Hook (Chứa toàn bộ logic thời tiết, sấm sét)
import { useWeatherEngine } from "./hooks/useWeatherEngine";

// 2. Import Các thành phần giao diện (Elements)
import { DayNightToggle } from "./elements/DayNightToggle";
import { GlobalStyles } from "./elements/GlobalStyles";
import { RainCanvas, PuddleSplashes, PetrichorMist } from "./elements/RainSystem";
import { DriftingClouds, MorningFog, StarField } from "./elements/SkyEffects";
import { Butterflies, FallingPetals, GoldenDust, Bees, Fireflies } from "./elements/NatureCreatures";
import { Rainbow } from "./elements/Rainbow";
import { LightningSVG } from "./elements/LightningSVG";

/* ═══════════════════════════════════════════════════════════════════
   CONTEXT - Chia sẻ trạng thái theme cho toàn bộ ứng dụng
═══════════════════════════════════════════════════════════════════ */
export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

/* ═══════════════════════════════════════════════════════════════════
   MAIN WRAPPER - Lắp ráp các tầng hiệu ứng
═══════════════════════════════════════════════════════════════════ */
export const ThemeWrapper = ({ children, showToggle = true }) => {
  const [isNight, setIsNight] = useState(false);
  const toggleMode = () => setIsNight(p => !p);

  // Gọi "Cỗ máy thời tiết" để lấy các trạng thái hiện tại
  const { 
    weather, rainbowPhase, lightningBolts, 
    isRaining, isStopping, showFog, cloudDark 
  } = useWeatherEngine(isNight);

  return (
    <ThemeContext.Provider value={{ isNight, toggleMode }}>
      {/* Nhúng các keyframes CSS dùng chung */}
      <GlobalStyles />

      <div
        className="relative flex h-screen w-screen flex-col bg-cover bg-center bg-no-repeat font-sans overflow-hidden"
        style={{
          backgroundImage: `url(${isNight ? backgroundNight : backgroundDay})`,
          transition: "background-image 0.8s ease-in-out",
          color: isNight ? "#e2eaff" : "#1f2937",
        }}
      >
        {/* ── TẦNG 1: Bầu trời & Mây (Dưới cùng) ── */}
        <StarField visible={isNight && !isRaining} />
        <MorningFog visible={showFog} />
        <DriftingClouds darkened={cloudDark} />

        {/* ── TẦNG 2: Cầu vồng (Chỉ hiện ban ngày, sau mưa) ── */}
        {!isNight && <Rainbow phase={rainbowPhase} />}

        {/* ── TẦNG 3: Lớp phủ bóng tối khi trời mưa (Atmospheric Overlay) ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 4,
            background: isNight
              ? "linear-gradient(to bottom, rgba(5,10,30,0.62) 0%, rgba(10,20,55,0.3) 55%, transparent 100%)"
              : "linear-gradient(to bottom, rgba(20,35,75,0.58) 0%, rgba(30,50,100,0.25) 50%, transparent 100%)",
            opacity: cloudDark ? 1 : 0,
            transition: "opacity 4s ease-in-out",
          }}
        />

        {/* ── TẦNG 4: Sinh vật & Đom đóm ── */}
        <Fireflies visible={isNight && !isRaining} />
        
        {!isNight && (
          <>
            <Butterflies visible={!isRaining} hide={cloudDark} />
            <FallingPetals visible={true} />
            <GoldenDust visible={!isRaining} />
            <Bees visible={!isRaining} hide={cloudDark} />
          </>
        )}

        {/* ── TẦNG 5: Hệ thống mưa (Canvas & Splash) ── */}
        <RainCanvas active={isRaining} stopping={isStopping} />
        <PuddleSplashes active={isRaining && !isStopping} />
        <PetrichorMist active={weather === "mist"} />

        {/* ── TẦNG 6: Sấm sét ban đêm (Nháy sáng toàn màn) ── */}
        {isNight && <LightningSVG bolts={lightningBolts} />}

        {/* ── TẦNG UI: Nút gạt Ngày/Đêm ── */}
        {showToggle && (
          <div className="absolute left-1/2 top-10 z-50" style={{ transform: "translateX(-50%)" }}>
            <DayNightToggle isNight={isNight} onToggle={toggleMode} />
          </div>
        )}

        {/* ── TẦNG NỘI DUNG: Các Form đăng nhập, Chat area... ── */}
        <div className="relative h-full w-full" style={{ zIndex: 20 }}>
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};