'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResultDisplay from '@/components/ResultDisplay';

const loadingMessages = [
  '적토마가 당근 먹는 중...',
  '네 사주팔자 훔쳐보는 중...',
  '2026년 불지옥 온도 체크 중...',
  '너의 과거 행실 조회 중...',
  '팩트폭행 장전 중...',
  '서버가 불타오르는 중...'
];

export default function Home() {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ fortune: string; saju: any } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(0);

  // 로딩 메시지 순환
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentLoadingMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 2000); // 2초마다 변경

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCurrentLoadingMessage(0);

    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDate,
          birthTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '운세 생성에 실패했습니다.');
      }

      const data = await response.json();
      console.log('API Response:', data);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#00FF00] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 헤더 - Marquee 효과 */}
        <div className="overflow-hidden bg-[#FF00FF] py-4 border-4 border-[#FF00FF] shadow-[0_0_20px_#FF00FF]">
          <div className="marquee text-black font-bold text-2xl md:text-4xl">
            🚨 긴급 경보 🚨 2026년 적토마의 팩트폭행 운세
            🚨 긴급 경보 🚨 2026년 적토마의 팩트폭행 운세
            🚨 긴급 경보 🚨 2026년 적토마의 팩트폭행 운세
          </div>
        </div>

        {/* 로딩 화면 */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black border-4 border-[#00FF00] p-8 shadow-[0_0_20px_#00FF00]"
          >
            <div className="text-center py-12">
              <motion.div
                key={currentLoadingMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-[#00FF00] font-mono text-2xl md:text-3xl font-bold animate-pulse"
              >
                {loadingMessages[currentLoadingMessage]}
              </motion.div>
              <div className="mt-8 flex justify-center gap-2">
                <motion.div
                  className="w-3 h-3 bg-[#00FF00] rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-3 h-3 bg-[#00FF00] rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-3 h-3 bg-[#00FF00] rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* 입력 폼 */}
        {!result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black border-4 border-[#00FF00] p-8 shadow-[0_0_20px_#00FF00]"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#00FF00] text-center">
              &gt; 사주 정보 입력
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 생년월일 */}
              <div>
                <label className="block mb-2 text-[#00FF00] font-bold">
                  생년월일 (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="dos-input w-full"
                  required
                />
              </div>

              {/* 태어난 시간 */}
              <div>
                <label className="block mb-2 text-[#00FF00] font-bold">
                  태어난 시간 (0-23)
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="dos-input w-full"
                  placeholder="14"
                  required
                />
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="bg-red-900 border-2 border-red-500 p-4 text-red-200">
                  ⚠️ {error}
                </div>
              )}

              {/* 제출 버튼 */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="win95-button w-full py-4 text-lg font-bold bg-gradient-to-r from-[#FF00FF] to-[#00FF00] text-black border-4 border-white shadow-[0_0_30px_#FF00FF] relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: '0 0 40px #FF00FF, 0 0 80px #00FF00, inset 0 0 20px rgba(255, 255, 255, 0.3)',
                }}
              >
                {isLoading ? (
                  <span className="sparkle">🔥 팩트폭행 준비 중... 🔥</span>
                ) : (
                  '🔥 팩트폭행 맞기 🔥'
                )}
                
                {/* 불꽃 효과 */}
                {isLoading && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <div className="absolute top-0 left-1/4 text-2xl">🔥</div>
                    <div className="absolute top-0 right-1/4 text-2xl">💥</div>
                    <div className="absolute bottom-0 left-1/3 text-2xl">⚡</div>
                    <div className="absolute bottom-0 right-1/3 text-2xl">✨</div>
                  </motion.div>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* 결과 표시 */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <ResultDisplay fortuneText={result.fortune} />
              
              {/* 다시 시작 버튼 */}
              <div className="text-center">
                <motion.button
                  onClick={() => {
                    setResult(null);
                    setBirthDate('');
                    setBirthTime('');
                    setError(null);
                  }}
                  className="win95-button bg-[#00FF00] text-black border-4 border-white px-8 py-4 text-lg font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  다시 시작하기
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
    </div>
  );
}
