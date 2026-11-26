import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  HelpCircle,
  Lightbulb,
  User,
  X,
  Zap,
} from 'lucide-react';
import { CATALOG_BOOKS } from '../data/readventureData';
import { BookItem, ChapterContent, ReaderSettings, ScreenId } from '../types';
import { ChapterQuizModal } from '../components/ChapterQuizModal';

interface TextReaderScreenProps {
  bookId: string;
  settings: ReaderSettings;
  bookmarkedBookIds: string[];
  bookNotes: Record<string, string>;
  completedQuizChapters: string[];
  onToggleBookmark: (bookId: string) => void;
  onSaveNote: (noteKey: string, text: string) => void;
  onUpdateProgress: (bookId: string, progress: number) => void;
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

const FONT_SIZES = [13, 14.5, 16, 18, 20];
const LINE_HEIGHTS = {
  rapat: 1.4,
  ideal: 1.65,
  renggang: 1.85,
};

function buildFallbackChapter(book: BookItem): ChapterContent {
  return {
    chapterNumber: 1,
    partLabel: `${book.category.toUpperCase()} • BAB 1`,
    title: `Bab 1: ${book.fullTitle}`,
    duration: book.duration,
    banner: book.cover,
    paragraphs: [
      `Petualangan dimulai ketika tokoh utama membuka halaman pertama catatan rahasia tentang ${book.title.replace('...', '')}. Udara pagi terasa segar dan penuh tanda tanya yang menanti untuk dipecahkan bersama sahabatnya.`,
      book.synopsis,
      'Setiap petunjuk yang mereka temukan di sepanjang perjalanan mengajarkan keberanian, ketelitian, dan pentingnya bekerja sama demi kebaikan bersama.',
    ],
    quote: `“Setiap buku adalah pintu menuju dunia baru yang menunggu untuk dijelajahi bersama.”`,
    defaultNote: 'Awal Petualangan Baru',
    newVocab: ['Eksplorasi', 'Kolaborasi'],
    quiz: [
      {
        id: `${book.id}-q1`,
        question: `Apa nilai utama yang dipelajari dalam cerita ${book.fullTitle}?`,
        options: [
          'Keberanian, ketelitian, dan kerja sama',
          'Menghindari rasa ingin tahu',
          'Berjalan sendirian tanpa rencana',
        ],
        correctIndex: 0,
        explanation:
          'Setiap petunjuk dalam cerita mengajarkan keberanian, ketelitian, dan pentingnya bekerja sama.',
      },
    ],
  };
}

export function TextReaderScreen({
  bookId,
  settings,
  bookmarkedBookIds,
  bookNotes,
  completedQuizChapters,
  onToggleBookmark,
  onSaveNote,
  onUpdateProgress,
  onCompleteQuiz,
  onBack,
  onOpenCustomize,
  onNavigate,
}: TextReaderScreenProps) {
  const book =
    CATALOG_BOOKS.find((b) => b.id === bookId) ?? CATALOG_BOOKS[0];
  const chapters =
    book.chapters && book.chapters.length > 0
      ? book.chapters
      : [buildFallbackChapter(book)];

  const defaultIndex =
    book.id === 'misteri-hutan-rimba' && chapters.length > 1 ? 1 : 0;
  const [chapterIdx, setChapterIdx] = useState(defaultIndex);
  const [showXpToast, setShowXpToast] = useState(true);
  const [editingNote, setEditingNote] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const chapter = chapters[chapterIdx] ?? chapters[0];
  const noteKey = `${book.id}-${chapter.chapterNumber}`;
  const noteText = bookNotes[noteKey] ?? chapter.defaultNote;
  const [draftNote, setDraftNote] = useState(noteText);
  const bookmarked = bookmarkedBookIds.includes(book.id);
  const quizKey = `${book.id}-ch-${chapter.chapterNumber}`;
  const quizDone = completedQuizChapters.includes(quizKey);

  const fontSize = FONT_SIZES[settings.fontSizeStep] ?? 16;
  const lineHeight = LINE_HEIGHTS[settings.lineSpacing];
  const fontClass =
    settings.fontStyle === 'klasik'
      ? 'font-klasik'
      : settings.fontStyle === 'ramah'
      ? 'font-ramah'
      : 'font-modern';

  const paperStyles =
    settings.paperTheme === 'gelap'
      ? {
          bg: 'bg-[#0F172A]',
          headerBg: 'bg-[#1E293B] border-[#334155]',
          text: 'text-slate-200',
          title: 'text-white',
          subtext: 'text-slate-400',
          quoteBg: 'bg-[#1E293B] border border-[#334155]',
          quoteText: 'text-slate-100',
          navSecondary: 'bg-[#1E293B] text-slate-200 border border-[#334155]',
        }
      : settings.paperTheme === 'sepia'
      ? {
          bg: 'bg-[#FDF4E7]',
          headerBg: 'bg-[#FAF0E1] border-[#EEDCC3]',
          text: 'text-[#3F2E21]',
          title: 'text-[#2C1E14]',
          subtext: 'text-[#7C624C]',
          quoteBg: 'bg-[#FBE4CA]',
          quoteText: 'text-[#2C1E14]',
          navSecondary: 'bg-[#F3E2CE] text-[#3F2E21]',
        }
      : {
          bg: 'bg-[#F8FAFD]',
          headerBg: 'bg-white border-[#E5ECF6]',
          text: 'text-[#1E293B]',
          title: 'text-[#0F172A]',
          subtext: 'text-[#64748B]',
          quoteBg: 'bg-[#FDE9D5]',
          quoteText: 'text-[#0F172A]',
          navSecondary: 'bg-[#E5EEF9] text-[#0F172A]',
        };

  const handleSelectChapter = (nextIdx: number) => {
    setChapterIdx(nextIdx);
    const nextChapter = chapters[nextIdx];
    const pct = Math.min(
      100,
      Math.round(((nextIdx + 1) / chapters.length) * 100)
    );
    onUpdateProgress(book.id, pct);
    if (nextChapter) {
      setDraftNote(
        bookNotes[`${book.id}-${nextChapter.chapterNumber}`] ??
          nextChapter.defaultNote
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const firstPara = chapter.paragraphs[0] ?? '';
  const dropCap = firstPara.charAt(0);
  const restFirstPara = firstPara.slice(1);

  return (
    <div className={`min-h-screen flex flex-col ${paperStyles.bg} ${fontClass}`}>
      {/* Reader Top Bar */}
      <header
        className={`sticky top-0 z-30 flex items-center justify-between px-3.5 py-2.5 border-b ${paperStyles.headerBg}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali"
            className={`min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center cursor-pointer hover:bg-black/5 shrink-0 ${paperStyles.title}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className={`text-[14.5px] font-bold truncate ${paperStyles.title}`}>
              {book.title.replace('...', '')}
            </div>
            <div className={`text-[11px] truncate ${paperStyles.subtext}`}>
              {chapter.title} • {book.author}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onToggleBookmark(book.id)}
            aria-label="Tandai halaman"
            className={`min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center cursor-pointer hover:bg-black/5 ${
              bookmarked ? 'text-[#0A4F9E]' : paperStyles.title
            }`}
          >
            <Bookmark
              className={`w-[18px] h-[18px] ${
                bookmarked ? 'fill-[#0A4F9E]' : ''
              }`}
            />
          </button>

          <button
            type="button"
            onClick={onOpenCustomize}
            aria-label="Kustomisasi membaca"
            className={`min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center font-black text-[15px] tracking-tighter cursor-pointer hover:bg-black/5 ${paperStyles.title}`}
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

      <main className="flex-1 px-4 pt-4 pb-8">
        {/* Hero Cave / Chapter Banner */}
        <div className="relative rounded-[20px] overflow-hidden shadow-md mb-5 h-[196px]">
          <img
            src={chapter.banner}
            alt={chapter.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081326]/90 via-[#081326]/25 to-transparent" />

          <span className="absolute top-3 right-3 rounded-full bg-[#0F172A]/75 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-white flex items-center gap-1 border border-white/15">
            <Clock className="w-3 h-3" />
            <span>{chapter.duration}</span>
          </span>

          <div className="absolute bottom-3.5 left-4 right-4 text-white">
            <div className="text-[10.5px] font-extrabold tracking-wider text-[#93C5FD]">
              {chapter.partLabel}
            </div>
            <h1 className="text-[20px] font-extrabold leading-tight mt-0.5">
              {chapter.title}
            </h1>
          </div>
        </div>

        {/* Story Paragraphs */}
        <article
          style={{ fontSize: `${fontSize}px`, lineHeight }}
          className={`space-y-4 ${paperStyles.text}`}
        >
          {firstPara && (
            <p>
              <span className="float-left mr-2.5 mt-1 text-[44px] font-extrabold leading-[0.82] text-[#0A4F9E] font-modern">
                {dropCap}
              </span>
              {restFirstPara}
            </p>
          )}

          {chapter.paragraphs[1] && <p>{chapter.paragraphs[1]}</p>}

          {/* Floating XP Toast + Quote Card */}
          <div className="relative pt-2">
            {showXpToast && (
              <div className="relative z-10 -mb-4 rounded-[18px] bg-white px-3.5 py-2.5 border border-[#E2E8F0] shadow-[0_6px_20px_rgba(15,23,42,0.12)] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#FFEDD5] flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-[#EA580C] fill-[#EA580C]" />
                  </div>
                  <div>
                    <div className="text-[12.5px] font-extrabold text-[#C2410C]">
                      +25 XP Tercapai! 🎯
                    </div>
                    <div className="text-[11px] font-medium text-[#475569]">
                      10 mnt membaca hari ini
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowXpToast(false)}
                  aria-label="Tutup notifikasi XP"
                  className="text-[#475569] hover:text-[#0F172A] p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div
              className={`rounded-[20px] px-4 pb-4 ${
                showXpToast ? 'pt-7' : 'pt-4'
              } ${paperStyles.quoteBg}`}
            >
              <blockquote
                className={`font-bold leading-relaxed ${paperStyles.quoteText}`}
              >
                {chapter.quote}
              </blockquote>

              <div className="mt-3 flex items-center justify-between gap-2">
                {editingNote ? (
                  <input
                    type="text"
                    value={draftNote}
                    onChange={(e) => setDraftNote(e.target.value)}
                    onBlur={() => {
                      onSaveNote(noteKey, draftNote);
                      setEditingNote(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onSaveNote(noteKey, draftNote);
                        setEditingNote(false);
                      }
                    }}
                    autoFocus
                    className="flex-1 rounded-full bg-white px-3 py-1 text-[11.5px] font-semibold text-[#9A3412] border border-[#FDBA74] focus:outline-none"
                  />
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FED7AA] px-3 py-1 text-[11px] font-bold text-[#9A3412]">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Catatan: {noteText}</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (editingNote) {
                      onSaveNote(noteKey, draftNote);
                      setEditingNote(false);
                    } else {
                      setDraftNote(noteText);
                      setEditingNote(true);
                    }
                  }}
                  className="text-[12px] font-bold text-[#C2410C] hover:underline cursor-pointer shrink-0"
                >
                  {editingNote ? 'Simpan' : 'Edit'}
                </button>
              </div>
            </div>
          </div>

          {chapter.paragraphs.slice(2).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>

        {/* Chapter Quiz Prompt Card */}
        <div className="mt-6 rounded-[20px] bg-white border border-[#DBEAFE] p-4 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                quizDone
                  ? 'bg-[#DCFCE7] text-[#15803D]'
                  : 'bg-[#EAF1FB] text-[#0A4F9E]'
              }`}
            >
              {quizDone ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <HelpCircle className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-[13.5px] font-bold text-[#0F172A]">
                {quizDone
                  ? 'Kuis Bab Sudah Selesai!'
                  : `Uji Pemahaman Bab ${chapter.chapterNumber}`}
              </div>
              <div className="text-[11.5px] text-[#64748B]">
                {quizDone
                  ? 'Kosakata baru sudah tercatat di laporan orang tua'
                  : 'Jawab kuis singkat untuk +40 XP & +25 Koin'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setQuizOpen(true)}
            className="shrink-0 min-h-[40px] rounded-full bg-[#0A4F9E] hover:bg-[#083F80] px-4 py-2 text-[12px] font-bold text-white cursor-pointer"
          >
            {quizDone ? 'Ulangi' : 'Mulai Kuis'}
          </button>
        </div>

        {/* Bottom Chapter Navigation */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            type="button"
            disabled={chapterIdx === 0}
            onClick={() => handleSelectChapter(Math.max(0, chapterIdx - 1))}
            className={`min-h-[46px] rounded-full py-3 px-4 text-[13.5px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-opacity disabled:opacity-45 ${paperStyles.navSecondary}`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              Bab {chapters[Math.max(0, chapterIdx - 1)]?.chapterNumber ?? 1}
            </span>
          </button>

          {chapterIdx + 1 < chapters.length ? (
            <button
              type="button"
              onClick={() => handleSelectChapter(chapterIdx + 1)}
              className="min-h-[46px] rounded-full bg-[#0A4F9E] hover:bg-[#083F80] py-3 px-4 text-[13.5px] font-bold text-white flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
            >
              <span>
                Bab {chapters[chapterIdx + 1].chapterNumber}
                {chapters[chapterIdx + 1].chapterNumber === 5 ? ': Ujian' : ''}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuizOpen(true)}
              className="min-h-[46px] rounded-full bg-[#15803D] hover:bg-[#166534] py-3 px-4 text-[13.5px] font-bold text-white flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
            >
              <span>Selesaikan Kuis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>

      <ChapterQuizModal
        open={quizOpen}
        bookTitle={book.title.replace('...', '')}
        chapterTitle={`Bab ${chapter.chapterNumber}`}
        questions={chapter.quiz}
        alreadyCompleted={quizDone}
        onComplete={() =>
          onCompleteQuiz(quizKey, 40, 25, chapter.newVocab)
        }
        onClose={() => setQuizOpen(false)}
      />
    </div>
  );
}
