'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import AnimatedCard from '@/components/ui/AnimatedCard';
import ProgressBar from '@/components/ui/ProgressBar';
import CloneAvatar from '@/components/ui/CloneAvatar';
import { dailyThemes } from '@/data/mockData';

export default function HomePage() {
  const router = useRouter();
  const { state, actions } = useApp();
  const { user, clone, todaysProgress, currentTheme } = state;

  // Get today's theme (cycling through themes)
  const todayThemeIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % dailyThemes.length;
  const todayTheme = dailyThemes[todayThemeIndex];

  const totalTasks = 3; // Q&A(3) + MiniGame(1) + WorkGeneration = 3 main tasks
  const completedTasks =
    (todaysProgress.qaCompleted > 0 ? 1 : 0) +
    (todaysProgress.minigameCompleted ? 1 : 0) +
    (todaysProgress.workGenerated ? 1 : 0);

  const handleStartDailyQuest = () => {
    router.push('/daily-quest');
  };

  const handleViewMyCollaborations = () => {
    router.push('/my-collaborations');
  };

  const handleStartCollaboration = () => {
    router.push('/collaboration');
  };

  const handleRandomCollaboration = () => {
    router.push('/collaboration?random=true');
  };

  const handleViewRankings = () => {
    router.push('/rankings');
  };

  const handleViewThemeWorks = () => {
    router.push('/theme-works');
  };

  const scrollToCollaboration = () => {
    const collaborationSection = document.getElementById('collaboration-section');
    if (collaborationSection) {
      collaborationSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Mock collaboration partners
  const collaborationPartners = [
    {
      id: 'partner1',
      name: 'ユミコ',
      style: 'ロマンティック',
      compatibility: 92,
      look: { hair: '金髪ボブ', eye: '澄んだ青', mood: 'おっとり', style: 'ボヘミアン' }
    },
    {
      id: 'partner2',
      name: 'タクヤ',
      style: 'クールツッコミ',
      compatibility: 87,
      look: { hair: '黒髪ロング', eye: '鋭い黒', mood: 'クール', style: 'フォーマル' }
    },
    {
      id: 'partner3',
      name: 'アイカ',
      style: 'キュート',
      compatibility: 78,
      look: { hair: 'ピンクツイン', eye: '温かい緑', mood: '元気', style: 'カジュアル' }
    }
  ];

  if (!user || !clone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 to-cyan-100 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hero Section with Clone Motion Movie */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/30 rounded-3xl p-8 shadow-2xl"
        >
          {/* Background Animation */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-32 rounded-full opacity-20"
                style={{
                  background: `radial-gradient(circle, ${
                    ['#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B'][i % 4]
                  } 0%, transparent 70%)`,
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 30}%`
                }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1 space-y-4">
              <motion.h1
                className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                {user.nickname}さんのAicon
              </motion.h1>
              <p className="text-lg text-gray-700">Aiconトレーニングを通じてさらに成長させましょう</p>
              <div className="flex items-center space-x-4">
                <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Lv.{clone?.level || 1}
                </div>
                <div className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                  {clone?.experience || 0} EXP
                </div>
                <div className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                  {clone?.titleBadges.length || 0} バッジ
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Main Clone Avatar with Animation */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <CloneAvatar look={clone?.look || {}} size="xl" showDetails />
              </motion.div>

              {/* Floating particles around clone */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full opacity-60"
                  style={{
                    background: ['#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B', '#10B981', '#F97316'][i],
                    left: `${-20 + Math.cos((i * 60 * Math.PI) / 180) * 80}px`,
                    top: `${-20 + Math.sin((i * 60 * Math.PI) / 180) * 80}px`
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6],
                    rotate: 360
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Clone Status & Recent Works */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Clone Status */}
          <div className="bg-gradient-to-br from-indigo-100/80 to-purple-100/80 backdrop-blur-sm border-2 border-indigo-200/50 rounded-3xl p-6 shadow-lg">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-indigo-800">ショウゴさんのAiconの状態</h3>

              <div className="space-y-4">
                {/* Badges */}
                <div>
                  <h4 className="font-medium text-indigo-700 mb-2">称号・バッジ</h4>
                  <div className="flex flex-wrap gap-2">
                    {clone?.titleBadges.map((badge) => (
                      <motion.span
                        key={badge}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-gradient-to-r from-indigo-200 to-purple-200 text-indigo-800 rounded-full text-sm font-medium shadow-sm"
                      >
                        {badge}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Personality Scores */}
                <div>
                  <h4 className="font-medium text-indigo-700 mb-3">性格スコア</h4>
                  <div className="space-y-3">
                    {clone?.personaSnapshot.scores.slice(0, 3).map((score) => (
                      <div key={score.tag} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-indigo-700 font-medium">{score.tag}</span>
                          <span className="text-xs text-indigo-600 font-medium">{score.value}</span>
                        </div>
                        <div className="w-full h-2 bg-indigo-200/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(0, (score.value + 100) / 2)}%` }}
                            transition={{
                              duration: 1,
                              delay: 0.5 + clone?.personaSnapshot.scores.indexOf(score) * 0.1
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Works */}
          <div className="bg-gradient-to-br from-emerald-100/80 to-teal-100/80 backdrop-blur-sm border-2 border-emerald-200/50 rounded-3xl p-6 shadow-lg">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-emerald-800">最近のわたしのコラボ</h3>
                <Button
                  onClick={handleViewMyCollaborations}
                  variant="outline"
                  size="sm"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  すべて見る
                </Button>
              </div>

              {state.works.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="text-4xl">🎨</div>
                  <p className="text-emerald-700">まだコラボ作品がありません</p>
                  <p className="text-sm text-emerald-600">
                    Aiconトレーニングを完了して最初のコラボレーションを始めましょう！
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {state.works.slice(0, 2).map((work, index) => (
                    <motion.div
                      key={work.workId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                      onClick={handleViewMyCollaborations}
                    >
                      <div className="text-2xl">{work.theme === '漫才' ? '🎭' : '🎵'}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-emerald-800 line-clamp-1">{work.ogMeta.title}</h4>
                        <div className="flex items-center space-x-3 text-xs text-emerald-600">
                          <span>👀 {work.stats.plays}</span>
                          <span>❤️ {work.stats.likes}</span>
                          <span>💬 {work.stats.comments}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Daily Progress */}
        <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 backdrop-blur-sm border-2 border-blue-200/50 rounded-3xl p-6 shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-blue-800">Aiconトレーニング進捗</h3>
              <span className="px-3 py-1 bg-blue-200/50 text-blue-700 rounded-full text-sm font-medium">
                {completedTasks}/{totalTasks} 完了
              </span>
            </div>

            <ProgressBar current={completedTasks} total={totalTasks} color="primary" showLabel={false} />

            {completedTasks === totalTasks && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-2xl"
              >
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-green-700 font-semibold text-lg">今日のタスク完了！おつかれさま！</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Daily Quest Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-indigo-100/90 to-purple-100/90 backdrop-blur-sm border-2 border-indigo-200/50 rounded-3xl p-8 shadow-lg cursor-pointer hover:shadow-xl transition-all"
          onClick={handleStartDailyQuest}
        >
          <div className="text-center space-y-6">
            <motion.div
              className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-5xl shadow-lg bg-gradient-to-r from-indigo-200 to-purple-200"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              📋
            </motion.div>

            <div>
              <h3 className="text-2xl font-bold text-indigo-800 mb-3">Aiconトレーニング</h3>
              <p className="text-indigo-700 text-lg mb-4">Q&A・ミニゲームでAiconを成長させよう</p>

              {/* <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`p-3 rounded-2xl border-2 ${
                  todaysProgress.qaCompleted >= 3 
                    ? 'bg-green-100/80 border-green-200/50' 
                    : 'bg-amber-100/80 border-amber-200/50'
                }`}>
                  <div className="text-2xl mb-1">
                    {todaysProgress.qaCompleted >= 3 ? '✅' : '❓'}
                  </div>
                  <div className="text-sm font-medium">
                    Q&A {todaysProgress.qaCompleted}/3
                  </div>
                </div>
                
                <div className={`p-3 rounded-2xl border-2 ${
                  todaysProgress.minigameCompleted 
                    ? 'bg-green-100/80 border-green-200/50' 
                    : 'bg-pink-100/80 border-pink-200/50'
                }`}>
                  <div className="text-2xl mb-1">
                    {todaysProgress.minigameCompleted ? '✅' : '🎮'}
                  </div>
                  <div className="text-sm font-medium">
                    ミニゲーム {todaysProgress.minigameCompleted ? '完了' : '未完了'}
                  </div>
                </div>
              </div> */}

              <div className="text-indigo-700 font-medium">クエストを選択してプレイする →</div>
            </div>
          </div>
        </motion.div>

        {/* みんなのコラボ Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-emerald-100/90 to-teal-100/90 backdrop-blur-sm border-2 border-emerald-200/50 rounded-3xl p-8 shadow-lg"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">🏆</div>
                <div>
                  <h3 className="text-2xl font-bold text-emerald-800">みんなのコラボ</h3>
                  <p className="text-emerald-700">人気の作品とランキング</p>
                </div>
              </div>
              <Button
                onClick={handleViewThemeWorks}
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                すべて見る
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/50 rounded-2xl border border-emerald-200/50">
                <div className="text-2xl font-bold text-emerald-600 mb-1">128</div>
                <div className="text-sm text-emerald-700">今日の作品</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-2xl border border-emerald-200/50">
                <div className="text-2xl font-bold text-teal-600 mb-1">1.2k</div>
                <div className="text-sm text-teal-700">いいね数</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-2xl border border-emerald-200/50">
                <div className="text-2xl font-bold text-cyan-600 mb-1">45</div>
                <div className="text-sm text-cyan-700">アクティブユーザー</div>
              </div>
            </div>

            {/* Featured Collaborations */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-emerald-800">今日の人気作品</h4>
              <div className="space-y-2">
                <motion.div
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-2xl cursor-pointer hover:shadow-md transition-all"
                  onClick={handleViewRankings}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="text-2xl">🎭</div>
                  <div className="flex-1">
                    <div className="font-medium text-emerald-800">「恋のドキドキ大作戦」</div>
                    <div className="text-sm text-emerald-600">ユミコ × タクヤ</div>
                  </div>
                  <div className="text-sm text-emerald-700">❤️ 89</div>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-2xl cursor-pointer hover:shadow-md transition-all"
                  onClick={handleViewRankings}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="text-2xl">🎵</div>
                  <div className="flex-1">
                    <div className="font-medium text-emerald-800">「星降る夜のセレナーデ」</div>
                    <div className="text-sm text-emerald-600">アイカ × リョウ</div>
                  </div>
                  <div className="text-sm text-emerald-700">❤️ 76</div>
                </motion.div>
              </div>

              <motion.button
                onClick={handleViewRankings}
                className="w-full p-4 text-emerald-700 font-medium border-2 border-dashed border-emerald-300 rounded-2xl hover:bg-emerald-50 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                ランキングをもっと見る →
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Today's Theme */}
        <div className="bg-gradient-to-r from-amber-100/80 to-orange-100/80 backdrop-blur-sm border-2 border-amber-200/50 rounded-3xl p-6 shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-4 cursor-pointer"
            onClick={scrollToCollaboration}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-200/50 text-amber-800 rounded-full font-medium shadow-sm">
              <span>🎯</span>
              <span>今日の創作活動テーマ</span>
              <span className="text-xs">（クリックでコラボセクションへ）</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
              {todayTheme.title}
            </h2>
            <p className="text-amber-700 text-lg">{todayTheme.subtitle}</p>
            <div className="text-sm text-amber-600 font-medium">→ コラボレーションセクションへ移動</div>
          </motion.div>
        </div>

        {/* AI Clone Collaboration Section */}
        <div
          id="collaboration-section"
          className="bg-gradient-to-br from-cyan-100/90 to-blue-100/90 backdrop-blur-sm border-2 border-cyan-200/50 rounded-3xl p-8 shadow-lg"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">🤝</div>
              <h3 className="text-2xl font-bold text-cyan-800">Aicon同士のコラボレーション</h3>
              <p className="text-cyan-700">他のAiconと一緒に{todayTheme.theme}作品を創作しましょう</p>
            </div>

            {/* Collaboration Button */}
            <div className="text-center">
              <Button
                onClick={handleStartCollaboration}
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-xl px-12 py-4"
                disabled={todaysProgress.qaCompleted === 0 && !todaysProgress.minigameCompleted}
              >
                コラボレーションを始める 🎆
              </Button>
            </div>

            {todaysProgress.qaCompleted === 0 && !todaysProgress.minigameCompleted && (
              <div className="p-4 bg-yellow-100/80 border border-yellow-200 rounded-2xl">
                <p className="text-yellow-700 text-sm text-center">
                  💡 Q&Aかミニゲームを完了するとコラボレーションが可能になります
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
