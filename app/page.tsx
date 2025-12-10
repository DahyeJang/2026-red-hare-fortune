'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResultDisplay from '@/components/ResultDisplay';

export default function Home() {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ fortune: string; saju: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

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
            🚨 긴급 경보 🚨 2026년 적토마가 쳐들어온다 🚨 긴급 경보 🚨 2026년 적토마가 쳐들어온다 🚨 긴급 경보 🚨 2026년 적토마가 쳐들어온다
          </div>
        </div>

        {/* 입력 폼 */}
        {!result && (
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
