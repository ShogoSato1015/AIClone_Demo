'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { useApp } from '@/context/AppContext';

export default function LandingPage() {
  const router = useRouter();
  const { state } = useApp();

  const handleGetStarted = () => {
    // Check if user has completed setup
    if (state.user && state.clone) {
      router.push('/home');
    } else {
      router.push('/character-customization');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-gradient-to-br from-violet-100 via-pink-50 to-cyan-100">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold gradient-text leading-tight">
            Aiconが
            <br />
            創作する世界
          </h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            あなた自身も知らない「<b>あなたらしさ</b>」が、
            <br />
            <b>AIアバターとなって誰かと出会う。</b>
            <br />
            <br />
            そこで生まれるのは、
            <br />
            予測不能な化学反応が生み出す、一度きりの漫才やラブソング。
            <br />
            <br />
            それは、<b>あなたから生まれた、</b>
            <br />
            <b>あなた一人では決して創れない物語</b>です。
          </motion.p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 my-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.div
            className="bg-gradient-to-br from-rose-100/90 to-pink-100/90 backdrop-blur-sm border-2 border-rose-200/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center space-y-3">
              <motion.div
                className="text-5xl mb-3"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎭
              </motion.div>
              <h3 className="text-xl font-bold text-rose-800">漫才創作</h3>
              <p className="text-rose-700">
                あなたの個性を反映した
                <br />
                オリジナル漫才ネタ
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-violet-100/90 to-purple-100/90 backdrop-blur-sm border-2 border-violet-200/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center space-y-3">
              <motion.div
                className="text-5xl mb-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🎵
              </motion.div>
              <h3 className="text-xl font-bold text-violet-800">ラブソング</h3>
              <p className="text-violet-700">
                心に響く
                <br />
                オリジナル歌詞とメロディ
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-emerald-100/90 to-teal-100/90 backdrop-blur-sm border-2 border-emerald-200/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center space-y-3">
              <motion.div
                className="text-5xl mb-3"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.div>
              <h3 className="text-xl font-bold text-emerald-800">成長体験</h3>
              <p className="text-emerald-700">
                Aiconと一緒に
                <br />
                成長する毎日
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Demo Flow Preview */}
        <motion.div
          className="bg-gradient-to-r from-amber-100/80 to-orange-100/80 backdrop-blur-sm border-2 border-amber-200/50 rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-amber-800 mb-8">体験の流れ</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Q&A', desc: '3つの質問に答える', icon: '❓', color: 'from-blue-400 to-blue-600' },
              {
                step: '02',
                title: 'ミニゲーム',
                desc: '楽しくプレイしてAiconを育成',
                icon: '🎮',
                color: 'from-purple-400 to-purple-600'
              },
              {
                step: '03',
                title: 'Aicon成長',
                desc: 'あなたの個性を反映',
                icon: '🌱',
                color: 'from-green-400 to-green-600'
              },
              {
                step: '04',
                title: '作品創作',
                desc: 'オリジナル作品が完成',
                icon: '🎨',
                color: 'from-pink-400 to-pink-600'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className={`w-16 h-16 mx-auto bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2 + index * 0.5, repeat: Infinity }}
                >
                  {item.step}
                </motion.div>
                <motion.div
                  className="text-4xl"
                  animate={{ rotate: index % 2 === 0 ? [0, 10, -10, 0] : [0, -10, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                >
                  {item.icon}
                </motion.div>
                <h4 className="font-bold text-amber-800 text-lg">{item.title}</h4>
                <p className="text-amber-700">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-indigo-100/80 to-purple-100/80 backdrop-blur-sm border-2 border-indigo-200/50 rounded-3xl p-8 shadow-lg">
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Button
                onClick={handleGetStarted}
                variant="primary"
                size="lg"
                className="text-2xl px-16 py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl"
              >
                体験を始める 🚀
              </Button>
            </motion.div>

            <motion.div
              className="mt-6 flex justify-center space-x-8 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <div className="flex items-center space-x-2 text-indigo-700">
                <span>⚡</span>
                <span>30秒セットアップ</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-700">
                <span>🆓</span>
                <span>無料デモ</span>
              </div>
              <div className="flex items-center space-x-2 text-pink-700">
                <span>🎨</span>
                <span>即座に創作開始</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(236, 72, 153, 0.1)'
              } 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    </div>
  );
}
