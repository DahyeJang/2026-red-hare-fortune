'use client';

import { useState } from 'react';

export default function NativeShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // 공유할 데이터 설정
    const shareData = {
      title: '🚨 적토마의 2026년 팩트폭행 운세',
      text: '내년 네 운세가 불타고 있다... 늦기 전에 확인해라.',
      url: window.location.origin, // 현재 사이트 주소
    };

    try {
      // 1. 모바일 등 시스템 공유가 가능한 경우
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // 2. PC 등 지원하지 않는 경우 -> 클립보드 복사
        await navigator.clipboard.writeText(window.location.origin);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // 2초 뒤 원상복구
      }
    } catch (err) {
      console.error('공유 실패:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="win95-button w-full md:w-auto md:flex-1 h-16 md:h-20 text-xl md:text-2xl font-bold font-dunggeunmo bg-red-600 text-white border-2 border-black shadow-none flex items-center justify-center gap-2 px-6"
      style={{ backgroundColor: '#DC2626', color: 'white', borderColor: 'black' }}
    >
      {copied ? '✅ 링크 복사 완료!' : '🔥 2026년 운세 공유하기'}
    </button>
  );
}

