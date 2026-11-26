import { BookOpen, Compass, Home, Smile, Trophy } from 'lucide-react';
import { TabId } from '../types';

interface BottomNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

const NAV_ITEMS: { id: TabId; label: string; Icon: typeof Home }[] = [
  { id: 'beranda', label: 'Beranda', Icon: Home },
  { id: 'jelajah', label: 'Jelajah', Icon: Compass },
  { id: 'pustaka', label: 'Pustaka', Icon: BookOpen },
  { id: 'peringkat', label: 'Peringkat', Icon: Trophy },
  { id: 'profil', label: 'Profil', Icon: Smile },
];

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  return (
    <nav className="sticky bottom-0 z-30 bg-white border-t border-[#E5ECF6] px-2 pt-2 pb-2.5 shadow-[0_-4px_20px_rgba(15,23,42,0.04)]">
      <div className="grid grid-cols-5 items-center">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectTab(id)}
              className={`flex flex-col items-center justify-center gap-1 py-0.5 cursor-pointer transition-colors ${
                isActive ? 'text-[#0A4F9E]' : 'text-[#64748B] hover:text-[#334155]'
              }`}
            >
              <Icon
                className="w-[21px] h-[21px]"
                strokeWidth={isActive ? 2.4 : 1.8}
              />
              <span
                className={`text-[11px] leading-none ${
                  isActive ? 'font-bold text-[#0A4F9E]' : 'font-medium text-[#64748B]'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
