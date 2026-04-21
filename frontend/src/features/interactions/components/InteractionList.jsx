import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpenText,
  Calculator,
  Notebook,
  PlusCircle,
  Scroll,
  SparkleIcon,
  Trash,
  PencilSimple,
  XCircle,
  CheckCircle
} from "@phosphor-icons/react";
import { InteractionItem } from "./InteractionItem";
import { useInteractions } from "../hooks/useInteractions";

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

export const InteractionList = () => {
  const navigate = useNavigate();
  const [pendingDeleteInteractionId, setPendingDeleteInteractionId] = useState(null);

  const {
    interactions,
    isLoading,
    error,
    interactionName,
    interactionDescription,
    editingInteractionID, 
    handleInteractionNameChange,
    handleInteractionDescriptionChange,
    handleEditInteractionClick, 
    cancelEditInteractionClick, 
    handleUpdateInteractionClick, 
    createInteraction,
    deleteInteraction,
  } = useInteractions();

  // Kiểm tra xem có đang ở chế độ Edit (Chỉnh sửa) hay không
  const isEditing = editingInteractionID !== null;

  const handleCreateNoteCard = async (e) => {
    e.preventDefault();
    const title = interactionName.trim();
    const description = interactionDescription.trim();
    if (!title || !description) return;

    const createdInteraction = await createInteraction({
      name: title,
      description,
    });
    if (!createdInteraction) return;

    navigate(`/interaction/${createdInteraction.id}`);
  };

  const handleDeleteInteraction = (interactionId) => {
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
    <>
      {/* FORM: Dùng chung cho cả Tạo mới và Cập nhật */}
      <form
        onSubmit={isEditing ? handleUpdateInteractionClick : handleCreateNoteCard}
        className={`mb-8 rounded-[24px] border transition-all duration-300 p-5 shadow-[0_14px_36px_rgba(0,0,0,0.08)] backdrop-blur-md md:p-6 ${
          isEditing ? "border-[#1d7bd8] bg-[#f0f7ff]" : "border-white/70 bg-white/65"
        }`}
      >
        <div className="mb-4 flex items-center gap-3 text-[#4f4f4f]">
          <span className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm ${
            isEditing ? "bg-[#1d7bd8] text-white" : "bg-[#d8f3ff] text-[#1d7bd8]"
          }`}>
            {isEditing ? <PencilSimple size={24} weight="fill" /> : <BookOpenText size={24} weight="fill" />}
          </span>
          <div>
            <h3 className="text-lg font-bold">
              {isEditing ? "Chỉnh sửa sổ ghi chú" : "Tạo sổ ghi chú mới"}
            </h3>
            <p className="text-sm font-medium text-[#777]">
              {isEditing ? "Cập nhật lại tên và mô tả cho sổ ghi chú của bé." : "Nhập tên sổ và mô tả ngắn để bắt đầu."}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.1fr_1.4fr_auto] md:items-end">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#5b5b5b]">Tên sổ ghi chú</span>
            <input
              value={interactionName}
              onChange={handleInteractionNameChange}
              placeholder="Ví dụ: Toán lớp 5: Chủ đề cộng phân số"
              className="w-full rounded-2xl border border-[#d8d8d8] bg-white px-4 py-3 text-[1rem] font-medium text-[#333] outline-none transition focus:border-[#1d7bd8] focus:ring-4 focus:ring-[#1d7bd8]/15"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#5b5b5b]">Mô tả ngắn</span>
            <input
              value={interactionDescription}
              onChange={handleInteractionDescriptionChange}
              placeholder="Ví dụ: Ôn thi giữa kỳ"
              className="w-full rounded-2xl border border-[#d8d8d8] bg-white px-4 py-3 text-[1rem] font-medium text-[#333] outline-none transition focus:border-[#1d7bd8] focus:ring-4 focus:ring-[#1d7bd8]/15"
            />
          </label>

          <div className="flex gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={cancelEditInteractionClick}
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-2xl border border-[#d8d8d8] bg-white px-5 text-[0.95rem] font-bold text-[#555] transition hover:bg-[#f5f5f5]"
              >
                <XCircle size={18} weight="fill" />
                Hủy
              </button>
            )}
            <button
              type="submit"
              className={`inline-flex h-[52px] items-center justify-center gap-2 rounded-2xl px-5 text-[0.95rem] font-bold text-white shadow-lg transition hover:-translate-y-0.5 ${
                isEditing ? "bg-[#28a745] hover:bg-[#218838]" : "bg-[#1d7bd8] hover:bg-[#1665b4]"
              }`}
            >
              {isEditing ? <CheckCircle size={18} weight="fill" /> : <PlusCircle size={18} weight="fill" />}
              {isEditing ? "Cập nhật" : "Tạo sổ"}
            </button>
          </div>
        </div>
      </form>

      {/* DANH SÁCH SỔ GHI CHÚ */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {interactions.map((interaction, index) => {
          const paletteItem = palette[index % palette.length];
          return (
            <InteractionItem
              key={interaction.id}
              interaction={interaction}
              paletteItem={paletteItem}
              accentColor={accentColor}
              onOpen={openInteraction}
              onDelete={handleDeleteInteraction}
              onEdit={handleEditInteractionClick} 
            />
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

      {/* POPUP XÁC NHẬN XÓA (Đã được khôi phục 100%) */}
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
                sẽ bị xóa vĩnh viễn. Nếu bạn chắc chắn, hãy nhấn nút xóa bên dưới.
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
    </>
  );
};