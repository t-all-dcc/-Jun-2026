import React, { useState, useEffect, useMemo } from 'react';
import { RecoloredLogo } from './RecoloredLogo';
import { Clock, Calendar, Box, Bell, Globe, Check, AlertTriangle, CheckCircle, Trash2, BellOff, CalendarRange } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { language, toggleLanguage, t } = useLanguage();
  
  const {
    notifications,
    toggleRead,
    markAllRead,
    deleteNotification,
    clearAll,
    referenceDate,
    setReferenceDate
  } = useNotifications();

  const [showDropdown, setShowDropdown] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter(n => !n.read);
    }
    return notifications;
  }, [notifications, filter]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleRead = (id: string) => {
    toggleRead(id);
  };

  const handleMarkAllRead = () => {
    markAllRead();
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  const handleClearAll = () => {
    clearAll();
  };

  return (
    <header className="h-24 px-8 flex flex-row items-center justify-between z-10 shrink-0 bg-transparent w-full">
      <div className="flex items-center gap-6">
        <div className="flex items-center justify-center shrink-0 w-11 h-11">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
            <defs>
              {/* สารการไล่โทนสีหลัก (Deep Navy -> Sky Blue -> Gold) */}
              <linearGradient id="smartHrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b58c4f" />
                <stop offset="50%" stopColor="#3f809e" />
                <stop offset="100%" stopColor="#212c46" />
              </linearGradient>
              <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#b58c4f" />
              </radialGradient>
            </defs>
            
            {/* กรอบวงกลมลายเส้นประรอบตัวบุคคล */}
            <circle cx="12" cy="12" r="10" stroke="url(#smartHrGrad)" strokeWidth="2" strokeDasharray="3 1.5" />
            
            {/* สัญลักษณ์ส่วนหัวและลำตัวคนด้านใน */}
            <path d="M12 6c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="url(#smartHrGrad)" />
            <path d="M6 18c0-2.2 4-3.5 6-3.5s6 1.3 6 3.5v1H6v-1z" fill="url(#smartHrGrad)" />
            
            {/* โหนดเครือข่ายการเชื่อมโยงข้อมูลรอบนอก */}
            <circle cx="5" cy="10" r="2" fill="#3f809e" />
            <circle cx="19" cy="10" r="2" fill="#b58c4f" />
            <circle cx="12" cy="19" r="1.5" fill="#212c46" />
            <line x1="5" y1="10" x2="8" y2="10" stroke="#3f809e" strokeWidth="1" strokeDasharray="1" />
            <line x1="16" y1="10" x2="19" y2="10" stroke="#b58c4f" strokeWidth="1" strokeDasharray="1" />
          </svg>
        </div>
        <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="font-prompt font-semibold text-[22px] tracking-wide uppercase leading-none">
                  <span className="text-[#212c46]">SMART </span>
                  <span className="text-[#212c46]">HUMAN CAPITAL </span>
                  <span className="text-[#3f809e]">MANAGEMENT</span>
                </span>
                <span className="bg-[#b58c4f] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded ml-2 tracking-wider shrink-0 font-sans">
                  {t('HR ENGINE', 'กลไกเอชอาร์')}
                </span>
            </div>
            <div className="flex items-center gap-3 mt-1 font-exception-header">
                <div className="w-10 h-[1.5px] bg-[#b58c4f]"></div>
                <span className="text-[9.5px] font-bold text-[#7a8b95] uppercase tracking-[0.2em] leading-none">
                  {t('INTEGRATED TALENT AND RESOURCE MANAGEMENT', 'การจัดการความสามารถและทรัพยากรแบบบูรณาการ')}
                </span>
            </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
          <button 
            onClick={toggleLanguage}
            className="h-11 px-4 rounded-full bg-white shadow-sm flex items-center justify-center text-[#212c46] hover:bg-[#f8f9fa] transition-all border border-[#cdd0db]/50 hover:scale-105 shrink-0 hidden md:flex font-black text-[11px] gap-2"
          >
            <Globe size={14} className="text-[#d1a45f]" />
            {language}
          </button>
          <div className="flex items-center bg-white rounded-full shadow-sm p-1 pr-1.5 pl-6 gap-5 border border-[#cdd0db]/50 h-11">
              <div className="flex flex-col justify-center items-center">
                  <span className="text-[9px] font-black text-[#5f7ab7] uppercase tracking-[0.1em] leading-none mb-0.5">{currentTime.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                  <span className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#022d41] to-[#214573] leading-none">{currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="bg-[#1d2636] text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-inner h-full">
                  <Clock size={14} className="text-[#7685b9]" strokeWidth={2.5} />
                  <span className="text-[12px] font-black font-mono tracking-widest mt-0.5">
                      {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
              </div>
          </div>
          
          {/* Notification Bell Dropdown Panel */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-[#3f809e] hover:bg-[#f8f9fa] transition-all group border border-[#cdd0db]/50 hover:scale-105 shrink-0 hidden md:flex"
            >
                <Bell size={18} className="group-hover:rotate-12 transition-transform" strokeWidth={2} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-[#932c2e] text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-[0_0_0_2px_#ffffff] px-1 animate-pulse">
                    {unreadCount}
                  </span>
                )}
            </button>

            {/* Backdrop overlay for close click */}
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent cursor-default" 
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-xl border border-[#eaeaec] z-50 overflow-hidden text-left flex flex-col max-h-[500px]">
                  {/* Header */}
                  <div className="p-4 border-b border-[#f3f3f5] bg-[#212c46] text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Bell size={16} className="text-[#d1a45f]" />
                      <span className="font-extrabold text-[12px] tracking-wider uppercase">
                        {t('Alerts & Tasks', 'การแจ้งเตือนและงานค้าง')}
                      </span>
                      {unreadCount > 0 && (
                        <span className="bg-[#932c2e] text-[10px] px-2 py-0.5 rounded-full font-black ml-1">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-slate-300 hover:text-white font-bold transition-all underline border-none bg-transparent"
                      >
                        {t('Mark all read', 'อ่านแล้วทั้งหมด')}
                      </button>
                    )}
                  </div>

                  {/* Filter Tabs */}
                  {notifications.length > 0 && (
                    <div className="flex border-b border-[#f3f3f5] bg-slate-50 text-[10px] font-black uppercase tracking-wider">
                      <button 
                        onClick={() => setFilter('all')}
                        className={`flex-1 py-2 text-center border-b-2 transition-all ${filter === 'all' ? 'border-[#3f809e] text-[#212c46] font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                      >
                        {t('All', 'ทั้งหมด')} ({notifications.length})
                      </button>
                      <button 
                        onClick={() => setFilter('unread')}
                        className={`flex-1 py-2 text-center border-b-2 transition-all ${filter === 'unread' ? 'border-[#3f809e] text-[#212c46] font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                      >
                        {t('Unread ONLY', 'เฉพาะยังไม่อ่าน')} ({unreadCount})
                      </button>
                    </div>
                  )}

                  {/* Simulation Date Selector */}
                  <div className="p-3 bg-slate-50 border-b border-[#f3f3f5] flex items-center justify-between gap-2 text-[11px] shrink-0">
                    <span className="font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                      <CalendarRange size={13} className="text-[#3f809e]" />
                      {t('Simulate Date:', 'จำลองวันที่:')}
                    </span>
                    <input 
                      type="date"
                      value={referenceDate}
                      onChange={(e) => setReferenceDate(e.target.value)}
                      className="text-[11px] font-bold text-[#212c46] border border-[#eaeaec] rounded-lg px-2.5 py-1 bg-white outline-none focus:border-[#3f809e] transition-all"
                    />
                  </div>

                  {/* List Content */}
                  <div className="overflow-y-auto flex-1 max-h-[320px] divide-y divide-slate-100">
                    {filteredNotifications.length === 0 ? (
                      <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <BellOff size={20} />
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-normal">
                          {filter === 'unread' 
                            ? t('No unread alerts', 'ไม่มีการแจ้งเตือนที่ค้างอยู่') 
                            : t('No alerts at this moment', 'ไม่มีการแจ้งเตือนในระบบ')}
                        </p>
                      </div>
                    ) : (
                      filteredNotifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => handleToggleRead(notif.id)}
                          className={`p-4 flex gap-3 items-start transition-all cursor-pointer relative hover:bg-slate-50 group/item ${!notif.read ? 'bg-[#3f809e]/5 border-l-4 border-l-[#3f809e]' : 'bg-white'}`}
                        >
                          {/* Category Icon */}
                          <div className="mt-0.5 shrink-0">
                            {notif.type === 'expiry' ? (
                              <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                                <AlertTriangle size={14} />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                                <CheckCircle size={14} />
                              </div>
                            )}
                          </div>

                          {/* Message Details */}
                          <div className="flex-1 flex flex-col gap-0.5">
                            <div className="flex justify-between items-start gap-1">
                              <span className="font-extrabold text-[12px] text-[#212c46] leading-tight group-hover/item:text-[#3f809e] transition-colors">
                                {t(notif.title, notif.titleTh)}
                              </span>
                              {notif.daysLeft !== undefined && (
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded leading-none shrink-0 ${notif.daysLeft <= 7 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-600'}`}>
                                  {notif.daysLeft} {t('days', 'วัน')}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug font-medium">
                              {t(notif.description, notif.descriptionTh)}
                            </p>
                            <span className="text-[9px] font-bold font-mono text-slate-400 mt-1 uppercase">
                              {t('Due:', 'กำหนด:')} {notif.dateStr}
                            </span>
                          </div>

                          {/* Action Controls */}
                          <div className="flex flex-col gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleRead(notif.id);
                              }}
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-[#3f809e] text-slate-600 hover:text-white flex items-center justify-center transition-all"
                              title={notif.read ? t('Mark as Unread', 'เปลี่ยนเป็นยังไม่ได้อ่าน') : t('Mark as Read', 'ทำเครื่องหมายว่าอ่านแล้ว')}
                            >
                              <Check size={12} strokeWidth={3} />
                            </button>
                            <button 
                              onClick={(e) => handleDeleteNotification(notif.id, e)}
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-600 flex items-center justify-center transition-all"
                              title={t('Delete Alert', 'ลบการแจ้งเตือน')}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="p-3 bg-slate-50 border-t border-[#f3f3f5] flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-bold uppercase tracking-wider">
                        {t('Local Storage Persisted', 'บันทึกในเครื่องเรียบร้อย')}
                      </span>
                      <button 
                        onClick={handleClearAll}
                        className="text-red-600 hover:text-red-800 font-extrabold flex items-center gap-1 uppercase transition-all bg-transparent border-none"
                      >
                        <Trash2 size={10} />
                        {t('Clear All', 'ล้างทั้งหมด')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
      </div>
    </header>
  );
}
