"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import AnimatedCard from "@/components/ui/AnimatedCard";
import CloneAvatar from "@/components/ui/CloneAvatar";
import { Work } from "@/types";

export default function WorksPage() {
  const router = useRouter();
  const { state, actions } = useApp();
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [filter, setFilter] = useState<"all" | "漫才" | "ラブソング">("all");

  const filteredWorks = state.works.filter(work => 
    filter === "all" || work.theme === filter
  );

  const handleWorkClick = (work: Work) => {
    setSelectedWork(work);
  };

  const handleLike = (workId: string) => {
    actions.likeWork(workId);
  };

  const handleShare = (work: Work) => {
    if (navigator.share) {
      navigator.share({
        title: work.ogMeta.title,
        text: work.ogMeta.desc,
        url: `${window.location.origin}/works/${work.workId}`
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/works/${work.workId}`);
      alert('リンクをクリップボードにコピーしました！');
    }
  };

  const closeModal = () => {
    setSelectedWork(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-cyan-50 to-blue-100 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold gradient-text">
            作品コレクション 🎨
          </h1>
          <p className="text-gray-600">
            あなたのクローンが生成した作品一覧
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="bg-gradient-to-br from-teal-100/90 to-cyan-100/90 backdrop-blur-sm border-2 border-teal-200/50 rounded-3xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-teal-600">{state.works.length}</div>
              <div className="text-sm text-teal-700 font-medium">総作品数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600">
                {state.works.reduce((sum, work) => sum + work.stats.likes, 0)}
              </div>
              <div className="text-sm text-pink-700 font-medium">総いいね</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {state.works.reduce((sum, work) => sum + work.stats.plays, 0)}
              </div>
              <div className="text-sm text-purple-700 font-medium">総再生数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {state.works.reduce((sum, work) => sum + work.stats.shares, 0)}
              </div>
              <div className="text-sm text-green-700 font-medium">総共有数</div>
            </div>
          </div>
        </motion.div>

        {/* Filter */}
        <div className="flex justify-center space-x-2">
          {["all", "漫才", "ラブソング"].map(filterOption => (
            <Button
              key={filterOption}
              onClick={() => setFilter(filterOption as any)}
              variant={filter === filterOption ? "primary" : "outline"}
              size="sm"
            >
              {filterOption === "all" ? "すべて" : filterOption}
            </Button>
          ))}
        </div>

        {/* Works Grid */}
        {filteredWorks.length === 0 ? (
          <motion.div
            className="bg-gradient-to-br from-orange-100/90 to-yellow-100/90 backdrop-blur-sm border-2 border-orange-200/50 rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center space-y-4 py-8">
              <div className="text-6xl">📝</div>
              <h3 className="text-2xl font-bold text-orange-800">
                作品がまだありません
              </h3>
              <p className="text-orange-700 text-lg">
                Q&Aやミニゲームを完了して、最初の作品を生成しましょう！
              </p>
              <Button
                onClick={() => router.push('/home')}
                variant="primary"
                size="lg"
              >
                ホームに戻る 🏠
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredWorks.map((work, index) => (
              <motion.div
                key={work.workId}
                onClick={() => handleWorkClick(work)}
                className="cursor-pointer bg-gradient-to-br from-indigo-100/90 to-purple-100/90 backdrop-blur-sm border-2 border-indigo-200/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {work.theme === "漫才" ? "🎭" : "🎵"}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-indigo-800 line-clamp-1">
                          {work.ogMeta.title}
                        </h3>
                        <p className="text-sm text-indigo-600">
                          {new Date(work.createdAt).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs px-3 py-2 bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 rounded-full font-medium border border-purple-300">
                      {work.theme}
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-200">
                    {work.script && (
                      <p className="text-sm text-indigo-700 line-clamp-2">
                        {work.script.tsukami}
                      </p>
                    )}
                    {work.lyrics && (
                      <p className="text-sm text-purple-700 line-clamp-2">
                        {work.lyrics.aMelody.join(" / ")}
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-indigo-600">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <span>👀</span>
                        <span className="font-medium">{work.stats.plays}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>❤️</span>
                        <span className="font-medium">{work.stats.likes}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>💬</span>
                        <span className="font-medium">{work.stats.comments}</span>
                      </span>
                      {/* Show private chat indicator for your own works */}
                      {work.theme && index < 2 && (
                        <span className="flex items-center space-x-1" title="プライベートチャットあり">
                          <span>🔒</span>
                          <span className="font-medium text-purple-600">PC</span>
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-purple-600">詳細を見る →</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center">
          <Button
            onClick={() => router.push('/home')}
            variant="outline"
            size="lg"
          >
            ホームに戻る 🏠
          </Button>
        </div>

      </div>

      {/* Work Detail Modal */}
      {selectedWork && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">
                    {selectedWork.theme === "漫才" ? "🎭" : "🎵"}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {selectedWork.ogMeta.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedWork.createdAt).toLocaleString('ja-JP')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              {selectedWork.script && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <h3 className="font-semibold text-gray-700 mb-2">【ツカミ】</h3>
                    <p className="text-gray-800">{selectedWork.script.tsukami}</p>
                  </div>
                  <div className="p-4 bg-primary-50 rounded-2xl">
                    <h3 className="font-semibold text-primary-700 mb-2">【展開】</h3>
                    <p className="text-gray-800">{selectedWork.script.tenkai}</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-2xl">
                    <h3 className="font-semibold text-accent-700 mb-2">【オチ】</h3>
                    <p className="text-gray-800">{selectedWork.script.ochi}</p>
                  </div>
                </div>
              )}

              {selectedWork.lyrics && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <h3 className="font-semibold text-gray-700 mb-2">【Aメロ】</h3>
                    {selectedWork.lyrics.aMelody.map((line, index) => (
                      <p key={index} className="text-gray-800">{line}</p>
                    ))}
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-2xl">
                    <h3 className="font-semibold text-secondary-700 mb-2">【サビ】</h3>
                    {selectedWork.lyrics.chorus.map((line, index) => (
                      <p key={index} className="text-gray-800">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-center space-x-4 pt-4 border-t">
                <Button
                  onClick={() => handleLike(selectedWork.workId)}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <span>❤️</span>
                  <span>{selectedWork.stats.likes}</span>
                </Button>
                
                <Button
                  onClick={() => handleShare(selectedWork)}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <span>📤</span>
                  <span>共有</span>
                </Button>

                <Button
                  onClick={closeModal}
                  variant="primary"
                  size="sm"
                >
                  閉じる
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}