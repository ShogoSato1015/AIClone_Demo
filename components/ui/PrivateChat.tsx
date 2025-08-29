"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import CloneAvatar from "@/components/ui/CloneAvatar";

interface PrivateChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderLook: any;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface PrivateChatProps {
  workId: string;
  collaboratorA: {
    id: string;
    name: string;
    look: any;
  };
  collaboratorB: {
    id: string;
    name: string;
    look: any;
  };
  isVisible: boolean;
  onClose: () => void;
}

const PrivateChat: React.FC<PrivateChatProps> = ({
  workId,
  collaboratorA,
  collaboratorB,
  isVisible,
  onClose
}) => {
  const { state } = useApp();
  const [messages, setMessages] = useState<PrivateChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentUserId = state.user?.userId || "user_001";
  const otherUser = currentUserId === collaboratorA.id ? collaboratorB : collaboratorA;

  // Mock initial messages
  useEffect(() => {
    const mockMessages: PrivateChatMessage[] = [
      {
        id: "msg_1",
        senderId: collaboratorA.id,
        senderName: collaboratorA.name,
        senderLook: collaboratorA.look,
        content: "この作品の制作、お疲れさまでした！",
        timestamp: "2024-01-15T10:30:00Z",
        isRead: true
      },
      {
        id: "msg_2",
        senderId: collaboratorB.id,
        senderName: collaboratorB.name,
        senderLook: collaboratorB.look,
        content: "こちらこそ！すごく良い作品になりましたね ✨",
        timestamp: "2024-01-15T10:32:00Z",
        isRead: true
      },
      {
        id: "msg_3",
        senderId: collaboratorA.id,
        senderName: collaboratorA.name,
        senderLook: collaboratorA.look,
        content: "特にオチの部分、予想外の展開で面白かったです！",
        timestamp: "2024-01-15T10:35:00Z",
        isRead: currentUserId === collaboratorA.id
      },
      {
        id: "msg_4",
        senderId: collaboratorB.id,
        senderName: collaboratorB.name,
        senderLook: collaboratorB.look,
        content: "ありがとうございます！また一緒にコラボしましょう 🤝",
        timestamp: "2024-01-15T10:38:00Z",
        isRead: currentUserId === collaboratorB.id
      }
    ];
    
    setMessages(mockMessages);
  }, [workId, collaboratorA, collaboratorB, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: PrivateChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUserId === collaboratorA.id ? collaboratorA.name : collaboratorB.name,
      senderLook: currentUserId === collaboratorA.id ? collaboratorA.look : collaboratorB.look,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate other user typing response
    setTimeout(() => {
      setOtherUserTyping(true);
      setTimeout(() => {
        setOtherUserTyping(false);
        const responses = [
          "いいですね！",
          "そう思います ✨",
          "なるほど！",
          "面白いアイデアですね",
          "次回も楽しみです！",
          "ありがとうございます 😊"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage: PrivateChatMessage = {
          id: `msg_${Date.now() + 1}`,
          senderId: otherUser.id,
          senderName: otherUser.name,
          senderLook: otherUser.look,
          content: randomResponse,
          timestamp: new Date().toISOString(),
          isRead: false
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }, 1500);
    }, 500);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg h-[600px] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CloneAvatar look={otherUser.look} size="sm" />
                <div>
                  <h3 className="font-bold text-lg">{otherUser.name}</h3>
                  <p className="text-purple-100 text-sm">コラボレーター</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50 to-pink-50">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUserId;
              const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
              
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} items-end space-x-2`}
                >
                  {!isCurrentUser && showAvatar && (
                    <CloneAvatar look={message.senderLook} size="sm" />
                  )}
                  {!isCurrentUser && !showAvatar && (
                    <div className="w-8 h-8"></div>
                  )}
                  
                  <div className={`max-w-xs ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                    <div
                      className={`p-3 rounded-2xl ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white border border-purple-200 text-gray-800'
                      } shadow-sm`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <div className={`flex items-center mt-1 space-x-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                      </span>
                      {isCurrentUser && (
                        <div className="text-xs">
                          {message.isRead ? (
                            <span className="text-purple-500">✓✓</span>
                          ) : (
                            <span className="text-gray-400">✓</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isCurrentUser && showAvatar && (
                    <CloneAvatar look={message.senderLook} size="sm" />
                  )}
                  {isCurrentUser && !showAvatar && (
                    <div className="w-8 h-8"></div>
                  )}
                </motion.div>
              );
            })}
            
            {/* Typing Indicator */}
            <AnimatePresence>
              {otherUserTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex justify-start items-end space-x-2"
                >
                  <CloneAvatar look={otherUser.look} size="sm" />
                  <div className="bg-white border border-purple-200 rounded-2xl px-4 py-2 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-3">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`${otherUser.name}さんにメッセージを送る...`}
                  className="w-full p-3 border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none resize-none"
                  rows={2}
                  maxLength={200}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-400">{newMessage.length}/200</span>
                  <span className="text-xs text-purple-500">Enter: 送信 | Shift+Enter: 改行</span>
                </div>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                variant="primary"
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3"
              >
                📤
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrivateChat;