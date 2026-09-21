import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Check, Plus, Minus, Volume2, VolumeX, Sparkles } from 'lucide-react';
import ThreePomodoroCanvas from './ThreePomodoroCanvas';
import { focusAudio } from './FocusAudioSynth';
import { requestNotificationPermission, sendPushNotification } from '../../utils/notifications';

const STORAGE_KEY = 'taskstreak_active_pomodoro';

export default function PomodoroControls({
  task,
  onCompleteTask,
  onUpdateTimer,
}) {
  const DEFAULT_MINUTES = 25;
  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_MINUTES * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [elapsedSessionSeconds, setElapsedSessionSeconds] = useState(0);

  const targetEndTimeRef = useRef(null);

  // Restore saved pomodoro state from localStorage on mount
  useEffect(() => {
    requestNotificationPermission();

    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY);
      if (savedRaw) {
        const saved = JSON.parse(savedRaw);
        if (saved && saved.taskId === task?.id) {
          setTotalSeconds(saved.totalSeconds || DEFAULT_MINUTES * 60);
          setElapsedSessionSeconds(saved.elapsedSessionSeconds || 0);

          if (saved.isRunning && saved.targetEndTime) {
            const now = Date.now();
            const leftMs = saved.targetEndTime - now;
            if (leftMs > 0) {
              const leftSec = Math.round(leftMs / 1000);
              setRemainingSeconds(leftSec);
              targetEndTimeRef.current = saved.targetEndTime;
              setIsRunning(true);
            } else {
              // Expired while in background
              setRemainingSeconds(0);
              setIsRunning(false);
              targetEndTimeRef.current = null;
              sendPushNotification('Pomodoro Session Completed!', {
                body: `Great focus! You completed your session for "${task?.name || 'Task'}".`,
              });
            }
          } else {
            setRemainingSeconds(saved.remainingSeconds || DEFAULT_MINUTES * 60);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to restore pomodoro state:', e);
    }
  }, [task?.id]);

  // Handle visibility change and background timer accuracy
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (isRunning && targetEndTimeRef.current) {
        const now = Date.now();
        const leftMs = targetEndTimeRef.current - now;
        if (leftMs <= 0) {
          setRemainingSeconds(0);
          setIsRunning(false);
          targetEndTimeRef.current = null;
          localStorage.removeItem(STORAGE_KEY);
          sendPushNotification('Pomodoro Session Completed!', {
            body: `Focus session ended for "${task?.name || 'Task'}"! Click to finalize.`,
          });
        } else {
          setRemainingSeconds(Math.round(leftMs / 1000));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [isRunning, task?.name]);

  // High-accuracy timer tick loop using Date.now()
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        if (!targetEndTimeRef.current) return;
        const now = Date.now();
        const leftMs = targetEndTimeRef.current - now;

        if (leftMs <= 0) {
          setRemainingSeconds(0);
          setIsRunning(false);
          targetEndTimeRef.current = null;
          localStorage.removeItem(STORAGE_KEY);
          if (isAudioPlaying) {
            focusAudio.stop();
            setIsAudioPlaying(false);
          }
          sendPushNotification('Pomodoro Focus Session Finished!', {
            body: `You finished your focus block for "${task?.name || 'Task'}". Time for a quick break!`,
          });
        } else {
          const secs = Math.round(leftMs / 1000);
          setRemainingSeconds(secs);
          setElapsedSessionSeconds((prev) => prev + 1);

          // Save active state to localStorage
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              taskId: task?.id,
              totalSeconds,
              remainingSeconds: secs,
              targetEndTime: targetEndTimeRef.current,
              isRunning: true,
              elapsedSessionSeconds: elapsedSessionSeconds + 1,
            })
          );
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, totalSeconds, elapsedSessionSeconds, isAudioPlaying, task?.id, task?.name]);

  // Periodic backend sync
  useEffect(() => {
    if (elapsedSessionSeconds > 0 && elapsedSessionSeconds % 10 === 0 && onUpdateTimer && task?.id) {
      onUpdateTimer(10, 'progress');
    }
  }, [elapsedSessionSeconds]);

  const handleStart = () => {
    const targetEndTime = Date.now() + remainingSeconds * 1000;
    targetEndTimeRef.current = targetEndTime;
    setIsRunning(true);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        taskId: task?.id,
        totalSeconds,
        remainingSeconds,
        targetEndTime,
        isRunning: true,
        elapsedSessionSeconds,
      })
    );

    if (onUpdateTimer && task?.id) {
      onUpdateTimer(0, 'start');
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    targetEndTimeRef.current = null;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        taskId: task?.id,
        totalSeconds,
        remainingSeconds,
        targetEndTime: null,
        isRunning: false,
        elapsedSessionSeconds,
      })
    );

    if (onUpdateTimer && task?.id) {
      onUpdateTimer(0, 'pause');
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    const defaultSecs = DEFAULT_MINUTES * 60;
    setRemainingSeconds(defaultSecs);
    setTotalSeconds(defaultSecs);
    localStorage.removeItem(STORAGE_KEY);
    if (isAudioPlaying) {
      focusAudio.stop();
      setIsAudioPlaying(false);
    }
  };

  const handleAdjustMinutes = (deltaMins) => {
    const deltaSecs = deltaMins * 60;
    const newTotal = Math.max(300, totalSeconds + deltaSecs); // Min 5 mins
    const newRem = Math.max(0, remainingSeconds + deltaSecs);
    setTotalSeconds(newTotal);
    setRemainingSeconds(newRem);

    if (isRunning) {
      const newTarget = Date.now() + newRem * 1000;
      targetEndTimeRef.current = newTarget;
    }
  };

  const handleToggleAudio = () => {
    const playing = focusAudio.toggle();
    setIsAudioPlaying(playing);
  };

  const handleFinish = () => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    localStorage.removeItem(STORAGE_KEY);
    if (isAudioPlaying) {
      focusAudio.stop();
      setIsAudioPlaying(false);
    }
    if (onCompleteTask && task?.id) {
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
      {/* Background Focus Audio Synthesizer Control */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleToggleAudio}
          className={`neo-btn px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-2 transition ${
            isAudioPlaying
              ? 'bg-[#FEF08A] text-black shadow-[2.5px_2.5px_0px_#000] ring-2 ring-black'
              : 'bg-white text-black hover:bg-zinc-100'
          }`}
          title="Toggle Ambient Lofi/Binaural Focus Music"
        >
          {isAudioPlaying ? (
            <>
              <Volume2 className="w-4 h-4 stroke-[2.5] text-amber-600 animate-pulse" />
              <span>Focus Music: ON 🎵</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 stroke-[2.5] text-black/60" />
              <span>Focus Music: OFF</span>
            </>
          )}
        </button>
      </div>

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
          {isRunning ? 'Focus Mode Active (Runs in background)' : remainingSeconds === 0 ? 'Session Complete!' : 'Ready to Grind'}
        </p>
      </div>

      {/* Quick Adjust Buttons: - 5 min and + 5 min */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => handleAdjustMinutes(-5)}
          className="neo-btn px-3.5 py-1.5 bg-white text-xs font-black text-black hover:bg-zinc-100 flex items-center gap-1"
          title="Decrease by 5 minutes"
        >
          <Minus className="w-3.5 h-3.5 stroke-[3]" />
          <span>5 min</span>
        </button>
        <button
          onClick={() => handleAdjustMinutes(5)}
          className="neo-btn px-3.5 py-1.5 bg-white text-xs font-black text-black hover:bg-zinc-100 flex items-center gap-1"
          title="Increase by 5 minutes"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>5 min</span>
        </button>
      </div>

      {/* Controls: Start, Pause, Reset */}
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