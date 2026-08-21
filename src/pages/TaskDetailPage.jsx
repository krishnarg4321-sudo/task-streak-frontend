import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles, Clock, Layers, CheckSquare } from 'lucide-react';
import PomodoroControls from '../components/timer/PomodoroControls';
import StickyFace from '../components/sticky/StickyFace';
import { triggerTaskCelebration } from '../components/common/ConfettiCelebration';

export default function TaskDetailPage({
  task,
  onBack,
  onUpdateTimer,
  onCompleteTask,
  onChecklistChange,
}) {
  if (!task) {
    return (
      <div className="neo-box p-8 bg-white text-center">
        <p className="text-sm font-bold text-black/60 mb-3">No task selected.</p>
        <button onClick={onBack} className="neo-btn px-4 py-2 bg-black text-white text-xs font-black">
          Go Back
        </button>
      </div>
    );
  }

  const handleFinalizeTask = (elapsedSeconds) => {
    triggerTaskCelebration();
    onCompleteTask(task.id, elapsedSeconds);
  };

  const handleTimerTick = (additionalSecs, action) => {
    onUpdateTimer(task.id, additionalSecs, action);
  };

  const colorStyles = {
    yellow: 'bg-[#FEF08A]',
    blue: 'bg-[#BAE6FD]',
    pink: 'bg-[#FBCFE8]',
    green: 'bg-[#BBF7D0]',
    purple: 'bg-[#DDD6FE]',
  };
  const cardColor = colorStyles[task.color] || 'bg-white';

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Header / Back Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2.5 rounded-2xl border-2 border-black bg-white hover:bg-zinc-100 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-1.5 font-extrabold text-xs"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Today's Tasks</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-white border border-black rounded-full shadow-[1.5px_1.5px_0px_#000]">
            Focus Room
          </span>
        </div>
      </div>

      {/* Task Summary Banner */}
      <div className={`p-5 rounded-neo-xl border-3 border-black ${cardColor} shadow-neo flex items-start justify-between gap-4`}>
        <div className="flex-1">
          <div className="inline-block mb-1">
            <StickyFace type={task.face || 'focused'} className="w-12 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight">
            {task.name}
          </h2>
          {task.description && (
            <p className="text-xs font-semibold text-black/80 mt-1.5 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border border-black shadow-[1.5px_1.5px_0px_#000] ${
            task.status === 'COMPLETED' ? 'bg-[#BBF7D0]' : 'bg-white'
          }`}>
            {task.status}
          </span>
        </div>
      </div>

      {/* 3D Pomodoro Focus Object & Circular Timer Component */}
      <div className="neo-box p-6 bg-white border-3 border-black">
        <div className="text-center mb-1">
          <h3 className="font-black text-sm uppercase tracking-wider text-black">
            3D Pomodoro Focus Object
          </h3>
          <p className="text-[11px] font-semibold text-black/50">
            Interactive WebGL 3D Hourglass • Click and Drag to Inspect
          </p>
        </div>

        <PomodoroControls
          task={task}
          onUpdateTimer={handleTimerTick}
          onCompleteTask={handleFinalizeTask}
        />
      </div>

      {/* Subtasks Checklist Section */}
      {(task.checklist || []).length > 0 && (
        <div className="neo-box p-5 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-4 h-4 stroke-[2.5]" />
            <h4 className="font-black text-xs uppercase tracking-wider text-black">
              Session Checklist ({task.checklist.filter(c => c.done).length}/{task.checklist.length})
            </h4>
          </div>

          <div className="space-y-2">
            {task.checklist.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => {
                  const updated = [...task.checklist];
                  updated[idx] = { ...updated[idx], done: !updated[idx].done };
                  onChecklistChange(task.id, updated);
                }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-black bg-zinc-50 hover:bg-zinc-100 cursor-pointer transition shadow-[1.5px_1.5px_0px_#000]"
              >
                <div className={`w-4 h-4 rounded-md border-2 border-black flex items-center justify-center ${
                  item.done ? 'bg-black text-white' : 'bg-white'
                }`}>
                  {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={`text-xs font-bold ${item.done ? 'line-through text-black/40' : 'text-black'}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}