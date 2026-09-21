import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Trophy, UserPlus, Award, Flame, Plus, Check, ChevronDown, X, Sparkles } from 'lucide-react';
import { api } from '../api/client';
import GroupDivergingChart from '../components/charts/GroupDivergingChart';
import WeeklyRankBarChart from '../components/charts/WeeklyRankBarChart';

export default function GroupProgressPage({ onBack }) {
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState('');
  const [progressData, setProgressData] = useState(null);
  const [weeklyRanking, setWeeklyRanking] = useState(null);
  const [newMemberInput, setNewMemberInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (activeGroupId) {
      loadGroupDetails(activeGroupId);
    }
  }, [activeGroupId]);

  const loadGroups = async (preferredGroupId = null) => {
    setLoading(true);
    try {
      const userGroups = await api.getUserGroups();
      setGroups(userGroups || []);
      if (userGroups && userGroups.length > 0) {
        if (preferredGroupId && userGroups.some(g => g.id === preferredGroupId)) {
          setActiveGroupId(preferredGroupId);
        } else if (!activeGroupId || !userGroups.some(g => g.id === activeGroupId)) {
          setActiveGroupId(userGroups[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadGroupDetails = async (gId) => {
    try {
      const [prog, ranking] = await Promise.all([
        api.getGroupProgress(gId),
        api.getWeeklyStreaks(gId),
      ]);
      setProgressData(prog);
      setWeeklyRanking(ranking?.ranking || []);
    } catch (err) {
      console.error('Failed to load group details:', err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setCreateLoading(true);
    setMessage('');
    try {
      const created = await api.createGroup({
        name: newGroupName.trim(),
        description: newGroupDesc.trim() || 'Daily habit & focus streak squad.',
      });
      setMessage(`Squad "${created.name}" created successfully!`);
      setNewGroupName('');
      setNewGroupDesc('');
      setIsCreatingGroup(false);
      await loadGroups(created.id);
    } catch (err) {
      setMessage('Failed to create squad: ' + err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberInput.trim()) return;
    try {
      await api.addGroupMember(activeGroupId, newMemberInput.trim());
      setMessage(`Added member: ${newMemberInput}`);
      setNewMemberInput('');
      loadGroupDetails(activeGroupId);
    } catch (err) {
      setMessage('Failed to add member: ' + err.message);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2.5 rounded-2xl border-2 border-black bg-white hover:bg-zinc-100 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-1 font-extrabold text-xs"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Friends</span>
        </button>
        <h2 className="text-xl font-black text-black">Group Streak Arena</h2>
        <button
          onClick={() => setIsCreatingGroup(true)}
          className="px-3 py-2 rounded-2xl border-2 border-black bg-[#BBF7D0] hover:bg-emerald-300 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-1.5 font-black text-xs text-black"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Squad</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-[#BBF7D0] border-2 border-black rounded-xl text-xs font-bold text-black flex items-center justify-between shadow-[2px_2px_0px_#000]">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="font-bold hover:scale-110">✕</button>
        </div>
      )}

      {/* Group Switcher Bar */}
      {groups.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-black uppercase text-black/60 shrink-0">Your Squads:</span>
          {groups.map((g) => {
            const isActive = g.id === activeGroupId;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGroupId(g.id)}
                className={`px-3.5 py-1.5 rounded-xl border-2 border-black text-xs font-black shrink-0 transition-all ${
                  isActive
                    ? 'bg-black text-white shadow-[2px_2px_0px_#000]'
                    : 'bg-white text-black hover:bg-zinc-100 shadow-[1.5px_1.5px_0px_#000]'
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Group Info Card */}
      <div className="neo-box p-5 bg-[#DDD6FE] border-3 border-black">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white rounded-full border border-black text-[11px] font-black mb-1 shadow-[1px_1px_0px_#000]">
              <Users className="w-3.5 h-3.5" />
              <span>Streak Squad</span>
            </div>
            <h3 className="text-2xl font-black text-black leading-tight">
              {progressData?.groupName || 'Squad'}
            </h3>
            <p className="text-xs font-bold text-black/70">
              {progressData?.description}
            </p>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 bg-white rounded-full border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000]">
              {progressData?.memberCount || 0} Members
            </span>
          </div>
        </div>

        {/* Add Member Form */}
        <form onSubmit={handleAddMember} className="flex gap-2 pt-2 border-t border-black/15">
          <input
            type="text"
            placeholder="Invite username to squad..."
            value={newMemberInput}
            onChange={(e) => setNewMemberInput(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs font-bold bg-white border-2 border-black rounded-xl focus:outline-none shadow-[2px_2px_0px_#000]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-black text-white text-xs font-black rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-zinc-800"
          >
            + Invite
          </button>
        </form>
      </div>

      {/* SECTION 1: Multi-Line Diverging Progression Chart */}
      {progressData && (
        <div>
          <GroupDivergingChart
            data={progressData.dailyProgression}
            members={progressData.members}
          />
        </div>
      )}

      {/* SECTION 2: Weekly Friend Streak Competition Leaderboard */}
      <div>
        <WeeklyRankBarChart ranking={weeklyRanking} />
      </div>

      {/* Create Squad Modal */}
      {isCreatingGroup && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border-3 border-black rounded-3xl p-6 shadow-neo-xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FEF08A] border-2 border-black flex items-center justify-center">
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="font-black text-lg text-black">Create New Squad</h3>
              </div>
              <button
                onClick={() => setIsCreatingGroup(false)}
                className="p-1 rounded-lg border-2 border-black hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 text-black">
                  Squad Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Night Owls Coding Squad"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-bold bg-zinc-50 border-2 border-black rounded-xl focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 text-black">
                  Mission / Description
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. 5 pomodoro sessions daily and full task completion!"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-bold bg-zinc-50 border-2 border-black rounded-xl focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingGroup(false)}
                  className="flex-1 py-2.5 bg-zinc-100 text-black font-black text-xs border-2 border-black rounded-xl hover:bg-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 py-2.5 bg-black text-white font-black text-xs border-2 border-black rounded-xl shadow-neo hover:bg-zinc-800 disabled:opacity-50"
                >
                  {createLoading ? 'Creating...' : 'Create Squad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}