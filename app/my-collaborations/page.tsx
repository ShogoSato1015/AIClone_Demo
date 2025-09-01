"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import CloneAvatar from "@/components/ui/CloneAvatar";
import PrivateChat from "@/components/ui/PrivateChat";

// Mock user collaboration data
const mockUserCollaborations = [
  {
    workId: 'collab_001',
    title: '心のGPS事件 - Aiconコラボ漫才',
    theme: '漫才',
    partner: { id: 'user_002', name: 'ミユ', look: { hair: '茶色ロング', eye: '優しい茶色', acc: '丸メガネ', mood: 'にっこり', style: 'カジュアル' } },
    stats: { views: 15420, likes: 2156, comments: 89, shares: 445 },
    createdAt: '2024-01-15T14:30:00Z',
    settings: {
      commentsEnabled: true,
      isPublic: true,
      userConsent: true,
      partnerConsent: true
    },
    script: {
      tsukami: 'A「初デートで相手が30分遅刻してきたんですよ」 B「それは困りましたね」',
      tenkai: 'A「でも謝る時に『GPS壊れてました』って言うんです」 B「GPS？」 A「心のGPSが、だそうです」',
      ochi: 'B「それロマンチックじゃないですか！」 A「いや、普通に道に迷っただけでした」'
    }
  },
  {
    workId: 'collab_004',
    title: '恋のマジック - Aiconデュエット',
    theme: 'ラブソング',
    partner: { id: 'user_007', name: 'サクラ', look: { hair: 'ピンクロング', eye: '温かい緑', acc: '花飾り', mood: 'うっとり', style: 'ボヘミアン' } },
    stats: { views: 8450, likes: 1234, comments: 45, shares: 178 },
    createdAt: '2024-01-12T16:00:00Z',
    settings: {
      commentsEnabled: false,
      isPublic: true,
      userConsent: true,
      partnerConsent: false  // Partner hasn't agreed yet
    },
    lyrics: {
      aMelody: ['君の瞳に映る未来', '二人で歩む道のりを', '魔法にかけられたみたい', '恋の呪文を唱えよう'],
      chorus: ['マジカル・ラブ', '心を繋ぐ糸', '永遠に響く', 'この歌声と共に']
    }
  },
  {
    workId: 'collab_006',
    title: 'ドリーム・コメディ - Aicon漫才',
    theme: '漫才',
    partner: { id: 'user_008', name: 'ヒロキ', look: { hair: '茶色ショート', eye: '鋭い灰色', acc: 'イヤリング', mood: 'クール', style: 'モード' } },
    stats: { views: 3200, likes: 567, comments: 23, shares: 89 },
    createdAt: '2024-01-10T20:15:00Z',
    settings: {
      commentsEnabled: true,
      isPublic: false,  // Made private
      userConsent: true,
      partnerConsent: true
    },
    script: {
      tsukami: 'A「夢を追いかけているんです」 B「素晴らしいですね、どんな夢を？」',
      tenkai: 'A「毎晩見る夢を追いかけて走ってるんです」 B「え？物理的に？」',
      ochi: 'A「はい、でも毎回夢の中で転ぶんです」 B「現実でも転びそうですね！」'
    }
  }
];

export default function MyCollaborationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useApp();
  const [selectedWork, setSelectedWork] = useState<typeof mockUserCollaborations[0] | null>(null);
  const [settingsWork, setSettingsWork] = useState<typeof mockUserCollaborations[0] | null>(null);
  const [chatPartner, setChatPartner] = useState<any>(null);
  const [showPrivateChat, setShowPrivateChat] = useState(false);

  // Handle notification navigation to open specific chat
  useEffect(() => {
    const openChatId = searchParams?.get('openChat');
    if (openChatId) {
      const work = mockUserCollaborations.find(w => w.workId === openChatId);
      if (work) {
        setChatPartner(work.partner);
        setShowPrivateChat(true);
      }
    }
  }, [searchParams]);

  const handleSettingsChange = (workId: string, setting: string, value: boolean) => {
    const work = mockUserCollaborations.find(w => w.workId === workId);
    if (work) {
      (work.settings as any)[setting] = value;
      // If making public, need both consents
      if (setting === 'isPublic' && value) {
        if (!work.settings.userConsent || !work.settings.partnerConsent) {
          alert('作品を公開するには、あなたと相手の両方の同意が必要です');
          (work.settings as any)[setting] = false;
        }
      }
    }
  };

  const handleDeleteWork = (workId: string) => {
    if (confirm('この作品を削除しますか？この操作は取り消せません。')) {
      const index = mockUserCollaborations.findIndex(w => w.workId === workId);
      if (index !== -1) {
        mockUserCollaborations.splice(index, 1);
      }
    }
  };

  const handleStartChat = (partner: any, workId: string) => {
    setChatPartner(partner);
    setShowPrivateChat(true);
  };

  const getVisibilityStatus = (work: typeof mockUserCollaborations[0]) => {
    if (!work.settings.userConsent || !work.settings.partnerConsent) {
      return {
        status: 'pending',
        text: '公開待ち（相手の同意待ち）',
        color: 'text-yellow-600 bg-yellow-100'
      };
    }
    if (!work.settings.isPublic) {
      return {
        status: 'private',
        text: '非公開',
        color: 'text-gray-600 bg-gray-100'
      };
    }
    return {
      status: 'public',
      text: '公開中',
      color: 'text-green-600 bg-green-100'
    };
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
          <h1 className="text-4xl font-bold gradient-text">
            わたしのコラボ 📚
          </h1>
          <p className="text-gray-600 text-lg">
            あなたのコラボ作品を管理・編集できます
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
              <div className="text-3xl font-bold text-indigo-600">{mockUserCollaborations.length}</div>
              <div className="text-sm text-indigo-700 font-medium">総作品数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {mockUserCollaborations.filter(w => w.settings.isPublic && w.settings.userConsent && w.settings.partnerConsent).length}
              </div>
              <div className="text-sm text-green-700 font-medium">公開中</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600">
                {mockUserCollaborations.filter(w => !w.settings.userConsent || !w.settings.partnerConsent).length}
              </div>
              <div className="text-sm text-yellow-700 font-medium">同意待ち</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {mockUserCollaborations.reduce((sum, work) => sum + work.stats.views, 0)}
              </div>
              <div className="text-sm text-purple-700 font-medium">総視聴数</div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button
              onClick={() => router.push('/collaboration')}
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              みんなのコラボを見る 🌟
            </Button>
          </div>
        </motion.div>

        {/* Collaborations List */}
        <div className="space-y-4">
          {mockUserCollaborations.map((work, index) => {
            const visibility = getVisibilityStatus(work);
            
            return (
              <motion.div
                key={work.workId}
                className="bg-gradient-to-br from-white/90 to-indigo-50/90 backdrop-blur-sm border-2 border-indigo-200/50 rounded-3xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-indigo-800">{work.title}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${visibility.color}`}>
                        {visibility.text}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        work.theme === "漫才" 
                          ? 'bg-rose-200 text-rose-800' 
                          : 'bg-violet-200 text-violet-800'
                      }`}>
                        {work.theme === "漫才" ? "🎭" : "🎵"} {work.theme}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <CloneAvatar look={state.clone?.look || {}} size="sm" />
                        <span className="text-sm font-medium text-gray-700">あなた</span>
                      </div>
                      <span className="text-gray-400">×</span>
                      <div className="flex items-center space-x-2">
                        <CloneAvatar look={work.partner.look} size="sm" />
                        <span className="text-sm font-medium text-gray-700">{work.partner.name}</span>
                      </div>
                      <Button
                        onClick={() => handleStartChat(work.partner, work.workId)}
                        variant="outline"
                        size="sm"
                        className="ml-4"
                      >
                        💬 チャット
                      </Button>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>👀 {work.stats.views.toLocaleString()}</span>
                      <span>❤️ {work.stats.likes.toLocaleString()}</span>
                      <span>💬 {work.stats.comments}</span>
                      <span>📤 {work.stats.shares}</span>
                      <span>📅 {new Date(work.createdAt).toLocaleDateString('ja-JP')}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setSelectedWork(work)}
                      variant="outline"
                      size="sm"
                    >
                      📖 詳細
                    </Button>
                    <Button
                      onClick={() => setSettingsWork(work)}
                      variant="outline"
                      size="sm"
                    >
                      ⚙️ 設定
                    </Button>
                    <Button
                      onClick={() => handleDeleteWork(work.workId)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      🗑️
                    </Button>
                  </div>
                </div>

                {/* Quick Settings Toggle */}
                <div className="flex items-center space-x-4 pt-3 border-t border-indigo-200/50">
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={work.settings.isPublic}
                      onChange={(e) => handleSettingsChange(work.workId, 'isPublic', e.target.checked)}
                      className="rounded"
                    />
                    <span>公開</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={work.settings.commentsEnabled}
                      onChange={(e) => handleSettingsChange(work.workId, 'commentsEnabled', e.target.checked)}
                      className="rounded"
                    />
                    <span>コメント許可</span>
                  </label>
                </div>
              </motion.div>
            );
          })}
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
                className="bg-white rounded-3xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedWork.title}</h2>
                    <Button onClick={() => setSelectedWork(null)} variant="outline" size="sm">✕</Button>
                  </div>

                  {/* Content Display */}
                  {selectedWork.script && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">漫才台本</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-blue-50 rounded-xl">
                          <h4 className="font-semibold text-blue-800 mb-2">【ツカミ】</h4>
                          <p>{selectedWork.script.tsukami}</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-xl">
                          <h4 className="font-semibold text-purple-800 mb-2">【展開】</h4>
                          <p>{selectedWork.script.tenkai}</p>
                        </div>
                        <div className="p-4 bg-pink-50 rounded-xl">
                          <h4 className="font-semibold text-pink-800 mb-2">【オチ】</h4>
                          <p>{selectedWork.script.ochi}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedWork.lyrics && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">歌詞</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-blue-50 rounded-xl">
                          <h4 className="font-semibold text-blue-800 mb-2">【Aメロ】</h4>
                          {selectedWork.lyrics.aMelody.map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>
                        <div className="p-4 bg-purple-50 rounded-xl">
                          <h4 className="font-semibold text-purple-800 mb-2">【サビ】</h4>
                          {selectedWork.lyrics.chorus.map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Modal */}
        <AnimatePresence>
          {settingsWork && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSettingsWork(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">作品設定</h2>
                    <Button onClick={() => setSettingsWork(null)} variant="outline" size="sm">✕</Button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold mb-2">{settingsWork.title}</h3>
                      <p className="text-sm text-gray-600">パートナー: {settingsWork.partner.name}</p>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50">
                        <div>
                          <div className="font-medium">公開設定</div>
                          <div className="text-sm text-gray-600">ランキングに表示されます</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settingsWork.settings.isPublic}
                          onChange={(e) => handleSettingsChange(settingsWork.workId, 'isPublic', e.target.checked)}
                          className="rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50">
                        <div>
                          <div className="font-medium">コメント許可</div>
                          <div className="text-sm text-gray-600">他のユーザーがコメント可能</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settingsWork.settings.commentsEnabled}
                          onChange={(e) => handleSettingsChange(settingsWork.workId, 'commentsEnabled', e.target.checked)}
                          className="rounded"
                        />
                      </label>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-xl">
                      <h4 className="font-medium text-blue-800 mb-2">同意状況</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                          <span>あなたの同意:</span>
                          <span className={settingsWork.settings.userConsent ? "text-green-600" : "text-red-600"}>
                            {settingsWork.settings.userConsent ? "✓ 同意済み" : "✗ 未同意"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{settingsWork.partner.name}の同意:</span>
                          <span className={settingsWork.settings.partnerConsent ? "text-green-600" : "text-yellow-600"}>
                            {settingsWork.settings.partnerConsent ? "✓ 同意済み" : "⏳ 待機中"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
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
            className="border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50"
          >
            ホームに戻る 🏠
          </Button>
        </div>

      </div>

      {/* Private Chat */}
      {chatPartner && (
        <PrivateChat
          workId="chat_session"
          collaboratorA={{ id: state.user?.userId || "user_001", name: state.user?.nickname || "あなた", look: state.clone?.look || {} }}
          collaboratorB={chatPartner}
          isVisible={showPrivateChat}
          onClose={() => setShowPrivateChat(false)}
        />
      )}
    </div>
  );
}