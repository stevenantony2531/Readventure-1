import { useEffect, useState } from 'react';
import { BookDetailSheet } from './components/BookDetailSheet';
import { BottomNav } from './components/BottomNav';
import { DeviceSwitcherBar } from './components/DeviceSwitcherBar';
import { ParentalPinGateModal } from './components/ParentalPinGateModal';
import { ReadingCustomizationSheet } from './components/ReadingCustomizationSheet';
import { TopBar } from './components/TopBar';
import { PROFILE_THEMES } from './data/readventureData';
import { BerandaScreen } from './screens/BerandaScreen';
import { ComicReaderScreen } from './screens/ComicReaderScreen';
import { JelajahScreen } from './screens/JelajahScreen';
import { ParentDashboardScreen } from './screens/ParentDashboardScreen';
import { PeringkatScreen } from './screens/PeringkatScreen';
import { ProfilScreen } from './screens/ProfilScreen';
import { PustakaScreen } from './screens/PustakaScreen';
import { TextReaderScreen } from './screens/TextReaderScreen';
import { useReadventureStore } from './store/useReadventureStore';
import { BookItem, ScreenId, StudioItem, TabId } from './types';

const TAB_SCREENS: TabId[] = [
  'beranda',
  'jelajah',
  'pustaka',
  'peringkat',
  'profil',
];

function isTabScreen(screen: ScreenId): screen is TabId {
  return (TAB_SCREENS as string[]).includes(screen);
}

export default function App() {
  const {
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
  } = useReadventureStore();

  const [childScreen, setChildScreen] = useState<ScreenId>('beranda');
  const [lastTab, setLastTab] = useState<TabId>('beranda');
  const [activeBookId, setActiveBookId] = useState<string>('misteri-hutan-rimba');
  const [detailBook, setDetailBook] = useState<BookItem | null>(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [pinGateOpen, setPinGateOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [childScreen, localDeviceMode]);

  const handleNavigate = (next: ScreenId) => {
    if (next === 'parent-dashboard') {
      setPinGateOpen(true);
      return;
    }
    if (isTabScreen(next)) {
      setLastTab(next);
    }
    setChildScreen(next);
  };

  const handleStartBook = (book: BookItem) => {
    setDetailBook(null);
    setActiveBookId(book.id);
    setChildScreen(book.readerType === 'comic' ? 'reader-comic' : 'reader-text');
  };

  const handleEquipStudioItem = (item: StudioItem) => {
    updateShared((prev) => ({
      ...prev,
      unlockedStudioIds: Array.from(
        new Set([...prev.unlockedStudioIds, item.id])
      ),
      equippedStudio: {
        ...prev.equippedStudio,
        [item.slot]: item.id,
      },
    }));
  };

  const pendingCount = state.pendingRequests.filter(
    (r) => r.status === 'pending'
  ).length;

  // Device 2: Parent Companion App (Full Dashboard & Exclusive Checkout)
  if (localDeviceMode === 'parent') {
    return (
      <div className="min-h-screen bg-[#E8EEF7]">
        <DeviceSwitcherBar
          deviceMode={localDeviceMode}
          pendingCount={pendingCount}
          onChangeDevice={setLocalDeviceMode}
        />
        <ParentDashboardScreen
          activeChildId={state.activeChildId}
          level={state.level}
          totalXpNumber={state.totalXpNumber}
          isPlusActive={state.isPlusActive}
          coins={state.coins}
          learnedVocab={state.learnedVocab}
          bookProgress={state.bookProgress}
          focusLockEnabled={state.focusLockEnabled}
          focusDurationMinutes={state.focusDurationMinutes}
          purchaseApprovalRequired={state.purchaseApprovalRequired}
          gentleReminderEnabled={state.gentleReminderEnabled}
          parentPin={state.parentPin}
          pendingRequests={state.pendingRequests}
          onSwitchChild={(cid) =>
            updateShared((prev) => ({ ...prev, activeChildId: cid }))
          }
          onToggleFocusLock={() =>
            updateShared((prev) => ({
              ...prev,
              focusLockEnabled: !prev.focusLockEnabled,
            }))
          }
          onChangeFocusDuration={(mins) =>
            updateShared((prev) => ({ ...prev, focusDurationMinutes: mins }))
          }
          onTogglePurchaseApproval={() =>
            updateShared((prev) => ({
              ...prev,
              purchaseApprovalRequired: !prev.purchaseApprovalRequired,
            }))
          }
          onToggleGentleReminder={() =>
            updateShared((prev) => ({
              ...prev,
              gentleReminderEnabled: !prev.gentleReminderEnabled,
            }))
          }
          onResolveRequest={resolveApprovalRequest}
          onDirectCheckout={(type) => {
            updateShared((prev) =>
              type === 'plus_subscription'
                ? {
                    ...prev,
                    isPlusActive: true,
                    plusPlanLabel: 'Paket Keluarga Terbuka',
                  }
                : { ...prev, coins: prev.coins + 500 }
            );
          }}
          onSendEncouragement={sendEncouragement}
          onSwitchToChildDevice={() => setLocalDeviceMode('child')}
        />
      </div>
    );
  }

  // Device 1: Child App (Readventure 1 UI + Interactive Flows + Limited PIN Zone)
  const showMainShell = isTabScreen(childScreen);

  return (
    <div className="min-h-screen bg-[#E8EEF7]">
      <DeviceSwitcherBar
        deviceMode={localDeviceMode}
        pendingCount={pendingCount}
        onChangeDevice={setLocalDeviceMode}
      />

      <div className="mx-auto min-h-[calc(100vh-48px)] max-w-[430px] bg-[#F4F7FC] shadow-[0_0_40px_rgba(15,23,42,0.08)] flex flex-col relative">
        {showMainShell && (
          <TopBar
            streakHours={`${state.streakDays}h`}
            coins={state.coins}
            onNavigate={handleNavigate}
          />
        )}

        <div className="flex-1">
          {childScreen === 'beranda' && (
            <BerandaScreen
              activeChildId={state.activeChildId}
              level={state.level}
              xpCurrent={state.xpCurrent}
              xpTarget={state.xpTarget}
              coins={state.coins}
              chestTickets={state.chestTickets}
              claimedDailyMission={state.claimedDailyMission}
              claimedWeeklyMission={state.claimedWeeklyMission}
              quizzesCompletedToday={state.quizzesCompletedToday}
              currentBookProgress={
                state.bookProgress['misteri-hutan-rimba'] ?? 68
              }
              focusLockEnabled={state.focusLockEnabled}
              focusDurationMinutes={state.focusDurationMinutes}
              encouragementCards={state.encouragementCards}
              onClaimMission={(type) => {
                if (type === 'daily' && !state.claimedDailyMission) {
                  updateShared((prev) => ({
                    ...prev,
                    claimedDailyMission: true,
                  }));
                  addXpAndCoins(40, 50);
                } else if (type === 'weekly' && !state.claimedWeeklyMission) {
                  updateShared((prev) => ({
                    ...prev,
                    claimedWeeklyMission: true,
                  }));
                  addXpAndCoins(100, 120);
                }
              }}
              onSpendCoinsForGacha={(cost, unlockedIds) => {
                updateShared((prev) => ({
                  ...prev,
                  coins: Math.max(0, prev.coins - cost),
                  unlockedStudioIds: Array.from(
                    new Set([...prev.unlockedStudioIds, ...unlockedIds])
                  ),
                }));
              }}
              onEquipStudioItem={handleEquipStudioItem}
              onDismissEncouragement={dismissEncouragement}
              onSelectBookDetail={setDetailBook}
              onStartBook={handleStartBook}
              onNavigate={handleNavigate}
            />
          )}

          {childScreen === 'jelajah' && (
            <JelajahScreen
              onSelectBookDetail={setDetailBook}
              onStartBook={handleStartBook}
            />
          )}

          {childScreen === 'pustaka' && (
            <PustakaScreen
              totalXpNumber={state.totalXpNumber}
              level={state.level}
              offlineBookIds={state.offlineBookIds}
              wishlistBookIds={state.wishlistBookIds}
              bookReviews={state.bookReviews}
              onSaveReview={(bookId, text, rating) =>
                updateShared((prev) => ({
                  ...prev,
                  bookReviews: {
                    ...prev.bookReviews,
                    [bookId]: { text, rating },
                  },
                }))
              }
              onSelectBookDetail={setDetailBook}
              onStartBook={handleStartBook}
              onNavigate={handleNavigate}
            />
          )}

          {childScreen === 'peringkat' && (
            <PeringkatScreen onNavigate={handleNavigate} />
          )}

          {childScreen === 'profil' && (
            <ProfilScreen
              activeChildId={state.activeChildId}
              level={state.level}
              totalXpNumber={state.totalXpNumber}
              coins={state.coins}
              chestTickets={state.chestTickets}
              streakDays={state.streakDays}
              isPlusActive={state.isPlusActive}
              activeThemeId={state.activeThemeId}
              unlockedStudioIds={state.unlockedStudioIds}
              equippedStudio={state.equippedStudio}
              pendingRequests={state.pendingRequests}
              onCycleTheme={() => {
                const idx = PROFILE_THEMES.findIndex(
                  (t) => t.id === state.activeThemeId
                );
                const next =
                  PROFILE_THEMES[(idx + 1) % PROFILE_THEMES.length].id;
                updateShared((prev) => ({ ...prev, activeThemeId: next }));
              }}
              onEquipItem={handleEquipStudioItem}
              onOpenPinGate={() => setPinGateOpen(true)}
              onRequestPlusApproval={() =>
                requestParentApproval({
                  type: 'plus_subscription',
                  title: 'Readventure Plus (Paket Keluarga)',
                  description: `${state.activeChildId === 'arka' ? 'Arka' : 'Dira'} meminta izin berlangganan VIP`,
                  priceLabel: 'Rp 29.000 / bulan',
                  priceAmount: 29000,
                })
              }
              onRequestCoinPackApproval={() =>
                requestParentApproval({
                  type: 'coin_pack',
                  title: 'Paket +500 Koin Bintang',
                  description: `${state.activeChildId === 'arka' ? 'Arka' : 'Dira'} meminta izin beli koin bintang`,
                  priceLabel: 'Rp 15.000',
                  priceAmount: 15000,
                })
              }
            />
          )}

          {childScreen === 'reader-text' && (
            <TextReaderScreen
              bookId={activeBookId}
              settings={state.readerSettings}
              bookmarkedBookIds={state.bookmarkedBookIds}
              bookNotes={state.bookNotes}
              completedQuizChapters={state.completedQuizChapters}
              onToggleBookmark={(bookId) =>
                updateShared((prev) => {
                  const exists = prev.bookmarkedBookIds.includes(bookId);
                  return {
                    ...prev,
                    bookmarkedBookIds: exists
                      ? prev.bookmarkedBookIds.filter((id) => id !== bookId)
                      : [...prev.bookmarkedBookIds, bookId],
                  };
                })
              }
              onSaveNote={(noteKey, text) =>
                updateShared((prev) => ({
                  ...prev,
                  bookNotes: { ...prev.bookNotes, [noteKey]: text },
                }))
              }
              onUpdateProgress={(bookId, progress) =>
                updateShared((prev) => ({
                  ...prev,
                  bookProgress: {
                    ...prev.bookProgress,
                    [bookId]: Math.max(prev.bookProgress[bookId] ?? 0, progress),
                  },
                }))
              }
              onCompleteQuiz={completeQuizChapter}
              onBack={() => handleNavigate(lastTab)}
              onOpenCustomize={() => setCustomizeOpen(true)}
              onNavigate={handleNavigate}
            />
          )}

          {childScreen === 'reader-comic' && (
            <ComicReaderScreen
              bookId={activeBookId}
              settings={state.readerSettings}
              bookmarkedBookIds={state.bookmarkedBookIds}
              completedQuizChapters={state.completedQuizChapters}
              onToggleBookmark={(bookId) =>
                updateShared((prev) => {
                  const exists = prev.bookmarkedBookIds.includes(bookId);
                  return {
                    ...prev,
                    bookmarkedBookIds: exists
                      ? prev.bookmarkedBookIds.filter((id) => id !== bookId)
                      : [...prev.bookmarkedBookIds, bookId],
                  };
                })
              }
              onCompleteQuiz={completeQuizChapter}
              onBack={() => handleNavigate(lastTab)}
              onOpenCustomize={() => setCustomizeOpen(true)}
              onNavigate={handleNavigate}
            />
          )}
        </div>

        {showMainShell && (
          <BottomNav
            activeTab={childScreen}
            onSelectTab={(tab) => handleNavigate(tab)}
          />
        )}

        <BookDetailSheet
          book={detailBook}
          progress={detailBook ? state.bookProgress[detailBook.id] ?? 0 : 0}
          isOffline={
            detailBook ? state.offlineBookIds.includes(detailBook.id) : false
          }
          isWishlisted={
            detailBook ? state.wishlistBookIds.includes(detailBook.id) : false
          }
          onToggleOffline={(bookId) =>
            updateShared((prev) => {
              const exists = prev.offlineBookIds.includes(bookId);
              return {
                ...prev,
                offlineBookIds: exists
                  ? prev.offlineBookIds.filter((id) => id !== bookId)
                  : [...prev.offlineBookIds, bookId],
              };
            })
          }
          onToggleWishlist={(bookId) =>
            updateShared((prev) => {
              const exists = prev.wishlistBookIds.includes(bookId);
              return {
                ...prev,
                wishlistBookIds: exists
                  ? prev.wishlistBookIds.filter((id) => id !== bookId)
                  : [...prev.wishlistBookIds, bookId],
              };
            })
          }
          onStartReading={handleStartBook}
          onClose={() => setDetailBook(null)}
        />

        <ReadingCustomizationSheet
          open={customizeOpen}
          settings={state.readerSettings}
          onChange={updateReaderSettings}
          onClose={() => setCustomizeOpen(false)}
        />

        <ParentalPinGateModal
          open={pinGateOpen}
          correctPin={state.parentPin}
          focusLockEnabled={state.focusLockEnabled}
          focusDurationMinutes={state.focusDurationMinutes}
          readingMinutesToday={state.readingMinutesToday}
          onToggleFocusLock={() =>
            updateShared((prev) => ({
              ...prev,
              focusLockEnabled: !prev.focusLockEnabled,
            }))
          }
          onSwitchToParentDevice={() => setLocalDeviceMode('parent')}
          onClose={() => setPinGateOpen(false)}
        />
      </div>
    </div>
  );
}
