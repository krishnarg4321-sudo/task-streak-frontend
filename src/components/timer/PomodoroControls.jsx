import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, Plus, Sparkles } from 'lucide-react';
import ThreePomodoroCanvas from './ThreePomodoroCanvas';

export default function PomodoroControls({
  task,
  onCompleteTask,
  onUpdateTimer,
}) {
  const DEFAULT_MINUTES = 60;
  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_MINUTES * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSessionSeconds, setElapsedSessionSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
        setElapsedSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  // Sync elapsed session time to parent / backend periodically
  useEffect(() => {
    if (elapsedSessionSeconds > 0 && elapsedSessionSeconds % 10 === 0 && onUpdateTimer) {
      onUpdateTimer(10, 'progress');
    }
  }, [elapsedSessionSeconds]);

  const handleStart = () => {
    setIsRunning(true);
    if (onUpdateTimer) {
      onUpdateTimer(0, 'start');
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    if (onUpdateTimer) {
      onUpdateTimer(0, 'pause');
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(DEFAULT_MINUTES * 60);
    setTotalSeconds(DEFAULT_MINUTES * 60);
  };

  const handleAddMinutes = (mins) => {
    setTotalSeconds((prev) => prev + mins * 60);
    setRemainingSeconds((prev) => prev + mins * 60);
  };

  const handleFinish = () => {
    setIsRunning(false);
    if (onCompleteTask) {
      onCompleteTask(elapsedSessionSeconds);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressRatio = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* Circular Timer Ring with 3D Object Centered */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
          {/* Background Track */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            stroke="#000000"
            strokeWidth="12"
            fill="#FFFFFF"
            className="shadow-[4px_4px_0px_#000]"
          />
          <circle
            cx="130"
            cy="130"
            r={radius}
            stroke="#DDD6FE"
            strokeWidth="8"
            fill="none"
          />
          {/* Neon Active Progress Arc */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            stroke="#A855F7"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-300"
          />
        </svg>

        {/* 3D Hourglass Three.js Canvas centered inside ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <ThreePomodoroCanvas isRunning={isRunning} progressRatio={progressRatio} />
        </div>
      </div>

      {/* Countdown Time Display */}
      <div className="mt-4 mb-3 text-center">
        <div className="text-4xl sm:text-5xl font-black tracking-tight text-black font-sans">
          {formatTime(remainingSeconds)}
        </div>
        <p className="text-xs font-bold text-black/60 mt-1 uppercase tracking-wider">
          {isRunning ? 'Focus Mode Active' : remainingSeconds === 0 ? 'Session Complete!' : 'Ready to Grind'}
        </p>
      </div>

      {/* Quick Add Buttons */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => handleAddMinutes(1)}
          className="neo-btn px-3 py-1 bg-white text-xs font-black text-black hover:bg-zinc-100"
        >
          <Plus className="w-3 h-3 inline stroke-[3] mr-1" /> 1 min
        </button>
        <button
          onClick={() => handleAddMinutes(5)}
          className="neo-btn px-3 py-1 bg-white text-xs font-black text-black hover:bg-zinc-100"
        >
          <Plus className="w-3 h-3 inline stroke-[3] mr-1" /> 5 min
        </button>
      </div>

      {/* 3 Controls: Start, Pause, Reset/Finish */}
      <div className="flex items-center gap-3 mb-6">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="neo-btn px-8 py-3.5 bg-black text-white text-base font-black flex items-center gap-2 hover:bg-zinc-800"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start</span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="neo-btn px-8 py-3.5 bg-neo-yellow text-black text-base font-black flex items-center gap-2 hover:bg-yellow-300"
          >
            <Pause className="w-5 h-5 fill-current" />
            <span>Pause</span>
          </button>
        )}

        <button
          onClick={handleReset}
          className="neo-btn p-3.5 bg-white text-black hover:bg-zinc-100"
          title="Reset timer"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Complete Task CTA Button */}
      <button
        onClick={handleFinish}
        className="w-full max-w-sm neo-btn py-3.5 bg-[#BBF7D0] hover:bg-[#86EFAC] text-black text-base font-black flex items-center justify-center gap-2 shadow-neo-lg"
      >
        <Check className="w-5 h-5 stroke-[3]" />
        <span>Complete Task & Save Time</span>
      </button>

      {/* Recorded Time badge */}
      {task && (
        <div className="mt-4 text-xs font-bold text-black/70 bg-white/70 px-3 py-1 rounded-full border border-black/30">
          Total Time Recorded: {Math.floor((task.timeSpentSeconds || 0) / 60)}m {(task.timeSpentSeconds || 0) % 60}s
        </div>
      )}
    </div>
  );
}