import React from 'react';

export default function StickyFace({ type = 'wink', className = 'w-16 h-8' }) {
  switch (type) {
    case 'happy':
    case 'wink':
      // From Yellow Sticky: Eyes with slant/wink & cute open mouth
      return (
        <svg viewBox="0 0 100 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left Eyebrow & Eye (Wink) */}
          <path d="M22 10 L34 14" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M24 22 Q30 16 36 22" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Right Eyebrow & Eye */}
          <path d="M78 10 L66 14" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M64 22 Q70 16 76 22" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Cute Mouth */}
          <path d="M46 26 Q50 36 54 26 Z" fill="#000000" stroke="#000000" strokeWidth="1" />
        </svg>
      );

    case 'frown':
    case 'grumpy':
      // From Blue Sticky: Slanted angry/annoyed brows and dot eyes, frown mouth
      return (
        <svg viewBox="0 0 100 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Eyebrows angled inward */}
          <path d="M24 12 L38 17" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M76 12 L62 17" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
          {/* Dot Eyes */}
          <circle cx="32" cy="24" r="3.5" fill="#000000" />
          <circle cx="68" cy="24" r="3.5" fill="#000000" />
          {/* Frown Mouth */}
          <path d="M44 32 Q50 26 56 32" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'poker':
    case 'focused':
    default:
      // From Pink Sticky: Horizontal brows, dot eyes, straight deadpan mouth
      return (
        <svg viewBox="0 0 100 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Straight Brows */}
          <line x1="24" y1="14" x2="38" y2="16" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="76" y1="14" x2="62" y2="16" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
          {/* Dot Eyes */}
          <circle cx="32" cy="23" r="3.5" fill="#000000" />
          <circle cx="68" cy="23" r="3.5" fill="#000000" />
          {/* Straight Flat Mouth */}
          <line x1="45" y1="30" x2="55" y2="30" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
  }
}