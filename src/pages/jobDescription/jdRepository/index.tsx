import React, { useState } from 'react';
import { FileText, Search, Plus, Filter, Download, Briefcase, UserCheck, ShieldAlert } from 'lucide-react';

interface JdItem {
  code: string;
  title: string;
  titleTh: string;
  department: string;
  departmentTh: string;
  revision: string;
  status: 'Active' | 'Draft' | 'Archived';
  minSalary: number;
}

const INITIAL_JDS: JdItem[] = [
  {
    code: 'JD-HR-001',
    title: 'Senior HR Operations Officer',
    titleTh: 'เจ้าหน้าที่อาวุโสฝ่ายปฏิบัติการทรัพยากรมนุษย์',
    department: 'Human Resources',
    departmentTh: 'ฝ่ายบริหารทรัพยากรบุคคล',
    revision: 'Rev. 4 (2026)',
    status: 'Active',
    minSalary: 28000
  },
  {
    code: 'JD-PROD-012',
    title: 'Agro-processing Machine Technician',
    titleTh: 'ช่างเทคนิคเครื่องจักรแปรรูปสินค้าเกษตร',
    department: 'Production',
    departmentTh: 'ฝ่ายผลิตและวิศวกรรมโรงงาน',
    revision: 'Rev. 2 (2025)',
    status: 'Active',
    minSalary: 24000
  },
  {
    code: 'JD-QA-005',
    title: 'Halal Compliance Quality Inspector',
    titleTh: 'เจ้าหน้าที่ตรวจสอบคุณภาพมาตรฐานฮาลาล',
    department: 'Quality Assurance',
    departmentTh: 'ฝ่ายควบคุมและประกันคุณภาพ',
    revision: 'Rev. 3 (2026)',
    status: 'Active',
    minSalary: 26000
  },
  {
    code: 'JD-LOGV-008',
    title: 'Heavy Logistics Dispatcher',
    titleTh: 'พนักงานวางแผนการกระจายสินค้าและการขนส่งหนัก',
    department: 'Logistics',
    departmentTh: 'ฝ่ายคลังสินค้าและการขนส่ง',
    revision: 'Rev. 1 (2024)',
    status: 'Active',
    minSalary: 18000
  }
];

export default function JdRepository() {
  const [jds, setJds] = useState<JdItem[]>(INITIAL_JDS);
  const [search, setSearch] = useState('');

  const filtered = jds.filter(jd =>
    jd.title.toLowerCase().includes(search.toLowerCase()) ||
    jd.titleTh.includes(search) ||
    jd.code.toLowerCase().includes(search.toLowerCase()) ||
    jd.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#b58c4f] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 rounded-2xl border border-[#b58c4f]/40 bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <FileText size={22} className="text-[#b58c4f]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-2xl">
              JD REPOSITORY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#3f809e]">VAULT</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              JOB DESCRIPTions, ROLE SPECIFICATIONS, AND OCCUPATIONAL COMPLIANCE DIRECTIVES
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-6 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Active JDs</span>
            <p className="text-2xl font-mono font-black text-[#212c46] mt-2">{jds.filter(j => j.status === 'Active').length} Profiles</p>
            <span className="text-[9px] text-[#212c46] font-bold mt-1 uppercase">100% Audited & Sign-Off</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departmental Spread</span>
            <p className="text-2xl font-black text-[#b58c4f] mt-2">12 Sectors</p>
            <span className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Factory & Admin Cohesion</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revision Index</span>
            <p className="text-2xl font-mono font-black text-[#3f809e] mt-2">2026.Q2 Active</p>
            <span className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Next Review Cycle Sept</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-white rounded-3xl p-6 border border-[#eaeaec] shadow-sm flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 p-4 rounded-2xl gap-3">
            <div className="relative w-full sm:w-96">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by JD code or title..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#b58c4f]"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
              <button className="bg-[#212c46] hover:bg-[#254268] text-white hover:text-[#b58c4f] px-4 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-1.5 shadow-sm transition-all">
                <Plus size={14} /> Add Job Description
              </button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 font-black text-[11px] text-[#212c46] uppercase tracking-wider">
                  <th className="py-3 px-4">JD Key</th>
                  <th className="py-3 px-4">Position Title</th>
                  <th className="py-3 px-4">Business Department</th>
                  <th className="py-3 px-4 text-center">Version Control</th>
                  <th className="py-3 px-4 text-center">Base Min Salary</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(jd => (
                  <tr key={jd.code} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-[#3f809e]">{jd.code}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-black text-[#212c46]">{jd.title}</p>
                      <p className="text-[11px] font-sans text-slate-500 font-bold">{jd.titleTh}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-700">{jd.department}</p>
                      <p className="text-[11px] font-sans text-slate-400 font-semibold">{jd.departmentTh}</p>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-500">{jd.revision}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-black text-slate-700">฿{jd.minSalary.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-wider">
                        {jd.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center">
                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-[#212c46]/5 hover:border-[#212c46] transition-colors" title="Download Official PDF">
                          <Download size={14} className="text-slate-500 hover:text-[#212c46]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
