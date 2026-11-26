import { useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Crown,
  Flame,
  Glasses,
  Home,
  Lock,
  Microscope,
  Moon,
  Palette,
  Shield,
  Sparkles,
  Star,
  Ticket,
  TreePine,
  User,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';
import {
  CHILD_PROFILES,
  PROFILE_THEMES,
  STUDIO_ITEMS,
  TROPHY_BADGES,
} from '../data/readventureData';
import { ApprovalRequest, StudioItem } from '../types';

interface ProfilScreenProps {
  activeChildId: 'arka' | 'dira';
  level: number;
  totalXpNumber: number;
  coins: number;
  chestTickets: number;
  streakDays: number;
  isPlusActive: boolean;
  activeThemeId: 'rimba' | 'samudra' | 'nebula';
  unlockedStudioIds: string[];
  equippedStudio: {
    kostum: string;
    topi: string | null;
    efek: string | null;
  };
  pendingRequests: ApprovalRequest[];
  onCycleTheme: () => void;
  onEquipItem: (item: StudioItem) => void;
  onOpenPinGate: () => void;
  onRequestPlusApproval: () => void;
  onRequestCoinPackApproval: () => void;
}

export function ProfilScreen({
  activeChildId,
  level,
  totalXpNumber,
  coins,
  chestTickets,
  streakDays,
  isPlusActive,
  activeThemeId,
  unlockedStudioIds,
  equippedStudio,
  pendingRequests,
  onCycleTheme,
  onEquipItem,
  onOpenPinGate,
  onRequestPlusApproval,
  onRequestCoinPackApproval,
}: ProfilScreenProps) {
  const [studioTab, setStudioTab] = useState<'kostum' | 'topi' | 'efek'>(
    'kostum'
  );
  const [studioNotice, setStudioNotice] = useState<string | null>(null);

  const profile = CHILD_PROFILES[activeChildId];
  const theme =
    PROFILE_THEMES.find((t) => t.id === activeThemeId) ?? PROFILE_THEMES[0];
  const tabItems = STUDIO_ITEMS.filter((i) => i.slot === studioTab);
  const equippedCostume = STUDIO_ITEMS.find(
    (i) => i.id === equippedStudio.kostum
  );

  const hasPendingPlus = pendingRequests.some(
    (r) => r.type === 'plus_subscription' && r.status === 'pending'
  );
  const hasPendingCoins = pendingRequests.some(
    (r) => r.type === 'coin_pack' && r.status === 'pending'
  );

  return (
    <div className="px-4 pt-3.5 pb-7 space-y-4">
      {/* Zona Pendampingan Orang Tua Bar (Terbatas via PIN) */}
      <div className="rounded-[18px] bg-white px-3.5 py-2.5 border border-[#E8EEF7] shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[12.5px] font-semibold text-[#1E293B]">
          <Users className="w-4 h-4 text-[#0A4F9E] shrink-0" />
          <span className="leading-tight">
            Zona Pendampingan
            <br />
            Orang Tua
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenPinGate}
          className="min-h-[40px] rounded-full bg-[#EAF1FB] hover:bg-[#DCE7F9] px-3.5 py-1.5 text-[12px] font-bold text-[#0A4F9E] flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Lock className="w-3.5 h-3.5" />
          <span className="leading-tight text-left">
            Akses
            <br />
            PIN
          </span>
        </button>
      </div>

      {/* Hero Profile Card */}
      <section className="rounded-[24px] bg-white overflow-hidden border border-[#E8EEF7] shadow-[0_4px_18px_rgba(15,23,42,0.05)]">
        <div className="relative h-[132px]">
          <img
            src={theme.banner}
            alt={theme.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/20" />

          <span className="absolute top-3 left-3 rounded-full bg-[#0F172A]/75 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-white flex items-center gap-1">
            <TreePine className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>Tema: {theme.name}</span>
          </span>

          <button
            type="button"
            onClick={onCycleTheme}
            className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#0F172A] flex items-center gap-1 shadow-sm cursor-pointer hover:bg-white"
          >
            <Palette className="w-3.5 h-3.5 text-[#0A4F9E]" />
            <span>Ganti Tema</span>
          </button>
        </div>

        <div className="px-4 pb-4 text-center">
          <div className="relative w-24 h-24 mx-auto -mt-12 mb-2.5">
            <img
              src={profile.avatar}
              alt={profile.fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-[#E2E8F0]"
            />
            {isPlusActive && (
              <span className="absolute -bottom-1 right-0 rounded-full bg-[#EA580C] text-white px-2 py-0.5 text-[9.5px] font-extrabold border-2 border-white shadow">
                VIP
              </span>
            )}
          </div>

          <div className="inline-flex items-center gap-1 rounded-full bg-[#0A4F9E] px-3 py-1 text-[11px] font-bold text-white shadow-xs">
            <Award className="w-3.5 h-3.5 text-[#FDE047]" />
            <span>Level {level} Petualang Elit</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-2">
            <h1 className="text-[18px] font-extrabold text-[#0F172A]">
              {profile.fullName}
            </h1>
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] fill-[#16A34A]/15" />
          </div>

          <div className="text-[12px] text-[#64748B] mt-0.5">
            ID Penjelajah: {profile.explorerId}
          </div>

          {equippedCostume && (
            <div className="mt-1.5 text-[11px] font-semibold text-[#15803D]">
              Kostum Aktif: {equippedCostume.name} ({equippedCostume.bonus})
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="rounded-[14px] bg-[#F8FAFC] py-2.5 px-2">
              <div className="text-[14px] font-extrabold text-[#B45309] flex items-center justify-center gap-1 tabular-nums">
                <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                <span>{coins}</span>
              </div>
              <div className="text-[11px] text-[#64748B] leading-tight mt-0.5">
                Koin
                <br />
                Bintang
              </div>
            </div>

            <div className="rounded-[14px] bg-[#F8FAFC] py-2.5 px-2">
              <div className="text-[14px] font-extrabold text-[#0A4F9E] flex items-center justify-center gap-1 tabular-nums">
                <Zap className="w-3.5 h-3.5 fill-[#0A4F9E] text-[#0A4F9E]" />
                <span>{totalXpNumber.toLocaleString('id-ID')}</span>
              </div>
              <div className="text-[11px] text-[#64748B] leading-tight mt-0.5">
                XP
                <br />
                Membaca
              </div>
            </div>

            <div className="rounded-[14px] bg-[#F8FAFC] py-2.5 px-2">
              <div className="text-[14px] font-extrabold text-[#15803D] flex items-center justify-center gap-1 tabular-nums">
                <Ticket className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>{chestTickets}</span>
              </div>
              <div className="text-[11px] text-[#64748B] leading-tight mt-0.5">
                Tiket Peti
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Karakter & Ruang Gaya */}
      <section className="rounded-[24px] bg-white p-4 border border-[#E8EEF7] shadow-xs">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFF2E5] flex items-center justify-center shrink-0 mt-0.5">
              <Home className="w-4 h-4 text-[#C2410C]" />
            </div>
            <div>
              <h2 className="text-[14.5px] font-bold text-[#0F172A] leading-snug">
                Studio Karakter &amp; Ruang Gaya
              </h2>
              <p className="text-[11.5px] text-[#64748B]">
                Ubah dandanan, aksesoris, &amp; efek {profile.name}
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-[#FFF2E5] px-2.5 py-1 text-[10.5px] font-bold text-[#C2410C] text-center leading-tight">
            Fitur
            <br />
            Aktif
          </span>
        </div>

        {/* Subtabs */}
        <div className="grid grid-cols-3 border-b border-[#E2E8F0] mt-3.5 text-[12px]">
          <button
            type="button"
            onClick={() => setStudioTab('kostum')}
            className={`pb-2.5 flex items-center justify-center gap-1 font-bold cursor-pointer border-b-2 transition-colors ${
              studioTab === 'kostum'
                ? 'text-[#0A4F9E] border-[#0A4F9E]'
                : 'text-[#64748B] border-transparent'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="leading-tight text-left">
              Ganti
              <br />
              Kostum
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStudioTab('topi')}
            className={`pb-2.5 flex items-center justify-center gap-1 font-bold cursor-pointer border-b-2 transition-colors ${
              studioTab === 'topi'
                ? 'text-[#0A4F9E] border-[#0A4F9E]'
                : 'text-[#64748B] border-transparent'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span className="leading-tight text-left">
              Topi &amp;
              <br />
              Aksesoris
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStudioTab('efek')}
            className={`pb-2.5 flex items-center justify-center gap-1 font-bold cursor-pointer border-b-2 transition-colors ${
              studioTab === 'efek'
                ? 'text-[#0A4F9E] border-[#0A4F9E]'
                : 'text-[#64748B] border-transparent'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="leading-tight text-left">
              Efek &amp;
              <br />
              Buff
            </span>
          </button>
        </div>

        {/* Studio Items Grid */}
        <div className="grid grid-cols-2 gap-3 mt-3.5">
          {tabItems.map((item) => {
            const isUnlocked =
              unlockedStudioIds.includes(item.id) &&
              (!item.unlockLevel || level >= item.unlockLevel);
            const isEquipped =
              (item.slot === 'kostum' && equippedStudio.kostum === item.id) ||
              (item.slot === 'topi' && equippedStudio.topi === item.id) ||
              (item.slot === 'efek' && equippedStudio.efek === item.id);

            return (
              <div
                key={item.id}
                className={`rounded-[18px] p-2.5 border flex flex-col justify-between ${
                  isEquipped
                    ? 'bg-[#F4F8FF] border-[#93C5FD]'
                    : 'bg-[#F8FAFC] border-[#E2E8F0]'
                }`}
              >
                <div>
                  <div className="relative h-[88px] rounded-[12px] bg-white border border-[#E2E8F0] overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-1"
                      />
                    ) : item.iconName === 'glasses' ? (
                      <Glasses className="w-10 h-10 text-[#0A4F9E]" />
                    ) : item.iconName === 'sparkles' ? (
                      <Sparkles className="w-10 h-10 text-[#D97706]" />
                    ) : (
                      <Crown className="w-10 h-10 text-[#15803D]" />
                    )}

                    {isEquipped && (
                      <span className="absolute top-1.5 right-1.5 rounded-full bg-[#15803D] px-2 py-0.5 text-[9.5px] font-bold text-white flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" />
                        Dipakai
                      </span>
                    )}
                    {!isUnlocked && (
                      <span className="absolute bottom-1.5 right-1.5 rounded-full bg-white/95 border border-[#E2E8F0] px-2 py-0.5 text-[9.5px] font-bold text-[#0F172A]">
                        {item.unlockLevel ? `Lv. ${item.unlockLevel}` : 'Peti'}
                      </span>
                    )}
                  </div>

                  <div className="text-[12.5px] font-bold text-[#0F172A] leading-snug mt-2">
                    {item.name}
                  </div>
                  <div
                    style={{ color: item.bonusColor }}
                    className="text-[11px] font-bold mt-0.5"
                  >
                    {item.bonus}
                  </div>
                </div>

                {isEquipped ? (
                  <button
                    type="button"
                    disabled
                    className="mt-2.5 min-h-[36px] w-full rounded-full bg-[#E2E8F0] py-1.5 text-[11.5px] font-bold text-[#64748B]"
                  >
                    Aktif
                  </button>
                ) : !isUnlocked ? (
                  <button
                    type="button"
                    onClick={() =>
                      setStudioNotice(
                        item.unlockLevel
                          ? `${item.name} terbuka di Level ${item.unlockLevel}!`
                          : `Buka peti Pusaka Mistik di Beranda untuk mendapatkan ${item.name}!`
                      )
                    }
                    className="mt-2.5 min-h-[36px] w-full rounded-full bg-[#DBEAFE] hover:bg-[#BFDBFE] py-1.5 text-[11.5px] font-bold text-[#0A4F9E] cursor-pointer"
                  >
                    Cara Buka
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onEquipItem(item);
                      setStudioNotice(`${item.name} berhasil dipasang!`);
                    }}
                    className="mt-2.5 min-h-[36px] w-full rounded-full bg-[#0A4F9E] hover:bg-[#083F80] py-1.5 text-[11.5px] font-bold text-white cursor-pointer transition-colors"
                  >
                    Pasang
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {studioNotice && (
          <div className="mt-3 rounded-xl bg-[#EAF1FB] text-[#0A4F9E] px-3 py-2 text-[11.5px] font-semibold text-center">
            {studioNotice}
          </div>
        )}
      </section>

      {/* Catatan Statistik Ekspedisi */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-[14.5px] font-bold text-[#0F172A]">
            Catatan Statistik Ekspedisi
          </h2>
          <span className="text-[12px] font-bold text-[#0A4F9E]">
            Bulan Ini
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-[18px] bg-white p-3 text-center border border-[#E8EEF7] shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#DBEAFE] text-[#0A4F9E] flex items-center justify-center mx-auto mb-1.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-[15px] font-extrabold text-[#0A4F9E] tabular-nums">
              14
            </div>
            <div className="text-[11px] text-[#64748B] leading-tight mt-0.5">
              Buku
              <br />
              Selesai
            </div>
          </div>

          <div className="rounded-[18px] bg-white p-3 text-center border border-[#E8EEF7] shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#FFF2E5] text-[#EA580C] flex items-center justify-center mx-auto mb-1.5">
              <Flame className="w-4 h-4 fill-[#EA580C]/20" />
            </div>
            <div className="text-[15px] font-extrabold text-[#EA580C] tabular-nums">
              {streakDays} Hari
            </div>
            <div className="text-[11px] text-[#64748B] leading-tight mt-0.5">
              Streak
              <br />
              Menyala
            </div>
          </div>

          <div className="rounded-[18px] bg-white p-3 text-center border border-[#E8EEF7] shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mx-auto mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-[15px] font-extrabold text-[#15803D] tabular-nums">
              {profile.monthHours}
            </div>
            <div className="text-[11px] text-[#64748B] leading-tight mt-0.5">
              Waktu
              <br />
              Baca
            </div>
          </div>
        </div>
      </section>

      {/* Lemari Trofi & Lencana */}
      <section className="rounded-[22px] bg-white p-4 border border-[#E8EEF7] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#B45309]" />
            <h2 className="text-[14.5px] font-bold text-[#0F172A]">
              Lemari Trofi &amp; Lencana
            </h2>
          </div>
          <span className="text-[11.5px] font-semibold text-[#64748B]">
            3 dari 4 Diraih
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {TROPHY_BADGES.map((badge, idx) => (
            <div
              key={badge.id}
              style={{ backgroundColor: badge.bg }}
              className="rounded-[16px] p-2.5 flex items-center gap-2.5"
            >
              <div
                style={{
                  backgroundColor: badge.iconBg,
                  color: badge.iconColor,
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              >
                {idx === 0 && <Award className="w-4 h-4" />}
                {idx === 1 && <Moon className="w-4 h-4" />}
                {idx === 2 && <Microscope className="w-4 h-4" />}
                {idx === 3 && <Lock className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-bold text-[#0F172A] truncate">
                  {badge.name}
                </div>
                <div
                  className={`text-[10.5px] leading-tight mt-0.5 ${
                    badge.unlocked
                      ? 'text-[#0A4F9E] font-semibold'
                      : 'text-[#64748B]'
                  }`}
                >
                  {badge.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mode Pendampingan Orang Tua CTA -> PIN Gate */}
      <div className="rounded-[20px] bg-[#DBEAFE] border border-[#BFDBFE] p-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0A4F9E] text-white flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[13px] font-bold text-[#0F172A] leading-tight">
              Mode Pendampingan Orang Tua
            </div>
            <div className="text-[11px] font-medium text-[#0A4F9E] mt-0.5">
              Akses cepat via PIN di perangkat ini
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPinGate}
          className="shrink-0 min-h-[40px] rounded-full bg-[#0A4F9E] hover:bg-[#083F80] px-3.5 py-2 text-[12px] font-bold text-white cursor-pointer transition-colors"
        >
          Buka Setelan
        </button>
      </div>

      {/* Readventure Plus VIP Card — ONLY Request Parent Approval from Child Device */}
      <div className="pt-2">
        <div className="flex justify-center -mb-3 relative z-10">
          <span className="rounded-full bg-[#BBF7D0] border border-[#4ADE80] px-3.5 py-1 text-[11px] font-bold text-[#14532D] flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Membaca Inti Selalu 100% Gratis!</span>
          </span>
        </div>

        <div className="rounded-[24px] bg-gradient-to-b from-[#FFFDF9] to-[#FFF3E2] border border-[#FAD6B0] px-4 pt-6 pb-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#FFEDD5] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-[#EA580C]" />
              </div>
              <div>
                <h3 className="text-[16px] font-extrabold text-[#0F172A]">
                  Readventure Plus
                </h3>
                <p className="text-[12px] text-[#475569] leading-snug mt-0.5">
                  Jelajahi lebih luas bersama seluruh keluarga dengan fitur VIP
                  yang mengasyikkan!
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-[#EA580C] px-2.5 py-1 text-[10.5px] font-bold text-white">
              {isPlusActive ? 'VIP Aktif' : 'Pilihan Populer'}
            </span>
          </div>

          <div className="mt-3.5 rounded-[16px] bg-white p-3 border border-[#F1E4D3] flex items-center justify-between">
            <div>
              <div className="text-[11px] text-[#64748B]">
                Paket Keluarga Terbuka
              </div>
              <div className="text-[16px] font-extrabold text-[#0A4F9E]">
                Rp 29.000{' '}
                <span className="text-[12px] font-semibold text-[#64748B]">
                  / bulan
                </span>
              </div>
            </div>
            <span className="rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-bold text-[#15803D]">
              Hemat 40%
            </span>
          </div>

          <ul className="mt-3.5 space-y-2 text-[12px] text-[#1E293B]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              <span>
                Akses seluruh katalog eksklusif kurasi penerbit ternama
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              <span>
                Dapatkan 5 kostum avatar legendaris tiap musim petualangan
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              <span>
                Unduh buku offline tanpa batas untuk dibaca di mana saja
              </span>
            </li>
          </ul>

          {isPlusActive ? (
            <div className="mt-4 w-full rounded-full bg-[#15803D] py-3 text-[13.5px] font-bold text-white flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Readventure Plus Aktif untuk Keluarga</span>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              <button
                type="button"
                disabled={hasPendingPlus}
                onClick={onRequestPlusApproval}
                className="w-full min-h-[46px] rounded-full bg-[#0A4F9E] hover:bg-[#083F80] disabled:bg-[#64748B] py-3 text-[13.5px] font-bold text-white flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {hasPendingPlus
                    ? 'Menunggu Persetujuan di Perangkat Orang Tua'
                    : 'Minta Izin Orang Tua'}
                </span>
              </button>

              <button
                type="button"
                disabled={hasPendingCoins}
                onClick={onRequestCoinPackApproval}
                className="w-full min-h-[40px] rounded-full bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] py-2 text-[12px] font-bold text-[#0A4F9E] cursor-pointer disabled:opacity-60"
              >
                {hasPendingCoins
                  ? 'Permintaan +500 Koin Menunggu Orang Tua'
                  : 'Minta Izin +500 Koin Bintang (Rp 15.000)'}
              </button>
            </div>
          )}

          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10.5px] text-[#64748B] text-center">
            <Shield className="w-3.5 h-3.5 text-[#0A4F9E] shrink-0" />
            <span>
              Pembayaran hanya dapat dilakukan langsung di Perangkat Orang Tua
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
