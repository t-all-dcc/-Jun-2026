import React, { useState } from 'react';
import { PartyPopper, Gift, Send } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { DraggableModal } from '../../../components/shared/DraggableModal';

export const UpcomingExpirations = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<any>(null);
    const [birthdayWishes, setBirthdayWishes] = useState<Record<string, string>>({});
    const [currentWish, setCurrentWish] = useState('');
    const [filterWindow, setFilterWindow] = useState<'upcoming' | 'recent_3days'>('upcoming');

    const allBirthdays = [
      // Upcoming
      { id: 'b1', name: 'Apinya Somsri', dept: 'Quality Assurance', date: '15 Jun', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop', type: 'Birthday', isUpcoming: true },
      { id: 'b2', name: 'Teerapat Kaewjai', dept: 'Creative Design', date: '17 Jun', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop', type: 'Design Anniversary', isUpcoming: true },
      // Last 3 days 
      { id: 'b3', name: 'Nattaporn Jaiyen', dept: 'HR & Operations', date: '12 Jun', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop', type: 'Work Anniversary', isUpcoming: false },
      { id: 'b4', name: 'Prasert Moonkon', dept: 'Facility Team', date: '11 Jun', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop', type: 'Birthday', isUpcoming: false },
    ];

    const displayedBirthdays = allBirthdays.filter(b => {
      if (filterWindow === 'upcoming') return b.isUpcoming;
      return !b.isUpcoming;
    });

    const openGreeting = (person?: any) => {
      const p = person || displayedBirthdays[0] || allBirthdays[0];
      setSelectedPerson(p);
      setCurrentWish(birthdayWishes[p.id] || '');
      setIsModalOpen(true);
    };

    const handleSaveWish = () => {
      if (selectedPerson) {
        setBirthdayWishes(prev => ({ ...prev, [selectedPerson.id]: currentWish }));
        setIsModalOpen(false);
      }
    };

    const toggleFilterRange = () => {
      setFilterWindow(prev => prev === 'upcoming' ? 'recent_3days' : 'upcoming');
    };

    return (
      <>
      <GlassCard className="bg-white border-[#eaeaec] flex flex-col relative overflow-hidden">
        <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.03] pointer-events-none transform -rotate-12 z-0">
          <PartyPopper size={200} />
        </div>
        <div className="flex items-center gap-2 mb-6 relative z-10 font-sans">
          <PartyPopper size={18} className="text-[#b58c4f]" />
          <h2 className="text-sm font-black text-[#212c46] uppercase tracking-wide leading-tight">
            BIRTHDAYS WISH
          </h2>
          <span className="ml-auto text-[8px] font-black uppercase bg-[#b58c4f]/10 text-[#b58c4f] px-2 py-0.5 rounded border border-[#b58c4f]/20 shadow-sm animate-pulse">
            {filterWindow === 'upcoming' ? 'UPCOMING' : 'LAST 3 DAYS'}
          </span>
        </div>
        <div className="space-y-3 flex-1 relative z-10 min-h-[140px]">
          {displayedBirthdays.map((b, i) => (
            <div key={i} onClick={() => openGreeting(b)} className="flex items-center gap-4 bg-white border border-[#f3f3f1]/30 hover:border-[#b58c4f]/60 rounded-xl p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <img src={b.img} alt={b.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm shadow-black/10 group-hover:scale-105 transition-transform" />
              <div className="flex-1 min-w-0">
                <h3 className="text-[#212c46] font-bold text-xs truncate">{b.name}</h3>
                <p className="text-[#7a8b95] text-[10px] font-medium truncate flex items-center gap-1.5 mb-0.5">
                  <span>{b.dept}</span>
                  <span className="text-[8px] font-black uppercase text-[#b58c4f] bg-[#b58c4f]/10 px-1 py-0.2 rounded shrink-0">{b.type}</span>
                </p>
                {birthdayWishes[b.id] && (
                  <p className="text-[10px] text-[#657f4d] font-bold italic truncate mt-0.5">💖 Wished: "{birthdayWishes[b.id]}"</p>
                )}
              </div>
              <div className="text-[10px] font-black text-[#b58c4f] tracking-widest shrink-0">
                {b.date}
              </div>
            </div>
          ))}
          {displayedBirthdays.length === 0 && (
            <div className="text-center py-6 text-xs text-[#7a8b95] font-bold">
              No celebrations in this window!
            </div>
          )}
        </div>
        <button 
          onClick={toggleFilterRange} 
          className="mt-4 w-full bg-[#1e2636] hover:bg-[#b58c4f] text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors flex justify-center items-center gap-2 shadow-md relative z-10 cursor-pointer"
        >
          <Gift size={14} className="text-[#b58c4f]" /> UPCOMING BIRTHDAYS & ANNIVERSARIES
        </button>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#022d41] tracking-widest flex items-center gap-2"><PartyPopper size={16} className="text-[#b58c4f]"/> Celebration Greeting</span>}
        width="max-w-md"
      >
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar flex flex-col bg-[#fdfbf7] relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#f9ecd3] to-transparent z-0 opacity-50"></div>
          {selectedPerson && (
             <div className="flex flex-col items-center gap-3 mb-6 relative z-10 pt-4">
                <img src={selectedPerson.img} alt={selectedPerson.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md animate-bounce" />
                <div className="text-center">
                   <p className="text-[10px] text-[#b7a159] font-bold uppercase tracking-[0.2em] mb-1">Send Celebratory Wish 💖</p>
                   <h3 className="text-xl font-sans font-black text-[#212c46]">{selectedPerson.name}</h3>
                   <p className="text-[11px] font-medium text-[#7a8b95] mt-1">{selectedPerson.dept} • {selectedPerson.type} ({selectedPerson.date})</p>
                </div>
             </div>
          )}
          
          <div className="mb-6 shrink-0 relative z-10 font-sans">
            <label className="block text-[10px] font-black text-[#b7a159] uppercase tracking-widest mb-2 text-center">Post a Birthday & Anniversary Wish (เขียนคำอวยพรวันเกิด/ครบรอบทำงาน)</label>
            <div className="relative shadow-sm rounded-xl overflow-hidden border border-[#e8dcc4]">
              <textarea 
                className="w-full h-24 p-3 pr-12 text-sm focus:outline-none resize-none bg-white font-medium placeholder:text-[#d3ccc0] font-sans"
                placeholder="Write your beautiful wish to make their day..."
                value={currentWish}
                onChange={e => setCurrentWish(e.target.value)}
              ></textarea>
              <button 
                onClick={handleSaveWish}
                className="absolute bottom-3 right-3 w-8 h-8 bg-[#b58c4f] hover:bg-[#a94228] text-white rounded-lg flex items-center justify-center transition-colors shadow-md cursor-pointer"
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
