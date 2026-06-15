import React from 'react';
import { 
  PieChart as PieChartIcon, Activity, AlertTriangle, ShieldCheck, 
  TrendingUp, RefreshCcw, Download, Calendar
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Sector, Cell as PieCell, Legend, LineChart, Line
} from 'recharts';

export default function ComplianceDashboard() {
  const complianceScoreData = [
    { name: 'Compliant', value: 85, color: '#657f4d' },
    { name: 'At Risk', value: 10, color: '#d09653' },
    { name: 'Non-Compliant', value: 5, color: '#932c2e' },
  ];

  const trendData = [
    { month: 'Jan', compliance: 78, alerts: 12 },
    { month: 'Feb', compliance: 82, alerts: 8 },
    { month: 'Mar', compliance: 85, alerts: 5 },
    { month: 'Apr', compliance: 83, alerts: 7 },
    { month: 'May', compliance: 88, alerts: 3 },
    { month: 'Jun', compliance: 85, alerts: 5 },
  ];

  const supplierData = [
    { name: 'Supplier A', rate: 100, color: '#657f4d' },
    { name: 'Supplier B', rate: 90, color: '#657f4d' },
    { name: 'Supplier C', rate: 75, color: '#d09653' },
    { name: 'Supplier D', rate: 60, color: '#932c2e' },
  ];

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* Header */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#212c46] border border-[#eaeaec] shadow-sm flex items-center justify-center relative overflow-hidden shrink-0">
             <PieChartIcon size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-[24px] font-black text-[#212c46] uppercase tracking-widest leading-none">
              COMPLIANCE <span className="text-[#a3acbe]">DASHBOARD</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5"><div className="w-8 h-[2px] bg-[#212c46]"></div><p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest leading-none">Overall Compliance Metrics and Reporting</p></div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-5 rounded-xl bg-white border border-[#eaeaec] text-[#212c46] text-[12px] font-bold uppercase hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-all">
             <Calendar size={16} /> Last 6 Months
          </button>
          <button className="h-10 px-5 rounded-xl bg-[#212c46] text-white text-[12px] font-bold uppercase hover:bg-[#1d2636] shadow-md flex items-center gap-2 transition-all">
             <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
         {/* KPI Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-[24px] border border-[#eaeaec] p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5"><Activity size={100} /></div>
                <div>
                   <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mb-1">Overall Compliance Rate</p>
                   <h3 className="text-4xl font-black text-[#212c46]">85<span className="text-xl text-[#7a8b95]">%</span></h3>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[#657f4d] text-[11px] font-bold uppercase tracking-wider">
                   <TrendingUp size={14} /> +2% From Last Month
                </div>
            </div>

            <div className="bg-white rounded-[24px] border border-[#eaeaec] p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5"><ShieldCheck size={100} /></div>
                <div>
                   <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mb-1">Active Certificates</p>
                   <h3 className="text-4xl font-black text-[#212c46]">142</h3>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[#212c46] text-[11px] font-bold uppercase tracking-wider opacity-60">
                   Across 12 Facilities
                </div>
            </div>

            <div className="bg-white rounded-[24px] border border-[#eaeaec] p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5 text-[#d09653]"><RefreshCcw size={100} /></div>
                <div>
                   <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mb-1">Pending Renewals</p>
                   <h3 className="text-4xl font-black text-[#d09653]">18</h3>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[#d09653] text-[11px] font-bold uppercase tracking-wider">
                   Action Required
                </div>
            </div>

            <div className="bg-white rounded-[24px] border border-[#eaeaec] p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5 text-[#932c2e]"><AlertTriangle size={100} /></div>
                <div>
                   <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mb-1">Critical Expirations</p>
                   <h3 className="text-4xl font-black text-[#932c2e]">4</h3>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[#932c2e] text-[11px] font-bold uppercase tracking-wider">
                   Requires Immediate Attention
                </div>
            </div>
         </div>

         {/* Charts Row */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
             {/* Chart 1 */}
             <div className="bg-white rounded-[24px] border border-[#eaeaec] p-6 shadow-sm flex flex-col h-full lg:col-span-1">
                 <h3 className="text-[14px] font-black uppercase tracking-widest text-[#212c46] mb-6 flex items-center gap-2">
                    <PieChartIcon size={16} className="text-[#a94228]"/> Compliance Status Distribution
                 </h3>
                 <div className="flex-1 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={complianceScoreData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {complianceScoreData.map((entry, index) => (
                            <PieCell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                           contentStyle={{ borderRadius: '12px', border: '1px solid #eaeaec', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Legend 
                           verticalAlign="bottom" 
                           height={36} 
                           iconType="circle"
                           formatter={(value) => <span className="text-[11px] font-bold text-[#212c46] uppercase tracking-widest">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
             </div>

             {/* Chart 2 */}
             <div className="bg-white rounded-[24px] border border-[#eaeaec] p-6 shadow-sm flex flex-col h-full lg:col-span-2">
                 <h3 className="text-[14px] font-black uppercase tracking-widest text-[#212c46] mb-6 flex items-center gap-2">
                    <TrendingUp size={16} className="text-[#a94228]"/> Compliance Trend & Alerts
                 </h3>
                 <div className="flex-1 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaec" />
                        <XAxis 
                           dataKey="month" 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{ fontSize: 10, fontWeight: 'bold', fill: '#7a8b95' }}
                           dy={10}
                        />
                        <YAxis 
                           yAxisId="left"
                           axisLine={false} 
                           tickLine={false} 
                           tick={{ fontSize: 10, fontWeight: 'bold', fill: '#7a8b95' }}
                        />
                        <YAxis 
                           yAxisId="right" 
                           orientation="right" 
                           axisLine={false} 
                           tickLine={false} 
                           tick={false}
                        />
                        <Tooltip 
                           contentStyle={{ borderRadius: '12px', border: '1px solid #eaeaec', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Line yAxisId="left" type="monotone" dataKey="compliance" name="Compliance Rate %" stroke="#212c46" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                        <Line yAxisId="right" type="monotone" dataKey="alerts" name="Total Alerts" stroke="#a94228" strokeWidth={2} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}
