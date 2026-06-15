import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { PageConfig } from '../types';
import { DataTable } from '../../../../components/shared/DataTable';
import Swal from 'sweetalert2';

interface Props {
  pages: PageConfig[];
  setPages: React.Dispatch<React.SetStateAction<PageConfig[]>>;
}

export default function PageFormatTab({ pages, setPages }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageConfig | null>(null);

  const handleDelete = (id: string) => {
    if (pages.length <= 1) {
       Swal.fire({
          icon: 'warning',
          title: 'ไม่อนุญาตให้ดำเนินการ',
          text: 'รายงานจำเป็นต้องระบุไว้อย่างน้อย 1 หน้า',
          confirmButtonColor: '#b00303'
       });
       return;
    }

    Swal.fire({
      title: 'ต้องการลบหน้านี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b00303',
      cancelButtonColor: '#7a8b95',
      confirmButtonText: 'ยืนยันลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        setPages(pages.filter(p => p.id !== id));
      }
    });
  };

  const openForm = (page?: PageConfig) => {
    if (page) {
      setEditingPage(page);
    } else {
      setEditingPage({
        id: `page-${Date.now()}`,
        moduleMenu: '',
        reportTitleTh: '',
        reportTitleEn: '',
        documentCode: '',
        revisionNo: '00',
        issueDate: new Date().toISOString().split('T')[0],
        orientation: 'portrait',
        showSignatures: true,
      });
    }
    setIsModalOpen(true);
  };

  const saveForm = () => {
    if (!editingPage) return;
    
    if (pages.find(p => p.id === editingPage.id)) {
      setPages(pages.map(p => p.id === editingPage.id ? editingPage : p));
    } else {
      setPages([...pages, editingPage]);
    }
    setIsModalOpen(false);
  };

  const columns = [
    { key: 'moduleMenu', label: 'โมดูล/เมนู', sortable: true, filterable: true },
    { 
      key: 'reportTitleTh', 
      label: 'ชื่อรายงาน (Heading Title)',
      render: (_: any, row: PageConfig) => (
         <div className="flex flex-col">
            <span className="font-bold text-[#212c46]">{row.reportTitleTh}</span>
            <span className="text-[10px] text-slate-500">{row.reportTitleEn}</span>
         </div>
      )
    },
    { key: 'documentCode', label: 'Doc No.', sortable: true, filterable: true },
    { key: 'revisionNo', label: 'Rev.', sortable: true },
    { key: 'issueDate', label: 'Issue Date', sortable: true },
    { 
      key: 'orientation', 
      label: 'กระดาษ',
      render: (val: string) => val === 'portrait' ? 'แนวตั้ง' : 'แนวนอน'
    },
    { 
      key: 'showSignatures', 
      label: 'ลายเซ็น',
      render: (val: boolean) => (
         <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${val ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {val ? 'เปิด' : 'ปิด'}
         </span>
      )
    },
    {
      key: 'actions',
      label: 'จัดการ',
      render: (_: any, row: PageConfig) => (
        <div className="flex items-center gap-2">
           <button onClick={() => openForm(row)} className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <Edit2 size={13} />
           </button>
           <button onClick={() => handleDelete(row.id)} className="w-7 h-7 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors">
              <Trash2 size={13} />
           </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-4">
       <div className="flex justify-between items-center bg-[#f8f9fa] border p-4 rounded-xl">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white rounded-lg border shadow-sm">
                <Plus size={18} className="text-[#3f809e]" />
             </div>
             <div>
                <h3 className="font-black text-[#212c46] uppercase">PAGE FORMAT</h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold">ตารางจัดการรายหน้ารายงาน</p>
             </div>
          </div>
          <button 
             onClick={() => openForm()}
             className="px-4 py-2 bg-[#212c46] hover:bg-[#b58c4f] text-white rounded-lg text-[11px] font-black uppercase tracking-wider transition-colors flex items-center gap-2 shadow-md"
          >
             <Plus size={14} /> เพิ่มหน้ารายงาน
          </button>
       </div>

       <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
          <DataTable columns={columns} data={pages} hasPagination={false} />
       </div>

       {isModalOpen && editingPage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#212c46]/60 backdrop-blur-sm">
             <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
                <h3 className="font-black text-[16px] text-[#212c46] border-b pb-4 mb-4">
                   {pages.find(p => p.id === editingPage.id) ? 'แก้ไขข้อมูลหน้ารายงาน' : 'เพิ่มหน้ารายงานใหม่'}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase mb-1">โมดูล/เมนู</label>
                      <input 
                         type="text" 
                         value={editingPage.moduleMenu}
                         onChange={(e) => setEditingPage({...editingPage, moduleMenu: e.target.value})}
                         className="w-full bg-[#f8f9fa] border rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                         placeholder="e.g. Time Attendance"
                      />
                   </div>
                   <div className="col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase mb-1">ชื่อรายงานภาษาไทย</label>
                      <input 
                         type="text" 
                         value={editingPage.reportTitleTh}
                         onChange={(e) => setEditingPage({...editingPage, reportTitleTh: e.target.value})}
                         className="w-full bg-[#f8f9fa] border rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                      />
                   </div>
                   <div className="col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase mb-1">ชื่อรายงานภาษาอังกฤษ (Heading Title EN)</label>
                      <input 
                         type="text" 
                         value={editingPage.reportTitleEn}
                         onChange={(e) => setEditingPage({...editingPage, reportTitleEn: e.target.value})}
                         className="w-full bg-[#f8f9fa] border rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                      />
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase mb-1">รหัสเอกสาร (Doc No.)</label>
                      <input 
                         type="text" 
                         value={editingPage.documentCode}
                         onChange={(e) => setEditingPage({...editingPage, documentCode: e.target.value})}
                         className="w-full bg-[#f8f9fa] border rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                      />
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase mb-1">ระดับการปรับปรุง (Rev.)</label>
                      <input 
                         type="text" 
                         value={editingPage.revisionNo}
                         onChange={(e) => setEditingPage({...editingPage, revisionNo: e.target.value})}
                         className="w-full bg-[#f8f9fa] border rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                      />
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase mb-1">วันที่มีผลบังคับใช้ (Issue Date)</label>
                      <input 
                         type="date" 
                         value={editingPage.issueDate}
                         onChange={(e) => setEditingPage({...editingPage, issueDate: e.target.value})}
                         className="w-full bg-[#f8f9fa] border rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                      />
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase mb-1">แนวกระดาษ (Orientation)</label>
                      <select 
                         value={editingPage.orientation}
                         onChange={(e) => setEditingPage({...editingPage, orientation: e.target.value as 'portrait'|'landscape'})}
                         className="w-full bg-[#f8f9fa] border rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                      >
                         <option value="portrait">แนวตั้ง (Portrait)</option>
                         <option value="landscape">แนวนอน (Landscape)</option>
                      </select>
                   </div>
                   <div className="col-span-2 pt-2 border-t mt-2 flex items-center justify-between">
                      <label className="text-[12px] font-black text-[#212c46] uppercase">แสดงลายเซ็น (Sign-off ISO)</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={editingPage.showSignatures}
                          onChange={(e) => setEditingPage({...editingPage, showSignatures: e.target.checked})}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b58c4f]"></div>
                      </label>
                   </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                   <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-[12px] font-black text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors uppercase">
                      ยกเลิก
                   </button>
                   <button onClick={saveForm} className="px-5 py-2.5 rounded-lg text-[12px] font-black text-white bg-[#212c46] hover:bg-[#b58c4f] transition-colors shadow-md uppercase">
                      บันทึกข้อมูล
                   </button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
}
