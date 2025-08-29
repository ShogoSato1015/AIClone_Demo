// Core Types
export type PersonaTag = "共感" | "論理" | "冒険" | "保守" | "ユーモア" | "ロマン";
export type Theme = "漫才" | "ラブソング";
export type GameType = "drama" | "rhythm";

// User and Persona Types
export interface Score {
  tag: PersonaTag;
  value: number; // -100..100
}

export interface PersonaVector {
  userId: string;
  scores: Score[];
  lastUpdated: string; // ISO string
}

export interface User {
  userId: string;
  nickname: string;
  anonymityLevel: "high" | "medium" | "low";
  createdAt: string;
  lastActive: string;
}

// Q&A and Game Types
export interface QAQuestion {
  id: string;
  theme: Theme;
  label: string;
  choices: string[];
  type: "choice" | "text";
}

export interface QAAnswer {
  questionId: string;
  type: "choice" | "text";
  payload: string;
  timestamp: string;
}

export interface MiniGameStep {
  step: number;
  choice: string;
  rtMs?: number; // reaction time
}

export interface MiniGameLog {
  gameId: string;
  gameType: GameType;
  decisions: MiniGameStep[];
  timestamp: string;
}

// Clone and Appearance Types
export interface CloneLook {
  hair?: string;
  eye?: string;
  acc?: string;
  mood?: string;
  style?: string;
}

export interface CloneProfile {
  cloneId: string;
  ownerId: string;
  personaSnapshot: PersonaVector;
  look: CloneLook;
  titleBadges: string[];
  level: number;
  experience: number;
  createdAt: string;
  lastUpdated: string;
}

// Pairing and Work Types
export interface Pairing {
  pairingId: string;
  theme: Theme;
  cloneA: string;
  cloneB: string;
  strategy: "近傍" | "対照";
  reason: string;
  compatibility: number; // 0-100
  createdAt: string;
}

export interface WorkScript {
  tsukami: string;
  tenkai: string;
  ochi: string;
}

export interface WorkLyrics {
  aMelody: string[];
  chorus: string[];
}

export interface Work {
  workId: string;
  theme: Theme;
  pairingId: string;
  script?: WorkScript;
  lyrics?: WorkLyrics;
  mediaUrl?: string; // TTS/Music generated
  ogMeta: {
    title: string;
    desc: string;
    image: string;
  };
  stats: {
    plays: number;
    likes: number;
    comments: number;
    shares: number;
  };
  createdAt: string;
}

// Reaction Types
export interface Reaction {
  reactionId: string;
  workId: string;
  userId: string;
  kind: "like" | "comment" | "share";
  payload?: string; // comment text for comments
  timestamp: string;
}

// Event Tracking Types
export type EventType = 
  | "qa_answered" 
  | "minigame_finished" 
  | "persona_updated" 
  | "paired" 
  | "work_generated" 
  | "work_played" 
  | "work_liked" 
  | "work_commented" 
  | "work_shared" 
  | "diary_opened" 
  | "push_opened";

export interface AnalyticsEvent {
  eventId: string;
  userId: string;
  eventType: EventType;
  payload?: Record<string, any>;
  timestamp: string;
}

// App State Types
export interface AppState {
  user: User | null;
  persona: PersonaVector | null;
  clone: CloneProfile | null;
  currentTheme: Theme;
  todaysProgress: {
    qaCompleted: number;
    minigameCompleted: boolean;
    workGenerated: boolean;
  };
  works: Work[];
  isLoading: boolean;
}

// UI Component Types
export interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

export interface ProgressBarProps {
  current: number;
  total: number;
  color?: "primary" | "secondary" | "accent";
}

export interface CloneAvatarProps {
  look: CloneLook;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}