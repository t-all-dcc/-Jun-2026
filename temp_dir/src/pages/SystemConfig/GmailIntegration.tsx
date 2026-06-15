import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertTriangle, Send, LogOut, ShieldCheck, Sparkles, Code, History } from 'lucide-react';
import { initAuth, googleSignIn, logout, getAccessToken } from '../../firebase';
import { getGmailProfile, sendGmailMessage } from '../../services/gmailService';
import SkeletonLoading from '../../components/shared/SkeletonLoading';

interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
  error?: string;
}

export default function GmailIntegration() {
  const [hasAuth, setHasAuth] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [gmailProfile, setGmailProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Form states for Test Sandbox
  const [testRecipient, setTestRecipient] = useState('');
  const [testSubject, setTestSubject] = useState('SmartCert Integration Test');
  const [testBody, setTestBody] = useState(
    'สวัสดีครับ/ค่ะ,\n\nนี่คืออีเมลทดสอบเชื่อมโยงระบบจากโมดูล Gmail API Integration ในระบบ SmartCert Library.\n\nขอแสดงความนับถือ,\nฝ่ายพัฒนาระบบผู้เชี่ยวชาญ T All Intelligence'
  );
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [sendResult, setSendResult] = useState<{ status: 'IDLE' | 'SUCCESS' | 'ERROR'; msg: string }>({
    status: 'IDLE',
    msg: '',
  });

  // Local dispatch logs
  const [logs, setLogs] = useState<EmailLog[]>([]);

  // Load profile & initial state
  useEffect(() => {
    initAuth(
      async (user) => {
        setHasAuth(true);
        setUserProfile(user);
        await reloadGmailProfile();
      },
      () => {
        setHasAuth(false);
        setUserProfile(null);
        setGmailProfile(null);
      }
    );

    // Initial load logs from localStorage
    const savedLogs = localStorage.getItem('smartcert_gmail_logs');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error('Error parsing saved logs:', e);
      }
    }
  }, []);

  const reloadGmailProfile = async () => {
    const token = await getAccessToken();
    if (token) {
      setIsLoadingProfile(true);
      const profile = await getGmailProfile(token);
      setGmailProfile(profile);
      setIsLoadingProfile(false);
    }
  };

  const handleLogin = async () => {
    try {
      await googleSignIn();
      await reloadGmailProfile();
    } catch (err) {
      console.error('OAuth sign in error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setHasAuth(false);
      setUserProfile(null);
      setGmailProfile(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipient) {
      setSendResult({ status: 'ERROR', msg: 'โปรดระบุที่อยู่อีเมลผู้รับ' });
      return;
    }

    setIsSendingTest(true);
    setSendResult({ status: 'IDLE', msg: '' });

    try {
      await sendGmailMessage(testRecipient, testSubject, testBody);
      
      const newLog: EmailLog = {
        id: `LOG-${Date.now()}`,
        recipient: testRecipient,
        subject: testSubject,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
      };
      
      const updatedLogs = [newLog, ...logs].slice(0, 50); // Keep last 50
      setLogs(updatedLogs);
      localStorage.setItem('smartcert_gmail_logs', JSON.stringify(updatedLogs));

      setSendResult({
        status: 'SUCCESS',
        msg: `อีเมลถูกส่งออกสำเร็จผ่าน API ของ ${gmailProfile?.emailAddress || 'บัญชีของคุณ'} แล้ว!`,
      });
      setTestRecipient('');
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.message || 'Unknown integration error';
      
      const newLog: EmailLog = {
        id: `LOG-${Date.now()}`,
        recipient: testRecipient,
        subject: testSubject,
        timestamp: new Date().toISOString(),
        status: 'FAILED',
        error: errorMsg,
      };

      const updatedLogs = [newLog, ...logs].slice(0, 50);
      setLogs(updatedLogs);
      localStorage.setItem('smartcert_gmail_logs', JSON.stringify(updatedLogs));

      setSendResult({
        status: 'ERROR',
        msg: `การส่งอีเมลล้มเหลว: ${errorMsg}. ตรวจสอบให้แน่ใจว่าสิทธิ์การใช้งาน Gmail ได้รับอนุญาตสำเร็จ`,
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const clearLogs = () => {
    if (window.confirm('คุณต้องการรีเซ็ตประวัติการบันทึกการส่งอีเมลหรือไม่?')) {
      setLogs([]);
      localStorage.removeItem('smartcert_gmail_logs');
    }
  };

  if (isLoading) {
    return <SkeletonLoading layout="dashboard" />;
  }

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* 1. Header Box following AGENTS.md typography */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
              <Mail size={22} strokeWidth={2.5} className="text-[#3f809e]" />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
              GMAIL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">OUTBOUND</span> CONSOLE
            </h3>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              SECURELY AUTHENTICATE, MANAGE AND MONITOR COMPLIANCE NOTIFICATIONS
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Connection & Status Section */}
        <div className="lg:col-span-4 space-y-4">
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

        {/* Sandbox & Logs Output */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-[#eaeaec] p-6 shadow-sm text-left">
            <div className="border-b border-[#eaeaec] pb-3 mb-4">
              <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-1.5">
                <Code size={15} className="text-[#3f809e]" /> DIRECT TEST SANDBOX
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                Test the REST API by sending a secure message directly through your connection
              </p>
            </div>

            <form onSubmit={handleSendTestEmail} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">
                    Recipient Email Address (ผู้รับปลายทาง)
                  </label>
                  <input
                    type="email"
                    required
                    disabled={!hasAuth}
                    placeholder="e.g. supplier@company.com"
                    value={testRecipient}
                    onChange={(e) => setTestRecipient(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-[#eaeaec] focus:border-[#b7a159] rounded-xl px-4 py-2.5 text-[12px] font-bold text-[#212c46] outline-none transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">
                    Email Subject Line (หัวเรื่อง)
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!hasAuth}
                    value={testSubject}
                    onChange={(e) => setTestSubject(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-[#eaeaec] focus:border-[#b7a159] rounded-xl px-4 py-2.5 text-[12px] font-bold text-[#212c46] outline-none transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">
                  Message Body Content (เนื้อหาอีเมล - UTF-8 / Thai Supported)
                </label>
                <textarea
                  required
                  disabled={!hasAuth}
                  rows={4}
                  value={testBody}
                  onChange={(e) => setTestBody(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-[#eaeaec] focus:border-[#b7a159] rounded-xl p-4 text-[12px] font-medium text-[#212c46] outline-none transition-colors disabled:opacity-50 font-sans resize-none"
                />
              </div>

              {sendResult.status !== 'IDLE' && (
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-3 text-[11px] font-semibold leading-relaxed ${
                    sendResult.status === 'SUCCESS'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {sendResult.status === 'SUCCESS' ? (
                    <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                  ) : (
                    <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={16} />
                  )}
                  <p>{sendResult.msg}</p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!hasAuth || isSendingTest}
                  className="bg-[#212c46] text-[#b58c4f] hover:bg-[#1c273e] px-7 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:text-white transition-all shadow-md flex items-center gap-2 border border-[#b58c4f]/15 disabled:opacity-50 cursor-pointer"
                >
                  {isSendingTest ? (
                    <>
                      <div className="w-3 h-3 border-2 border-t-transparent border-[#b58c4f] rounded-full animate-spin"></div>
                      Dispatching via API...
                    </>
                  ) : (
                    <>
                      <Send size={12} /> Dispatch Outbound Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* History / Logs table */}
          <div className="bg-white rounded-2xl border border-[#eaeaec] p-6 shadow-sm text-left">
            <div className="flex justify-between items-center border-b border-[#eaeaec] pb-3 mb-4">
              <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-1.5">
                <History size={15} className="text-[#a54f6b]" /> Outbound Dispatch Register Logs
              </h3>
              {logs.length > 0 && (
                <button
                  onClick={clearLogs}
                  className="text-[10px] font-black text-rose-700 uppercase hover:underline"
                >
                  Clear History
                </button>
              )}
            </div>

            {logs.length === 0 ? (
              <div className="py-8 text-center text-slate-400 font-bold uppercase text-[11px] tracking-widest">
                No outbound transmittals on record.
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left font-sans border-collapse">
                  <thead className="bg-[#212c46] text-white uppercase tracking-widest text-[10px] font-black">
                    <tr>
                      <th className="py-3 px-4 rounded-l-lg">ID</th>
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4 font-mono">Timestamp (UTC)</th>
                      <th className="py-3 px-4 rounded-r-lg text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[11.5px] font-mono">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="py-2.5 px-4 text-[#4d87a8] font-black">{log.id}</td>
                        <td className="py-2.5 px-4 font-sans font-bold text-[#212c46] truncate max-w-[120px]">
                          {log.recipient}
                        </td>
                        <td className="py-2.5 px-4 font-sans font-medium text-slate-600 truncate max-w-[150px]">
                          {log.subject}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 text-[10.5px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {log.status === 'SUCCESS' ? (
                            <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-full border border-emerald-100">
                              SENT
                            </span>
                          ) : (
                            <span
                              className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 text-[9px] font-black rounded-full border border-rose-100 cursor-help"
                              title={log.error}
                            >
                              FAILED
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
