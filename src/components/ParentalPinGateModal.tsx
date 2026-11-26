import { useState } from 'react';
import {
  Clock,
  Delete,
  Lock,
  Shield,
  Smartphone,
  Unlock,
  X,
} from 'lucide-react';

interface ParentalPinGateModalProps {
  open: boolean;
  correctPin: string;
  focusLockEnabled: boolean;
  focusDurationMinutes: number;
  readingMinutesToday: number;
  onToggleFocusLock: () => void;
  onSwitchToParentDevice: () => void;
  onClose: () => void;
}

export function ParentalPinGateModal({
  open,
  correctPin,
  focusLockEnabled,
  focusDurationMinutes,
  readingMinutesToday,
  onToggleFocusLock,
  onSwitchToParentDevice,
  onClose,
}: ParentalPinGateModalProps) {
  const [pinInput, setPinInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  if (!open) return null;

  const handleDigit = (digit: string) => {
    if (pinInput.length >= 4) return;
    const next = pinInput + digit;
    setPinInput(next);
    setError(false);
    if (next.length === 4) {
      if (next === correctPin) {
        setUnlocked(true);
      } else {
        setError(true);
        setTimeout(() => setPinInput(''), 350);
      }
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClose = () => {
    setPinInput('');
    setUnlocked(false);
    setError(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[390px] rounded-[28px] bg-white p-5 shadow-2xl border border-[#E2E8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#EAF1FB] text-[#0A4F9E] flex items-center justify-center">
              {unlocked ? (
                <Unlock className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </div>
            <div>
              <h2 className="text-[15.5px] font-extrabold text-[#0F172A]">
                {unlocked
                  ? 'Zona Pendampingan Terbatas'
                  : 'Verifikasi PIN Orang Tua'}
              </h2>
              <div className="text-[11px] text-[#64748B]">
                {unlocked
                  ? 'Akses cepat di Perangkat Anak'
                  : 'Parental Gate • Akun #RDV-88219'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup panel PIN"
            className="min-w-[40px] min-h-[40px] rounded-full bg-[#F1F5F9] text-[#334155] flex items-center justify-center cursor-pointer hover:bg-[#E2E8F0]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!unlocked ? (
          <div>
            <p className="text-[12.5px] text-[#475569] text-center mb-4">
              Masukkan 4 digit PIN untuk membuka kontrol cepat di perangkat anak.
              <span className="block text-[11px] font-semibold text-[#0A4F9E] mt-1">
                PIN standar uji coba: {correctPin}
              </span>
            </p>

            {/* PIN Dots */}
            <div className="flex items-center justify-center gap-3 mb-5">
              {[0, 1, 2, 3].map((idx) => {
                const filled = idx < pinInput.length;
                return (
                  <div
                    key={idx}
                    className={`w-11 h-12 rounded-2xl border-2 flex items-center justify-center text-[18px] font-extrabold transition-colors ${
                      error
                        ? 'border-[#DC2626] bg-[#FEF2F2] text-[#DC2626]'
                        : filled
                        ? 'border-[#0A4F9E] bg-[#EAF1FB] text-[#0A4F9E]'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8]'
                    }`}
                  >
                    {filled ? '•' : ''}
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="text-center text-[12px] font-bold text-[#DC2626] mb-3">
                PIN salah. Silakan coba lagi.
              </div>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDigit(d)}
                  className="min-h-[48px] rounded-2xl bg-[#F8FAFC] hover:bg-[#EAF1FB] border border-[#E2E8F0] text-[17px] font-bold text-[#0F172A] cursor-pointer active:scale-95 transition-transform"
                >
                  {d}
                </button>
              ))}
              <div />
              <button
                type="button"
                onClick={() => handleDigit('0')}
                className="min-h-[48px] rounded-2xl bg-[#F8FAFC] hover:bg-[#EAF1FB] border border-[#E2E8F0] text-[17px] font-bold text-[#0F172A] cursor-pointer active:scale-95 transition-transform"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                aria-label="Hapus digit"
                className="min-h-[48px] rounded-2xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] flex items-center justify-center cursor-pointer"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {/* Limited summary on Child Device */}
            <div className="rounded-[18px] bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#0A4F9E]" />
                <div>
                  <div className="text-[12.5px] font-bold text-[#0F172A]">
                    Waktu Baca Hari Ini
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Batas harian: {focusDurationMinutes} menit
                  </div>
                </div>
              </div>
              <span className="text-[15px] font-extrabold text-[#0A4F9E] tabular-nums">
                {readingMinutesToday} mnt
              </span>
            </div>

            {/* Quick Focus Mode Toggle */}
            <div className="rounded-[18px] bg-[#F4F8FF] border border-[#BFDBFE] p-3.5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[13px] font-bold text-[#0F172A]">
                  Kunci Fokus Baca
                </div>
                <div className="text-[11px] text-[#475569]">
                  {focusLockEnabled
                    ? 'Aktif di perangkat ini'
                    : 'Nonaktif sementara'}
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleFocusLock}
                aria-label="Toggle Kunci Fokus"
                className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  focusLockEnabled ? 'bg-[#0A4F9E]' : 'bg-[#CBD5E1]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    focusLockEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Limited Notice */}
            <div className="rounded-[18px] bg-[#FFF7ED] border border-[#FED7AA] p-3.5 text-[12px] text-[#9A3412] space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>Kontrol Terbatas di Perangkat Anak</span>
              </div>
              <p className="leading-relaxed text-[11.5px]">
                Untuk melindungi anak, laporan mingguan lengkap, persetujuan
                pembelian, dan pembayaran Readventure Plus hanya dapat diakses
                dari Perangkat Orang Tua.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                handleClose();
                onSwitchToParentDevice();
              }}
              className="w-full min-h-[44px] rounded-full bg-[#0F7643] hover:bg-[#0B5B33] text-white text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Buka Dashboard Perangkat Orang Tua</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
