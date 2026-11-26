import { ExternalLink, Shield, Smartphone } from 'lucide-react';
import { DeviceMode } from '../types';

interface DeviceSwitcherBarProps {
  deviceMode: DeviceMode;
  pendingCount: number;
  onChangeDevice: (mode: DeviceMode) => void;
}

export function DeviceSwitcherBar({
  deviceMode,
  pendingCount,
  onChangeDevice,
}: DeviceSwitcherBarProps) {
  return (
    <div className="bg-[#0F172A] text-white px-3 py-2 border-b border-slate-800">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11.5px] text-slate-300">
          <span className="font-bold text-white">Akun Keluarga #RDV-88219</span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-300">
            Sinkronisasi Real-Time
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full bg-slate-800 p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => onChangeDevice('child')}
              className={`min-h-[34px] rounded-full px-3 py-1 text-[11.5px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                deviceMode === 'child'
                  ? 'bg-[#0A4F9E] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Perangkat Anak</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeDevice('parent')}
              className={`min-h-[34px] rounded-full px-3 py-1 text-[11.5px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                deviceMode === 'parent'
                  ? 'bg-[#0F7643] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Perangkat Orang Tua</span>
              {pendingCount > 0 && (
                <span className="rounded-full bg-[#F97316] px-1.5 py-0.5 text-[10px] font-extrabold text-white tabular-nums">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          <a
            href={deviceMode === 'child' ? '?device=parent' : '?device=child'}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka perangkat kedua di tab baru untuk uji sinkronisasi langsung"
            className="hidden sm:inline-flex min-h-[34px] items-center gap-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-200 whitespace-nowrap transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span>
              {deviceMode === 'child'
                ? 'Buka Tab Orang Tua'
                : 'Buka Tab Anak'}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
