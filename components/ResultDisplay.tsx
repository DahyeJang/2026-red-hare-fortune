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

  // 공통 마크다운 컴포넌트 스타일
  const markdownComponents = {
    h1: ({ node, ...props }: any) => (
      <h1 
        className="text-3xl md:text-4xl font-extrabold text-[#00FF00] mb-6 mt-12 tracking-wider" 
        {...props} 
      />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 
        className="text-2xl md:text-3xl font-extrabold text-[#00FF00] mb-4 mt-8 tracking-wide" 
        {...props} 
      />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 
        className="text-xl md:text-2xl font-extrabold text-[#00FF00] mb-3 mt-6 tracking-wide" 
        {...props} 
      />
    ),
    p: ({ node, ...props }: any) => (
      <p 
        className="text-xl md:text-2xl text-[#F0F0F0] leading-relaxed mb-6 font-sans" 
        {...props} 
      />
    ),
    strong: ({ node, ...props }: any) => (
      <strong 
        className="text-[#FF00FF] font-black" 
        {...props} 
      />
    ),
    em: ({ node, ...props }: any) => (
      <em 
        className="text-[#F0F0F0] italic" 
        {...props} 
      />
    ),
    ol: ({ node, ...props }: any) => (
      <ol 
        className="list-decimal list-inside space-y-6 my-8 text-[#F0F0F0] text-xl font-sans" 
        {...props} 
      />
    ),
    ul: ({ node, ...props }: any) => (
      <ul 
        className="list-disc list-inside space-y-6 my-8 text-[#F0F0F0] text-xl font-sans" 
        {...props} 
      />
    ),
    li: ({ node, ...props }: any) => (
      <li 
        className="pl-2 text-[#F0F0F0] font-sans" 
        {...props} 
      />
    ),
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-8 bg-black shadow-[0_0_20px_#00FF00_inset] rounded-lg relative overflow-hidden">
      {/* 배경에 은은한 스캔라인 효과 (CSS로 구현) */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
        }}
      />

      {/* 무료 결과 (Public) */}
      <div className="mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isTyping ? (
            <div className="whitespace-pre-wrap text-[#F0F0F0] text-xl md:text-2xl leading-relaxed font-sans">
              {displayedText}
              <span className="cursor-blink text-[#F0F0F0]">|</span>
            </div>
          ) : (
            <ReactMarkdown components={markdownComponents}>
              {publicText || '결과를 불러오는 중입니다...'}
            </ReactMarkdown>
          )}
        </motion.div>
      </div>

      {/* Secret Section - 유료 리포트 (구분자가 있을 때만 표시) */}
      {hasSecret && secretText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative mt-8 p-4 relative z-10"
        >
          {/* 1. 타이틀 (항상 보임) */}
          <div className="text-[#FF00FF] font-bold p-2 mb-4 text-center animate-pulse text-2xl md:text-3xl drop-shadow-[0_0_8px_#FF00FF]">
            🚨 적토마 시크릿 리포트 (유료) 🚨
          </div>

          {/* 2. 내용 영역 (잠겨있음) */}
          <div className={`relative ${isUnlocked ? 'h-auto' : 'h-[400px] overflow-hidden'}`}>
            {/* 실제 텍스트 내용 */}
            <div className={isUnlocked ? '' : 'filter blur-xl select-none opacity-40 transition-all duration-700'}>
              <ReactMarkdown components={markdownComponents}>
                {secretText}
              </ReactMarkdown>
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
