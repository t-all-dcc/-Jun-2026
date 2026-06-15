import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle, Info, Calendar, Filter, Trash2, CheckSquare } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  category: 'system' | 'announcement' | 'alert' | 'update';
  date: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NT-1001',
    title: 'Monthly Payroll Computation Initialized',
    titleTh: 'เริ่มดำเนินการประมวลผลเงินเดือนประจำเดือน',
    description: 'The payroll calculations for June 2026 have been initiated. Please verify attendance logs and overtime requests by June 25.',
    descriptionTh: 'เริ่มการคำนวณเงินเดือนประจำเดือนมิถุนายน 2569 แล้ว กรุณาตรวจสอบบันทึกเวลาปฏิบัติงานและการขออนุมัติล่วงเวลาก่อนวันที่ 25 มิ.ย.',
    category: 'system',
    date: '2026-06-14 09:00',
    read: false,
  },
  {
    id: 'NT-1002',
    title: 'New Factory Safety Regulations Published',
    titleTh: 'ประกาศข้อบังคับความปลอดภัยโรงงานฉบับปรับปรุงใหม่',
    description: 'Chaisri Agro Industrial Group has updated safety protocols for all zone inspectors. PDF manual is now available inside JD repository.',
    descriptionTh: 'ชัยศรีอะโกรอินดัสเทรียล ได้ปรับปรุงระเบียบปฏิบัติความปลอดภัยสำหรับเจ้าหน้าที่ตรวจโซน สามารถอ่านแผนผังและดาวน์โหลด PDF ได้ในคลังเอกสารลักษณะงาน',
    category: 'announcement',
    date: '2026-06-12 14:30',
    read: false,
  },
  {
    id: 'NT-1003',
    title: 'Google Sheets Data Connection Refreshed',
    titleTh: 'รีเฟรชการเชื่อมต่อฐานข้อมูล Google Sheets สำเร็จ',
    description: 'Automated sync completed successfully. 12 staff profiles updated, 3 leave balance spreadsheets synchronized with LockService.',
    descriptionTh: 'การซิงค์อัตโนมัติเสร็จสมบูรณ์ มีการปรับปรุงข้อมูลพนักงาน 12 รายการ และประสานฐานข้อมูลใบลาเรียบร้อยแล้ว',
    category: 'update',
    date: '2026-06-10 18:15',
    read: true,
  },
  {
    id: 'NT-1004',
    title: 'URGENT: Temporary Power Maintenance in Sector B',
    titleTh: 'ด่วนที่สุด: แจ้งปิดปรับปรุงระบบไฟฟ้าชั่วคราว ณ แผนกบี',
    description: 'Sector B electrical framework will undergo inspection this Sunday. Onsite managers must coordinate shift schedule overrides.',
    descriptionTh: 'ระบบไฟฟ้าแผนกบีจะปิดปรับปรุงวันอาทิตย์นี้ หัวหน้าส่วนงานต้องประสานปรับเปลี่ยนกะการทำงานพนักงานของท่านทันที',
    category: 'alert',
    date: '2026-06-09 11:45',
    read: true,
  }
];

export default function GlobalNotification() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filtered = notifications.filter(n => {
    if (selectedCategory === 'all') return true;
    return n.category === selectedCategory;
  });

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'alert':
        return {
          bg: 'bg-red-50 border-red-200 text-red-700',
          icon: <ShieldAlert className="text-red-600" size={18} />
        };
      case 'update':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          icon: <CheckCircle className="text-emerald-600" size={18} />
        };
      case 'system':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          icon: <Info className="text-blue-600" size={18} />
        };
      default:
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          icon: <Bell className="text-amber-600" size={18} />
        };
    }
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 rounded-2xl border border-[#3f809e]/40 bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <Bell size={22} className="text-[#3f809e]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-2xl">
              GLOBAL NOTIFICATIONS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">CENTER</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              SYSTEM ALERTS, BROADCAST ANNOUNCEMENTS, AND DATABASE UPDATE LOGS
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        <div className="bg-white rounded-3xl border border-[#eaeaec] shadow-sm overflow-hidden flex flex-col flex-1 min-h-[500px]">
          {/* TOOLBAR */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 gap-4">
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-slate-400" />
              <div className="flex flex-wrap gap-1">
                {['all', 'system', 'announcement', 'alert', 'update'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#212c46] text-white'
                        : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-[#212c46] flex items-center gap-2 shadow-sm transition-all text-right"
            >
              <CheckSquare size={14} className="text-[#b58c4f]" /> Mark all as read
            </button>
          </div>

          {/* LIST */}
          <div className="flex-1 divide-y divide-slate-100 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map(item => {
                const styles = getCategoryStyles(item.category);
                return (
                  <div
                    key={item.id}
                    className={`p-6 transition-colors flex items-start justify-between gap-4 ${
                      item.read ? 'bg-white opacity-85' : 'bg-amber-50/25 border-l-4 border-l-[#b58c4f]'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${styles.bg}`}>
                        {styles.icon}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                            {item.id}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 font-bold flex items-center gap-1">
                            <Calendar size={12} /> {item.date}
                          </span>
                          {!item.read && (
                            <span className="bg-[#b58c4f] h-2 w-2 rounded-full animate-ping"></span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-black text-[#212c46] text-sm tracking-tight">{item.title}</h4>
                          <h5 className="font-bold text-slate-700 text-xs mt-0.5 font-sans">{item.titleTh}</h5>
                        </div>

                        <p className="text-slate-500 text-[11px] leading-relaxed max-w-4xl pt-1">
                          {item.description}
                        </p>
                        <p className="text-slate-400 text-[11px] leading-relaxed max-w-4xl font-sans font-semibold">
                          {item.descriptionTh}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!item.read && (
                        <button
                          onClick={() => handleMarkAsRead(item.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-[#212c46] hover:text-white rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-600 transition-colors"
                        >
                          Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Delete Announcement"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Bell size={40} className="text-slate-300 animate-bounce mb-3" />
                <p className="font-mono text-xs font-black text-slate-400 uppercase tracking-widest">
                  No Notification items to display
                </p>
                <p className="text-[11px] text-slate-400 font-sans font-semibold mt-1">
                  ไม่มีกิจกรรมและการแจ้งเตือนที่ตรงกับตัวกรองของคุณในขณะนี้
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
