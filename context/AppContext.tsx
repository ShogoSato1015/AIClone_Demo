"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, Theme, PersonaTag, QAAnswer, MiniGameLog } from '@/types';
import { mockUser, mockPersona, mockClone, mockWorks } from '@/data/mockData';

// Initial State
const initialState: AppState = {
  user: mockUser,
  persona: mockPersona,
  clone: mockClone,
  currentTheme: "漫才",
  todaysProgress: {
    qaCompleted: 0,
    minigameCompleted: false,
    workGenerated: false,
  },
  works: mockWorks,
  isLoading: false,
};

// Action Types
type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'UPDATE_PERSONA'; payload: { tag: PersonaTag; delta: number } }
  | { type: 'COMPLETE_QA'; payload: QAAnswer[] }
  | { type: 'COMPLETE_MINIGAME'; payload: MiniGameLog }
  | { type: 'GENERATE_WORK'; payload: any }
  | { type: 'UPDATE_CLONE_APPEARANCE'; payload: Partial<any> }
  | { type: 'ADD_EXPERIENCE'; payload: number }
  | { type: 'AWARD_BADGE'; payload: string }
  | { type: 'LIKE_WORK'; payload: string }
  | { type: 'RESET_DAILY_PROGRESS' };

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_THEME':
      return { ...state, currentTheme: action.payload };

    case 'UPDATE_PERSONA':
      if (!state.persona) return state;
      return {
        ...state,
        persona: {
          ...state.persona,
          scores: state.persona.scores.map(score => 
            score.tag === action.payload.tag 
              ? { ...score, value: Math.max(-100, Math.min(100, score.value + action.payload.delta)) }
              : score
          ),
          lastUpdated: new Date().toISOString()
        }
      };

    case 'COMPLETE_QA':
      return {
        ...state,
        todaysProgress: {
          ...state.todaysProgress,
          qaCompleted: action.payload.length
        }
      };

    case 'COMPLETE_MINIGAME':
      return {
        ...state,
        todaysProgress: {
          ...state.todaysProgress,
          minigameCompleted: true
        }
      };

    case 'GENERATE_WORK':
      return {
        ...state,
        works: [action.payload, ...state.works],
        todaysProgress: {
          ...state.todaysProgress,
          workGenerated: true
        }
      };

    case 'UPDATE_CLONE_APPEARANCE':
      if (!state.clone) return state;
      return {
        ...state,
        clone: {
          ...state.clone,
          look: { ...state.clone.look, ...action.payload },
          lastUpdated: new Date().toISOString()
        }
      };

    case 'ADD_EXPERIENCE':
      if (!state.clone) return state;
      const newExp = state.clone.experience + action.payload;
      const newLevel = Math.floor(newExp / 1000) + 1;
      return {
        ...state,
        clone: {
          ...state.clone,
          experience: newExp,
          level: Math.max(state.clone.level, newLevel)
        }
      };

    case 'AWARD_BADGE':
      if (!state.clone) return state;
      if (state.clone.titleBadges.includes(action.payload)) return state;
      return {
        ...state,
        clone: {
          ...state.clone,
          titleBadges: [...state.clone.titleBadges, action.payload]
        }
      };

    case 'LIKE_WORK':
      return {
        ...state,
        works: state.works.map(work => 
          work.workId === action.payload
            ? { ...work, stats: { ...work.stats, likes: work.stats.likes + 1 } }
            : work
        )
      };

    case 'RESET_DAILY_PROGRESS':
      return {
        ...state,
        todaysProgress: {
          qaCompleted: 0,
          minigameCompleted: false,
          workGenerated: false,
        }
      };

    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    setLoading: (loading: boolean) => void;
    setTheme: (theme: Theme) => void;
    updatePersona: (tag: PersonaTag, delta: number) => void;
    completeQA: (answers: QAAnswer[]) => void;
    completeMinigame: (log: MiniGameLog) => void;
    generateWork: (work: any) => void;
    updateCloneAppearance: (changes: any) => void;
    addExperience: (exp: number) => void;
    awardBadge: (badge: string) => void;
    likeWork: (workId: string) => void;
    resetDailyProgress: () => void;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setTheme: (theme: Theme) => dispatch({ type: 'SET_THEME', payload: theme }),
    updatePersona: (tag: PersonaTag, delta: number) => dispatch({ type: 'UPDATE_PERSONA', payload: { tag, delta } }),
    completeQA: (answers: QAAnswer[]) => dispatch({ type: 'COMPLETE_QA', payload: answers }),
    completeMinigame: (log: MiniGameLog) => dispatch({ type: 'COMPLETE_MINIGAME', payload: log }),
    generateWork: (work: any) => dispatch({ type: 'GENERATE_WORK', payload: work }),
    updateCloneAppearance: (changes: any) => dispatch({ type: 'UPDATE_CLONE_APPEARANCE', payload: changes }),
    addExperience: (exp: number) => dispatch({ type: 'ADD_EXPERIENCE', payload: exp }),
    awardBadge: (badge: string) => dispatch({ type: 'AWARD_BADGE', payload: badge }),
    likeWork: (workId: string) => dispatch({ type: 'LIKE_WORK', payload: workId }),
    resetDailyProgress: () => dispatch({ type: 'RESET_DAILY_PROGRESS' }),
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}