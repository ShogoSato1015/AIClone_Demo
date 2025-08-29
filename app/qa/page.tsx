"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import AnimatedCard from "@/components/ui/AnimatedCard";
import ProgressBar from "@/components/ui/ProgressBar";
import CloneAvatar from "@/components/ui/CloneAvatar";
import { QAQuestion, QAAnswer, PersonaTag } from "@/types";
import { mockQuestionsComedy, mockQuestionsLove, dailyThemes } from "@/data/mockData";

export default function QAPage() {
  const router = useRouter();
  const { state, actions } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get today's theme questions
  const todayThemeIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % dailyThemes.length;
  const todayTheme = dailyThemes[todayThemeIndex];
  const questions: QAQuestion[] = todayTheme.theme === "漫才" ? mockQuestionsComedy : mockQuestionsLove;
  
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canProceed = answers[currentQuestion?.id] !== undefined && answers[currentQuestion?.id] !== "";

  useEffect(() => {
    // Redirect if already completed
    if (state.todaysProgress.qaCompleted >= 3) {
      router.push('/home');
    }
  }, [state.todaysProgress.qaCompleted, router]);

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleTextAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      await handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Convert answers to QAAnswer format
    const qaAnswers: QAAnswer[] = Object.entries(answers).map(([questionId, payload]) => ({
      questionId,
      type: questions.find(q => q.id === questionId)?.type || "choice",
      payload,
      timestamp: new Date().toISOString()
    }));
    
    // Update persona based on answers
    updatePersonaFromAnswers(qaAnswers);
    
    // Complete Q&A
    actions.completeQA(qaAnswers);
    actions.addExperience(50);
    
    // Award badge if first completion
    if (state.todaysProgress.qaCompleted === 0) {
      actions.awardBadge("思考の探求者");
    }
    
    setIsSubmitting(false);
    router.push('/home');
  };

  const updatePersonaFromAnswers = (qaAnswers: QAAnswer[]) => {
    // Simple logic to update persona based on answers
    qaAnswers.forEach(answer => {
      if (answer.payload.includes("論理") || answer.payload.includes("スピード")) {
        actions.updatePersona("論理", 15);
      }
      if (answer.payload.includes("温かさ") || answer.payload.includes("共感")) {
        actions.updatePersona("共感", 15);
      }
      if (answer.payload.includes("冒険") || answer.payload.includes("新しい")) {
        actions.updatePersona("冒険", 10);
      }
      if (answer.payload.includes("ユーモア") || answer.payload.includes("笑い")) {
        actions.updatePersona("ユーモア", 20);
      }
      if (answer.payload.includes("ロマン") || answer.payload.includes("愛")) {
        actions.updatePersona("ロマン", 15);
      }
    });
  };

  if (state.todaysProgress.qaCompleted >= 3) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-100">
        <motion.div 
          className="bg-gradient-to-br from-green-100/90 to-emerald-100/90 backdrop-blur-sm border-2 border-green-200/50 rounded-3xl p-8 shadow-xl text-center space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-green-800">
            今日のQ&Aは完了済みです
          </h2>
          <p className="text-green-700 text-lg">また明日挑戦してくださいね！</p>
          <Button onClick={() => router.push('/home')} variant="primary" size="lg">
            ホームに戻る 🏠
          </Button>
        </motion.div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <CloneAvatar look={state.clone?.look || {}} size="lg" animated />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold gradient-text">学習中...</h2>
            <p className="text-gray-600">あなたの回答からクローンが学んでいます</p>
          </div>
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            <span>{todayTheme.theme === "漫才" ? "🎭" : "🎵"}</span>
            <span>{todayTheme.title} - Q&A</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            クローンに学習させよう
          </h1>
          <p className="text-gray-600">
            あなたの回答がクローンの個性を育てます
          </p>
        </motion.div>

        {/* Progress */}
        <ProgressBar
          current={currentQuestionIndex + 1}
          total={questions.length}
          color="primary"
          label="質問の進捗"
        />

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion?.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-gradient-to-br from-blue-100/90 to-indigo-100/90 backdrop-blur-sm border-2 border-blue-200/50 rounded-3xl p-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {currentQuestionIndex + 1}
                  </motion.div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-blue-800 mb-2">
                      {currentQuestion?.label}
                    </h2>
                  </div>
                </div>

                {/* Choice Questions */}
                {currentQuestion?.type === "choice" && (
                  <div className="space-y-3">
                    {currentQuestion.choices.map((choice, index) => (
                      <motion.button
                        key={choice}
                        className={`w-full p-4 text-left rounded-2xl border-2 transition-all shadow-md hover:shadow-lg ${
                          answers[currentQuestion.id] === choice
                            ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 ring-2 ring-blue-300'
                            : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50'
                        }`}
                        onClick={() => handleAnswerSelect(choice)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{choice}</span>
                          {answers[currentQuestion.id] === choice && (
                            <span className="text-blue-600 text-xl">✓</span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Text Questions */}
                {currentQuestion?.type === "text" && (
                  <div className="space-y-3">
                    <textarea
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) => handleTextAnswer(e.target.value)}
                      placeholder="自由に回答してください..."
                      className="w-full p-4 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none resize-none bg-white/80"
                      rows={4}
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-500 text-right">
                      {(answers[currentQuestion.id] || "").length}/200
                    </p>
                  </div>
                )}

                {/* Clone Reaction */}
                {answers[currentQuestion.id] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200"
                  >
                    <CloneAvatar 
                      look={state.clone?.look || {}} 
                      size="sm" 
                      animated={false} 
                    />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">クローン:</span>{" "}
                      {getCloneReaction(answers[currentQuestion.id])}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentQuestionIndex === 0}
            className={currentQuestionIndex === 0 ? "invisible" : ""}
          >
            戻る
          </Button>
          
          <div className="flex items-center space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < currentQuestionIndex
                    ? 'bg-green-400'
                    : index === currentQuestionIndex
                    ? 'bg-primary-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          <Button
            onClick={handleNext}
            variant="primary"
            disabled={!canProceed}
          >
            {isLastQuestion ? "完了する ✨" : "次へ"}
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            💡 正解はありません。素直な気持ちで答えてくださいね
          </p>
        </div>

      </div>
    </div>
  );

  function getCloneReaction(answer: string): string {
    const reactions = [
      "なるほど、興味深いですね！",
      "それは素敵な考え方ですね",
      "よく分かりました！勉強になります",
      "面白い視点ですね〜",
      "そういう風に感じるんですね",
      "とても参考になります！",
    ];
    return reactions[Math.floor(Math.random() * reactions.length)];
  }
}