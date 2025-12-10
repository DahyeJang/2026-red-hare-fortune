'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

interface ResultDisplayProps {
  fortuneText: string;
}

export default function ResultDisplay({ fortuneText }: ResultDisplayProps) {
  const [publicText, setPublicText] = useState('');
  const [secretText, setSecretText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSecret, setHasSecret] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // 데이터가 없거나 비어있으면 처리하지 않음
    if (!fortuneText || fortuneText.trim() === '') {
      setPublicText('결과를 불러오는 중입니다...');
      setSecretText('');
      setHasSecret(false);
      setCurrentIndex(0);
      setIsTyping(false);
      return;
    }

    // ---$$$--- 구분자로 나누기
    const parts = fortuneText.split('---$$$---');
    
    // 구분자가 있으면 나누고, 없으면 전체를 public으로 처리
    if (parts.length > 1) {
      setPublicText(parts[0]?.trim() || '');
      setSecretText(parts[1]?.trim() || '');
      setHasSecret(parts[1]?.trim() !== '');
    } else {
      // 구분자가 없으면 전체 텍스트를 public에 표시
      setPublicText(fortuneText.trim());
      setSecretText('');
      setHasSecret(false);
    }
    
    setCurrentIndex(0);
    setIsTyping(true);
    setIsUnlocked(false); // 새로운 결과가 오면 다시 잠금
  }, [fortuneText]);

  useEffect(() => {
    if (!isTyping || !publicText) {
      setIsTyping(false);
      return;
    }

    if (currentIndex >= publicText.length) {
      setIsTyping(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => {
        if (prev >= publicText.length) {
          setIsTyping(false);
          return prev;
        }
        return prev + 1;
      });
    }, 30); // 타자기 속도 조절

    return () => clearTimeout(timer);
  }, [currentIndex, isTyping, publicText]);

  const handlePayment = () => {
    // TODO: 결제 기능 연결
    alert('결제 기능은 곧 연결됩니다!');
    // 결제 성공 시 setIsUnlocked(true);
  };

  const displayedText = publicText.slice(0, currentIndex);

  // fortuneText가 없으면 로딩 메시지 표시
  if (!fortuneText || fortuneText.trim() === '') {
    return (
      <div className="w-full max-w-4xl mx-auto border-4 border-[#00FF00] p-6 bg-black">
        <div className="bg-[#FF00FF] p-6 border-4 border-[#FF00FF] shadow-[0_0_20px_#FF00FF]">
          <div className="bg-black p-6 min-h-[300px]">
            <div className="text-[#FF00FF] font-mono text-sm leading-relaxed">
              결과를 불러오는 중입니다...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto border-4 border-[#00FF00] p-6 bg-black space-y-8">
      {/* Public Section - 형광 핑크 박스 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#FF00FF] p-6 border-4 border-[#FF00FF] shadow-[0_0_20px_#FF00FF]"
        style={{
          boxShadow: '0 0 30px #FF00FF, inset 0 0 20px rgba(255, 0, 255, 0.3)',
        }}
      >
        <div className="bg-black p-6 min-h-[300px]">
          <div className="text-[#FF00FF] font-mono text-sm leading-relaxed">
            {isTyping ? (
              <div className="whitespace-pre-wrap">
                {displayedText}
                <span className="cursor-blink text-[#FF00FF]">|</span>
              </div>
            ) : (
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="bg-[#FF00FF] text-black font-bold text-xl p-2 mb-4 block w-full">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="bg-[#FF00FF] text-black font-bold text-lg p-2 mb-3 mt-4 block w-full">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="bg-[#FF00FF] text-black font-bold text-base p-2 mb-2 mt-3 block w-full">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-[#00FF00] leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-yellow-400 font-bold">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="text-[#00FF00] italic">
                      {children}
                    </em>
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside space-y-2 my-4 text-[#00FF00]" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="pl-1 text-[#00FF00] mb-2" {...props} />
                  ),
                }}
              >
                {publicText || '결과를 불러오는 중입니다...'}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </motion.div>

      {/* Secret Section - 유료 리포트 (구분자가 있을 때만 표시) */}
      {hasSecret && secretText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative mt-8 border-4 border-[#FF00FF] p-4 bg-black"
        >
          {/* 1. 타이틀 (항상 보임) */}
          <div className="bg-[#FF00FF] text-black font-bold p-2 mb-4 text-center animate-pulse">
            🚨 적토마 시크릿 리포트 (유료) 🚨
          </div>

          {/* 2. 내용 영역 (잠겨있음) */}
          <div className={`relative ${isUnlocked ? '' : 'h-[600px] overflow-hidden'}`}>
            {/* 실제 텍스트 내용 */}
            <div className={isUnlocked ? '' : 'filter blur-md select-none opacity-50'}>
              <div className="text-[#00FF00] font-mono text-sm leading-relaxed">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="bg-[#FF00FF] text-black font-bold text-xl p-2 mb-4 block w-full">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="bg-[#FF00FF] text-black font-bold text-lg p-2 mb-3 mt-4 block w-full">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="bg-[#FF00FF] text-black font-bold text-base p-2 mb-2 mt-3 block w-full">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-[#00FF00] leading-relaxed mb-4">
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-yellow-400 font-bold">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="text-[#00FF00] italic">
                        {children}
                      </em>
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside space-y-2 my-4 text-[#00FF00]" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="pl-1 text-[#00FF00] mb-2" {...props} />
                    ),
                  }}
                >
                  {secretText}
                </ReactMarkdown>
              </div>
            </div>

            {/* 3. 잠금 해제 버튼 (블러 위에 둥둥 떠있어야 함 - Absolute Position) */}
            {!isUnlocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
                <motion.button
                  onClick={handlePayment}
                  className="bg-yellow-400 border-4 border-white text-black font-bold text-xl py-4 px-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-none transition-all animate-bounce"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔒 1,000원에 봉인 해제
                </motion.button>
                <p className="mt-4 text-white font-bold drop-shadow-[0_0_4px_rgba(0,0,0,1)]">
                  (이미 1,240명이 팩폭을 확인했습니다)
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
