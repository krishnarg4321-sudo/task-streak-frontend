import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Trophy, UserPlus, Award, Flame } from 'lucide-react';
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

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (activeGroupId) {
      loadGroupDetails(activeGroupId);
    }
  }, [activeGroupId]);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const userGroups = await api.getUserGroups();
      setGroups(userGroups || []);
      if (userGroups && userGroups.length > 0) {
        setActiveGroupId(userGroups[0].id);
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
        <h2 className="text-xl font-black text-black">Group Streak Competition</h2>
        <div className="w-10"></div>
      </div>

      {message && (
        <div className="p-3 bg-[#BBF7D0] border-2 border-black rounded-xl text-xs font-bold text-black flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')}>✕</button>
        </div>
      )}

      {/* Group Info Card */}
      <div className="neo-box p-5 bg-[#DDD6FE] border-3 border-black">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white rounded-full border border-black text-[11px] font-black mb-1 shadow-[1px_1px_0px_#000]">
              <Users className="w-3.5 h-3.5" />
              <span>Unlimited Size Squad</span>
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

      {/* SECTION 1: Multi-Line Diverging Progression Chart (Section 6.8) */}
      {progressData && (
        <div>
          <GroupDivergingChart
            data={progressData.dailyProgression}
            members={progressData.members}
          />
        </div>
      )}

      {/* SECTION 2: Weekly Friend Streak Competition Leaderboard (Section 9) */}
      <div>
        <WeeklyRankBarChart ranking={weeklyRanking} />
      </div>
    </div>
  );
}