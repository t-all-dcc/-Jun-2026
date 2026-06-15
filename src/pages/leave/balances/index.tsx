import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { DraggableModal } from '../../../components/shared/DraggableModal';

interface LeaveBalance {
  id: string;
  nameEn: string;
  nameTh: string;
  deptEn: string;
  deptTh: string;
  entitledAnnual: number;
  usedAnnual: number;
  entitledSick: number;
  usedSick: number;
  entitledBusiness: number;
  usedBusiness: number;
  isSpecialEligible: boolean;
}

export default function LeaveBalances() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<LeaveBalance | null>(null);
  const [isAdjustModelOpen, setIsAdjustModelOpen] = useState(false);
  const [adjustedAnnual, setAdjustedAnnual] = useState(10);
  
  // Table pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Master mock leave balance registers
  const [balances, setBalances] = useState<LeaveBalance[]>([
    { id: 'EMP001', nameEn: 'Somsak Jaidee', nameTh: 'สมศักดิ์ ใจดี', deptEn: 'Human Resources', deptTh: 'ฝ่ายทรัพยากรบุคคล', entitledAnnual: 15, usedAnnual: 4, entitledSick: 30, usedSick: 2, entitledBusiness: 6, usedBusiness: 0, isSpecialEligible: true },
    { id: 'EMP002', nameEn: 'Wipa Rakpan', nameTh: 'วิภา รักพาน', deptEn: 'Audit & Finance', deptTh: 'ฝ่ายการเงินและตรวจสอบบัญชี', entitledAnnual: 12, usedAnnual: 7, entitledSick: 30, usedSick: 5, entitledBusiness: 6, usedBusiness: 2, isSpecialEligible: false },
    { id: 'EMP003', nameEn: 'Nathapon Chaisiri', nameTh: 'ณฐพล ชัยสิริ', deptEn: 'Digital Tech', deptTh: 'ฝ่ายดิจิทัลและเทคโนโลยี', entitledAnnual: 12, usedAnnual: 10, entitledSick: 30, usedSick: 6, entitledBusiness: 6, usedBusiness: 3, isSpecialEligible: true },
    { id: 'EMP004', nameEn: 'Pimchanok Sripai', nameTh: 'พิมพ์ชนก ศรีไพร', deptEn: 'Digital Tech', deptTh: 'ฝ่ายดิจิทัลและเทคโนโลยี', entitledAnnual: 10, usedAnnual: 3, entitledSick: 30, usedSick: 1, entitledBusiness: 6, usedBusiness: 1, isSpecialEligible: false },
    { id: 'EMP005', nameEn: 'Tanapat Meedee', nameTh: 'ธนภัทร มีดี', deptEn: 'Research & Innovation', deptTh: 'ฝ่ายวิจัยและพัฒนานวัตกรรม', entitledAnnual: 10, usedAnnual: 2, entitledSick: 30, usedSick: 0, entitledBusiness: 6, usedBusiness: 0, isSpecialEligible: false },
    { id: 'EMP006', nameEn: 'Saranya Jaidee', nameTh: 'ศรัญญา ใจดี', deptEn: 'Digital Tech', deptTh: 'ฝ่ายดิจิทัลและเทคโนโลยี', entitledAnnual: 10, usedAnnual: 5, entitledSick: 30, usedSick: 3, entitledBusiness: 6, usedBusiness: 1, isSpecialEligible: false },
    { id: 'EMP007', nameEn: 'Wichai Rakpan', nameTh: 'วิชัย รักพาน', deptEn: 'Audit & Finance', deptTh: 'ฝ่ายการเงินและตรวจสอบบัญชี', entitledAnnual: 10, usedAnnual: 1, entitledSick: 30, usedSick: 1, entitledBusiness: 6, usedBusiness: 0, isSpecialEligible: false }
  ]);

  const departmentsEn = Array.from(new Set(balances.map(b => b.deptEn)));

  const filteredBalances = balances.filter(b => {
    const searchString = `${b.nameEn} ${b.nameTh} ${b.id} ${b.deptEn} ${b.deptTh}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || b.deptEn === deptFilter;
    return matchesSearch && matchesDept;
  });

  const totalPages = Math.ceil(filteredBalances.length / itemsPerPage);
  const currentBalances = filteredBalances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openAdjustModal = (user: LeaveBalance) => {
    setSelectedUser(user);
    setAdjustedAnnual(user.entitledAnnual);
    setIsAdjustModelOpen(true);
  };

  const handleAdjustSave = () => {
    if (!selectedUser) return;
    setBalances(prev => prev.map(b => {
      if (b.id === selectedUser.id) {
        return { ...b, entitledAnnual: adjustedAnnual };
      }
      return b;
    }));
    setIsAdjustModelOpen(false);
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      
      {/* 1. Precise Transparent Header */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-sm">
                  <Icons.CalendarDays size={22} className="text-[#cb5d3d]" />
              </div>
              <div>
                  <h3 className="text-2xl font-black text-[#212c46] uppercase leading-none">
                      {t('LEAVE BALANCES & QUOTAS', 'สารสนเทศสิทธิ์คงเหลือและการลาพักผ่อน')}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 uppercase mt-0.5">
                      {t('Track entitled leaves and current year consumption rates', 'ติดตามยอดสิทธิ์ลาประจำปี การสะสมวันหยุด และอัตราการใช้งานประจำหน่วยงาน')}
                  </p>
              </div>
          </div>
      </div>

      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
          {/* 2. Structured KPI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#eaeaec] rounded-2xl p-4 shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#7a8b95]">{t('AVG ANNUAL ALLOCATION', 'ยอดจัดสรรพักร้อนอ้างอิงเฉลี่ย')}</p>
                  <h4 className="text-2xl font-black text-[#212c46] mt-1 font-mono">11.2 {t('Days', 'วัน')}</h4>
                  <span className="text-[11px] text-slate-400 font-bold mt-1 block">{t('Dynamic policy-driven limit', 'สอดคล้องตามเกณฑ์สะสมอายุงาน')}</span>
              </div>
              <div className="bg-[#212c46]/5 text-[#212c46] w-12 h-12 rounded-2xl flex items-center justify-center transition-colors">
                  <Icons.Plane size={22} className="text-[#cb5d3d]" />
              </div>
          </div>

          <div className="bg-white border border-[#eaeaec] rounded-2xl p-4 shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#7a8b95]">{t('CONSUMED HOLIDAYS', 'สถิติวันลาสะสมที่มีการใช้งานแล้ว')}</p>
                  <h4 className="text-2xl font-black text-[#53694d] mt-1 font-mono">
                      {balances.reduce((sum, b) => sum + b.usedAnnual, 0)} {t('Days', 'วัน')}
                  </h4>
                  <span className="text-[11px] text-[#53694d] font-bold mt-1 block">
                      {t('Avg utilization: 32%', 'อัตราเฉลี่ยความถี่การลา 32% ของโควตา')}
                  </span>
              </div>
              <div className="bg-[#53694d]/5 text-[#53694d] w-12 h-12 rounded-2xl flex items-center justify-center transition-colors">
                  <Icons.CalendarCheck size={22} />
              </div>
          </div>

          <div className="bg-white border border-[#eaeaec] rounded-2xl p-4 shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#7a8b95]">{t('SICK LEAVE INTENSITY', 'ความถี่การลาป่วยประจำปี')}</p>
                  <h4 className="text-2xl font-black text-[#b00303] mt-1 font-mono">
                      {balances.reduce((sum, b) => sum + b.usedSick, 0)} {t('Days', 'วัน')}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-bold mt-1 block">{t('All verified with medical certs', 'ข้อมูลอัปเดตผ่านระบบรับรองใบแพทย์')}</span>
              </div>
              <div className="bg-[#b00303]/5 text-[#b00303] w-12 h-12 rounded-2xl flex items-center justify-center transition-colors">
                  <Icons.HeartPulse size={22} />
              </div>
          </div>
      </div>

      {/* 3. Filter Toolbar & Main Data Table */}
      <div className="bg-white border border-[#eaeaec] rounded-2xl shadow-sm overflow-hidden flex flex-col">
          
          {/* Toolbar */}
          <div className="py-4 px-6 bg-white border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                  <Icons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#798a9a]" size={16} />
                  <input 
                      type="text" 
                      placeholder={t('Search staff balances by name...', 'ค้นหาโดยระบุ ชื่อบุคลากร...')}
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f3f3f1]/50 border border-[#eaeaec] rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#cb5d3d] focus:bg-white transition-all"
                  />
              </div>

              <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-[#798a9a]">{t('FILTER DEPT', 'ตัวกรองแผนก')}:</span>
                  <select 
                      value={deptFilter}
                      onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
                      className="bg-[#f3f3f1]/50 hover:bg-white border border-[#eaeaec] p-2 rounded-xl text-[11px] font-bold uppercase transition-all focus:outline-none focus:border-[#cb5d3d]"
                  >
                      <option value="ALL">{t('ALL DEPARTMENTS', 'ทุกแผนกส่วนสังกัด')}</option>
                      {departmentsEn.map(d => (
                          <option key={d} value={d}>{d}</option>
                      ))}
                  </select>
              </div>
          </div>

          {/* Main Data Table conforms exactly to Guidelines (Header Row py-4 border-b-2, Data Rows py-2.5 px-4) */}
          <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse leading-normal font-sans">
                  <thead>
                      <tr className="border-b-2 border-[#eaeaec] bg-[#f8f9fa] text-[11px] font-black text-[#212c46] tracking-wider uppercase">
                          <th className="py-4 px-6">{t('EMPLOYEE', 'บุคลากร')}</th>
                          <th className="py-4 px-6">{t('DEPARTMENT', 'แผนกส่วนสังกัด')}</th>
                          <th className="py-4 px-6 text-center">{t('ANNUAL LEAVE (USED / ALLOCATED)', 'วันลาพักร้อน (ใช้ / จัดสรร)')}</th>
                          <th className="py-4 px-6 text-center">{t('SICK LEAVE (USED / ALLOCATED)', 'วันลาป่วย (ใช้ / จัดสรร)')}</th>
                          <th className="py-4 px-6 text-center">{t('BUSINESS LEAVE (USED / ALLOCATED)', 'วันลากิจ (ใช้ / จัดสรร)')}</th>
                          <th className="py-4 px-6 text-center">{t('ACTIONS', 'การบำรุง')}</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {currentBalances.map((b) => {
                          const annualPercent = Math.min(100, (b.usedAnnual / b.entitledAnnual) * 100);
                          const sickPercent = Math.min(100, (b.usedSick / b.entitledSick) * 100);
                          return (
                              <tr key={b.id} className="hover:bg-[#fdfbf7]/50 transition-colors text-slate-700 text-xs">
                                  {/* Staff Info */}
                                  <td className="py-2.5 px-4">
                                      <div className="flex flex-col">
                                          <span className="text-[12px] font-black text-[#212c46] leading-tight">{t(b.nameEn, b.nameTh)}</span>
                                          <span className="text-[10px] text-slate-400 mt-0.5 font-mono">{b.id}</span>
                                      </div>
                                  </td>

                                  {/* Section */}
                                  <td className="py-2.5 px-4 text-[11px] font-semibold text-slate-500">
                                      {t(b.deptEn, b.deptTh)}
                                  </td>

                                  {/* Annual Quota Progress bar */}
                                  <td className="py-2.5 px-4">
                                      <div className="flex flex-col items-center">
                                          <div className="flex justify-between w-full text-[11px] font-bold text-slate-700 font-mono mb-1">
                                              <span>{b.usedAnnual} {t('days used', 'วัน')}</span>
                                              <span>{b.entitledAnnual} {t('days limit', 'วัน')}</span>
                                          </div>
                                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                              <div className="bg-[#cb5d3d] h-full" style={{ width: `${annualPercent}%` }} />
                                          </div>
                                      </div>
                                  </td>

                                  {/* Sick Leave Quota Progress bar */}
                                  <td className="py-2.5 px-4">
                                      <div className="flex flex-col items-center">
                                          <div className="flex justify-between w-full text-[11px] font-bold text-slate-700 font-mono mb-1">
                                              <span>{b.usedSick} {t('days used', 'วัน')}</span>
                                              <span>{b.entitledSick} {t('days limit', 'วัน')}</span>
                                          </div>
                                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                              <div className="bg-[#b00303] h-full" style={{ width: `${sickPercent}%` }} />
                                          </div>
                                      </div>
                                  </td>

                                  {/* Business Quota */}
                                  <td className="py-2.5 px-4 text-center">
                                      <span className="text-[12px] font-bold font-mono text-slate-800 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                                          {b.usedBusiness} / {b.entitledBusiness}
                                      </span>
                                  </td>

                                  {/* Actions */}
                                  <td className="py-2.5 px-4 text-center">
                                      <div className="inline-flex gap-[1px] bg-slate-100 p-[1px] rounded-lg">
                                          <button 
                                              onClick={() => openAdjustModal(b)}
                                              className="w-8 h-8 rounded-md bg-white hover:bg-[#cb5d3d] hover:text-white text-slate-500 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                                              title="Adjust Quota"
                                          >
                                              <Icons.Sliders size={13} />
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          );
                      })}

                      {filteredBalances.length === 0 && (
                          <tr>
                              <td colSpan={6} className="text-center py-12 text-slate-400 font-bold text-xs">
                                  {t('No leave balances match filters!', 'ไม่มีโควตาประจำตัวพนักงานที่ตรงกัน')}
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>

          {/* Standardized Pagination Footer */}
          <div className="py-3 px-6 bg-[#F0EAE1]/80 border-t-[1.5px] border-[#eaeaec] flex items-center justify-between font-sans">
              <span className="text-[11px] font-black uppercase text-[#212c46] tracking-wider">
                  {t('PAGE', 'หน้า')} <span className="font-mono text-[11px]">{currentPage}</span> / <span className="font-mono text-[11px]">{totalPages || 1}</span> ({filteredBalances.length} {t('records total', 'สถิติประจำตัว')})
              </span>
              <div className="flex gap-2">
                  <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-white border border-slate-200/60 rounded-lg text-[10px] font-black uppercase hover:border-[#cb5d3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                      {t('PREVIOUS', 'ก่อนหน้า')}
                  </button>
                  <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-1 bg-white border border-slate-200/60 rounded-lg text-[10px] font-black uppercase hover:border-[#cb5d3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                      {t('NEXT', 'ถัดไป')}
                  </button>
              </div>
          </div>
      </div>

      </div>

      {/* 4. Draggable Adjustment Modal */}
      <DraggableModal
          isOpen={isAdjustModelOpen}
          onClose={() => setIsAdjustModelOpen(false)}
          title={<span className="text-sm font-black uppercase text-[#212c46] tracking-widest flex items-center gap-2"><Icons.Sliders size={16} className="text-[#cb5d3d]"/> {t('ADJUST STAFF DEPOSIT QUOTA', 'การปรับตั้งค่าสิทธิ์วันหยุดสะสมพนักงาน')}</span>}
          width="max-w-md"
      >
          {selectedUser && (
              <div className="p-6 font-sans">
                  <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                      <h4 className="text-sm font-black text-[#212c46]">{t(selectedUser.nameEn, selectedUser.nameTh)}</h4>
                      <p className="text-[11px] font-bold text-slate-400 uppercase mt-1">{t(selectedUser.deptEn, selectedUser.deptTh)} • {selectedUser.id}</p>
                  </div>

                  <div className="space-y-4">
                      <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">{t('ANNUAL LIMIT DAYS', 'จำนวนพักร้อนโควตาหลัก (วัน)')}</label>
                          <div className="flex items-center gap-3">
                              <button 
                                  onClick={() => setAdjustedAnnual(prev => Math.max(0, prev - 1))}
                                  className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center font-black hover:bg-slate-50 cursor-pointer"
                              >
                                  -
                              </button>
                              <input 
                                  type="number"
                                  value={adjustedAnnual}
                                  onChange={(e) => setAdjustedAnnual(Math.max(0, parseInt(e.target.value) || 0))}
                                  className="flex-1 w-full text-center text-sm font-black border border-slate-200 rounded-xl h-10 focus:outline-none focus:border-[#cb5d3d]"
                              />
                              <button 
                                  onClick={() => setAdjustedAnnual(prev => prev + 1)}
                                  className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center font-black hover:bg-slate-50 cursor-pointer"
                              >
                                  +
                              </button>
                          </div>
                      </div>

                      <div className="bg-[#fcfbf9] border border-slate-100 p-4 rounded-xl text-[11px] text-slate-500 leading-relaxed font-sans">
                          {t('Adjusting entitled days increments user holiday bank limits across concurrent system records.', 'การปรับสิทธิ์วันพักผ่อนจะเปลี่ยนแปลงบัญชีโควตาคำนวณสะสมของบุคลากรรายบุคคลในการเปิดออนซิงค์ยื่นคำขอลาทั่วทั้งสตรีมระบบ')}
                      </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3 text-xs">
                      <button onClick={() => setIsAdjustModelOpen(false)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 font-bold cursor-pointer">
                          {t('Cancel', 'ยกเลิก')}
                      </button>
                      <button 
                          onClick={handleAdjustSave}
                          className="px-6 py-2.5 bg-[#cb5d3d] hover:bg-[#cb5d3d]/90 text-white font-black uppercase tracking-widest rounded-xl shadow-md cursor-pointer"
                      >
                          {t('SAVE ADJUSTMENTS', 'ยืนยันจัดเก็บรายการบันทึกร่วม')}
                      </button>
                  </div>
              </div>
          )}
      </DraggableModal>
    </div>
  );
}
