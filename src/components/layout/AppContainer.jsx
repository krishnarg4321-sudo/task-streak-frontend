import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import { WifiOff } from 'lucide-react';

export default function AppContainer({
  children,
  user,
  activeTab,
  onTabChange,
  onOpenProfile,
  onOpenNotifications,
  unreadCount = 0,
  isOffline = false,
}) {
  return (
    <div className="min-h-screen bg-[#E2D9FC] flex flex-col font-sans pb-28">
      {/* Offline Status Bar */}
      {isOffline && (
        <div className="bg-[#FEF08A] text-black border-b-2 border-black px-4 py-1.5 text-center text-xs font-black flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 stroke-[2.5]" />
          <span>Offline Mode: Changes will be synced automatically when reconnected</span>
        </div>
      )}

      {/* Persistent Header with Avatar & Notifications */}
      <Header
        user={user}
        onOpenProfile={onOpenProfile}
        onOpenNotifications={onOpenNotifications}
        unreadCount={unreadCount}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-3">
        {children}
      </main>

      {/* Fixed Persistent Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}