export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
  error?: string;
}
