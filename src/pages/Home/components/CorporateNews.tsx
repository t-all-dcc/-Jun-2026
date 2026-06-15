import React, { useState } from 'react';
import { Globe, Plus, ChevronRight, User, Image as ImageIcon, Link, UploadCloud } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { DraggableModal } from '../../../components/shared/DraggableModal';

export const CorporateNews = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<any>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAllNewsModalOpen, setIsAllNewsModalOpen] = useState(false);
    
    const initialNews = [
      { category: 'COMPLIANCE UPDATE', title: 'ประกาศผลการประเมิน ISO 9001:2015 ล่าสุด', date: '08 May 2026', preview: 'ผลการตรวจติดตามมาตรฐานคุณภาพในไตรมาสแรก ผ่านเกณฑ์ ขอบคุณทุกฝ่ายที่ช่วย...', fullText: 'ผลการตรวจติดตามมาตรฐานคุณภาพในไตรมาสแรก ผ่านเกณฑ์ ขอบคุณทุกฝ่ายที่ให้ความร่วมมือในการทำงานอย่างเต็มที่ ระบบมีประสิทธิภาพและเป็นไปตามข้อกำหนด', author: 'QM OFFICE', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800' },
      { category: 'HR ANNOUNCEMENT', title: 'อัปเดตเกณฑ์มาตรฐานใหม่', date: '05 May 2026', preview: 'เกณฑ์การปฏิบัติงานฉบับใหม่ เริ่มบังคับใช้ปลายปีนี้ โปรดศึกษารายละเอียด...', fullText: 'เกณฑ์การปฏิบัติงานฉบับใหม่ เริ่มบังคับใช้ปลายปีนี้ โปรดศึกษารายละเอียดและเตรียมความพร้อมสำหรับการเปลี่ยนแปลงที่จะเกิดขึ้น', author: 'HR TEAM', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800' },
      { category: 'TRAINING', title: 'เชิญร่วมอบรม Document Control', date: '01 May 2026', preview: 'เรียนรู้ระบบจัดการเอกสารใหม่ พร้อมขั้นตอนการตั้งค่า Version Control...', fullText: 'เรียนรู้ระบบจัดการเอกสารใหม่ พร้อมขั้นตอนการตั้งค่า Version Control สำหรับพนักงานทุกคนที่เกี่ยวข้องในการจัดการเอกสาร', author: 'COMPLIANCE TEAM', image: 'https://images.unsplash.com/photo-1511632765486-a01c80cf59af?q=80&w=800' },
    ];
    
    const [newsList, setNewsList] = useState(initialNews);
    
    const [newUpdate, setNewUpdate] = useState({ category: '', title: '', preview: '', fullText: '', author: 'CURRENT USER', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800' });
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');

    const openNews = (n: any) => {
      setSelectedNews(n);
      setIsModalOpen(true);
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setNewUpdate(prev => ({ ...prev, image: url }));
        }
    };
    
    const handleAddUpdate = () => {
        const dateObj = new Date();
        const dateStr = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        
        setNewsList([{
            ...newUpdate,
            date: dateStr,
        }, ...newsList]);
        
        setIsAddModalOpen(false);
        setNewUpdate({ category: '', title: '', preview: '', fullText: '', author: 'CURRENT USER', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800' });
    };

    return (
      <>
      <GlassCard className="bg-white border-[#f3f3f1] col-span-1 lg:col-span-2 flex flex-col relative overflow-hidden">
        <div className="absolute left-[35%] top-[-30%] opacity-[0.02] pointer-events-none transform rotate-12 z-0">
          <Globe size={380} />
        </div>
        <div className="flex justify-between items-center mb-6 relative z-10 font-sans">
          <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
            <Globe size={16} className="text-[#3f809e]" /> CORPORATE NEWS BOARD
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setIsAddModalOpen(true)} className="text-[10px] font-black text-white bg-gradient-to-r from-[#d96245] to-[#b7a159] hover:from-[#c25035] hover:to-[#a38e4a] px-4 py-2 rounded-lg uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5 outline-none hover:scale-105 active:scale-95 border border-[#d96245]/20 cursor-pointer">
              <Plus size={14} /> ADD UPDATE
            </button>
            <button onClick={() => setIsAllNewsModalOpen(true)} className="text-[10px] font-black text-[#212c46] bg-white px-4 py-2 rounded-lg uppercase tracking-widest border border-[#f3f3f1] hover:bg-[#f3f3f1] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3f809e] cursor-pointer">ALL</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {newsList.slice(0, 3).map((n, i) => (
            <div key={i} onClick={() => openNews(n)} className="flex flex-col bg-white border border-[#f3f3f1] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1">
              <div className="relative h-36 w-full overflow-hidden">
                <img src={n.image} alt={n.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                   <span className="text-[9px] font-black text-white uppercase tracking-widest bg-[#3f809e] px-2.5 py-1 rounded-md shadow-sm">{n.category}</span>
                   <span className="text-white/90 text-[10px] font-bold tracking-wider drop-shadow-md">{n.date}</span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-[#212c46] font-bold text-sm mb-2 line-clamp-2 leading-snug group-hover:text-[#3f809e] transition-colors">{n.title}</h3>
                <p className="text-[#7a8b95] text-[11px] font-medium line-clamp-2 leading-relaxed flex-1">{n.preview}</p>
                <div className="mt-4 pt-3 border-t border-[#f3f3f1] flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#a0abb2] uppercase tracking-widest flex items-center gap-1.5"><User size={10}/> {n.author}</span>
                  <div className="flex items-center gap-1 text-[10px] font-black text-[#d96245] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-300">
                    READ <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#212c46] tracking-widest flex items-center gap-2"><Globe size={16} className="text-[#3f809e]"/> Certification News</span>}
        width="max-w-2xl"
      >
        <div className="p-0 overflow-hidden flex flex-col max-h-[85vh]">
          {selectedNews && (
             <>
                <div className="relative h-48 w-full shrink-0">
                   <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-[#3f809e] px-3 py-1 rounded-md shadow-sm">{selectedNews.category}</span>
                        <span className="text-white/80 text-xs font-bold">{selectedNews.date}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">{selectedNews.title}</h2>
                   </div>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="whitespace-pre-wrap text-[#4a5568] text-sm leading-relaxed mb-8">
                    {selectedNews.fullText}
                  </div>
                  <div className="bg-[#f3f3f1] rounded-xl p-4 border border-[#f3f3f1] flex items-center gap-3">
                     <div className="w-10 h-10 bg-[#f3f3f1] rounded-full flex items-center justify-center border border-[#f3f3f1] shrink-0">
                        <User size={18} className="text-[#7a8b95]" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Published By</p>
                       <p className="text-sm font-bold text-[#212c46]">{selectedNews.author}</p>
                     </div>
                  </div>
                </div>
             </>
          )}
        </div>
      </DraggableModal>

      <DraggableModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Post New Update"
      >
        <div className="p-6 space-y-4 font-sans">
            <div>
                <label className="text-[10px] font-black tracking-widest text-[#7a8b95] uppercase mb-1 block">Category</label>
                <input 
                    type="text" 
                    value={newUpdate.category} 
                    onChange={e => setNewUpdate({...newUpdate, category: e.target.value})} 
                    className="w-full p-2 border border-[#eaeaec] rounded-lg text-sm bg-white" 
                    placeholder="e.g. COMPLIANCE UPDATE"
                />
            </div>
            <div>
                <label className="text-[10px] font-black tracking-widest text-[#7a8b95] uppercase mb-1 block">Title</label>
                <input 
                    type="text" 
                    value={newUpdate.title} 
                    onChange={e => setNewUpdate({...newUpdate, title: e.target.value})} 
                    className="w-full p-2 border border-[#eaeaec] rounded-lg text-sm bg-white" 
                    placeholder="Headline"
                />
            </div>
            <div>
                <label className="text-[10px] font-black tracking-widest text-[#7a8b95] uppercase mb-1 block">Short Preview</label>
                <input 
                    type="text" 
                    value={newUpdate.preview} 
                    onChange={e => setNewUpdate({...newUpdate, preview: e.target.value})} 
                    className="w-full p-2 border border-[#eaeaec] rounded-lg text-sm bg-white" 
                    placeholder="Short description for the card"
                />
            </div>
            <div>
                <label className="text-[10px] font-black tracking-widest text-[#7a8b95] uppercase mb-1 block">Full Details</label>
                <textarea 
                    value={newUpdate.fullText} 
                    onChange={e => setNewUpdate({...newUpdate, fullText: e.target.value})} 
                    className="w-full p-2 border border-[#eaeaec] rounded-lg text-sm bg-white h-24" 
                    placeholder="Detailed content of the announcement..."
                />
            </div>
            <div>
                <label className="text-[10px] font-black tracking-widest text-[#7a8b95] uppercase mb-2 block flex items-center gap-1.5"><ImageIcon size={14} className="text-[#3f809e]"/> Cover Image</label>
                <div className="flex bg-[#f8f9fa] border border-[#eaeaec] p-1 rounded-lg mb-3">
                    <button 
                        onClick={() => setImageMode('url')} 
                        className={`flex-1 text-xs font-bold py-1.5 rounded-md flex justify-center items-center gap-1.5 cursor-pointer ${imageMode === 'url' ? 'bg-white shadow-sm text-[#212c46]' : 'text-[#7a8b95] hover:text-[#212c46]'}`}
                    >
                        <Link size={12}/> Link URL
                    </button>
                    <button 
                        onClick={() => setImageMode('upload')} 
                        className={`flex-1 text-xs font-bold py-1.5 rounded-md flex justify-center items-center gap-1.5 cursor-pointer ${imageMode === 'upload' ? 'bg-white shadow-sm text-[#212c46]' : 'text-[#7a8b95] hover:text-[#212c46]'}`}
                    >
                        <UploadCloud size={12}/> Upload File
                    </button>
                </div>
                
                {imageMode === 'url' ? (
                    <input 
                        type="text" 
                        value={newUpdate.image} 
                        onChange={e => setNewUpdate({...newUpdate, image: e.target.value})} 
                        className="w-full p-2 border border-[#eaeaec] rounded-lg text-sm bg-white" 
                        placeholder="https://example.com/image.jpg"
                    />
                ) : (
                    <div className="border border-dashed border-[#a3acbe] rounded-lg p-4 flex flex-col items-center justify-center bg-[#f8f9fa]">
                        <UploadCloud size={24} className="text-[#a3acbe] mb-2"/>
                        <p className="text-xs font-bold text-[#7a8b95] mb-2">Click below to browse files (Computer or Drive)</p>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="text-xs text-[#212c46] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#212c46] file:text-white hover:file:bg-[#1c273e]"
                        />
                    </div>
                )}
                
                {newUpdate.image && (
                    <div className="mt-3 relative h-24 w-full rounded-lg border border-[#eaeaec] overflow-hidden">
                        <img src={newUpdate.image} alt="Cover Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="bg-black/80 text-white text-[10px] px-2 py-1 rounded font-bold">Preview</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-[#f3f3f1]">
                <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-[#eaeaec] bg-white rounded-lg text-xs font-bold text-[#212c46] cursor-pointer">Cancel</button>
                <button onClick={handleAddUpdate} className="px-4 py-2 bg-[#212c46] text-white rounded-lg text-xs font-bold cursor-pointer">Post Update</button>
            </div>
        </div>
      </DraggableModal>

      <DraggableModal 
        isOpen={isAllNewsModalOpen} 
        onClose={() => setIsAllNewsModalOpen(false)}
        title="All News & Announcements"
        width="max-w-3xl"
      >
        <div className="p-6 font-sans">
            <div className="grid grid-cols-1 gap-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                {newsList.map((n, i) => (
                    <div key={i} onClick={() => { setIsAllNewsModalOpen(false); openNews(n); }} className="flex items-start gap-4 p-4 border border-[#eaeaec] bg-white hover:border-[#a3acbe] hover:shadow-md cursor-pointer transition-all rounded-xl group group-hover:-translate-y-1">
                        <img src={n.image} alt={n.title} className="w-20 h-20 rounded-lg object-cover" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-black text-[#d96245] uppercase tracking-widest">{n.category}</span>
                                <span className="text-[10px] font-medium text-[#7a8b95]">{n.date}</span>
                            </div>
                            <h3 className="text-sm font-bold text-[#212c46] mb-1 group-hover:text-[#3f809e] transition-colors">{n.title}</h3>
                            <p className="text-xs text-[#7a8b95] line-clamp-2">{n.preview}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </DraggableModal>
      </>
    );
};
