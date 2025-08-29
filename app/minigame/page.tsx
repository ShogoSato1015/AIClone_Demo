"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import CloneAvatar from "@/components/ui/CloneAvatar";
import { MiniGameLog, MiniGameStep } from "@/types";
import { mockDramaScenario, mockRhythmGame } from "@/data/mockData";

type GameType = "drama" | "rhythm";
type GamePhase = "intro" | "playing" | "complete" | "results";

export default function MiniGamePage() {
  const router = useRouter();
  const { state, actions } = useApp();
  const [gameType, setGameType] = useState<GameType>("drama");
  const [gamePhase, setGamePhase] = useState<GamePhase>("intro");
  const [currentStep, setCurrentStep] = useState(0);
  const [decisions, setDecisions] = useState<MiniGameStep[]>([]);
  const [score, setScore] = useState(0);
  const [rhythmBeats, setRhythmBeats] = useState<number[]>([]);

  useEffect(() => {
    // Redirect if already completed
    if (state.todaysProgress.minigameCompleted) {
      router.push('/home');
    }
  }, [state.todaysProgress.minigameCompleted, router]);

  const handleGameSelect = (type: GameType) => {
    setGameType(type);
    setGamePhase("playing");
  };

  const handleDramaChoice = (choice: string) => {
    const startTime = Date.now();
    const decision: MiniGameStep = {
      step: currentStep,
      choice,
      rtMs: startTime % 1000 // Mock reaction time
    };
    
    setDecisions(prev => [...prev, decision]);
    setScore(prev => prev + Math.floor(Math.random() * 20) + 10);
    
    if (currentStep < mockDramaScenario.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setGamePhase("complete");
    }
  };

  const handleRhythmBeat = (beatType: string) => {
    const timing = Date.now() % 1000;
    setRhythmBeats(prev => [...prev, timing]);
    
    const decision: MiniGameStep = {
      step: rhythmBeats.length,
      choice: beatType,
      rtMs: timing
    };
    
    setDecisions(prev => [...prev, decision]);
    setScore(prev => prev + (timing < 200 ? 50 : timing < 500 ? 30 : 10));
    
    if (rhythmBeats.length >= 7) {
      setGamePhase("complete");
    }
  };

  const handleComplete = async () => {
    // Create game log
    const gameLog: MiniGameLog = {
      gameId: `game_${Date.now()}`,
      gameType,
      decisions,
      timestamp: new Date().toISOString()
    };
    
    // Update persona based on game performance
    updatePersonaFromGame(gameLog);
    
    // Complete minigame
    actions.completeMinigame(gameLog);
    actions.addExperience(75);
    
    // Award badges based on performance
    if (score >= 200) {
      actions.awardBadge("ゲームマスター");
    } else if (score >= 100) {
      actions.awardBadge("センス抜群");
    }
    
    setGamePhase("results");
  };

  const updatePersonaFromGame = (gameLog: MiniGameLog) => {
    // Update persona based on game choices
    if (gameType === "drama") {
      gameLog.decisions.forEach(decision => {
        if (decision.choice.includes("早めに") || decision.choice.includes("事前に")) {
          actions.updatePersona("保守", 10);
        }
        if (decision.choice.includes("相手に") || decision.choice.includes("選んでもらう")) {
          actions.updatePersona("共感", 15);
        }
        if (decision.choice.includes("適当に") || decision.choice.includes("近くの")) {
          actions.updatePersona("冒険", 12);
        }
      });
    } else {
      // Rhythm game updates different traits
      actions.updatePersona("ユーモア", 20);
      if (score >= 150) {
        actions.updatePersona("論理", 10);
      }
    }
  };

  const handleFinish = () => {
    router.push('/home');
  };

  if (state.todaysProgress.minigameCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-orange-100 via-yellow-50 to-pink-100">
        <motion.div 
          className="bg-gradient-to-br from-orange-100/90 to-yellow-100/90 backdrop-blur-sm border-2 border-orange-200/50 rounded-3xl p-8 shadow-xl text-center space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-orange-800">
            今日のミニゲームは完了済みです
          </h2>
          <p className="text-orange-700 text-lg">また明日挑戦してくださいね！</p>
          <Button onClick={() => router.push('/home')} variant="primary" size="lg">
            ホームに戻る 🏠
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Intro Phase */}
        {gamePhase === "intro" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold gradient-text">
                ミニゲーム 🎮
              </h1>
              <p className="text-gray-600">
                楽しく遊びながらクローンの個性を育てよう！
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                onClick={() => handleGameSelect("drama")}
                className="cursor-pointer text-center bg-gradient-to-br from-rose-100/90 to-pink-100/90 backdrop-blur-sm border-2 border-rose-200/50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="space-y-4">
                  <motion.div 
                    className="text-5xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎭
                  </motion.div>
                  <h3 className="text-xl font-bold text-rose-800">
                    {mockDramaScenario.title}
                  </h3>
                  <p className="text-rose-700">
                    シナリオベースの選択ゲーム<br />
                    あなたの判断力を試します
                  </p>
                  <div className="px-4 py-2 bg-rose-200/80 text-rose-800 rounded-full text-sm font-medium inline-block border border-rose-300">
                    プレイ時間: 2-3分
                  </div>
                </div>
              </motion.div>

              <motion.div 
                onClick={() => handleGameSelect("rhythm")}
                className="cursor-pointer text-center bg-gradient-to-br from-violet-100/90 to-purple-100/90 backdrop-blur-sm border-2 border-violet-200/50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-4">
                  <motion.div 
                    className="text-5xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🎵
                  </motion.div>
                  <h3 className="text-xl font-bold text-violet-800">
                    {mockRhythmGame.title}
                  </h3>
                  <p className="text-violet-700">
                    リズムゲーム<br />
                    タイミングよくボタンを押そう
                  </p>
                  <div className="px-4 py-2 bg-violet-200/80 text-violet-800 rounded-full text-sm font-medium inline-block border border-violet-300">
                    プレイ時間: 1-2分
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Drama Game */}
        {gamePhase === "playing" && gameType === "drama" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {mockDramaScenario.title}
              </h2>
              <ProgressBar
                current={currentStep + 1}
                total={mockDramaScenario.steps.length}
                color="primary"
                showLabel={false}
              />
            </div>

            <motion.div
              className="bg-gradient-to-br from-orange-100/90 to-amber-100/90 backdrop-blur-sm border-2 border-orange-200/50 rounded-3xl p-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎭</div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-gray-700 font-medium">
                      {mockDramaScenario.steps[currentStep]?.situation}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">あなたの選択は？</h3>
                  {mockDramaScenario.steps[currentStep]?.choices.map((choice, index) => (
                    <motion.button
                      key={choice}
                      className="w-full p-4 text-left rounded-2xl border-2 border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50 transition-all"
                      onClick={() => handleDramaChoice(choice)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {choice}
                    </motion.button>
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-sm text-orange-600">
                    現在のスコア: <span className="font-bold text-orange-700 text-lg">{score}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Rhythm Game */}
        {gamePhase === "playing" && gameType === "rhythm" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {mockRhythmGame.title}
              </h2>
              <p className="text-gray-600">{mockRhythmGame.description}</p>
              <ProgressBar
                current={rhythmBeats.length}
                total={8}
                color="secondary"
                showLabel={false}
              />
            </div>

            <motion.div
              className="bg-gradient-to-br from-cyan-100/90 to-blue-100/90 backdrop-blur-sm border-2 border-cyan-200/50 rounded-3xl p-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="space-y-6 text-center">
                <motion.div 
                  className="text-6xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎵
                </motion.div>
                
                <div className="space-y-4">
                  <p className="font-medium text-cyan-800">
                    音楽に合わせて感情ボタンを押そう！
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { emotion: "love", label: "愛", color: "bg-pink-100 text-pink-700", emoji: "💕" },
                      { emotion: "excitement", label: "興奮", color: "bg-orange-100 text-orange-700", emoji: "⚡" },
                      { emotion: "tenderness", label: "優しさ", color: "bg-green-100 text-green-700", emoji: "🌸" },
                      { emotion: "passion", label: "情熱", color: "bg-red-100 text-red-700", emoji: "🔥" }
                    ].map(beat => (
                      <motion.button
                        key={beat.emotion}
                        className={`p-6 rounded-2xl ${beat.color} font-semibold text-lg transition-all hover:scale-105 active:scale-95`}
                        onClick={() => handleRhythmBeat(beat.emotion)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={rhythmBeats.length % 4 === 0 ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="text-2xl mb-1">{beat.emoji}</div>
                        {beat.label}
                      </motion.button>
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-cyan-600">
                      スコア: <span className="font-bold text-cyan-700 text-lg">{score}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Complete Phase */}
        {gamePhase === "complete" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold gradient-text">
              ゲーム完了！
            </h2>
            <p className="text-xl text-gray-600">
              素晴らしいプレイでした！
            </p>

            <motion.div
              className="bg-gradient-to-br from-emerald-100/90 to-green-100/90 backdrop-blur-sm border-2 border-emerald-200/50 rounded-3xl p-8 shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <CloneAvatar 
                    look={state.clone?.look || {}} 
                    size="lg" 
                    animated 
                  />
                </div>
                <h3 className="text-xl font-bold text-emerald-800">
                  最終スコア: {score}
                </h3>
                <p className="text-emerald-700">
                  あなたの判断からクローンが多くを学びました！
                </p>
                <div className="flex justify-center space-x-4 text-sm text-emerald-600 font-medium">
                  <span>判断数: {decisions.length}</span>
                  <span>•</span>
                  <span>経験値: +75</span>
                </div>
              </div>
            </motion.div>

            <Button onClick={handleComplete} variant="primary">
              結果を確認 ✨
            </Button>
          </motion.div>
        )}

        {/* Results Phase */}
        {gamePhase === "results" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800">
              ゲーム結果
            </h2>

            <motion.div
              className="bg-gradient-to-br from-indigo-100/90 to-blue-100/90 backdrop-blur-sm border-2 border-indigo-200/50 rounded-3xl p-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">{score}</div>
                    <div className="text-sm text-indigo-700 font-medium">スコア</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{decisions.length}</div>
                    <div className="text-sm text-blue-700 font-medium">アクション数</div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border border-green-200">
                  <div className="text-green-700 font-bold mb-2">学習完了！</div>
                  <p className="text-sm text-green-600">
                    クローンの個性パラメータが更新されました
                  </p>
                </div>
              </div>
            </motion.div>

            <Button onClick={handleFinish} variant="primary" size="lg">
              ホームに戻る 🏠
            </Button>
          </motion.div>
        )}

      </div>
    </div>
  );
}