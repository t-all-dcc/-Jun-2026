import React from 'react';
import * as Icons from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

interface EmployeeStatsProps {
  totalHeadcount: number;
  departmentCounts: Array<{ name: string; value: number }>;
  t: (en: string, th?: string) => string;
}

const CHART_COLORS = [
  '#254268', // Deep corporate Navy
  '#b58c4f', // Warm golden
  '#5f7ab7', // Sky Blue accent
  '#a73527', // Alert contrast
  '#657f4d', // Soft Sage Green
  '#748ea1', // Clean Slate
];

export function EmployeeStats({ totalHeadcount, departmentCounts, t }: EmployeeStatsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-3 shrink-0">
      {/* Department Pie Chart */}
      <div className="lg:col-span-1 bg-white rounded-3xl p-5 border border-[#eaeaec] shadow-sm flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-black text-[#212c46] uppercase tracking-wider mb-1 flex items-center gap-2">
            <Icons.BarChart2 size={16} className="text-[#3f809e]" /> {t('Headcount by Department')}
          </h4>
          <p className="text-[9px] text-[#748ea1] font-black uppercase tracking-widest mb-4">
            {t('Departmental staff distribution')}
          </p>
        </div>
        <div className="h-48 flex items-center justify-center">
          {departmentCounts.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={departmentCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {departmentCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <span className="text-xs text-slate-400 font-bold uppercase">{t('No headcount statistics')}</span>
          )}
        </div>
      </div>

      {/* Department Presence Density Bars */}
      <div className="lg:col-span-2 bg-gradient-to-br from-white to-[#f3f3f1] rounded-3xl p-5 border border-[#eaeaec] shadow-sm flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-black text-[#212c46] uppercase tracking-wider mb-1 flex items-center gap-2">
            <Icons.CheckCircle2 size={16} className="text-[#657f4d]" /> {t('Departmental Presence Density')}
          </h4>
          <p className="text-[9px] text-[#748ea1] font-black uppercase tracking-widest mb-4">
            {t('Rostered personnel count by specific active teams')}
          </p>
        </div>
        <div className="space-y-3">
          {departmentCounts.map((item, i) => {
            const percentage = totalHeadcount > 0 ? Math.round((item.value / totalHeadcount) * 100) : 0;
            return (
              <div key={i} className="flex items-center gap-4 group/bar">
                <div className="w-32 text-[9px] font-black text-[#435665] uppercase truncate tracking-tight">
                  {item.name || 'Unassigned'}
                </div>
                <div className="flex-1 h-3.5 rounded-lg relative flex items-center bg-slate-200/50 shadow-inner overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000 relative z-10 rounded-lg"
                    style={{ width: `${percentage}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} 
                  />
                </div>
                <div className="w-16 text-right">
                  <span className="text-[10px] font-black text-[#212c46]">
                    {item.value} ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
