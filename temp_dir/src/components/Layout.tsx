import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumb from './Breadcrumb';
import SecurityGuard from './SecurityGuard';
import { useAuth } from '../context/AuthContext';
import { PhoneCall, Mail, Bug } from 'lucide-react';
import { QuickActions } from './QuickActions';

function DebugToggle() {
  const [isDebugEnabled, setIsDebugEnabled] = useState(false);

  useEffect(() => {
    if (isDebugEnabled) {
      document.body.classList.add('visual-debug-active');
    } else {
      document.body.classList.remove('visual-debug-active');
    }
    return () => document.body.classList.remove('visual-debug-active');
  }, [isDebugEnabled]);

  return (
    <button
      onClick={() => setIsDebugEnabled(!isDebugEnabled)}
      className={`flex items-center justify-center p-2 rounded-full border shadow-sm transition-all duration-300 opacity-30 hover:opacity-100 ${
        isDebugEnabled 
          ? 'bg-rose-100 border-rose-300 text-rose-600' 
          : 'bg-white border-slate-200 text-slate-400'
      }`}
      title="Toggle Debug Borders"
    >
      <Bug size={16} />
    </button>
  );
}

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <SecurityGuard>
      <div className="flex h-screen w-full bg-[linear-gradient(135deg,#f3f3f1_0%,#eaeaec_100%)] overflow-hidden font-sans text-slate-800">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex flex-1 flex-col overflow-hidden relative">
          <Header />
          <Breadcrumb />
          <div className="flex-1 custom-scrollbar overflow-y-auto flex flex-col min-h-0 relative">
            <div className="flex-1 flex flex-col w-full pt-0">
              <main className="flex-1 shrink-0 bg-transparent flex flex-col w-full relative z-0">
                <Outlet />
              </main>
              <footer className="mt-auto shrink-0 pt-8 pb-3.5 flex flex-col items-center gap-0.5 text-center text-[#212c46] w-full bg-transparent">
                  <div className="flex items-center justify-center">
                      <span className="text-[12px] font-black uppercase tracking-widest opacity-80 font-mono">
                          INTELLIGENCE CERTIFICATION LIBRARY • EMPOWERING COMPLIANCE ASSURANCE
                      </span>
                  </div>
                  <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[11px] font-medium text-[#7a8b95] mt-0.5 font-technical">
                      <p className="flex items-center">
                        <span className="font-light mr-1">System by</span> 
                        <span className="font-black text-[#212c46]">T All Intelligence</span>
                      </p>
                      <span className="hidden md:inline text-[#d7d7d7]">|</span>
                      <p className="flex items-center gap-1.5"><PhoneCall size={12} className="text-[#a54f6b]" /> 082-5695654</p>
                      <span className="hidden md:inline text-[#d7d7d7]">|</span>
                      <p className="flex items-center gap-1.5"><Mail size={12} className="text-[#3f809e]" /> tallintelligence.ho@gmail.com</p>
                      <span className="hidden md:inline text-[#d7d7d7]">|</span>
                      <p className="flex items-center gap-1.5 font-bold uppercase tracking-wider">ALL RIGHTS RESERVED</p>
                  </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-4 right-4 z-[999] flex items-end gap-2">
        <QuickActions />
        <DebugToggle />
      </div>
    </SecurityGuard>
  );
}
