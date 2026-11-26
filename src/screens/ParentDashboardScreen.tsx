import { useState } from 'react';
import {
  ArrowLeft,
  Award,
  Bell,
  BookOpen,
  CheckCircle2,
  CreditCard,
  Clock,
  Flame,
  Heart,
  Lightbulb,
  Lock,
  Shield,
  Smile,
  Sparkles,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import {
  CHILD_PROFILES,
  WEEKLY_READING_BARS,
} from '../data/readventureData';
import { ApprovalRequest } from '../types';

interface ParentDashboardScreenProps {
  activeChildId: 'arka' | 'dira';
  level: number;
  totalXpNumber: number;
  isPlusActive: boolean;
  coins: number;
  learnedVocab: string[];
  bookProgress: Record<string, number>;
  focusLockEnabled: boolean;
  focusDurationMinutes: number;
  purchaseApprovalRequired: boolean;
  gentleReminderEnabled: boolean;
  parentPin: string;
  pendingRequests: ApprovalRequest[];
  onSwitchChild: (id: 'arka' | 'dira') => void;
  onToggleFocusLock: () => void;
  onChangeFocusDuration: (mins: number) => void;
  onTogglePurchaseApproval: () => void;
  onToggleGentleReminder: () => void;
  onResolveRequest: (requestId: string, approved: boolean) => void;
  onDirectCheckout: (type: 'plus_subscription' | 'coin_pack') => void;
  onSendEncouragement: (message: string) => void;
  onSwitchToChildDevice: () => void;
}

const DURATION_STEPS = [15, 30, 45, 60, 90];

const ENCOURAGEMENT_PRESETS = [
  'Semangat lanjutkan membaca Bab 4 hari ini ya, Ayah & Bunda bangga!',
  'Hebat sudah konsisten membaca minggu ini! Jangan lupa istirahat mata.',
  'Keren kosa kata barumu bertambah terus. Yuk cerita setelah makan malam!',
];

export function ParentDashboardScreen({
  activeChildId,
  level,
  totalXpNumber,
  isPlusActive,
  coins,
  learnedVocab,
  bookProgress,
  focusLockEnabled,
  focusDurationMinutes,
  purchaseApprovalRequired,
  gentleReminderEnabled,
  parentPin,
  pendingRequests,
  onSwitchChild,
  onToggleFocusLock,
  onChangeFocusDuration,
  onTogglePurchaseApproval,
  onToggleGentleReminder,
  onResolveRequest,
  onDirectCheckout,
  onSendEncouragement,
  onSwitchToChildDevice,
}: ParentDashboardScreenProps) {
  const [childMenuOpen, setChildMenuOpen] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState<{
    requestId?: string;
    type: 'plus_subscription' | 'coin_pack';
    title: string;
    priceLabel: string;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    'qris' | 'va' | 'card'
  >('qris');
  const [checkoutPin, setCheckoutPin] = useState('');
  const [checkoutError, setCheckoutError] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  const [encouragementText, setEncouragementText] = useState(
    ENCOURAGEMENT_PRESETS[0]
  );
  const [sentNotice, setSentNotice] = useState(false);

  const profile = CHILD_PROFILES[activeChildId];
  const durationIdx = Math.max(
    0,
    DURATION_STEPS.indexOf(focusDurationMinutes)
  );
  const pendingOnly = pendingRequests.filter((r) => r.status === 'pending');
  const currentProgress = bookProgress['misteri-hutan-rimba'] ?? 68;

  const handleConfirmPayment = () => {
    if (checkoutPin !== parentPin) {
      setCheckoutError(true);
      return;
    }
    if (!checkoutTarget) return;
    if (checkoutTarget.requestId) {
      onResolveRequest(checkoutTarget.requestId, true);
    } else {
      onDirectCheckout(checkoutTarget.type);
    }
    setCheckoutSuccess(
      checkoutTarget.type === 'plus_subscription'
        ? 'Readventure Plus aktif & tersinkron ke perangkat anak!'
        : '+500 Koin Bintang dikirim ke akun anak!'
    );
    setCheckoutTarget(null);
    setCheckoutPin('');
    setCheckoutError(false);
    setTimeout(() => setCheckoutSuccess(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F2F6FC] pb-10">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E5ECF6]">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onSwitchToChildDevice}
              aria-label="Kembali ke Perangkat Anak"
              className="min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center hover:bg-[#F1F5F9] cursor-pointer text-[#0F172A]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-[16px] font-bold text-[#0F172A] leading-tight">
                Parent Dashboard
              </h1>
              <div className="text-[11px] text-[#64748B]">
                Perangkat ke-2 · Terhubung Akun #RDV-88219
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-3 py-1 text-[11px] font-bold text-[#15803D]">
              <Shield className="w-3.5 h-3.5" />
              Kontrol &amp; Pembayaran Penuh
            </span>
            <div className="w-9 h-9 rounded-full bg-[#0A4F9E] text-white flex items-center justify-center shadow-xs">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-5">
        {/* Top Mode Action Pills + Child Switcher */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-5 grid grid-cols-2 gap-2.5">
            <div className="rounded-full bg-[#0F7643] px-3.5 py-2.5 text-white text-[12px] font-bold flex items-center justify-center gap-2 shadow-xs">
              <Shield className="w-4 h-4 shrink-0" />
              <span className="leading-tight">
                Mode Orang
                <br />
                Tua Aktif
              </span>
            </div>

            <button
              type="button"
              onClick={onSwitchToChildDevice}
              className="rounded-full bg-[#DBEAFE] hover:bg-[#BFDBFE] px-3.5 py-2.5 text-[#0A4F9E] text-[12px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Smile className="w-4 h-4 shrink-0" />
              <span className="leading-tight text-left">
                Kembali ke
                <br />
                Perangkat Anak
              </span>
            </button>
          </div>

          <div className="lg:col-span-7 relative rounded-[22px] bg-white p-3.5 border border-[#E8EEF7] shadow-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={profile.avatar}
                  alt={profile.parentChildName}
                  className="w-11 h-11 rounded-full object-cover border border-[#CBD5E1]"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#16A34A] text-white flex items-center justify-center border-2 border-white">
                  <CheckCircle2 className="w-3 h-3" />
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14.5px] font-bold text-[#0F172A] truncate">
                    {profile.parentChildName}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0A4F9E] shrink-0" />
                </div>
                <div className="text-[11.5px] text-[#64748B]">
                  {profile.parentChildMeta} · {coins} Koin Bintang
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setChildMenuOpen(!childMenuOpen)}
              className="min-h-[38px] rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] px-3.5 py-1.5 text-[12px] font-bold text-[#0F172A] cursor-pointer shrink-0"
            >
              Ganti ⌄
            </button>

            {childMenuOpen && (
              <div className="absolute right-3 top-16 z-20 w-56 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl p-1.5">
                {(['arka', 'dira'] as const).map((cid) => {
                  const cp = CHILD_PROFILES[cid];
                  return (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => {
                        onSwitchChild(cid);
                        setChildMenuOpen(false);
                      }}
                      className={`w-full rounded-xl px-3 py-2 text-left flex items-center gap-2.5 cursor-pointer ${
                        activeChildId === cid
                          ? 'bg-[#EAF1FB] text-[#0A4F9E]'
                          : 'hover:bg-[#F8FAFC] text-[#0F172A]'
                      }`}
                    >
                      <img
                        src={cp.avatar}
                        alt={cp.parentChildName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-[12.5px] font-bold">
                          {cp.parentChildName}
                        </div>
                        <div className="text-[10.5px] text-[#64748B]">
                          {cp.parentChildMeta}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Ringkasan Aktivitas (Full-width 4-card strip on desktop, 2x2 on mobile) */}
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-[14.5px] font-bold text-[#0F172A]">
              Ringkasan Aktivitas
            </h2>
            <span className="text-[11.5px] font-medium text-[#64748B]">
              7 Hari Terakhir
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-[20px] bg-white p-3.5 border border-[#E8EEF7] shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-8 h-8 rounded-full bg-[#DBEAFE] text-[#0A4F9E] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="rounded-full bg-[#DBEAFE] px-2 py-0.5 text-[10.5px] font-bold text-[#0A4F9E] tabular-nums">
                  {profile.weeklyTargetPercent}
                </span>
              </div>
              <div className="text-[18px] font-extrabold text-[#0F172A] tabular-nums">
                {profile.weeklyReadSummary}
              </div>
              <div className="text-[11.5px] text-[#64748B] mt-0.5">
                Dari target {profile.weeklyFocusTargetHours} jam
              </div>
            </div>

            <div className="rounded-[20px] bg-white p-3.5 border border-[#E8EEF7] shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-[#EA580C]/20" />
                </div>
                <span className="rounded-full bg-[#FFEDD5] px-2 py-0.5 text-[10.5px] font-bold text-[#C2410C]">
                  Aktif
                </span>
              </div>
              <div className="text-[18px] font-extrabold text-[#0F172A] tabular-nums">
                {profile.weeklyActiveDays}
              </div>
              <div className="text-[11.5px] text-[#64748B] mt-0.5">
                Streak terjaga prima
              </div>
            </div>

            <div className="rounded-[20px] bg-white p-3.5 border border-[#E8EEF7] shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-8 h-8 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-[#64748B]">
                  Bulan Ini
                </span>
              </div>
              <div className="text-[18px] font-extrabold text-[#0F172A] tabular-nums">
                {profile.booksThisMonth} Buku
              </div>
              <div className="text-[11.5px] text-[#64748B] mt-0.5 leading-snug">
                +1 buku dibanding bln lalu
              </div>
            </div>

            <div className="rounded-[20px] bg-white p-3.5 border border-[#E8EEF7] shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-8 h-8 rounded-full bg-[#DBEAFE] text-[#0A4F9E] flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <span className="rounded-full bg-[#DBEAFE] px-2 py-0.5 text-[10.5px] font-bold text-[#0A4F9E] tabular-nums">
                  Lv. {level}
                </span>
              </div>
              <div className="text-[18px] font-extrabold text-[#0F172A] tabular-nums">
                {totalXpNumber.toLocaleString('id-ID')} XP
              </div>
              <div className="text-[11.5px] text-[#64748B] mt-0.5">
                Petualang Elit
              </div>
            </div>
          </div>
        </section>

        {/* Main 2-Column Workspace on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Analytics, Current Reading, Exclusive Billing */}
          <div className="lg:col-span-7 space-y-5">
            {/* Persetujuan & Pembayaran Eksklusif Orang Tua */}
            <section className="rounded-[22px] bg-white p-4 border-2 border-[#0F7643]/25 shadow-xs space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#0F172A]">
                      Persetujuan &amp; Pembayaran Orang Tua
                    </h2>
                    <p className="text-[11.5px] text-[#64748B]">
                      Seluruh transaksi &amp; langganan hanya dapat diselesaikan
                      dari perangkat ini.
                    </p>
                  </div>
                </div>
                {pendingOnly.length > 0 && (
                  <span className="shrink-0 rounded-full bg-[#F97316] px-2.5 py-0.5 text-[11px] font-extrabold text-white tabular-nums">
                    {pendingOnly.length} Menunggu
                  </span>
                )}
              </div>

              {checkoutSuccess && (
                <div className="rounded-xl bg-[#DCFCE7] border border-[#86EFAC] px-3.5 py-2.5 text-[12px] font-bold text-[#14532D] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>{checkoutSuccess}</span>
                </div>
              )}

              {pendingOnly.length > 0 && (
                <div className="space-y-2.5">
                  {pendingOnly.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-[16px] bg-[#FFF7ED] border border-[#FED7AA] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-[13px] font-bold text-[#0F172A]">
                          {req.title} ·{' '}
                          <span className="text-[#C2410C]">
                            {req.priceLabel}
                          </span>
                        </div>
                        <div className="text-[11.5px] text-[#7C2D12]">
                          {req.description} ({req.requestedAt})
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onResolveRequest(req.id, false)}
                          className="min-h-[38px] rounded-full bg-white border border-[#E2E8F0] px-3 py-1.5 text-[11.5px] font-bold text-[#475569] cursor-pointer hover:bg-[#F8FAFC]"
                        >
                          Tolak
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCheckoutTarget({
                              requestId: req.id,
                              type: req.type,
                              title: req.title,
                              priceLabel: req.priceLabel,
                            })
                          }
                          className="min-h-[38px] rounded-full bg-[#0F7643] hover:bg-[#0B5B33] px-3.5 py-1.5 text-[11.5px] font-bold text-white cursor-pointer"
                        >
                          Setujui &amp; Bayar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0] p-3 flex flex-col justify-between gap-2.5">
                  <div>
                    <div className="text-[13px] font-bold text-[#0F172A]">
                      Readventure Plus (VIP)
                    </div>
                    <div className="text-[11.5px] text-[#64748B]">
                      Rp 29.000 / bulan · Buku eksklusif &amp; offline
                    </div>
                  </div>
                  {isPlusActive ? (
                    <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#15803D]">
                      <CheckCircle2 className="w-4 h-4" />
                      Aktif untuk Keluarga
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setCheckoutTarget({
                          type: 'plus_subscription',
                          title: 'Readventure Plus (Paket Keluarga)',
                          priceLabel: 'Rp 29.000 / bulan',
                        })
                      }
                      className="min-h-[40px] rounded-full bg-[#0A4F9E] hover:bg-[#083F80] text-white text-[12px] font-bold cursor-pointer"
                    >
                      Aktifkan Readventure Plus
                    </button>
                  )}
                </div>

                <div className="rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0] p-3 flex flex-col justify-between gap-2.5">
                  <div>
                    <div className="text-[13px] font-bold text-[#0F172A]">
                      Hadiah 500 Koin Bintang
                    </div>
                    <div className="text-[11.5px] text-[#64748B]">
                      Rp 15.000 · Tambah koin hadiah baca anak
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setCheckoutTarget({
                        type: 'coin_pack',
                        title: 'Paket +500 Koin Bintang',
                        priceLabel: 'Rp 15.000',
                      })
                    }
                    className="min-h-[40px] rounded-full bg-white hover:bg-[#EAF1FB] border border-[#0A4F9E] text-[#0A4F9E] text-[12px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Beli &amp; Kirim Koin</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Distribusi Waktu Baca */}
            <section className="rounded-[22px] bg-white p-4 border border-[#E8EEF7] shadow-xs">
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-[15px] font-bold text-[#0F172A]">
                    Distribusi Waktu Baca
                  </h2>
                  <div className="text-[11.5px] text-[#64748B]">
                    Aktivitas Senin – Minggu
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-semibold text-[#475569] shrink-0">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#0A4F9E]" />
                    Fokus
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#93C5FD]" />
                    Jelajah
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 items-end pt-2">
                {WEEKLY_READING_BARS.map((bar) => (
                  <div key={bar.day} className="flex flex-col items-center">
                    <span
                      className={`text-[11px] font-bold mb-1.5 tabular-nums ${
                        bar.highlight === 'orange'
                          ? 'text-[#B45309]'
                          : bar.highlight === 'blue'
                          ? 'text-[#0A4F9E]'
                          : 'text-[#64748B]'
                      }`}
                    >
                      {bar.total}
                    </span>

                    <div className="w-4 h-[108px] rounded-full bg-[#F1F5F9] overflow-hidden flex flex-col justify-end">
                      {bar.jelajahH > 0 && (
                        <div
                          style={{ height: `${bar.jelajahH}%` }}
                          className={
                            bar.highlight === 'orange'
                              ? 'bg-[#FDBA74] w-full'
                              : 'bg-[#CBD5E1] w-full'
                          }
                        />
                      )}
                      {bar.fokusH > 0 && (
                        <div
                          style={{ height: `${bar.fokusH}%` }}
                          className={
                            bar.highlight === 'orange'
                              ? 'bg-[#FB923C] w-full rounded-b-full'
                              : 'bg-[#0A4F9E] w-full rounded-b-full'
                          }
                        />
                      )}
                    </div>

                    <span
                      className={`text-[11px] mt-1.5 ${
                        bar.highlight
                          ? 'font-bold text-[#0F172A]'
                          : 'text-[#64748B]'
                      }`}
                    >
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[14px] bg-[#F8FAFC] px-3 py-2.5 flex items-start gap-2 text-[11.5px] text-[#334155]">
                <TrendingUp className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>
                  Pola membaca {profile.name} memuncak di akhir pekan saat sore
                  hari (16.00 – 17.30).
                </span>
              </div>
            </section>

            {/* Sedang Dibaca */}
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-[14.5px] font-bold text-[#0F172A]">
                  Sedang Dibaca {profile.name}
                </h2>
                <span className="text-[12px] font-bold text-[#0A4F9E]">
                  Bab 4 dari 12
                </span>
              </div>

              <div className="rounded-[22px] bg-white p-3.5 border border-[#E8EEF7] shadow-xs">
                <div className="flex gap-3">
                  <img
                    src="./assets/images/cover-hutan-rimba.jpg"
                    alt="Misteri Hutan Rimba"
                    className="w-[74px] h-[102px] rounded-[12px] object-cover shrink-0 border border-[#E2E8F0]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="inline-block rounded-full bg-[#DBEAFE] px-2.5 py-0.5 text-[10.5px] font-bold text-[#0A4F9E]">
                      Komik Sains &amp; Fiksi
                    </span>
                    <h3 className="text-[15px] font-bold text-[#0F172A] mt-1">
                      Misteri Hutan Rimba
                    </h3>
                    <div className="text-[11.5px] text-[#64748B]">
                      Karya Maya Sari • 184 Hal.
                    </div>

                    <div className="flex items-center justify-between text-[11px] mt-2 mb-1">
                      <span className="text-[#475569]">Progres Baca</span>
                      <span className="font-bold text-[#0A4F9E] tabular-nums">
                        {currentProgress}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0A4F9E] transition-all"
                        style={{ width: `${currentProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 rounded-[16px] bg-[#F8FAFC] p-3">
                  <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#0F172A] mb-2">
                    <Lightbulb className="w-4 h-4 text-[#15803D]" />
                    <span>Wawasan &amp; Kosakata Baru yang Dipelajari:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {learnedVocab.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white border border-[#E2E8F0] px-2.5 py-1 text-[11px] font-semibold text-[#1E293B]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Controls, SD Conversation Tips, Encouragement Card */}
          <div className="lg:col-span-5 space-y-5">
            {/* Kontrol Pendampingan */}
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-[14.5px] font-bold text-[#0F172A]">
                  Kontrol Pendampingan
                </h2>
                <span className="text-[11.5px] text-[#64748B]">
                  Atur Batasan Sehat
                </span>
              </div>

              <div className="rounded-[22px] bg-white p-4 border border-[#E8EEF7] shadow-xs space-y-4">
                <div className="rounded-[18px] bg-[#F4F8FF] border-2 border-[#0A4F9E] p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#0A4F9E] text-white flex items-center justify-center shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[13.5px] font-bold text-[#0F172A] leading-snug">
                          Kunci Aplikasi (Mode Fokus Baca)
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-bold text-[#15803D] mt-1">
                          <Lock className="w-2.5 h-2.5" />
                          Perlindungan PIN Aktif ({parentPin})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onToggleFocusLock}
                      aria-label="Toggle Kunci Aplikasi"
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

                  <p className="text-[11.5px] text-[#475569] leading-relaxed mt-2.5">
                    Kunci sesi baca di perangkat anak agar fokus membaca hingga
                    target waktu tercapai atau dibuka dengan PIN Orang Tua.
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#DCE7F9]">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[12.5px] font-bold text-[#0F172A]">
                          Durasi Kunci Fokus Harian
                        </div>
                        <div className="text-[10.5px] text-[#64748B]">
                          Sinkron otomatis ke perangkat anak
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#DBEAFE] px-3 py-1 text-[11px] font-extrabold text-[#0A4F9E] text-center leading-tight tabular-nums">
                        {focusDurationMinutes}
                        <br />
                        Menit
                      </span>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={4}
                      step={1}
                      value={durationIdx}
                      onChange={(e) =>
                        onChangeFocusDuration(
                          DURATION_STEPS[Number(e.target.value)] ?? 45
                        )
                      }
                      className="w-full mt-3 accent-[#0A4F9E] cursor-pointer"
                    />

                    <div className="flex items-center justify-between text-[10.5px] mt-1">
                      {DURATION_STEPS.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => onChangeFocusDuration(m)}
                          className={`cursor-pointer ${
                            m === focusDurationMinutes
                              ? 'font-extrabold text-[#0A4F9E]'
                              : 'text-[#64748B]'
                          }`}
                        >
                          {m}m{m === 45 ? ' (Saran)' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Toggle 2 */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#0F172A]">
                        Izin Beli Koin &amp; Buku Baru
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Kirim notifikasi persetujuan ke perangkat orang tua
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onTogglePurchaseApproval}
                    aria-label="Toggle Izin Beli"
                    className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                      purchaseApprovalRequired ? 'bg-[#0A4F9E]' : 'bg-[#CBD5E1]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        purchaseApprovalRequired
                          ? 'translate-x-5'
                          : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 3 */}
                <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#F1F5F9]">
                  <div className="flex items-start gap-2.5 pt-2">
                    <div className="w-9 h-9 rounded-full bg-[#F1F5F9] text-[#475569] flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#0F172A]">
                        Pengingat Santai Otomatis
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Kirim sapaan hangat jika 2 hari tidak membuka buku
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onToggleGentleReminder}
                    aria-label="Toggle Pengingat Santai"
                    className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                      gentleReminderEnabled ? 'bg-[#0A4F9E]' : 'bg-[#CBD5E1]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        gentleReminderEnabled
                          ? 'translate-x-5'
                          : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* Tips Obrolan Tanpa Menguji — Age 8-12 SD */}
            <section className="rounded-[22px] bg-white p-4 border border-[#E8EEF7] shadow-xs">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-8 h-8 rounded-full bg-[#15803D] text-white flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h2 className="text-[14.5px] font-bold text-[#0F172A]">
                  Tips Obrolan Tanpa Menguji
                </h2>
              </div>

              <p className="text-[12.5px] text-[#334155] leading-relaxed">
                Anak usia SD (8–12 tahun) lebih antusias bercerita jika diajak
                berimajinasi bersama, bukan ditanya seperti ujian sekolah:{' '}
                <span className="italic font-semibold">
                  “Tadi isinya tentang apa?”
                </span>
              </p>

              <div className="mt-3 rounded-[16px] bg-[#EAF1FB] p-3.5 text-[12px]">
                <div className="font-bold text-[#0A4F9E]">
                  Coba lontarkan pertanyaan seru ini saat santai bersama:
                </div>
                <div className="italic text-[#1E293B] mt-1 leading-relaxed">
                  “Kalau kamu jadi Rian dan Maya di lorong kristal tadi, kira-kira
                  benda apa yang paling ingin kamu bawa di dalam ransel?”
                </div>
              </div>
            </section>

            {/* Kirim Kartu Semangat ke Perangkat Anak */}
            <section className="rounded-[22px] bg-white p-4 border border-[#E8EEF7] shadow-xs space-y-3">
              <div className="text-[14px] font-bold text-[#0F172A]">
                Kirim Kartu Semangat untuk {profile.name}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {ENCOURAGEMENT_PRESETS.map((msg, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setEncouragementText(msg)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold cursor-pointer border ${
                      encouragementText === msg
                        ? 'bg-[#FFF2E5] border-[#FDBA74] text-[#9A3412]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569]'
                    }`}
                  >
                    Pesan #{i + 1}
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                value={encouragementText}
                onChange={(e) => setEncouragementText(e.target.value)}
                className="w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 text-[12.5px] text-[#0F172A] focus:outline-none focus:border-[#0A4F9E]"
              />

              <button
                type="button"
                onClick={() => {
                  if (!encouragementText.trim()) return;
                  onSendEncouragement(encouragementText.trim());
                  setSentNotice(true);
                  setTimeout(() => setSentNotice(false), 3000);
                }}
                className="w-full min-h-[48px] rounded-full bg-[#F97316] hover:bg-[#EA580C] py-3 px-4 text-[13.5px] font-bold text-white flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>
                  {sentNotice
                    ? `Kartu Semangat Terkirim ke ${profile.name}!`
                    : `Kirim Kartu Semangat ke Akun ${profile.name}`}
                </span>
              </button>
            </section>
          </div>
        </div>
      </div>

      {/* Exclusive Parent Checkout Modal */}
      {checkoutTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs px-4"
          onClick={() => setCheckoutTarget(null)}
        >
          <div
            className="w-full max-w-[400px] rounded-[28px] bg-white p-5 shadow-2xl border border-[#E2E8F0]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-[15.5px] font-extrabold text-[#0F172A]">
                    Pembayaran Orang Tua
                  </h2>
                  <div className="text-[11px] text-[#64748B]">
                    Otorisasi khusus Perangkat Orang Tua
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutTarget(null)}
                className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-[18px] bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 mb-4">
              <div className="text-[12px] text-[#64748B]">Item Dipilih</div>
              <div className="text-[15px] font-bold text-[#0F172A] mt-0.5">
                {checkoutTarget.title}
              </div>
              <div className="text-[14px] font-extrabold text-[#0A4F9E] mt-1">
                {checkoutTarget.priceLabel}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-[12px] font-bold text-[#475569] mb-2">
                Metode Pembayaran
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'qris', label: 'QRIS' },
                    { id: 'va', label: 'Transfer VA' },
                    { id: 'card', label: 'Kartu Bank' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`min-h-[42px] rounded-xl border text-[12px] font-bold cursor-pointer ${
                      paymentMethod === m.id
                        ? 'bg-[#EAF1FB] border-[#0A4F9E] text-[#0A4F9E]'
                        : 'bg-white border-[#E2E8F0] text-[#475569]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[12px] font-bold text-[#475569] mb-1.5">
                Konfirmasi PIN Orang Tua (standar: {parentPin})
              </label>
              <input
                type="password"
                maxLength={4}
                value={checkoutPin}
                onChange={(e) => {
                  setCheckoutPin(e.target.value);
                  setCheckoutError(false);
                }}
                placeholder="Masukkan 4 digit PIN"
                className="w-full min-h-[44px] rounded-xl border border-[#CBD5E1] px-3.5 text-[14px] font-bold tracking-widest focus:outline-none focus:border-[#0A4F9E]"
              />
              {checkoutError && (
                <div className="text-[11.5px] font-bold text-[#DC2626] mt-1">
                  PIN tidak sesuai. Gunakan PIN orang tua ({parentPin}).
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleConfirmPayment}
              className="w-full min-h-[46px] rounded-full bg-[#0F7643] hover:bg-[#0B5B33] text-white text-[13.5px] font-bold cursor-pointer transition-colors"
            >
              Bayar &amp; Aktifkan Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
