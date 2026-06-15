import React, { useState, useEffect } from 'react';
import { 
  X, Save, DollarSign, Briefcase, Award, Coffee, Building2, MapPin, ShieldCheck, HeartPulse, Receipt, Banknote, Trash2, Zap, History, Scale, Calendar
} from 'lucide-react';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { SalaryRecord } from './types';

interface SalaryMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: SalaryRecord | null;
  onSave: (record: SalaryRecord) => void;
}

const formatCurrency = (amount: number) => {
  if (isNaN(amount)) return '฿0';
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const sumSafe = (...vals: (number | undefined | null)[]) => {
  return vals.reduce((acc: number, cur) => acc + (Number(cur) || 0), 0);
};

const parseArraySafe = (val: any): any[] => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim() !== '') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.warn('Failed to parse array:', e);
    }
  }
  return [];
};

export function SalaryMasterModal({ isOpen, onClose, record, onSave }: SalaryMasterModalProps) {
  const [activeTab, setActiveTab] = useState('structure');
  const [formData, setFormData] = useState<SalaryRecord | null>(null);
  const [adjustReason, setAdjustReason] = useState('');

  useEffect(() => {
    if (isOpen && record) {
      const data = JSON.parse(JSON.stringify(record)) as SalaryRecord;
      data.otherIncomes = parseArraySafe(data.otherIncomes);
      data.otherDeductions = parseArraySafe(data.otherDeductions);
      data.history = parseArraySafe(data.history);
      if (data.workingDays === undefined) data.workingDays = 26;
      
      setFormData(data);
      setAdjustReason('');
      setActiveTab('structure');
    }
  }, [isOpen, record]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'payType') {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    } else {
      const numValue = value === '' ? 0 : Number(value);
      setFormData((prev: any) => ({ ...prev, [name]: numValue }));
    }
  };

  const handleAddOther = (type: 'otherIncomes' | 'otherDeductions') => {
    setFormData((prev: any) => ({
      ...prev,
      [type]: [...parseArraySafe(prev[type]), { label: '', amount: 0 }]
    }));
  };

  const handleRemoveOther = (type: 'otherIncomes' | 'otherDeductions', index: number) => {
    setFormData((prev: any) => {
      const newArray = [...parseArraySafe(prev[type])];
      newArray.splice(index, 1);
      return { ...prev, [type]: newArray };
    });
  };

  const handleOtherChange = (type: 'otherIncomes' | 'otherDeductions', index: number, field: string, value: string) => {
    setFormData((prev: any) => {
      const newArray = [...parseArraySafe(prev[type])];
      newArray[index] = { 
        ...newArray[index], 
        [field]: field === 'amount' ? (value === '' ? 0 : Number(value)) : value 
      };
      return { ...prev, [type]: newArray };
    });
  };

  const handleAutoCalculateSSO = () => {
    const base = formData.payType === 'Daily' ? sumSafe(formData.baseSalary) * sumSafe(formData.workingDays || 26) : sumSafe(formData.baseSalary);
    const calcSSO = Math.round(Math.min(base * 0.05, 750));
    setFormData((prev: any) => ({ ...prev, deductSSO: calcSSO }));
  };

  const isBaseOrTypeChanged = record && (formData.baseSalary !== record.baseSalary || formData.payType !== record.payType);

  const baseMonthlyEq = formData.payType === 'Daily' ? sumSafe(formData.baseSalary) * sumSafe(formData.workingDays || 0) : sumSafe(formData.baseSalary);
  const totalOtherIncome = parseArraySafe(formData.otherIncomes).reduce((sum: number, item: any) => sum + sumSafe(item.amount), 0);
  const totalOtherDeduct = parseArraySafe(formData.otherDeductions).reduce((sum: number, item: any) => sum + sumSafe(item.amount), 0);

  const fixedGross = baseMonthlyEq + sumSafe(
    formData.allowancePos, 
    formData.allowanceIncentive, 
    formData.allowanceTravel, 
    formData.allowanceMeal, 
    formData.allowanceAccommodation, 
    formData.allowanceRisk, 
    totalOtherIncome
  );
  
  const fixedDeductions = sumSafe(
    formData.deductTax, 
    formData.deductSSO, 
    formData.deductHousing, 
    formData.deductLoan, 
    totalOtherDeduct
  );
  
  const fixedNet = fixedGross - fixedDeductions;

  const handleSubmitSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    let updatedHistory = [...(formData.history || [])];

    if (isBaseOrTypeChanged) {
      if (!adjustReason.trim()) {
        alert("กรุณาระบุเหตุผลการปรับเงินเดือนในแท็บปรับปรุงโครงสร้างก่อนบันทึก");
        return;
      }
      updatedHistory.unshift({
        date: new Date().toISOString().split('T')[0],
        baseSalary: formData.baseSalary,
        payType: formData.payType,
        reason: adjustReason
      });
    }

    onSave({ 
      ...formData, 
      history: updatedHistory,
      lastUpdate: new Date().toISOString().split('T')[0] 
    });
    onClose();
  };

  const NumberInput = ({ label, name, icon: Icon, isReadOnly = false, hint = null }: any) => (
    <div className="flex flex-col">
      <label className="text-[10px] font-black text-[#414757] uppercase tracking-widest flex items-center justify-between mb-1.5">
        <span>{label}</span>
        {hint && <span className="text-[8px] text-[#3f809e] bg-[#3f809e]/10 px-1.5 py-0.5 rounded font-black uppercase font-mono">{hint}</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {Icon && <Icon size={14} className="text-[#7a8b95]" />}
        </div>
        <input 
          type="number" 
          name={name} 
          value={formData[name as keyof SalaryRecord] === 0 ? '' : (formData[name as keyof SalaryRecord] as any) || ''} 
          onChange={handleChange} 
          disabled={isReadOnly}
          className="w-full border border-[#cbd5e1]/40 rounded-xl pl-9 pr-4 py-2.5 text-[12px] font-black outline-none transition-all font-mono text-right bg-[#f8fafc]/90 text-[#212c46] focus:border-[#b58c4f] focus:ring-1 focus:ring-[#b58c4f]/20 shadow-xs"
        />
      </div>
    </div>
  );

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-[950px]"
      customHeader={
        <div className="bg-[#212c46] px-5 py-4 flex justify-between items-center shrink-0 border-b-2 border-[#b58c4f]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#851c24]/20 text-[#d96245] flex items-center justify-center border border-[#851c24]/30 shadow-inner">
              <Scale size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">SALARY MASTER CONFIG</h3>
              <span className="text-[9px] font-black text-[#f3f3f1] bg-[#851c24] px-2 py-0.5 rounded mt-1.5 inline-block uppercase tracking-widest border border-[#932c2e] shadow-sm font-mono">Employee: {formData.empId}</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-white/70 hover:text-rose-500 transition-all bg-white/10 hover:bg-white/20 p-1.5 rounded-full"><X size={16} /></button>
        </div>
      }
    >
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white min-h-[500px]">
        {/* Left Panel: Profile */}
        <div className="w-full md:w-64 bg-[#f3f4f6]/40 border-r border-[#e2e8f0] flex flex-col shrink-0 p-6">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[#cbd5e1] shadow-sm mb-3 bg-white">
              <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <h4 className="text-[14px] font-black text-[#212c46] uppercase tracking-tight">{formData.nameEn}</h4>
            <p className="text-[11px] font-bold text-[#414757] mt-0.5">{formData.nameTh}</p>
            <span className="mt-2 text-[10px] font-black bg-[#e2e8f0] text-[#475569] px-3 py-1 rounded-full uppercase border border-[#cbd5e1]">{formData.jobTitle}</span>
          </div>

          <div className="space-y-4 mb-6 text-[11px] font-medium text-[#414757] bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
            <div className="flex justify-between border-b border-[#e2e8f0] pb-2">
              <span className="text-[#64748b] uppercase tracking-widest text-[9px] font-black">Department</span>
              <span className="font-bold text-right text-[#212c46]">{formData.dept}</span>
            </div>
            <div className="flex justify-between border-b border-[#e2e8f0] pb-2">
              <span className="text-[#64748b] uppercase tracking-widest text-[9px] font-black">Bank</span>
              <span className="font-bold text-right text-[#212c46]">{formData.bank}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#64748b] uppercase tracking-widest text-[9px] font-black">Account No.</span>
              <span className="font-black font-mono text-[#3f809e]">{formData.bankAcc}</span>
            </div>
          </div>

          <div className="mt-auto space-y-2">
            <p className="text-[9px] font-black text-[#64748b] uppercase tracking-widest text-center border-b border-[#e2e8f0] pb-2 mb-2">Automation tools</p>
            <button type="button" onClick={handleAutoCalculateSSO} className="w-full bg-white border border-[#508660]/40 text-[#508660] hover:bg-[#508660]/10 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer">
              <Zap size={13}/> Calc SSO (5%)
            </button>
          </div>
        </div>
        
        {/* Right Panel: Editor with Form */}
        <form id="salaryForm" onSubmit={handleSubmitSave} className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Internal Tabs */}
          <div className="flex px-6 pt-4 border-b border-[#e2e8f0] gap-6 shrink-0 bg-[#f8fafc]">
            <button type="button" onClick={() => setActiveTab('structure')} className={`pb-3 px-2 border-b-[3px] transition-all font-black text-[11px] uppercase tracking-widest cursor-pointer ${activeTab === 'structure' ? 'border-[#851c24] text-[#851c24]' : 'border-transparent text-[#64748b] hover:text-[#212c46]'}`}>
              <Coffee size={14} className="inline mr-1.5 -mt-0.5" /> Compensation Structure
            </button>
            <button type="button" onClick={() => setActiveTab('history')} className={`pb-3 px-2 border-b-[3px] transition-all font-black text-[11px] uppercase tracking-widest cursor-pointer ${activeTab === 'history' ? 'border-[#851c24] text-[#851c24]' : 'border-transparent text-[#64748b] hover:text-[#212c46]'}`}>
              <History size={14} className="inline mr-1.5 -mt-0.5" /> Adjustment History
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {/* TAB: Structure */}
            <div className={`space-y-6 animate-fadeIn ${activeTab === 'structure' ? 'block' : 'hidden'}`}>
                
              <div className="bg-[#f1f5f9] p-4 rounded-xl border border-[#cbd5e1]/60 flex items-center gap-3">
                <HeartPulse size={18} className="text-[#851c24]" />
                <p className="text-[11px] font-medium text-[#414757]">
                  <strong className="text-[#212c46]">Master Data Note:</strong> ข้อมูลในหน้านี้คือ <b>ฐานข้อมูลคงที่ (Fixed Baseline)</b> ตัวเลขประเมินสุทธิด้านล่างจะไม่รวมรายการแปรผันรายเดือน เช่น OT หรือหักสาย/ขาดงาน
                </p>
              </div>

              {/* INCOME SECTION */}
              <div className="bg-[#fefaf0] p-5 rounded-2xl border border-[#b58c4f]/30 shadow-xs relative">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[11px] font-black text-[#851c24] uppercase tracking-widest flex items-center gap-2"><Briefcase size={14}/> Fixed Income / Earnings</h4>
                  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-[#e2e8f0] shadow-sm">
                    <label className="text-[10px] font-black text-[#64748b] uppercase tracking-widest">Pay Type:</label>
                    <select name="payType" value={formData.payType} onChange={handleChange} className="text-[11px] font-bold text-[#212c46] outline-none bg-transparent cursor-pointer font-sans">
                      <option value="Monthly">Monthly</option>
                      <option value="Daily">Daily</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  {formData.payType === 'Daily' ? (
                    <>
                      <NumberInput label="Daily Rate (ค่าจ้างรายวัน)" name="baseSalary" icon={DollarSign} hint="Fixed" />
                      <NumberInput label="Std. Working Days" name="workingDays" icon={Calendar} hint="Reference" />
                    </>
                  ) : (
                    <NumberInput label="Base Salary (เงินเดือนพื้นฐาน)" name="baseSalary" icon={DollarSign} hint="Fixed" />
                  )}
                  <NumberInput label="Position Allowance (ค่าตำแหน่ง)" name="allowancePos" icon={Briefcase} hint="Fixed" />
                  <NumberInput label="Fixed Incentive (เงินตามผลงาน)" name="allowanceIncentive" icon={Award} hint="Fixed" />
                  <NumberInput label="Travel Allowance (ค่าเดินทาง)" name="allowanceTravel" icon={MapPin} hint="Fixed" />
                  <NumberInput label="Meal Allowance (ค่าอาหาร)" name="allowanceMeal" icon={Coffee} hint="Fixed" />
                  <NumberInput label="Accommodation (ค่าที่พัก)" name="allowanceAccommodation" icon={Building2} hint="Fixed" />
                  <NumberInput label="Risk Allowance (ค่าความเสี่ยง)" name="allowanceRisk" icon={ShieldCheck} hint="Fixed" />
                </div>
                
                {/* Dynamic Other Incomes */}
                {parseArraySafe(formData.otherIncomes).length > 0 && (
                  <div className="mt-4 space-y-3 pt-3 border-t border-dashed border-[#b58c4f]/30">
                    {parseArraySafe(formData.otherIncomes).map((item: any, index: number) => (
                      <div key={index} className="flex items-end gap-3 bg-white/50 p-2 rounded-xl border border-[#b58c4f]/20">
                        <div className="flex-1">
                          <label className="text-[10px] font-black text-[#414757] uppercase tracking-widest block mb-1.5">Other Fixed Income Name</label>
                          <input type="text" value={item.label} onChange={(e) => handleOtherChange('otherIncomes', index, 'label', e.target.value)} placeholder="e.g. Skill Allowance" className="w-full bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]" />
                        </div>
                        <div className="w-1/3">
                          <label className="text-[10px] font-black text-[#414757] uppercase tracking-widest block mb-1.5">Amount</label>
                          <input type="number" value={item.amount === 0 ? '' : item.amount} onChange={(e) => handleOtherChange('otherIncomes', index, 'amount', e.target.value)} placeholder="0" className="w-full bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b58c4f] text-right font-mono" />
                        </div>
                        <button type="button" onClick={() => handleRemoveOther('otherIncomes', index)} className="p-2.5 text-[#b22026] hover:bg-[#b22026]/10 rounded-lg transition-colors border border-transparent hover:border-[#b22026]/20 mb-0.5 cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-3 flex justify-start">
                  <button type="button" onClick={() => handleAddOther('otherIncomes')} className="text-[10px] font-black uppercase tracking-widest text-[#508660] hover:bg-[#508660]/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-[#508660]/20 font-sans">
                    + Add Fixed Income
                  </button>
                </div>

                <div className="mt-4 flex justify-between items-center border-t border-[#b58c4f]/35 pt-3">
                  <span className="text-[11px] font-black text-[#414757] uppercase tracking-widest">Total Fixed Gross (Reference)</span>
                  <span className="text-[16px] font-black font-mono text-[#508660]">{formatCurrency(fixedGross)}</span>
                </div>
              </div>

              {/* DEDUCTION SECTION */}
              <div className="bg-[#fef2f2] p-5 rounded-2xl border border-[#eedbe2] shadow-xs">
                <h4 className="text-[11px] font-black text-[#b22026] uppercase tracking-widest mb-4 flex items-center gap-2"><Receipt size={14}/> Fixed Deductions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberInput label="Tax Deduction (ภาษีหัก ณ ที่จ่าย)" name="deductTax" icon={Receipt} hint="Fixed" />
                  <NumberInput label="Social Security (ประกันสังคม)" name="deductSSO" icon={HeartPulse} hint="Auto-Calc" />
                  <NumberInput label="Housing/Rent (ค่าบ้านพัก)" name="deductHousing" icon={Building2} hint="Fixed" />
                  <NumberInput label="Loans (เงินกู้ยืม)" name="deductLoan" icon={Banknote} hint="Fixed" />
                </div>

                {/* Dynamic Other Deductions */}
                {parseArraySafe(formData.otherDeductions).length > 0 && (
                  <div className="mt-4 space-y-3 pt-3 border-t border-dashed border-[#eedbe2]">
                    {parseArraySafe(formData.otherDeductions).map((item: any, index: number) => (
                      <div key={index} className="flex items-end gap-3 bg-white/50 p-2 rounded-xl border border-[#eedbe2]/50">
                        <div className="flex-1">
                          <label className="text-[10px] font-black text-[#414757] uppercase tracking-widest block mb-1.5">Other Fixed Deduction Name</label>
                          <input type="text" value={item.label} onChange={(e) => handleOtherChange('otherDeductions', index, 'label', e.target.value)} placeholder="e.g. Welfare Fund" className="w-full bg-white border border-[#eedbe2] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b22026]" />
                        </div>
                        <div className="w-1/3">
                          <label className="text-[10px] font-black text-[#414757] uppercase tracking-widest block mb-1.5">Amount</label>
                          <input type="number" value={item.amount === 0 ? '' : item.amount} onChange={(e) => handleOtherChange('otherDeductions', index, 'amount', e.target.value)} placeholder="0" className="w-full bg-white border border-[#eedbe2] rounded-lg px-3 py-2 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b22026] text-right font-mono" />
                        </div>
                        <button type="button" onClick={() => handleRemoveOther('otherDeductions', index)} className="p-2.5 text-[#b22026] hover:bg-[#b22026]/10 rounded-lg transition-colors border border-transparent hover:border-[#b22026]/20 mb-0.5 cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex justify-start">
                  <button type="button" onClick={() => handleAddOther('otherDeductions')} className="text-[10px] font-black uppercase tracking-widest text-[#b22026] hover:bg-[#b22026]/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-[#b22026]/20 font-sans">
                    + Add Fixed Deduction
                  </button>
                </div>

                <div className="mt-4 flex justify-between items-center border-t border-[#eedbe2] pt-3">
                  <span className="text-[11px] font-black text-[#414757] uppercase tracking-widest">Total Fixed Deductions</span>
                  <span className="text-[16px] font-black font-mono text-[#b22026]">{formatCurrency(fixedDeductions)}</span>
                </div>
              </div>

              {/* Dynamic Adjustment Reason */}
              {isBaseOrTypeChanged && (
                <div className="bg-[#fff7ed] p-5 rounded-2xl border border-[#fdba74] shadow-xs animate-fadeIn">
                  <label className="text-[11px] font-black text-[#9a3412] uppercase tracking-widest block mb-2 flex items-center gap-2"><History size={14}/> Adjustment Reason (Required)</label>
                  <input 
                    type="text" 
                    value={adjustReason} 
                    onChange={(e) => setAdjustReason(e.target.value)} 
                    required
                    placeholder="e.g. Annual Increment, Promotion, Re-evaluation..." 
                    className="w-full bg-white border border-[#fdba74] rounded-xl px-4 py-2.5 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#c2410c] focus:ring-1 focus:ring-[#c2410c]/20 shadow-xs transition-all" 
                  />
                </div>
              )}

              <div className="bg-[#212c46] p-5 rounded-2xl border border-[#1e293b] shadow-md flex justify-between items-center relative overflow-hidden">
                <div className="flex flex-col relative z-10 text-white">
                  <span className="text-[11px] font-black text-[#38bdf8] uppercase tracking-widest">Baseline Net Payable (Reference)</span>
                  <span className="text-[9px] text-[#93c5fd] font-medium mt-0.5">Excludes dynamic monthly variables (e.g. OT, Lateness, Deducted Days)</span>
                </div>
                <span className="text-[24px] font-black font-mono text-white tracking-wider relative z-10">{formatCurrency(fixedNet)}</span>
              </div>
            </div>

            {/* TAB: History */}
            <div className={`space-y-4 animate-fadeIn ${activeTab === 'history' ? 'block' : 'hidden'}`}>
              {formData.history && formData.history.length > 0 ? (
                formData.history.map((h: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl shadow-sm hover:border-[#b58c4f] transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#212c46] text-white flex items-center justify-center shrink-0 border border-[#1e293b] shadow-sm">
                        <History size={18}/>
                      </div>
                      <div>
                        <p className="font-black text-[#212c46] text-[13px] uppercase tracking-wide">{h.reason}</p>
                        <p className="text-[11px] text-[#64748b] mt-1 font-bold">Effective Date: <span className="font-mono text-[#475569]">{h.date}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#508660] font-mono text-[16px]">{formatCurrency(h.baseSalary)}</p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-[#b58c4f] mt-0.5 border border-[#fce8d8] bg-[#fdf5ed] px-2 py-0.5 rounded-md inline-block font-sans">{h.payType}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-[#64748b] font-black text-[12px] uppercase">No salary adjustment history found.</div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-white border border-[#e2e8f0] text-[#475569] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#f1f5f9] hover:text-[#212c46] transition-all shadow-sm cursor-pointer font-sans">Cancel</button>
            <button type="submit" className="bg-[#851c24] text-white px-8 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#b22026] transition-all flex items-center gap-2 border border-[#932c2e] cursor-pointer font-sans">
              <Save size={16}/> Save Master Structure
            </button>
          </div>
        </form>
      </div>
    </DraggableModal>
  );
}
