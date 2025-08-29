"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import CloneAvatar from "@/components/ui/CloneAvatar";
import { Work } from "@/types";
import { dailyThemes } from "@/data/mockData";

// Mock collaboration works data
const mockCollaborationWorks: (Work & { 
  cloneA: { name: string; look: any };
  cloneB: { name: string; look: any };
  comments: { id: string; author: string; content: string; timestamp: string; }[];
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
      title: '心のGPS事件 - AIクローンコラボ漫才',
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
      { id: 'c1', author: 'ユーザーA', content: '心のGPSっていう表現が面白い！', timestamp: '2024-01-15T15:00:00Z' },
      { id: 'c2', author: 'ユーザーB', content: 'オチが予想外でよかった', timestamp: '2024-01-15T15:30:00Z' },
      { id: 'c3', author: 'ユーザーC', content: '二人のキャラの組み合わせが絶妙', timestamp: '2024-01-15T16:00:00Z' }
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
      title: '星降る夜の約束 - AIクローンデュエット',
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
      { id: 'c4', author: 'ユーザーD', content: 'メロディーが美しくて涙が出ました', timestamp: '2024-01-14T20:00:00Z' },
      { id: 'c5', author: 'ユーザーE', content: '二人の声の組み合わせが最高', timestamp: '2024-01-14T20:15:00Z' }
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
      title: 'AI時代の生き方 - AIクローン漫才',
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
      { id: 'c6', author: 'ユーザーF', content: '時事ネタが上手く組み込まれてる', timestamp: '2024-01-13T12:00:00Z' },
      { id: 'c7', author: 'ユーザーG', content: '電気代のオチが秀逸', timestamp: '2024-01-13T12:30:00Z' }
    ]
  }
];

export default function ThemeWorksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useApp();
  const [selectedWork, setSelectedWork] = useState<typeof mockCollaborationWorks[0] | null>(null);
  const [filter, setFilter] = useState<"all" | "漫才" | "ラブソング">("all");
  
  // Get theme from URL params
  const themeParam = searchParams.get('theme') || '';
  const todayThemeIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % dailyThemes.length;
  const currentTheme = dailyThemes.find(t => t.theme === themeParam) || dailyThemes[todayThemeIndex];

  const filteredWorks = mockCollaborationWorks.filter(work => 
    filter === "all" || work.theme === filter
  ).filter(work => 
    !themeParam || work.theme === themeParam
  );

  const handleWorkClick = (work: typeof mockCollaborationWorks[0]) => {
    router.push(`/theme-works/${work.workId}`);
  };

  const handleLike = (workId: string) => {
    // Update likes in mockCollaborationWorks
    const work = mockCollaborationWorks.find(w => w.workId === workId);
    if (work) {
      work.stats.likes += 1;
    }
  };

  const handleShare = (work: typeof mockCollaborationWorks[0]) => {
    if (navigator.share) {
      navigator.share({
        title: work.ogMeta.title,
        text: work.ogMeta.desc,
        url: `${window.location.origin}/theme-works/${work.workId}`
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/theme-works/${work.workId}`);
      alert('リンクをクリップボードにコピーしました！');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            <span>{currentTheme.theme === "漫才" ? "🎭" : "🎵"}</span>
            <span>{currentTheme.title}</span>
          </div>
          <h1 className="text-4xl font-bold gradient-text">
            AIクローンコラボ作品 ✨
          </h1>
          <p className="text-gray-600 text-lg">
            異なるクローン同士が創り出した奇跡の作品たち
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="bg-gradient-to-br from-indigo-100/90 to-purple-100/90 backdrop-blur-sm border-2 border-indigo-200/50 rounded-3xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600">{filteredWorks.length}</div>
              <div className="text-sm text-indigo-700 font-medium">コラボ作品数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {filteredWorks.reduce((sum, work) => sum + work.stats.likes, 0)}
              </div>
              <div className="text-sm text-purple-700 font-medium">総いいね</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600">
                {filteredWorks.reduce((sum, work) => sum + work.stats.plays, 0)}
              </div>
              <div className="text-sm text-pink-700 font-medium">総再生数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {filteredWorks.reduce((sum, work) => sum + work.comments.length, 0)}
              </div>
              <div className="text-sm text-green-700 font-medium">総コメント</div>
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((work, index) => (
            <motion.div
              key={work.workId}
              onClick={() => handleWorkClick(work)}
              className="cursor-pointer bg-gradient-to-br from-white/90 to-indigo-50/90 backdrop-blur-sm border-2 border-indigo-200/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">
                      {work.theme === "漫才" ? "🎭" : "🎵"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-indigo-800 line-clamp-1 text-lg">
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

                {/* Clone Collaboration */}
                <div className="flex items-center justify-center space-x-4 py-3">
                  <div 
                    className="text-center cursor-pointer hover:scale-105 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/user/user_00${index + 1}`);
                    }}
                  >
                    <CloneAvatar look={work.cloneA.look} size="sm" />
                    <p className="text-xs font-medium text-gray-700 mt-1 hover:text-indigo-600">{work.cloneA.name}</p>
                  </div>
                  <div className="text-2xl">×</div>
                  <div 
                    className="text-center cursor-pointer hover:scale-105 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/user/user_00${index + 2}`);
                    }}
                  >
                    <CloneAvatar look={work.cloneB.look} size="sm" />
                    <p className="text-xs font-medium text-gray-700 mt-1 hover:text-indigo-600">{work.cloneB.name}</p>
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
                      <span className="font-medium">{work.comments.length}</span>
                    </span>
                  </div>
                  <span className="font-medium text-purple-600">詳細を見る →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Back Button */}
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
    </div>
  );
}