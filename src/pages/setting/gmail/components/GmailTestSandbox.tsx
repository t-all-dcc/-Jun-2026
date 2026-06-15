import React from 'react';
import { Code, Send, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  hasAuth: boolean;
  testRecipient: string;
  setTestRecipient: (val: string) => void;
  testSubject: string;
  setTestSubject: (val: string) => void;
  testBody: string;
  setTestBody: (val: string) => void;
  isSendingTest: boolean;
  sendResult: { status: 'IDLE' | 'SUCCESS' | 'ERROR'; msg: string };
  handleSendTestEmail: (e: React.FormEvent) => void;
}

export default function GmailTestSandbox({
  hasAuth,
  testRecipient,
  setTestRecipient,
  testSubject,
  setTestSubject,
  testBody,
  setTestBody,
  isSendingTest,
  sendResult,
  handleSendTestEmail
}: Props) {
  return (
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
  );
}
