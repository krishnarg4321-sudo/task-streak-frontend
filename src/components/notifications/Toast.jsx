import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;

  const bgStyles = {
    info: 'bg-[#BAE6FD]',
    success: 'bg-[#BBF7D0]',
    warning: 'bg-[#FEF08A]',
    error: 'bg-[#FBCFE8]',
  };

  const currentBg = bgStyles[type] || bgStyles.info;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <div className={`p-3.5 rounded-2xl border-2 border-black shadow-neo flex items-center justify-between gap-3 ${currentBg} animate-bounce-short`}>
        <div className="flex items-center gap-2.5">
          {type === 'success' ? (
            <CheckCircle className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <AlertCircle className="w-5 h-5 stroke-[2.5]" />
          )}
          <span className="text-xs font-extrabold text-black leading-snug">{message}</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-lg">
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
}