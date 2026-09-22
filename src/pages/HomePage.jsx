import React, { useState, useEffect } from 'react';
import { Plus, ArrowUpRight, CheckCircle, Clock, AlertCircle, ChevronRight, Layers, Sparkles, Zap, Timer, Play } from 'lucide-react';
import StickyNoteCard from '../components/sticky/StickyNoteCard';
import DonutProgressChart from '../components/charts/DonutProgressChart';
import TrendLineChart from '../components/charts/TrendLineChart';
import { triggerTaskCelebration } from '../components/common/ConfettiCelebration';

export default function HomePage({
  todayTasks = [],
  historyData,
  onStatusChange,
  onChecklistChange,
  onOpenTaskDetail,
  onNavigateTab,
}) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAllTasksModal, setShowAllTasksModal] = useState(false);
  const [activeTimerTask, setActiveTimerTask] = useState(null);

  const categories = ['All', 'Focus'];

  // Check if there is an active running pomodoro session stored
  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem('taskstreak_active_pomodoro');
      if (savedRaw) {
        const saved = JSON.parse(savedRaw);
        if (saved && saved.taskId) {
          const matched = todayTasks.find((t) => t.id === saved.taskId);
          if (matched) {
            setActiveTimerTask({ ...matched, remainingSeconds: saved.remainingSeconds, isRunning: saved.isRunning });
            return;
          }
        }
      }
      // Check in-progress tasks
      const inProg = todayTasks.find((t) => t.status === 'IN_PROGRESS');
      if (inProg) {
        setActiveTimerTask(inProg);
      } else {
        setActiveTimerTask(null);
      }
    } catch (e) {
      setActiveTimerTask(null);
    }
  }, [todayTasks]);

  // Handle task status update with celebration trigger
  const handleTaskStatus = (taskId, newStatus) => {
    if (newStatus === 'COMPLETED') {
      triggerTaskCelebration();
    }
    onStatusChange(taskId, newStatus);
  };

  const handleCategoryClick = (cat) => {
    if (cat === 'Focus') {
      // Direct navigation to active pomodoro task
      try {
        const savedRaw = localStorage.getItem('taskstreak_active_pomodoro');
        if (savedRaw) {
          const saved = JSON.parse(savedRaw);
          if (saved && saved.taskId) {
            onOpenTaskDetail(saved.taskId);
            return;
          }
        }
      } catch (e) {}

      // Find in-progress task or task with recorded time
      const inProgressTask = todayTasks.find((t) => t.status === 'IN_PROGRESS' || (t.timeSpentSeconds && t.timeSpentSeconds > 0));
      if (inProgressTask) {
        onOpenTaskDetail(inProgressTask.id);
        return;
      }

      // Find first incomplete task
      const firstIncomplete = todayTasks.find((t) => t.status !== 'COMPLETED');
      if (firstIncomplete) {
        onOpenTaskDetail(firstIncomplete.id);
        return;
      }

      if (todayTasks.length > 0) {
        onOpenTaskDetail(todayTasks[0].id);
        return;
      }

      onNavigateTab('create');
    } else {
      setFilterCategory(cat);
    }
  };

  const filteredTasks = todayTasks.filter((t) => {
    if (filterCategory === 'Focus') {
      return t.status === 'IN_PROGRESS' || (t.timeSpentSeconds && t.timeSpentSeconds > 0);
    }
    return true;
  });

  const completedCount = todayTasks.filter((t) => t.status === 'COMPLETED').length;
  const partialCount = todayTasks.filter((t) => t.status === 'PARTIALLY_COMPLETED').length;
  const notCompletedCount = todayTasks.filter(
    (t) => t.status === 'NOT_COMPLETED' || t.status === 'IN_PROGRESS'
  ).length;

  const displayStickyTasks = filteredTasks.slice(0, 3);
  const hasMoreTasks = filteredTasks.length > 3;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-2 text-xs font-black rounded-full border-2 border-black transition-all flex items-center gap-1.5 ${
              filterCategory === cat
                ? 'bg-black text-white shadow-[2px_2px_0px_#000]'
                : 'bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-zinc-100'
            }`}
          >
            {cat === 'Focus' && <Zap className="w-3.5 h-3.5 fill-current text-yellow-400" />}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* ACTIVE FOCUS BANNER (If a pomodoro task is in progress or active) */}
      {activeTimerTask && (
        <div
          onClick={() => onOpenTaskDetail(activeTimerTask.id)}
          className="cursor-pointer neo-box p-4 bg-[#FEF08A] border-3 border-black flex items-center justify-between gap-3 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000] group-hover:scale-105 transition">
              <Timer className="w-5 h-5 stroke-[2.5] text-[#FEF08A] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white rounded-full">
                  Active Pomodoro Task
                </span>
              </div>
              <h4 className="font-black text-sm text-black leading-tight mt-0.5">
                {activeTimerTask.name}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-black text-black">
              Resume Focus
            </span>
            <div className="p-2 bg-black text-white rounded-xl border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1 (TOP): Today's Task Floating 3D Sticky Notes */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 stroke-[2.5]" />
            <h2 className="text-lg font-black uppercase tracking-tight text-black">
              Today's Tasks
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {hasMoreTasks && (
              <button
                onClick={() => setShowAllTasksModal(true)}
                className="text-xs font-black px-2.5 py-1 bg-[#FED7AA] hover:bg-[#FDBA74] border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-1"
              >
                <span>See More ({todayTasks.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}
            <button
              onClick={() => onNavigateTab('create')}
              className="p-1.5 bg-black text-white rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-zinc-800"
              title="Add New Task"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        {todayTasks.length === 0 ? (
          <div className="neo-box p-8 bg-[#FFF7ED] border-3 border-black rounded-neo-xl text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#FEF08A] border-2 border-black shadow-neo-sm mx-auto mb-3 flex items-center justify-center">
              <Sparkles className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="font-black text-lg text-black mb-1">No Sticky Notes Today</h3>
            <p className="text-xs font-bold text-black/60 max-w-sm mx-auto mb-4">
              Add your first task of the day to mark your daily attendance and keep your streak burning!
            </p>
            <button
              onClick={() => onNavigateTab('create')}
              className="neo-btn px-6 py-3 bg-black text-white text-xs font-black"
            >
              + Create Today's First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayStickyTasks.map((task, idx) => (
              <StickyNoteCard
                key={task.id}
                task={task}
                rotation={idx === 0 ? -1.5 : idx === 1 ? 1.5 : -0.5}
                onStatusChange={handleTaskStatus}
                onChecklistChange={onChecklistChange}
                onOpenDetail={onOpenTaskDetail}
              />
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Today's Graph / Progress Summary (Donut Chart) */}
      <div>
        <DonutProgressChart
          completed={completedCount}
          partial={partialCount}
          notCompleted={notCompletedCount}
        />
      </div>

      {/* SECTION 3: Comparative 7-Day Progress Trend */}
      <div>
        <TrendLineChart
          data={historyData?.trend || []}
          title="Your 7-Day Progress Velocity"
        />
      </div>

      {/* Modal / Full View for "See More" Today's Tasks */}
      {showAllTasksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border-3 border-black rounded-neo-xl shadow-neo-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 bg-[#FFE2CA] border-b-2 border-black flex items-center justify-between">
              <h3 className="font-black text-lg text-black">All Today's Tasks ({todayTasks.length})</h3>
              <button
                onClick={() => setShowAllTasksModal(false)}
                className="p-1.5 bg-white rounded-xl border border-black hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl border-2 border-black bg-zinc-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[2.5px_2.5px_0px_#000]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl border-2 border-black bg-[#FEF08A] flex items-center justify-center font-black text-sm">
                      {task.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-black">{task.name}</h4>
                      <p className="text-xs font-medium text-black/60">
                        {task.checklist?.length || 0} subtasks • {Math.floor((task.timeSpentSeconds || 0) / 60)}m spent
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleTaskStatus(task.id, 'COMPLETED')}
                      className={`flex-1 sm:flex-none px-3 py-1 text-xs font-black rounded-xl border-2 border-black ${
                        task.status === 'COMPLETED' ? 'bg-black text-white' : 'bg-white hover:bg-[#BBF7D0]'
                      }`}
                    >
                      Done
                    </button>
                    <button
                      onClick={() => {
                        setShowAllTasksModal(false);
                        onOpenTaskDetail(task.id);
                      }}
                      className="px-3 py-1 bg-black text-white text-xs font-black rounded-xl border-2 border-black hover:bg-zinc-800"
                    >
                      Focus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}