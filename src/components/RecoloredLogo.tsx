import React, { useEffect, useRef, useState } from 'react';

import { LOGO_BASE64 } from '../assets/logoBase64';

interface RecoloredLogoProps {
  className?: string;
}

export const RecoloredLogo: React.FC<RecoloredLogoProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    // We can use the data URI directly
    img.src = LOGO_BASE64;
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        const origColors = [
          [81, 183, 237],  // Light blue
          [3, 56, 160],    // Dark blue
          [170, 25, 115],  // Purple
          [253, 185, 19],  // Yellow
          [38, 172, 88]    // Green
        ];

        const targetColors = [
          [137, 159, 188], // #899fbc (mapped to light blue area)
          [30, 51, 71],    // #1e3347 (mapped to dark blue area)
          [64, 89, 116],   // #405974 (mapped to purple area)
          [163, 182, 202], // #a3b6ca (mapped to yellow area)
          [204, 211, 224]  // #ccd3e0 (mapped to green area)
        ];

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          const a = data[i+3];

          if (a > 5) {
            let minDist = Infinity;
            let closestIdx = 0;

            for (let c = 0; c < origColors.length; c++) {
              const oR = origColors[c][0];
              const oG = origColors[c][1];
              const oB = origColors[c][2];
              const dist = (r - oR)*(r - oR) + (g - oG)*(g - oG) + (b - oB)*(b - oB);
              if (dist < minDist) {
                minDist = dist;
                closestIdx = c;
              }
            }

            data[i] = targetColors[closestIdx][0];
            data[i+1] = targetColors[closestIdx][1];
            data[i+2] = targetColors[closestIdx][2];
          }
        }
        
        ctx.putImageData(imgData, 0, 0);
        setLoaded(true);
      } catch (err) {
        console.error('Canvas error:', err);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 w-full h-full object-contain drop-shadow-md`} 
    />
  );
};
