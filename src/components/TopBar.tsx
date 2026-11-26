import { BookOpen, Flame, Star, User } from 'lucide-react';
import { ScreenId } from '../types';

interface TopBarProps {
  streakHours: string;
  coins: number;
  onNavigate: (screen: ScreenId) => void;
}

export function TopBar({ streakHours, coins, onNavigate }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-2.5 border-b border-[#E5ECF6]">
      <button
        type="button"
        onClick={() => onNavigate('beranda')}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-[10px] bg-[#0A4F9E] flex items-center justify-center shadow-sm group-active:scale-95 transition-transform">
          <BookOpen className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />
        </div>
        <span className="text-[17px] font-bold tracking-tight text-[#0A4F9E]">
          Readventure
        </span>
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate('peringkat')}
          className="flex items-center gap-1 rounded-full bg-[#FFF2E5] border border-[#FAD4B4] px-2.5 py-1 text-[12px] font-bold text-[#B45309] cursor-pointer hover:bg-[#FFE8D1] transition-colors"
        >
          <Flame className="w-3.5 h-3.5 text-[#EA580C] fill-[#EA580C]/20" />
          <span>{streakHours}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('beranda')}
          className="flex items-center gap-1 rounded-full bg-[#DCFCE7] border border-[#86EFAC] px-2.5 py-1 text-[12px] font-bold text-[#15803D] cursor-pointer hover:bg-[#BBF7D0] transition-colors"
        >
          <Star className="w-3.5 h-3.5 text-[#16A34A] fill-[#16A34A]" />
          <span>{coins}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('profil')}
          aria-label="Profil Petualang"
          className="w-8 h-8 rounded-full bg-[#0A4F9E] text-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-[#083E7D] transition-colors"
        >
          <User className="w-4 h-4" strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
}
