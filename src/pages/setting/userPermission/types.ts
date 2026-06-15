export interface User {
  id: number;
  name: string;
  position: string;
  email: string;
  avatar: string;
  isDev?: boolean;
  permissions: Record<string, number[]>;
}

export const THEME = {
  bgMain: '#f3f3f1',
  bgGradient: 'transparent',
  sidebarBg: 'linear-gradient(180deg, #1d2636 0%, #0F172A 100%)',
  glassWhite: 'rgba(255, 255, 255, 0.88)',
  primary: '#1e3347',
  primaryLight: '#899fbc',
  accent: '#cb5d3d',
  gold: '#b48b21',
  brightGold: '#babe77',
  success: '#53694d',
  danger: '#b00303',
  skyBlue: '#7397ab',
  dustyBlue: '#798a9a',
  indigo: '#405974',
  softPurple: '#ceb2bd',
  deepPurple: '#572e54',
  pinkAccent: '#bc6868',
  mutedSlate: '#b0b6ac',
  darkSlate: '#565c66',
  silver: '#d9dddd',
  deepNavy: '#1e3347',
  brownGold: '#bd7729',
  vibrantPurple: '#34283f',
  burntOrange: '#c2613a',
  slateBlue: '#4d6778',
  coolGray: '#dbdad6'
};

export const PERMISSION_LEVELS = [
  { level: 0, label: 'No Access', icon: 'ban', color: THEME.dustyBlue, bg: '#eaeaec' },
  { level: 1, label: 'Viewer', icon: 'eye', color: THEME.skyBlue, bg: '#eaeaec' },
  { level: 2, label: 'Editor', icon: 'edit', color: THEME.accent, bg: '#d9624540' },
  { level: 3, label: 'Verifier', icon: 'check-square', color: THEME.indigo, bg: '#7a8b95' },
  { level: 4, label: 'Approver', icon: 'award', color: THEME.success, bg: '#657f4d40' },
];
