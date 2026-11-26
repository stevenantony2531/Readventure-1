import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookmarkPlus,
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  User,
  X,
  Zap,
} from 'lucide-react';
import { CATALOG_BOOKS } from '../data/readventureData';
import { ReaderSettings, ScreenId } from '../types';
import { ChapterQuizModal } from '../components/ChapterQuizModal';

interface ComicReaderScreenProps {
  bookId: string;
  settings: ReaderSettings;
  bookmarkedBookIds: string[];
  completedQuizChapters: string[];
  onToggleBookmark: (bookId: string) => void;
  onCompleteQuiz: (
    chapterKey: string,
    xpReward: number,
    coinsReward: number,
    newVocab: string[]
  ) => void;
  onBack: () => void;
  onOpenCustomize: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export function ComicReaderScreen({
  bookId,
  settings,
  bookmarkedBookIds,
  completedQuizChapters,
  onToggleBookmark,
  onCompleteQuiz,
  onBack,
  onOpenCustomize,
  onNavigate,
}: ComicReaderScreenProps) {
  const book =
    CATALOG_BOOKS.find((b) => b.id === bookId) ??
    CATALOG_BOOKS.find((b) => b.id === 'kiki-sahabat-kelinci') ??
    CATALOG_BOOKS[0];

  const pages = book.comicPages ?? [
    {
      pageNumber: 5,
      title: `Halaman 5 • ${book.author}`,
      timeRemaining: '4 mnt tersisa',
      image: book.cover,
      caption: book.synopsis,
    },
    {
      pageNumber: 6,
      title: `Halaman 6 • ${book.author}`,
      timeRemaining: '3 mnt tersisa',
      image: './assets/images/comic-kiki-hal6.jpg',
      caption: 'Petualangan berlanjut di halaman keenam!',
    },
    {
      pageNumber: 7,
      title: `Halaman 7 • ${book.author}`,
      timeRemaining: '1 mnt tersisa',
      image: './assets/images/comic-kiki-hal6.jpg',
      caption: 'Episode selesai! Uji pemahamanmu lewat kuis singkat.',
    },
  ];

  const defaultPageIndex = pages.findIndex((p) => p.pageNumber === 6);
  const [pageIdx, setPageIdx] = useState(
    defaultPageIndex >= 0 ? defaultPageIndex : 0
  );
  const [showToast, setShowToast] = useState(true);
  const [quizOpen, setQuizOpen] = useState(false);

  const currentPage = pages[pageIdx] ?? pages[0];
  const saved = bookmarkedBookIds.includes(book.id);
  const quizKey = `${book.id}-comic-ep2`;
  const quizDone = completedQuizChapters.includes(quizKey);

  const isDark = settings.paperTheme === 'gelap';
  const isSepia = settings.paperTheme === 'sepia';

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDark
          ? 'bg-[#0F172A] text-white'
          : isSepia
          ? 'bg-[#FDF4E7] text-[#3F2E21]'
          : 'bg-[#F6F9FE] text-[#0F172A]'
      }`}
    >
      {/* Top Bar */}
      <header
        className={`sticky top-0 z-30 flex items-center justify-between px-3.5 py-2.5 border-b ${
          isDark
            ? 'bg-[#1E293B] border-[#334155]'
            : 'bg-white border-[#E5ECF6]'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali"
            className="min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center hover:bg-black/5 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="text-[14.5px] font-bold truncate">
              {book.title.replace('...', '')}
            </div>
            <div className="text-[11px] text-[#B45309] font-semibold truncate">
              Bab 2 • {book.author} • Hal {currentPage.pageNumber}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onToggleBookmark(book.id)}
            aria-label="Simpan bookmark"
            className={`min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center cursor-pointer hover:bg-black/5 ${
              saved ? 'text-[#0A4F9E]' : ''
            }`}
          >
            <BookmarkPlus className="w-[18px] h-[18px]" />
          </button>

          <button
            type="button"
            onClick={onOpenCustomize}
            aria-label="Kustomisasi membaca"
            className="min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center font-black text-[15px] tracking-tighter cursor-pointer hover:bg-black/5"
          >
            <span className="text-[11px] align-top mr-0.5">T</span>T
          </button>

          <button
            type="button"
            onClick={() => onNavigate('profil')}
            aria-label="Profil"
            className="w-9 h-9 rounded-full bg-[#0A4F9E] text-white flex items-center justify-center cursor-pointer shadow-xs"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pt-3.5 pb-7 flex flex-col justify-between">
        <div>
          {/* Page Indicator Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#475569]">
              <BookOpen className="w-4 h-4 text-[#B45309]" />
              <span>{currentPage.title}</span>
            </div>

            <span className="rounded-full bg-[#FFF2E5] border border-[#FAD4B4] px-2.5 py-1 text-[11px] font-bold text-[#B45309] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{currentPage.timeRemaining}</span>
            </span>
          </div>

          {/* Comic Panel Card */}
          <div className="rounded-[24px] bg-white p-2 border border-[#E2E8F0] shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <img
              src={currentPage.image}
              alt={`${book.title} Halaman ${currentPage.pageNumber}`}
              className="w-full h-auto rounded-[18px] object-cover"
            />
            {currentPage.caption && (
              <div className="px-2.5 pt-2.5 pb-1 text-[12px] font-medium text-[#475569] text-center">
                {currentPage.caption}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-3.5">
          {/* Hal Navigation */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={pageIdx === 0}
              onClick={() => setPageIdx((p) => Math.max(0, p - 1))}
              className="min-h-[46px] rounded-full bg-[#E5EEF9] hover:bg-[#D5E3F5] disabled:opacity-45 py-3 px-4 text-[13.5px] font-bold text-[#0F172A] flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                Hal {pages[Math.max(0, pageIdx - 1)]?.pageNumber ?? 5}
              </span>
            </button>

            {pageIdx + 1 < pages.length ? (
              <button
                type="button"
                onClick={() => setPageIdx((p) => p + 1)}
                className="min-h-[46px] rounded-full bg-[#0A4F9E] hover:bg-[#083F80] py-3 px-4 text-[13.5px] font-bold text-white flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <span>Hal {pages[pageIdx + 1].pageNumber}: Lanjut</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setQuizOpen(true)}
                className="min-h-[46px] rounded-full bg-[#15803D] hover:bg-[#166534] py-3 px-4 text-[13.5px] font-bold text-white flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                {quizDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <HelpCircle className="w-4 h-4" />
                )}
                <span>{quizDone ? 'Kuis Selesai' : 'Kuis Episode'}</span>
              </button>
            )}
          </div>

          {/* XP Toast */}
          {showToast && (
            <div className="rounded-[20px] bg-[#FFF7ED] border border-[#FED7AA] px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#FFEDD5] flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-[#EA580C] fill-[#EA580C]" />
                </div>
                <div className="text-[12px] font-bold text-[#C2410C] truncate">
                  +15 XP Tercapai! 🎯{' '}
                  <span className="font-semibold text-[#334155]">
                    10 mnt membaca
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowToast(false)}
                aria-label="Tutup notifikasi"
                className="text-[#475569] hover:text-[#0F172A] p-1 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      <ChapterQuizModal
        open={quizOpen}
        bookTitle={book.title.replace('...', '')}
        chapterTitle="Bab 2 Komik"
        questions={[
          {
            id: 'comic-q1',
            question:
              'Suasana apa yang digambarkan saat Bubu dan Tupi berjalan pagi di desa?',
            options: [
              'Pagi cerah dengan bunga bermekaran dan kicau burung',
              'Malam hari yang hujan deras',
              'Di tengah badai salju di gunung',
            ],
            correctIndex: 0,
            explanation:
              'Komik menggambarkan pagi cerah yang indah dengan burung berkicau dan taman bunga.',
          },
        ]}
        alreadyCompleted={quizDone}
        onComplete={() =>
          onCompleteQuiz(quizKey, 35, 20, ['Persahabatan', 'Flora Taman'])
        }
        onClose={() => setQuizOpen(false)}
      />
    </div>
  );
}
