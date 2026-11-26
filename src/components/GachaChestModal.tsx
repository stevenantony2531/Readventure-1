import { Crown, Sparkles, Star, X } from 'lucide-react';
import { StudioItem } from '../types';

interface GachaChestModalProps {
  open: boolean;
  pulls: StudioItem[];
  onEquipItem: (item: StudioItem) => void;
  onGoToStudio: () => void;
  onClose: () => void;
}

const RARITY_STYLES: Record<
  StudioItem['rarity'],
  { bg: string; text: string; border: string }
> = {
  Mitos: { bg: '#3B0764', text: '#FDE047', border: '#A855F7' },
  Legendaris: { bg: '#14532D', text: '#BBF7D0', border: '#22C55E' },
  Langka: { bg: '#0A4F9E', text: '#DBEAFE', border: '#60A5FA' },
  Biasa: { bg: '#334155', text: '#F1F5F9', border: '#94A3B8' },
};

export function GachaChestModal({
  open,
  pulls,
  onEquipItem,
  onGoToStudio,
  onClose,
}: GachaChestModalProps) {
  if (!open || pulls.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[390px] rounded-[28px] bg-gradient-to-b from-[#1A3966] to-[#0E203D] p-5 text-white border border-white/15 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FDE047]" />
            <h2 className="text-[17px] font-extrabold">
              Peti Pusaka Terbuka!
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup hadiah peti"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[12px] text-blue-100 mb-4">
          Hadiah langsung tersimpan di Studio Karakter Arka.
        </p>

        <div
          className={`grid gap-2.5 max-h-[52vh] overflow-y-auto pr-0.5 ${
            pulls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
          }`}
        >
          {pulls.map((item, idx) => {
            const rStyle = RARITY_STYLES[item.rarity];
            return (
              <div
                key={`${item.id}-${idx}`}
                style={{ borderColor: rStyle.border }}
                className="rounded-[18px] bg-white/10 border p-3 flex flex-col items-center text-center"
              >
                <span
                  style={{
                    backgroundColor: rStyle.bg,
                    color: rStyle.text,
                  }}
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide mb-2"
                >
                  {item.rarity}
                </span>

                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-white/20 bg-white/90 p-0.5 mb-2"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center mb-2">
                    <Crown className="w-8 h-8 text-[#FDE047]" />
                  </div>
                )}

                <div className="text-[13px] font-bold text-white leading-snug">
                  {item.name}
                </div>
                <div className="text-[11px] font-semibold text-[#4ADE80] mt-0.5">
                  {item.bonus}
                </div>

                <button
                  type="button"
                  onClick={() => onEquipItem(item)}
                  className="mt-2.5 w-full rounded-full bg-white/15 hover:bg-white/25 py-1.5 text-[11px] font-bold text-white cursor-pointer"
                >
                  Pasang Sekarang
                </button>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <button
            type="button"
            onClick={onGoToStudio}
            className="min-h-[44px] rounded-full bg-[#F59E0B] hover:bg-[#D97706] text-white text-[12.5px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Star className="w-4 h-4 fill-white" />
            <span>Buka Studio</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-full bg-white/15 hover:bg-white/25 text-white text-[12.5px] font-bold cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
