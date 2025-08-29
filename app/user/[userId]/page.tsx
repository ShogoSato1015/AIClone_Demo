"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import CloneAvatar from "@/components/ui/CloneAvatar";
import { Work, CloneProfile } from "@/types";

// Mock user data with their clones and works
const mockUserData: {
  [key: string]: {
    userId: string;
    nickname: string;
    joinDate: string;
    clone: CloneProfile;
    stats: {
      totalWorks: number;
      totalLikes: number;
      totalPlays: number;
      collaborations: number;
    };
    works: (Work & { 
      collaboratorId?: string;
      collaboratorName?: string;
      collaboratorLook?: any;
    })[];
    recentCollaborators: {
      userId: string;
      nickname: string;
      look: any;
      collaborationCount: number;
    }[];
    personalityTags: string[];
    bio: string;
  }
} = {
  "user_001": {
    userId: "user_001",
    nickname: "ショウタ",
    joinDate: "2024-01-10",
    clone: {
      cloneId: "clone_shouta",
      ownerId: "user_001",
      personaSnapshot: {
        userId: "user_001",
        scores: [
          { tag: "共感", value: 75 },
          { tag: "論理", value: 65 },
          { tag: "冒険", value: 80 },
          { tag: "保守", value: 40 },
          { tag: "ユーモア", value: 90 },
          { tag: "ロマン", value: 55 }
        ],
        lastUpdated: "2024-01-15T10:00:00Z"
      },
      look: {
        hair: "黒髪ショート",
        eye: "鋭い黒",
        acc: "サングラス",
        mood: "クール",
        style: "フォーマル"
      },
      titleBadges: ["コメディキング", "クールガイ", "人気者"],
      level: 5,
      experience: 2850,
      createdAt: "2024-01-10T00:00:00Z",
      lastUpdated: "2024-01-15T10:00:00Z"
    },
    stats: {
      totalWorks: 12,
      totalLikes: 3420,
      totalPlays: 8950,
      collaborations: 8
    },
    works: [
      {
        workId: "work_shouta_001",
        theme: "漫才",
        pairingId: "pair_001",
        script: {
          tsukami: "A「最近の若者はスマホばかり見てますよね」 B「確かにそうですね」",
          tenkai: "A「でも僕、スマホ見すぎて首が90度曲がったんです」 B「それヤバくないですか？」",
          ochi: "A「おかげでフクロウと友達になれました」 B「それもうフクロウじゃないですか！」"
        },
        ogMeta: {
          title: "スマホ首フクロウ - ショウタ×ミユ漫才",
          desc: "現代病を笑いに変えた傑作コント",
          image: "/api/og/work_shouta_001"
        },
        stats: { plays: 1250, likes: 890, comments: 45, shares: 123 },
        createdAt: "2024-01-14T15:30:00Z",
        collaboratorId: "user_002",
        collaboratorName: "ミユ",
        collaboratorLook: { hair: "茶色ロング", eye: "優しい茶色", acc: "丸メガネ", mood: "にっこり", style: "カジュアル" }
      }
    ],
    recentCollaborators: [
      {
        userId: "user_002",
        nickname: "ミユ",
        look: { hair: "茶色ロング", eye: "優しい茶色", acc: "丸メガネ", mood: "にっこり", style: "カジュアル" },
        collaborationCount: 3
      },
      {
        userId: "user_003",
        nickname: "リン",
        look: { hair: "ピンクツイン", eye: "澄んだ青", acc: "イヤリング", mood: "おっとり", style: "ボヘミアン" },
        collaborationCount: 2
      }
    ],
    personalityTags: ["ユーモア溢れる", "クールな視点", "冒険好き", "論理派"],
    bio: "笑いで世界を明るくしたいクリエイター。日常の些細なことを面白おかしく表現するのが得意です。"
  },
  "user_002": {
    userId: "user_002",
    nickname: "ミユ",
    joinDate: "2024-01-12",
    clone: {
      cloneId: "clone_miyu",
      ownerId: "user_002", 
      personaSnapshot: {
        userId: "user_002",
        scores: [
          { tag: "共感", value: 90 },
          { tag: "論理", value: 70 },
          { tag: "冒険", value: 60 },
          { tag: "保守", value: 65 },
          { tag: "ユーモア", value: 85 },
          { tag: "ロマン", value: 95 }
        ],
        lastUpdated: "2024-01-15T10:00:00Z"
      },
      look: {
        hair: "茶色ロング",
        eye: "優しい茶色", 
        acc: "丸メガネ",
        mood: "にっこり",
        style: "カジュアル"
      },
      titleBadges: ["優しい心", "共感の女王", "ロマンチスト"],
      level: 4,
      experience: 2100,
      createdAt: "2024-01-12T00:00:00Z",
      lastUpdated: "2024-01-15T10:00:00Z"
    },
    stats: {
      totalWorks: 8,
      totalLikes: 2650,
      totalPlays: 6420,
      collaborations: 6
    },
    works: [],
    recentCollaborators: [
      {
        userId: "user_001",
        nickname: "ショウタ",
        look: { hair: "黒髪ショート", eye: "鋭い黒", acc: "サングラス", mood: "クール", style: "フォーマル" },
        collaborationCount: 3
      }
    ],
    personalityTags: ["温かい心", "共感力抜群", "ロマンチック", "思いやり深い"],
    bio: "人の気持ちに寄り添うことを大切にしています。心温まる作品を通じて、みんなを笑顔にしたいです。"
  }
};

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<"works" | "collaborators" | "about">("works");
  
  const userId = params.userId as string;
  const userData = mockUserData[userId];
  const isOwnProfile = state.user?.userId === userId;

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">❓</div>
          <h2 className="text-2xl font-bold text-gray-800">ユーザーが見つかりません</h2>
          <Button onClick={() => router.push('/home')}>
            ホームに戻る
          </Button>
        </div>
      </div>
    );
  }

  const handleCollaboratorClick = (collaboratorId: string) => {
    router.push(`/user/${collaboratorId}`);
  };

  const handleStartCollaboration = () => {
    router.push(`/collaboration?partner=${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-cyan-100 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="sm"
            className="mb-4"
          >
            ← 戻る
          </Button>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          className="bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-sm border-2 border-purple-200/50 rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Clone Avatar */}
            <div className="flex-shrink-0 text-center">
              <CloneAvatar look={userData.clone.look} size="xl" showDetails />
              <div className="mt-4 space-y-2">
                <div className="flex justify-center flex-wrap gap-2">
                  {userData.clone.titleBadges.map(badge => (
                    <span key={badge} className="px-3 py-1 bg-purple-200/80 text-purple-800 rounded-full text-sm font-medium border border-purple-300">
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-purple-600">
                  レベル {userData.clone.level} | 経験値 {userData.clone.experience}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold gradient-text mb-2">
                    {userData.nickname}
                  </h1>
                  <p className="text-purple-600 text-lg">{userData.bio}</p>
                </div>

                {/* Personality Tags */}
                <div className="flex justify-center lg:justify-start flex-wrap gap-2">
                  {userData.personalityTags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{userData.stats.totalWorks}</div>
                    <div className="text-sm text-indigo-700">作品数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{userData.stats.totalLikes}</div>
                    <div className="text-sm text-pink-700">総いいね</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{userData.stats.totalPlays}</div>
                    <div className="text-sm text-purple-700">総再生数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-600">{userData.stats.collaborations}</div>
                    <div className="text-sm text-cyan-700">コラボ数</div>
                  </div>
                </div>

                {/* Action Buttons */}
                {!isOwnProfile && (
                  <div className="flex justify-center lg:justify-start space-x-4">
                    <Button
                      onClick={handleStartCollaboration}
                      variant="primary"
                      className="bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      🤝 コラボする
                    </Button>
                    <Button variant="outline">
                      ❤️ フォロー
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            <div className="flex space-x-2">
              {[
                { key: "works", label: "作品", icon: "🎨" },
                { key: "collaborators", label: "コラボ相手", icon: "🤝" },
                { key: "about", label: "詳細", icon: "ℹ️" }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Works Tab */}
          {activeTab === "works" && (
            <div className="space-y-6">
              {userData.works.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-2xl font-bold text-gray-800">まだ作品がありません</h3>
                  <p className="text-gray-600 mt-2">
                    {isOwnProfile ? "最初の作品を作ってみましょう！" : `${userData.nickname}さんの作品を待ちましょう`}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userData.works.map((work, index) => (
                    <motion.div
                      key={work.workId}
                      className="bg-gradient-to-br from-white/90 to-indigo-50/90 backdrop-blur-sm border-2 border-indigo-200/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => router.push(`/theme-works/${work.workId}`)}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-3xl">
                            {work.theme === "漫才" ? "🎭" : "🎵"}
                          </div>
                          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                            {work.theme}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-indigo-800 line-clamp-2">
                          {work.ogMeta.title}
                        </h3>
                        
                        {work.collaboratorName && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>with</span>
                            <CloneAvatar look={work.collaboratorLook} size="xs" />
                            <span className="font-medium">{work.collaboratorName}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>👀 {work.stats.plays}</span>
                          <span>❤️ {work.stats.likes}</span>
                          <span>💬 {work.stats.comments}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Collaborators Tab */}
          {activeTab === "collaborators" && (
            <div className="space-y-6">
              {userData.recentCollaborators.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤝</div>
                  <h3 className="text-2xl font-bold text-gray-800">まだコラボしていません</h3>
                  <p className="text-gray-600 mt-2">新しい仲間とコラボレーションしてみましょう！</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userData.recentCollaborators.map((collaborator, index) => (
                    <motion.div
                      key={collaborator.userId}
                      className="bg-gradient-to-br from-white/90 to-pink-50/90 backdrop-blur-sm border-2 border-pink-200/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleCollaboratorClick(collaborator.userId)}
                    >
                      <div className="text-center space-y-4">
                        <CloneAvatar look={collaborator.look} size="lg" />
                        <div>
                          <h3 className="text-xl font-bold text-pink-800">{collaborator.nickname}</h3>
                          <p className="text-sm text-pink-600">
                            {collaborator.collaborationCount}回のコラボ
                          </p>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/collaboration?partner=${collaborator.userId}`);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          再コラボする
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Personal Info */}
              <div className="bg-gradient-to-br from-white/90 to-cyan-50/90 backdrop-blur-sm border-2 border-cyan-200/50 rounded-3xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold text-cyan-800 mb-4">基本情報</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-cyan-600">参加日</span>
                    <p className="font-medium">{new Date(userData.joinDate).toLocaleDateString('ja-JP')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-cyan-600">クローンタイプ</span>
                    <p className="font-medium">{userData.clone.look.style}</p>
                  </div>
                  <div>
                    <span className="text-sm text-cyan-600">得意分野</span>
                    <p className="font-medium">
                      {userData.clone.personaSnapshot.scores
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 2)
                        .map(score => score.tag)
                        .join("・")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personality Chart */}
              <div className="bg-gradient-to-br from-white/90 to-orange-50/90 backdrop-blur-sm border-2 border-orange-200/50 rounded-3xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold text-orange-800 mb-4">個性チャート</h3>
                <div className="space-y-3">
                  {userData.clone.personaSnapshot.scores.map(score => (
                    <div key={score.tag}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-orange-700">{score.tag}</span>
                        <span className="text-orange-600">{score.value}</span>
                      </div>
                      <div className="w-full bg-orange-100 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${score.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}