import React from 'react';

interface HighlightTextProps {
  text: string;
  query: string;
}

export function HighlightText({ text, query }: HighlightTextProps) {
  if (!query || !text) return <>{text}</>;
  
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200 text-[#212c46] rounded-sm px-0.5">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
