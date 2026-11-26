import { useState } from 'react';
import { Award, CheckCircle2, HelpCircle, X, XCircle, Zap } from 'lucide-react';
import { QuizQuestion } from '../types';

interface ChapterQuizModalProps {
  open: boolean;
  bookTitle: string;
  chapterTitle: string;
  questions: QuizQuestion[];
  alreadyCompleted: boolean;
  onComplete: (correctCount: number) => void;
  onClose: () => void;
}

export function ChapterQuizModal({
  open,
  bookTitle,
  chapterTitle,
  questions,
  alreadyCompleted,
  onComplete,
  onClose,
}: ChapterQuizModalProps) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!open || questions.length === 0) return null;

  const current = questions[idx];
  const isAnswered = selected !== null;
  const isCorrect = selected === current.correctIndex;

  const handleSelect = (optionIdx: number) => {
    if (isAnswered) return;
    setSelected(optionIdx);
    if (optionIdx === current.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setSelected(null);
    } else {
      setFinished(true);
      onComplete(correctCount);
    }
  };

  const handleResetAndClose = () => {
    setIdx(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs px-4"
      onClick={handleResetAndClose}
    >
      <div
        className="w-full max-w-[400px] rounded-[28px] bg-white p-5 shadow-2xl border border-[#E2E8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#EAF1FB] text-[#0A4F9E] flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-[#0A4F9E] truncate">
                {bookTitle}
              </div>
              <h2 className="text-[15px] font-extrabold text-[#0F172A] truncate">
                Kuis Pemahaman · {chapterTitle}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Tutup kuis"
            className="min-w-[40px] min-h-[40px] rounded-full bg-[#F1F5F9] text-[#334155] flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!finished ? (
          <div>
            <div className="flex items-center justify-between text-[11.5px] font-bold text-[#64748B] mb-2">
              <span>
                Pertanyaan {idx + 1} dari {questions.length}
              </span>
              <span className="text-[#0A4F9E] tabular-nums">
                Skor: {correctCount}
              </span>
            </div>

            <div className="h-1.5 w-full rounded-full bg-[#E2E8F0] mb-4 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0A4F9E] transition-all"
                style={{ width: `${((idx + 1) / questions.length) * 100}%` }}
              />
            </div>

            <h3 className="text-[15px] font-bold text-[#0F172A] leading-snug mb-3.5">
              {current.question}
            </h3>

            <div className="space-y-2.5">
              {current.options.map((opt, oIdx) => {
                const chosen = selected === oIdx;
                const right = oIdx === current.correctIndex;
                let cls =
                  'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] hover:bg-[#EAF1FB]';
                if (isAnswered) {
                  if (right) {
                    cls = 'bg-[#DCFCE7] border-[#22C55E] text-[#14532D]';
                  } else if (chosen && !right) {
                    cls = 'bg-[#FEF2F2] border-[#EF4444] text-[#991B1B]';
                  } else {
                    cls = 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelect(oIdx)}
                    className={`w-full min-h-[46px] rounded-[16px] border-2 px-3.5 py-2.5 text-left text-[13px] font-semibold flex items-center justify-between gap-2 cursor-pointer transition-colors ${cls}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && right && (
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    )}
                    {isAnswered && chosen && !right && (
                      <XCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div
                className={`mt-3.5 rounded-[16px] p-3 text-[12px] leading-relaxed ${
                  isCorrect
                    ? 'bg-[#ECFDF5] text-[#14532D]'
                    : 'bg-[#FFF7ED] text-[#9A3412]'
                }`}
              >
                <div className="font-bold mb-0.5">
                  {isCorrect ? 'Tepat sekali!' : 'Hampir benar!'}
                </div>
                <div>{current.explanation}</div>
              </div>
            )}

            <button
              type="button"
              disabled={!isAnswered}
              onClick={handleNext}
              className="mt-4 w-full min-h-[46px] rounded-full bg-[#0A4F9E] disabled:bg-slate-300 text-white text-[13.5px] font-bold cursor-pointer transition-colors"
            >
              {idx + 1 < questions.length
                ? 'Pertanyaan Berikutnya'
                : 'Lihat Hasil & Klaim XP'}
            </button>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-[18px] font-extrabold text-[#0F172A]">
              Hebat, Arka!
            </h3>
            <p className="text-[13px] text-[#475569] mt-1">
              Kamu menjawab benar{' '}
              <span className="font-extrabold text-[#0A4F9E]">
                {correctCount} dari {questions.length}
              </span>{' '}
              pertanyaan pemahaman cerita.
            </p>

            <div className="mt-4 rounded-[18px] bg-[#EAF1FB] p-3.5 flex items-center justify-center gap-4 text-[13px] font-extrabold text-[#0A4F9E]">
              <span className="inline-flex items-center gap-1">
                <Zap className="w-4 h-4 fill-[#0A4F9E]" />
                {alreadyCompleted ? 'Kuis Selesai' : '+40 XP'}
              </span>
              {!alreadyCompleted && (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="text-[#15803D]">+25 Koin Bintang</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="mt-5 w-full min-h-[46px] rounded-full bg-[#0A4F9E] hover:bg-[#083F80] text-white text-[13.5px] font-bold cursor-pointer"
            >
              Kembali ke Bacaan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
