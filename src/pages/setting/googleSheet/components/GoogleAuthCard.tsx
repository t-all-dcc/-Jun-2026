import React from 'react';
import { UserCheck, FileSpreadsheet, Database, Mail } from 'lucide-react';

interface Props {
  user: any;
  spreadsheetId: string;
  handleDisconnect: () => void;
  handleGoogleSignIn: () => void;
}

export default function GoogleAuthCard({
  user,
  spreadsheetId,
  handleDisconnect,
  handleGoogleSignIn
}: Props) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-[#eaeaec] shadow-sm space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 shrink-0 shadow-sm">
          <UserCheck size={24} />
        </div>
        <div className="text-left">
          <h3 className="text-[15px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
            <span>Google Developer Auth</span>
          </h3>
          <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mt-1 leading-relaxed">
            Connect Google Account for format execution.
          </p>
        </div>
      </div>
      
      <div className="p-6 border border-[#eaeaec] bg-[#f8f9fa] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#b58c4f] shrink-0 shadow-sm bg-white">
                <img 
                  src={user.photoURL || "https://lh3.googleusercontent.com/a/default-user=s96-c"} 
                  alt="User Profile" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="text-left">
                <p className="font-black text-[13px] text-[#212c46] uppercase tracking-tight">
                  {user.displayName || "Advance Group DCC"}
                </p>
                <p className="text-[10px] font-bold font-mono text-[#7a8b95]">
                  {user.email || "advancegroup.dcc@gmail.com"}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-[#212c46]/5 border border-[#212c46]/10 flex items-center justify-center text-[#212c46]/40 text-sm font-black shrink-0 font-mono">
                DCC
              </div>
              <div className="text-left">
                <p className="font-black text-[13px] text-[#212c46] uppercase tracking-tight">No Account Connected</p>
                <p className="text-[10px] font-bold font-mono text-[#7a8b95]">Sign in to authorize sheets.</p>
              </div>
            </>
          )}
        </div>

        <div>
          {user ? (
            <button 
              onClick={handleDisconnect} 
              className="px-6 py-2.5 rounded-xl text-[#932c2e] hover:text-white border-2 border-[#932c2e]/40 hover:bg-[#932c2e] hover:border-[#932c2e] font-black text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-sm"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center gap-3 px-6 py-2.5 bg-white hover:bg-slate-50 text-[#1f1f1f] font-black text-[10px] uppercase tracking-widest border border-[#eaeaec] rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 duration-200 cursor-pointer"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 block shrink-0">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-[#eaeaec]">
        <h4 className="text-[11px] font-black text-[#7a8b95] uppercase tracking-[0.15em] text-left">
          Google APIs Sync Matrix
        </h4>
        <div className="grid grid-cols-1 gap-3">
          
          {/* Google Sheets */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-emerald-50/20 border border-emerald-100 rounded-xl text-left gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-100/40 text-emerald-700 rounded-lg flex items-center justify-center border border-emerald-100/50 shadow-sm shrink-0">
                <FileSpreadsheet size={18} />
              </div>
              <div>
                <p className="text-[12px] font-black text-[#212c46] uppercase tracking-wider">Google Sheets API</p>
                <p className="text-[10px] font-bold text-slate-500 leading-tight">เชื่อมสารบบพนักงาน-ใบรับรองและสิทธิ์พนักงานทั้งหมด</p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase self-start sm:self-center ${user && spreadsheetId ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
              {user && spreadsheetId ? 'CONNECTED' : 'PENDING'}
            </span>
          </div>

          {/* Google Drive */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-sky-50/20 border border-sky-100 rounded-xl text-left gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-sky-100/40 text-sky-700 rounded-lg flex items-center justify-center border border-sky-100/50 shadow-sm shrink-0">
                <Database size={18} />
              </div>
              <div>
                <p className="text-[12px] font-black text-[#212c46] uppercase tracking-wider">Google Drive Cloud Storage</p>
                <p className="text-[10px] font-bold text-slate-500 leading-tight">จัดเก็บใบรับรอง มอก. มกอช. และ HALAL PDF ในคลาวด์</p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase self-start sm:self-center ${user ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
              {user ? 'CONNECTED' : 'PENDING'}
            </span>
          </div>

          {/* Gmail API */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-amber-50/20 border border-amber-100 rounded-xl text-left gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-100/40 text-amber-700 rounded-lg flex items-center justify-center border border-amber-100/50 shadow-sm shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[12px] font-black text-[#212c46] uppercase tracking-wider">Gmail Dispatch Engine</p>
                <p className="text-[10px] font-bold text-slate-500 leading-tight">จัดส่งอีเมลแจ้งเตือนการหมดอายุของใบรับรองหา Supplier</p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase self-start sm:self-center ${user ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
              {user ? 'INTEGRATED' : 'SIMULATION'}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
