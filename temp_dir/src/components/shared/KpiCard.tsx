import React from 'react';
import * as Icons from 'lucide-react';

interface KpiCardProps {
    title?: string;
    label?: string; // Alias for backward compatibility
    value: string | number | React.ReactNode;
    color?: string; // The primary/accent color
    colorAccent?: string; // Alternative accent color
    colorValue?: string; // Alternative text color
    icon: any; // Can be a string or a lucide-react component
    description?: string;
    subLabel?: string; // Alias for backward compatibility
    desc?: string; // Alias for backward compatibility
}

// Helper to convert kebab-case string to PascalCase for lucide icons
const kebabToPascal = (str: string) => 
    str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

const LucideIcon = ({ name, size = 16, className = "", color, style, strokeWidth = 2.5 }: any) => {
    if (!name) return null;
    
    // Check if name is already a React component (like from lucide-react)
    if (typeof name !== 'string') {
        const IconComponent = name as React.ElementType;
        return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={strokeWidth} />;
    }

    const pascalName = kebabToPascal(name);
    const IconComponent = (Icons[pascalName as keyof typeof Icons] as React.ElementType) || (Icons.CircleHelp as React.ElementType);
    if (!IconComponent) return null;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={strokeWidth} />;
};

const KpiCard: React.FC<KpiCardProps> = ({ 
    title, 
    label, 
    value, 
    color, 
    colorAccent,
    colorValue,
    icon, 
    description, 
    subLabel,
    desc
}) => {
    const displayTitle = title || label || '';
    const displayDescription = description || subLabel || desc || '';
    const activeAccent = colorAccent || color || '#4d87a8';
    const activeValueColor = colorValue || '#212c46';

    return (
        <div className="bg-white/90 px-6 py-6 rounded-2xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b7a159] transition-all min-h-[120px] flex flex-col justify-between animate-fadeIn text-left">
            {/* Watermark Icon */}
            <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none z-0">
                <LucideIcon name={icon} size={110} color={activeAccent} />
            </div>

            <div className="relative z-10 flex justify-between items-start w-full">
                {/* KPI Title */}
                <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm truncate">
                    {displayTitle}
                </p>
                {/* Main Icon Box */}
                <div 
                    className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6" 
                    style={{ 
                        backgroundColor: `${activeAccent}15`, 
                        borderColor: `${activeAccent}25`, 
                        color: activeAccent 
                    }}
                >
                    <LucideIcon name={icon} size={20} />
                </div>
            </div>

            <div className="relative z-10 mt-2 flex items-end justify-between">
                {/* KPI Value */}
                <p className="text-[28px] font-black leading-none" style={{ color: activeValueColor }}>
                    {value}
                </p>
                {/* KPI Description */}
                {displayDescription && (
                    <span className="text-[11px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1 shrink-0 ml-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span> {displayDescription}
                    </span>
                )}
            </div>
        </div>
    );
};

export default KpiCard;
