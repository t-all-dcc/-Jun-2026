import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home, MapPin, Compass } from 'lucide-react';
import { MENU_ITEMS } from '../config/menu';
import { useLanguage } from '../context/LanguageContext';

export default function Breadcrumb() {
  const location = useLocation();
  const { language } = useLanguage();
  const pathname = location.pathname;

  const breadcrumbs = useMemo(() => {
    // Treat home path specially
    if (pathname === '/') {
      return [];
    }

    const list: { name: string; nameTh?: string; path?: string }[] = [];

    // Find custom matches from MENU_ITEMS
    let matchedItem: any = null;
    let matchedSubItem: any = null;

    for (const item of MENU_ITEMS) {
      if (item.path && item.path === pathname) {
        matchedItem = item;
        break;
      }
      if (item.subItems) {
        const foundSub = item.subItems.find(sub => sub.path === pathname);
        if (foundSub) {
          matchedItem = item;
          matchedSubItem = foundSub;
          break;
        }
      }
    }

    if (matchedItem) {
      // 1. Add Category if exists
      if (matchedItem.category) {
        list.push({
          name: matchedItem.category,
          nameTh: matchedItem.category, // Category does not have specific Thai translations in menu.ts, use upper
        });
      }

      // 2. Add Main Item
      list.push({
        name: matchedItem.name,
        nameTh: matchedItem.nameTh,
        path: matchedSubItem ? undefined : matchedItem.path, // Only link if it's the target or has path
      });

      // 3. Add Sub Item if matched
      if (matchedSubItem) {
        list.push({
          name: matchedSubItem.name,
          nameTh: matchedSubItem.nameTh,
          path: matchedSubItem.path,
        });
      }
    } else {
      // Fallback for paths not explicitly found
      const parts = pathname.split('/').filter(Boolean);
      let cumulativePath = '';
      parts.forEach((part) => {
        cumulativePath += `/${part}`;
        const nameUpper = part.replace(/-/g, ' ').toUpperCase();
        list.push({
          name: nameUpper,
          nameTh: nameUpper,
          path: cumulativePath,
        });
      });
    }

    return list;
  }, [pathname]);

  return (
    <nav 
      aria-label="Breadcrumb navigation" 
      className="px-8 py-2 bg-transparent shrink-0 flex items-center justify-between border-b border-[#eaeaec]/40"
    >
      <div className="flex items-center gap-2 text-[11px] font-bold text-[#7a8b95] uppercase tracking-wider font-mono">
        <Link 
          to="/" 
          className="flex items-center gap-1.5 text-[#212c46] hover:text-[#b58c4f] transition-colors"
          title="Go to Home"
        >
          <Home size={12} className="text-[#b58c4f]" />
          <span>Home</span>
        </Link>

        {breadcrumbs.length > 0 && <ChevronRight size={10} className="text-slate-400 shrink-0" />}

        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          const displayName = language === 'TH' && crumb.nameTh ? crumb.nameTh : crumb.name;

          return (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight size={10} className="text-slate-400 shrink-0" />}
              {crumb.path && !isLast ? (
                <Link 
                  to={crumb.path} 
                  className="hover:text-[#b58c4f] text-[#212c46] transition-colors truncate max-w-[150px] sm:max-w-none"
                >
                  {displayName}
                </Link>
              ) : (
                <span className={`${isLast ? 'text-[#b58c4f] font-black' : 'text-slate-550'} truncate max-w-[150px] sm:max-w-none`}>
                  {displayName}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-400 font-bold tracking-widest font-mono">
        <Compass size={11} className="text-[#3f809e] animate-spin-slow" />
        <span>UTC AUTO-TRACKER ACTIVE</span>
      </div>
    </nav>
  );
}
