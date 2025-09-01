'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import CloneAvatar from '@/components/ui/CloneAvatar';

interface Notification {
  id: string;
  type: 'chat' | 'collaboration' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  relatedWorkId?: string;
  senderName?: string;
  senderAvatar?: any;
  collaborationId?: string;
}

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'chat',
    title: 'ユミコからの新しいメッセージ',
    message: '「星降る夜の物語」について話し合いましょう！',
    timestamp: '2024-01-15T14:30:00Z',
    isRead: false,
    relatedWorkId: 'collab_001',
    senderName: 'ユミコ',
    senderAvatar: { hair: '金髪ボブ', eye: '澄んだ青', mood: 'おっとり', style: 'ボヘミアン' },
    collaborationId: 'collab_001'
  },
  {
    id: 'notif_002',
    type: 'chat',
    title: 'タクヤからの新しいメッセージ',
    message: '漫才の構成、もう少し調整したいです',
    timestamp: '2024-01-15T13:15:00Z',
    isRead: false,
    relatedWorkId: 'collab_002',
    senderName: 'タクヤ',
    senderAvatar: { hair: '黒髪ロング', eye: '鋭い黒', mood: 'クール', style: 'フォーマル' },
    collaborationId: 'collab_002'
  },
  {
    id: 'notif_003',
    type: 'collaboration',
    title: 'コラボレーション完了',
    message: 'アイカとの「恋のマジック」が完成しました！',
    timestamp: '2024-01-15T12:00:00Z',
    isRead: false,
    relatedWorkId: 'collab_003',
    collaborationId: 'collab_003'
  },
  {
    id: 'notif_004',
    type: 'system',
    title: 'Aiconトレーニング完了',
    message: '今日のQ&Aクエストを完了しました。',
    timestamp: '2024-01-15T10:30:00Z',
    isRead: true
  },
  {
    id: 'notif_005',
    type: 'chat',
    title: 'リョウからの新しいメッセージ',
    message: 'コラボの感想、ありがとうございました！',
    timestamp: '2024-01-14T18:45:00Z',
    isRead: true,
    relatedWorkId: 'collab_004',
    senderName: 'リョウ',
    senderAvatar: { hair: 'シルバーカール', eye: '神秘的な紫', mood: 'いたずらっ子', style: 'ゴシック' },
    collaborationId: 'collab_004'
  }
];

export default function NotificationsPage() {
  const router = useRouter();
  const { state } = useApp();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'chat' | 'collaboration' | 'system'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter(
    (notification) => filter === 'all' || notification.type === filter
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}分前`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}時間前`;
    } else {
      return `${Math.floor(diffInHours / 24)}日前`;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)));

    // Navigate based on notification type
    if (notification.type === 'chat' && notification.collaborationId) {
      router.push(`/my-collaborations?openChat=${notification.collaborationId}`);
    } else if (notification.type === 'collaboration' && notification.relatedWorkId) {
      router.push(`/my-collaborations`);
    } else if (notification.type === 'system') {
      // Handle system notifications if needed
      router.push('/home');
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return '💬';
      case 'collaboration':
        return '🎨';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'chat':
        return 'from-blue-100/80 to-cyan-100/80 border-blue-200/50';
      case 'collaboration':
        return 'from-purple-100/80 to-pink-100/80 border-purple-200/50';
      case 'system':
        return 'from-green-100/80 to-emerald-100/80 border-green-200/50';
      default:
        return 'from-gray-100/80 to-slate-100/80 border-gray-200/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="text-5xl mb-4">🔔</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            通知
          </h1>
          <p className="text-lg text-gray-700">チャットやコラボレーションの最新情報</p>
        </motion.div>

        {/* Stats & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-indigo-100/80 to-purple-100/80 backdrop-blur-sm border-2 border-indigo-200/50 rounded-3xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{notifications.length}</div>
                <div className="text-sm text-indigo-700">総通知数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{unreadCount}</div>
                <div className="text-sm text-purple-700">未読</div>
              </div>
            </div>

            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
              >
                すべて既読にする
              </Button>
            )}
          </div>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center space-x-2"
        >
          {[
            { key: 'all', label: 'すべて' },
            { key: 'chat', label: 'チャット' },
            { key: 'collaboration', label: 'コラボ' },
            { key: 'system', label: 'システム' }
          ].map((filterOption) => (
            <Button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as any)}
              variant={filter === filterOption.key ? 'primary' : 'outline'}
              size="sm"
            >
              {filterOption.label}
            </Button>
          ))}
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 space-y-3"
            >
              <div className="text-6xl">📭</div>
              <p className="text-gray-600">通知がありません</p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => handleNotificationClick(notification)}
                className={`cursor-pointer bg-gradient-to-br backdrop-blur-sm border-2 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all ${getNotificationColor(
                  notification.type
                )} ${!notification.isRead ? 'border-l-4 border-l-red-400' : ''}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start space-x-4">
                  {/* Notification Icon or Avatar */}
                  <div className="flex-shrink-0">
                    {notification.senderAvatar ? (
                      <CloneAvatar look={notification.senderAvatar} size="sm" />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full flex items-center justify-center text-2xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            notification.type === 'chat'
                              ? 'text-blue-800'
                              : notification.type === 'collaboration'
                              ? 'text-purple-800'
                              : 'text-green-800'
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <p
                          className={`text-sm mt-1 ${
                            notification.type === 'chat'
                              ? 'text-blue-700'
                              : notification.type === 'collaboration'
                              ? 'text-purple-700'
                              : 'text-green-700'
                          }`}
                        >
                          {notification.message}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                        <span
                          className={`text-xs ${
                            notification.type === 'chat'
                              ? 'text-blue-600'
                              : notification.type === 'collaboration'
                              ? 'text-purple-600'
                              : 'text-green-600'
                          }`}
                        >
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

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
    </div>
  );
}
