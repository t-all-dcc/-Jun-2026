import React, { useState } from 'react';
import { Users, Sparkles, Send } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { DraggableModal } from '../../../components/shared/DraggableModal';

export const NewFamilyMembers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [greetingNotes, setGreetingNotes] = useState<Record<string, string>>({});
    const [currentNote, setCurrentNote] = useState('');

    const members = [
      { id: '1', name: 'Somchai Jaidee', role: 'SENIOR ENGINEER', dept: 'Digital Tech', joinDate: '15 Jun 2026', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
      { id: '2', name: 'Chonlada Rakthai', role: 'HR SPECIALIST', dept: 'People & Culture', joinDate: '18 Jun 2026', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
      { id: '3', name: 'Piyabutr Siri', role: 'MARKETING LEAD', dept: 'Growth & Brand', joinDate: '20 Jun 2026', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
    ];

    const openWelcome = (m: any) => {
      setSelectedMember(m);
      setCurrentNote(greetingNotes[m.id] || '');
      setIsModalOpen(true);
    };

    const handleSaveGreeting = () => {
      if (selectedMember) {
        setGreetingNotes(prev => ({ ...prev, [selectedMember.id]: currentNote }));
        setIsModalOpen(false);
      }
    };

    return (
      <>
      <GlassCard className="bg-white border-[#f3f3f1] col-span-1 lg:col-span-2 relative overflow-hidden">
        <div className="absolute right-[-5%] top-[-10%] opacity-[0.03] pointer-events-none transform rotate-12 z-0">
          <Users size={240} />
        </div>
        <div className="flex justify-between items-center mb-6 relative z-10 font-sans">
           <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
             <Users size={16} className="text-[#3f809e]" /> OUR NEW FAMILY MEMBERS
           </h2>
           <span className="text-[9px] font-black text-[#3f809e] bg-[#3f809e]/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-[#3f809e]/20 hover:bg-[#3f809e] hover:text-white transition-colors cursor-pointer">WELCOME TO COMPANY</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {members.map((m, i) => (
            <div key={i} onClick={() => openWelcome(m)} className="bg-white rounded-2xl border border-[#f3f3f1]/30 hover:border-[#3f809e]/60 p-5 flex flex-col items-center relative shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <div className="relative mb-4">
                <img src={m.img} alt={m.name} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                <div className="absolute -bottom-2 -right-2 bg-[#b58c4f] p-1.5 rounded-lg text-white shadow-sm border-2 border-white group-hover:scale-110 transition-transform">
                   <Sparkles size={12} />
                </div>
              </div>
              <h3 className="text-[#212c46] font-bold text-sm mb-1">{m.name}</h3>
              <p className="text-[#4d87a8] text-[9px] font-black uppercase tracking-widest">{m.role}</p>
              <p className="text-[#7a8b95] text-[10px] font-medium mt-0.5">{m.dept}</p>
              
              {greetingNotes[m.id] && (
                <div className="mt-2 text-[10px] text-[#657f4d] font-bold bg-[#657f4d]/10 px-2 py-0.5 rounded border border-[#657f4d]/20 italic max-w-full truncate">
                  💬 Greeted: "{greetingNotes[m.id]}"
                </div>
              )}

              <div className="w-full h-px bg-[#f3f3f1] my-4" />
              <div className="w-full flex justify-between items-center text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">
                <span>START DATE</span>
                <span className="text-[#212c46]">{m.joinDate}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#022d41] tracking-widest flex items-center gap-2"><Sparkles size={16} className="text-[#b58c4f]"/> Write Welcome Greeting</span>}
        width="max-w-md"
      >
        <div className="p-6">
          {selectedMember && (
             <div className="text-center mb-6">
               <img src={selectedMember.img} alt={selectedMember.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-[#3f809e]/20 shadow-md mx-auto mb-4" />
               <h3 className="text-xl font-black text-[#212c46] mb-1">{selectedMember.name}</h3>
               <p className="text-[#4d87a8] text-xs font-black uppercase tracking-widest mb-1">{selectedMember.role}</p>
               <p className="text-[#7a8b95] text-xs font-medium">{selectedMember.dept} • Start: {selectedMember.joinDate}</p>
             </div>
          )}
          
          <div className="mb-6 shrink-0 font-sans">
            <label className="block text-[10px] font-black text-[#212c46] uppercase tracking-widest mb-2 text-center">Write a Warm Welcome Greeting (ฝากคำต้อนรับพนักงานใหม่)</label>
            <div className="relative">
              <textarea 
                className="w-full h-24 p-3 pr-12 border border-[#cdd0db] rounded-xl text-sm focus:border-[#4d87a8] focus:ring-1 focus:ring-[#4d87a8] outline-none transition-all resize-none bg-[#f3f3f1]/50 font-medium shadow-inner font-sans"
                placeholder="Write your welcome message here..."
                value={currentNote}
                onChange={e => setCurrentNote(e.target.value)}
              ></textarea>
              <button 
                onClick={handleSaveGreeting}
                className="absolute bottom-3 right-3 w-8 h-8 bg-[#b58c4f] hover:bg-[#3f809e] text-white rounded-lg flex items-center justify-center transition-colors shadow-md"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </DraggableModal>
      </>
    );
};
