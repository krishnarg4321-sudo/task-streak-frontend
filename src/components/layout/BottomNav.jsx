import React from 'react';
import { Home, History, Users, Plus } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: History },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'create', label: 'Create', icon: Plus, isAction: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-3 border-black pb-[env(safe-area-inset-bottom,12px)] pt-2 px-4 shadow-[0px_-4px_0px_#000]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center justify-center min-w-[56px] min-h-[50px] -mt-6 group"
                aria-label="Create Task"
              >
                <div className="w-13 h-13 p-3 rounded-2xl bg-black text-white border-2 border-black shadow-[3.5px_3.5px_0px_#A855F7] group-hover:scale-105 group-active:translate-x-0.5 group-active:translate-y-0.5 transition">
                  <Plus className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="text-[10px] font-black text-black mt-1">Create</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-3 py-1 rounded-2xl border-2 transition-all ${
                isActive
                  ? 'bg-black text-white border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-transparent text-black border-transparent hover:bg-zinc-100'
              }`}
              aria-label={tab.label}
            >
              <Icon className="w-5 h-5 stroke-[2.5]" />
              <span className="text-[11px] font-extrabold mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}