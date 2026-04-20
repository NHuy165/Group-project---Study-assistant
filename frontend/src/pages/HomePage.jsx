import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpenText,
  Calculator,
  GearSix,
  Notebook,
  PlusCircle,
  Scroll,
  SparkleIcon,
  Trash,
  UserCircle,
} from "@phosphor-icons/react";
import { useInteractions } from "../features/interactions/hooks/useInteractions";

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
  const navigate = useNavigate();
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [pendingDeleteInteractionId, setPendingDeleteInteractionId] =
    useState(null);
  const {
    interactions,
    isLoading,
    error,
    createInteraction,
    deleteInteraction,
  } = useInteractions();

  const handleCreateNoteCard = async (e) => {
    e.preventDefault();

    const title = noteTitle.trim();
    const description = noteDescription.trim();
    if (!title || !description) return;

    const createdInteraction = await createInteraction({
      name: title,
      description,
    });
    if (!createdInteraction) return;

    setNoteTitle("");
    setNoteDescription("");

    navigate(`/interaction/${createdInteraction.id}`);
  };

  const handleDeleteInteraction = async (e, interactionId) => {
    e.stopPropagation();

    setPendingDeleteInteractionId(interactionId);
  };

  const closeDeleteModal = () => {
    setPendingDeleteInteractionId(null);
  };

  const confirmDeleteInteraction = async () => {
    if (!pendingDeleteInteractionId) return;

    await deleteInteraction(pendingDeleteInteractionId);
    closeDeleteModal();
  };

  const openInteraction = (interactionId) => {
    navigate(`/interaction/${interactionId}`);
  };

  const pendingDeleteInteraction = interactions.find(
    (interaction) => interaction.id === pendingDeleteInteractionId,
  );

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
            {interactions.map((interaction, index) => {
              const paletteItem = palette[index % palette.length];
              const CurrentIcon = paletteItem.Icon;

              return (
                <div
                  key={interaction.id}
                  className="relative min-h-[126px] rounded-[18px] border border-[#8a8a8a] bg-white px-4 py-4 text-left shadow-[0_2px_0_rgba(255,255,255,0.9)_inset] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(0,0,0,0.1)]"
                >
                  <button
                    type="button"
                    onClick={() => openInteraction(interaction.id)}
                    className="flex w-full items-center gap-4 focus:outline-none focus:ring-4 focus:ring-[#1d7bd8]/20"
                  >
                    <div
                      className={`flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-2xl ${paletteItem.badgeClass}`}
                    >
                      <CurrentIcon
                        size={30}
                        weight="fill"
                        color={accentColor}
                      />
                    </div>

                    <div className="min-w-0 pr-10">
                      <p className="max-w-[150px] text-[1.05rem] font-bold leading-tight text-[#4f4f4f] sm:max-w-none">
                        {interaction.name}
                      </p>
                      <p className="mt-1 text-sm font-medium leading-snug text-[#7a7a7a]">
                        {interaction.description || "Mô tả ngắn của sổ ghi chú"}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteInteraction(e, interaction.id)}
                    className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ffe6e6] text-[#c63030] transition hover:bg-[#ffd5d5]"
                    title="Xóa sổ"
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              );
            })}

            {error && (
              <div className="col-span-full rounded-[18px] border border-[#ffd1d1] bg-[#fff5f5] px-5 py-4 text-sm font-semibold text-[#b42b2b]">
                {error}
              </div>
            )}

            {!isLoading && interactions.length === 0 && (
              <div className="col-span-full rounded-[18px] border border-dashed border-[#b7cfd0] bg-white/55 px-5 py-10 text-center text-[#666]">
                Chưa có sổ nào. Bé hãy tạo sổ đầu tiên ở phía trên nhé.
              </div>
            )}

            {isLoading && (
              <div className="col-span-full rounded-[18px] border border-[#b7cfd0] bg-white/55 px-5 py-10 text-center text-[#666]">
                Đang tải danh sách sổ ghi chú...
              </div>
            )}
          </section>
        </main>
      </div>

      {pendingDeleteInteraction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#102018]/55 px-4 backdrop-blur-sm"
          onClick={closeDeleteModal}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#ff7a7a] via-[#ffb84d] to-[#ff6f91]" />
            <div className="bg-[radial-gradient(circle_at_top,_rgba(255,94,94,0.18),_transparent_58%),linear-gradient(180deg,_#fffaf8_0%,_#ffffff_100%)] px-6 pb-6 pt-7 sm:px-7 sm:pb-7">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ffe3e3] text-[#d33c3c] shadow-[0_10px_22px_rgba(211,60,60,0.18)]">
                  <Trash size={28} weight="fill" />
                </div>

                <div className="pt-1">
                  <p className="text-[0.78rem] font-bold uppercase tracking-[0.22em] text-[#d46b3f]">
                    Xác nhận xóa
                  </p>
                  <h3 className="mt-1 text-2xl font-black tracking-[-0.03em] text-[#2f2f2f]">
                    Xóa sổ ghi chú này?
                  </h3>
                </div>
              </div>

              <p className="text-[0.98rem] leading-7 text-[#636363]">
                Sổ{" "}
                <span className="font-bold text-[#373737]">
                  {pendingDeleteInteraction.name}
                </span>{" "}
                sẽ bị xóa vĩnh viễn. Nếu bạn chắc chắn, hãy nhấn nút xóa bên
                dưới.
              </p>

              <div className="mt-5 rounded-2xl border border-[#ffe4d9] bg-[#fff8f4] px-4 py-3 text-sm font-medium text-[#7b5d52]">
                Mẹo nhỏ: thao tác này không thể hoàn tác sau khi xác nhận.
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#d9d9d9] bg-white px-5 text-[0.95rem] font-bold text-[#4e4e4e] transition hover:-translate-y-0.5 hover:border-[#c7c7c7] hover:bg-[#fafafa]"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteInteraction}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#e94b4b] to-[#c92d54] px-5 text-[0.95rem] font-bold text-white shadow-[0_12px_26px_rgba(233,75,75,0.28)] transition hover:-translate-y-0.5 hover:from-[#d84343] hover:to-[#b9264a]"
                >
                  <Trash size={18} weight="fill" />
                  Xóa ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
