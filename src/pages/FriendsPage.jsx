import React, { useState, useEffect } from 'react';
import { Users, UserPlus, ArrowUpRight, Flame, CheckCircle, Search, Check, Copy } from 'lucide-react';
import { api } from '../api/client';
import GroupDivergingChart from '../components/charts/GroupDivergingChart';

export default function FriendsPage({ onOpenGroupProgress, onOpenFriendDetail }) {
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeGroupProgress, setActiveGroupProgress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadFriendsAndGroups();
  }, []);

  const loadFriendsAndGroups = async () => {
    setLoading(true);
    try {
      const friendsList = await api.getFriends();
      setFriends(friendsList || []);

      const userGroups = await api.getUserGroups();
      setGroups(userGroups || []);

      if (userGroups && userGroups.length > 0) {
        const groupProg = await api.getGroupProgress(userGroups[0].id);
        setActiveGroupProgress(groupProg);
      }
    } catch (err) {
      console.error('Failed to load social data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const results = await api.searchUsers(searchQuery.trim());
      setSearchResults(results || []);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleSendRequest = async (username) => {
    try {
      await api.sendFriendRequest(username);
      setActionMessage(`Friend request sent to @${username}!`);
      setSearchQuery('');
      setSearchResults([]);
      loadFriendsAndGroups();
    } catch (err) {
      setActionMessage(`Error: ${err.message}`);
    }
  };

  const handleAcceptRequest = async (friendshipId) => {
    try {
      await api.acceptFriendRequest(friendshipId);
      setActionMessage('Friend request accepted!');
      loadFriendsAndGroups();
    } catch (err) {
      setActionMessage(`Error: ${err.message}`);
    }
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(window.location.origin + '?invite=taskstreak');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header with Group Progress CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-black tracking-tight">Social & Friends</h2>
          <p className="text-xs font-bold text-black/60">Compare streaks and keep accountability</p>
        </div>

        {/* Group Progress Entry Point in Top-Right Area */}
        <button
          onClick={onOpenGroupProgress}
          className="px-3.5 py-2 bg-[#BBF7D0] hover:bg-[#86EFAC] text-black font-black text-xs border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-1.5"
        >
          <span>Group Leaderboard</span>
          <ArrowUpRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 bg-[#BBF7D0] border-2 border-black rounded-xl text-xs font-bold text-black flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage('')} className="font-black text-sm">✕</button>
        </div>
      )}

      {/* SECTION 1: Add Friends Search & Invite Link */}
      <div className="neo-box p-5 bg-[#FFE2CA] border-3 border-black">
        <h3 className="font-black text-xs uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Friends & Squad Members</span>
        </h3>

        <form onSubmit={handleSearch} className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs font-bold bg-white border-2 border-black rounded-xl focus:outline-none shadow-[2px_2px_0px_#000]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white text-xs font-black rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-zinc-800"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-3 space-y-2">
            {searchResults.map((u) => (
              <div key={u.id} className="p-2.5 bg-white border-2 border-black rounded-xl flex items-center justify-between shadow-[2px_2px_0px_#000]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full border border-black overflow-hidden bg-[#FED7AA]">
                    <img src={u.profilePictureUrl || '/avatars/avatar-1.svg'} alt={u.name} />
                  </div>
                  <div>
                    <h5 className="font-black text-xs">{u.name}</h5>
                    <span className="text-[10px] font-semibold text-black/60">@{u.username}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleSendRequest(u.username)}
                  className="px-2.5 py-1 bg-[#BBF7D0] text-black text-xs font-black rounded-lg border border-black hover:bg-[#86EFAC]"
                >
                  + Add Friend
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleCopyInvite}
          className="w-full py-2 bg-white text-black font-extrabold text-xs border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] hover:bg-zinc-100 flex items-center justify-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Invite Link Copied!' : 'Copy Quick Invite Link'}</span>
        </button>
      </div>

      {/* SECTION 2: Current Friends List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-black uppercase tracking-tight text-black flex items-center gap-1.5">
            <Users className="w-4 h-4 stroke-[2.5]" />
            <span>Friends & Streaks ({friends.length})</span>
          </h3>
        </div>

        {friends.length === 0 ? (
          <div className="neo-box p-8 bg-white text-center">
            <p className="text-xs font-bold text-black/60">No friends added yet. Invite squad mates to begin tracking!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {friends.map((f) => (
              <div
                key={f.userId || f.friendshipId}
                onClick={() => onOpenFriendDetail && onOpenFriendDetail(f.userId)}
                className="p-3.5 rounded-2xl border-2 border-black bg-white hover:bg-zinc-50 transition cursor-pointer shadow-[3.5px_3.5px_0px_#000] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl border-2 border-black overflow-hidden bg-[#FED7AA] shadow-[1.5px_1.5px_0px_#000]">
                      <img src={f.profilePictureUrl || '/avatars/avatar-1.svg'} alt={f.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-black leading-tight">{f.name}</h4>
                      <span className="text-[11px] font-semibold text-black/60">@{f.username}</span>
                    </div>
                  </div>

                  {/* Online / Offline Label */}
                  <span className={`px-2 py-0.5 rounded-full border border-black text-[10px] font-black ${
                    f.online ? 'bg-[#BBF7D0] text-emerald-900' : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    {f.online ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-black/10 text-xs">
                  <div className="flex items-center gap-1 font-black bg-[#FEF08A] px-2 py-0.5 rounded-lg border border-black shadow-[1px_1px_0px_#000]">
                    <Flame className="w-3.5 h-3.5 fill-current text-orange-500 stroke-[2.5]" />
                    <span>{f.currentStreak || 0}d Streak</span>
                  </div>

                  <span className="font-bold text-black/70 text-[11px]">
                    {f.todayCompletedCount || 0} tasks done today
                  </span>
                </div>

                {f.status === 'PENDING' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptRequest(f.friendshipId);
                    }}
                    className="mt-2 w-full py-1.5 bg-[#BBF7D0] text-black text-xs font-black rounded-lg border-2 border-black hover:bg-[#86EFAC]"
                  >
                    Accept Friend Request
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: Group Comparative Progression Chart */}
      {activeGroupProgress && (
        <div>
          <GroupDivergingChart
            data={activeGroupProgress.dailyProgression}
            members={activeGroupProgress.members}
          />
        </div>
      )}
    </div>
  );
}