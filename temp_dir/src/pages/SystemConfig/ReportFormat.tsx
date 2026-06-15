import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Swal from 'sweetalert2';
import { 
  FileSpreadsheet, 
  FileText, 
  Upload, 
  Plus,
  Trash2,
  Sliders,
  Check,
  X,
  BookOpen,
  Info,
  Building,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Signature,
  FileCode,
  Calendar,
  Layers,
  Settings,
  HelpCircle,
  Eye,
  SlidersIcon,
  Maximize2,
  ListFilter
} from 'lucide-react';
import UserGuideButton from '../../components/shared/UserGuideButton';
import KpiCard from '../../components/shared/KpiCard';
import { DraggableModal } from '../../components/shared/DraggableModal';

const THEME = {
  primary: '#212c46',
  skyBlue: '#3f809e',
  gold: '#b58c4f',
  success: '#657f4d',
  danger: '#932c2e',
  dustyBlue: '#7a8b95'
};

const DEFAULT_LOGO_BASE64 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="45" stroke="%233f809e" stroke-width="6"/><path d="M50 20 L75 65 L25 65 Z" fill="%23b58c4f"/><rect x="42" y="45" width="16" height="16" rx="3" fill="%23212c46"/></svg>`;

interface PageConfig {
  id: string;
  label: string;
  reportTitle: string;
  documentCode: string;
  revisionNo: string;
  issueDate: string;
  showSignatures: boolean;
  preparedByName: string;
  preparedByTitle: string;
  reviewedByName: string;
  reviewedByTitle: string;
  approvedByName: string;
  approvedByTitle: string;
}

const DEFAULT_PAGES: PageConfig[] = [
  {
    id: 'page-1',
    label: 'หน้า 1: วัตถุดิบฮาลาลหลัก',
    reportTitle: 'HALAL RAW MATERIALS MASTER REGISTRY',
    documentCode: 'FM-HL-REG-001',
    revisionNo: '02',
    issueDate: '2026-01-15',
    showSignatures: true,
    preparedByName: 'Phichamon S.',
    preparedByTitle: 'QA Senior Officer',
    reviewedByName: 'Anan K.',
    reviewedByTitle: 'QA Manager',
    approvedByName: 'Somchai T.',
    approvedByTitle: 'Managing Director / Executive Auditor'
  },
  {
    id: 'page-2',
    label: 'หน้า 2: บันทึกตรวจสอบการผลิต',
    reportTitle: 'CRITICAL CONTROL POINTS (CCP) COMPLIANCE LOG',
    documentCode: 'FM-HL-CCP-002',
    revisionNo: '01',
    issueDate: '2026-03-10',
    showSignatures: true,
    preparedByName: 'Phichamon S.',
    preparedByTitle: 'QA Senior Officer',
    reviewedByName: 'Nuttawut P.',
    reviewedByTitle: 'Production Leader',
    approvedByName: 'Anan K.',
    approvedByTitle: 'QA Manager'
  },
  {
    id: 'page-3',
    label: 'หน้า 3: รายงานสารเคมีแต่งเติม',
    reportTitle: 'APPROVED CHEMICALS & INORGANIC ADDITIVES',
    documentCode: 'FM-HL-ADD-003',
    revisionNo: '00',
    issueDate: '2026-05-01',
    showSignatures: false,
    preparedByName: '',
    preparedByTitle: '',
    reviewedByName: '',
    reviewedByTitle: '',
    approvedByName: '',
    approvedByTitle: ''
  }
];

// USER GUIDE PANEL
function UserGuidePanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-[#f8f9fa] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-4 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-sans font-black flex items-center gap-3 uppercase tracking-widest text-[16px]"><BookOpen size={22} className="text-[#b58c4f]"/> USER GUIDE</h3>
            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-1.5">REPORT CONFIGURATION HUB</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-[#f8f9fa]">
            <section className="animate-fadeIn">
                <h4 className="text-[13px] font-black text-[#212c46] mb-4 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-3 font-mono">
                    <Sliders size={18} className="text-[#b58c4f]" /> 1. COMPACT CONFIGURATION MODAL
                </h4>
                <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] space-y-3 shadow-sm">
                    <p className="text-[12px] text-slate-600">
                        เรารวบรวมฟอร์มตั้งค่าสไลเดอร์ขนาดฟอนต์ทุกจุด โลโก้ และข้อมูลผู้เซ็นชื่ออนุมัติไว้ใน <strong>Modal บินอิสระ</strong> จัดระเบียบด้วย <strong>4 แท็บย่อยซ้ายมือ (Vertical Side-Tabs)</strong> เพื่อความสะดวก สวยงามและไม่ปะปนกับหน้าพรีวิว:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-[11px] text-slate-500 font-bold uppercase">
                        <li>TAB 1: COMPANY PROFILE (โลโก้ภาพและข้อมูลงิ้ลบริษัท)</li>
                        <li>TAB 2: ISO PAGE DETAILS (รหัสเอกสารคู่ขนานแยกตามหน้าเพจ)</li>
                        <li>TAB 3: EVERYWHERE FONTS (สเกลขนาดหน้าอักษรทุกจุด)</li>
                        <li>TAB 4: SIGNATURES & OPTIONS (ขอบเขตผู้แต่งเปิดกล่องลายเซ็นต์)</li>
                    </ul>
                </div>
            </section>

            <section className="animate-fadeIn" style={{ animationDelay: '100s' }}>
                <h4 className="text-[13px] font-black text-[#212c46] mb-4 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-3 font-mono">
                    <Signature size={18} className="text-[#657f4d]" /> 2. BOTTOM ALIGNED SIGNATURE
                </h4>
                <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] space-y-2 shadow-sm text-slate-600 font-medium">
                  <p>
                    <strong>กล่องลายเซ็น 3 ฝ่ายหลัก:</strong> ได้แก่ ผู้จัดทำ, ผู้ตรวจทาน และผู้อนุมัติ ถูกดันลงไปไว้ในตำแหน่ง <strong>ด้านล่างสุดของเอกสาร A4 เสมอ</strong> โดยจะประกบแนบชิดติดกับส่วนท้ายกระดาษ (Footer Text Stamp) เพื่อสอดคล้องความมีระเบียบในระบบการตรวจประเมินอุตสาหกรรมสากลอย่างเคร่งครัด
                  </p>
                </div>
            </section>
        </div>
        
        <div className="p-6 border-t border-[#eaeaec] bg-[#f8f9fa] flex justify-between items-center shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">SYSTEM MANUAL V5.5</span>
            <button onClick={onClose} className="px-8 py-3 bg-[#212c46] text-white font-black rounded-xl uppercase tracking-widest text-[11px] shadow-md hover:bg-[#b58c4f] transition-all duration-300">รับทราบ (Got it)</button>
        </div>
      </div>
    </>,
    document.body
  );
}

export default function ReportFormat() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  
  // Outer Side Tab configuration within Modal (1-4)
  const [activeSideTab, setActiveSideTab] = useState<'profile' | 'pages_iso' | 'fonts' | 'signatures' | 'paper' | 'csv'>('profile');
  
  // Tab selector at page-level ('preview' or 'config')
  const [activeMainTab, setActiveMainTab] = useState<'preview' | 'config'>('preview');

  // General Identity Settings
  const [companyNameTh, setCompanyNameTh] = useState(() => {
    return localStorage.getItem('cfg_report_company_name_th') || 'บริษัท ที ออลล์ อินเทลลิเจนซ์ จำกัด';
  });
  const [companyNameEn, setCompanyNameEn] = useState(() => {
    return localStorage.getItem('cfg_report_company_name_en') || 'T All Intelligence Co., Ltd.';
  });
  const [taxId, setTaxId] = useState(() => {
    return localStorage.getItem('cfg_report_tax_id') || '0-1055-57149-33-2';
  });
  const [companyAddressTh, setCompanyAddressTh] = useState(() => {
    return localStorage.getItem('cfg_report_company_address_th') || 'สำนักงานใหญ่ : 46 หมู่ที่ 5 ตำบลคลองสี่ อำเภอคลองหลวง จังหวัดปทุมธานี 12120';
  });
  const [companyAddressEn, setCompanyAddressEn] = useState(() => {
    return localStorage.getItem('cfg_report_company_address_en') || 'Head Office : 46 Moo 5, Klong 4, Klong Luang, Pathumthani Thailand 12120';
  });
  const [companyPhone, setCompanyPhone] = useState(() => {
    return localStorage.getItem('cfg_report_company_phone') || '082-569-5654, 091-516-5999';
  });
  const [companyEmail, setCompanyEmail] = useState(() => {
    return localStorage.getItem('cfg_report_company_email') || 'tallintelligence.ho@gmail.com';
  });
  const [companyLogo, setCompanyLogo] = useState(() => {
    return localStorage.getItem('cfg_report_logo') || DEFAULT_LOGO_BASE64;
  });

  // Paper Settings
  const [paperSize, setPaperSize] = useState(() => {
    return localStorage.getItem('cfg_paper_size') || 'A4';
  });
  const [marginTop, setMarginTop] = useState<number>(() => {
    const val = localStorage.getItem('cfg_margin_top');
    return val ? parseInt(val, 10) : 15;
  });
  const [marginBottom, setMarginBottom] = useState<number>(() => {
    const val = localStorage.getItem('cfg_margin_bottom');
    return val ? parseInt(val, 10) : 15;
  });
  const [marginLeft, setMarginLeft] = useState<number>(() => {
    const val = localStorage.getItem('cfg_margin_left');
    return val ? parseInt(val, 10) : 15;
  });
  const [marginRight, setMarginRight] = useState<number>(() => {
    const val = localStorage.getItem('cfg_margin_right');
    return val ? parseInt(val, 10) : 15;
  });

  // Backward compatibility variables for older usages
  const companyName = companyNameEn;
  const companyAddress = companyAddressTh + ' | ' + companyAddressEn;
  const companyContact = 'TEL. ' + companyPhone + ' • E-mail : ' + companyEmail;

  // Fonts Settings "ทุกจุด"
  const [fontCompany, setFontCompany] = useState<number>(() => {
    const val = localStorage.getItem('cfg_font_company_name');
    return val ? parseInt(val, 10) : 15;
  });
  const [fontMetaGrid, setFontMetaGrid] = useState<number>(() => {
    const val = localStorage.getItem('cfg_font_meta_grid');
    return val ? parseInt(val, 10) : 10;
  });
  const [fontReportTitle, setFontReportTitle] = useState<number>(() => {
    const val = localStorage.getItem('cfg_font_report_title');
    return val ? parseInt(val, 10) : 16;
  });
  const [fontContent, setFontContent] = useState<number>(() => {
    const val = localStorage.getItem('cfg_font_content');
    return val ? parseInt(val, 10) : 11;
  });
  const [fontSignature, setFontSignature] = useState<number>(() => {
    const val = localStorage.getItem('cfg_font_signature');
    return val ? parseInt(val, 10) : 10;
  });
  const [fontFooter, setFontFooter] = useState<number>(() => {
    const val = localStorage.getItem('cfg_font_footer');
    return val ? parseInt(val, 10) : 9;
  });

  // Multi-page Array State
  const [pages, setPages] = useState<PageConfig[]>(() => {
    const raw = localStorage.getItem('cfg_report_pages');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return DEFAULT_PAGES;
  });

  // Active page selector in the Live Preview Paper
  const [previewPageIndex, setPreviewPageIndex] = useState<number>(0);

  // General PDF & CSV settings
  const [pdfFooterText, setPdfFooterText] = useState(() => {
    return localStorage.getItem('cfg_pdf_footer_text') || 'CONFIDENTIAL SYSTEM RECORD • SECURED BY SMART CERT';
  });
  const [pdfShowPageNumbers, setPdfShowPageNumbers] = useState<boolean>(() => {
    const val = localStorage.getItem('cfg_pdf_show_page_numbers');
    return val !== 'false';
  });
  const [pdfShowPrintDate, setPdfShowPrintDate] = useState<boolean>(() => {
    const val = localStorage.getItem('cfg_pdf_show_print_date');
    return val !== 'false';
  });
  const [csvIncludeMetadata, setCsvIncludeMetadata] = useState<boolean>(() => {
    const val = localStorage.getItem('cfg_csv_include_metadata');
    return val !== 'false';
  });

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('cfg_report_company_name_th', companyNameTh);
    localStorage.setItem('cfg_report_company_name_en', companyNameEn);
    localStorage.setItem('cfg_report_tax_id', taxId);
    localStorage.setItem('cfg_report_company_address_th', companyAddressTh);
    localStorage.setItem('cfg_report_company_address_en', companyAddressEn);
    localStorage.setItem('cfg_report_company_phone', companyPhone);
    localStorage.setItem('cfg_report_company_email', companyEmail);
    localStorage.setItem('cfg_report_logo', companyLogo);

    // Paper Settings
    localStorage.setItem('cfg_paper_size', paperSize);
    localStorage.setItem('cfg_margin_top', marginTop.toString());
    localStorage.setItem('cfg_margin_bottom', marginBottom.toString());
    localStorage.setItem('cfg_margin_left', marginLeft.toString());
    localStorage.setItem('cfg_margin_right', marginRight.toString());
    
    // fonts
    localStorage.setItem('cfg_font_company_name', fontCompany.toString());
    localStorage.setItem('cfg_font_meta_grid', fontMetaGrid.toString());
    localStorage.setItem('cfg_font_report_title', fontReportTitle.toString());
    localStorage.setItem('cfg_font_content', fontContent.toString());
    localStorage.setItem('cfg_font_signature', fontSignature.toString());
    localStorage.setItem('cfg_font_footer', fontFooter.toString());

    // Pages
    localStorage.setItem('cfg_report_pages', JSON.stringify(pages));

    // other configs
    localStorage.setItem('cfg_pdf_footer_text', pdfFooterText);
    localStorage.setItem('cfg_pdf_show_page_numbers', pdfShowPageNumbers.toString());
    localStorage.setItem('cfg_pdf_show_print_date', pdfShowPrintDate.toString());
    localStorage.setItem('cfg_csv_include_metadata', csvIncludeMetadata.toString());
  }, [
    companyNameTh, companyNameEn, taxId, companyAddressTh, companyAddressEn, companyPhone, companyEmail, companyLogo,
    paperSize, marginTop, marginBottom, marginLeft, marginRight,
    fontCompany, fontMetaGrid, fontReportTitle, fontContent, fontSignature, fontFooter,
    pages, pdfFooterText, pdfShowPageNumbers, pdfShowPrintDate, csvIncludeMetadata
  ]);

  const updatePageField = (id: string, field: keyof PageConfig, value: any) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const activePage = pages[previewPageIndex] || pages[0] || DEFAULT_PAGES[0];

  // Add a new Page template
  const handleAddNewPage = () => {
    const nextIndex = pages.length + 1;
    const newPage: PageConfig = {
      id: `page-${Date.now()}`,
      label: `หน้า ${nextIndex}: รายงานย่อยเพิ่มเติม`,
      reportTitle: `HALAL COMPLIANCE INSPECTION LOG - PAGE ${nextIndex}`,
      documentCode: `FM-HL-GEN-00${nextIndex}`,
      revisionNo: '00',
      issueDate: new Date().toISOString().split('T')[0],
      showSignatures: true,
      preparedByName: 'Phichamon S.',
      preparedByTitle: 'QA Senior Officer',
      reviewedByName: '',
      reviewedByTitle: '',
      approvedByName: '',
      approvedByTitle: ''
    };
    setPages([...pages, newPage]);
    setPreviewPageIndex(pages.length); // switch to the newly created page

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'เพิ่มรายงานหน้า ' + nextIndex + ' สำเร็จ!',
      showConfirmButton: false,
      timer: 2000,
      background: '#f8f9fa'
    });
  };

  const handleDeletePage = (id: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pages.length <= 1) {
      Swal.fire({
        icon: 'warning',
        title: 'ไม่อนุญาตให้ดำเนินการ',
        text: 'รายงานจำเป็นต้องระบุไว้อย่างน้อย 1 หน้าเพื่อการันตีความถูกต้องของเอกสารถ่ายโอน ISO',
        confirmButtonColor: THEME.danger
      });
      return;
    }

    Swal.fire({
      title: 'ต้องการลบหน้านี้?',
      text: 'การระบุรหัสหัวกระดาษและลายเซ็นต์กำกับของหน้านี้จะถูกยกเลิกถาวร',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: THEME.danger,
      cancelButtonColor: '#7a8b95',
      confirmButtonText: 'ยืนยันลบหน้า',
      cancelButtonText: 'ยกเลิก',
      background: '#f8f9fa'
    }).then((result) => {
      if (result.isConfirmed) {
        const remaining = pages.filter(p => p.id !== id);
        // Rename indices for safety
        const updated = remaining.map((p, itemIdx) => {
          if (p.label.startsWith('หน้า ')) {
            return {
              ...p,
              label: p.label.replace(/^หน้า \d+:/, `หน้า ${itemIdx + 1}:`)
            };
          }
          return p;
        });

        setPages(updated);
        setPreviewPageIndex(0);

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'ลบโครงสร้างหน้าเอกสารสำเร็จ',
          showConfirmButton: false,
          timer: 2000,
          background: '#f8f9fa'
        });
      }
    });
  };

  const processLogoFile = (file: File) => {
    if (!file) return;
    if (!file.type.match('image.*')) {
      Swal.fire({
        icon: 'error',
        text: 'กรุณาเลือกเฉพาะไฟล์ภาพมาตรฐานเท่านั้น (PNG, JPG, SVG)',
        confirmButtonColor: THEME.danger
      });
      return;
    }
    if (file.size > 500 * 1024) {
      Swal.fire({
        icon: 'error',
        text: 'ขนาดตราสัญลักษณ์ใหญ่เกิน 500 KB โปรดย่อขนาดไฟล์เพื่อความสวยงามเวลารวบรวมเอกสาร',
        confirmButtonColor: THEME.danger
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCompanyLogo(e.target.result as string);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'อัปเดตโลโก้แล้ว!',
          showConfirmButton: false,
          timer: 1500,
          background: '#f8f9fa'
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processLogoFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processLogoFile(e.target.files[0]);
    }
  };

  const resetLogoToDefault = () => {
    setCompanyLogo(DEFAULT_LOGO_BASE64);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'คืนค่าตราสัญลักษณ์เริ่มต้นแล้ว',
      showConfirmButton: false,
      timer: 1500,
      background: '#f8f9fa'
    });
  };

  // CSV Dynamic Custom Downloader
  const downloadSampleCSV = () => {
    const csvContent: string[] = [];

    pages.forEach((pg, index) => {
      if (index > 0) {
        csvContent.push('\n');
        csvContent.push('========================================================================');
        csvContent.push(`"PAGE ${index + 1}: ${pg.label.replace(/"/g, '""')}"`);
        csvContent.push('========================================================================');
      }

      if (csvIncludeMetadata) {
        csvContent.push(`"COMPANY NAME: ${companyName.replace(/"/g, '""')}"`);
        csvContent.push(`"ADDRESS: ${companyAddress.replace(/"/g, '""')}"`);
        csvContent.push(`"CONTACT: ${companyContact.replace(/"/g, '""')}"`);
        csvContent.push(`"ISO CODE: ${pg.documentCode.replace(/"/g, '""')}"`);
        csvContent.push(`"REVISION / DATE: Rev. ${pg.revisionNo} (${pg.issueDate})"`);
        csvContent.push(`"TITLE: ${pg.reportTitle.replace(/"/g, '""')}"`);
        if (pg.showSignatures) {
          csvContent.push(`"SIGNATURE BOX: Prepared by ${pg.preparedByName || 'N/A'} | Reviewed by ${pg.reviewedByName || 'N/A'} | Approved by ${pg.approvedByName || 'N/A'}"`);
        }
        csvContent.push(''); // spacing row
      }

      csvContent.push('"Material ID","Material Name","Certification ID","Compliance Status","Parameter"');
      csvContent.push('"HALAL-ING-081","Agar-Agar Natural Gel","CERT-TH-991823-A","COMPLIANT","LOW"');
      csvContent.push('"HALAL-ING-304","Chili Oleoresin Extra","CERT-US-817263-K","COMPLIANT","LOW"');
      csvContent.push('"HALAL-ING-411","Whey Protein Concentrate","CERT-NL-121544-H","RESTRICTED","HIGH"');
      csvContent.push('"HALAL-ING-902","Emulsifier E471 Palm","CERT-DE-441112-L","PENDING","MEDIUM"');
    });

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SmartCert_Raw_ISO_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();

    Swal.fire({
      icon: 'success',
      title: 'ดำเนินการส่งออกไฟล์ CSV สำเร็จ',
      text: csvIncludeMetadata ? 'ระบบสอดแทรก Metadata ขององค์กรเกณฑ์ ISO เรียบร้อย' : 'ส่งออกภาพรวมเฉพาะตารางดิบเรียบร้อย',
      confirmButtonColor: THEME.primary
    });
  };

  // FULL PRINT PDF OF ALL PAGES
  const downloadSamplePDF = () => {
    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!printWindow) {
      Swal.fire({
        icon: 'error',
        title: 'ระบบป้องกันเบราว์เซอร์บล็อกการพิมพ์เอกสาร',
        text: 'โปรดอนุญาตสิทธิ์ Pop-ups สำหรับแอปพลิเคชันนี้เพื่อวิเคราะห์ลายพิมพ์',
        confirmButtonColor: THEME.danger
      });
      return;
    }

    const formattedPrintDate = pdfShowPrintDate 
      ? `Printed on: ${new Date().toLocaleDateString('th-TH')} ${new Date().toLocaleTimeString('th-TH')}` 
      : '';

    let pagesHtml = '';

    pages.forEach((pg, index) => {
      const pageNumbersHtml = pdfShowPageNumbers 
        ? `Page ${index + 1} of ${pages.length}` 
        : '';

      const signaturesHtml = pg.showSignatures ? `
        <div class="sig-area">
          <div class="sig-title-header font-mono">ISO COMPLIANCE APPROVAL SIGN-OFF SIGNATURES</div>
          <div class="sig-grid">
            <div class="sig-box">
              <span class="sig-label">Prepared By (ผู้จัดทำ)</span>
              <div class="sig-dashed">...................................................</div>
              <span class="sig-name">${pg.preparedByName || '(................................................)'}</span>
              <span class="sig-title">${pg.preparedByTitle || 'QA Staff / Auditor'}</span>
              <span class="sig-date">Date: ......./......./.......</span>
            </div>
            
            <div class="sig-box">
              <span class="sig-label">Reviewed By (ผู้ตรวจทาน)</span>
              <div class="sig-dashed">...................................................</div>
              <span class="sig-name">${pg.reviewedByName || '(................................................)'}</span>
              <span class="sig-title">${pg.reviewedByTitle || 'QA Manager / Supervisor'}</span>
              <span class="sig-date">Date: ......./......./.......</span>
            </div>

            <div class="sig-box">
              <span class="sig-label">Approved By (ผู้อนุมัติ)</span>
              <div class="sig-dashed">...................................................</div>
              <span class="sig-name">${pg.approvedByName || '(................................................)'}</span>
              <span class="sig-title">${pg.approvedByTitle || 'Director / Factory Lead'}</span>
              <span class="sig-date">Date: ......./......./.......</span>
            </div>
          </div>
        </div>
      ` : '';

      pagesHtml += `
        <div class="a4-wrapper page-break">
          <div>
            <!-- Header Grid Table with ISO Standard layout -->
            <div class="header-part">
              <div class="header-logo bg-white font-medium">
                <img src="${companyLogo}" class="logo-img" alt="Logo"/>
              </div>
              <div class="company-section text-slate-800">
                <h1 class="company-title font-sans font-black">${companyName}</h1>
                <p class="company-address">${companyAddress}</p>
                <p class="company-contact">${companyContact}</p>
              </div>
              
              <!-- ISO Compliance Grid (Top Right) -->
              <table class="iso-grid-table font-mono">
                <tr>
                  <td class="iso-label" style="width: 50%;">Doc No. (รหัสเอกสาร)</td>
                  <td class="iso-val">${pg.documentCode || '-'}</td>
                </tr>
                <tr>
                  <td class="iso-label">Rev. (ครั้งที่ปรับปรุง)</td>
                  <td class="iso-val">${pg.revisionNo || '00'}</td>
                </tr>
                <tr>
                  <td class="iso-label">Issue Date (ประกาศใช้)</td>
                  <td class="iso-val">${pg.issueDate || '-'}</td>
                </tr>
                <tr>
                  <td class="iso-label">Page (หน้า)</td>
                  <td class="iso-val">${index + 1} / ${pages.length}</td>
                </tr>
              </table>
            </div>

            <!-- Report Title centered -->
            <div class="report-title-section text-center">
              <h2 class="report-title uppercase font-black tracking-wider text-[#212c46]">${pg.reportTitle}</h2>
              <p style="font-size: 11px; color:#4d87a8; font-weight: 800; margin-top:2px;">SMART CERT - DIGITAL HALAL PORTAL VERIFICATION RECORD</p>
            </div>

            <!-- Mock ISO Materials Table based on page -->
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 15%;">Ingredient ID</th>
                  <th style="width: 45%;">Substance / Ingredient Description</th>
                  <th style="width: 20%;">Certification Code</th>
                  <th style="width: 20%; text-align: center;">Compliance Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>HALAL-ING-081</td>
                  <td>Agar-Agar Pure Gel Organic (เกรดสกัดพืชธรรมชาติไร้สิ่งเจือปนสุกร)</td>
                  <td>CERT-TH-991823-A</td>
                  <td style="text-align: center;"><span class="indicator-badge badge-compl">Compliant</span></td>
                </tr>
                <tr>
                  <td>HALAL-ING-304</td>
                  <td>Chili Oleoresin Extra (น้ำมันสกัดพริกชนิดเข้มข้น ความเผ็ดเกรดอุตสาหกรรม)</td>
                  <td>CERT-US-817263-K</td>
                  <td style="text-align: center;"><span class="indicator-badge badge-compl">Compliant</span></td>
                </tr>
                <tr>
                  <td>HALAL-ING-411</td>
                  <td>Whey Isolate Blend (ส่วนผสมเวย์นมสดนำเข้า มีโอกาสปนเปื้อนเจลลาติน)</td>
                  <td>CERT-NL-121544-H</td>
                  <td style="text-align: center;"><span class="indicator-badge badge-danger">Restricted Area</span></td>
                </tr>
                <tr>
                  <td>HALAL-ING-902</td>
                  <td>Emulsifier E471 Organic (สารช่วยประสานแป้งมันสำปะหลังออร์แกนิค)</td>
                  <td>CERT-DE-441112-L</td>
                  <td style="text-align: center;"><span class="indicator-badge badge-pending">Pending Doc</span></td>
                </tr>
              </tbody>
            </table>
            
            <div style="margin-top: 30px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #edf2f7; font-size: 11px; line-height: 1.5; color: #475569;">
              <strong>ISO Audit Compliance Statement:</strong> การรับรองวัตถุดิบอาหารและสสารปรุงแต่งตามข้อบังคับอาหารฮาลาล ได้รับการประเมินด้านความปลอดภัย วิเคราะห์แบบทดสอบอย่างละเอียดถี่ถ้วน ภายใต้มาตรฐานการคุมคุณสมบัติ SMART CERT สำหรับสถานประกอบการที่ได้รับความร่วมมือสูงสุด
            </div>
          </div>

          <div>
             <!-- Signature Box Pushed strictly at the bottom before footer -->
             ${signaturesHtml}

             <!-- Page Footer -->
             <div class="footer-line-wrapper">
               <div class="footer-note">${pdfFooterText}</div>
               <div class="footer-date">${formattedPrintDate}</div>
               <div class="footer-page">${pageNumbersHtml}</div>
             </div>
          </div>
        </div>
      `;
    });

    printWindow.document.write(`
      <html>
        <head>
          <title>ISO Compliance Multi-Page Documents Format Print</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Noto+Sans+Thai:wght@400;500;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
            * { box-sizing: border-box; }
            body { 
              font-family: 'Noto Sans Thai', 'Inter', 'JetBrains Mono', sans-serif; 
              padding: 20px; 
              color: #1e293b; 
              background: #f1f5f9;
            }
            .no-print-btn { 
              text-align: center; 
              margin-bottom: 20px; 
              background: #ffffff; 
              padding: 15px; 
              border-radius: 12px;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
              max-width: 820px;
              margin-left: auto;
              margin-right: auto;
            }
            .print-button {
              padding: 12px 30px; 
              background: #212c46; 
              color: #ffffff; 
              border: none; 
              font-weight: 900; 
              font-size: 13px; 
              border-radius: 8px; 
              text-transform: uppercase; 
              cursor: pointer; 
              letter-spacing: 0.5px;
              box-shadow: 0 4px 10px rgba(33, 44, 70, 0.2);
              transition: all 0.2s;
            }
            .print-button:hover {
              background: #3f809e;
            }
            .a4-wrapper {
              background: #ffffff;
              width: 210mm;
              min-height: 297mm;
              margin: 30px auto;
              padding: 20mm 15mm;
              border: 1px solid #cbd5e1;
              box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              overflow: hidden;
            }
            .header-part {
              display: flex;
              align-items: center;
              border: 1px solid #cbd5e1;
              margin-bottom: 25px;
              background-color: #fafbfc;
            }
            .header-logo {
              width: 80px;
              height: 80px;
              padding: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-right: 1px solid #cbd5e1;
              flex-shrink: 0;
            }
            .logo-img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
            .company-section {
              flex: 1;
              padding: 12px;
              text-align: left;
            }
            .company-title {
              font-weight: 900;
              font-size: ${fontCompany}px;
              margin: 0 0 3px 0;
              color: #1e293b;
            }
            .company-address, .company-contact {
              font-size: 10px;
              color: #475569;
              margin: 1px 0;
              font-weight: 500;
            }
            .iso-grid-table {
              width: 280px;
              border-left: 1px solid #cbd5e1;
              border-collapse: collapse;
              font-size: ${fontMetaGrid}px;
            }
            .iso-grid-table td {
              border: 1px solid #cbd5e1;
              padding: 6px 10px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .iso-label {
              background-color: #f1f5f9;
              color: #475569;
              font-weight: 700 !important;
            }
            .iso-val {
              color: #212c46;
              font-family: 'JetBrains Mono', 'Inter', monospace;
            }
            .report-title-section {
              margin: 25px 0 20px 0;
            }
            .report-title {
              font-size: ${fontReportTitle}px;
              font-weight: 900;
              letter-spacing: 0.05em;
              display: inline-block;
              border-bottom: 2px solid #b58c4f;
              padding-bottom: 6px;
              margin: 0;
            }
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            .data-table th {
              background: #1e293b;
              color: #ffffff;
              font-size: 11px;
              font-weight: 900;
              text-transform: uppercase;
              padding: 12px 10px;
              border: 1px solid #cbd5e1;
              text-align: left;
            }
            .data-table td {
              padding: 11px 10px;
              font-size: ${fontContent}px;
              border: 1px solid #cbd5e1;
              font-weight: 500;
              color: #334155;
            }
            .indicator-badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 9px;
              font-weight: 900;
              text-transform: uppercase;
            }
            .badge-compl { background: #dcfce7; color: #166534; }
            .badge-pending { background: #fef9c3; color: #854d0e; }
            .badge-danger { background: #fee2e2; color: #991b1b; }

            /* SIGNATURE SECTION LAYOUT */
            .sig-area {
              margin-top: auto; /* Forces pushing signature block strictly above footer */
              margin-bottom: 20px;
              border: 1px solid #cbd5e1;
              background-color: #fafbfc;
              border-radius: 8px;
              overflow: hidden;
            }
            .sig-title-header {
              background-color: #212c46;
              color: #ffffff;
              font-size: 9px;
              font-weight: 900;
              padding: 6px 12px;
              letter-spacing: 1px;
            }
            .sig-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              border-top: none;
            }
            .sig-box {
              border-right: 1px solid #cbd5e1;
              padding: 12px;
              font-size: ${fontSignature}px;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .sig-box:last-child {
              border-right: none;
            }
            .sig-label {
              font-weight: 900;
              color: #b58c4f;
              text-transform: uppercase;
              margin-bottom: 25px;
            }
            .sig-dashed {
              color: #cbd5e1;
              margin-bottom: 4px;
              letter-spacing: -0.5px;
            }
            .sig-name {
              font-weight: 700;
              color: #1e293b;
              margin-bottom: 2px;
            }
            .sig-title {
              font-size: 10px;
              color: #64748b;
              font-weight: 500;
              margin-bottom: 6px;
            }
            .sig-date {
              font-size: 9px;
              color: #94a3b8;
              font-weight: 600;
            }

            /* FOOTER WRAPPER */
            .footer-line-wrapper {
              margin-top: 5px;
              padding-top: 15px;
              border-top: 1px solid #cbd5e1;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: ${fontFooter}px;
              color: #64748b;
              font-weight: 700;
              text-transform: uppercase;
            }
            .footer-note {
              flex: 1;
              text-align: left;
              font-style: italic;
            }
            .footer-date {
              margin: 0 15px;
              color: #94a3b8;
            }
            .footer-page {
              font-family: 'JetBrains Mono', monospace;
              font-weight: 900;
              color: #1e293b;
              border: 1px solid #cbd5e1;
              padding: 2px 8px;
              border-radius: 4px;
              background-color: #f1f5f9;
            }

            @media print {
              .no-print-btn { display: none; }
              body { padding: 0; background: #ffffff; }
              .a4-wrapper { 
                border: none; 
                box-shadow: none; 
                margin: 0; 
                padding: 10mm 5mm 10mm 5mm; 
                width: 100%;
                height: 297mm;
                page-break-after: always; 
              }
              .page-break {
                page-break-after: always;
              }
            }
          </style>
        </head>
        <body>
          <div class="no-print-btn">
            <p style="font-size: 12px; margin: 0 0 10px 0; color: #414757; font-weight: bold;">
              ตรวจทานหน้าเอกสาร ISO ครบถ้วนทั้งหมด ${pages.length} หน้าก่อนสั่งพิมพ์ | หน้าต่างนี้รองรับการตั้งค่าน้ำหนักฟอนต์และลายเซ็นสมบูรณ์
            </p>
            <button onclick="window.print()" class="print-button">
              PRINT SYSTEM PDF / SAVE ISO DOCUMENT (พิมพ์รายงานด้วยรูปแบบ ISO)
            </button>
          </div>
          ${pagesHtml}
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleSaveConfigurationSwal = () => {
    setIsConfigModalOpen(false);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'บันทึกรูปแบบรายงานเรียบร้อยแล้ว!',
      text: 'การระบุสเกลขนาดตัวอักษรและข้อมูลผู้อนุมัติทั้งลายเซ็นมีผลทันที',
      showConfirmButton: false,
      timer: 3000,
      background: '#f8f9fa'
    });
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* USER GUIDE FLOATING BILL */}
      <UserGuideButton onClick={() => setIsGuideOpen(true)} />

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* HEADER SECTION - Parity layout styling conforming to rules */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <FileSpreadsheet size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div className="text-left">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      REPORT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">FORMATS</span>
                  </h3>
                  <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      ISO & REGULATORY COMPLIANCE EXPORT TEMPLATE SYSTEM
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button 
                    onClick={() => setActiveMainTab(activeMainTab === 'preview' ? 'config' : 'preview')} 
                    className="px-5 py-2.5 bg-[#b58c4f] hover:bg-[#a1783f] text-white rounded-lg text-[11px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2"
                  >
                     <Settings size={14} /> {activeMainTab === 'preview' ? 'Open Config Center' : 'Go to Live Preview'}
                  </button>
              </div>
          </div>
      </div>

      <div className="w-full px-4 sm:px-8 flex-1 flex flex-col min-h-0">
        <div className="w-full text-left">
            
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 shrink-0">
                <KpiCard label="ISO Pages Configured" value={`${pages.length} Pages`} icon={Layers} color={THEME.primary} description="Total active layout segments" />
                <KpiCard label="Company Logo Size" value={companyLogo === DEFAULT_LOGO_BASE64 ? "DEFAULT EMBLEM" : "CUSTOM BASE64"} icon={Building} color={THEME.gold} description="Verified compliant branding" />
                <KpiCard label="Everywhere Sizers" value="ACTIVE READY" icon={Sliders} color={THEME.skyBlue} description="6 Custom Font-Point adjustments" />
                <KpiCard label="Paper & Margins" value={`${paperSize} Standard`} icon={FileText} color={THEME.success} description="ISO margin guides active" />
            </div>

            {/* MAIN SYSTEM TABS FOR ROUTING WITHIN THIS CONFIGURATION MODULE */}
            <div className="flex border-b border-slate-200 mb-6 gap-2 bg-slate-50/50 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveMainTab('preview')}
                className={`flex-1 sm:flex-initial py-3 px-6 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeMainTab === 'preview'
                    ? 'bg-[#212c46] text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Eye size={15} /> พรีวิวตัวอย่างรายงาน (Live Preview)
              </button>
              <button
                type="button"
                onClick={() => setActiveMainTab('config')}
                className={`flex-1 sm:flex-initial py-3 px-6 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeMainTab === 'config'
                    ? 'bg-[#212c46] text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Sliders size={15} /> ศูนย์ตั้งค่ารูปแบบรายงาน (Config Center)
              </button>
            </div>

            {activeMainTab === 'preview' ? (
              /* TAB 1: INTERACTIVE LIVE PREVIEW SCREEN */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-8">
                 
                 {/* Informational Guidelines column (3 Columns) */}
                 <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white/90 p-5 rounded-2xl shadow-sm border border-[#eaeaec] text-left">
                      <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-wider flex items-center gap-2 border-b border-[#eaeaec] pb-3 mb-3">
                         <SlidersHorizontal size={16} className="text-[#b58c4f]" /> Active page selector
                      </h3>

                      <p className="text-[11.5px] text-slate-500 font-medium mb-4 leading-normal">
                         คลิกแถบย่อยด้านล่างเพื่อสลับพรีวิวหัวพิมพ์ ISO, ชุดรหัสประกาศเอกสาร และกล่องผู้เซ็นกำกับอนุมัติแต่ละแผ่น:
                      </p>

                      <div className="space-y-2">
                        {pages.map((p, idx) => (
                           <div 
                             key={p.id}
                             onClick={() => setPreviewPageIndex(idx)}
                             className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all flex items-center justify-between ${
                               previewPageIndex === idx
                                 ? 'border-[#212c46] bg-[#212c46]/5 text-[#212c46] font-black'
                                 : 'border-[#eaeaec] bg-white text-slate-500 hover:bg-slate-50'
                             }`}
                           >
                             <div className="min-w-0">
                               <p className="text-[12px] font-black uppercase truncate">{p.label}</p>
                               <p className="text-[9.5px] text-[#7a8b95] font-mono truncate">{p.documentCode} (Rev.{p.revisionNo})</p>
                             </div>
                             <ChevronRight size={14} className="shrink-0 text-[#7a8b95]" />
                           </div>
                        ))}
                      </div>

                      <button 
                        onClick={handleAddNewPage}
                        className="mt-4 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-[#212c46] text-[11px] font-black uppercase rounded-lg border border-dashed border-slate-300 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={14} /> Add New Page
                      </button>
                    </div>

                    <div className="p-4 bg-white/80 border border-[#eaeaec] rounded-2xl text-left">
                       <button
                          onClick={() => setActiveMainTab('config')}
                          className="w-full py-3 bg-[#b58c4f] hover:bg-[#a1783f] text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                       >
                          <Settings size={15} /> OPEN CONFIG CENTER INLINE
                       </button>
                    </div>
                 </div>

                 {/* Live Preview interactive simulated card (9 Columns) */}
                 <div className="lg:col-span-9 space-y-4">
                    <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-[11.5px] font-black text-[#212c46] uppercase tracking-widest">
                            LIVE INTERACTIVE PREVIEW - {activePage?.label}
                          </span>
                       </div>
                       <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">A4 RATIO ({paperSize})</span>
                    </div>

                    {/* A4 simulated card - using split-column corporate styling & dynamic millimeter margins */}
                    <div 
                      className="w-full bg-white border-2 border-slate-300 shadow-2xl rounded-2xl aspect-[1/1.414] flex flex-col justify-between overflow-hidden relative group/paper select-none transition-all hover:shadow-3xl max-w-4xl mx-auto text-left"
                      style={{
                        paddingTop: `${marginTop * 1.6}px`,
                        paddingBottom: `${marginBottom * 1.6}px`,
                        paddingLeft: `${marginLeft * 1.6}px`,
                        paddingRight: `${marginRight * 1.6}px`
                      }}
                    >
                      {/* Top edge colored accent bar */}
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#212c46] via-[#3f809e] to-[#b58c4f]"></div>

                      {/* TOP SECTION: COMPANY BRANDING SPLIT (LEFT & RIGHT) */}
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          {/* Left Column: Thai / English Brand Name and Identity */}
                          <div className="flex-1 space-y-1">
                            <h4 
                              className="font-black text-[#212c46] uppercase tracking-tight leading-tight"
                              style={{ fontSize: `${fontCompany}px` }}
                            >
                              {companyNameTh}
                            </h4>
                            <p 
                              className="font-bold text-slate-700 leading-tight"
                              style={{ fontSize: `${fontCompany * 0.85}px` }}
                            >
                              {companyNameEn}
                            </p>
                            <p className="font-mono text-[10.5px] font-black text-slate-600 mt-1">
                              TAX ID : <span className="font-sans font-bold text-slate-800">{taxId}</span>
                            </p>
                          </div>

                          {/* Right Column: Registered Corporate Addresses and Phones */}
                          <div className="sm:text-right space-y-1 max-w-sm shrink-0">
                            <p className="text-[9.5px] sm:text-[10px] text-slate-800 font-bold leading-relaxed">{companyAddressTh}</p>
                            <p className="text-[8.5px] sm:text-[9px] text-slate-500 font-semibold leading-relaxed">{companyAddressEn}</p>
                            <p className="text-[8px] sm:text-[8.5px] text-[#3f809e] font-black mt-1 leading-relaxed">
                              TEL. {companyPhone}  •  E-mail : {companyEmail}
                            </p>
                          </div>
                        </div>

                        {/* Thick divider bar separating header and metadata */}
                        <div className="w-full h-[3.5px] bg-[#212c46]"></div>

                        {/* DOCUMENT META GRID & BIG HEADING */}
                        <div className="grid grid-cols-12 items-center gap-3">
                          {/* Department Column */}
                          <div className="col-span-3 text-left font-sans font-black text-slate-400 uppercase tracking-wider leading-none" style={{ fontSize: `${fontMetaGrid}px` }}>
                            PROCUREMENT<br/>DEPARTMENT
                          </div>

                          {/* Document Title Center Column */}
                          <div className="col-span-6 text-center">
                            <h2 
                              className="font-black uppercase tracking-wider text-[#dc5d43] leading-none mb-1"
                              style={{ fontSize: `${fontReportTitle}px` }}
                            >
                              {activePage?.reportTitle || 'PURCHASE REQUISITION'}
                            </h2>
                            <p className="text-[#212c46] font-bold tracking-tight text-[11px] sm:text-[12px]">
                              {activePage?.label}
                            </p>
                          </div>

                          {/* Code and Dates Column */}
                          <div className="col-span-3 text-right font-mono text-slate-500 space-y-0.5" style={{ fontSize: `${fontMetaGrid * 0.9}px` }}>
                            <div>Doc No: <span className="font-sans font-black text-slate-800">{activePage?.documentCode || 'FM-HL-REG-001'}</span></div>
                            <div>Rev No: <span className="font-sans font-black text-slate-800">{activePage?.revisionNo || '00'}</span></div>
                            <div>Issue Date: <span className="font-sans font-black text-slate-800">{activePage?.issueDate || '-'}</span></div>
                          </div>
                        </div>

                        {/* Requester container (styled box) */}
                        <div className="border border-slate-300 rounded-xl bg-[#fafbfc]/35 p-3 flex flex-col md:flex-row gap-4 shrink-0 text-slate-800 text-left mt-2">
                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="block text-[8px] sm:text-[9px] font-black text-[#7a8b95] uppercase tracking-wider">REQUESTER NAME / ผู้ขอซื้อ</span>
                                <span className="text-[11px] sm:text-[12px] font-black text-slate-800">{activePage?.preparedByName || 'คุณสมชาย ใจดี'}</span>
                              </div>
                              <div>
                                <span className="block text-[8px] sm:text-[9px] font-black text-[#7a8b95] uppercase tracking-wider">DEPARTMENT / แผนก</span>
                                <span className="text-[11px] sm:text-[12px] font-black text-slate-800">{activePage?.preparedByTitle || 'Production'}</span>
                              </div>
                            </div>
                            <div>
                              <span className="block text-[8.5px] font-black text-[#7a8b95] uppercase tracking-wider">OBJECTIVE & REMARKS / วัตถุประสงค์การดำเนินการ</span>
                              <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 block leading-normal">
                                บ่งบอกระดับความสอดคล้องและการประกาศข้อบังคับมาตรฐาน ISO ประกันสถิติสถานะคุณภาพวัตถุดิบและเอกสารประกอบ
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Catalog Items Mock Table */}
                        <div className="border border-slate-300 rounded-lg overflow-hidden shrink-0 mt-3">
                          <table className="w-full text-left border-collapse font-sans text-[9px] sm:text-[10.5px]">
                            <thead>
                              <tr className="bg-[#1d2636] text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider">
                                <th className="py-2 px-2 text-center border-r border-[#2a374d]" style={{ width: '5%' }}>#</th>
                                <th className="py-2 px-2 border-r border-[#2a374d]" style={{ width: '45%' }}>DESCRIPTION (รายการสินค้า)</th>
                                <th className="py-2 px-2 text-center border-r border-[#2a374d]" style={{ width: '8%' }}>QTY</th>
                                <th className="py-2 px-2 text-center border-r border-[#2a374d]" style={{ width: '8%' }}>UNIT</th>
                                <th className="py-2 px-2 text-right border-r border-[#2a374d]" style={{ width: '13%' }}>EST. PRICE</th>
                                <th className="py-2 px-2 text-right border-r border-[#2a374d]" style={{ width: '13%' }}>TOTAL AMOUNT</th>
                                <th className="py-2 px-2" style={{ width: '18%' }}>NOTE</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-[#414757]">
                              <tr className="hover:bg-slate-50 transition-colors font-medium" style={{ fontSize: `${fontContent}px` }}>
                                <td className="py-2 px-2 text-center font-mono text-slate-400 font-bold border-r border-slate-200">1</td>
                                <td className="py-2 px-2 font-bold text-[#212c46] border-r border-slate-200 truncate">Digital Thermometer รุ่น X-100</td>
                                <td className="py-2 px-2 text-center font-black font-mono text-slate-800 border-r border-slate-200">2</td>
                                <td className="py-2 px-2 text-center text-slate-500 font-bold border-r border-slate-200">pcs</td>
                                <td className="py-2 px-2 text-right font-mono font-bold border-r border-slate-200">7,500.00</td>
                                <td className="py-2 px-2 text-right font-mono font-black text-[#212c46] border-r border-slate-200">15,000.00</td>
                                <td className="py-2 px-2 text-slate-400 font-bold italic text-[9px] truncate">ตามที่ QA กำหนด</td>
                              </tr>
                              <tr className="hover:bg-slate-50 transition-colors font-medium" style={{ fontSize: `${fontContent}px` }}>
                                <td className="py-2 px-2 text-center font-mono text-slate-400 font-bold border-r border-slate-200">2</td>
                                <td className="py-2 px-2 font-bold text-[#212c46] border-r border-slate-200 truncate">Alcohol Sanitizer Gel 70%</td>
                                <td className="py-2 px-2 text-center font-black font-mono text-slate-800 border-r border-slate-200">10</td>
                                <td className="py-2 px-2 text-center text-slate-500 font-bold border-r border-slate-200">liters</td>
                                <td className="py-2 px-2 text-right font-mono font-bold border-r border-slate-200">120.00</td>
                                <td className="py-2 px-2 text-right font-mono font-black text-[#212c46] border-r border-slate-200">1,200.00</td>
                                <td className="py-2 px-2 text-slate-400 font-bold italic text-[9px] truncate">สัญลักษณ์ฮาลาล</td>
                              </tr>
                              <tr className="hover:bg-slate-50 transition-colors bg-slate-50/20 font-medium" style={{ fontSize: `${fontContent}px` }}>
                                <td className="py-2 px-2 text-center font-mono text-slate-400 font-bold border-r border-slate-200">3</td>
                                <td className="py-2 px-2 font-bold text-[#212c46] border-r border-slate-200 truncate">Calibration Certification</td>
                                <td className="py-2 px-2 text-center font-black font-mono text-slate-800 border-r border-slate-200">1</td>
                                <td className="py-2 px-2 text-center text-slate-500 font-bold border-r border-slate-200">job</td>
                                <td className="py-2 px-2 text-right font-mono font-bold border-r border-slate-200">3,500.00</td>
                                <td className="py-2 px-2 text-right font-mono font-black text-[#212c46] border-r border-slate-200">3,500.00</td>
                                <td className="py-2 px-2 text-slate-400 font-bold italic text-[9px] truncate">ISO/IEC 17025</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[9px] leading-relaxed text-slate-500 font-medium">
                          <strong>Preview Note:</strong> การแก้ไขระยะขอบและรายละเอียดข้อมูลองค์กรจะสะท้อนลงเอกสารฉบับนี้เมื่อส่งออกไปยังโมดูลย่อยภายนอก
                        </div>
                      </div>

                      {/* BOTTOM HALF - SIGNATURES & FOOTER, PUSHED TO BOTTOM STRICTLY */}
                      <div className="mt-auto pt-6 space-y-4">
                        
                        {/* Interactive Signatures box only if enabled on active page */}
                        {activePage?.showSignatures ? (
                          <div className="border border-slate-300 rounded-xl overflow-hidden bg-[#fafbfc] transition-all animate-fadeIn">
                            <div className="bg-[#212c46] text-white text-[8px] font-black uppercase tracking-widest px-3 p-1 font-mono">
                              ISO APPROVAL SIGN-OFF SIGNATURES
                            </div>
                            
                            <div className="grid grid-cols-3 divide-x divide-slate-300 text-[9px] sm:text-[10px]" style={{ fontSize: `${fontSignature}px` }}>
                              {/* Prep box */}
                              <div className="p-2.5 flex flex-col items-center text-center">
                                <span className="text-[8px] font-black text-[#b58c4f] uppercase mb-5">Prepared By</span>
                                <div className="text-slate-300 tracking-tighter mb-1">........................................</div>
                                <span className="font-black text-slate-800 truncate max-w-full">{activePage?.preparedByName || '(..............................)'}</span>
                                <span className="text-[8px] text-slate-400 font-medium truncate max-w-full">{activePage?.preparedByTitle || 'QA Staff / Officer'}</span>
                              </div>

                              {/* Rev box */}
                              <div className="p-2.5 flex flex-col items-center text-center">
                                <span className="text-[8px] font-black text-[#b58c4f] uppercase mb-5">Reviewed By</span>
                                <div className="text-slate-300 tracking-tighter mb-1">........................................</div>
                                <span className="font-black text-slate-800 truncate max-w-full">{activePage?.reviewedByName || '(..............................)'}</span>
                                <span className="text-[8px] text-slate-400 font-medium truncate max-w-full">{activePage?.reviewedByTitle || 'QA Manager'}</span>
                              </div>

                              {/* Appr box */}
                              <div className="p-2.5 flex flex-col items-center text-center">
                                <span className="text-[8px] font-black text-[#b58c4f] uppercase mb-5">Approved By</span>
                                <div className="text-slate-300 tracking-tighter mb-1">........................................</div>
                                <span className="font-black text-slate-800 truncate max-w-full">{activePage?.approvedByName || '(..............................)'}</span>
                                <span className="text-[8px] text-slate-400 font-medium truncate max-w-full">{activePage?.approvedByTitle || 'Managing Director'}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                            [ Signatures block disabled for this page layout ]
                          </div>
                        )}

                        {/* Delimiter & Footer stamp */}
                        <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[#7a8b95] font-black uppercase tracking-wider" style={{ fontSize: `${fontFooter}px` }}>
                          <span className="truncate max-w-[200px]">{pdfFooterText || 'CONFIDENTIAL'}</span>
                          <span>{pdfShowPrintDate ? new Date().toLocaleDateString('th-TH') : ''}</span>
                          <span>{pdfShowPageNumbers ? `Page ${previewPageIndex + 1} of ${pages.length}` : ''}</span>
                        </div>

                      </div>

                    </div>
                 </div>

              </div>
            ) : (
              /* TAB 2: INLINED FULL-SCREEN CONFIGURATION CENTER (INDEPENDENT OF MODAL) */
              <div className="bg-white border border-[#eaeaec] rounded-2xl shadow-xl flex flex-col min-h-[540px] text-left animate-fadeIn mb-8 overflow-hidden">
                <div className="flex flex-col md:flex-row flex-1 min-h-[540px]">
                  {/* LEFT VERTICAL SIDE-TAB MENU */}
                  <div className="w-full md:w-64 bg-slate-50 border-r border-[#eaeaec] p-5 flex flex-col justify-between shrink-0">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest block px-2.5 mb-2">Category Tabs</span>
                    
                    <button
                      type="button"
                      onClick={() => setActiveSideTab('profile')}
                      className={`w-full p-3.5 rounded-xl text-left font-black text-[11.5px] uppercase tracking-wide transition-all flex items-center gap-3 ${
                        activeSideTab === 'profile'
                          ? 'bg-[#212c46] text-white shadow-md'
                          : 'text-[#414757] hover:bg-slate-200/60'
                      }`}
                    >
                      <Building size={16} />
                      <span>1. Company Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSideTab('pages_iso')}
                      className={`w-full p-3.5 rounded-xl text-left font-black text-[11.5px] uppercase tracking-wide transition-all flex items-center gap-3 ${
                        activeSideTab === 'pages_iso'
                          ? 'bg-[#212c46] text-white shadow-md'
                          : 'text-[#414757] hover:bg-slate-200/60'
                      }`}
                    >
                      <Layers size={16} />
                      <span>2. ISO Multi-Pages</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSideTab('fonts')}
                      className={`w-full p-3.5 rounded-xl text-left font-black text-[11.5px] uppercase tracking-wide transition-all flex items-center gap-3 ${
                        activeSideTab === 'fonts'
                          ? 'bg-[#212c46] text-white shadow-md'
                          : 'text-[#414757] hover:bg-slate-200/60'
                      }`}
                    >
                      <Sliders size={16} />
                      <span>3. Everywhere Fonts</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSideTab('signatures')}
                      className={`w-full p-3.5 rounded-xl text-left font-black text-[11.5px] uppercase tracking-wide transition-all flex items-center gap-3 ${
                        activeSideTab === 'signatures'
                          ? 'bg-[#212c46] text-white shadow-md'
                          : 'text-[#414757] hover:bg-slate-200/60'
                      }`}
                    >
                      <Signature size={16} />
                      <span>4. Sign-offs Box</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSideTab('paper')}
                      className={`w-full p-3.5 rounded-xl text-left font-black text-[11.5px] uppercase tracking-wide transition-all flex items-center gap-3 ${
                        activeSideTab === 'paper'
                          ? 'bg-[#212c46] text-white shadow-md'
                          : 'text-[#414757] hover:bg-slate-200/60'
                      }`}
                    >
                      <FileText size={16} />
                      <span>5. Paper Settings</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSideTab('csv')}
                      className={`w-full p-3.5 rounded-xl text-left font-black text-[11.5px] uppercase tracking-wide transition-all flex items-center gap-3 ${
                        activeSideTab === 'csv'
                          ? 'bg-[#212c46] text-white shadow-md'
                          : 'text-[#414757] hover:bg-slate-200/60'
                      }`}
                    >
                      <FileSpreadsheet size={16} />
                      <span>6. Export Extras</span>
                    </button>
                  </div>

                  <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-left mt-6">
                    <p className="text-[10px] font-black text-[#3f809e] uppercase tracking-wider mb-1 flex items-center gap-1">
                       <Sparkles size={11} /> LIVE PREVIEW INTERACTIVE
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold leading-normal">
                       แก้ไขข้อมูลบนศูนย์ควบคุมนี้ ข้อมูลจะบันทึกลงคลังความจำทันที พร้อมนำไปพรีวิวในหน้าตัวอย่างเอกสารอย่างสมบูรณ์แบบ
                    </p>
                  </div>
                </div>

                {/* RIGHT VIEWFORM BASED ON ACTIVE SIDE-TAB */}
                <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-h-[580px] custom-scrollbar bg-white">
                  
                  {/* TAB 1: COMPANY PROFILE */}
                  {activeSideTab === 'profile' && (
                    <div className="space-y-6 animate-fadeIn">
                       <div className="border-b border-[#eaeaec] pb-3">
                          <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-wider">Company Registered Identity</h4>
                          <p className="text-[10.5px] text-slate-400 font-bold uppercase mt-0.5">Branding information and corporate registration for official headers</p>
                       </div>

                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#f8f9fa] p-5 rounded-2xl border border-[#eaeaec]">
                          {/* logo drag/drop */}
                          <div className="space-y-2 text-left">
                            <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">Logo File Stream</label>
                            <div 
                              onDragEnter={handleDrag}
                              onDragLeave={handleDrag}
                              onDragOver={handleDrag}
                              onDrop={handleDrop}
                              onClick={() => fileInputRef.current?.click()}
                              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all min-h-[110px] text-center ${
                                dragActive 
                                  ? 'border-[#3f809e] bg-[#3f809e]/5' 
                                  : 'border-slate-300 hover:border-[#b58c4f] bg-white'
                              }`}
                            >
                              <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                              />
                              <Upload size={16} className="text-[#3f809e]" />
                              <p className="text-[11px] font-black text-[#212c46]">Drag or Click logo</p>
                              <p className="text-[9px] text-slate-400 font-bold">Max size limit 500 KB</p>
                            </div>
                            <div className="flex justify-end">
                              <button 
                                onClick={resetLogoToDefault} 
                                type="button" 
                                className="text-[10px] font-black text-rose-700 uppercase hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={11} /> Reset to standard emblem
                              </button>
                            </div>
                          </div>

                          {/* Logo display */}
                          <div className="bg-[#f8f9fa] border border-[#eaeaec] p-4 rounded-xl flex items-center justify-center">
                             <div className="w-24 h-24 bg-white border rounded-xl flex items-center justify-center p-2.5 shadow-inner">
                               <img src={companyLogo} alt="Preview Logo" className="max-w-full max-h-full object-contain" />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Company Name (TH)</label>
                              <input
                                type="text"
                                value={companyNameTh}
                                onChange={(e) => setCompanyNameTh(e.target.value)}
                                className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Company Name (EN)</label>
                              <input
                                type="text"
                                value={companyNameEn}
                                onChange={(e) => setCompanyNameEn(e.target.value)}
                                className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Tax Sponsor Identifier (TAX ID)</label>
                              <input
                                type="text"
                                value={taxId}
                                onChange={(e) => setTaxId(e.target.value)}
                                className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Company Phone Numbers</label>
                              <input
                                type="text"
                                value={companyPhone}
                                onChange={(e) => setCompanyPhone(e.target.value)}
                                className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Corporate Registered Address (TH)</label>
                            <input
                              type="text"
                              value={companyAddressTh}
                              onChange={(e) => setCompanyAddressTh(e.target.value)}
                              className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Corporate Registered Address (EN)</label>
                            <input
                              type="text"
                              value={companyAddressEn}
                              onChange={(e) => setCompanyAddressEn(e.target.value)}
                              className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">E-mail Contact address</label>
                            <input
                              type="text"
                              value={companyEmail}
                              onChange={(e) => setCompanyEmail(e.target.value)}
                              className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                            />
                          </div>
                       </div>
                    </div>
                  )}

                  {/* TAB 2: ISO MULTI-PAGES */}
                  {activeSideTab === 'pages_iso' && (
                    <div className="space-y-6 animate-fadeIn">
                       <div className="border-b border-[#eaeaec] pb-3 flex justify-between items-center">
                          <div>
                            <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-wider">ISO Page Specifications</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Customize each sheet's metadata independently</p>
                          </div>
                          <button 
                            type="button" 
                            onClick={handleAddNewPage} 
                            className="px-3 py-1.5 bg-[#657f4d] hover:bg-[#4d6a36] text-white rounded-lg text-[10px] font-black uppercase flex items-center gap-1 transition-all"
                          >
                            <Plus size={12} /> Add Page
                          </button>
                       </div>

                       <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl overflow-x-auto">
                          {pages.map((p, idx) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setPreviewPageIndex(idx)}
                              className={`px-3 py-1.5 rounded-lg text-[10.5px] font-black uppercase shrink-0 flex items-center gap-1.5 ${
                                previewPageIndex === idx
                                  ? 'bg-white text-[#212c46] shadow-sm font-black'
                                  : 'text-slate-500 hover:bg-slate-200/50'
                              }`}
                            >
                              <span>หน้า {idx + 1}</span>
                              {pages.length > 1 && (
                                <X size={12} className="text-red-600 hover:bg-red-100 rounded-full" onClick={(e) => handleDeletePage(p.id, idx, e)} />
                              )}
                            </button>
                          ))}
                       </div>

                       {activePage && (
                         <div className="bg-[#f8f9fa] p-5 rounded-2xl border border-[#eaeaec] space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2">
                              <span className="text-[11px] font-black text-[#212c46] uppercase">&bull; Editing template parameters for {activePage.label}</span>
                              <span className="text-[9px] font-mono font-black text-[#7a8b95]">PAGE ID: {activePage.id}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                               <div>
                                  <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Page Tab Label (TH)</label>
                                  <input
                                    type="text"
                                    value={activePage.label}
                                    onChange={(e) => updatePageField(activePage.id, 'label', e.target.value)}
                                    className="w-full bg-white border border-[#eaeaec] rounded-lg px-2.5 py-1.5 text-[11.5px] font-bold text-[#212c46]"
                                  />
                               </div>

                               <div>
                                  <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Report Heading Title (EN)</label>
                                  <input
                                    type="text"
                                    value={activePage.reportTitle}
                                    onChange={(e) => updatePageField(activePage.id, 'reportTitle', e.target.value)}
                                    className="w-full bg-white border border-[#eaeaec] rounded-lg px-2.5 py-1.5 text-[11.5px] font-bold text-[#212c46]"
                                  />
                               </div>

                               <div>
                                  <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">ISO Document Code (Doc No.)</label>
                                  <input
                                    type="text"
                                    value={activePage.documentCode}
                                    onChange={(e) => updatePageField(activePage.id, 'documentCode', e.target.value)}
                                    className="w-full bg-white border border-[#eaeaec] rounded-lg px-2.5 py-1.5 text-[11.5px] font-bold text-[#212c46]"
                                  />
                               </div>

                               <div className="grid grid-cols-2 gap-2">
                                 <div>
                                    <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Revision No (Rev.)</label>
                                    <input
                                      type="text"
                                      value={activePage.revisionNo}
                                      onChange={(e) => updatePageField(activePage.id, 'revisionNo', e.target.value)}
                                      className="w-full bg-white border border-[#eaeaec] rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold text-[#212c46]"
                                    />
                                 </div>
                                 <div>
                                    <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Issue Date</label>
                                    <input
                                      type="date"
                                      value={activePage.issueDate}
                                      onChange={(e) => updatePageField(activePage.id, 'issueDate', e.target.value)}
                                      className="w-full bg-white border border-[#eaeaec] rounded-lg px-2 py-1 text-[11px] font-semibold text-[#212c46]"
                                    />
                                 </div>
                               </div>
                            </div>
                         </div>
                       )}
                    </div>
                  )}

                  {/* TAB 3: EVERYWHERE FONTS */}
                  {activeSideTab === 'fonts' && (
                    <div className="space-y-6 animate-fadeIn">
                       <div className="border-b border-[#eaeaec] pb-3">
                          <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-wider">Everywhere Font Scale Customizer</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Define font limits for every visual section on the page layout</p>
                       </div>

                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#f8f9fa] p-6 rounded-2xl border border-[#eaeaec]">
                          <div className="space-y-1 text-left">
                            <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">1. Company Title Point</label>
                            <div className="flex items-center gap-3">
                               <input
                                 type="range"
                                 min="12"
                                 max="24"
                                 value={fontCompany}
                                 onChange={(e) => setFontCompany(parseInt(e.target.value, 10))}
                                 className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#212c46]"
                               />
                               <span className="font-mono text-[11px] font-black text-[#212c46] shrink-0 w-8">{fontCompany}px</span>
                            </div>
                          </div>

                          <div className="space-y-1 text-left">
                            <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">2. ISO Meta Grid Point</label>
                            <div className="flex items-center gap-3">
                               <input
                                 type="range"
                                 min="8"
                                 max="14"
                                 value={fontMetaGrid}
                                 onChange={(e) => setFontMetaGrid(parseInt(e.target.value, 10))}
                                 className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#212c46]"
                               />
                               <span className="font-mono text-[11px] font-black text-[#212c46] shrink-0 w-8">{fontMetaGrid}px</span>
                            </div>
                          </div>

                          <div className="space-y-1 text-left">
                            <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">3. Main Report Title Point</label>
                            <div className="flex items-center gap-3">
                               <input
                                 type="range"
                                 min="12"
                                 max="24"
                                 value={fontReportTitle}
                                 onChange={(e) => setFontReportTitle(parseInt(e.target.value, 10))}
                                 className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#212c46]"
                               />
                               <span className="font-mono text-[11px] font-black text-[#212c46] shrink-0 w-8">{fontReportTitle}px</span>
                            </div>
                          </div>

                          <div className="space-y-1 text-left">
                            <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">4. Table Body Content Point</label>
                            <div className="flex items-center gap-3">
                               <input
                                 type="range"
                                 min="9"
                                 max="15"
                                 value={fontContent}
                                 onChange={(e) => setFontContent(parseInt(e.target.value, 10))}
                                 className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#212c46]"
                               />
                               <span className="font-mono text-[11px] font-black text-[#212c46] shrink-0 w-8">{fontContent}px</span>
                            </div>
                          </div>

                          <div className="space-y-1 text-left">
                            <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">5. Signature Box Titles Point</label>
                            <div className="flex items-center gap-3">
                               <input
                                 type="range"
                                 min="8"
                                 max="14"
                                 value={fontSignature}
                                 onChange={(e) => setFontSignature(parseInt(e.target.value, 10))}
                                 className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#212c46]"
                               />
                               <span className="font-mono text-[11px] font-black text-[#212c46] shrink-0 w-8">{fontSignature}px</span>
                            </div>
                          </div>

                          <div className="space-y-1 text-left">
                            <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">6. Printed Footer Text Point</label>
                            <div className="flex items-center gap-3">
                               <input
                                 type="range"
                                 min="7"
                                 max="12"
                                 value={fontFooter}
                                 onChange={(e) => setFontFooter(parseInt(e.target.value, 10))}
                                 className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#212c46]"
                               />
                               <span className="font-mono text-[11px] font-black text-[#212c46] shrink-0 w-8">{fontFooter}px</span>
                            </div>
                          </div>
                       </div>
                    </div>
                  )}

                  {/* TAB 4: SIGNATURES BOX */}
                  {activeSideTab === 'signatures' && (
                    <div className="space-y-6 animate-fadeIn">
                       <div className="border-b border-[#eaeaec] pb-3 flex justify-between items-center text-left">
                          <div>
                            <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-wider">ISO Sign-off configuration</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Control bottom signoff roles and display toggles</p>
                          </div>

                          <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                            <input 
                              type="checkbox" 
                              checked={activePage?.showSignatures} 
                              onChange={(e) => updatePageField(activePage.id, 'showSignatures', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-[#212c46]"></div>
                            <span className="ml-2 text-[11px] font-black text-[#212c46] uppercase tracking-wide">Enable signatures row</span>
                          </label>
                       </div>

                       {activePage?.showSignatures ? (
                         <div className="space-y-4 text-left">
                            <div className="p-4 bg-slate-50 border border-[#eaeaec] rounded-xl space-y-3">
                               <span className="text-[11px] font-black text-[#b58c4f] uppercase tracking-widest block">&bull; Role #1: Prepared By (ผู้จัดทำสารบัญ)</span>
                               <div className="grid grid-cols-2 gap-4">
                                  <div>
                                     <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Full Name</label>
                                     <input
                                       type="text"
                                       value={activePage.preparedByName}
                                       onChange={(e) => updatePageField(activePage.id, 'preparedByName', e.target.value)}
                                       className="w-full bg-white border border-[#eaeaec] rounded-lg px-2.5 py-1 text-[11.5px] font-semibold text-[#212c46]"
                                       placeholder="e.g. S. Phichamon"
                                     />
                                  </div>
                                  <div>
                                     <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Official Subtitle/Role</label>
                                     <input
                                       type="text"
                                       value={activePage.preparedByTitle}
                                       onChange={(e) => updatePageField(activePage.id, 'preparedByTitle', e.target.value)}
                                       className="w-full bg-white border border-[#eaeaec] rounded-lg px-2.5 py-1 text-[11.5px] font-semibold text-[#212c46]"
                                       placeholder="QA Document Controller"
                                     />
                                  </div>
                               </div>
                            </div>

                            <div className="p-4 bg-slate-50 border border-[#eaeaec] rounded-xl space-y-3">
                               <span className="text-[11px] font-black text-[#b58c4f] uppercase tracking-widest block">&bull; Role #2: Reviewed By (ผู้ทบทวนระบบ)</span>
                               <div className="grid grid-cols-2 gap-4">
                                  <div>
                                     <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Full Name</label>
                                     <input
                                       type="text"
                                       value={activePage.reviewedByName}
                                       onChange={(e) => updatePageField(activePage.id, 'reviewedByName', e.target.value)}
                                       className="w-full bg-white border border-[#eaeaec] rounded-lg px-2.5 py-1 text-[11.5px] font-semibold text-[#212c46]"
                                       placeholder="e.g. K. Anan"
                                     />
                                  </div>
                                  <div>
                                     <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Official Subtitle/Role</label>
                                     <input
                                       type="text"
                                       value={activePage.reviewedByTitle}
                                       onChange={(e) => updatePageField(activePage.id, 'reviewedByTitle', e.target.value)}
                                       className="w-full bg-white border border-[#eaeaec] rounded-lg px-2.5 py-1 text-[11.5px] font-semibold text-[#212c46]"
                                       placeholder="QA & Audit Manager"
                                     />
                                  </div>
                               </div>
                            </div>

                            <div className="p-4 bg-slate-50 border border-[#eaeaec] rounded-xl space-y-3">
                               <span className="text-[11px] font-black text-[#b58c4f] uppercase tracking-widest block">&bull; Role #3: Approved By (ผู้อนุมัติประเมินผล)</span>
                               <div className="grid grid-cols-2 gap-4">
                                  <div>
                                     <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Full Name</label>
                                     <input
                                       type="text"
                                       value={activePage.approvedByName}
                                       onChange={(e) => updatePageField(activePage.id, 'approvedByName', e.target.value)}
                                       className="w-full bg-white border border-[#eaeaec] rounded-lg px-2.5 py-1 text-[11.5px] font-semibold text-[#212c46]"
                                       placeholder="e.g. T. Somchai"
                                     />
                                  </div>
                                  <div>
                                     <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Official Subtitle/Role</label>
                                     <input
                                       type="text"
                                       value={activePage.approvedByTitle}
                                       onChange={(e) => updatePageField(activePage.id, 'approvedByTitle', e.target.value)}
                                       className="w-full bg-white border border-[#eaeaec] rounded-lg px-2.5 py-1 text-[11.5px] font-semibold text-[#212c46]"
                                       placeholder="Managing Director"
                                     />
                                  </div>
                               </div>
                            </div>
                         </div>
                       ) : (
                         <div className="p-8 text-center bg-[#f8f9fa] border-2 border-dashed border-[#eaeaec] rounded-2xl text-slate-400 font-bold uppercase text-[11px] tracking-widest">
                            กล่องเซ็นอนุญาตด้านล่างถูกปิดใช้งานอยู่บนรายงานแผ่นนี้
                         </div>
                       )}
                    </div>
                  )}

                  {/* TAB 5: PAPER SETTINGS */}
                  {activeSideTab === 'paper' && (
                    <div className="space-y-6 animate-fadeIn">
                       <div className="border-b border-[#eaeaec] pb-3 mb-1">
                          <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-wider">ส่วนที่ 5 : การตั้งค่ากระดาษ & ขอบกระดาษ (Paper Settings)</h4>
                          <p className="text-[10.5px] text-slate-400 font-bold uppercase mt-0.5">กำหนดขนาดระยะขอบของเอกสารเกณฑ์มาตรฐาน ISO</p>
                       </div>

                       <div className="bg-[#f8f9fa] p-5 rounded-2xl border border-[#eaeaec] space-y-6 text-left">
                          {/* Paper Size selector */}
                          <div>
                            <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-2">ขนาดกระดาษ (Paper Size/Scale)</label>
                            <div className="flex gap-3">
                              {['A4', 'Letter', 'A5'].map((sz) => (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() => setPaperSize(sz)}
                                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-[12px] font-black uppercase transition-all ${
                                    paperSize === sz
                                      ? 'border-[#212c46] bg-[#212c46] text-white shadow-md'
                                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                  }`}
                                >
                                  {sz} Standard Size
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Margins sliders */}
                          <div className="space-y-4">
                            <span className="block text-[11.5px] font-black text-[#7a8b95] uppercase tracking-widest">ระยะขอบกระดาษ (Document margins in mm)</span>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-slate-100">
                              {/* Margin Top */}
                              <div className="space-y-1">
                                <label className="block text-[10px] sm:text-[11px] font-extrabold text-slate-500 uppercase">ระยะขอบบน (Top Margin)</label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="range"
                                    min="0"
                                    max="40"
                                    value={marginTop}
                                    onChange={(e) => setMarginTop(parseInt(e.target.value, 10))}
                                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#212c46]"
                                  />
                                  <span className="font-mono text-[11px] font-black text-[#212c46] shrink-0 w-12">{marginTop} mm</span>
                                </div>
                              </div>

                              {/* Margin Bottom */}
                              <div className="space-y-1">
                                <label className="block text-[10px] sm:text-[11px] font-extrabold text-slate-500 uppercase">ระยะขอบล่าง (Bottom Margin)</label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="range"
                                    min="0"
                                    max="40"
                                    value={marginBottom}
                                    onChange={(e) => setMarginBottom(parseInt(e.target.value, 10))}
                                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#212c46]"
                                  />
                                  <span className="font-mono text-[11px] font-black text-[#212c46] shrink-0 w-12">{marginBottom} mm</span>
                                </div>
                              </div>

                              {/* Margin Left */}
                              <div className="space-y-1">
                                <label className="block text-[10px] sm:text-[11px] font-extrabold text-slate-500 uppercase">ระยะขอบซ้าย (Left Margin)</label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="range"
                                    min="0"
                                    max="40"
                                    value={marginLeft}
                                    onChange={(e) => setMarginLeft(parseInt(e.target.value, 10))}
                                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#212c46]"
                                  />
                                  <span className="font-mono text-[11px] font-black text-[#212c46] shrink-0 w-12">{marginLeft} mm</span>
                                </div>
                              </div>

                              {/* Margin Right */}
                              <div className="space-y-1">
                                <label className="block text-[10px] sm:text-[11px] font-extrabold text-slate-500 uppercase">ระยะขอบขวา (Right Margin)</label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="range"
                                    min="0"
                                    max="40"
                                    value={marginRight}
                                    onChange={(e) => setMarginRight(parseInt(e.target.value, 10))}
                                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#212c46]"
                                  />
                                  <span className="font-mono text-[11px] font-black text-[#212c46] shrink-0 w-12">{marginRight} mm</span>
                                </div>
                              </div>
                            </div>
                          </div>
                       </div>
                    </div>
                  )}

                  {/* TAB 6: CSV EXPORT EXTRAS */}
                  {activeSideTab === 'csv' && (
                    <div className="space-y-6 animate-fadeIn">
                       <div className="border-b border-[#eaeaec] pb-3 text-left">
                          <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-wider">Printed footer & exported extras</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Control CSV insertions and layout variables</p>
                       </div>

                       <div className="space-y-4 text-left">
                          <div>
                            <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Universal PDF Footer Text Note</label>
                            <input
                              type="text"
                              value={pdfFooterText}
                              onChange={(e) => setPdfFooterText(e.target.value)}
                              className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b58c4f]"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                             <label className="flex items-center gap-3 cursor-pointer p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl">
                                <input
                                  type="checkbox"
                                  checked={pdfShowPageNumbers}
                                  onChange={(e) => setPdfShowPageNumbers(e.target.checked)}
                                  className="rounded text-[#212c46] h-4.5 w-4.5"
                                />
                                <span className="text-[11.5px] font-black text-[#212c46] uppercase">Show Page Numbers</span>
                             </label>

                             <label className="flex items-center gap-3 cursor-pointer p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl">
                                <input
                                  type="checkbox"
                                  checked={pdfShowPrintDate}
                                  onChange={(e) => setPdfShowPrintDate(e.target.checked)}
                                  className="rounded text-[#212c46] h-4.5 w-4.5"
                                />
                                <span className="text-[11.5px] font-black text-[#212c46] uppercase">Stamp Live Date</span>
                             </label>
                          </div>

                          <div className="p-4 bg-emerald-50/20 rounded-xl border border-emerald-500/10 flex items-start gap-3 mt-4">
                             <FileSpreadsheet className="text-[#657f4d] shrink-0 mt-0.5" size={18} />
                             <div className="space-y-1 text-left">
                                <label className="flex items-center gap-2 cursor-pointer">
                                   <input
                                     type="checkbox"
                                     checked={csvIncludeMetadata}
                                     onChange={(e) => setCsvIncludeMetadata(e.target.checked)}
                                     className="rounded text-[#657f4d] h-4.5 w-4.5"
                                   />
                                   <span className="text-[11.5px] font-black text-[#212c46] uppercase">Insert 5 Grid Rows into exported CSV</span>
                                </label>
                                <p className="text-[11px] text-slate-500 font-bold leading-normal">
                                   แทรกรายละเอียดรหัสบริษัท ผู้จัดทำ และ Doc No. แยกตามหน้าไว้ที่ 5 บรรทัดบนสุดของไฟล์ตารางเปล่า ก่อนแสดงชุดแถวข้อมูลจริง
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Inline form save & action banner */}
              <div className="p-4 bg-slate-50 border-t border-[#eaeaec] flex justify-end gap-3 rounded-b-2xl md:col-span-12 w-full shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveMainTab('preview')}
                    className="px-6 py-2.5 bg-[#212c46] hover:bg-[#3f809e] text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Check size={14} /> SAVE & RETURN TO LIVE PREVIEW
                  </button>
                </div>
              </div>
            )}

        </div>
      </div>

    </div>
  );
}
