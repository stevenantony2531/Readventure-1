import { useState } from 'react';
import {
  Award,
  Bookmark,
  BookOpen,
  Check,
  Flame,
  Gift,
  Heart,
  HelpCircle,
  Lock,
  Play,
  Sparkles,
  Star,
  Target,
} from 'lucide-react';
import {
  CATALOG_BOOKS,
  CHILD_PROFILES,
  CURRENT_BOOK,
  GACHA_POOL,
  POPULAR_BOOKS,
  STUDIO_ITEMS,
} from '../data/readventureData';
import {
  BookItem,
  EncouragementCard,
  ScreenId,
  StudioItem,
} from '../types';
import { GachaChestModal } from '../components/GachaChestModal';

interface BerandaScreenProps {
  activeChildId: 'arka' | 'dira';
  level: number;
  xpCurrent: number;
  xpTarget: number;
  coins: number;
  chestTickets: number;
  claimedDailyMission: boolean;
  claimedWeeklyMission: boolean;
  quizzesCompletedToday: number;
  currentBookProgress: number;
  focusLockEnabled: boolean;
  focusDurationMinutes: number;
  encouragementCards: EncouragementCard[];
  onClaimMission: (type: 'daily' | 'weekly') => void;
  onSpendCoinsForGacha: (cost: number, unlockedIds: string[]) => void;
  onEquipStudioItem: (item: StudioItem) => void;
  onDismissEncouragement: (id: string) => void;
  onSelectBookDetail: (book: BookItem) => void;
  onStartBook: (book: BookItem) => void;
  onNavigate: (screen: ScreenId) => void;
}

export function BerandaScreen({
  activeChildId,
  level,
  xpCurrent,
  xpTarget,
  coins,
  chestTickets,
  claimedDailyMission,
  claimedWeeklyMission,
  quizzesCompletedToday,
  currentBookProgress,
  focusLockEnabled,
  focusDurationMinutes,
  encouragementCards,
  onClaimMission,
  onSpendCoinsForGacha,
  onEquipStudioItem,
  onDismissEncouragement,
  onSelectBookDetail,
  onStartBook,
  onNavigate,
}: BerandaScreenProps) {
  const [missionTab, setMissionTab] = useState<'harian' | 'mingguan'>('harian');
  const [gachaNotice, setGachaNotice] = useState<string | null>(null);
  const [gachaModalPulls, setGachaModalPulls] = useState<StudioItem[]>([]);

  const profile = CHILD_PROFILES[activeChildId];
  const xpPercent = Math.min(100, Math.round((xpCurrent / xpTarget) * 100));
  const unreadCard = encouragementCards.find((c) => !c.read);
  const mainBook =
    CATALOG_BOOKS.find((b) => b.id === 'misteri-hutan-rimba') ??
    CATALOG_BOOKS[0];

  const handlePull = (count: 1 | 5, cost: number) => {
    if (coins < cost) {
      setGachaNotice(
        'Koin Bintang belum cukup! Jawab kuis di akhir bab untuk tambah koin.'
      );
      return;
    }
    setGachaNotice(null);
    const results: StudioItem[] = [];
    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      let poolItem = GACHA_POOL[0];
      if (roll < 0.05) {
        poolItem = GACHA_POOL[5]; // Mitos
      } else if (roll < 0.15) {
        poolItem = GACHA_POOL[4]; // Legendaris
      } else if (roll < 0.45) {
        poolItem = GACHA_POOL[i % 2 === 0 ? 2 : 3]; // Langka
      } else {
        poolItem = GACHA_POOL[i % 2]; // Biasa
      }
      const found =
        STUDIO_ITEMS.find((s) => s.id === poolItem.id) ?? STUDIO_ITEMS[0];
      results.push(found);
    }
    onSpendCoinsForGacha(
      cost,
      results.map((r) => r.id)
    );
    setGachaModalPulls(results);
  };

  return (
    <div className="px-4 pt-3.5 pb-6 space-y-5">
      {/* Encouragement Card from Parent Device */}
      {unreadCard && (
        <div className="rounded-[20px] bg-gradient-to-r from-[#FFF1E6] to-[#FFE4CC] border border-[#FDBA74] p-3.5 shadow-sm flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-[#9A3412]">
                Pesan Semangat dari {unreadCard.sender}
              </div>
              <p className="text-[12.5px] font-semibold text-[#431407] leading-snug mt-0.5">
                “{unreadCard.message}”
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onDismissEncouragement(unreadCard.id)}
            aria-label="Tandai pesan terbaca"
            className="shrink-0 rounded-full bg-white/80 hover:bg-white px-2.5 py-1 text-[11px] font-bold text-[#9A3412] flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3 h-3" />
            <span>Terima</span>
          </button>
        </div>
      )}

      {/* Focus Mode Banner if active from Parent */}
      {focusLockEnabled && (
        <div className="rounded-[16px] bg-[#EAF1FB] border border-[#BFDBFE] px-3.5 py-2 flex items-center justify-between text-[11.5px]">
          <span className="font-semibold text-[#0A4F9E] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Mode Fokus Baca Aktif ({focusDurationMinutes} mnt)</span>
          </span>
          <button
            type="button"
            onClick={() => onNavigate('profil')}
            className="font-bold text-[#0A4F9E] hover:underline cursor-pointer"
          >
            Setelan PIN
          </button>
        </div>
      )}

      {/* Greeting + Level Card */}
      <section>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-extrabold tracking-wide text-[#0A4F9E]">
              PETUALANG CILIK{' '}
              <span className="text-[#94A3B8] mx-0.5">•</span>{' '}
              <span className="font-semibold text-[#475569]">
                {profile.rankSubtitle}
              </span>
            </div>
            <h1 className="text-[22px] font-extrabold text-[#0F172A] mt-0.5">
              Halo, {profile.name}! 🚀
            </h1>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('peringkat')}
            aria-label="Lihat peringkat streak"
            className="w-11 h-11 rounded-full bg-[#FFF2E5] border border-[#FAD4B4] flex items-center justify-center shadow-xs cursor-pointer"
          >
            <Flame className="w-5 h-5 text-[#D97706] fill-[#F97316]" />
          </button>
        </div>

        <div className="mt-3 rounded-[18px] bg-white px-4 py-3 border border-[#E8EEF7] shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between text-[12px] mb-2">
            <div className="flex items-center gap-1.5 font-bold text-[#0F172A] tabular-nums">
              <Award className="w-4 h-4 text-[#0A4F9E]" />
              <span>
                Level {level} • {xpCurrent}/{xpTarget} XP
              </span>
            </div>
            <span className="font-extrabold text-[#0A4F9E] tabular-nums">
              {xpPercent}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#15803D] transition-all"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Misi Petualang */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-[#B45309]" />
            <h2 className="text-[15.5px] font-bold text-[#0F172A]">
              Misi Petualang
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMissionTab('harian')}
              className={`min-h-[34px] rounded-full px-3 py-1 text-[11.5px] font-bold cursor-pointer transition-colors ${
                missionTab === 'harian'
                  ? 'bg-[#0A4F9E] text-white'
                  : 'bg-white text-[#475569] border border-[#E2E8F0]'
              }`}
            >
              Harian
            </button>
            <button
              type="button"
              onClick={() => setMissionTab('mingguan')}
              className={`min-h-[34px] rounded-full px-3 py-1 text-[11.5px] font-bold cursor-pointer transition-colors ${
                missionTab === 'mingguan'
                  ? 'bg-[#0A4F9E] text-white'
                  : 'bg-white text-[#475569] border border-[#E2E8F0]'
              }`}
            >
              Mingguan
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {/* Mission 1 */}
          <div className="rounded-[18px] bg-white p-3 border border-[#E8EEF7] shadow-[0_2px_10px_rgba(15,23,42,0.04)] flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-[#15803D]" />
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] font-bold text-[#0F172A] truncate">
                  {missionTab === 'harian'
                    ? 'Membaca 15 Menit'
                    : 'Tamatkan 2 Buku'}
                </div>
                <div className="text-[11.5px] font-semibold text-[#15803D]">
                  {missionTab === 'harian'
                    ? 'Selesai (15 / 15 Menit) ✨'
                    : 'Selesai (2 / 2 Buku) ✨'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onClaimMission(missionTab === 'harian' ? 'daily' : 'weekly')
              }
              className={`shrink-0 min-h-[38px] rounded-full px-3.5 py-1.5 text-[12px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                (missionTab === 'harian'
                  ? claimedDailyMission
                  : claimedWeeklyMission)
                  ? 'bg-[#DCFCE7] text-[#15803D]'
                  : 'bg-[#166534] hover:bg-[#14532D] text-white'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>
                {(missionTab === 'harian'
                  ? claimedDailyMission
                  : claimedWeeklyMission)
                  ? 'Diklaim'
                  : 'Klaim'}
              </span>
            </button>
          </div>

          {/* Mission 2 */}
          <div className="rounded-[18px] bg-white p-3 border border-[#E8EEF7] shadow-[0_2px_10px_rgba(15,23,42,0.04)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4 text-[#475569]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-bold text-[#0F172A] truncate">
                  {missionTab === 'harian'
                    ? 'Jawab Kuis Tantangan'
                    : 'Kumpulkan 500 XP'}
                </div>
                <div className="mt-1.5 h-1.5 w-full max-w-[130px] rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0A4F9E] transition-all"
                    style={{
                      width:
                        missionTab === 'harian'
                          ? `${Math.min(100, (quizzesCompletedToday / 2) * 100)}%`
                          : '65%',
                    }}
                  />
                </div>
                <div className="text-[11px] text-[#64748B] mt-1 tabular-nums">
                  {missionTab === 'harian'
                    ? `${Math.min(2, quizzesCompletedToday)} dari 2 Kuis`
                    : '325 dari 500 XP'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartBook(mainBook)}
              className="shrink-0 rounded-full bg-[#FFF2E5] border border-[#FAD4B4] px-2.5 py-1 text-[11.5px] font-bold text-[#B45309] flex items-center gap-1 cursor-pointer"
            >
              <Star className="w-3 h-3 text-[#D97706]" />
              <span>+40 XP</span>
            </button>
          </div>
        </div>
      </section>

      {/* Lanjut Baca */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-[#0A4F9E]" />
            <h2 className="text-[15.5px] font-bold text-[#0F172A]">
              Lanjut Baca
            </h2>
          </div>
          <span className="text-[12.5px] font-bold text-[#0A4F9E]">
            Buku Utama
          </span>
        </div>

        <div className="rounded-[22px] bg-white p-3.5 border border-[#E8EEF7] shadow-[0_4px_16px_rgba(15,23,42,0.05)] flex gap-3.5">
          <div className="relative w-[96px] h-[132px] rounded-[14px] overflow-hidden shrink-0 bg-[#F1F5F9]">
            <img
              src={CURRENT_BOOK.cover}
              alt={CURRENT_BOOK.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 rounded-full bg-[#0F172A]/80 px-2.5 py-0.5 text-[10.5px] font-bold text-white">
              {CURRENT_BOOK.chapterLabel}
            </span>
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="text-[10.5px] font-extrabold tracking-wide text-[#0A4F9E]">
                {CURRENT_BOOK.category}
              </div>
              <h3 className="text-[16px] font-bold text-[#0F172A] leading-snug mt-0.5">
                {CURRENT_BOOK.title}
              </h3>
              <p className="text-[12px] text-[#64748B] truncate mt-0.5">
                {CURRENT_BOOK.subtitle}
              </p>
            </div>

            <div className="mt-2">
              <div className="flex items-center justify-between text-[11.5px] mb-1">
                <span className="text-[#475569] font-medium">
                  Progress Baca
                </span>
                <span className="font-bold text-[#0A4F9E] tabular-nums">
                  {currentBookProgress}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#0A4F9E]"
                  style={{ width: `${currentBookProgress}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartBook(mainBook)}
              className="mt-2.5 w-full min-h-[42px] rounded-full bg-[#0A4F9E] hover:bg-[#083F80] py-2 text-[13px] font-bold text-white flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Lanjut Baca</span>
            </button>
          </div>
        </div>
      </section>

      {/* Buku Terpopuler */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-[15.5px] font-bold text-[#0F172A]">
            Buku Terpopuler
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('jelajah')}
            className="text-[12.5px] font-bold text-[#0A4F9E] cursor-pointer hover:underline"
          >
            Lihat Semua ›
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {POPULAR_BOOKS.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => onSelectBookDetail(book)}
              className="w-[144px] shrink-0 text-left cursor-pointer group"
            >
              <div className="relative h-[176px] rounded-[16px] overflow-hidden bg-[#E2E8F0] shadow-sm">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                />
                {book.badge && (
                  <span
                    style={{ backgroundColor: book.badgeColor }}
                    className={`absolute top-2 ${
                      book.badge === 'Baru!' ? 'left-2' : 'right-2'
                    } rounded-full px-2.5 py-0.5 text-[10.5px] font-bold text-white shadow-sm`}
                  >
                    {book.badge === '★ 4.9' || book.badge === '★ 4.8' ? (
                      <span className="inline-flex items-center gap-0.5 text-[#FBBF24]">
                        {book.badge}
                      </span>
                    ) : (
                      book.badge
                    )}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <div className="text-[13px] font-bold text-[#0F172A] truncate">
                  {book.title}
                </div>
                <div className="text-[11.5px] text-[#64748B] truncate">
                  {book.author}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Pusaka Mistik Rimba */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <h2 className="text-[15.5px] font-bold text-[#0F172A]">
              Pusaka Mistik Rimba
            </h2>
          </div>

          <span className="rounded-full bg-[#DCFCE7] border border-[#86EFAC] px-2.5 py-1 text-[11.5px] font-bold text-[#15803D] inline-flex items-center gap-1 tabular-nums">
            <Star className="w-3.5 h-3.5 fill-[#16A34A] text-[#16A34A]" />
            {coins} Koin · {chestTickets} Tiket
          </span>
        </div>

        <div className="rounded-[24px] bg-gradient-to-b from-[#1D4073] via-[#17335D] to-[#112444] p-4 text-white shadow-[0_12px_28px_rgba(15,23,42,0.2)]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="rounded-full bg-[#D97706] px-3 py-1 text-[10.5px] font-extrabold tracking-wide text-white">
              EVENT TERBATAS
            </span>
            <Lock className="w-4 h-4 text-slate-300" />
          </div>

          <h3 className="text-[16px] font-bold text-white">
            Ekspedisi Rimba Ajaib
          </h3>
          <p className="text-[12.5px] text-slate-200 leading-snug mt-0.5">
            Dapatkan kostum mitos legendaris nusantara!
          </p>

          <div className="grid grid-cols-2 gap-2.5 mt-3.5">
            <div className="relative rounded-[16px] bg-white/10 border border-white/15 p-3 text-center">
              <span className="absolute top-2 right-2 rounded-full bg-[#0F172A]/85 px-2 py-0.5 text-[9.5px] font-extrabold text-white">
                MYTHIC
              </span>
              <div className="mt-4 mb-2 flex justify-center">
                <img
                  src="./assets/images/gacha-mahkota.jpg"
                  alt="Mahkota Surgawi"
                  className="w-12 h-12 rounded-xl object-cover shadow-md border border-white/25"
                />
              </div>
              <div className="text-[12.5px] font-bold text-white">
                Mahkota Surgawi
              </div>
              <div className="text-[11px] font-semibold text-[#FBBF24] mt-0.5">
                Kesempatan 1.5%
              </div>
            </div>

            <div className="relative rounded-[16px] bg-white/10 border border-white/15 p-3 text-center">
              <span className="absolute top-2 right-2 rounded-full bg-[#15803D] px-2 py-0.5 text-[9.5px] font-extrabold text-white">
                LEGENDARY
              </span>
              <div className="mt-4 mb-2 flex justify-center">
                <img
                  src="./assets/images/gacha-sayap.jpg"
                  alt="Sayap Emas Nusantara"
                  className="w-12 h-12 rounded-xl object-cover shadow-md border border-white/25"
                />
              </div>
              <div className="text-[12.5px] font-bold text-white">Sayap...</div>
              <div className="text-[11px] font-semibold text-[#4ADE80] mt-0.5">
                Kesempatan 5%
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-[14px] bg-black/25 px-3 py-2 grid grid-cols-3 text-center text-[11px]">
            <div>
              <div className="text-slate-300">Mitos/Legenda:</div>
              <div className="font-bold text-white mt-0.5">5%</div>
            </div>
            <div className="border-x border-white/10">
              <div className="text-slate-300">Langka:</div>
              <div className="font-bold text-white mt-0.5">25%</div>
            </div>
            <div>
              <div className="text-slate-300">Biasa:</div>
              <div className="font-bold text-white mt-0.5">70%</div>
            </div>
          </div>

          {gachaNotice && (
            <div className="mt-2.5 rounded-xl bg-white/15 border border-white/25 px-3 py-2 text-[11.5px] font-semibold text-[#FDE047] text-center">
              {gachaNotice}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <button
              type="button"
              onClick={() => handlePull(1, 100)}
              className="min-h-[50px] rounded-[14px] bg-[#8D5214] hover:bg-[#7A450F] py-2.5 px-2 text-center shadow-md cursor-pointer transition-colors"
            >
              <div className="text-[12.5px] font-bold text-white flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5" />
                <span>1x Buka</span>
              </div>
              <div className="text-[10.5px] text-amber-100 mt-0.5">
                100 Koin Bintang
              </div>
            </button>

            <div className="relative">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#15803D] px-2.5 py-0.5 text-[9.5px] font-extrabold text-white shadow-sm z-10">
                HEMAT 20 KOIN!
              </span>
              <button
                type="button"
                onClick={() => handlePull(5, 480)}
                className="w-full min-h-[50px] rounded-[14px] bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:brightness-105 py-2.5 px-2 text-center shadow-md cursor-pointer transition-all"
              >
                <div className="text-[12.5px] font-bold text-white flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>5x Buka Sekaligus</span>
                </div>
                <div className="text-[10.5px] text-amber-50 mt-0.5">
                  480 Koin Bintang
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <GachaChestModal
        open={gachaModalPulls.length > 0}
        pulls={gachaModalPulls}
        onEquipItem={(item) => {
          onEquipStudioItem(item);
          setGachaModalPulls([]);
          onNavigate('profil');
        }}
        onGoToStudio={() => {
          setGachaModalPulls([]);
          onNavigate('profil');
        }}
        onClose={() => setGachaModalPulls([])}
      />
    </div>
  );
}
