import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import UserGuideButton from '../../components/shared/UserGuideButton';
import KpiCard from '../../components/shared/KpiCard';
import Swal from 'sweetalert2';
import SkeletonLoading from '../../components/shared/SkeletonLoading';
import { initAuth, googleSignIn, logout } from '../../firebase';
import { 
  Database,
  Globe, 
  Key, 
  Save, 
  Loader2, 
  ShieldAlert, 
  Timer, 
  Info, 
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  UserCheck,
  RefreshCw,
  BookOpen,
  Settings,
  HelpCircle,
  Mail,
  X
} from 'lucide-react';

function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-5 px-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg"><BookOpen size={22} className="text-[#b7a159]"/> SYNC GUIDE</h3>
            <p className="text-[12px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1.5">Google Sheets Setup</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"><X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Info size={18} className="text-[#b7a159]"/> 1. Authentication
            </h4>
            <p className="text-[12px] mb-3 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
               ขั้นตอนแรกคุณต้อง <b>Sign in with Google</b> ด้วยบัญชีที่มีสิทธิ์เข้าถึงหรือเป็นเจ้าของ Spreadsheet นั้นๆ ระบบจะใช้ Token ในการสร้างและแก้ไขข้อมูลแทนคุณ
            </p>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Settings size={18} className="text-[#4d87a8]"/> 2. Setup & Formatting
            </h4>
            <p className="text-[12px] mb-3">เมื่อลงชื่อเข้าใช้สำเร็จ ให้นำ Spreadsheet ID มาใส่ (ดูได้จาก URL ของหน้า Google Sheet) แล้วกดปุ่ม RUN SETUP ระบบจะทำการ:</p>
            <ul className="list-none pl-0 space-y-3">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
                  <Database size={16} className="shrink-0 text-[#657f4d] mt-0.5"/> 
                  <div>สร้างสารบบ Sheet ทั้งหมดที่ระบบต้องการ (เช่น Users, Calendar, Departments) หากไม่มีอยู่</div>
                </li>
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
                  <Settings size={16} className="shrink-0 text-[#657f4d] mt-0.5"/> 
                  <div>เพิ่ม Column Header ในบรรทัดแรก พร้อมตั้งค่าแช่แข็งแถวแรก (Freeze Row) และไฮไลต์สีพื้นหลังแถวแรก</div>
                </li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <AlertTriangle size={18} className="text-[#d96245]"/> 3. Precautions
            </h4>
            <ul className="list-none pl-0 space-y-3">
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-3 rounded-xl border border-[#932c2e]/30">
                  <AlertTriangle size={16} className="shrink-0 text-[#932c2e] mt-0.5"/> 
                  <div className="text-[#a74353]"><strong>ข้อควรระวัง:</strong> อย่าลบหรือเปลี่ยนชื่อ Column Headers ในแถวที่ 1 ไม่เช่นนั้นระบบอาจจะไม่สามารถ Map ข้อมูลได้ถูกต้อง</div>
                </li>
            </ul>
          </section>
        </div>
      </div>
    </>, document.body
  );
}

export default function GoogleSheetsSync() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState(() => {
    return localStorage.getItem('cfg_target_spreadsheet_id') || '1L7smTyoFDIRaQk-NDivYTMwgQ52V4ezSfagWOIR6x0s';
  });
  const [isFormatting, setIsFormatting] = useState(false);
  const [formatLogs, setFormatLogs] = useState<string[]>([]);

  // --- Apps Script Web App Connection Override States ---
  const [appsScriptUrl, setAppsScriptUrl] = useState<string>(() => {
    return localStorage.getItem('cfg_apps_script_url') || 
           import.meta.env.VITE_APPS_SCRIPT_URL || 
           "https://script.google.com/macros/s/AKfycbx3DLqU1OH1AtUnZnRBzte6JaIiL5Yw29wVfUQDrXCuV17uTY4noGoaAO5sn4dvR-CHQg/exec";
  });

  const [appsScriptApiKey, setAppsScriptApiKey] = useState<string>(() => {
    return localStorage.getItem('cfg_apps_script_api_key') || 
           import.meta.env.VITE_API_KEY || 
           "your_secret_key_here";
  });

  // --- Session Timeout Control States ---
  const [cfgSessionDuration, setCfgSessionDuration] = useState<number>(() => {
    const saved = localStorage.getItem('cfg_session_duration_sec');
    return saved ? parseInt(saved, 10) : 3600; // default 1 hour
  });

  const [cfgWarnThreshold, setCfgWarnThreshold] = useState<number>(() => {
    const saved = localStorage.getItem('cfg_warn_threshold_sec');
    return saved ? parseInt(saved, 10) : 120; // default 2 mins
  });

  // Observe and connect Google Account session and scope access token
  useEffect(() => {
    initAuth(
      (authUser: any, token: string | null) => {
        setUser(authUser);
        setAuthToken(token);
      },
      () => {
        setUser(null);
        setAuthToken(null);
      }
    );
  }, []);

  const handleSaveAppsScriptConfig = () => {
    if (!appsScriptUrl.trim()) {
      Swal.fire('ข้อผิดพลาด', 'กรุณาระบุ Google Apps Script Web App URL ด้วยค่ะ', 'error');
      return;
    }
    localStorage.setItem('cfg_apps_script_url', appsScriptUrl.trim());
    localStorage.setItem('cfg_apps_script_api_key', appsScriptApiKey.trim());

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'บันทึกการตั้งค่า Apps Script Web App สำเร็จ!',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  };

  const handleUpdateSessionConfig = (newDuration: number, newThreshold: number) => {
    if (newThreshold >= newDuration) {
      Swal.fire({
        icon: 'error',
        title: 'กำหนดช่วงเวลาแจ้งเตือนไม่ถูกต้อง',
        text: 'หน้าต่างแจ้งเตือนเซสชันหมดอายุต้องสั้นกว่าเวลารวมเซสชันสูงสุดนะคะ',
        confirmButtonColor: '#932c2e'
      });
      return;
    }

    setCfgSessionDuration(newDuration);
    setCfgWarnThreshold(newThreshold);
    localStorage.setItem('cfg_session_duration_sec', String(newDuration));
    localStorage.setItem('cfg_warn_threshold_sec', String(newThreshold));

    // Notify same window of configuration change
    window.dispatchEvent(new Event('session-config-updated'));

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'บันทึกเซสชันความปลอดภัยเรียบร้อยแล้วค่ะ',
      showConfirmButton: false,
      timer: 2000,
      background: '#f8f9fa'
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAuthToken(result.accessToken);
        Swal.fire({
          title: 'Signed In Successfully',
          text: `Connected to Google Account: ${result.user.email}`,
          icon: 'success',
          confirmButtonColor: '#212c46'
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      Swal.fire({
        title: 'Authentication Failed',
        text: error.message || 'Could not authenticate with Google.',
        icon: 'error',
        confirmButtonColor: '#932c2e'
      });
    }
  };

  const handleDisconnect = async () => {
    const result = await Swal.fire({
      title: 'Disconnect Google Account?',
      text: 'This will clear the current Google Sheets access token session.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#932c2e',
      cancelButtonColor: '#7a8b95',
      confirmButtonText: 'Yes, Disconnect'
    });

    if (result.isConfirmed) {
      await logout();
      setUser(null);
      setAuthToken(null);
      Swal.fire('Disconnected', 'Successfully signed out from Google account.', 'success');
    }
  };

  const handleRunSetup = async () => {
    if (!spreadsheetId.trim()) {
      Swal.fire('Error', 'Please enter a valid Spreadsheet ID', 'error');
      return;
    }

    // Persist sheets spread ID
    localStorage.setItem('cfg_target_spreadsheet_id', spreadsheetId.trim());

    if (!authToken) {
      Swal.fire('Authentication Required', 'Please Sign in with Google first to authorize formatting.', 'warning');
      return;
    }

    const confirmed = await Swal.fire({
      title: 'Initialize Sheet Formatting?',
      text: 'This will construct table schemas, freeze headers, and apply layout styles to the target spreadsheet.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#b58c4f',
      cancelButtonColor: '#7a8b95',
      confirmButtonText: 'Confirm and Start'
    });

    if (!confirmed.isConfirmed) return;

    setIsFormatting(true);
    setFormatLogs(['Starting initialization flow...']);

    try {
      const log = (msg: string) => setFormatLogs(prev => [...prev, msg]);

      log('Fetching spreadsheet metadata details...');
      const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      if (!metaRes.ok) {
        throw new Error(`Invalid Spreadsheet ID or lacks permission: ${metaRes.statusText}`);
      }

      let meta = await metaRes.json();
      let existingSheets = meta.sheets || [];
      let existingSheetTitles = existingSheets.map((s: any) => s.properties.title);
      log(`Read spreadsheet: "${meta.properties?.title || 'SmartHR Database'}"`);
      log(`Found existing sheet tabs: [${existingSheetTitles.join(', ')}]`);

      const targetSheets = [
        { name: 'Employees', headers: ['ID', 'Employee ID', 'Name', 'Department', 'Position', 'Salary', 'Date Joined', 'Status', 'Avatar', 'Created At'] },
        { name: 'CalendarEvents', headers: ['id', 'date', 'title', 'time', 'type', 'priority', 'status', 'createdAt', 'updatedAt'] },
        { name: 'Leaves', headers: ['id', 'employeeName', 'type', 'startDate', 'endDate', 'days', 'reason', 'status', 'createdAt'] },
        { name: 'SystemConfig', headers: ['id', 'category', 'key', 'value', 'description', 'updatedAt'] }
      ];

      // Create missing sheets
      const addRequests: any[] = [];
      for (const target of targetSheets) {
        if (!existingSheetTitles.includes(target.name)) {
          log(`Adding missing tab section: ${target.name}`);
          addRequests.push({
            addSheet: {
              properties: {
                title: target.name
              }
            }
          });
        }
      }

      if (addRequests.length > 0) {
        const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ requests: addRequests })
        });
        if (!updateRes.ok) {
          throw new Error('Could not create missing tabs database.');
        }
        log('Created missing sheet tables successfully. Updating schema caches...');
        
        // Refresh metadata properties
        const updatedMetaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const updatedMeta = await updatedMetaRes.json();
        existingSheets = updatedMeta.sheets || [];
      }

      // Loop over sheets to clear, apply top-row headers, and decorate layout colors
      for (const target of targetSheets) {
        const sheetObj = existingSheets.find((s: any) => s.properties.title === target.name);
        if (!sheetObj) continue;
        const sheetId = sheetObj.properties.sheetId;

        log(`Formatting and injecting headers for tab: "${target.name}"`);

        // 1. Write the headers array at row index 0 (cell A1:Ix)
        const headerBody = {
          range: `${target.name}!A1:1`,
          majorDimension: 'ROWS',
          values: [target.headers]
        };

        const writeHeadersRes = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${target.name}!A1:1?valueInputOption=RAW`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(headerBody)
          }
        );

        if (!writeHeadersRes.ok) {
          throw new Error(`Failed to inject text headers in table ${target.name}: ${writeHeadersRes.statusText}`);
        }

        // 2. Decorate styles: freeze 1st row, paint cells background, and toggle bold text
        const decorateRequests = [
          // Clear styles / grids or set column alignments
          {
            updateSheetProperties: {
              properties: {
                sheetId: sheetId,
                gridProperties: {
                  frozenRowCount: 1
                }
              },
              fields: 'gridProperties.frozenRowCount'
            }
          },
          // Color formatting headers cells with (#304060 deep blue gradient alternative style)
          {
            repeatCell: {
              range: {
                sheetId: sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: target.headers.length
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 33/255,
                    green: 44/255,
                    blue: 70/255
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 1.0,
                      blue: 1.0
                    },
                    fontSize: 10,
                    bold: true,
                    fontFamily: 'Arial'
                  },
                  horizontalAlignment: 'CENTER',
                  verticalAlignment: 'MIDDLE'
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
            }
          }
        ];

        const batchStyleRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ requests: decorateRequests })
        });

        if (!batchStyleRes.ok) {
          log(`⚠️ Styling decor notice: layout overrides on "${target.name}" warning.`);
        }
      }

      log('Sheet database initializing flow operations completed successfully!');
      Swal.fire({
        title: 'Initialization Succeeded',
        text: 'All missing system tables was instantiated and stylized on your target spreadsheet!',
        icon: 'success',
        confirmButtonColor: '#212c46'
      });
    } catch (err: any) {
      console.error(err);
      setFormatLogs(prev => [...prev, `❌ ERROR: ${err.message || 'Workflow exception process.'}`]);
      Swal.fire('Initialize Refused', err.message || 'General error code.', 'error');
    } finally {
      setIsFormatting(false);
    }
  };

  const activeAppScriptUrlStatus = useMemo(() => {
    return appsScriptUrl && appsScriptUrl.includes('/exec') ? 'ACTIVE' : 'PENDING';
  }, [appsScriptUrl]);

  if (isLoading) {
    return <SkeletonLoading layout="dashboard" />;
  }

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* USER GUIDE FLOATING TAB */}
      <UserGuideButton onClick={() => setIsGuideOpen(true)} />

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#b58c4f] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#b58c4f]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Database size={28} strokeWidth={2.5} className="text-[#b58c4f]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none font-exception-header" style={{ fontSize: '24px' }}>
                      GOOGLE SHEETS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#3f809e]">SYNC PORT</span>
                  </h3>
                  <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      CONFIGURE DIRECT GOOGLE APPS SCRIPT MICRO-SERVICES
                  </p>
              </div>
          </div>
      </div>

      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        {/* Standardized KPI Overview Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 shrink-0">
          <KpiCard 
            label="Google Sheets Sync" 
            value={user && spreadsheetId ? "CONNECTED" : "PENDING"} 
            icon="file-spreadsheet" 
            colorAccent="#657f4d" 
            colorValue="#212c46"
            desc="Active DB Stream" 
          />
          <KpiCard 
            label="Google Drive Sync" 
            value={user ? "CONNECTED" : "ANONYMOUS"} 
            icon="hard-drive" 
            colorAccent="#3f809e" 
            colorValue="#212c46"
            desc="Attachment Store" 
          />
          <KpiCard 
            label="Gmail Outbound" 
            value={user ? "INTEGRATED" : "READY"} 
            icon="mail" 
            colorAccent="#b58c4f" 
            colorValue="#212c46"
            desc="Automated Dispatch" 
          />
          <KpiCard 
            label="Apps Script Link" 
            value={activeAppScriptUrlStatus} 
            icon="globe" 
            colorAccent={activeAppScriptUrlStatus === 'ACTIVE' ? '#4d87a8' : '#932c2e'} 
            colorValue={activeAppScriptUrlStatus === 'ACTIVE' ? '#212c46' : '#932c2e'} 
            desc={appsScriptUrl ? 'URL custom OK' : 'Default connection'} 
          />
        </div>

      {/* Main Core Form Block layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        
        {/* Left Column blocks */}
        <div className="space-y-4">
          {/* APPS SCRIPT CONNECTION CONFIGURATION */}
          <div className="bg-white p-8 rounded-2xl border border-[#eaeaec] shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-2xl text-[#3f809e] shrink-0 shadow-sm">
                <Globe size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-[15px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
                  <span>Apps Script Web App Connection</span>
                </h3>
                <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mt-1 leading-relaxed">
                  Update Apps Script link and target API Key.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 bg-[#f8f9fa] p-6 rounded-2xl border border-[#eaeaec]">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-black text-[#212c46] uppercase tracking-widest block flex items-center gap-2">
                  <Globe size={14} className="text-[#3f809e]" />
                  <span>Apps Script Web App URL</span>
                </label>
                <input
                  type="text"
                  value={appsScriptUrl}
                  onChange={(e) => setAppsScriptUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-4 py-3 text-[11px] font-bold font-mono outline-none focus:border-[#b58c4f] shadow-sm text-[#212c46]"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left mt-4">
                <label className="text-[10px] font-black text-[#212c46] uppercase tracking-widest block flex items-center gap-2">
                  <Key size={14} className="text-[#b58c4f]" />
                  <span>Apps Script API Key (Security external Token)</span>
                </label>
                <input
                  type="text"
                  value={appsScriptApiKey}
                  onChange={(e) => setAppsScriptApiKey(e.target.value)}
                  placeholder="API Key..."
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-4 py-3 text-[11px] font-bold font-mono outline-none focus:border-[#b58c4f] shadow-sm text-[#212c46]"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveAppsScriptConfig}
                  className="px-8 py-2.5 bg-[#212c46] hover:bg-[#3f809e] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md transition-all flex items-center gap-2 transform active:scale-95 duration-100 cursor-pointer"
                >
                  <Save size={16} />
                  <span>SAVE CONFIGURATION</span>
                </button>
              </div>
            </div>
          </div>

          {/* SPREADSHEET INITIALIZATIONS */}
          <div className="bg-white p-8 rounded-2xl border border-[#eaeaec] shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-2xl text-[#b58c4f] shrink-0 shadow-sm">
                <FileSpreadsheet size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-[15px] font-black text-[#212c46] uppercase tracking-widest">
                  Spreadsheet Formation Control
                </h3>
                <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mt-1 leading-relaxed">
                  Run setup to inject standard schemas, styles, and tabs dynamically.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-black text-[#212c46] uppercase tracking-widest block">
                  Spreadsheet Drive Document ID
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={spreadsheetId}
                    onChange={(e) => setSpreadsheetId(e.target.value)}
                    disabled={isFormatting}
                    placeholder="Enter Google Spreadsheet ID..."
                    className="flex-1 bg-white border border-[#eaeaec] rounded-xl px-4 py-3 text-xs font-bold font-mono outline-none focus:border-[#b58c4f] shadow-sm text-[#212c46]"
                  />
                  <button
                    onClick={handleRunSetup}
                    disabled={isFormatting}
                    className="px-8 py-3 bg-[#b58c4f] hover:bg-[#a57c3f] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    {isFormatting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> FORMATTING...
                      </>
                    ) : (
                      'RUN SETUP'
                    )}
                  </button>
                </div>
              </div>
              
              {formatLogs.length > 0 && (
                <div className="bg-[#1e293b] text-slate-200 p-4 rounded-xl font-mono text-[11px] space-y-1.5 max-h-48 overflow-y-auto border-2 border-slate-800 text-left mt-4 custom-scrollbar">
                  {formatLogs.map((log, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-[#657f4d] font-bold">►</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column blocks */}
        <div className="space-y-4">
          {/* AUTHENTICATION SECTION */}
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
                      <img src={user.photoURL || "https://lh3.googleusercontent.com/a/default-user=s96-c"} alt="User Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-[13px] text-[#212c46] uppercase tracking-tight">{user.displayName || "Advance Group DCC"}</p>
                      <p className="text-[10px] font-bold font-mono text-[#7a8b95]">{user.email || "advancegroup.dcc@gmail.com"}</p>
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
                  <button onClick={handleDisconnect} className="px-6 py-2.5 rounded-xl text-[#932c2e] hover:text-white border-2 border-[#932c2e]/40 hover:bg-[#932c2e] hover:border-[#932c2e] font-black text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-sm">
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

            {/* Google Services Integrations Detail Matrices ( Thai Descriptions ) */}
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

          {/* SESSION SECURITY CONFIGURATION SECTION */}
          <div className="bg-white p-8 rounded-2xl border border-[#eaeaec] shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-[#d96245] shrink-0 shadow-sm">
                <ShieldAlert size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-[15px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
                  <span>Session Security Control</span>
                </h3>
                <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mt-1 leading-relaxed">
                  Inactivity limits for data security.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#f8f9fa] p-6 rounded-2xl border border-[#eaeaec]">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-black text-[#212c46] uppercase tracking-widest block flex items-center gap-2">
                  <Timer size={14} className="text-[#4d87a8]" />
                  <span>Session Duration Limit</span>
                </label>
                <select
                  value={cfgSessionDuration}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    handleUpdateSessionConfig(val, cfgWarnThreshold);
                  }}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wide outline-none focus:border-[#b58c4f] shadow-sm text-[#212c46] cursor-pointer"
                >
                  <option value="30">30 Seconds (Fast 30s Demo)</option>
                  <option value="60">1 Minute</option>
                  <option value="300">5 Minutes</option>
                  <option value="900">15 Minutes</option>
                  <option value="1800">30 Minutes</option>
                  <option value="3600">1 Hour</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-black text-[#212c46] uppercase tracking-widest block flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-600" />
                  <span>Warning Threshold</span>
                </label>
                <select
                  value={cfgWarnThreshold}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    handleUpdateSessionConfig(cfgSessionDuration, val);
                  }}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wide outline-none focus:border-[#b58c4f] shadow-sm text-[#212c46] cursor-pointer"
                >
                  <option value="10">10 Seconds (Fast 10s Demo)</option>
                  <option value="30">30 Seconds</option>
                  <option value="60">60 Seconds</option>
                  <option value="120">120 Seconds (Recommend)</option>
                  <option value="300">300 Seconds</option>
                </select>
              </div>
            </div>

          </div>
        </div>

      </div>
      </div>
    </div>
  );
}
