import React from 'react';

interface SkeletonLoadingProps {
  layout?: 'dashboard' | 'table' | 'form' | 'details' | 'calendar';
  rowCount?: number;
}

export default function SkeletonLoading({ layout = 'dashboard', rowCount = 5 }: SkeletonLoadingProps) {
  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-6">
      
      {/* 1. Header Skeleton */}
      <div className="flex justify-between items-center bg-transparent shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-[#eaeaec] flex items-center justify-center shrink-0 shadow-sm animate-pulse">
            <div className="w-5 h-5 rounded-md bg-slate-200"></div>
          </div>
          <div className="flex flex-col text-left space-y-1.5">
            <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
            <div className="h-3 w-80 bg-slate-100 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* 2. Layout Conditional Parts */}
      {layout === 'dashboard' && (
        <>
          {/* KPI Cards Skeleton System */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            {[1, 2, 3].map((idx) => (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-2xl border border-[#eaeaec] shadow-sm flex items-center justify-between relative overflow-hidden h-[104px]"
              >
                <div className="space-y-2 flex-1 text-left">
                  <div className="h-3 w-28 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-7 w-20 bg-slate-300 rounded animate-pulse"></div>
                  <div className="h-3 w-36 bg-slate-100 rounded animate-pulse"></div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center animate-pulse">
                  <div className="w-6 h-6 rounded bg-slate-200"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Table Skeleton Wrap */}
          <div className="bg-white rounded-2xl border border-[#eaeaec] shadow-sm overflow-hidden flex-1 flex flex-col">
            {/* Table Toolbar */}
            <div className="p-4 bg-white border-b border-[#eaeaec] flex flex-wrap justify-between items-center gap-3">
              <div className="h-9 w-64 bg-slate-100 rounded-xl animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-9 w-24 bg-slate-100 rounded-xl animate-pulse"></div>
                <div className="h-9 w-24 bg-slate-100 rounded-xl animate-pulse"></div>
              </div>
            </div>

            {/* Table Core */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#eaeaec] bg-slate-50">
                    {[1, 2, 3, 4, 5].map((hCol) => (
                      <th key={hCol} className="py-4 px-6 text-left">
                        <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Array.from({ length: rowCount }).map((_, rIdx) => (
                    <tr key={rIdx} className="hover:bg-gray-50/50">
                      <td className="py-3 px-6">
                        <div className="h-3.5 w-12 bg-slate-200 rounded animate-pulse"></div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="h-3.5 w-32 bg-slate-100 rounded animate-pulse"></div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse"></div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="h-3.5 w-20 bg-slate-200 rounded animate-pulse"></div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="h-3.5 w-16 bg-slate-100 rounded animate-pulse"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="py-3 px-6 bg-[#F0EAE1]/40 border-t-[1.5px] border-[#eaeaec] flex justify-between items-center">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
              <div className="flex gap-1.5">
                <div className="h-8 w-8 bg-slate-200 rounded-lg animate-pulse"></div>
                <div className="h-8 w-8 bg-slate-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </>
      )}

      {layout === 'table' && (
        <div className="bg-white rounded-2xl border border-[#eaeaec] shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="p-4 bg-white border-b border-[#eaeaec] flex flex-wrap justify-between items-center gap-3">
            <div className="h-9 w-64 bg-slate-100 rounded-xl animate-pulse"></div>
            <div className="h-9 w-24 bg-slate-100 rounded-xl animate-pulse"></div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#eaeaec] bg-slate-50">
                  {[1, 2, 4, 5].map((hCol) => (
                    <th key={hCol} className="py-4 px-6 text-left">
                      <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.from({ length: rowCount }).map((_, rIdx) => (
                  <tr key={rIdx}>
                    <td className="py-3 px-6"><div className="h-3.5 w-16 bg-slate-200 rounded animate-pulse"></div></td>
                    <td className="py-3 px-6"><div className="h-3.5 w-40 bg-slate-100 rounded animate-pulse"></div></td>
                    <td className="py-3 px-6"><div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse"></div></td>
                    <td className="py-3 px-6"><div className="h-3.5 w-12 bg-slate-200 rounded animate-pulse"></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {layout === 'form' && (
        <div className="bg-white p-8 rounded-2xl border border-[#eaeaec] shadow-sm space-y-6 text-left">
          <div className="space-y-4">
            <div className="h-4 w-36 bg-slate-200 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="h-3 w-20 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-slate-50 border border-[#eaeaec] rounded-xl animate-pulse"></div>
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-20 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-slate-50 border border-[#eaeaec] rounded-xl animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-20 bg-slate-100 rounded animate-pulse"></div>
              <div className="h-24 w-full bg-slate-50 border border-[#eaeaec] rounded-xl animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <div className="h-10 w-40 bg-slate-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      )}

      {layout === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-[#eaeaec] p-6 shadow-sm space-y-4">
              <div className="h-4 w-28 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-12 w-full bg-slate-50 rounded-xl animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-100 rounded animate-pulse"></div>
                <div className="h-3 w-5/6 bg-slate-100 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-[#eaeaec] p-6 shadow-sm space-y-4">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-24 w-full bg-slate-50 rounded-xl animate-pulse"></div>
              <div className="h-10 w-full bg-slate-100 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {layout === 'calendar' && (
        <div className="bg-white rounded-2xl border border-[#eaeaec] p-6 shadow-sm flex-1 flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-slate-100 rounded-lg animate-pulse"></div>
              <div className="h-8 w-16 bg-slate-100 rounded-lg animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 flex-1">
            {Array.from({ length: 35 }).map((_, idx) => (
              <div key={idx} className="h-20 bg-slate-50 border border-slate-100 rounded-xl p-1 shrink-0 animate-pulse flex flex-col justify-between">
                <div className="h-3 w-4 bg-slate-200 rounded"></div>
                <div className="h-3 w-10 bg-slate-100 rounded self-end"></div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
