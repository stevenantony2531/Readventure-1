import { X } from 'lucide-react';
import {
  FontStyleOption,
  LineSpacingOption,
  PaperThemeOption,
  ReaderSettings,
} from '../types';

interface ReadingCustomizationSheetProps {
  open: boolean;
  settings: ReaderSettings;
  onChange: (next: ReaderSettings) => void;
  onClose: () => void;
}

const FONT_SIZE_LABELS = [
  '12px (Kecil)',
  '14px (Sedang)',
  '16px (Normal)',
  '18px (Besar)',
  '20px (Ekstra)',
];

export function ReadingCustomizationSheet({
  open,
  settings,
  onChange,
  onClose,
}: ReadingCustomizationSheetProps) {
  if (!open) return null;

  const setStep = (step: number) => {
    const clamped = Math.max(0, Math.min(4, step));
    onChange({ ...settings, fontSizeStep: clamped });
  };

  const setFontStyle = (fontStyle: FontStyleOption) => {
    onChange({ ...settings, fontStyle });
  };

  const setPaperTheme = (paperTheme: PaperThemeOption) => {
    onChange({ ...settings, paperTheme });
  };

  const setLineSpacing = (lineSpacing: LineSpacingOption) => {
    onChange({ ...settings, lineSpacing });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] rounded-t-[28px] bg-white px-5 pt-5 pb-7 shadow-[0_-12px_40px_rgba(15,23,42,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-[18px] font-black tracking-tighter text-[#0A4F9E] leading-none">
              <span className="text-[13px] align-top mr-0.5">T</span>T
            </span>
            <h2 className="text-[19px] font-bold text-[#0F172A]">
              Kustomisasi Membaca
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup kustomisasi"
            className="w-9 h-9 rounded-full bg-[#EAF1FB] text-[#334155] flex items-center justify-center cursor-pointer hover:bg-[#DCE7F9] transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Ukuran Font */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[13px] font-semibold text-[#475569]">
              Ukuran Font
            </span>
            <span className="text-[13px] font-bold text-[#0A4F9E]">
              {FONT_SIZE_LABELS[settings.fontSizeStep]}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-full bg-[#EAF1FB] p-2">
            <button
              type="button"
              onClick={() => setStep(settings.fontSizeStep - 1)}
              className="w-10 h-10 rounded-full bg-white text-[#0F172A] text-[15px] font-bold shadow-sm flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            >
              A-
            </button>

            <div className="flex items-center gap-7">
              {[0, 1, 2, 3, 4].map((idx) => {
                const active = settings.fontSizeStep === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setStep(idx)}
                    aria-label={`Ukuran font ${FONT_SIZE_LABELS[idx]}`}
                    className={`rounded-full transition-all cursor-pointer ${
                      active
                        ? 'w-3 h-3 bg-[#0A4F9E] ring-4 ring-[#0A4F9E]/15'
                        : 'w-2 h-2 bg-[#64748B]/70 hover:bg-[#0A4F9E]/70'
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setStep(settings.fontSizeStep + 1)}
              className="w-10 h-10 rounded-full bg-white text-[#0F172A] text-[15px] font-bold shadow-sm flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            >
              A+
            </button>
          </div>
        </div>

        {/* Gaya Tulisan */}
        <div className="mb-5">
          <span className="block text-[13px] font-semibold text-[#475569] mb-2.5">
            Gaya Tulisan
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {(
              [
                { id: 'modern', title: 'Modern', sub: 'Sans-Serif', cls: 'font-modern' },
                { id: 'klasik', title: 'Klasik', sub: 'Serif', cls: 'font-klasik' },
                { id: 'ramah', title: 'Ramah Baca', sub: 'Dyslexic', cls: 'font-ramah' },
              ] as const
            ).map((opt) => {
              const active = settings.fontStyle === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFontStyle(opt.id)}
                  className={`rounded-[22px] py-2.5 px-2 text-center cursor-pointer transition-all ${opt.cls} ${
                    active
                      ? 'bg-[#0A4F9E] text-white shadow-sm'
                      : 'bg-[#EAF1FB] text-[#0F172A] hover:bg-[#DCE7F9]'
                  }`}
                >
                  <div className="text-[13.5px] font-bold leading-tight">
                    {opt.title}
                  </div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      active ? 'text-blue-100' : 'text-[#475569]'
                    }`}
                  >
                    {opt.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Warna Kertas */}
        <div className="mb-5">
          <span className="block text-[13px] font-semibold text-[#475569] mb-2.5">
            Warna Kertas
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setPaperTheme('terang')}
              className={`flex items-center justify-center gap-2 rounded-full py-2.5 px-3 bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-[13px] font-bold cursor-pointer transition-all ${
                settings.paperTheme === 'terang'
                  ? 'ring-2 ring-[#0A4F9E] ring-offset-1'
                  : ''
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white border border-[#CBD5E1]" />
              <span>Terang</span>
            </button>

            <button
              type="button"
              onClick={() => setPaperTheme('sepia')}
              className={`flex items-center justify-center gap-2 rounded-full py-2.5 px-3 bg-[#FDE4CA] text-[#0F172A] text-[13px] font-bold cursor-pointer transition-all ${
                settings.paperTheme === 'sepia'
                  ? 'ring-2 ring-[#0A4F9E] ring-offset-1'
                  : ''
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#FDBA74]" />
              <span>Sepia</span>
            </button>

            <button
              type="button"
              onClick={() => setPaperTheme('gelap')}
              className={`flex items-center justify-center gap-2 rounded-full py-2.5 px-3 bg-[#1E293B] text-white text-[13px] font-bold cursor-pointer transition-all ${
                settings.paperTheme === 'gelap'
                  ? 'ring-2 ring-[#0A4F9E] ring-offset-1'
                  : ''
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#020617]" />
              <span>Gelap</span>
            </button>
          </div>
        </div>

        {/* Jarak Baris */}
        <div>
          <span className="block text-[13px] font-semibold text-[#475569] mb-2.5">
            Jarak Baris
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {(
              [
                { id: 'rapat', label: 'Rapat (1.4)' },
                { id: 'ideal', label: 'Ideal (1.6)' },
                { id: 'renggang', label: 'Renggang\n(1.8)' },
              ] as const
            ).map((opt) => {
              const active = settings.lineSpacing === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLineSpacing(opt.id)}
                  className={`rounded-full py-2.5 px-2 text-center text-[13px] leading-tight whitespace-pre-line cursor-pointer transition-colors ${
                    active
                      ? 'bg-[#CFE0F8] text-[#0F172A] font-bold'
                      : 'bg-[#EAF1FB] text-[#1E293B] font-semibold hover:bg-[#DCE7F9]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
