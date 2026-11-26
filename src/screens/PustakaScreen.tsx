import { useState } from 'react';
import {
  Award,
  Bookmark,
  BookOpen,
  Clock,
  CloudDownload,
  Flag,
  Play,
  RotateCcw,
  Search,
  Star,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import {
  CATALOG_BOOKS,
  COMPLETED_BOOKS,
  USER_PROFILE,
} from '../data/readventureData';
import { BookItem, ScreenId } from '../types';

interface PustakaScreenProps {
  totalXpNumber: number;
  level: number;
  offlineBookIds: string[];
  wishlistBookIds: string[];
  bookReviews: Record<string, { text: string; rating: number }>;
  onSaveReview: (bookId: string, text: string, rating: number) => void;
  onSelectBookDetail: (book: BookItem) => void;
  onStartBook: (book: BookItem) => void;
  onNavigate: (screen: ScreenId) => void;
}

export function PustakaScreen({
  totalXpNumber,
  level,
  offlineBookIds,
  wishlistBookIds,
  bookReviews,
  onSaveReview,
  onSelectBookDetail,
  onStartBook,
  onNavigate,
}: PustakaScreenProps) {
  const [filterTab, setFilterTab] = useState<'koleksi' | 'tersimpan' | 'tamat'>(
    'koleksi'
  );
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewDraft, setReviewDraft] = useState('');
  const [sharedBook, setSharedBook] = useState<string | null>(null);

  const offlineBooks = CATALOG_BOOKS.filter((b) =>
    offlineBookIds.includes(b.id)
  );
  const wishlistBooks = CATALOG_BOOKS.filter((b) =>
    wishlistBookIds.includes(b.id)
  );

  return (
    <div className="px-4 pt-3.5 pb-6 space-y-5">
      {/* Header Title + Search */}
      <section>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#DBEAFE] px-2.5 py-1 text-[10.5px] font-extrabold text-[#0A4F9E] tracking-wide">
              <BookOpen className="w-3 h-3" />
              ARSIP PETUALANG
            </span>
            <h1 className="text-[20px] font-extrabold text-[#0F172A] mt-1.5">
              Pustaka Pribadi
            </h1>
            <p className="text-[12.5px] text-[#475569] leading-snug mt-0.5">
              Semua pencapaian membaca, buku offline, dan koleksi favoritmu
              tersusun rapi di sini!
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('jelajah')}
            aria-label="Cari di pustaka"
            className="min-w-[44px] min-h-[44px] rounded-full bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center text-[#0F172A] shrink-0 cursor-pointer hover:bg-[#F8FAFC]"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mt-4">
          <button
            type="button"
            onClick={() => setFilterTab('koleksi')}
            className={`shrink-0 min-h-[38px] rounded-full px-4 py-2 text-[12.5px] font-bold cursor-pointer transition-colors ${
              filterTab === 'koleksi'
                ? 'bg-[#0A4F9E] text-white shadow-sm'
                : 'bg-white text-[#475569] border border-[#E2E8F0]'
            }`}
          >
            Koleksi Saya
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('tersimpan')}
            className={`shrink-0 min-h-[38px] rounded-full px-3.5 py-2 text-[12.5px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              filterTab === 'tersimpan'
                ? 'bg-[#0A4F9E] text-white shadow-sm'
                : 'bg-white text-[#475569] border border-[#E2E8F0]'
            }`}
          >
            <span>Buku Tersimpan</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-extrabold tabular-nums ${
                filterTab === 'tersimpan'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#DBEAFE] text-[#0A4F9E]'
              }`}
            >
              {offlineBooks.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('tamat')}
            className={`shrink-0 min-h-[38px] rounded-full px-3.5 py-2 text-[12.5px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              filterTab === 'tamat'
                ? 'bg-[#0A4F9E] text-white shadow-sm'
                : 'bg-white text-[#475569] border border-[#E2E8F0]'
            }`}
          >
            <span>Telah Tamat</span>
            <span className="rounded-full bg-[#DCFCE7] px-1.5 py-0.5 text-[10.5px] font-extrabold text-[#15803D] tabular-nums">
              14
            </span>
          </button>
        </div>
      </section>

      {/* Siap Dibaca Offline Banner */}
      <div className="rounded-[20px] bg-gradient-to-r from-[#14532D] via-[#15803D] to-[#16A34A] px-3.5 py-3 text-white shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <CloudDownload className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-[13.5px] font-bold text-white truncate">
              Siap Dibaca Offline 🚗
            </div>
            <div className="text-[11.5px] text-emerald-100 truncate">
              {offlineBooks.length} buku tersimpan aman di perangkatmu.
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setFilterTab('tersimpan')}
          className="shrink-0 min-h-[36px] rounded-full bg-[#BBF7D0] hover:bg-[#86EFAC] px-3.5 py-1.5 text-[12px] font-bold text-[#14532D] cursor-pointer transition-colors"
        >
          Buka
        </button>
      </div>

      {/* Offline Saved Books List when Tersimpan active */}
      {filterTab === 'tersimpan' && (
        <section className="space-y-3">
          <h2 className="text-[15px] font-bold text-[#0F172A]">
            Buku Tersimpan Offline ({offlineBooks.length})
          </h2>
          {offlineBooks.map((book) => (
            <div
              key={book.id}
              className="rounded-[18px] bg-white p-3 border border-[#E8EEF7] shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-14 h-18 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[13.5px] font-bold text-[#0F172A] truncate">
                    {book.fullTitle}
                  </div>
                  <div className="text-[11.5px] text-[#64748B]">
                    {book.author} · {book.duration}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onStartBook(book)}
                className="shrink-0 min-h-[40px] rounded-full bg-[#0A4F9E] px-3.5 py-1.5 text-[12px] font-bold text-white cursor-pointer"
              >
                Baca
              </button>
            </div>
          ))}
        </section>
      )}

      {/* Pencapaian Petualangan */}
      {filterTab !== 'tersimpan' && (
        <section className="rounded-[22px] bg-white p-4 border border-[#E8EEF7] shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#D97706]" />
              <h2 className="text-[14px] font-bold text-[#0F172A]">
                Pencapaian Petualangan
              </h2>
            </div>
            <span className="text-[12.5px] font-bold text-[#0A4F9E]">
              Level {level} Jawara
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-[14px] bg-[#F8FAFC] p-3 text-center">
              <div className="w-7 h-7 rounded-full bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center mx-auto mb-1.5">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-[15.5px] font-extrabold text-[#0F172A] tabular-nums">
                14
              </div>
              <div className="text-[11px] text-[#64748B] leading-tight mt-0.5">
                Buku
                <br />
                Tamat
              </div>
            </div>

            <div className="rounded-[14px] bg-[#F8FAFC] p-3 text-center">
              <div className="w-7 h-7 rounded-full bg-[#DBEAFE] text-[#0A4F9E] flex items-center justify-center mx-auto mb-1.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-[15.5px] font-extrabold text-[#0F172A] tabular-nums">
                {USER_PROFILE.readingHours}
              </div>
              <div className="text-[11px] text-[#64748B] leading-tight mt-0.5">
                Waktu
                <br />
                Baca
              </div>
            </div>

            <div className="rounded-[14px] bg-[#F8FAFC] p-3 text-center">
              <div className="w-7 h-7 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mx-auto mb-1.5">
                <Zap className="w-4 h-4 fill-[#15803D]" />
              </div>
              <div className="text-[15.5px] font-extrabold text-[#0F172A] tabular-nums">
                {totalXpNumber.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-[#64748B] leading-tight mt-0.5">
                Total XP
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Rak Pustaka Jawara */}
      {filterTab !== 'tersimpan' && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-xs">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[12.5px] text-[#475569] font-medium">
                  Rak Pustaka Jawara
                </div>
                <div className="text-[15px] font-bold text-[#0F172A] leading-tight">
                  14 Mahakarya Terselesaikan
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFilterTab('tamat')}
              className="text-[12px] font-bold text-[#0A4F9E] text-right leading-tight cursor-pointer"
            >
              Lihat
              <br />
              Semua ›
            </button>
          </div>

          <div className="space-y-3.5">
            {COMPLETED_BOOKS.map((book) => {
              const savedReview = bookReviews[book.id];
              const displayReview = savedReview
                ? `Ulasanmu: "${savedReview.text}" (${savedReview.rating}/5)`
                : book.review;
              const isEditing = editingReviewId === book.id;

              return (
                <div
                  key={book.id}
                  className="rounded-[22px] bg-white p-3.5 border border-[#E8EEF7] shadow-[0_3px_14px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex gap-3">
                    <div className="relative w-[92px] h-[126px] rounded-[14px] overflow-hidden shrink-0 bg-[#F1F5F9]">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 rounded-full bg-[#B45309] px-2 py-0.5 text-[9.5px] font-extrabold text-white shadow-sm">
                        🏆 TAMAT!
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <span
                          style={{
                            backgroundColor: book.categoryBg,
                            color: book.categoryText,
                          }}
                          className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                        >
                          {book.category}
                        </span>
                        <h3 className="text-[15px] font-bold text-[#0F172A] leading-snug mt-1.5">
                          {book.title}
                        </h3>
                        <div className="text-[12px] font-semibold text-[#475569] mt-0.5">
                          {book.pages} •{' '}
                          <span className="text-[#15803D] font-bold">
                            {book.xp}
                          </span>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="mt-2 flex gap-1.5">
                          <input
                            type="text"
                            value={reviewDraft}
                            onChange={(e) => setReviewDraft(e.target.value)}
                            placeholder="Tulis ulasan singkat..."
                            className="flex-1 rounded-lg border border-[#FDBA74] px-2 py-1 text-[11px] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (reviewDraft.trim()) {
                                onSaveReview(book.id, reviewDraft.trim(), 5);
                              }
                              setEditingReviewId(null);
                            }}
                            className="rounded-lg bg-[#D97706] px-2.5 py-1 text-[11px] font-bold text-white cursor-pointer"
                          >
                            Simpan
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2 rounded-[10px] bg-[#FFF4E8] px-2.5 py-1.5 text-[11px] font-semibold text-[#9A3412] flex items-center gap-1">
                          <Star className="w-3 h-3 text-[#D97706] fill-[#D97706] shrink-0" />
                          <span className="truncate">{displayReview}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-[#F1F5F9]">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReviewId(isEditing ? null : book.id);
                        setReviewDraft(savedReview?.text ?? '');
                      }}
                      className="min-h-[42px] rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] py-2 px-2 text-[11.5px] font-bold text-[#0F172A] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 text-[#D97706] fill-[#D97706]" />
                      <span className="leading-tight text-left">
                        Ulasan
                        <br />
                        Cilik
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onStartBook(CATALOG_BOOKS[0])}
                      className="min-h-[42px] rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] py-2 px-2 text-[11.5px] font-bold text-[#0F172A] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#0A4F9E]" />
                      <span className="leading-tight text-left">
                        Baca
                        <br />
                        Ulang
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSharedBook(
                          `Tautan "${book.title}" disalin untuk dibagikan!`
                        )
                      }
                      className="min-h-[42px] rounded-xl bg-[#DBEAFE] hover:bg-[#BFDBFE] py-2 px-2 text-[11.5px] font-bold text-[#0A4F9E] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Bagikan</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {sharedBook && (
            <div className="mt-3 rounded-xl bg-[#0A4F9E] text-white px-3.5 py-2 text-[12px] font-semibold text-center shadow-sm">
              {sharedBook}
            </div>
          )}
        </section>
      )}

      {/* Daftar Keinginan */}
      {filterTab === 'koleksi' && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#DBEAFE] text-[#0A4F9E] flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[12.5px] text-[#475569] font-medium">
                  Daftar Keinginan
                </div>
                <div className="text-[15px] font-bold text-[#0F172A] leading-tight">
                  Siap Dibaca Nanti ({wishlistBooks.length} Buku)
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('jelajah')}
              className="text-[12.5px] font-bold text-[#0A4F9E] cursor-pointer"
            >
              Kelola
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {wishlistBooks.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => onSelectBookDetail(book)}
                className="rounded-[18px] bg-white p-2.5 text-left border border-[#E8EEF7] shadow-[0_2px_12px_rgba(15,23,42,0.05)] cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/4.3] rounded-[12px] overflow-hidden bg-[#F1F5F9]">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 text-[#D97706] flex items-center justify-center shadow-sm">
                      <Bookmark className="w-3.5 h-3.5 fill-[#D97706]" />
                    </span>
                  </div>

                  <h3 className="text-[13.5px] font-bold text-[#0F172A] leading-snug mt-2.5">
                    {book.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[11.5px] text-[#64748B] mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{book.duration}</span>
                  </div>
                </div>

                <div className="mt-2.5 rounded-[12px] bg-[#EAF1FB] px-2.5 py-1.5 flex items-center justify-between">
                  <span className="text-[11.5px] font-bold text-[#15803D]">
                    {book.xp}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-[#0A4F9E] text-white flex items-center justify-center">
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
