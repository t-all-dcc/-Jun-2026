import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { initAuth, googleSignIn, logout, getAccessToken } from '../../../firebase';
import { getGmailProfile, sendGmailMessage } from '../../../services/gmailService';
import SkeletonLoading from '../../../components/shared/SkeletonLoading';
import { EmailLog } from './types';
import GmailAuthCard from './components/GmailAuthCard';
import GmailTestSandbox from './components/GmailTestSandbox';
import GmailLogsTable from './components/GmailLogsTable';

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
      {/* Header Box following AGENTS.md typography */}
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
            <GmailAuthCard 
              hasAuth={hasAuth}
              userProfile={userProfile}
              gmailProfile={gmailProfile}
              isLoadingProfile={isLoadingProfile}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
            />
          </div>

          {/* Sandbox & Logs Output */}
          <div className="lg:col-span-8 space-y-4">
            <GmailTestSandbox 
              hasAuth={hasAuth}
              testRecipient={testRecipient}
              setTestRecipient={setTestRecipient}
              testSubject={testSubject}
              setTestSubject={setTestSubject}
              testBody={testBody}
              setTestBody={setTestBody}
              isSendingTest={isSendingTest}
              sendResult={sendResult}
              handleSendTestEmail={handleSendTestEmail}
            />
            
            <GmailLogsTable 
              logs={logs}
              clearLogs={clearLogs}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
