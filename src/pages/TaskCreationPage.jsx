import React, { useState } from 'react';
import { Plus, Sparkles, CheckCircle2, Flame, Layers } from 'lucide-react';
import StickyNoteCard from '../components/sticky/StickyNoteCard';
import StickyModal from '../components/sticky/StickyModal';
import { triggerTaskCelebration } from '../components/common/ConfettiCelebration';

export default function TaskCreationPage({
  tasks = [],
  onCreateTask,
  onStatusChange,
  onChecklistChange,
  onDeleteTask,
  onOpenTaskDetail,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChangeWithCelebration = (taskId, newStatus) => {
    if (newStatus === 'COMPLETED') {
      triggerTaskCelebration();
    }
    onStatusChange(taskId, newStatus);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* SECTION TOP: Primary + Create Task Action Banner */}
      <div className="neo-box p-6 bg-[#FEF08A] border-3 border-black relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-black text-xs font-black mb-2 shadow-[1px_1px_0px_#000]">
              <Flame className="w-3.5 h-3.5 fill-current text-orange-500 stroke-[2.5]" />
              <span>Implicit Daily Attendance Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight">
              Create Sticky Task
            </h2>
            <p className="text-xs font-bold text-black/70 mt-1 max-w-sm">
              Every task you create automatically marks your daily presence and counts toward your streak!
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto neo-btn px-6 py-3.5 bg-black text-white text-sm font-black flex items-center justify-center gap-2 hover:bg-zinc-800 shadow-neo-lg active:translate-x-0.5 active:translate-y-0.5"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>+ Create New Sticky</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: 2-Column Responsive Grid with 3D Sticky Notes Component */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 stroke-[2.5]" />
            <h3 className="text-base font-black uppercase tracking-tight text-black">
              Today's Created Sticky Grid ({tasks.length})
            </h3>
          </div>
          <span className="text-xs font-bold text-black/60">2-Column Layout</span>
        </div>

        {tasks.length === 0 ? (
          <div className="neo-box p-10 bg-white border-2 border-black rounded-neo-lg text-center">
            <p className="text-sm font-extrabold text-black/60 mb-3">No sticky notes created yet today.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="neo-btn px-5 py-2.5 bg-[#BBF7D0] text-black font-black text-xs"
            >
              + Create First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {tasks.map((task, idx) => (
              <StickyNoteCard
                key={task.id}
                task={task}
                rotation={idx % 2 === 0 ? -1 : 1.2}
                onStatusChange={handleStatusChangeWithCelebration}
                onChecklistChange={onChecklistChange}
                onDelete={onDeleteTask}
                onOpenDetail={onOpenTaskDetail}
              />
            ))}
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <StickyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateTask={onCreateTask}
      />
    </div>
  );
}