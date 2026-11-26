import { useState } from 'react';
import {
  Award,
  Bookmark,
  Check,
  Clock,
  Copy,
  Crown,
  Flame,
  Medal,
  MessageSquare,
  QrCode,
  Share2,
  Star,
  UserPlus,
  Zap,
} from 'lucide-react';
import {
  FRIEND_ACTIVITY,
  LEADERBOARD_LIST,
  LEADERBOARD_PODIUM,
} from '../data/readventureData';
import { ScreenId } from '../types';

interface PeringkatScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export function PeringkatScreen({ onNavigate }: PeringkatScreenProps) {
  const [subTab, setSubTab] = useState<'peringkat' | 'aktivitas'>('peringkat');
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard?.writeText('READ-ARKA7').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-4 pt-3.5 pb-6 space-y-4">
      {/* Top Segmented Control */}
      <div className="grid grid-cols-2 rounded-full bg-white p-1 border border-[#E2E8F0] shadow-xs">
        <button
          type="button"
          onClick={() => setSubTab('peringkat')}
          className={`rounded-full py-2 text-[13px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            subTab === 'peringkat'
              ? 'bg-[#0A4F9E] text-white shadow-sm'
              : 'text-[#64748B]'
          }`}
        >
          <Medal className="w-4 h-4" />
          <span>Peringkat</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('aktivitas')}
          className={`rounded-full py-2 text-[13px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            subTab === 'aktivitas'
              ? 'bg-[#0A4F9E] text-white shadow-sm'
              : 'text-[#64748B]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Aktivitas Teman</span>
        </button>
      </div>

      {/* Season Banner */}
      <div className="rounded-[22px] bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#FDBA74] p-4 text-white shadow-md flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1 text-[10.5px] font-extrabold tracking-wide text-orange-100">
            <Clock className="w-3.5 h-3.5" />
            <span>MUSIM EKSPEDISI 4</span>
          </div>
          <h2 className="text-[19px] font-extrabold text-white mt-0.5 leading-tight">
            Sisa 2 Hari Lagi! ⏳
          </h2>
          <p className="text-[12px] text-orange-50 mt-0.5">
            Raih 3 besar untuk mahkota legendaris!
          </p>
        </div>

        <div className="shrink-0 rounded-[16px] bg-white/25 backdrop-blur-xs px-3.5 py-2 text-center border border-white/25">
          <div className="text-[18px] font-extrabold leading-none">48</div>
          <div className="text-[10px] font-bold tracking-wider mt-0.5">JAM</div>
        </div>
      </div>

      {subTab === 'aktivitas' ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#0F172A]">
              Kabar Petualangan Teman
            </h3>
            <span className="text-[11.5px] font-semibold text-[#64748B]">
              Hari ini
            </span>
          </div>
          {FRIEND_ACTIVITY.map((item) => (
            <div
              key={item.id}
              className="rounded-[18px] bg-white p-3.5 border border-[#E8EEF7] shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#E2E8F0] shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[13.5px] font-bold text-[#0F172A]">
                    {item.name}
                  </div>
                  <div className="text-[12px] text-[#475569] leading-snug">
                    {item.action}
                  </div>
                  <div className="text-[11px] text-[#94A3B8] mt-0.5">
                    {item.time}
                  </div>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-bold text-[#15803D]">
                {item.xp}
              </span>
            </div>
          ))}
        </section>
      ) : (
        <>
          {/* Podium Juara Pekan Ini */}
          <section className="rounded-[24px] bg-white p-4 border border-[#E8EEF7] shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-center gap-1.5 mb-5">
              <Award className="w-4 h-4 text-[#D97706]" />
              <h2 className="text-[14.5px] font-bold text-[#0F172A]">
                Podium Juara Pekan Ini
              </h2>
            </div>

            <div className="grid grid-cols-3 items-end gap-2.5">
              {/* #2 Nadia B */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-2">
                  <img
                    src={LEADERBOARD_PODIUM.second.avatar}
                    alt={LEADERBOARD_PODIUM.second.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#CBD5E1] shadow-sm"
                  />
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#94A3B8] text-white flex items-center justify-center text-[10px] font-bold shadow">
                    2
                  </span>
                </div>
                <div className="text-[12.5px] font-bold text-[#0F172A]">
                  {LEADERBOARD_PODIUM.second.name}
                </div>
                <div className="text-[11.5px] font-bold text-[#0A4F9E]">
                  {LEADERBOARD_PODIUM.second.xp}
                </div>
                <div className="text-[10.5px] text-[#64748B] mb-2">
                  {LEADERBOARD_PODIUM.second.books}
                </div>
                <div className="w-full rounded-t-[14px] bg-[#F1F5F9] py-4">
                  <div className="text-[16px] font-extrabold text-[#1E293B]">
                    #2
                  </div>
                  <div className="text-[11px] font-medium text-[#64748B]">
                    Perak
                  </div>
                </div>
              </div>

              {/* #1 Bima Sakti */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-2">
                  <img
                    src={LEADERBOARD_PODIUM.first.avatar}
                    alt={LEADERBOARD_PODIUM.first.name}
                    className="w-20 h-20 rounded-full object-cover border-[3px] border-[#FDBA74] shadow-md"
                  />
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow">
                    <Crown className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-[13px] font-bold text-[#B45309]">
                  {LEADERBOARD_PODIUM.first.name}
                </div>
                <div className="text-[12.5px] font-extrabold text-[#0F172A]">
                  {LEADERBOARD_PODIUM.first.xp}
                </div>
                <div className="text-[10.5px] font-semibold text-[#64748B] mb-2">
                  {LEADERBOARD_PODIUM.first.books}
                </div>
                <div className="w-full rounded-t-[16px] bg-gradient-to-b from-[#FFE5CC] to-[#FFF1E2] py-6">
                  <div className="text-[18px] font-extrabold text-[#0F172A]">
                    #1
                  </div>
                  <div className="text-[11px] font-extrabold text-[#9A3412]">
                    JUARA 1
                  </div>
                </div>
              </div>

              {/* #3 Rian Petualang */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-2">
                  <img
                    src={LEADERBOARD_PODIUM.third.avatar}
                    alt={LEADERBOARD_PODIUM.third.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#D97706] shadow-sm"
                  />
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#B45309] text-white flex items-center justify-center text-[10px] font-bold shadow">
                    3
                  </span>
                </div>
                <div className="text-[12.5px] font-bold text-[#0F172A]">
                  {LEADERBOARD_PODIUM.third.name}
                </div>
                <div className="text-[11.5px] font-bold text-[#0A4F9E]">
                  {LEADERBOARD_PODIUM.third.xp}
                </div>
                <div className="text-[10.5px] text-[#64748B] mb-2">
                  {LEADERBOARD_PODIUM.third.books}
                </div>
                <div className="w-full rounded-t-[14px] bg-[#F1F5F9] py-3">
                  <div className="text-[16px] font-extrabold text-[#1E293B]">
                    #3
                  </div>
                  <div className="text-[11px] font-medium text-[#64748B]">
                    Perunggu
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* #7 Arka (Kamu) Card */}
          <div className="rounded-[22px] bg-gradient-to-r from-[#0A3A75] to-[#11509E] p-3.5 text-white shadow-md">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-[#0A4F9E] text-[15px] font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                  #7
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14.5px] font-bold text-white">
                      Arka (Kamu)
                    </span>
                    <span className="rounded-full bg-[#15803D] px-2 py-0.5 text-[10.5px] font-bold text-white">
                      Lv. 7
                    </span>
                  </div>
                  <div className="text-[12px] text-blue-100 mt-0.5">
                    1.450 XP Terkumpul
                  </div>
                </div>
              </div>

              <span className="rounded-full bg-[#FFF2E5] px-2.5 py-1 text-[11px] font-bold text-[#B45309] shrink-0">
                🔥 Kejar Top 5!
              </span>
            </div>

            <div className="mt-3 rounded-[12px] bg-white/10 px-3 py-2 flex items-center justify-between text-[11.5px]">
              <span className="flex items-center gap-1 font-semibold text-blue-50">
                <Zap className="w-3.5 h-3.5 text-[#FDE047] fill-[#FDE047]" />
                Selisih 80 XP ke posisi #5! 🔥
              </span>
              <button
                type="button"
                onClick={() => onNavigate('reader-text')}
                className="font-bold text-white hover:underline cursor-pointer"
              >
                Baca Sekarang →
              </button>
            </div>
          </div>

          {/* Petualang Teratas Lainnya */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[14.5px] font-bold text-[#0F172A]">
                Petualang Teratas Lainnya
              </h3>
              <span className="text-[11.5px] text-[#64748B]">
                Diperbarui 10m lalu
              </span>
            </div>

            <div className="space-y-2">
              {LEADERBOARD_LIST.map((row) => (
                <div
                  key={row.rank}
                  className="rounded-[16px] bg-white px-3.5 py-2.5 border border-[#E8EEF7] shadow-xs flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-center text-[13.5px] font-bold text-[#64748B]">
                      {row.rank}
                    </span>
                    <img
                      src={row.avatar}
                      alt={row.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-bold text-[#0F172A] truncate">
                        {row.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#64748B]">
                        <span className="rounded-full bg-[#DBEAFE] px-2 py-0.5 text-[10px] font-bold text-[#0A4F9E]">
                          {row.level}
                        </span>
                        <span>• {row.books}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[13.5px] font-bold text-[#0A4F9E]">
                      {row.xp}
                    </span>
                    {row.icon === 'award' && (
                      <Award className="w-4 h-4 text-[#F59E0B]" />
                    )}
                    {row.icon === 'medal' && (
                      <Medal className="w-4 h-4 text-[#16A34A]" />
                    )}
                    {row.icon === 'bookmark' && (
                      <Bookmark className="w-4 h-4 text-[#0A4F9E]" />
                    )}
                    {row.icon === 'star-circle' && (
                      <Star className="w-4 h-4 text-[#475569]" />
                    )}
                    {row.icon === 'flame' && (
                      <Flame className="w-4 h-4 text-[#64748B]" />
                    )}
                    {row.icon === 'star' && (
                      <Star className="w-4 h-4 text-[#94A3B8]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Misi Bersama Teman */}
          <section className="rounded-[24px] bg-gradient-to-br from-[#0A356B] to-[#114A8F] p-4 text-white shadow-lg">
            <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold tracking-wide text-blue-200">
              <UserPlus className="w-3.5 h-3.5" />
              <span>MISI BERSAMA TEMAN</span>
            </div>
            <h3 className="text-[18px] font-extrabold text-white leading-snug mt-1">
              Ajak Teman Sekolah
              <br />
              Berpetualang! 🎒
            </h3>
            <p className="text-[12px] text-blue-100 leading-relaxed mt-1">
              Dapatkan <span className="font-bold text-white">+300 XP</span> dan
              peti harta karun saat temanmu bergabung membaca!
            </p>

            <div className="mt-3.5 rounded-[18px] bg-white/10 border border-white/15 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold tracking-wider text-blue-100">
                  KODE PETUALANG UNIKMU
                </span>
                <span className="rounded-full bg-[#15803D] px-2 py-0.5 text-[10px] font-bold text-white">
                  Aktif
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-[12px] bg-white px-3 py-2 flex items-center justify-between text-[#0F172A]">
                  <span className="font-extrabold tracking-widest text-[14px]">
                    READ-ARKA7
                  </span>
                  <button
                    type="button"
                    onClick={copyCode}
                    aria-label="Salin kode"
                    className="text-[#475569] hover:text-[#0A4F9E] cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-[#16A34A]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={copyCode}
                  className="rounded-[12px] bg-[#D97706] hover:bg-[#B45309] px-3 py-2.5 text-[12px] font-bold text-white flex items-center gap-1 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={copyCode}
              className="mt-3.5 w-full rounded-full bg-[#FDE4C8] hover:bg-[#FBD6AF] py-3 text-[13.5px] font-bold text-[#78350F] flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>
                {copied ? 'Kode Undangan Disalin!' : 'Bagikan Undangan Sekarang'}
              </span>
            </button>
          </section>
        </>
      )}
    </div>
  );
}
