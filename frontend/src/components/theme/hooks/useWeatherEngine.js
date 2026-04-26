// src/components/theme/hooks/useWeatherEngine.js
import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   HÀM TẠO SẤM SÉT (Procedural Lightning)
═══════════════════════════════════════════════════════════════════ */

/** Tạo sét dọc từ trên xuống */
const genVerticalBolt = () => {
  const startX = 15 + Math.random() * 70; // % màn hình
  let x = startX * 10;
  let y = -20;
  let d = `M ${x} ${y}`;
  const steps = 9 + Math.floor(Math.random() * 6);
  const branches = [];

  for (let i = 0; i < steps; i++) {
    x += (Math.random() - 0.46) * 110;
    y += 520 / steps + Math.random() * 25;
    d += ` L ${x} ${y}`;
    if (Math.random() < 0.38 && i > 1 && i < steps - 1) {
      let bx = x, by = y;
      let bp = `M ${bx} ${by}`;
      const bl = 2 + Math.floor(Math.random() * 3);
      for (let j = 0; j < bl; j++) {
        bx += (Math.random() - 0.46) * 80;
        by += 55 + Math.random() * 30;
        bp += ` L ${bx} ${by}`;
      }
      branches.push(bp);
    }
  }
  return { type: "vertical", path: d, branches, startX };
};

/** Tạo sét ngang / chéo ngang trời */
const genHorizontalBolt = () => {
  const startY = 5 + Math.random() * 25; // % từ trên
  let x = Math.random() < 0.5 ? -50 : 1050; // từ trái hoặc từ phải
  const dir = x < 0 ? 1 : -1;
  const drift =  (Math.random() - 0.5) * 2; // độ xiên chéo
  let y = startY * 5; // trong viewBox 0-500
  let d = `M ${x} ${y}`;
  const steps = 7 + Math.floor(Math.random() * 5);
  const branches = [];
  
  for (let i = 0; i < steps; i++) {
    x += dir * (80 + Math.random() * 60);
    y += drift * 30 + (Math.random() - 0.5) * 55;
    d += ` L ${x} ${y}`;
    if (Math.random() < 0.3 && i > 1) {
      let bx = x, by = y;
      let bp = `M ${bx} ${by}`;
      bx += dir * (40 + Math.random() * 40);
      by += (Math.random() - 0.4) * 60;
      bp += ` L ${bx} ${by}`;
      branches.push(bp);
    }
  }
  return { type: "horizontal", path: d, branches, startX: 50 };
};

/* ═══════════════════════════════════════════════════════════════════
   CUSTOM HOOK CHÍNH: useWeatherEngine
═══════════════════════════════════════════════════════════════════ */

export const useWeatherEngine = (isNight) => {
  // Trạng thái chính: "clear" | "raining" | "stopping" | "mist"
  const [weather, setWeather] = useState("clear");
  const [rainbowPhase, setRainbowPhase] = useState("hidden");
  const [stormApproaching, setStormApproaching] = useState(false);
  const [lightningBolts, setLightningBolts] = useState([]);

  // Refs quản lý timer để dọn dẹp khi unmount
  const weatherLoopRef = useRef(null);
  const lightningRef = useRef(null);

  // Lưu isNight vào ref để dùng trong useCallback mà không bị re-render liên tục
  const isNightRef = useRef(isNight);
  useEffect(() => { 
    isNightRef.current = isNight; 
  }, [isNight]);

  /* ── Chu kỳ thời tiết chính ── */
  const scheduleNextCycle = useCallback((delayMs) => {
    weatherLoopRef.current = setTimeout(() => {
      // 85% xác suất trời sẽ mưa
      const shouldRain = Math.random() < 0.85;
      if (!shouldRain) {
        scheduleNextCycle(5000); // Không mưa → thử lại sau 5s
        return;
      }

      // 1. Mây đen kéo tới (chuẩn bị mưa)
      setStormApproaching(true);           
      
      // 2. Bắt đầu mưa sau 4s
      setTimeout(() => {
        setWeather("raining");
        setStormApproaching(false);
      }, 4000);     

      const rainDur = 10000 + Math.random() * 7000; // Mưa to kéo dài 8-15s

      // 3. Quá trình tạnh mưa
      weatherLoopRef.current = setTimeout(() => {
        setWeather("stopping"); // Mưa nhỏ dần

        setTimeout(() => {
          setWeather("clear"); // Trời sáng trở lại

          // Cầu vồng CHỈ xuất hiện vào ban ngày
          if (!isNightRef.current) {
            setRainbowPhase("in");
            setTimeout(() => setRainbowPhase("visible"), 2600);
            setTimeout(() => setRainbowPhase("out"),     9000);
            setTimeout(() => setRainbowPhase("hidden"), 11500);
          }

          // Mist (Sương mù bốc lên từ mặt đất sau mưa)
          setTimeout(() => {
            setWeather("mist");
            setTimeout(() => {
              setWeather("clear");
              // SAU KHI TOÀN BỘ HIỆU ỨNG SAU MƯA XONG → đặt lịch chu kỳ tiếp theo (chờ 30s)
              scheduleNextCycle(30000);
            }, 7000);
          }, 1000);

        }, 4500); // Mất 4.5s để ngớt mưa
      }, rainDur);

    }, delayMs);
  }, []);

  // Bắt đầu chu kỳ khi vừa vào ứng dụng
  useEffect(() => {
    scheduleNextCycle(25000); // Lần đầu chờ 25s trước khi xét mưa
    return () => clearTimeout(weatherLoopRef.current);
  }, [scheduleNextCycle]);

  /* ── Chu kỳ Sấm Sét ban đêm ── */
  useEffect(() => {
    // Chỉ sét vào ban đêm và lúc đang mưa/ngớt mưa
    if (!isNight || (weather !== "raining" && weather !== "stopping")) {
      setLightningBolts([]);
      clearTimeout(lightningRef.current);
      return;
    }

    const strikeOnce = () => {
      // Tạo 1-3 bolt cùng lúc (sét chuỗi)
      const count = Math.random() < 0.35 ? 2 : (Math.random() < 0.15 ? 3 : 1);
      const bolts = Array.from({ length: count }, (_, i) => {
        const isHoriz = Math.random() < 0.22; // 22% xác suất sét đánh ngang trời
        const base = isHoriz ? genHorizontalBolt() : genVerticalBolt();
        return {
          ...base,
          intensity: 0.5 + Math.random() * 0.5,
          delay: i * (80 + Math.random() * 120), // Các tia sét lệch nhịp nhau
        };
      });

      setLightningBolts(bolts);

      // Double flash: Nháy sáng toàn màn hình (sáng -> tắt -> sáng nhẹ -> tắt hẳn)
      const onDur  = 150 + Math.random() * 200;
      const offGap = 60  + Math.random() * 80;
      const on2Dur = 100 + Math.random() * 150;

      setTimeout(() => {
        setLightningBolts([]); // Tắt sét
        // Double flash (50% xác suất)
        if (Math.random() < 0.5) {
          setTimeout(() => {
            // Hạ cường độ sáng của lần nháy thứ 2
            setLightningBolts(bolts.map(b => ({ ...b, intensity: b.intensity * 0.6 })));
            setTimeout(() => setLightningBolts([]), on2Dur);
          }, offGap);
        }
      }, onDur);
    };

    const scheduleStrike = () => {
      // Khoảng cách giữa các cú sét
      const gap = Math.random() < 0.2
        ? 800  + Math.random() * 1200  // Đánh liên tiếp (20%)
        : 3000 + Math.random() * 4500; // Đánh thưa (80%)
      
      lightningRef.current = setTimeout(() => {
        strikeOnce();
        scheduleStrike();
      }, gap);
    };

    lightningRef.current = setTimeout(scheduleStrike, 1500 + Math.random() * 2000);
    return () => clearTimeout(lightningRef.current);
  }, [isNight, weather]);

  /* ── Các biến trạng thái tính toán sẵn cho UI ── */
  const isRaining  = weather === "raining" || weather === "stopping";
  const isStopping = weather === "stopping";
  const showFog    = !isNight && (weather === "mist");
  const cloudDark  = isRaining || stormApproaching;

  return {
    weather,
    rainbowPhase,
    lightningBolts,
    isRaining,
    isStopping,
    showFog,
    cloudDark
  };
};