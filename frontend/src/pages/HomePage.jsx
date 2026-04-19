import React, { useState } from "react";
import {
  BookOpenText,
  Calculator,
  GearSix,
  Notebook,
  PlusCircle,
  Scroll,
  SparkleIcon,
  UserCircle,
} from "@phosphor-icons/react";

const accentColor = "#1d7bd8";

const palette = [
  { badgeClass: "bg-[#fff4bf]", Icon: Notebook },
  { badgeClass: "bg-[#d8f3ff]", Icon: Calculator },
  { badgeClass: "bg-[#e8ddff]", Icon: BookOpenText },
  { badgeClass: "bg-[#ffe3c4]", Icon: Scroll },
  { badgeClass: "bg-[#dff7e8]", Icon: SparkleIcon },
  { badgeClass: "bg-[#f5ddff]", Icon: Notebook },
  { badgeClass: "bg-[#fff0d9]", Icon: BookOpenText },
  { badgeClass: "bg-[#e7f0ff]", Icon: Notebook },
];

export const HomePage = () => {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [noteCards, setNoteCards] = useState([]);

  const handleCreateNoteCard = (e) => {
    e.preventDefault();

    const title = noteTitle.trim();
    const description = noteDescription.trim();
    if (!title) return;

    const paletteItem = palette[noteCards.length % palette.length];
    const newCard = {
      id: crypto.randomUUID(),
      title,
      description: description || "Mô tả ngắn của sổ ghi chú",
      Icon: paletteItem.Icon,
      badgeClass: paletteItem.badgeClass,
    };

    setNoteCards((prev) => [newCard, ...prev]);
    setNoteTitle("");
    setNoteDescription("");
  };

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

          <form
            onSubmit={handleCreateNoteCard}
            className="mb-8 rounded-[24px] border border-white/70 bg-white/65 p-5 shadow-[0_14px_36px_rgba(0,0,0,0.08)] backdrop-blur-md md:p-6"
          >
            <div className="mb-4 flex items-center gap-3 text-[#4f4f4f]">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d8f3ff] text-[#1d7bd8] shadow-sm">
                <BookOpenText size={24} weight="fill" />
              </span>
              <div>
                <h3 className="text-lg font-bold">Tạo sổ ghi chú mới</h3>
                <p className="text-sm font-medium text-[#777]">
                  Nhập tên sổ và mô tả ngắn để bắt đầu.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.1fr_1.4fr_auto] md:items-end">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#5b5b5b]">
                  Tên sổ ghi chú
                </span>
                <input
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Ví dụ: Toán lớp 5: Chủ đề cộng phân số"
                  className="w-full rounded-2xl border border-[#d8d8d8] bg-white px-4 py-3 text-[1rem] font-medium text-[#333] outline-none transition placeholder:text-[#aaa] focus:border-[#1d7bd8] focus:ring-4 focus:ring-[#1d7bd8]/15"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#5b5b5b]">
                  Mô tả ngắn
                </span>
                <input
                  value={noteDescription}
                  onChange={(e) => setNoteDescription(e.target.value)}
                  placeholder="Ví dụ: Ôn thi giữa kỳ"
                  className="w-full rounded-2xl border border-[#d8d8d8] bg-white px-4 py-3 text-[1rem] font-medium text-[#333] outline-none transition placeholder:text-[#aaa] focus:border-[#1d7bd8] focus:ring-4 focus:ring-[#1d7bd8]/15"
                />
              </label>

              <button
                type="submit"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#1d7bd8] px-5 text-[0.95rem] font-bold text-white shadow-[0_10px_20px_rgba(29,123,216,0.25)] transition hover:-translate-y-0.5 hover:bg-[#1665b4]"
              >
                <PlusCircle size={18} weight="fill" />
                Tạo sổ
              </button>
            </div>
          </form>

          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {noteCards.map((card) => (
              <button
                key={card.id}
                type="button"
                className="flex min-h-[126px] items-center gap-4 rounded-[18px] border border-[#8a8a8a] bg-white px-4 py-4 text-left shadow-[0_2px_0_rgba(255,255,255,0.9)_inset] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-4 focus:ring-[#1d7bd8]/20"
              >
                <div
                  className={`flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-2xl ${card.badgeClass}`}
                >
                  <card.Icon size={30} weight="fill" color={accentColor} />
                </div>

                <div className="min-w-0">
                  <p className="max-w-[150px] text-[1.05rem] font-bold leading-tight text-[#4f4f4f] sm:max-w-none">
                    {card.title}
                  </p>
                  <p className="mt-1 text-sm font-medium leading-snug text-[#7a7a7a]">
                    {card.description}
                  </p>
                </div>
              </button>
            ))}

            {noteCards.length === 0 && (
              <div className="col-span-full rounded-[18px] border border-dashed border-[#b7cfd0] bg-white/55 px-5 py-10 text-center text-[#666]">
                Chưa có sổ nào. Bé hãy tạo sổ đầu tiên ở phía trên nhé.
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};
