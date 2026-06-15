import React from 'react';
import { GitFork, ShieldAlert, Award, UserCheck, HelpCircle } from 'lucide-react';

export default function OrgChart() {
  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* HEADER SECTION - Brand Consistent with AGENTS.md */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#b58c4f] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 rounded-2xl border border-[#b58c4f]/40 bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <GitFork size={22} className="text-[#b58c4f]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-2xl">
              ORGANIZATION CHART <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#3f809e]">NODE</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              VISUAL COMPANY HIERARCHY, REPORTING LINES, AND WORKFORCE STRUCTURE
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION - Page padding and styling aligned with User Permissions */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        <div className="bg-white/90 rounded-3xl p-8 border border-[#eaeaec] shadow-md flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto w-full my-6 min-h-[450px]">
          <div className="w-20 h-20 rounded-2xl bg-[#b58c4f]/10 flex items-center justify-center border border-[#b58c4f]/25 shadow-sm mb-2">
            <GitFork size={38} className="text-[#b58c4f] animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h4 className="text-lg font-black text-[#212c46] uppercase tracking-wider">
              Organization Structure Visualization
            </h4>
            <p className="text-[12px] text-slate-500 max-w-lg leading-relaxed font-semibold">
              ระบบแสดงผังองค์กร กำหนดโครงสร้างสายการบังคับบัญชา และลำดับขั้นแผนก สังกัด ชัยศรีอะโกรอินดัสเทรียล แบบบูรณาการดิจิทัล
            </p>
          </div>

          {/* Interactive Placeholder visual tree */}
          <div className="w-full max-w-2xl bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl p-6 font-mono text-[11px]">
            <div className="flex flex-col items-center space-y-6">
              
              {/* CEO Node */}
              <div className="bg-[#212c46] text-white py-3 px-6 rounded-xl border border-[#b7a159] shadow-md text-center max-w-xs">
                <p className="font-bold tracking-widest text-[#b7a159]">EXECUTIVE CHAIRMAN</p>
                <p className="text-[10px] mt-1 text-slate-300 font-bold">Chaisri Agro Industrial Group</p>
              </div>

              {/* Line */}
              <div className="w-0.5 h-6 bg-slate-300"></div>

              {/* Managers Tier */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm text-center">
                  <p className="font-black text-[#212c46]">HR DIRECTOR</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Human Resources Branch</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#b7a159]/40 shadow-sm text-center">
                  <p className="font-black text-[#b58c4f]">MANAGING DIRECTOR</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">General Operations Node</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm text-center">
                  <p className="font-black text-[#212c46]">FACTORY MANAGER</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Production & Logistics</p>
                </div>
              </div>

            </div>
          </div>

          <div className="p-4 bg-[#fcf4f2] border border-[#eedbe2] rounded-2xl flex items-start gap-3 max-w-xl text-left">
            <ShieldAlert className="text-[#a94228] shrink-0 mt-0.5" size={18} />
            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
              ฟังก์ชั่นผังองค์กรแบบไดนามิก รองรับการลากวางบอร์ดทีม (Dynamic Org Chart Canvas Rendering) อยู่ในระหว่างกระบวนการขยายขีดความสามารถการจัดเรียงจากฐานข้อมูล
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
