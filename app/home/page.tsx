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

  const handleStartQA = () => {
    router.push('/qa');
  };

  const handleStartMiniGame = () => {
    router.push('/minigame');
  };

  const handleViewWorks = () => {
    router.push('/works');
  };

  const handleStartCollaboration = () => {
    router.push('/collaboration');
  };

  const handleRandomCollaboration = () => {
    router.push('/collaboration?random=true');
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
                {user.nickname}さんのAIクローン
              </motion.h1>
              <p className="text-lg text-gray-700">デイリークエストを通じてさらに成長させましょう</p>
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

        {/* Today's Theme */}
        <div className="bg-gradient-to-r from-amber-100/80 to-orange-100/80 backdrop-blur-sm border-2 border-amber-200/50 rounded-3xl p-6 shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-4 cursor-pointer"
            onClick={() => router.push(`/theme-works?theme=${todayTheme.theme}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-200/50 text-amber-800 rounded-full font-medium shadow-sm">
              <span>🎯</span>
              <span>今日の創作活動テーマ</span>
              <span className="text-xs">（クリックで作品を見る）</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
              {todayTheme.title}
            </h2>
            <p className="text-amber-700 text-lg">{todayTheme.subtitle}</p>
            <div className="text-sm text-amber-600 font-medium">→ このテーマのコラボ作品を見る</div>
          </motion.div>
        </div>

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
              <h3 className="text-xl font-semibold text-indigo-800">クローンの状態</h3>

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
                <h3 className="text-xl font-semibold text-emerald-800">最近の作品</h3>
                <Button
                  onClick={handleViewWorks}
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
                  <p className="text-emerald-700">まだ作品がありません</p>
                  <p className="text-sm text-emerald-600">Q&Aやゲームで学習させて最初の作品を作りましょう！</p>
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
                      onClick={handleViewWorks}
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-blue-800">デイリークエスト進捗</h3>
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

        {/* Tasks Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Q&A Task */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-br from-rose-100/90 to-pink-100/90 backdrop-blur-sm border-2 border-rose-200/50 rounded-3xl p-6 shadow-lg transition-all ${
              todaysProgress.qaCompleted >= 3 ? 'opacity-60' : 'cursor-pointer hover:shadow-xl'
            }`}
            onClick={todaysProgress.qaCompleted >= 3 ? undefined : handleStartQA}
          >
            <div className="flex items-start space-x-4">
              <motion.div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
                  todaysProgress.qaCompleted >= 3 ? 'bg-green-200' : 'bg-rose-200'
                }`}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {todaysProgress.qaCompleted >= 3 ? '✅' : '❓'}
              </motion.div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-rose-800 mb-2">
                  デイリークエスト①
                  <br />
                  Q&A セッション
                </h3>
                <p className="text-rose-700 mb-3 text-sm">
                  {todayTheme.theme}テーマの質問に答えてクローンを学習させよう
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-rose-600">{todaysProgress.qaCompleted}/3 完了</span>
                  {todaysProgress.qaCompleted >= 3 ? (
                    <span className="text-sm text-green-600 font-medium">完了済み</span>
                  ) : (
                    <span className="text-sm text-rose-700 font-medium">開始する →</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mini Game Task */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-br from-violet-100/90 to-purple-100/90 backdrop-blur-sm border-2 border-violet-200/50 rounded-3xl p-6 shadow-lg transition-all ${
              todaysProgress.minigameCompleted ? 'opacity-60' : 'cursor-pointer hover:shadow-xl'
            }`}
            onClick={todaysProgress.minigameCompleted ? undefined : handleStartMiniGame}
          >
            <div className="flex items-start space-x-4">
              <motion.div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
                  todaysProgress.minigameCompleted ? 'bg-green-200' : 'bg-violet-200'
                }`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {todaysProgress.minigameCompleted ? '✅' : '🎮'}
              </motion.div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-violet-800 mb-2">
                  デイリークエスト②
                  <br />
                  ミニゲーム
                </h3>
                <p className="text-violet-700 mb-3 text-sm">楽しく遊びながらクローンの性格を育てよう</p>
                <div className="flex items-center justify-between">
                  {todaysProgress.minigameCompleted ? (
                    <span className="text-sm text-green-600 font-medium">完了済み</span>
                  ) : (
                    <span className="text-sm text-violet-700 font-medium">プレイする →</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Clone Collaboration Section */}
        <div className="bg-gradient-to-br from-cyan-100/90 to-blue-100/90 backdrop-blur-sm border-2 border-cyan-200/50 rounded-3xl p-8 shadow-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">🤝</div>
              <h3 className="text-2xl font-bold text-cyan-800">AIクローン同士のコラボレーション</h3>
              <p className="text-cyan-700">他のクローンと一緒に{todayTheme.theme}作品を創作しましょう</p>
            </div>

            {/* Collaboration Partners */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-cyan-800">おすすめコラボパートナー</h4>
              <div className="grid gap-3">
                {collaborationPartners.map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200/50 rounded-2xl cursor-pointer hover:shadow-md transition-all"
                    onClick={handleStartCollaboration}
                  >
                    <CloneAvatar look={partner.look || {}} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-semibold text-cyan-800">{partner.name}</h5>
                        <span className="px-2 py-1 bg-cyan-200/50 text-cyan-700 rounded-full text-xs">
                          {partner.style}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-cyan-600">相性度:</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-16 h-1.5 bg-cyan-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                              style={{ width: `${partner.compatibility}%` }}
                            />
                          </div>
                          <span className="text-xs text-cyan-700 font-medium">{partner.compatibility}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-cyan-600">→</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleStartCollaboration}
                variant="primary"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                disabled={todaysProgress.qaCompleted === 0 && !todaysProgress.minigameCompleted}
              >
                創作活動を始める 🎨
              </Button>

              <Button
                onClick={handleRandomCollaboration}
                variant="outline"
                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50"
                disabled={todaysProgress.qaCompleted === 0 && !todaysProgress.minigameCompleted}
              >
                ランダム選択 🎲
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
