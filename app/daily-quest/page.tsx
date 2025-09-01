'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

type QuestType = 'qa' | 'minigame';

interface DailyQuest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  reward: {
    badge?: string;
    points: number;
  };
  completed: boolean;
  progress: number;
}

export default function DailyQuestPage() {
  const router = useRouter();
  const { state } = useApp();

  // Get current progress from AppContext
  const qaCompleted = state.todaysProgress.qaCompleted >= 3;
  const minigameCompleted = state.todaysProgress.minigameCompleted;

  // Daily quests data with real progress
  const dailyQuests: DailyQuest[] = [
    {
      id: 'qa_daily',
      type: 'qa',
      title: 'デイリーQ&A',
      description: '3つの質問に答えてAiconの個性を育てよう',
      reward: {
        badge: 'Q&Aマスター',
        points: 2
      },
      completed: qaCompleted,
      progress: (state.todaysProgress.qaCompleted / 3) * 100
    },
    {
      id: 'minigame_daily',
      type: 'minigame',
      title: 'デイリーミニゲーム',
      description: '楽しいミニゲームでAiconと一緒に成長しよう',
      reward: {
        badge: 'ゲーマー',
        points: 3
      },
      completed: minigameCompleted,
      progress: minigameCompleted ? 100 : 0
    }
  ];

  const handleQuestSelect = (quest: DailyQuest) => {
    if (quest.completed) return;

    // Redirect to specific quest type with points reward info
    if (quest.type === 'qa') {
      router.push(`/qa?points=${quest.reward.points}`);
    } else {
      router.push(`/minigame?points=${quest.reward.points}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="text-5xl mb-4">📋⭐</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Aiconトレーニング
          </h1>
          <p className="text-lg text-gray-700">毎日の挑戦でAiconを成長させよう</p>
        </motion.div>

        {/* Quest Selection Phase */}
        {
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-100/80 to-purple-100/80 backdrop-blur-sm border-2 border-indigo-200/50 rounded-3xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">今日のクエストを選択してください</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {dailyQuests.map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    className={`cursor-pointer bg-gradient-to-br border-2 rounded-2xl p-6 transition-all ${
                      quest.completed
                        ? 'from-green-100/80 to-emerald-100/80 border-green-200/50 opacity-75'
                        : quest.type === 'qa'
                        ? 'from-amber-100/80 to-yellow-100/80 border-amber-200/50 hover:shadow-lg'
                        : 'from-pink-100/80 to-rose-100/80 border-pink-200/50 hover:shadow-lg'
                    }`}
                    whileHover={!quest.completed ? { scale: 1.02 } : {}}
                    whileTap={!quest.completed ? { scale: 0.98 } : {}}
                    onClick={() => handleQuestSelect(quest)}
                  >
                    <div className="text-center space-y-4">
                      <div className="text-4xl">{quest.completed ? '✅' : quest.type === 'qa' ? '❓' : '🎮'}</div>

                      <h3
                        className={`text-xl font-bold ${
                          quest.completed ? 'text-green-800' : quest.type === 'qa' ? 'text-amber-800' : 'text-pink-800'
                        }`}
                      >
                        {quest.title}
                      </h3>

                      <p
                        className={`text-sm ${
                          quest.completed ? 'text-green-700' : quest.type === 'qa' ? 'text-amber-700' : 'text-pink-700'
                        }`}
                      >
                        {quest.description}
                      </p>

                      <div className="space-y-3">
                        <div
                          className={`text-sm font-medium ${
                            quest.completed
                              ? 'text-green-600'
                              : quest.type === 'qa'
                              ? 'text-amber-600'
                              : 'text-pink-600'
                          }`}
                        >
                          報酬: ポイント +{quest.reward.points}
                          {quest.reward.badge && ` / ${quest.reward.badge}`}
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span
                              className={
                                quest.completed
                                  ? 'text-green-600'
                                  : quest.type === 'qa'
                                  ? 'text-amber-600'
                                  : 'text-pink-600'
                              }
                            >
                              {quest.type === 'qa'
                                ? `${state.todaysProgress.qaCompleted}/3 質問完了`
                                : quest.completed
                                ? '完了'
                                : '未完了'}
                            </span>
                            <span
                              className={
                                quest.completed
                                  ? 'text-green-600'
                                  : quest.type === 'qa'
                                  ? 'text-amber-600'
                                  : 'text-pink-600'
                              }
                            >
                              {Math.round(quest.progress)}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                quest.completed
                                  ? 'bg-gradient-to-r from-green-400 to-green-500'
                                  : quest.type === 'qa'
                                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400'
                                  : 'bg-gradient-to-r from-pink-400 to-rose-400'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${quest.progress}%` }}
                              transition={{ duration: 0.8, delay: index * 0.2 }}
                            />
                          </div>
                        </div>

                        {quest.completed && <div className="text-green-600 font-medium text-sm">✓ 完了済み</div>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <p className="text-sm text-gray-600">クエストは毎日リセットされます</p>
              </div>
            </div>
          </motion.div>
        }
      </div>
    </div>
  );
}
