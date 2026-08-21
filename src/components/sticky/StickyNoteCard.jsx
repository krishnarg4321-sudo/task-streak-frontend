import React, { useState } from 'react';
import { Check, X, Plus, Play, ChevronRight, CheckCircle2, Clock, Circle } from 'lucide-react';
import StickyFace from './StickyFace';

export default function StickyNoteCard({
  task,
  onStatusChange,
  onChecklistChange,
  onDelete,
  onOpenDetail,
  rotation = 0,
  isHomeCompact = false,
}) {
  const [newChecklistText, setNewChecklistText] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const colorStyles = {
    yellow: 'bg-[#FEF08A] border-black',
    blue: 'bg-[#BAE6FD] border-black',
    pink: 'bg-[#FBCFE8] border-black',
    green: 'bg-[#BBF7D0] border-black',
    purple: 'bg-[#DDD6FE] border-black',
  };

  const currentBg = colorStyles[task.color] || colorStyles.yellow;

  const handleToggleChecklist = (index, e) => {
    e.stopPropagation();
    const updated = [...(task.checklist || [])];
    updated[index] = { ...updated[index], done: !updated[index].done };
    if (onChecklistChange) {
      onChecklistChange(task.id, updated);
    }
  };

  const handleAddChecklist = (e) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    const newItem = {
      id: 'c_' + Date.now(),
      text: newChecklistText.trim(),
      done: false,
    };
    const updated = [...(task.checklist || []), newItem];
    if (onChecklistChange) {
      onChecklistChange(task.id, updated);
    }
    setNewChecklistText('');
    setIsAddingItem(false);
  };

  const handleDeleteChecklistItem = (index, e) => {
    e.stopPropagation();
    const updated = (task.checklist || []).filter((_, i) => i !== index);
    if (onChecklistChange) {
      onChecklistChange(task.id, updated);
    }
  };

  const statusBadge = () => {
    if (task.status === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-[#BBF7D0] text-black border border-black shadow-[1.5px_1.5px_0px_#000]">
          <Check className="w-3 h-3 stroke-[3]" /> DONE
        </span>
      );
    }
    if (task.status === 'PARTIALLY_COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-[#FED7AA] text-black border border-black shadow-[1.5px_1.5px_0px_#000]">
          <Clock className="w-3 h-3 stroke-[2.5]" /> PARTIAL
        </span>
      );
    }
    if (task.status === 'IN_PROGRESS') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-[#BAE6FD] text-black border border-black shadow-[1.5px_1.5px_0px_#000]">
          <Play className="w-3 h-3 stroke-[2.5]" /> FOCUSING
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-white text-black border border-black shadow-[1px_1px_0px_#000]">
        TODO
      </span>
    );
  };

  return (
    <div
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`sticky-note ${currentBg} p-4 sm:p-5 flex flex-col justify-between select-none cursor-pointer transition-all duration-200`}
      onClick={() => setShowActions(!showActions)}
    >
      {/* Top Bar: Doodle Face & Close / Delete */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 flex justify-center -mt-2">
          <StickyFace type={task.face || 'wink'} className="w-14 h-7" />
        </div>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="text-black/60 hover:text-black p-1 hover:bg-black/10 rounded-full transition"
            aria-label="Delete task"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Task Header & Title */}
      <div className="mb-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-extrabold text-lg text-black leading-tight tracking-tight line-clamp-2">
            {task.name}
          </h3>
          {statusBadge()}
        </div>
        {task.description && (
          <p className="text-xs text-black/80 line-clamp-2 font-medium">
            {task.description}
          </p>
        )}
      </div>

      {/* Checklist / Subtasks */}
      <div className="space-y-1.5 mb-3 flex-1">
        {(task.checklist || []).map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={(e) => handleToggleChecklist(idx, e)}
            className="flex items-center justify-between text-xs group cursor-pointer hover:bg-black/5 p-1 rounded-md transition"
          >
            <div className="flex items-center gap-2 flex-1 pr-2">
              <div
                className={`w-4 h-4 rounded-md border-2 border-black flex items-center justify-center transition-colors ${
                  item.done ? 'bg-black text-white' : 'bg-white'
                }`}
              >
                {item.done && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className={`font-semibold ${item.done ? 'line-through text-black/40' : 'text-black'}`}>
                {item.text}
              </span>
            </div>
            <button
              onClick={(e) => handleDeleteChecklistItem(idx, e)}
              className="opacity-0 group-hover:opacity-100 text-black/50 hover:text-black p-0.5 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Add Checklist Item */}
        {!isHomeCompact && (
          <div>
            {isAddingItem ? (
              <form onSubmit={handleAddChecklist} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 mt-1">
                <input
                  type="text"
                  autoFocus
                  placeholder="Add item..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  className="w-full text-xs font-semibold px-2 py-1 bg-white border border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button type="submit" className="p-1 bg-black text-white rounded-lg hover:bg-zinc-800">
                  <Check className="w-3 h-3" />
                </button>
                <button type="button" onClick={() => setIsAddingItem(false)} className="p-1 text-black/60 hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingItem(true);
                }}
                className="text-xs font-bold text-black/70 hover:text-black flex items-center gap-1 mt-1 px-1 py-0.5 rounded hover:bg-black/5"
              >
                <Plus className="w-3 h-3 stroke-[3]" /> Add item
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3-Action Targets (Completed, Partially, Not Completed) */}
      <div className="pt-2 border-t border-black/15">
        <div className="grid grid-cols-3 gap-1 mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(task.id, 'COMPLETED');
            }}
            className={`py-1 px-1.5 text-[11px] font-extrabold rounded-lg border-2 border-black transition ${
              task.status === 'COMPLETED'
                ? 'bg-black text-white shadow-[1px_1px_0px_#000]'
                : 'bg-white hover:bg-[#BBF7D0] text-black shadow-[2px_2px_0px_#000]'
            }`}
          >
            Complete
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(task.id, 'PARTIALLY_COMPLETED');
            }}
            className={`py-1 px-1.5 text-[11px] font-extrabold rounded-lg border-2 border-black transition ${
              task.status === 'PARTIALLY_COMPLETED'
                ? 'bg-black text-white shadow-[1px_1px_0px_#000]'
                : 'bg-white hover:bg-[#FED7AA] text-black shadow-[2px_2px_0px_#000]'
            }`}
          >
            Partial
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(task.id, 'NOT_COMPLETED');
            }}
            className={`py-1 px-1.5 text-[11px] font-extrabold rounded-lg border-2 border-black transition ${
              task.status === 'NOT_COMPLETED'
                ? 'bg-black text-white shadow-[1px_1px_0px_#000]'
                : 'bg-white hover:bg-zinc-200 text-black shadow-[2px_2px_0px_#000]'
            }`}
          >
            Reset
          </button>
        </div>

        {/* Focus / Pomodoro CTA */}
        {onOpenDetail && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(task.id);
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-black text-white text-xs font-extrabold rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-zinc-800 active:translate-x-0.5 active:translate-y-0.5"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Focus Pomodoro</span>
            <ChevronRight className="w-3.5 h-3.5 ml-auto" />
          </button>
        )}
      </div>
    </div>
  );
}