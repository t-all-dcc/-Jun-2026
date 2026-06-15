import React from 'react';
import { Users, ShieldCheck, BrainCircuit } from 'lucide-react';

export const HeroBanner = () => {
    const bgImage = "https://static.vecteezy.com/system/resources/previews/006/831/704/non_2x/panoramic-banner-of-business-partner-meeting-in-success-concept-businessman-corporate-teamwork-with-professional-team-partnership-celebration-greeting-with-a-work-deal-free-photo.jpg";
    return (
      <div id="hero-banner" className="relative w-full rounded-2xl overflow-hidden shadow-xl group bg-[#212c46] border border-[#414757] font-exception-hero">
        <div className="absolute inset-0 transform transition-transform duration-[2000ms] group-hover:scale-105">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-65"
            style={{ backgroundImage: `url(${bgImage})`, backgroundPosition: 'center 35%' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#212c46]/95 via-[#212c46]/70 to-transparent" />
        <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between p-4 md:p-6 w-full gap-6">
          <div className="flex flex-col justify-center flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Users size={12} className="text-[#b7a159]" />
              <span className="text-[9px] text-[#b7a159] font-black uppercase tracking-[0.2em] drop-shadow-sm">Intellectual Capital Hub</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none mb-3 drop-shadow-md">
              Value of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#f3e5ab]">Strategic Personnel</span>
            </h2>
            <div className="mb-6">
              <p className="text-white/90 text-xs italic font-semibold leading-relaxed max-w-2xl">
                “The value of intangibles derived from intellectual property rights and trademarks from brands, inventions, software code, and programs has never been higher.” <br/>
                <span className="text-[#b7a159] font-bold not-italic">— Roger Spitz</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <button 
                onClick={() => window.location.href = '/hr/employees/directory'}
                className="bg-[#b58c4f] hover:bg-[#8e9141] border border-[#b7a159]/30 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2 shadow-lg hover:shadow-[0_0_15px_rgba(181,140,79,0.5)]"
              >
                <Users size={12} /> Employee Directory
              </button>
              <div className="bg-white/5 border border-white/10 px-4 py-2 text-center rounded-xl flex items-center gap-2 shadow-inner backdrop-blur-md">
                <ShieldCheck size={14} className="text-[#657f4d]" />
                <span className="text-white font-black tracking-tighter text-sm">Human Assets</span>
                <span className="text-[8px] text-white/50 font-bold uppercase tracking-widest leading-none mt-0.5">Optimized</span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <a 
              href="/copilot"
              className="bg-gradient-to-br from-[#1d2636] to-[#2d2c4a] border border-[#b7a159]/40 p-1 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(181,140,79,0.3)] hover:-translate-y-1 transition-all group/ai cursor-pointer block text-center"
            >
              <div className="bg-[#1d2636] border border-white/10 rounded-xl px-8 py-5 flex flex-col items-center gap-2">
                <div className="relative">
                   <div className="absolute inset-0 bg-[#b7a159]/20 blur-xl rounded-full scale-150 animate-pulse" />
                   <BrainCircuit size={40} className="text-[#b7a159] relative z-10 group-hover/ai:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-[#b7a159] text-[13px] font-black uppercase tracking-[0.2em] mt-1">AI COPILOT</span>
                <span className="text-[8px] text-white/40 font-bold tracking-[0.4em]">SMART ASSISTANT</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
};
