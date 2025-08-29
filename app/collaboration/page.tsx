"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import AnimatedCard from "@/components/ui/AnimatedCard";
import CloneAvatar from "@/components/ui/CloneAvatar";
import CircularProgress from "@/components/ui/CircularProgress";
import LoadingAnimation from "@/components/ui/LoadingAnimation";
import { Work, Theme } from "@/types";
import { dailyThemes } from "@/data/mockData";

type CollaborationPhase = "selection" | "preparation" | "creation" | "result";

interface CollaborationPartner {
  id: string;
  name: string;
  style: string;
  compatibility: number;
  look: any;
  specialty: string[];
}

export default function CollaborationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, actions } = useApp();
  
  const [phase, setPhase] = useState<CollaborationPhase>("selection");
  const [selectedPartner, setSelectedPartner] = useState<CollaborationPartner | null>(null);
  const [creationProgress, setCreationProgress] = useState(0);
  const [generatedWork, setGeneratedWork] = useState<Work | null>(null);

  const isRandom = searchParams?.get("random") === "true";
  
  const todayThemeIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % dailyThemes.length;
  const todayTheme = dailyThemes[todayThemeIndex];

  // Extended collaboration partners
  const collaborationPartners: CollaborationPartner[] = [
    { 
      id: 'partner1', 
      name: 'ユミコ', 
      style: 'ロマンティック', 
      compatibility: 92, 
      look: { hair: '金髪ボブ', eye: '澄んだ青', mood: 'おっとり', style: 'ボヘミアン' },
      specialty: ['感情表現', '詩的表現', 'メロディ作り']
    },
    { 
      id: 'partner2', 
      name: 'タクヤ', 
      style: 'クールツッコミ', 
      compatibility: 87, 
      look: { hair: '黒髪ロング', eye: '鋭い黒', mood: 'クール', style: 'フォーマル' },
      specialty: ['論理構築', '鋭いツッコミ', 'テンポ調整']
    },
    { 
      id: 'partner3', 
      name: 'アイカ', 
      style: 'キュート', 
      compatibility: 78, 
      look: { hair: 'ピンクツイン', eye: '温かい緑', mood: '元気', style: 'カジュアル' },
      specialty: ['ユーモア', '親しみやすさ', 'エネルギー']
    },
    { 
      id: 'partner4', 
      name: 'リョウ', 
      style: 'アーティスト', 
      compatibility: 95, 
      look: { hair: 'シルバーカール', eye: '神秘的な紫', mood: 'いたずらっ子', style: 'ゴシック' },
      specialty: ['創造性', '独創性', 'サプライズ要素']
    }
  ];

  useEffect(() => {
    if (isRandom && phase === "selection") {
      // Random selection
      const randomPartner = collaborationPartners[Math.floor(Math.random() * collaborationPartners.length)];
      setSelectedPartner(randomPartner);
      setPhase("preparation");
    }
  }, [isRandom]);

  const handlePartnerSelect = (partner: CollaborationPartner) => {
    setSelectedPartner(partner);
    setPhase("preparation");
  };

  const startCollaboration = async () => {
    setPhase("creation");
    
    // Simulate creation process with progress updates
    const stages = [
      { progress: 20, message: "アイデア出し中..." },
      { progress: 40, message: "構成を決定中..." },
      { progress: 60, message: "細部を調整中..." },
      { progress: 80, message: "最終チェック中..." },
      { progress: 100, message: "完成!" }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setCreationProgress(stage.progress);
    }

    // Generate final work
    const newWork: Work = {
      workId: `collab_${Date.now()}`,
      theme: todayTheme.theme as Theme,
      pairingId: `pair_${selectedPartner?.id}_${Date.now()}`,
      ...(todayTheme.theme === "漫才" ? {
        script: generateCollaborativeManzai(selectedPartner!.style)
      } : {
        lyrics: generateCollaborativeLyrics(selectedPartner!.style)
      }),
      ogMeta: {
        title: `${selectedPartner?.name}とのコラボ${todayTheme.theme}`,
        desc: `${state.user?.nickname}のクローンと${selectedPartner?.name}の共同創作`,
        image: `/api/og/collab_${Date.now()}`
      },
      stats: { plays: 0, likes: 0, comments: 0, shares: 0 },
      createdAt: new Date().toISOString()
    };

    setGeneratedWork(newWork);
    actions.generateWork(newWork);
    actions.addExperience(150); // More XP for collaboration
    actions.awardBadge("コラボマスター");
    
    setPhase("result");
  };

  const generateCollaborativeManzai = (partnerStyle: string) => {
    const styles = {
      'ロマンティック': {
        tsukami: 'A「恋愛について語りましょう」 B「素敵なテーマですね♪」',
        tenkai: 'A「実は昨日告白されたんです」 B「わあ！ロマンティック！どんな？」 A「『君の瞳に星が...』って」 B「素敵〜！」',
        ochi: 'A「『君の瞳に星が見える...コンタクトだね』って言われました」 B「それロマンティックじゃない！」'
      },
      'クールツッコミ': {
        tsukami: 'A「最近のデート事情、どうですか？」 B「分析してみましょうか」',
        tenkai: 'A「みんな完璧を求めすぎですよね」 B「確かに。統計的にも...」 A「私なんて昨日のデート、完璧でした！」 B「具体的には？」',
        ochi: 'A「時間通り、身だしなみ完璧、話題も準備万端...」 B「で、相手は？」 A「来ませんでした」 B「完璧に一人でしたね」'
      }
    };
    
    return styles[partnerStyle as keyof typeof styles] || styles['クールツッコミ'];
  };

  const generateCollaborativeLyrics = (partnerStyle: string) => ({
    aMelody: [
      `${partnerStyle === 'ロマンティック' ? '星降る夜に' : '静かな夜に'}`,
      "二人で歩いた道",
      "今も心に響く",
      "あの日の約束"
    ],
    chorus: [
      "離れていても",
      "つながる想い",
      "歌に込めて",
      "君に届けよう"
    ]
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="text-5xl mb-4">🎨🤝</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            コラボレーション創作
          </h1>
          <p className="text-lg text-gray-700">
            AIクローン同士の{todayTheme.theme}共同創作
          </p>
        </motion.div>

        {/* Partner Selection Phase */}
        {phase === "selection" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-blue-100/80 to-purple-100/80 backdrop-blur-sm border-2 border-blue-200/50 rounded-3xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
                コラボパートナーを選んでください
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {collaborationPartners.map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-br from-white/80 to-gray-50/80 border-2 border-gray-200/50 rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => handlePartnerSelect(partner)}
                  >
                    <div className="flex items-center space-x-4">
                      <div 
                        className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/user/user_00${index + 1}`);
                        }}
                      >
                        <CloneAvatar look={partner.look} size="md" animated />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 
                            className="text-lg font-bold text-gray-800 hover:text-purple-600 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/user/user_00${index + 1}`);
                            }}
                          >
                            {partner.name} 👤
                          </h3>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            {partner.style}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">相性度:</span>
                            <div className="flex items-center space-x-1">
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                                  style={{ width: `${partner.compatibility}%` }}
                                />
                              </div>
                              <span className="text-xs text-purple-700 font-medium">{partner.compatibility}%</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {partner.specialty.slice(0, 2).map(skill => (
                              <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Preparation Phase */}
        {phase === "preparation" && selectedPartner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-sm border-2 border-purple-200/50 rounded-3xl p-8 shadow-lg">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-purple-800">
                  コラボレーションの準備
                </h2>
                
                <div className="flex justify-center items-center space-x-8">
                  {/* Your Clone */}
                  <div className="text-center space-y-3">
                    <CloneAvatar look={state.clone?.look || {}} size="lg" animated />
                    <div>
                      <h3 className="font-bold text-gray-800">{state.user?.nickname}</h3>
                      <p className="text-sm text-gray-600">あなたのクローン</p>
                    </div>
                  </div>
                  
                  {/* Collaboration Symbol */}
                  <motion.div
                    className="text-4xl"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🤝
                  </motion.div>
                  
                  {/* Partner Clone */}
                  <div className="text-center space-y-3">
                    <CloneAvatar look={selectedPartner.look} size="lg" animated />
                    <div>
                      <h3 className="font-bold text-gray-800">{selectedPartner.name}</h3>
                      <p className="text-sm text-gray-600">{selectedPartner.style}</p>
                    </div>
                  </div>
                </div>

                {/* Collaboration Details */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/50 rounded-2xl p-4">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-semibold text-gray-800">テーマ</h4>
                    <p className="text-sm text-gray-600">{todayTheme.title}</p>
                  </div>
                  
                  <div className="bg-white/50 rounded-2xl p-4">
                    <div className="text-2xl mb-2">📊</div>
                    <h4 className="font-semibold text-gray-800">相性度</h4>
                    <p className="text-sm text-gray-600">{selectedPartner.compatibility}%</p>
                  </div>
                  
                  <div className="bg-white/50 rounded-2xl p-4">
                    <div className="text-2xl mb-2">{todayTheme.theme === "漫才" ? "🎭" : "🎵"}</div>
                    <h4 className="font-semibold text-gray-800">ジャンル</h4>
                    <p className="text-sm text-gray-600">{todayTheme.theme}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-purple-800">期待される効果</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 p-3 bg-white/40 rounded-xl">
                      <span className="text-lg">✨</span>
                      <span className="text-sm text-gray-700">創作の化学反応</span>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-white/40 rounded-xl">
                      <span className="text-lg">🚀</span>
                      <span className="text-sm text-gray-700">表現力向上</span>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-white/40 rounded-xl">
                      <span className="text-lg">🎪</span>
                      <span className="text-sm text-gray-700">新しい視点獲得</span>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-white/40 rounded-xl">
                      <span className="text-lg">💝</span>
                      <span className="text-sm text-gray-700">経験値+150</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setPhase("selection")}
                    variant="outline"
                    className="flex-1"
                  >
                    パートナー変更
                  </Button>
                  <Button
                    onClick={startCollaboration}
                    variant="primary"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    コラボ開始！ 🎨
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Creation Phase */}
        {phase === "creation" && selectedPartner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-r from-cyan-100/80 to-blue-100/80 backdrop-blur-sm border-2 border-cyan-200/50 rounded-3xl p-8 shadow-lg text-center">
              <h2 className="text-3xl font-bold text-cyan-800 mb-8">
                創作活動中... 🎨
              </h2>

              {/* Circular Progress */}
              <div className="flex justify-center mb-8">
                <CircularProgress
                  progress={creationProgress}
                  size={200}
                  strokeWidth={12}
                  color="#06b6d4"
                  backgroundColor="#e0f2fe"
                  label="創作進捗"
                  animated
                  duration={1}
                />
              </div>

              {/* Collaboration Animation */}
              <div className="flex justify-center items-center space-x-12 mb-8">
                <motion.div
                  animate={{
                    x: [0, 10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CloneAvatar look={state.clone?.look || {}} size="lg" animated />
                  <p className="text-sm text-gray-700 mt-2 font-medium">{state.user?.nickname}</p>
                </motion.div>

                <motion.div
                  className="text-6xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ⚡
                </motion.div>

                <motion.div
                  animate={{
                    x: [0, -10, 0],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <CloneAvatar look={selectedPartner.look} size="lg" animated />
                  <p className="text-sm text-gray-700 mt-2 font-medium">{selectedPartner.name}</p>
                </motion.div>
              </div>

              {/* Creation Stages */}
              <div className="space-y-3">
                {[
                  { stage: 20, label: "💡 アイデア出し", desc: "創作の方向性を話し合い中..." },
                  { stage: 40, label: "📝 構成決定", desc: "ストーリーの流れを組み立て中..." },
                  { stage: 60, label: "✨ 詳細調整", desc: "表現の細かな部分を磨き中..." },
                  { stage: 80, label: "🔍 最終チェック", desc: "品質を確認して仕上げ中..." },
                  { stage: 100, label: "🎉 完成！", desc: "素晴らしい作品が出来上がりました！" }
                ].map((item, index) => (
                  <motion.div
                    key={item.stage}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      creationProgress >= item.stage
                        ? 'bg-green-100/80 border-green-300 text-green-800'
                        : creationProgress >= item.stage - 20
                        ? 'bg-blue-100/80 border-blue-300 text-blue-800'
                        : 'bg-gray-100/50 border-gray-200 text-gray-500'
                    }`}
                    animate={creationProgress >= item.stage ? { scale: [1, 1.02, 1] } : {}}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">{item.label.split(' ')[0]}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.label.split(' ').slice(1).join(' ')}</h4>
                        <p className="text-sm opacity-80">{item.desc}</p>
                      </div>
                      {creationProgress >= item.stage && (
                        <div className="text-green-600">✓</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Result Phase */}
        {phase === "result" && generatedWork && selectedPartner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Success Header */}
            <div className="text-center space-y-4">
              <motion.div
                className="text-8xl"
                animate={{ scale: [0.8, 1.2, 1], rotate: [0, 360] }}
                transition={{ duration: 1 }}
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold gradient-text">
                コラボレーション成功！
              </h2>
              <p className="text-lg text-gray-700">
                {state.user?.nickname} × {selectedPartner.name} の共同創作が完成しました
              </p>
            </div>

            {/* Generated Work */}
            <div className="bg-gradient-to-br from-yellow-100/80 to-orange-100/80 backdrop-blur-sm border-2 border-yellow-200/50 rounded-3xl p-8 shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">
                      {todayTheme.theme === "漫才" ? "🎭" : "🎵"}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-orange-800">
                        {generatedWork.ogMeta.title}
                      </h3>
                      <p className="text-sm text-orange-600">
                        コラボレーション作品
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CloneAvatar look={state.clone?.look || {}} size="sm" />
                    <span className="text-xl">🤝</span>
                    <CloneAvatar look={selectedPartner.look} size="sm" />
                  </div>
                </div>

                {/* Content Display */}
                {generatedWork.script && (
                  <div className="space-y-4">
                    <div className="p-4 bg-white/60 border border-orange-200/50 rounded-2xl">
                      <h4 className="font-semibold text-orange-700 mb-2">【ツカミ】</h4>
                      <p className="text-gray-800">{generatedWork.script.tsukami}</p>
                    </div>
                    <div className="p-4 bg-white/60 border border-orange-200/50 rounded-2xl">
                      <h4 className="font-semibold text-orange-700 mb-2">【展開】</h4>
                      <p className="text-gray-800">{generatedWork.script.tenkai}</p>
                    </div>
                    <div className="p-4 bg-white/60 border border-orange-200/50 rounded-2xl">
                      <h4 className="font-semibold text-orange-700 mb-2">【オチ】</h4>
                      <p className="text-gray-800">{generatedWork.script.ochi}</p>
                    </div>
                  </div>
                )}

                {generatedWork.lyrics && (
                  <div className="space-y-4">
                    <div className="p-4 bg-white/60 border border-orange-200/50 rounded-2xl">
                      <h4 className="font-semibold text-orange-700 mb-2">【Aメロ】</h4>
                      {generatedWork.lyrics.aMelody.map((line, index) => (
                        <p key={index} className="text-gray-800">{line}</p>
                      ))}
                    </div>
                    <div className="p-4 bg-white/60 border border-orange-200/50 rounded-2xl">
                      <h4 className="font-semibold text-orange-700 mb-2">【サビ】</h4>
                      {generatedWork.lyrics.chorus.map((line, index) => (
                        <p key={index} className="text-gray-800">{line}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-4 pt-6 border-t border-orange-200/50">
                  <Button
                    onClick={() => actions.likeWork(generatedWork.workId)}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 border-orange-300 text-orange-700"
                  >
                    <span>❤️</span>
                    <span>いいね</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 border-orange-300 text-orange-700"
                  >
                    <span>📤</span>
                    <span>共有</span>
                  </Button>

                  <Button
                    onClick={() => router.push('/works')}
                    variant="outline"
                    size="sm"
                    className="border-orange-300 text-orange-700"
                  >
                    作品一覧
                  </Button>
                </div>
              </div>
            </div>

            {/* Collaboration Stats */}
            <div className="bg-gradient-to-r from-green-100/80 to-emerald-100/80 backdrop-blur-sm border-2 border-green-200/50 rounded-3xl p-6 shadow-lg">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-green-800">
                  コラボレーション結果
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">+150</div>
                    <div className="text-sm text-green-700">経験値</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">NEW</div>
                    <div className="text-sm text-blue-700">称号</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">+{selectedPartner.compatibility}</div>
                    <div className="text-sm text-purple-700">親密度</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="text-center space-y-4">
              <Button
                onClick={() => router.push('/home')}
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-500"
              >
                ホームに戻る 🏠
              </Button>
              <p className="text-sm text-gray-600">
                素晴らしいコラボレーションでした！また一緒に創作しましょう
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}