import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { INITIAL_HALAL_CERTS } from '../pages/Certificates/Halal';
import { INITIAL_MS_CERTS } from '../pages/Certificates/Ms';

export interface NotificationItem {
  id: string;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  type: 'expiry' | 'task';
  dateStr: string;
  daysLeft?: number;
  read: boolean;
}

export interface GenericCert {
  id: string;
  name: string;
  nameTh?: string;
  supplier: string;
  expiryDate?: string;
  certNo?: string;
  type: 'halal' | 'ms';
}

interface NotificationContextType {
  notifications: NotificationItem[];
  halalCerts: any[];
  msCerts: any[];
  updateHalalCerts: (certs: any[]) => void;
  updateMsCerts: (certs: any[]) => void;
  addNotification: (item: Omit<NotificationItem, 'read'>) => void;
  toggleRead: (id: string) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  referenceDate: string; // YYYY-MM-DD
  setReferenceDate: (dateStr: string) => void;
  triggerExpiryCheck: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [halalCerts, setHalalCertsState] = useState<any[]>([]);
  const [msCerts, setMsCertsState] = useState<any[]>([]);
  const [referenceDate, setReferenceDateState] = useState<string>('2026-05-15');

  // Load registered certificates & initial notifications from localStorage or static files
  useEffect(() => {
    // Determine initial registered certs
    const cachedHalalObj = localStorage.getItem('smart_cert_halal_v1');
    const actualHalal = cachedHalalObj ? JSON.parse(cachedHalalObj) : INITIAL_HALAL_CERTS;
    setHalalCertsState(actualHalal);

    const cachedMsObj = localStorage.getItem('smart_cert_ms_v1');
    const actualMs = cachedMsObj ? JSON.parse(cachedMsObj) : INITIAL_MS_CERTS;
    setMsCertsState(actualMs);

    // Initial notifications check
    const cachedNotifs = localStorage.getItem('smart_cert_notifications_v1');
    if (cachedNotifs) {
      try {
        setNotifications(JSON.parse(cachedNotifs));
        return;
      } catch (e) {
        console.error("Failed to parse cached notifications", e);
      }
    }

    // Default notifications setup
    const initialReference = new Date('2026-05-15');
    const defaultNotifs: NotificationItem[] = [
      {
        id: 'task-1',
        title: 'Submit Halal Renewal Application',
        titleTh: 'ยื่นคำขอต่ออายุใบรับรองฮาลาล',
        description: 'Prepare documentation submission for Pure Palm Oil certificate renewal (Dept: Procurement).',
        descriptionTh: 'เตรียมความพร้อมของการยื่นเอกสารการยื่นต่ออายุของ Pure Palm Oil (ส่วนจัดซื้อ)',
        type: 'task',
        dateStr: '2026-05-20',
        daysLeft: 5,
        read: false
      },
      {
        id: 'task-2',
        title: 'MS Premium Audit Preparation',
        titleTh: 'เตรียมการตรวจประเมิน MS Premium Audit',
        description: 'Conduct internal QA audit check against regulatory directives.',
        descriptionTh: 'ดำเนินการตรวจสอบคุณภาพ QA ภายในตามภารกิจอย่างเป็นทางการตามข้อกำหนด',
        type: 'task',
        dateStr: '2026-05-28',
        daysLeft: 13,
        read: false
      }
    ];

    saveNotifications(defaultNotifs);
  }, []);

  const saveNotifications = (updated: NotificationItem[]) => {
    setNotifications(updated);
    localStorage.setItem('smart_cert_notifications_v1', JSON.stringify(updated));
  };

  const updateHalalCerts = (certs: any[]) => {
    setHalalCertsState(certs);
    localStorage.setItem('smart_cert_halal_v1', JSON.stringify(certs));
  };

  const updateMsCerts = (certs: any[]) => {
    setMsCertsState(certs);
    localStorage.setItem('smart_cert_ms_v1', JSON.stringify(certs));
  };

  const setReferenceDate = (dateStr: string) => {
    setReferenceDateState(dateStr);
  };

  const addNotification = (item: Omit<NotificationItem, 'read'>) => {
    // Avoid duplicates
    if (notifications.some(n => n.id === item.id)) return;
    const updated = [
      { ...item, read: false },
      ...notifications
    ];
    saveNotifications(updated);
  };

  const toggleRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: !n.read } : n);
    saveNotifications(updated);
  };

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  // The Expiry check engine
  const triggerExpiryCheck = () => {
    const refDate = new Date(referenceDate);
    const updatedNotifications = [...notifications];
    let changed = false;

    const evaluateCerts = (certsList: any[], type: 'halal' | 'ms') => {
      certsList.forEach(cert => {
        if (!cert.expiryDate) return;
        const exp = new Date(cert.expiryDate);
        const diffTime = exp.getTime() - refDate.getTime();
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const notifId = `expiry-${type}-${cert.id}`;
        const alreadyExists = updatedNotifications.some(n => n.id === notifId);

        // Notify if expiring in <= 30 days OR already expired
        if (days <= 30) {
          const title = type === 'halal' 
            ? `Halal Alert: ${cert.material || 'Material ID ' + cert.id}` 
            : `MS Standard Alert: ${cert.standardName || 'Standard ID ' + cert.id}`;
            
          const titleTh = type === 'halal'
            ? `แจ้งเตือนฮาลาล: ${cert.material || 'รหัสวัสดุ ' + cert.id}`
            : `แจ้งเตือนมาตรฐาน MS: ${cert.standardName || 'รหัสมาตรฐาน ' + cert.id}`;

          const isExpired = days <= 0;
          const statusTextEn = isExpired ? 'has expired' : 'is expiring soon';
          const statusTextTh = isExpired ? 'หมดอายุแล้ว' : 'กำลังจะหมดอายุเร็วๆ นี้';

          const description = `${type === 'halal' ? 'Halal Certificate' : 'MS Certificate'} (${cert.certNo || cert.id}) of ${cert.supplier} ${statusTextEn} (${days} days left).`;
          const descriptionTh = `ใบรับรอง${type === 'halal' ? 'ฮาลาล' : 'มาตรฐาน MS'} (${cert.certNo || cert.id}) ของ ${cert.supplier} ${statusTextTh} (เหลือเวลาอีก ${days} วัน)`;

          if (!alreadyExists) {
            updatedNotifications.unshift({
              id: notifId,
              title,
              titleTh,
              description,
              descriptionTh,
              type: 'expiry',
              dateStr: cert.expiryDate,
              daysLeft: days,
              read: false
            });
            changed = true;
          } else {
            // Update the days left if it changed
            const existingIdx = updatedNotifications.findIndex(n => n.id === notifId);
            if (existingIdx !== -1 && updatedNotifications[existingIdx].daysLeft !== days) {
              updatedNotifications[existingIdx] = {
                ...updatedNotifications[existingIdx],
                daysLeft: days,
                description,
                descriptionTh
              };
              changed = true;
            }
          }
        }
      });
    };

    // Load actual lists from state
    const currentHalal = halalCerts.length > 0 ? halalCerts : INITIAL_HALAL_CERTS;
    const currentMs = msCerts.length > 0 ? msCerts : INITIAL_MS_CERTS;

    evaluateCerts(currentHalal, 'halal');
    evaluateCerts(currentMs, 'ms');

    if (changed) {
      saveNotifications(updatedNotifications);
    }
  };

  // Real-time interval checks: runs every 5 seconds to query compliance levels
  useEffect(() => {
    triggerExpiryCheck();
    
    const interval = setInterval(() => {
      triggerExpiryCheck();
    }, 5000);

    return () => clearInterval(interval);
  }, [referenceDate, halalCerts, msCerts]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      halalCerts,
      msCerts,
      updateHalalCerts,
      updateMsCerts,
      addNotification,
      toggleRead,
      markAllRead,
      deleteNotification,
      clearAll,
      referenceDate,
      setReferenceDate,
      triggerExpiryCheck
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
