import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, RefreshCw, X, AlertCircle, Sparkles, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraScannerProps {
  onScanSuccess: (decodedText: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function CameraScanner({ onScanSuccess, isOpen, onClose }: CameraScannerProps) {
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const qrCodeRegionId = "camera-scan-region-element";
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    // Initialize & query cameras
    const loadCameras = async () => {
      try {
        setScannerError(null);
        // Request permissions and list cameras
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setCameras(devices);
          setPermissionGranted(true);
          
          // Try to select back camera by default
          const backCamera = devices.find(d => 
            d.label.toLowerCase().includes('back') || 
            d.label.toLowerCase().includes('rear') || 
            d.label.toLowerCase().includes('environment')
          );
          setSelectedCameraId(backCamera ? backCamera.id : devices[0].id);
        } else {
          setScannerError("No cameras detected on this device.");
          setPermissionGranted(false);
        }
      } catch (err: any) {
        console.error("Camera detection error:", err);
        setScannerError("Unable to access camera. Please complete camera permissions.");
        setPermissionGranted(false);
      }
    };

    loadCameras();

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  // Restart scanning whenever camera changes or scanning is toggled
  useEffect(() => {
    if (isOpen && selectedCameraId && permissionGranted) {
      startScanner(selectedCameraId);
    }
    return () => {
      stopScanner();
    };
  }, [selectedCameraId, isOpen, permissionGranted]);

  const startScanner = async (cameraId: string) => {
    try {
      setScannerError(null);
      // Wait for any existing scanner to stop
      await stopScanner();

      // Ensure theDOM element exists before starting
      const element = document.getElementById(qrCodeRegionId);
      if (!element) {
        // Try again shortly
        setTimeout(() => startScanner(cameraId), 100);
        return;
      }

      const formats = [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
      ];

      const html5Qrcode = new Html5Qrcode(qrCodeRegionId, {
        formatsToSupport: formats,
        verbose: false
      });
      html5QrcodeRef.current = html5Qrcode;

      await html5Qrcode.start(
        cameraId,
        {
          fps: 15,
          qrbox: (width, height) => {
            const size = Math.min(width, height) * 0.7;
            return { width: size, height: size };
          }
        },
        (decodedText) => {
          // Success Callback
          onScanSuccess(decodedText);
          stopScanner();
          onClose();
        },
        (errorMessage) => {
          // Avoid flooding state with normal scanning frame mismatches
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error("Error starting camera scanner:", err);
      setScannerError(`Camera start error: ${err?.message || err}`);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrcodeRef.current) {
      try {
        if (html5QrcodeRef.current.isScanning) {
          await html5QrcodeRef.current.stop();
        }
      } catch (err) {
        console.error("Error stopping scanner:", err);
      } finally {
        html5QrcodeRef.current = null;
        setIsScanning(false);
      }
    }
  };

  const switchCamera = () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex(c => c.id === selectedCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    setSelectedCameraId(cameras[nextIndex].id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2001] flex items-center justify-center bg-[#212c46]/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header toolbar */}
        <div className="p-5 bg-[#212c46] text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Camera size={18} className="text-[#d1a45f]" />
            </div>
            <div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-left">LENS SENSOR COMPLIANCE SCANNER</h4>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5 text-left uppercase">QR / Barcode detector for Halal certificates</p>
            </div>
          </div>
          <button 
            onClick={() => { stopScanner(); onClose(); }} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Info panel */}
        <div className="bg-[#f8f9fa] border-b border-slate-100 p-4 flex gap-3 text-left">
          <Info size={16} className="text-[#3f809e] shrink-0 mt-[2px]" />
          <p className="text-[11px] font-bold text-slate-600 leading-relaxed uppercase">
            Point the camera at the Halal Certificate's QR code or barcode to quickly search, link, and display compliance validation dossier.
          </p>
        </div>

        {/* Scan body camera region */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center min-h-[300px]">
          {scannerError && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center gap-2 text-red-600 max-w-sm mb-4">
              <AlertCircle size={28} className="animate-bounce" />
              <p className="text-xs font-black uppercase tracking-wider">Scanner Failure</p>
              <p className="text-[11px] text-center font-medium leading-relaxed">{scannerError}</p>
              {cameras.length > 0 && (
                <button 
                  onClick={() => startScanner(selectedCameraId)} 
                  className="mt-2 px-4 py-2 bg-red-600 text-white font-black text-[10px] uppercase tracking-wider rounded-lg hover:bg-red-700 transition"
                >
                  Retry Connection
                </button>
              )}
            </div>
          )}

          {/* Camera box outer wrapper */}
          <div className="w-full max-w-[360px] aspect-square rounded-[32px] overflow-hidden border-2 border-slate-200 bg-slate-950 relative shadow-inner">
            <div id={qrCodeRegionId} className="w-full h-full object-cover"></div>
            
            {/* Visual targeting overlays if scanning */}
            {isScanning && !scannerError && (
              <>
                {/* 4 Corner brackets styling */}
                <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-[#d1a45f] rounded-tl-xl pointer-events-none z-10"></div>
                <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-[#d1a45f] rounded-tr-xl pointer-events-none z-10"></div>
                <div className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-[#d1a45f] rounded-bl-xl pointer-events-none z-10"></div>
                <div className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-[#d1a45f] rounded-br-xl pointer-events-none z-10"></div>

                {/* Animated scanner laser beam line */}
                <motion.div 
                  className="absolute left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#d1a45f] to-transparent shadow-[0_0_12px_#d1a45f] z-10"
                  animate={{ top: ['15%', '85%', '15%'] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                />

                {/* Pulsing state dot */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#212c46]/80 text-[9px] font-black tracking-widest text-[#d1a45f] px-2 py-1 rounded-full border border-[#d1a45f]/20 uppercase animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  LIVE FEED
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 shrink-0 flex items-center justify-between gap-4">
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active camera lens</p>
            {cameras.length > 0 ? (
              <p className="text-[11px] font-bold text-[#212c46] uppercase max-w-[200px] truncate">
                {cameras.find(c => c.id === selectedCameraId)?.label || "Main Camera Lens"}
              </p>
            ) : (
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">NO INPUT FEED</p>
            )}
          </div>

          <div className="flex gap-2">
            {cameras.length > 1 && (
              <button 
                onClick={switchCamera}
                className="p-3 bg-white border border-slate-200 rounded-xl hover:border-[#1c273e] hover:bg-slate-50 text-[#212c46] hover:rotate-45 transition-all shadow-sm"
                title="Switch Camera Feed"
              >
                <RefreshCw size={16} />
              </button>
            )}
            <button 
              onClick={() => { stopScanner(); onClose(); }}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold uppercase text-[11px] tracking-widest hover:bg-slate-50 transition"
            >
              Cancel Scan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
