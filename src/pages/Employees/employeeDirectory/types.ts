export interface Employee {
  id: number;
  staffId: string;
  employeeId?: string;
  nameTh: string;
  nameEn: string;
  name: string;
  nickName?: string;
  image?: string;
  avatar?: string;
  office: string;
  dept: string;
  department?: string;
  section?: string;
  jobTitle: string;
  position?: string;
  jobStatus: string;
  workStatus: string;
  status?: string;
  effDate?: string;
  hiringDate?: string;
  hireDate?: string;
  yos?: string;
  idCard: string;
  socialSec: string;
  gender: string;
  birthDate?: string;
  age?: number | string;
  ageHiring?: number;
  nationality?: string;
  religion?: string;
  marital?: string;
  kids?: number;
  military?: string;
  driving?: string;
  email?: string;
  phone?: string;
  addressId?: string;
  addressPres?: string;
  emerContact?: string;
  emerPhone?: string;
  blood?: string;
  health?: string;
  education?: string;
  major?: string;
  bank?: string;
  bankAcc?: string;
  termination?: string;
  reason?: string;
}

export const THEME = {
  bgMain: '#f3f3f1',
  bgGradient: 'transparent',
  sidebarBg: 'linear-gradient(180deg, #1d2636 0%, #0F172A 100%)',
  glassWhite: 'rgba(255, 255, 255, 0.88)',
  primary: '#212c46',
  primaryLight: '#4d87a8',
  accent: '#a94228',
  gold: '#b58c4f',
  brightGold: '#b7a159',
  success: '#657f4d',
  danger: '#932c2e',
  skyBlue: '#3f809e',
  dustyBlue: '#7a8b95',
  indigo: '#414757',
  softPurple: '#ab7d82',
  deepPurple: '#2d2c4a',
  pinkAccent: '#a54f6b',
  mutedSlate: '#606a5f',
  darkSlate: '#2f2926',
  silver: '#d7d7d7',
  deepNavy: '#212c46',
  brownGold: '#b58c4f',
  vibrantPurple: '#2d2c4a',
  burntOrange: '#d96245',
  slateBlue: '#748ea1',
  coolGray: '#eaeaec'
};
