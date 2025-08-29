"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import CloneAvatar from "@/components/ui/CloneAvatar";
import PrivateChat from "@/components/ui/PrivateChat";
import { Work } from "@/types";

// Mock chat rooms data
const mockChatRooms = [
  {
    id: "room_001",
    workId: "collab_001",
    workTitle: "心のGPS事件 - AIクローンコラボ漫才",
    workTheme: "漫才",
    participants: [
      { id: "user_001", name: "あなた", look: { hair: "黒髪ショート", eye: "優しい黒", acc: "なし", mood: "笑顔", style: "カジュアル" } },
      { id: "user_002", name: "タケシ", look: { hair: "茶色ボブ", eye: "明るい茶色", acc: "ヘッドフォン", mood: "元気", style: "ストリート" } },
      { id: "user_003", name: "ユキ", look: { hair: "金髪ツイン", eye: "澄んだ青", acc: "リボン", mood: "恥ずかしがり", style: "スイート" } }
    ],
    lastMessage: "この作品のオチが本当に面白いですね！",
    lastMessageTime: "2024-01-15T18:30:00Z",
    unreadCount: 2,
    isActive: true
  },
  {
    id: "room_002", 
    workId: "collab_002",
    workTitle: "星降る夜の約束 - AIクローンデュエット",
    workTheme: "ラブソング",
    participants: [
      { id: "user_001", name: "あなた", look: { hair: "黒髪ショート", eye: "優しい黒", acc: "なし", mood: "笑顔", style: "カジュアル" } },
      { id: "user_004", name: "サクラ", look: { hair: "ピンクロング", eye: "温かい緑", acc: "花飾り", mood: "うっとり", style: "ボヘミアン" } }
    ],
    lastMessage: "メロディーが心に響きます 🎵",
    lastMessageTime: "2024-01-15T17:45:00Z",
    unreadCount: 0,
    isActive: true
  },
  {
    id: "room_003",
    workId: "collab_003", 
    workTitle: "AI時代の生き方 - AIクローン漫才",
    workTheme: "漫才",
    participants: [
      { id: "user_001", name: "あなた", look: { hair: "黒髪ショート", eye: "優しい黒", acc: "なし", mood: "笑顔", style: "カジュアル" } },
      { id: "user_005", name: "ケン", look: { hair: "銀髪ショート", eye: "鋭い灰色", acc: "イヤリング", mood: "クール", style: "モード" } }
    ],
    lastMessage: "時事ネタの使い方が上手いです",
    lastMessageTime: "2024-01-14T20:15:00Z", 
    unreadCount: 1,
    isActive: false
  }
];

export default function ChatPage() {
  const router = useRouter();
  const { state } = useApp();
  const [selectedRoom, setSelectedRoom] = useState<typeof mockChatRooms[0] | null>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [filter, setFilter] = useState<"all" | "漫才" | "ラブソング">("all");

  const currentUserId = state.user?.userId || "user_001";
  
  const filteredRooms = mockChatRooms.filter(room => 
    filter === "all" || room.workTheme === filter
  );

  const handleRoomClick = (room: typeof mockChatRooms[0]) => {
    setSelectedRoom(room);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}分前`;
    } else if (hours < 24) {
      return `${hours}時間前`;
    } else {
      return `${days}日前`;
    }
  };

  const getOtherParticipants = (room: typeof mockChatRooms[0]) => {
    return room.participants.filter(p => p.id !== currentUserId);
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
            チャットルーム 💬
          </h1>
          <p className="text-gray-600 text-lg">
            作品について他のユーザーと語り合いましょう
          </p>
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
              <div className="text-3xl font-bold text-purple-600">{filteredRooms.length}</div>
              <div className="text-sm text-purple-700 font-medium">参加中ルーム</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {filteredRooms.filter(r => r.isActive).length}
              </div>
              <div className="text-sm text-blue-700 font-medium">アクティブルーム</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-600">
                {filteredRooms.reduce((sum, room) => sum + room.unreadCount, 0)}
              </div>
              <div className="text-sm text-cyan-700 font-medium">未読メッセージ</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {filteredRooms.reduce((sum, room) => sum + room.participants.length, 0)}
              </div>
              <div className="text-sm text-green-700 font-medium">総参加者数</div>
            </div>
          </div>
        </motion.div>

        {/* Filter & Create Room */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex space-x-2">
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
          
          <Button
            onClick={() => setShowCreateRoom(true)}
            variant="primary"
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            新しいルームを作成 ➕
          </Button>
        </div>

        {/* Chat Rooms Grid */}
        {filteredRooms.length === 0 ? (
          <motion.div
            className="bg-gradient-to-br from-orange-100/90 to-yellow-100/90 backdrop-blur-sm border-2 border-orange-200/50 rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center space-y-4 py-8">
              <div className="text-6xl">💬</div>
              <h3 className="text-2xl font-bold text-orange-800">
                チャットルームがありません
              </h3>
              <p className="text-orange-700 text-lg">
                新しいルームを作成して、作品について語り合いましょう！
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                onClick={() => handleRoomClick(room)}
                className="cursor-pointer bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-sm border-2 border-purple-200/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Unread Badge */}
                {room.unreadCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {room.unreadCount}
                  </div>
                )}

                {/* Active Indicator */}
                {room.isActive && (
                  <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                )}

                <div className="space-y-4">
                  {/* Work Info */}
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">
                      {room.workTheme === "漫才" ? "🎭" : "🎵"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-purple-800 line-clamp-2 text-lg">
                        {room.workTitle}
                      </h3>
                      <div className="text-xs px-2 py-1 bg-gradient-to-r from-purple-200 to-blue-200 text-purple-800 rounded-full font-medium border border-purple-300 inline-block mt-1">
                        {room.workTheme}
                      </div>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">参加者 ({room.participants.length}名)</p>
                    <div className="flex -space-x-2">
                      {room.participants.slice(0, 4).map((participant, i) => (
                        <div key={participant.id} className="relative">
                          <CloneAvatar 
                            look={participant.look} 
                            size="sm" 
                            className="border-2 border-white shadow-md"
                          />
                          {i === 3 && room.participants.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-xs text-white font-bold">
                              +{room.participants.length - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Last Message */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-3 border border-purple-200">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {room.lastMessage}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(room.lastMessageTime)}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="text-center">
                    <span className="text-sm font-medium text-purple-600">チャットに参加 →</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

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

      {/* Selected Room Chat */}
      {selectedRoom && (
        <PrivateChat
          workId={selectedRoom.workId}
          collaboratorA={selectedRoom.participants[0]}
          collaboratorB={getOtherParticipants(selectedRoom)[0] || selectedRoom.participants[1]}
          isVisible={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl"
          >
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  新しいチャットルーム
                </h2>
                <p className="text-gray-600">
                  作品を選んでルームを作成しましょう
                </p>
              </div>
              
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🚧</div>
                <p className="text-gray-600">
                  この機能は近日公開予定です！<br />
                  しばらくお待ちください。
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowCreateRoom(false)}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  閉じる
                </Button>
                <Button
                  onClick={() => router.push('/theme-works')}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  作品を見る
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}