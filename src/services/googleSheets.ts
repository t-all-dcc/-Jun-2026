import { api } from './api';

/**
 * ตัวอย่างการเรียกใช้งาน API ฝั่ง Frontend เพื่อคุยกับ Google Apps Script
 *
 * สถาปัตยกรรม:
 * Frontend (React) ➔ fetch(VITE_APPS_SCRIPT_URL) ➔ Google Apps Script ➔ Google Sheets
 *
 * วิธีใช้งาน:
 * 1. นำ Google Apps Script URL ไปใส่ในไฟล์ .env
 *    VITE_APPS_SCRIPT_URL="https://script.google.com/macros/s/xxx/exec"
 * 2. เมื่อเรียกใช้งานจะมีการส่ง action, sheet, และ data ไปประมวลผล
 */
export const gasExampleService = {
  
  /**
   * 1. CREATE / INSERT: การเพิ่มข้อมูลใหม่ลงใน Sheet
   * action = 'write'
   */
  async createNewCertificate(certData: any) {
    console.log('Sending data to create:', certData);
    // API จะแปลงเป็นแอดข้อมูลลงบรรทัดใหม่
    return await api.post('write', 'Certificates_Master', certData);
  },

  /**
   * 2. READ: การดึงข้อมูลทั้งหมด หรือทำ Pagination
   * action = 'read'
   */
  async getCertificates(limit: number = 50, offset: number = 0) {
    console.log('Fetching certificates...');
    return await api.post('read', 'Certificates_Master', undefined, { limit, offset });
  },

  /**
   * 3. UPDATE: การอัปเดตข้อมูลที่มีอยู่แล้ว (ต้องแนบ ID ไปด้วยเสมอ)
   * action = 'update'
   */
  async updateCertStatus(certId: string, newStatus: string) {
    console.log('Updating cert status...', certId);
    const updatePayload = {
      id: certId, // ID ห้ามขาด เพราะ GAS จะ update ได้ต้องรู้ row id
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    return await api.post('update', 'Certificates_Master', [updatePayload]);
  },

  /**
   * 4. DELETE: การลบข้อมูล (ต้องแนบ ID)
   * action = 'delete'
   */
  async deleteCertificate(certId: string) {
    console.log('Deleting cert...', certId);
    return await api.post('delete', 'Certificates_Master', [{ id: certId }]);
  },

  /**
   * 5. LOOKUP: ค้นหาด้วยเงื่อนไขแบบเร็ว (ใช้งานฝั่ง GAS)
   * action = 'lookup'
   */
  async searchCertByDocumentNo(docNo: string) {
    return await api.post('lookup', 'Certificates_Master', [{ documentNo: docNo }]);
  }
};

