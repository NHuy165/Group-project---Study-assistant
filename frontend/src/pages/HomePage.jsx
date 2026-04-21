import React from "react";
import { GearSix, UserCircle } from "@phosphor-icons/react";
import { InteractionList } from "../features/interactions/components/InteractionList";

const accentColor = "#1d7bd8";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#def7f2] text-[#555]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1180px] flex-col px-5 py-4 md:px-10 md:py-6">
        <header className="flex items-center justify-between">
          <h1 className="text-meteor text-[2rem] font-black tracking-tight md:text-[2.4rem]">
            EduSpark.AI
          </h1>

          <div className="flex items-center gap-3 md:gap-4">
            <button className="inline-flex items-center gap-2 rounded-full border border-[#5e5e5e] bg-white/80 px-4 py-2 text-[0.95rem] font-semibold text-[#3f3f3f] shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] transition hover:bg-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e7f0ff] text-[1rem]">
                <GearSix size={18} weight="fill" color={accentColor} />
              </span>
              <span>Cài đặt</span>
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-[#5e5e5e] bg-white/80 px-4 py-2 text-[0.95rem] font-semibold text-[#3f3f3f] shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] transition hover:bg-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0d9] text-[1rem]">
                <UserCircle size={18} weight="fill" color={accentColor} />
              </span>
              <span>Tài khoản</span>
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col pb-8 pt-8 md:pt-14">
          <div className="mb-6">
            <div>
              <h2 className="text-[2rem] font-semibold tracking-[-0.03em] text-[#5b5b5b] md:text-[2.6rem]">
                Sổ ghi chú của tôi
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-medium text-[#6f6f6f]">
                Bé tự đặt tên và viết mô tả ngắn cho từng sổ học riêng.
              </p>
            </div>
          </div>

          <InteractionList />
        </main>
      </div>
    </div>
  );
};
