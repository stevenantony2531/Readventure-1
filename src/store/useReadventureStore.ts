import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_READVENTURE_STATE } from '../data/readventureData';
import {
  ApprovalRequest,
  DeviceMode,
  ReaderSettings,
  ReadventureState,
} from '../types';

const STORAGE_KEY = 'readventure_family_state_v2';
const CHANNEL_NAME = 'readventure_family_sync_v2';

function getInitialDeviceFromUrl(): DeviceMode | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const d = params.get('device');
  if (d === 'parent' || d === 'child') return d;
  return null;
}

function loadSharedState(): ReadventureState {
  if (typeof window === 'undefined') return DEFAULT_READVENTURE_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_READVENTURE_STATE;
    const parsed = JSON.parse(raw) as Partial<ReadventureState>;
    return {
      ...DEFAULT_READVENTURE_STATE,
      ...parsed,
      equippedStudio: {
        ...DEFAULT_READVENTURE_STATE.equippedStudio,
        ...(parsed.equippedStudio ?? {}),
      },
      readerSettings: {
        ...DEFAULT_READVENTURE_STATE.readerSettings,
        ...(parsed.readerSettings ?? {}),
      },
    };
  } catch {
    return DEFAULT_READVENTURE_STATE;
  }
}

export function useReadventureStore() {
  const [state, setState] = useState<ReadventureState>(loadSharedState);
  // Keep deviceMode per-tab so two browser tabs can act as Child Device + Parent Device simultaneously
  const [localDeviceMode, setLocalDeviceMode] = useState<DeviceMode>(
    () => getInitialDeviceFromUrl() ?? 'child'
  );

  const persistAndBroadcast = useCallback((next: ReadventureState) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      if ('BroadcastChannel' in window) {
        const ch = new BroadcastChannel(CHANNEL_NAME);
        ch.postMessage({ type: 'SYNC_STATE', payload: next });
        ch.close();
      }
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, []);

  const updateShared = useCallback(
    (updater: (prev: ReadventureState) => ReadventureState) => {
      setState((prev) => {
        const next = updater(prev);
        persistAndBroadcast(next);
        return next;
      });
    },
    [persistAndBroadcast]
  );

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as ReadventureState;
          setState(parsed);
        } catch {
          // ignore
        }
      }
    };

    let ch: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      ch = new BroadcastChannel(CHANNEL_NAME);
      ch.onmessage = (evt) => {
        if (evt.data?.type === 'SYNC_STATE' && evt.data.payload) {
          setState(evt.data.payload);
        }
      };
    }

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      ch?.close();
    };
  }, []);

  const addXpAndCoins = useCallback(
    (xpDelta: number, coinsDelta: number) => {
      updateShared((prev) => {
        let nextXp = prev.xpCurrent + xpDelta;
        let nextLevel = prev.level;
        let nextTarget = prev.xpTarget;
        while (nextXp >= nextTarget) {
          nextXp -= nextTarget;
          nextLevel += 1;
          nextTarget = Math.round(nextTarget * 1.15);
        }
        return {
          ...prev,
          xpCurrent: nextXp,
          level: nextLevel,
          xpTarget: nextTarget,
          totalXpNumber: prev.totalXpNumber + xpDelta,
          coins: Math.max(0, prev.coins + coinsDelta),
        };
      });
    },
    [updateShared]
  );

  const completeQuizChapter = useCallback(
    (chapterKey: string, xpReward: number, coinsReward: number, newVocab: string[]) => {
      updateShared((prev) => {
        const alreadyDone = prev.completedQuizChapters.includes(chapterKey);
        const mergedVocab = Array.from(new Set([...prev.learnedVocab, ...newVocab]));
        if (alreadyDone) {
          return { ...prev, learnedVocab: mergedVocab };
        }
        let nextXp = prev.xpCurrent + xpReward;
        let nextLevel = prev.level;
        let nextTarget = prev.xpTarget;
        while (nextXp >= nextTarget) {
          nextXp -= nextTarget;
          nextLevel += 1;
          nextTarget = Math.round(nextTarget * 1.15);
        }
        return {
          ...prev,
          xpCurrent: nextXp,
          level: nextLevel,
          xpTarget: nextTarget,
          totalXpNumber: prev.totalXpNumber + xpReward,
          coins: prev.coins + coinsReward,
          quizzesCompletedToday: prev.quizzesCompletedToday + 1,
          completedQuizChapters: [...prev.completedQuizChapters, chapterKey],
          learnedVocab: mergedVocab,
        };
      });
    },
    [updateShared]
  );

  const requestParentApproval = useCallback(
    (req: Omit<ApprovalRequest, 'id' | 'requestedAt' | 'status'>) => {
      updateShared((prev) => {
        const exists = prev.pendingRequests.some(
          (r) => r.type === req.type && r.status === 'pending'
        );
        if (exists) return prev;
        const newReq: ApprovalRequest = {
          ...req,
          id: `req-${Date.now()}`,
          requestedAt: 'Baru saja',
          status: 'pending',
        };
        return {
          ...prev,
          pendingRequests: [newReq, ...prev.pendingRequests],
        };
      });
    },
    [updateShared]
  );

  const resolveApprovalRequest = useCallback(
    (requestId: string, approved: boolean) => {
      updateShared((prev) => {
        const target = prev.pendingRequests.find((r) => r.id === requestId);
        if (!target) return prev;
        const nextRequests = prev.pendingRequests.map((r) =>
          r.id === requestId
            ? { ...r, status: approved ? ('approved' as const) : ('rejected' as const) }
            : r
        );
        let nextCoins = prev.coins;
        let nextPlus = prev.isPlusActive;
        let nextPlan = prev.plusPlanLabel;
        if (approved) {
          if (target.type === 'plus_subscription') {
            nextPlus = true;
            nextPlan = 'Paket Keluarga Terbuka';
          } else if (target.type === 'coin_pack') {
            nextCoins += 500;
          }
        }
        return {
          ...prev,
          pendingRequests: nextRequests,
          isPlusActive: nextPlus,
          plusPlanLabel: nextPlan,
          coins: nextCoins,
        };
      });
    },
    [updateShared]
  );

  const sendEncouragement = useCallback(
    (message: string) => {
      updateShared((prev) => ({
        ...prev,
        encouragementCards: [
          {
            id: `enc-${Date.now()}`,
            message,
            sender: 'Ayah & Bunda',
            sentAt: 'Baru saja',
            read: false,
          },
          ...prev.encouragementCards,
        ],
      }));
    },
    [updateShared]
  );

  const dismissEncouragement = useCallback(
    (id: string) => {
      updateShared((prev) => ({
        ...prev,
        encouragementCards: prev.encouragementCards.map((c) =>
          c.id === id ? { ...c, read: true } : c
        ),
      }));
    },
    [updateShared]
  );

  const updateReaderSettings = useCallback(
    (settings: ReaderSettings) => {
      updateShared((prev) => ({ ...prev, readerSettings: settings }));
    },
    [updateShared]
  );

  return {
    state,
    localDeviceMode,
    setLocalDeviceMode,
    updateShared,
    addXpAndCoins,
    completeQuizChapter,
    requestParentApproval,
    resolveApprovalRequest,
    sendEncouragement,
    dismissEncouragement,
    updateReaderSettings,
  };
}
