export type TabId = 'beranda' | 'jelajah' | 'pustaka' | 'peringkat' | 'profil';

export type DeviceMode = 'child' | 'parent';

export type ScreenId =
  | TabId
  | 'reader-text'
  | 'reader-comic'
  | 'parent-dashboard';

export type FontStyleOption = 'modern' | 'klasik' | 'ramah';
export type PaperThemeOption = 'terang' | 'sepia' | 'gelap';
export type LineSpacingOption = 'rapat' | 'ideal' | 'renggang';

export interface ReaderSettings {
  fontSizeStep: number; // 0..4 => 12, 14, 16, 18, 20
  fontStyle: FontStyleOption;
  paperTheme: PaperThemeOption;
  lineSpacing: LineSpacingOption;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChapterContent {
  chapterNumber: number;
  partLabel: string;
  title: string;
  duration: string;
  banner: string;
  paragraphs: string[];
  quote: string;
  defaultNote: string;
  newVocab: string[];
  quiz: QuizQuestion[];
}

export interface ComicPageContent {
  pageNumber: number;
  title: string;
  timeRemaining: string;
  image: string;
  caption?: string;
}

export interface BookItem {
  id: string;
  title: string;
  fullTitle: string;
  author: string;
  cover: string;
  badge?: string;
  badgeColor?: string;
  rating: string;
  xpValue: number;
  xp: string;
  duration: string;
  pagesCount: string;
  category: string;
  worldId: string;
  ageGroup: string;
  synopsis: string;
  readerType: 'text' | 'comic';
  chapters?: ChapterContent[];
  comicPages?: ComicPageContent[];
}

export interface StudioItem {
  id: string;
  slot: 'kostum' | 'topi' | 'efek';
  name: string;
  bonus: string;
  bonusColor: string;
  rarity: 'Biasa' | 'Langka' | 'Legendaris' | 'Mitos';
  image?: string;
  iconName?: 'crown' | 'glasses' | 'hat' | 'sparkles' | 'zap' | 'shield';
  unlockLevel?: number;
}

export interface ApprovalRequest {
  id: string;
  type: 'plus_subscription' | 'coin_pack';
  title: string;
  description: string;
  priceLabel: string;
  priceAmount: number;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface EncouragementCard {
  id: string;
  message: string;
  sender: string;
  sentAt: string;
  read: boolean;
}

export interface ReadventureState {
  deviceMode: DeviceMode;
  activeChildId: 'arka' | 'dira';
  xpCurrent: number;
  xpTarget: number;
  level: number;
  totalXpNumber: number;
  coins: number;
  chestTickets: number;
  streakDays: number;
  readingMinutesToday: number;
  isPlusActive: boolean;
  plusPlanLabel: string | null;
  claimedDailyMission: boolean;
  claimedWeeklyMission: boolean;
  quizzesCompletedToday: number;
  completedQuizChapters: string[];
  unlockedStudioIds: string[];
  equippedStudio: {
    kostum: string;
    topi: string | null;
    efek: string | null;
  };
  activeThemeId: 'rimba' | 'samudra' | 'nebula';
  offlineBookIds: string[];
  wishlistBookIds: string[];
  bookmarkedBookIds: string[];
  bookNotes: Record<string, string>;
  bookReviews: Record<string, { text: string; rating: number }>;
  bookProgress: Record<string, number>;
  completedBookIds: string[];
  learnedVocab: string[];
  parentPin: string;
  focusLockEnabled: boolean;
  focusDurationMinutes: number;
  purchaseApprovalRequired: boolean;
  gentleReminderEnabled: boolean;
  pendingRequests: ApprovalRequest[];
  encouragementCards: EncouragementCard[];
  readerSettings: ReaderSettings;
}
