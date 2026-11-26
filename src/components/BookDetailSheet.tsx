import {
  Bookmark,
  BookOpen,
  Check,
  Clock,
  CloudDownload,
  Play,
  Star,
  X,
  Zap,
} from 'lucide-react';
import { BookItem } from '../types';

interface BookDetailSheetProps {
  book: BookItem | null;
  progress: number;
  isOffline: boolean;
  isWishlisted: boolean;
  onToggleOffline: (bookId: string) => void;
  onToggleWishlist: (bookId: string) => void;
  onStartReading: (book: BookItem) => void;
  onClose: () => void;
}

export function BookDetailSheet({
  book,
  progress,
  isOffline,
  isWishlisted,
  onToggleOffline,
  onToggleWishlist,
  onStartReading,
  onClose,
}: BookDetailSheetProps) {
  if (!book) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] rounded-t-[28px] bg-white px-5 pt-3 pb-7 shadow-[0_-12px_40px_rgba(15,23,42,0.2)] max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto mb-3" />

        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex gap-3.5 min-w-0">
            <img
              src={book.cover}
              alt={book.fullTitle}
              className="w-[84px] h-[116px] rounded-[14px] object-cover border border-[#E2E8F0] shadow-sm shrink-0"
            />
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-[#0A4F9E]">
                {book.category} · {book.ageGroup}
              </div>
              <h2 className="text-[17px] font-extrabold text-[#0F172A] leading-snug mt-1">
                {book.fullTitle}
              </h2>
              <div className="text-[12px] text-[#64748B] mt-0.5">
                {book.author}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 mt-2.5 text-[11.5px] font-bold">
                <span className="inline-flex items-center gap-1 text-[#B45309]">
                  <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                  {book.rating}
                </span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1 text-[#475569]">
                  <Clock className="w-3.5 h-3.5" />
                  {book.duration}
                </span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1 text-[#15803D]">
                  <Zap className="w-3.5 h-3.5 fill-[#15803D]" />
                  {book.xp}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail buku"
            className="min-w-[40px] min-h-[40px] rounded-full bg-[#EAF1FB] text-[#334155] flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#DCE7F9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress if started */}
        {progress > 0 && (
          <div className="mb-4 rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0] p-3">
            <div className="flex items-center justify-between text-[12px] mb-1.5">
              <span className="font-semibold text-[#475569]">Progres Membaca</span>
              <span className="font-extrabold text-[#0A4F9E] tabular-nums">
                {progress}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0A4F9E]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Synopsis */}
        <div className="mb-5">
          <div className="text-[12.5px] font-bold text-[#0F172A] mb-1">
            Ringkasan Cerita
          </div>
          <p className="text-[13px] text-[#334155] leading-relaxed">
            {book.synopsis}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <button
            type="button"
            onClick={() => onToggleOffline(book.id)}
            className={`min-h-[44px] rounded-[14px] px-3 py-2 text-[12px] font-bold flex items-center justify-center gap-1.5 border cursor-pointer transition-colors ${
              isOffline
                ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]'
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155] hover:bg-[#F1F5F9]'
            }`}
          >
            {isOffline ? (
              <Check className="w-4 h-4" />
            ) : (
              <CloudDownload className="w-4 h-4" />
            )}
            <span>{isOffline ? 'Tersimpan Offline' : 'Simpan Offline'}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleWishlist(book.id)}
            className={`min-h-[44px] rounded-[14px] px-3 py-2 text-[12px] font-bold flex items-center justify-center gap-1.5 border cursor-pointer transition-colors ${
              isWishlisted
                ? 'bg-[#FFF2E5] border-[#FAD4B4] text-[#B45309]'
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155] hover:bg-[#F1F5F9]'
            }`}
          >
            <Bookmark
              className={`w-4 h-4 ${isWishlisted ? 'fill-[#D97706]' : ''}`}
            />
            <span>{isWishlisted ? 'Di Daftar Nanti' : 'Baca Nanti'}</span>
          </button>
        </div>

        {/* Primary Read CTA */}
        <button
          type="button"
          onClick={() => onStartReading(book)}
          className="w-full min-h-[48px] rounded-full bg-[#0A4F9E] hover:bg-[#083F80] text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
        >
          {progress > 0 ? (
            <Play className="w-4 h-4 fill-white" />
          ) : (
            <BookOpen className="w-4 h-4" />
          )}
          <span>
            {progress > 0
              ? 'Lanjut Baca Sekarang'
              : book.readerType === 'comic'
              ? 'Mulai Baca Komik'
              : 'Mulai Baca Cerita'}
          </span>
        </button>
      </div>
    </div>
  );
}
