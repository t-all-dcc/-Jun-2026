import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { EMPTY_EMPLOYEE } from './mockData';
import { THEME, Employee } from './types';
import { LucideIcon } from './LucideIcon';

const MySwal = withReactContent(Swal);

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  emp: Employee | null;
  onSave: (data: any) => void;
}

export function EmployeeModal({ isOpen, onClose, emp, onSave }: EmployeeModalProps) {
  const [modalStep, setModalStep] = useState(0);
  const [formData, setFormData] = useState<any>(EMPTY_EMPLOYEE);

  useEffect(() => {
    if (isOpen) {
      setModalStep(0);
      if (emp) {
        setFormData({ ...emp });
      } else {
        setFormData({ ...EMPTY_EMPLOYEE });
      }
    }
  }, [isOpen, emp]);

  if (!isOpen) return null;

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.staffId || !formData.nameTh || !formData.nameEn || !formData.dept || !formData.jobTitle) {
      Swal.fire({
        icon: 'warning',
        title: 'กรอกข้อมูลที่จำเป็นไม่ครบถ้วน',
        text: 'กรุณากรอก รหัสพนักงาน, ชื่อไทย-อังกฤษ, ฝ่าย และตำแหน่งงาน ให้ครบถ้วนในแถบประวัติ',
        confirmButtonColor: '#212c46'
      });
      return;
    }
    onSave(formData);
    onClose();
    MySwal.fire({
      icon: 'success',
      title: emp ? 'แก้ไขข้อมูลพนักงานสำเร็จ' : 'ขึ้นทะเบียนพนักงานใหม่สำเร็จ',
      html: `ประวัติคุณ <b>${formData.nameEn}</b> ได้รับรอบการปรับปรุงบนฐานข้อมูล SMART LAW เรียบร้อยแล้ว`,
      confirmButtonColor: '#212c46'
    });
  };

  const InputBlock = ({ label, name, type = "text", req = false }: any) => (
    <div>
      <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">
        {label} {req && <span className="text-[#932c2e]">*</span>}
      </label>
      <input 
        type={type} 
        value={formData[name] || ''} 
        onChange={e => handleFieldChange(name, e.target.value)}
        className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159]" 
      />
    </div>
  );

  const SelectBlock = ({ label, name, options, req = false }: any) => (
    <div>
      <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">
        {label} {req && <span className="text-[#932c2e]">*</span>}
      </label>
      <select 
        value={formData[name] || ''} 
        onChange={e => handleFieldChange(name, e.target.value)}
        className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b7a159]"
      >
        {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-[950px]"
      customHeader={
        <div className="bg-[#212c46] px-4 py-3 flex justify-between items-center shrink-0 border-b-2 border-[#b7a159]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-sm overflow-hidden">
              <Icons.Users size={18} className="text-[#b7a159]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#d7d7d7] uppercase tracking-widest leading-none mb-1">
                {emp ? 'EDIT PROFILE CARD' : 'REGISTER NEW STAFF'}
              </h3>
              <p className="text-[10px] font-bold text-[#b7a159]/90 uppercase tracking-widest mt-0.5">
                Corporate Employee Registry Node
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/70 hover:text-[#932c2e] transition-all bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
          >
            <Icons.X size={16} />
          </button>
        </div>
      }
    >
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#f8f9fa] min-h-[460px]">
        {/* Steps Navigator */}
        <div className="w-full md:w-56 bg-white border-b md:border-b-0 md:border-r border-[#eaeaec] flex flex-row md:flex-col shrink-0 flex-wrap sm:flex-nowrap">
          <div className="hidden md:block px-4 py-4 text-[10px] font-black text-[#7a8b95] uppercase tracking-widest border-b border-[#eaeaec] bg-[#f8f9fa]">
            Profile Segments
          </div>
          {[0, 1, 2, 3].map(step => (
            <button 
              key={step} 
              type="button"
              onClick={() => setModalStep(step)} 
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-left transition-all md:border-l-4 ${
                modalStep === step 
                  ? 'border-b-4 md:border-b-0 border-[#b7a159] bg-[#f8f9fa] text-[#212c46]' 
                  : 'border-transparent text-[#7a8b95] hover:bg-[#f8f9fa]/50'
              }`}
            >
              <LucideIcon 
                name={step === 0 ? 'User' : step === 1 ? 'Briefcase' : step === 2 ? 'MapPin' : 'GraduationCap'} 
                size={15} 
                color={modalStep === step ? THEME.brightGold : undefined} 
              />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
                STEP {step + 1}: {step === 0 ? 'BASIC INFO' : step === 1 ? 'WORK INFO' : step === 2 ? 'CONTACT' : 'BACKGROUND'}
              </span>
            </button>
          ))}
          
          {/* Img Box sidebar view */}
          <div className="hidden md:block p-4 mt-auto border-t border-[#eaeaec]">
            <div className="w-full aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-[#eaeaec] relative overflow-hidden group flex flex-col items-center justify-center text-center">
              {formData.image ? (
                <img src={formData.image} className="w-full h-full object-cover" alt="Staff Portrait" />
              ) : (
                <div className="p-3 text-slate-300">
                  <Icons.Camera size={28} className="mx-auto" />
                  <span className="text-[9px] font-black uppercase tracking-widest block mt-2 text-[#7a8b95]">UPLOAD PICTURE</span>
                </div>
              )}
              <button 
                type="button"
                onClick={() => {
                  MySwal.fire({
                    title: 'กำหนดลิ้งก์ภาพพนักงาน / Photo URL',
                    input: 'url',
                    inputPlaceholder: 'https://images.unsplash.com/photo-...',
                    inputValue: formData.image || '',
                    showCancelButton: true,
                    confirmButtonText: 'ยืนยันรูปภาพ',
                    confirmButtonColor: '#212c46'
                  }).then(res => {
                    if (res.isConfirmed && res.value) {
                      handleFieldChange('image', res.value);
                    }
                  });
                }}
                className="absolute inset-0 bg-[#212c46]/80 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity uppercase text-[9px] font-black tracking-widest gap-1"
              >
                <Icons.UploadCloud size={18} /> Update Image
              </button>
            </div>
          </div>
        </div>

        {/* Step contents */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
          {modalStep === 0 && (
            <div className="space-y-4 max-w-2xl animate-fadeIn">
              <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest border-b-2 border-slate-100 pb-2 mb-4">
                ข้อมูลเบื้องต้นพนักงาน (Basic Personal Data)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputBlock label="รหัสพนักงาน / Staff ID" name="staffId" req />
                <InputBlock label="ชื่อทางการคู่เอกสาร (ภาษาไทย)" name="nameTh" req />
                <InputBlock label="Fullname (English Documented)" name="nameEn" req />
                <InputBlock label="ชื่อเล่นพนักงาน (Nick Name)" name="nickName" />
                <SelectBlock label="เพศโดยโครงสร้าง (Gender)" name="gender" options={['Male', 'Female', 'Other']} />
                <InputBlock label="เลขบัตรประจำตัวประชาชน / ID Card" name="idCard" req />
                <InputBlock label="วัน/เดือน/ปีเกิด (Birth Date)" name="birthDate" type="date" />
                <div className="grid grid-cols-2 gap-2">
                  <InputBlock label="อายุ (Age)" name="age" type="number" />
                  <InputBlock label="สัญชาติ" name="nationality" />
                </div>
                <SelectBlock label="ศาสนา (Religion)" name="religion" options={['Buddhism', 'Christianity', 'Islam', 'Other']} />
                <SelectBlock label="สถานภาพสมรส" name="marital" options={['Single', 'Married', 'Divorced']} />
              </div>
            </div>
          )}

          {modalStep === 1 && (
            <div className="space-y-4 max-w-2xl animate-fadeIn">
              <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest border-b-2 border-slate-100 pb-2 mb-4">
                สถานะการทำงานและแผนกสังกัด (Employment Assignments)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectBlock label="สำนักงานประจำการ / Office Branch" name="office" options={['Headquarters', 'Factory A', 'Warehouse B']} req />
                <SelectBlock label="สังกัดฝ่าย / Dept" name="dept" options={['Human Resources', 'Information Technology', 'Quality Assurance', 'Production', 'Warehouse & Logistics']} req />
                <InputBlock label="กลุ่ม/สายงานวิกฤต (Section)" name="section" />
                <InputBlock label="ตำแหน่งงานทางการ (Job Title)" name="jobTitle" req />
                <SelectBlock label="รูปแบบการจ้าง" name="jobStatus" options={['Permanent', 'Probation', 'Contract', 'Intern']} />
                <InputBlock label="วันเริ่มจ้างงาน (Hiring Date)" name="hiringDate" type="date" req />
                <InputBlock label="วันที่มีผลบังคับใช้รอบสิทธิ์ (Eff Date)" name="effDate" type="date" />
                <InputBlock label="อายุงาน ณ ปัจจุบัน (YOS)" name="yos" />
                <SelectBlock label="สถานะการประจำการ / Status" name="workStatus" options={['Active', 'Resigned', 'Suspended']} req />
              </div>

              <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest border-b-2 border-slate-100 pb-2 mt-6 mb-4">
                สวัสดิการ บัญชีรับรายได้ และประกันสังคง
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectBlock label="ประกันสังคม / Social Security" name="socialSec" options={['Active', 'Pending', 'N/A']} />
                <SelectBlock label="ธนาคารรับพาสยอด" name="bank" options={['KBank', 'SCB', 'BBL', 'KTB', 'Krungsri']} />
                <InputBlock label="เลขบัญชีธนาคารพนักงาน" name="bankAcc" />
              </div>

              {formData.workStatus === 'Resigned' && (
                <div className="space-y-4 border-l-2 border-[#932c2e] pl-4 mt-6">
                  <h4 className="text-[12.4px] font-black text-[#932c2e] uppercase tracking-widest">
                    ข้อมูลการลาออกจากงาน / Termination Nodes
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <InputBlock label="วันสุดท้ายของการทำงาน" name="termination" type="date" />
                    <div>
                      <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5 font-bold">
                        เหตุผลการยุติบทบาทการทำงาน
                      </label>
                      <textarea 
                        value={formData.reason || ''} 
                        onChange={e => handleFieldChange('reason', e.target.value)}
                        className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-4 py-2 text-[12px] font-bold text-[#212c46] h-16 outline-none focus:border-[#b7a159]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {modalStep === 2 && (
            <div className="space-y-4 max-w-2xl animate-fadeIn">
              <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest border-b-2 border-slate-100 pb-2 mb-4">
                ช่องทางติดต่อพนักงาน (Address & Contacts Route)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputBlock label="เบอร์โทรศัพท์ติดต่อพนักงาน / Mobile" name="phone" req />
                <InputBlock label="ที่อยู่อีเมลประสานงาน (Corporate Email)" name="email" type="email" />
              </div>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">
                    ที่อยู่ตามระเบียนบัตรประชาชน (Document ID Address) *
                  </label>
                  <textarea 
                    value={formData.addressId || ''} 
                    onChange={e => handleFieldChange('addressId', e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-4 py-3 text-[12px] font-bold text-[#212c46] h-16 outline-none focus:border-[#b7a159]"
                    placeholder="ระบุบ้านเลขที่ ซอย ถนน แขวง/ตำบล เขต/อำเภอ และจังหวัด..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5 shadow-sm">
                    ที่อยู่ที่ใช้พักพิงประจำการจริงปัจจุบัน (Current Present Address) *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button 
                      type="button" 
                      onClick={() => handleFieldChange('addressPres', 'Same as ID')}
                      className="px-3 py-1 bg-slate-100 border border-slate-200 text-[#212c46] hover:bg-slate-200 rounded-lg text-[9.5px] font-black uppercase tracking-widest cursor-pointer"
                    >
                      ใช้ที่อยู่เดียวกันกับบัตรประชาชน
                    </button>
                  </div>
                  <textarea 
                    value={formData.addressPres || ''} 
                    onChange={e => handleFieldChange('addressPres', e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-4 py-3 text-[12px] font-bold text-[#212c46] h-16 outline-none focus:border-[#b7a159]"
                    placeholder="ที่อยู่ปัจจุบัน..."
                  />
                </div>
              </div>
            </div>
          )}

          {modalStep === 3 && (
            <div className="space-y-4 max-w-2xl animate-fadeIn">
              <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest border-b-2 border-slate-100 pb-2 mb-4">
                ประวัติการศึกษา ประวัติทหาร และข้อมูลฉุกเฉิน (Credentials & Disaster Plan)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectBlock label="ระดับการศึกษาสูงสุด / Edu Level" name="education" options={['High School', 'Vocational', 'Bachelor Degree', 'Master Degree', 'PhD']} />
                <InputBlock label="สาขาวิชาและสถาบันหลัก (Major / Minor)" name="major" />
                <SelectBlock label="ใบขับขี่ใบอนุญาตขับรถ (Driving)" name="driving" options={['Car License', 'Motorcycle License', 'Both', 'None']} />
                <SelectBlock label="ระเบียบบริการทหาร (สำหรับบุรุษ)" name="military" options={['Completed', 'Exempted', 'Not Yet', 'N/A']} />
                <SelectBlock label="กรุ๊ปเลือดพนักงาน (Blood Type)" name="blood" options={['A', 'B', 'AB', 'O']} />
                <InputBlock label="โรคประจำตัว หรือประวัติแพ้ยาป้อน" name="health" />
                <InputBlock label="ผู้ติดต่อกรณีฉุกเฉิน (Emergency Target Name)" name="emerContact" req />
                <InputBlock label="เบอร์ติดต่อกรณีฉุกเฉิน / Phone" name="emerPhone" req />
              </div>

              <div className="p-4 bg-[#fcf4f2] border border-[#eedbe2] rounded-2xl flex items-start gap-3 mt-4">
                <Icons.ShieldCheck className="text-[#a94228] shrink-0 mt-0.5" size={18} />
                <p className="text-[11.5px] text-[#7a8b95] font-bold leading-relaxed">
                  การปรับเปลี่ยนประวัติพนักงานดิจิทัลมีผลกระทบแบบ Real-time ตารางความปลอดภัยพนักงาน PDPA และกำหนดการสิทธิ์การจ่ายกะพนักงานของ ชัยศรีอะโกรอินดัสเทรียล ทุกจุดอย่างถูกต้อง
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions Footer */}
      <div className="px-6 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
        <button 
          type="button"
          onClick={onClose} 
          className="px-5 py-2 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button 
          type="button"
          onClick={handleSave} 
          className="bg-[#212c46] text-white px-6 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all flex items-center gap-2 cursor-pointer"
        >
          <Icons.Save size={14}/> Save Profile
        </button>
      </div>
    </DraggableModal>
  );
}
