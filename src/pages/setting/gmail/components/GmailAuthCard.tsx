import React from 'react';
import { Mail, CheckCircle, AlertTriangle, LogOut, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  hasAuth: boolean;
  userProfile: any;
  gmailProfile: any;
  isLoadingProfile: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
}

export default function GmailAuthCard({
  hasAuth,
  userProfile,
  gmailProfile,
  isLoadingProfile,
  handleLogin,
  handleLogout
}: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-[#eaeaec] p-6 shadow-sm text-left">
        <h3 className="text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-4">
          OAuth 2.0 Integration Status
        </h3>

        {!hasAuth ? (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
              <div className="text-[11.5px] leading-relaxed">
                <p className="font-bold text-amber-900">NOT CONNECTED</p>
                <p className="text-amber-800 mt-1">
                  คุณยังไม่ได้อนุญาตการใช้ระบบ Gmail ของคุณผ่าน Gmail API ทางเราแนะนำให้ทำการเชื่อมต่อเพื่อส่งประวัติและการจัดส่งแจ้งเตือนต่ออายุจริง
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#212c46] hover:bg-[#1c273e] text-[#b58c4f] border border-[#b58c4f]/20 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] transition-all shadow-md"
            >
              <Mail size={16} /> Connect Gmail Service
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
              <div className="text-[11.5px] leading-relaxed">
                <p className="font-bold text-emerald-900">SYSTEM CONNECTED</p>
                <p className="text-emerald-800 mt-1">
                  ระบบได้รับสิทธิ์ในการควบคุม outbound notification ของคุณด้วยความปลอดภัยสูงสำเร็จ
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border border-[#eaeaec] rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                {userProfile?.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#212c46] to-[#4d87a8] flex items-center justify-center text-white font-black">
                    G
                  </div>
                )}
                <div className="text-left overflow-hidden">
                  <p className="text-[12px] font-black text-[#212c46] truncate">
                    {userProfile?.displayName || 'Google Account'}
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono truncate">
                    {userProfile?.email}
                  </p>
                </div>
              </div>

              {isLoadingProfile ? (
                <div className="h-6 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-t-transparent border-[#212c46] rounded-full animate-spin"></div>
                </div>
              ) : (
                gmailProfile && (
                  <div className="pt-2 border-t border-gray-200 grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                      <p className="text-[8px] text-gray-400 font-bold uppercase">Connected Email</p>
                      <p className="text-[11px] font-black text-[#212c46] truncate font-mono mt-0.5">
                        {gmailProfile.emailAddress}
                      </p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                      <p className="text-[8px] text-gray-400 font-bold uppercase">User Messages</p>
                      <p className="text-[11px] font-black text-[#212c46] font-mono mt-0.5">
                        {gmailProfile.messagesTotal}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-gray-50 text-rose-700 border border-[#eaeaec] rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all"
            >
              <LogOut size={14} /> Log Out Gmail Account
            </button>
          </div>
        )}
      </div>

      {/* Guidelines & Safety */}
      <div className="bg-white rounded-2xl border border-[#eaeaec] p-6 shadow-sm text-left space-y-4">
        <h3 className="text-[11px] font-black text-[#7a8b95] uppercase tracking-widest flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-[#b58c4f]" /> Compliance & Security
        </h3>
        <p className="text-[11.5px] leading-relaxed text-slate-600">
          ระบบเชื่อมต่อ Gmail API เป็นแบบ <strong>Client-side Only In-Memory Token Caching</strong> 
          ตามประกาศคู่มือ AGENTS.md ไม่มีการส่งรหัสผ่านหรือจัดเก็บ Token ไว้ในระบบ Server 
          หรือคีย์ข้อมูลสำคัญบน Client-Side Storage นอกความทรงจำ
        </p>
        <div className="p-3 bg-sky-50 border border-sky-100/50 rounded-xl text-sky-850 flex gap-2 items-start text-[11px] leading-relaxed">
          <Sparkles size={16} className="text-sky-600 shrink-0 mt-0.5" />
          <p>
            <strong>Automation Note:</strong> โมดูล Supplier Cert และ Renewal 
            จะใช้อีเมลนี้เพื่อส่งหนังสือขอรวบรวมใบรับรองใหม่โดยตรงผ่าน API บนเบราว์เซอร์ของคุณ
          </p>
        </div>
      </div>
    </div>
  );
}
