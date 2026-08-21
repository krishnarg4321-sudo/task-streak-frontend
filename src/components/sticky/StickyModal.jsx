import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import StickyFace from './StickyFace';

export default function StickyModal({ isOpen, onClose, onCreateTask }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('yellow');
  const [face, setFace] = useState('wink');
  const [checklist, setChecklist] = useState([
    { id: '1', text: 'Step 1: Get started', done: false }
  ]);
  const [newItemText, setNewItemText] = useState('');

  if (!isOpen) return null;

  const colorOptions = [
    { id: 'yellow', bg: 'bg-[#FEF08A]', label: 'Butter' },
    { id: 'blue', bg: 'bg-[#BAE6FD]', label: 'Sky' },
    { id: 'pink', bg: 'bg-[#FBCFE8]', label: 'Candy' },
    { id: 'green', bg: 'bg-[#BBF7D0]', label: 'Mint' },
    { id: 'purple', bg: 'bg-[#DDD6FE]', label: 'Lilac' },
  ];

  const faceOptions = [
    { id: 'wink', label: 'Playful Wink' },
    { id: 'happy', label: 'Super Happy' },
    { id: 'focused', label: 'Laser Focus' },
    { id: 'frown', label: 'Grumpy Grind' },
  ];

  const handleAddChecklist = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setChecklist([...checklist, { id: 'c_' + Date.now(), text: newItemText.trim(), done: false }]);
    setNewItemText('');
  };

  const handleRemoveChecklist = (id) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateTask({
      name: name.trim(),
      description: description.trim(),
      color,
      face,
      checklist,
    });

    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] border-3 border-black rounded-neo-xl shadow-neo-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b-2 border-black bg-[#FFE2CA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black">
              +
            </div>
            <h2 className="text-xl font-extrabold text-black tracking-tight">Create Sticky Task</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border-2 border-black bg-white hover:bg-zinc-100 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Color Picker */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2 text-black/70">
              Pick Sticky Color
            </label>
            <div className="flex items-center gap-3">
              {colorOptions.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={`w-10 h-10 rounded-2xl border-2 border-black ${c.bg} transition-all ${
                    color === c.id ? 'scale-110 shadow-[3px_3px_0px_#000] ring-2 ring-black' : 'opacity-80 hover:opacity-100'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Face Expression Selector */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2 text-black/70">
              Sticky Expression
            </label>
            <div className="grid grid-cols-4 gap-2">
              {faceOptions.map((f) => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setFace(f.id)}
                  className={`p-2 rounded-xl border-2 border-black bg-[#FAF5FF] flex flex-col items-center justify-center transition-all ${
                    face === f.id ? 'bg-neo-yellow shadow-[3px_3px_0px_#000]' : 'hover:bg-zinc-100'
                  }`}
                >
                  <StickyFace type={f.id} className="w-12 h-6 mb-1" />
                  <span className="text-[10px] font-extrabold text-black/80">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Task Name */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
              Task Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Design 3D Focus Component"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 font-bold text-sm bg-zinc-50 border-2 border-black rounded-xl focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add key milestones or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 font-medium text-sm bg-zinc-50 border-2 border-black rounded-xl focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
            />
          </div>

          {/* Subtasks / Checklist */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
              Subtasks / Checklist
            </label>
            <div className="space-y-2 mb-2">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2 p-2 bg-zinc-100 border-2 border-black rounded-lg">
                  <span className="text-xs font-bold text-black flex-1">{item.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklist(item.id)}
                    className="text-black/50 hover:text-black"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add subtask..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs font-semibold bg-white border-2 border-black rounded-lg focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddChecklist}
                className="px-3 py-1.5 bg-[#BBF7D0] text-black font-extrabold text-xs border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] hover:bg-[#86EFAC]"
              >
                <Plus className="w-3.5 h-3.5 inline stroke-[3]" /> Add
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t-2 border-black flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white text-black font-extrabold text-sm border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-black text-white font-extrabold text-sm border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] hover:bg-zinc-800 active:translate-x-0.5 active:translate-y-0.5"
            >
              Create Sticky Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}