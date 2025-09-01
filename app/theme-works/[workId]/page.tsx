"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import CloneAvatar from "@/components/ui/CloneAvatar";
import PrivateChat from "@/components/ui/PrivateChat";
import { Work } from "@/types";

// Mock collaboration work data (same as in the list page)
const mockCollaborationWorks: (Work & { 
  cloneA: { name: string; look: any };
  cloneB: { name: string; look: any };
  comments: { id: string; author: string; content: string; timestamp: string; likes: number }[];
})[] = [
  {
    workId: 'collab_001',
    theme: '漫才',
    pairingId: 'pair_collab_001',
    script: {
      tsukami: 'A「初デートで相手が30分遅刻してきたんですよ」 B「それは困りましたね」',
      tenkai: 'A「でも謝る時に『GPS壊れてました』って言うんです」 B「GPS？」 A「心のGPSが、だそうです」',
      ochi: 'B「それロマンチックじゃないですか！」 A「いや、普通に道に迷っただけでした」'
    },
    ogMeta: {
      title: '心のGPS事件 - Aiconコラボ漫才',
      desc: '初デートの遅刻から生まれた予想外の展開',
      image: '/api/og/collab_001'
    },
    stats: {
      plays: 3420,
      likes: 2156,
      comments: 89,
      shares: 445
    },
    createdAt: '2024-01-15T14:30:00Z',
    cloneA: {
      name: 'ショウタ',
      look: { hair: '黒髪ショート', eye: '鋭い黒', acc: 'サングラス', mood: 'クール', style: 'フォーマル' }
    },
    cloneB: {
      name: 'ミユ',
      look: { hair: '茶色ロング', eye: '優しい茶色', acc: '丸メガネ', mood: 'にっこり', style: 'カジュアル' }
    },
    comments: [
      { id: 'c1', author: 'ユーザーA', content: '心のGPSっていう表現が面白い！', timestamp: '2024-01-15T15:00:00Z', likes: 12 },
      { id: 'c2', author: 'ユーザーB', content: 'オチが予想外でよかった', timestamp: '2024-01-15T15:30:00Z', likes: 8 },
      { id: 'c3', author: 'ユーザーC', content: '二人のキャラの組み合わせが絶妙', timestamp: '2024-01-15T16:00:00Z', likes: 15 },
      { id: 'c4', author: 'ユーザーD', content: 'また見に来ちゃいました', timestamp: '2024-01-15T17:00:00Z', likes: 5 },
      { id: 'c5', author: 'ユーザーE', content: 'このコンビもっと見たい！', timestamp: '2024-01-15T18:00:00Z', likes: 20 }
    ]
  },
  {
    workId: 'collab_002',
    theme: 'ラブソング',
    pairingId: 'pair_collab_002',
    lyrics: {
      aMelody: ['雨音が窓を叩いて', '君の声を思い出してる', 'あの日交わした約束', '今も胸に響いてる'],
      chorus: ['星空の下で誓った', '永遠の愛を信じて', '時を越えて歌い続けよう', '君への想いを']
    },
    ogMeta: {
      title: '星降る夜の約束 - Aiconデュエット',
      desc: '二つの心が紡ぎ出した美しいラブソング',
      image: '/api/og/collab_002'
    },
    stats: {
      plays: 5890,
      likes: 4231,
      comments: 156,
      shares: 892
    },
    createdAt: '2024-01-14T19:45:00Z',
    cloneA: {
      name: 'リン',
      look: { hair: 'ピンクツイン', eye: '澄んだ青', acc: 'イヤリング', mood: 'おっとり', style: 'ボヘミアン' }
    },
    cloneB: {
      name: 'ケンタ',
      look: { hair: 'シルバーカール', eye: '温かい緑', acc: 'ネックレス', mood: '元気', style: 'スポーティ' }
    },
    comments: [
      { id: 'c4', author: 'ユーザーD', content: 'メロディーが美しくて涙が出ました', timestamp: '2024-01-14T20:00:00Z', likes: 25 },
      { id: 'c5', author: 'ユーザーE', content: '二人の声の組み合わせが最高', timestamp: '2024-01-14T20:15:00Z', likes: 18 },
      { id: 'c6', author: 'ユーザーF', content: 'リンちゃんの歌声に癒される', timestamp: '2024-01-14T20:30:00Z', likes: 22 }
    ]
  },
  {
    workId: 'collab_003',
    theme: '漫才',
    pairingId: 'pair_collab_003',
    script: {
      tsukami: 'A「最近AIに仕事を奪われるって言うじゃないですか」 B「確かに話題ですね」',
      tenkai: 'A「でも僕、AIになりたいんです」 B「え？なんでですか？」 A「だって電気代だけで生きていけるんですよ」',
      ochi: 'B「それ、光熱費上がって結局同じじゃないですか！」'
    },
    ogMeta: {
      title: 'AI時代の生き方 - Aicon漫才',
      desc: '現代社会の変化を笑いに変えた傑作',
      image: '/api/og/collab_003'
    },
    stats: {
      plays: 2890,
      likes: 1876,
      comments: 67,
      shares: 234
    },
    createdAt: '2024-01-13T11:20:00Z',
    cloneA: {
      name: 'タカシ',
      look: { hair: '金髪ボブ', eye: '神秘的な紫', acc: '帽子', mood: 'いたずらっ子', style: 'ゴシック' }
    },
    cloneB: {
      name: 'アユミ',
      look: { hair: '黒髪ロング', eye: '優しい茶色', acc: '丸メガネ', mood: 'にっこり', style: 'カジュアル' }
    },
    comments: [
      { id: 'c6', author: 'ユーザーF', content: '時事ネタが上手く組み込まれてる', timestamp: '2024-01-13T12:00:00Z', likes: 14 },
      { id: 'c7', author: 'ユーザーG', content: '電気代のオチが秀逸', timestamp: '2024-01-13T12:30:00Z', likes: 19 }
    ]
  }
];

export default function WorkDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useApp();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentWork, setCurrentWork] = useState<typeof mockCollaborationWorks[0] | null>(null);
  const [showPrivateChat, setShowPrivateChat] = useState(false);

  const workId = params.workId as string;
  const currentUserId = state.user?.userId || "user_001";
  
  // Check if current user is one of the collaborators
  const isCollaborator = currentWork && (
    (currentWork.cloneA.name === "ショウタ" && currentUserId === "user_001") ||
    (currentWork.cloneA.name === "ミユ" && currentUserId === "user_002") ||
    (currentWork.cloneB.name === "ショウタ" && currentUserId === "user_001") ||
    (currentWork.cloneB.name === "ミユ" && currentUserId === "user_002")
  );

  useEffect(() => {
    const work = mockCollaborationWorks.find(w => w.workId === workId);
    setCurrentWork(work || null);
  }, [workId]);

  const handleLike = () => {
    if (currentWork) {
      setCurrentWork(prev => prev ? {
        ...prev,
        stats: { ...prev.stats, likes: prev.stats.likes + 1 }
      } : null);
    }
  };

  const handleCommentLike = (commentId: string) => {
    if (currentWork) {
      setCurrentWork(prev => prev ? {
        ...prev,
        comments: prev.comments.map(c => 
          c.id === commentId ? { ...c, likes: c.likes + 1 } : c
        )
      } : null);
    }
  };

  const handleShare = () => {
    if (currentWork) {
      if (navigator.share) {
        navigator.share({
          title: currentWork.ogMeta.title,
          text: currentWork.ogMeta.desc,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('リンクをクリップボードにコピーしました！');
      }
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !currentWork) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCommentObj = {
      id: `new_${Date.now()}`,
      author: state.user?.nickname || 'あなた',
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    setCurrentWork(prev => prev ? {
      ...prev,
      comments: [...prev.comments, newCommentObj],
      stats: { ...prev.stats, comments: prev.stats.comments + 1 }
    } : null);

    setNewComment("");
    setIsSubmitting(false);
  };

  if (!currentWork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">作品が見つかりません</h2>
          <Button onClick={() => router.push('/theme-works')} className="mt-4">
            一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <Button
            onClick={() => router.push('/theme-works')}
            variant="outline"
            size="sm"
            className="mb-4"
          >
            ← 一覧に戻る
          </Button>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            <span>{currentWork.theme === "漫才" ? "🎭" : "🎵"}</span>
            <span>{currentWork.theme}</span>
          </div>
          <h1 className="text-4xl font-bold gradient-text">
            {currentWork.ogMeta.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {currentWork.ogMeta.desc}
          </p>
        </motion.div>

        {/* Clone Collaboration */}
        <motion.div
          className="bg-gradient-to-br from-indigo-100/90 to-purple-100/90 backdrop-blur-sm border-2 border-indigo-200/50 rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-indigo-800 text-center mb-6">コラボレーター</h2>
          <div className="flex items-center justify-center space-x-8">
            <motion.div 
              className="text-center cursor-pointer"
              onClick={() => router.push(`/user/user_001`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CloneAvatar look={currentWork.cloneA.look} size="lg" showDetails />
              <h3 className="text-xl font-bold text-indigo-800 mt-3 hover:text-purple-600 transition-colors">
                {currentWork.cloneA.name} 
                <span className="text-sm ml-1">👤</span>
              </h3>
              <div className="text-sm text-indigo-600 mt-1 space-y-1">
                <div>髪型: {currentWork.cloneA.look.hair}</div>
                <div>表情: {currentWork.cloneA.look.mood}</div>
                <div>スタイル: {currentWork.cloneA.look.style}</div>
              </div>
              <div className="text-xs text-purple-500 mt-2">プロフィールを見る</div>
            </motion.div>
            <div className="text-4xl text-purple-600">×</div>
            <motion.div 
              className="text-center cursor-pointer"
              onClick={() => router.push(`/user/user_002`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CloneAvatar look={currentWork.cloneB.look} size="lg" showDetails />
              <h3 className="text-xl font-bold text-indigo-800 mt-3 hover:text-purple-600 transition-colors">
                {currentWork.cloneB.name}
                <span className="text-sm ml-1">👤</span>
              </h3>
              <div className="text-sm text-indigo-600 mt-1 space-y-1">
                <div>髪型: {currentWork.cloneB.look.hair}</div>
                <div>表情: {currentWork.cloneB.look.mood}</div>
                <div>スタイル: {currentWork.cloneB.look.style}</div>
              </div>
              <div className="text-xs text-purple-500 mt-2">プロフィールを見る</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-sm border-2 border-purple-200/50 rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Manzai Content */}
          {currentWork.script && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-800 text-center mb-6">漫才台本</h2>
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-3 text-lg">【ツカミ】</h3>
                  <p className="text-blue-700 text-lg leading-relaxed">{currentWork.script.tsukami}</p>
                </div>
                <div className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-200">
                  <h3 className="font-bold text-purple-800 mb-3 text-lg">【展開】</h3>
                  <p className="text-purple-700 text-lg leading-relaxed">{currentWork.script.tenkai}</p>
                </div>
                <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-200">
                  <h3 className="font-bold text-pink-800 mb-3 text-lg">【オチ】</h3>
                  <p className="text-pink-700 text-lg leading-relaxed">{currentWork.script.ochi}</p>
                </div>
              </div>
            </div>
          )}

          {/* Lyrics Content */}
          {currentWork.lyrics && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-800 text-center mb-6">歌詞</h2>
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-3 text-lg">【Aメロ】</h3>
                  {currentWork.lyrics.aMelody.map((line, index) => (
                    <p key={index} className="text-blue-700 text-lg leading-relaxed">{line}</p>
                  ))}
                </div>
                <div className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-200">
                  <h3 className="font-bold text-purple-800 mb-3 text-lg">【サビ】</h3>
                  {currentWork.lyrics.chorus.map((line, index) => (
                    <p key={index} className="text-purple-700 text-lg leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats and Actions */}
        <motion.div
          className="bg-gradient-to-br from-teal-100/90 to-cyan-100/90 backdrop-blur-sm border-2 border-teal-200/50 rounded-3xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="grid grid-cols-4 gap-4 text-center flex-1">
              <div>
                <div className="text-2xl font-bold text-teal-600">{currentWork.stats.plays}</div>
                <div className="text-sm text-teal-700">再生数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-600">{currentWork.stats.likes}</div>
                <div className="text-sm text-pink-700">いいね</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{currentWork.comments.length}</div>
                <div className="text-sm text-purple-700">コメント</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{currentWork.stats.shares}</div>
                <div className="text-sm text-green-700">シェア</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleLike}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <span>❤️</span>
              <span>いいね</span>
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <span>📤</span>
              <span>シェア</span>
            </Button>
          </div>
        </motion.div>

        {/* Private Chat for Collaborators */}
        {isCollaborator && (
          <motion.div
            className="bg-gradient-to-br from-purple-100/90 to-pink-100/90 backdrop-blur-sm border-2 border-purple-200/50 rounded-3xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-2xl">💬</span>
                <h3 className="text-xl font-bold text-purple-800">コラボレーター専用チャット</h3>
                <span className="px-3 py-1 bg-purple-200/80 text-purple-800 rounded-full text-xs font-medium">
                  プライベート
                </span>
              </div>
              
              <p className="text-purple-700 text-sm">
                この作品を作った{currentWork.cloneA.name}と{currentWork.cloneB.name}だけが見ることができるプライベートなチャットルームです
              </p>
              
              <div className="flex items-center justify-center space-x-4 py-3">
                <div className="flex items-center space-x-2">
                  <CloneAvatar look={currentWork.cloneA.look} size="sm" />
                  <span className="text-sm font-medium text-purple-700">{currentWork.cloneA.name}</span>
                </div>
                <div className="w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
                <div className="flex items-center space-x-2">
                  <CloneAvatar look={currentWork.cloneB.look} size="sm" />
                  <span className="text-sm font-medium text-purple-700">{currentWork.cloneB.name}</span>
                </div>
              </div>
              
              <Button
                onClick={() => setShowPrivateChat(true)}
                variant="primary"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <span className="mr-2">💬</span>
                プライベートチャットを開く
              </Button>
              
              <div className="text-xs text-purple-600">
                🔒 このチャットは作品の制作者同士でのみ共有されます
              </div>
            </div>
          </motion.div>
        )}

        {/* Comments Section */}
        <motion.div
          className="bg-gradient-to-br from-orange-100/90 to-yellow-100/90 backdrop-blur-sm border-2 border-orange-200/50 rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-orange-800 mb-6">コメント ({currentWork.comments.length})</h2>
          
          {/* Comment Form */}
          <div className="mb-8">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <CloneAvatar look={state.clone?.look || {}} size="sm" />
              </div>
              <div className="flex-1 space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="この作品についてコメントしてください..."
                  className="w-full p-4 rounded-2xl border-2 border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-300 focus:outline-none bg-white/80"
                  rows={3}
                  maxLength={200}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-orange-600">{newComment.length}/200</span>
                  <Button
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim() || isSubmitting}
                    variant="primary"
                    size="sm"
                  >
                    {isSubmitting ? "投稿中..." : "コメント"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            <AnimatePresence>
              {currentWork.comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  className="bg-white/60 rounded-2xl p-4 border border-orange-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {comment.author[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-orange-800">{comment.author}</span>
                        <span className="text-xs text-orange-600">
                          {new Date(comment.timestamp).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      <p className="text-orange-700 mb-2">{comment.content}</p>
                      <button
                        onClick={() => handleCommentLike(comment.id)}
                        className="flex items-center space-x-1 text-xs text-orange-600 hover:text-orange-800 transition-colors"
                      >
                        <span>👍</span>
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>

      {/* Private Chat Component */}
      {currentWork && (
        <PrivateChat
          workId={workId}
          collaboratorA={{
            id: currentWork.cloneA.name === "ショウタ" ? "user_001" : "user_002",
            name: currentWork.cloneA.name,
            look: currentWork.cloneA.look
          }}
          collaboratorB={{
            id: currentWork.cloneB.name === "ショウタ" ? "user_001" : "user_002", 
            name: currentWork.cloneB.name,
            look: currentWork.cloneB.look
          }}
          isVisible={showPrivateChat}
          onClose={() => setShowPrivateChat(false)}
        />
      )}
    </div>
  );
}