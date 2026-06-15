import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CorporateAnnouncementsCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const announcements = [
        { id: 1, type: "COMPLIANCE UPDATE", issue: "Q1 Standards Review", subject: "Review the key takeaways and standards required for the upcoming audit.", date: "12 May 2026", isNew: true, image: "https://images.unsplash.com/photo-1542382156909-923bea7b0a72?q=80&w=500" },
        { id: 2, type: "HR NEWS", issue: "New Policies", subject: "Review the updated guidelines for employee handling.", date: "14 May 2026", isNew: true, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=500" },
        { id: 3, type: "EVENT", issue: "Annual Compliance Training", subject: "Join us for our annual compliance training. Details and registration inside.", date: "20 May 2026", isNew: false, image: "https://images.unsplash.com/photo-1511632765486-a01c80cf59af?q=80&w=500" },
        { id: 4, type: "TRAINING", issue: "ISO 27001 Workshop", subject: "Mandatory training for all mid-level IT managers next month.", date: "02 Jun 2026", isNew: false, image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=500" },
        { id: 5, type: "WELLNESS", issue: "Ergonomics Checks", subject: "Annual free workplace ergonomics checks for all employees.", date: "15 Jun 2026", isNew: false, image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=500" },
        { id: 6, type: "IT UPDATE", issue: "New HR System Portal", subject: "We are migrating to a new HR management system. Read more.", date: "01 Jul 2026", isNew: false, image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=500" },
    ];

    const nextSlide = () => setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));

    // Show up to 4 items on large screens
    const visibleAnnouncements = [];
    for (let i = 0; i < 4; i++) {
        visibleAnnouncements.push(announcements[(currentIndex + i) % announcements.length]);
    }

    return (
        <div id="announcements-carousel" className="w-full bg-[#f6f5f3] py-5 rounded-2xl relative overflow-hidden shadow-inner border border-[#e5e5e5]">
            <div className="flex items-center absolute top-1/2 -translate-y-1/2 left-2 z-20">
                <button onClick={prevSlide} className="bg-gray-600/80 hover:bg-gray-800 text-white p-2 rounded shadow-lg backdrop-blur transition-colors cursor-pointer">
                    <ChevronLeft size={24} />
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 px-14">
                {visibleAnnouncements.map((ann, idx) => (
                    <div key={`${ann.id}-${idx}`} className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col relative h-[145px] border border-gray-100 group transition-all hover:shadow-md justify-between">
                        {ann.isNew && (
                            <div className="absolute -left-10 top-5 bg-[#a73527] text-white font-black px-11 py-1 -rotate-45 z-20 shadow-md text-[11px] tracking-wider">
                                NEW
                            </div>
                        )}
                        
                        <div className="p-2 pt-3 text-center z-10 relative">
                            <h3 className="font-extrabold text-[#3a4454] leading-tight text-[12px] drop-shadow-sm">{ann.type}</h3>
                            <h4 className="font-bold text-[#56657a] text-[10px] mt-0.5">{ann.issue}</h4>
                            <h2 className="font-black text-[#1e4e6d] text-[13px] mt-2 drop-shadow-sm leading-tight line-clamp-2">{ann.subject}</h2>
                        </div>
                        
                        <div className="bg-[#364b5e] text-white py-1.5 px-2 mx-2 mb-2 rounded-lg text-center flex items-center justify-center gap-1 z-10 shadow-sm relative shrink-0">
                            <span className="text-[9px] font-medium tracking-wide">Date</span>
                            <span className="flex items-center gap-0.5 mx-1 text-white/50"><span className="w-0.5 h-0.5 bg-white/50 rounded-full"></span><span className="w-1 h-1 bg-white/80 rounded-full"></span></span>
                            <span className="text-[10px] font-black tracking-wide">{ann.date}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center absolute top-1/2 -translate-y-1/2 right-2 z-20">
                <button onClick={nextSlide} className="bg-gray-600/80 hover:bg-gray-800 text-white p-2 rounded shadow-lg backdrop-blur transition-colors cursor-pointer">
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="flex justify-center items-center gap-2 mt-4">
                {announcements.map((_, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${idx === currentIndex ? 'bg-[#1e4e6d] ring-2 ring-[#1e4e6d]/30 ring-offset-2' : 'bg-gray-400 hover:bg-gray-500'}`}
                    />
                ))}
            </div>
        </div>
    );
};
