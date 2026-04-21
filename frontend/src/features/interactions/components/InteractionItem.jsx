import { PencilSimple, Trash } from "@phosphor-icons/react";

export const InteractionItem = ({
  interaction,
  paletteItem,
  accentColor,
  onOpen,
  onDelete,
  onEdit, // New prop from parent
}) => {
  const CurrentIcon = paletteItem.Icon;

  return (
    <div className="relative min-h-[126px] rounded-[18px] border border-[#8a8a8a] bg-white px-4 py-4 text-left shadow-[0_2px_0_rgba(255,255,255,0.9)_inset] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(0,0,0,0.1)]">
      <button
        type="button"
        onClick={() => onOpen(interaction.id)}
        className="flex w-full items-center gap-4 focus:outline-none focus:ring-4 focus:ring-[#1d7bd8]/20"
      >
        <div
          className={`flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-2xl ${paletteItem.badgeClass}`}
        >
          <CurrentIcon size={30} weight="fill" color={accentColor} />
        </div>

        <div className="min-w-0 pr-20"> {/* Increased padding to accommodate two buttons */}
          <p className="max-w-[150px] text-[1.05rem] font-bold leading-tight text-[#4f4f4f] sm:max-w-none truncate">
            {interaction.name}
          </p>
          <p className="mt-1 text-sm font-medium leading-snug text-[#7a7a7a] line-clamp-2">
            {interaction.description || "Mô tả ngắn của sổ ghi chú"}
          </p>
        </div>
      </button>

      {/* Action Buttons Container */}
      <div className="absolute right-3 top-3 flex gap-2">
        {/* Edit Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent opening the interaction
            onEdit(interaction);
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e7f0ff] text-[#1d7bd8] transition hover:bg-[#d1e3ff]"
          title="Sửa sổ"
        >
          <PencilSimple size={18} weight="bold" />
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent opening the interaction
            onDelete(interaction.id);
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ffe6e6] text-[#c63030] transition hover:bg-[#ffd5d5]"
          title="Xóa sổ"
        >
          <Trash size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
};