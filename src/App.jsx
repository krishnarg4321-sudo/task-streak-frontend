import React, { useState, useEffect } from 'react';
import { api, getToken, setToken } from './api/client';
import AppContainer from './components/layout/AppContainer';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import TaskCreationPage from './pages/TaskCreationPage';
import TaskDetailPage from './pages/TaskDetailPage';
import HistoryPage from './pages/HistoryPage';
import FriendsPage from './pages/FriendsPage';
import GroupProgressPage from './pages/GroupProgressPage';
import NotificationCenter from './components/notifications/NotificationCenter';
import Toast from './components/notifications/Toast';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGroupProgressOpen, setIsGroupProgressOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  
  const [todayTasks, setTodayTasks] = useState([]);
  const [historyData, setHistoryData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [isNotifCenterOpen, setIsNotifCenterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Check initial login session
    const token = getToken();
    if (token) {
      fetchCurrentUser();
    } else {
      setAuthLoading(false);
    }

    // Connectivity listeners
    const handleOnline = () => {
      setIsOffline(false);
      showToast('Back online! Syncing background operations...', 'success');
      api.syncOffline((syncedCount) => {
        showToast(`Synced ${syncedCount} offline task changes!`, 'success');
        refreshData();
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      showToast('You are currently offline. Changes will be saved locally.', 'warning');
    };

    const handleUnauthorized = () => {
      setUser(null);
      setToken('');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  useEffect(() => {
    if (user) {
      refreshData();
      fetchNotifications();
    }
  }, [user]);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchCurrentUser = async () => {
    try {
      const u = await api.getMe();
      setUser(u);
    } catch (err) {
      console.error('Failed to get user session:', err);
      setUser(null);
      setToken('');
    } finally {
      setAuthLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      const [tasks, hist] = await Promise.all([
        api.getTodayTasks(),
        api.getHistory('week'),
      ]);
      setTodayTasks(tasks || []);
      setHistoryData(hist || null);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.getNotifications();
      if (res) {
        setNotifications(res.notifications || []);
        setUnreadNotifCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  // Handlers for Tasks
  const handleCreateTask = async (taskPayload) => {
    try {
      const created = await api.createTask(taskPayload);
      showToast(`Sticky task "${created.name}" created! Daily presence marked.`, 'success');
      refreshData();
      setActiveTab('home');
      // Update streak in user profile state immediately
      if (user) {
        setUser((prev) => ({ ...prev, currentStreak: Math.max(1, (prev?.currentStreak || 0)) }));
      }
    } catch (err) {
      showToast('Failed to create task: ' + err.message, 'error');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTodayTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );

      await api.updateTaskStatus(taskId, newStatus);
      refreshData();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to update status:', err);
      refreshData();
    }
  };

  const handleChecklistChange = async (taskId, checklist) => {
    try {
      setTodayTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, checklist } : t))
      );
      await api.updateChecklist(taskId, checklist);
      refreshData();
    } catch (err) {
      console.error('Failed to update checklist:', err);
    }
  };

  const handleUpdateTimer = async (taskId, additionalSeconds, action) => {
    try {
      await api.updateTaskTimer(taskId, { additionalSeconds, action });
      refreshData();
    } catch (err) {
      console.error('Failed to update timer:', err);
    }
  };

  const handleCompleteTaskFromPomodoro = async (taskId, elapsedSeconds) => {
    try {
      await api.updateTaskTimer(taskId, {
        action: 'finish',
        additionalSeconds: elapsedSeconds,
      });
      showToast('Pomodoro session completed! Task finished.', 'success');
      refreshData();
      setSelectedTaskId(null);
      fetchNotifications();
    } catch (err) {
      showToast('Failed to finalize task: ' + err.message, 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setTodayTasks((prev) => prev.filter((t) => t.id !== taskId));
      await api.deleteTask(taskId);
      showToast('Sticky task deleted.', 'info');
      refreshData();
    } catch (err) {
      showToast('Failed to delete task: ' + err.message, 'error');
    }
  };

  const handleMarkNotificationRead = async (notifId) => {
    try {
      await api.markNotificationRead(notifId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
      setUnreadNotifCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadNotifCount(0);
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setIsProfileOpen(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#E2D9FC] flex items-center justify-center">
        <div className="w-16 h-16 rounded-3xl bg-[#FEF08A] border-3 border-black shadow-neo flex items-center justify-center font-black animate-spin">
          ⚡
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={(u) => setUser(u)} />;
  }

  // Active Task for Focus Pomodoro View
  const selectedTask = todayTasks.find((t) => t.id === selectedTaskId);

  return (
    <AppContainer
      user={user}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setIsProfileOpen(false);
        setIsGroupProgressOpen(false);
        setSelectedTaskId(null);
        setActiveTab(tab);
      }}
      onOpenProfile={() => {
        setIsProfileOpen(true);
        setIsGroupProgressOpen(false);
        setSelectedTaskId(null);
      }}
      onOpenNotifications={() => setIsNotifCenterOpen(true)}
      unreadCount={unreadNotifCount}
      isOffline={isOffline}
    >
      {/* Toast Notification Alert */}
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Notification Center Drawer */}
      <NotificationCenter
        isOpen={isNotifCenterOpen}
        onClose={() => setIsNotifCenterOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />

      {/* View Switching */}
      {isProfileOpen ? (
        <ProfilePage
          user={user}
          onBack={() => setIsProfileOpen(false)}
          onUpdateUser={(updated) => setUser(updated)}
          onLogout={handleLogout}
        />
      ) : isGroupProgressOpen ? (
        <GroupProgressPage onBack={() => setIsGroupProgressOpen(false)} />
      ) : selectedTaskId ? (
        <TaskDetailPage
          task={selectedTask}
          onBack={() => setSelectedTaskId(null)}
          onUpdateTimer={handleUpdateTimer}
          onCompleteTask={handleCompleteTaskFromPomodoro}
          onChecklistChange={handleChecklistChange}
        />
      ) : activeTab === 'home' ? (
        <HomePage
          todayTasks={todayTasks}
          historyData={historyData}
          onStatusChange={handleStatusChange}
          onChecklistChange={handleChecklistChange}
          onOpenTaskDetail={(id) => setSelectedTaskId(id)}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      ) : activeTab === 'create' ? (
        <TaskCreationPage
          tasks={todayTasks}
          onCreateTask={handleCreateTask}
          onStatusChange={handleStatusChange}
          onChecklistChange={handleChecklistChange}
          onDeleteTask={handleDeleteTask}
          onOpenTaskDetail={(id) => setSelectedTaskId(id)}
        />
      ) : activeTab === 'history' ? (
        <HistoryPage />
      ) : activeTab === 'friends' ? (
        <FriendsPage
          onOpenGroupProgress={() => setIsGroupProgressOpen(true)}
          onOpenFriendDetail={(fId) => setIsGroupProgressOpen(true)}
        />
      ) : null}
    </AppContainer>
  );
}