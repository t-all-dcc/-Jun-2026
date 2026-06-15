import React from 'react';
import * as Icons from 'lucide-react';

const kebabToPascal = (str: string) => 
  str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

interface LucideIconProps {
  name: string | React.ComponentType<any>;
  size?: number;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
}

export const LucideIcon = ({ 
  name, 
  size = 16, 
  className = "", 
  color, 
  style, 
  strokeWidth = 2.5 
}: LucideIconProps) => {
  if (!name) return null;
  
  if (typeof name !== 'string') {
    const IconComponent = name as React.ComponentType<any>;
    return React.createElement(IconComponent, { size, className, style: { ...style, color }, strokeWidth });
  }
  
  const pascalName = kebabToPascal(name);
  const IconComponent = (Icons[pascalName as keyof typeof Icons] || Icons.HelpCircle) as React.ComponentType<any>;
  
  if (!IconComponent) return null;
  return React.createElement(IconComponent, { size, className, style: { ...style, color }, strokeWidth });
};
