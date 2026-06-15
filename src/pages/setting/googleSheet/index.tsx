import React, { useState, useEffect, useMemo } from 'react';
import UserGuideButton from '../../../components/shared/UserGuideButton';
import KpiCard from '../../../components/shared/KpiCard';
import Swal from 'sweetalert2';
import SkeletonLoading from '../../../components/shared/SkeletonLoading';
import { initAuth, googleSignIn, logout } from '../../../firebase';
import { Database } from 'lucide-react';
import UserGuidePanel from './components/UserGuidePanel';
import AppsScriptConfigCard from './components/AppsScriptConfigCard';
import SpreadsheetFormationCard from './components/SpreadsheetFormationCard';
import GoogleAuthCard from './components/GoogleAuthCard';
import SessionConfigCard from './components/SessionConfigCard';

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
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
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
            <AppsScriptConfigCard 
              appsScriptUrl={appsScriptUrl}
              setAppsScriptUrl={setAppsScriptUrl}
              appsScriptApiKey={appsScriptApiKey}
              setAppsScriptApiKey={setAppsScriptApiKey}
              handleSaveAppsScriptConfig={handleSaveAppsScriptConfig}
            />

            <SpreadsheetFormationCard 
              spreadsheetId={spreadsheetId}
              setSpreadsheetId={setSpreadsheetId}
              isFormatting={isFormatting}
              formatLogs={formatLogs}
              handleRunSetup={handleRunSetup}
            />
          </div>

          {/* Right Column blocks */}
          <div className="space-y-4">
            <GoogleAuthCard 
              user={user}
              spreadsheetId={spreadsheetId}
              handleDisconnect={handleDisconnect}
              handleGoogleSignIn={handleGoogleSignIn}
            />

            <SessionConfigCard 
              cfgSessionDuration={cfgSessionDuration}
              cfgWarnThreshold={cfgWarnThreshold}
              handleUpdateSessionConfig={handleUpdateSessionConfig}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
