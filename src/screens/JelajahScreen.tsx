import { useState } from 'react';
import {
  Award,
  BookOpen,
  Castle,
  Clock,
  Crown,
  Fish,
  Globe,
  Leaf,
  Medal,
  PawPrint,
  Rocket,
  Search,
  Shield,
  Star,
  Swords,
  X,
  Zap,
} from 'lucide-react';
import {
  AGE_FILTERS,
  CATALOG_BOOKS,
  FAVORITE_BOOKS,
  STORY_WORLDS,
  StoryWorld,
  WEEKLY_SPOTLIGHT,
} from '../data/readventureData';
import { BookItem } from '../types';

interface JelajahScreenProps {
  onSelectBookDetail: (book: BookItem) => void;
  onStartBook: (book: BookItem) => void;
}

function WorldIcon({ type }: { type: StoryWorld['iconType'] }) {
  const cls = 'w-4 h-4 text-white';
  switch (type) {
    case 'rocket':
      return <Rocket className={cls} />;
    case 'swords':
      return <Swords className={cls} />;
    case 'castle':
      return <Castle className={cls} />;
    case 'globe':
      return <Globe className={cls} />;
    case 'paw':
      return <PawPrint className={cls} />;
    case 'medal':
      return <Medal className={cls} />;
  }
}

function WorldWatermark({ type }: { type: StoryWorld['watermarkType'] }) {
  const cls = 'w-14 h-14 opacity-20';
  switch (type) {
    case 'zap':
      return <Zap className={`${cls} text-amber-400 fill-amber-300`} />;
    case 'leaf':
      return <Leaf className={`${cls} text-emerald-700`} />;
    case 'crown':
      return <Crown className={`${cls} text-amber-500 fill-amber-400`} />;
    case 'search':
      return <Search className={`${cls} text-slate-500`} />;
    case 'dolphin':
      return <Fish className={`${cls} text-rose-500`} />;
    case 'shield':
      return <Shield className={`${cls} text-blue-600`} />;
  }
}

export function JelajahScreen({
  onSelectBookDetail,
  onStartBook,
}: JelajahScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAge, setSelectedAge] = useState('Semua Usia');
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [showAllBooks, setShowAllBooks] = useState(false);

  const isFiltering =
    Boolean(searchQuery.trim()) ||
    selectedAge !== 'Semua Usia' ||
    Boolean(selectedWorldId) ||
    showAllBooks;

  const baseList = isFiltering ? CATALOG_BOOKS : FAVORITE_BOOKS;

  const filteredBooks = baseList.filter((book) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      book.title.toLowerCase().includes(q) ||
      book.fullTitle.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.category.toLowerCase().includes(q);
    const matchesAge =
      selectedAge === 'Semua Usia' || book.ageGroup === selectedAge;
    const matchesWorld = !selectedWorldId || book.worldId === selectedWorldId;
    return matchesSearch && matchesAge && matchesWorld;
  });

  const activeWorld = STORY_WORLDS.find((w) => w.id === selectedWorldId);
  const nebulaBook =
    CATALOG_BOOKS.find((b) => b.id === 'rahasia-galaksi-nebula') ??
    CATALOG_BOOKS[0];

  return (
    <div className="px-4 pt-3 pb-6 space-y-5">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#0A4F9E] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari petualangan, pahlawan, atau komik..."
          className="w-full min-h-[44px] rounded-full bg-white pl-10 pr-10 py-2.5 text-[13px] text-[#0F172A] placeholder-[#64748B] border border-[#E2E8F0] shadow-[0_2px_10px_rgba(15,23,42,0.04)] focus:outline-none focus:border-[#0A4F9E]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="Hapus pencarian"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#F1F5F9] text-[#475569] flex items-center justify-center cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Age Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
        {AGE_FILTERS.map((age) => {
          const active = selectedAge === age;
          return (
            <button
              key={age}
              type="button"
              onClick={() => setSelectedAge(age)}
              className={`shrink-0 min-h-[38px] rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-colors cursor-pointer ${
                active
                  ? 'bg-[#0A4F9E] text-white shadow-sm'
                  : 'bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              {age}
            </button>
          );
        })}
      </div>

      {/* Jelajah Pulau Cerita */}
      <section>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-[#A16207]" />
            <h2 className="text-[16px] font-bold text-[#0F172A]">
              Jelajah Pulau Cerita
            </h2>
          </div>
          {selectedWorldId ? (
            <button
              type="button"
              onClick={() => setSelectedWorldId(null)}
              className="rounded-full bg-[#FEE2E2] px-2.5 py-0.5 text-[10.5px] font-extrabold text-[#B91C1C] cursor-pointer"
            >
              Reset Dunia ×
            </button>
          ) : (
            <span className="rounded-full bg-[#DBEAFE] px-2.5 py-0.5 text-[10px] font-extrabold text-[#1D4ED8] tracking-wide">
              6 DUNIA
            </span>
          )}
        </div>
        <p className="text-[12.5px] text-[#475569] leading-snug mb-3.5">
          Pilih tema favoritmu dan kumpulkan koin serta lencana pembaca sakti!
        </p>

        <div className="grid grid-cols-2 gap-3">
          {STORY_WORLDS.map((world) => {
            const isSelected = selectedWorldId === world.id;
            return (
              <button
                key={world.id}
                type="button"
                onClick={() =>
                  setSelectedWorldId(isSelected ? null : world.id)
                }
                style={{
                  background: world.cardGradient,
                  borderColor: isSelected ? '#0A4F9E' : world.borderColor,
                }}
                className={`relative overflow-hidden rounded-[20px] border-2 p-3 text-left shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer min-h-[126px] flex flex-col justify-between ${
                  isSelected ? 'ring-2 ring-[#0A4F9E]/30' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    style={{ backgroundColor: world.iconBg }}
                    className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
                  >
                    <WorldIcon type={world.iconType} />
                  </div>
                  <span
                    style={{
                      backgroundColor: world.badgeBg,
                      color: world.badgeText,
                    }}
                    className="rounded-full px-2.5 py-0.5 text-[10.5px] font-bold shadow-xs"
                  >
                    {world.badge}
                  </span>
                </div>

                <div className="relative z-10 mt-5">
                  <div className="text-[14.5px] font-bold text-[#0F172A] leading-tight">
                    {world.title}
                  </div>
                  <div
                    style={{ color: world.subtitleColor }}
                    className="text-[12px] font-bold mt-0.5"
                  >
                    {world.subtitle}
                  </div>
                </div>

                <div className="absolute -right-1 -bottom-1 pointer-events-none">
                  <WorldWatermark type={world.watermarkType} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Pilihan Petualang Pekan Ini */}
      {!selectedWorldId && !searchQuery.trim() && (
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#B45309]" />
              <h2 className="text-[15.5px] font-bold text-[#0F172A]">
                Pilihan Petualang Pekan Ini
              </h2>
            </div>
            <span className="text-[12.5px] font-bold text-[#D97706]">
              Spesial
            </span>
          </div>

          <div className="rounded-[22px] bg-gradient-to-br from-[#132645] via-[#172D52] to-[#1D3557] p-4 text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#784212]/90 border border-[#D97706]/50 px-2.5 py-1 text-[11px] font-bold text-[#FDE047]">
                <Zap className="w-3 h-3 fill-[#FDE047] text-[#FDE047]" />
                Double XP x2
              </span>
              <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#FBBF24]">
                <Star className="w-3.5 h-3.5 text-[#FBBF24]" />
                {WEEKLY_SPOTLIGHT.rating}
              </span>
            </div>

            <div className="flex gap-3 items-start">
              <img
                src={WEEKLY_SPOTLIGHT.cover}
                alt={WEEKLY_SPOTLIGHT.title}
                className="w-[72px] h-[94px] rounded-[12px] object-cover border border-white/20 shrink-0 shadow-md"
              />
              <div className="min-w-0">
                <h3 className="text-[15.5px] font-bold text-white leading-snug">
                  {WEEKLY_SPOTLIGHT.title}
                </h3>
                <p className="text-[12px] text-slate-300 leading-relaxed mt-1 line-clamp-3">
                  {WEEKLY_SPOTLIGHT.description}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[11.5px] font-bold text-[#4ADE80]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{WEEKLY_SPOTLIGHT.duration}</span>
                  <span>•</span>
                  <span>{WEEKLY_SPOTLIGHT.xp}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartBook(nebulaBook)}
              className="mt-3.5 w-full min-h-[44px] rounded-full bg-[#1E63B5] hover:bg-[#1956A0] py-2.5 text-[13.5px] font-bold text-white flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Mulai Baca Sekarang</span>
            </button>
          </div>
        </section>
      )}

      {/* Koleksi Terfavorit Anak / Hasil Filter */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15.5px] font-bold text-[#0F172A]">
            {activeWorld
              ? `Dunia ${activeWorld.title}`
              : searchQuery.trim()
              ? `Hasil Pencarian (${filteredBooks.length})`
              : showAllBooks
              ? 'Semua Katalog Bacaan'
              : 'Koleksi Terfavorit Anak'}
          </h2>
          <button
            type="button"
            onClick={() => setShowAllBooks(!showAllBooks)}
            className="text-[12.5px] font-bold text-[#0A4F9E] cursor-pointer hover:underline"
          >
            {showAllBooks ? 'Ringkas' : 'Lihat Semua ›'}
          </button>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="rounded-[18px] bg-white border border-[#E2E8F0] p-6 text-center">
            <div className="text-[14px] font-bold text-[#0F172A]">
              Belum ada buku yang cocok
            </div>
            <p className="text-[12px] text-[#64748B] mt-1">
              Coba kata kunci lain atau pilih Semua Usia.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedAge('Semua Usia');
                setSelectedWorldId(null);
              }}
              className="mt-3 rounded-full bg-[#0A4F9E] px-4 py-2 text-[12px] font-bold text-white cursor-pointer"
            >
              Tampilkan Semua Buku
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredBooks.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => onSelectBookDetail(book)}
                className="rounded-[18px] bg-white p-2.5 text-left border border-[#E8EEF7] shadow-[0_2px_12px_rgba(15,23,42,0.05)] hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="relative aspect-[4/4.2] rounded-[12px] overflow-hidden bg-[#F1F5F9]">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  {book.badge && (
                    <span
                      style={{ backgroundColor: book.badgeColor }}
                      className="absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold text-white shadow-sm"
                    >
                      {book.badge}
                    </span>
                  )}
                </div>

                <div className="mt-2.5 px-0.5">
                  <div className="text-[13.5px] font-bold text-[#0F172A] truncate">
                    {book.title}
                  </div>
                  <div className="text-[11.5px] text-[#64748B] truncate mt-0.5">
                    {book.author}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#92400E] tabular-nums">
                      <Star className="w-3.5 h-3.5 text-[#D97706] fill-[#D97706]" />
                      {book.rating}
                    </span>
                    <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[11px] font-bold text-[#15803D] tabular-nums">
                      {book.xp}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
