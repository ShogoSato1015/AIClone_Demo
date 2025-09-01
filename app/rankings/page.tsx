"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import CloneAvatar from "@/components/ui/CloneAvatar";

// Mock ranking data
const mockRankingWorks = [
  {
    workId: 'collab_001',
    title: '心のGPS事件 - Aiconコラボ漫才',
    theme: '漫才',
    cloneA: { id: 'user_001', name: 'ショウタ', look: { hair: '黒髪ショート', eye: '鋭い黒', acc: 'サングラス', mood: 'クール', style: 'フォーマル' } },
    cloneB: { id: 'user_002', name: 'ミユ', look: { hair: '茶色ロング', eye: '優しい茶色', acc: '丸メガネ', mood: 'にっこり', style: 'カジュアル' } },
    stats: { views: 15420, likes: 2156, comments: 89, shares: 445 },
    createdAt: '2024-01-15T14:30:00Z',
    isUserCollab: true,
    settings: { commentsEnabled: true, isPublic: true }
  },
  {
    workId: 'collab_002',
    title: '星降る夜の約束 - Aiconデュエット',
    theme: 'ラブソング',
    cloneA: { id: 'user_003', name: 'リン', look: { hair: 'ピンクツイン', eye: '澄んだ青', acc: 'イヤリング', mood: 'おっとり', style: 'ボヘミアン' } },
    cloneB: { id: 'user_004', name: 'ケンタ', look: { hair: 'シルバーカール', eye: '温かい緑', acc: 'ネックレス', mood: '元気', style: 'スポーティ' } },
    stats: { views: 25890, likes: 4231, comments: 156, shares: 892 },
    createdAt: '2024-01-14T19:45:00Z',
    isUserCollab: false,
    settings: { commentsEnabled: true, isPublic: true }
  },
  {
    workId: 'collab_003',
    title: 'AI時代の生き方 - Aicon漫才',
    theme: '漫才',
    cloneA: { id: 'user_005', name: 'タカシ', look: { hair: '金髪ボブ', eye: '神秘的な紫', acc: '帽子', mood: 'いたずらっ子', style: 'ゴシック' } },
    cloneB: { id: 'user_006', name: 'アユミ', look: { hair: '黒髪ロング', eye: '優しい茶色', acc: '丸メガネ', mood: 'にっこり', style: 'カジュアル' } },
    stats: { views: 12890, likes: 1876, comments: 67, shares: 234 },
    createdAt: '2024-01-13T11:20:00Z',
    isUserCollab: false,
    settings: { commentsEnabled: true, isPublic: true }
  },
  {
    workId: 'collab_004',
    title: '恋のマジック - Aiconデュエット',
    theme: 'ラブソング',
    cloneA: { id: 'user_001', name: 'あなた', look: { hair: '黒髪ショート', eye: '優しい黒', acc: 'なし', mood: '笑顔', style: 'カジュアル' } },
    cloneB: { id: 'user_007', name: 'サクラ', look: { hair: 'ピンクロング', eye: '温かい緑', acc: '花飾り', mood: 'うっとり', style: 'ボヘミアン' } },
    stats: { views: 8450, likes: 1234, comments: 45, shares: 178 },
    createdAt: '2024-01-12T16:00:00Z',
    isUserCollab: true,
    settings: { commentsEnabled: true, isPublic: true }
  },
  {
    workId: 'collab_005',
    title: '未来への扉 - Aicon漫才',
    theme: '漫才',
    cloneA: { id: 'user_008', name: 'ヒロキ', look: { hair: '茶色ショート', eye: '鋭い灰色', acc: 'イヤリング', mood: 'クール', style: 'モード' } },
    cloneB: { id: 'user_009', name: 'ナオ', look: { hair: '金髪ボブ', eye: '澄んだ青', acc: 'サングラス', mood: '元気', style: 'ストリート' } },
    stats: { views: 18750, likes: 2890, comments: 123, shares: 567 },
    createdAt: '2024-01-11T13:45:00Z',
    isUserCollab: false,
    settings: { commentsEnabled: true, isPublic: true }
  }
];

type SortType = "views" | "likes" | "recent" | "comments";
type ThemeFilter = "all" | "漫才" | "ラブソング";

export default function RankingsPage() {
  const router = useRouter();
  const { state } = useApp();
  const [sortBy, setSortBy] = useState<SortType>("views");
  const [themeFilter, setThemeFilter] = useState<ThemeFilter>("all");
  const [selectedWork, setSelectedWork] = useState<typeof mockRankingWorks[0] | null>(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<{[workId: string]: any[]}>({});

  // Sort and filter works
  const filteredWorks = mockRankingWorks
    .filter(work => themeFilter === "all" || work.theme === themeFilter)
    .filter(work => work.settings.isPublic)
    .sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.stats.views - a.stats.views;
        case "likes":
          return b.stats.likes - a.stats.likes;
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "comments":
          return b.stats.comments - a.stats.comments;
        default:
          return 0;
      }
    });

  const handleLike = (workId: string) => {
    const work = mockRankingWorks.find(w => w.workId === workId);
    if (work) {
      work.stats.likes += 1;
    }
  };

  const handleComment = (workId: string) => {
    if (!newComment.trim()) return;
    
    const newCommentObj = {
      id: Date.now(),
      author: state.user?.nickname || 'あなた',
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    setComments(prev => ({
      ...prev,
      [workId]: [...(prev[workId] || []), newCommentObj]
    }));
    setNewComment("");
  };

  const getRankNumber = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}位`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-100 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold gradient-text">
            みんなのコラボ 🏆
          </h1>
          <p className="text-gray-600 text-lg">
            人気のコラボ作品をチェックして、コメントやリアクションしよう
          </p>
        </motion.div>

        {/* All Collaboration Works Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <Button
            onClick={() => router.push('/theme-works')}
            variant="primary"
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 text-lg shadow-lg"
          >
            <span className="flex items-center space-x-2">
              <span>🎨</span>
              <span>全てのコラボ作品を見る</span>
            </span>
          </Button>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="bg-gradient-to-br from-purple-100/90 to-blue-100/90 backdrop-blur-sm border-2 border-purple-200/50 rounded-3xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">{filteredWorks.length}</div>
              <div className="text-sm text-purple-700 font-medium">公開作品数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {filteredWorks.reduce((sum, work) => sum + work.stats.views, 0)}
              </div>
              <div className="text-sm text-blue-700 font-medium">総視聴数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {filteredWorks.filter(w => w.isUserCollab).length}
              </div>
              <div className="text-sm text-green-700 font-medium">あなたの作品</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600">
                {filteredWorks.reduce((sum, work) => sum + work.stats.likes, 0)}
              </div>
              <div className="text-sm text-pink-700 font-medium">総いいね数</div>
            </div>
          </div>
        </motion.div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 gap-4">
          {/* Theme Filter */}
          <div className="flex space-x-2">
            <span className="text-sm text-gray-600 py-2">テーマ:</span>
            {(["all", "漫才", "ラブソング"] as ThemeFilter[]).map(theme => (
              <Button
                key={theme}
                onClick={() => setThemeFilter(theme)}
                variant={themeFilter === theme ? "primary" : "outline"}
                size="sm"
              >
                {theme === "all" ? "すべて" : theme}
              </Button>
            ))}
          </div>
          
          {/* Sort Controls */}
          <div className="flex space-x-2">
            <span className="text-sm text-gray-600 py-2">並び順:</span>
            {[
              { key: "views" as SortType, label: "視聴数" },
              { key: "likes" as SortType, label: "いいね" },
              { key: "comments" as SortType, label: "コメント" },
              { key: "recent" as SortType, label: "新着" }
            ].map(sort => (
              <Button
                key={sort.key}
                onClick={() => setSortBy(sort.key)}
                variant={sortBy === sort.key ? "primary" : "outline"}
                size="sm"
              >
                {sort.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Rankings List */}
        <div className="space-y-4">
          {filteredWorks.map((work, index) => (
            <motion.div
              key={work.workId}
              className={`bg-gradient-to-br backdrop-blur-sm border-2 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                work.isUserCollab 
                  ? 'from-yellow-100/90 to-amber-100/90 border-yellow-300/50 ring-2 ring-yellow-400/30' 
                  : 'from-white/90 to-gray-50/90 border-gray-200/50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedWork(work)}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center space-x-6">
                {/* Rank */}
                <div className={`text-4xl font-bold ${work.isUserCollab ? 'text-yellow-600' : 'text-gray-600'}`}>
                  {getRankNumber(index)}
                </div>

                {/* Work Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className={`text-xl font-bold ${work.isUserCollab ? 'text-yellow-800' : 'text-gray-800'} line-clamp-1`}>
                        {work.title}
                        {work.isUserCollab && <span className="ml-2 text-sm">👑 あなたの作品</span>}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          work.theme === "漫才" 
                            ? 'bg-rose-200 text-rose-800' 
                            : 'bg-violet-200 text-violet-800'
                        }`}>
                          {work.theme === "漫才" ? "🎭" : "🎵"} {work.theme}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(work.createdAt).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Collaborators */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <CloneAvatar look={work.cloneA.look} size="sm" />
                      <span className="text-sm font-medium text-gray-700">{work.cloneA.name}</span>
                    </div>
                    <span className="text-gray-400">×</span>
                    <div className="flex items-center space-x-2">
                      <CloneAvatar look={work.cloneB.look} size="sm" />
                      <span className="text-sm font-medium text-gray-700">{work.cloneB.name}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="flex items-center space-x-1 text-blue-600">
                        <span>👀</span>
                        <span className="font-medium">{work.stats.views.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-pink-600">
                        <span>❤️</span>
                        <span className="font-medium">{work.stats.likes.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-green-600">
                        <span>💬</span>
                        <span className="font-medium">{work.stats.comments + (comments[work.workId]?.length || 0)}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-purple-600">
                        <span>📤</span>
                        <span className="font-medium">{work.stats.shares}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleLike(work.workId);
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <span>❤️</span>
                        <span>いいね</span>
                      </Button>
                      <span className="text-sm text-gray-500">詳細を見る →</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Work Detail Modal */}
        <AnimatePresence>
          {selectedWork && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedWork(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedWork.title}
                    </h2>
                    <Button
                      onClick={() => setSelectedWork(null)}
                      variant="outline"
                      size="sm"
                    >
                      ✕
                    </Button>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleLike(selectedWork.workId)}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <span>❤️</span>
                      <span>いいね ({selectedWork.stats.likes})</span>
                    </Button>
                    <Button
                      onClick={() => router.push(`/theme-works/${selectedWork.workId}`)}
                      variant="primary"
                    >
                      詳細を見る
                    </Button>
                  </div>

                  {/* Comment Section */}
                  {selectedWork.settings.commentsEnabled && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">コメント</h3>
                      
                      {/* Comment Form */}
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="コメントを投稿..."
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                          maxLength={100}
                        />
                        <Button
                          onClick={() => handleComment(selectedWork.workId)}
                          variant="primary"
                          size="sm"
                          disabled={!newComment.trim()}
                        >
                          投稿
                        </Button>
                      </div>

                      {/* Comments List */}
                      <div className="space-y-3 max-h-40 overflow-y-auto">
                        {(comments[selectedWork.workId] || []).map((comment) => (
                          <div key={comment.id} className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-800">{comment.author}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.timestamp).toLocaleString('ja-JP')}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Home Button */}
        <div className="text-center mt-8">
          <Button
            onClick={() => router.push('/home')}
            variant="outline"
            size="lg"
            className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            ホームに戻る 🏠
          </Button>
        </div>

      </div>
    </div>
  );
}