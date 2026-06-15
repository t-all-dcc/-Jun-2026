import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Lock, User as UserIcon, Users, Loader2, Package, ArrowRight, Phone, Mail, Eye, EyeOff, Scale, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { googleSignIn } from '../firebase';

export default function Login() {
  const [employeeId, setEmployeeId] = useState('');
  const [idCard, setIdCard] = useState('');
  const [showIdCard, setShowIdCard] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('login', undefined, { employeeId, idCard });
      
      if (response.status === 'success' && response.data) {
        login(response.data);
        navigate(from, { replace: true });
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      const result = await googleSignIn();
      if (result) {
        // Log in the user after successful Google OAuth
        login({
          id: result.user.uid,
          employeeId: result.user.email || result.user.uid,
          name: result.user.displayName || 'Google User',
          role: 'Admin', // Set a default appropriate role or fetch from your backend
          permissions: {
            canCreate: true,
            canEdit: true,
            canApprove: true,
            canVerify: true,
          }
        });
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google Sign In failed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full font-mono bg-slate-900 overflow-hidden">
      {/* Global Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://png.pngtree.com/background/20250125/original/pngtree-stack-of-books-in-a-library-with-sunlight-streaming-through-the-picture-image_15776652.jpg')`
        }}
      />

      <div className="relative z-10 flex w-full min-h-screen">
        {/* Left Panel - Dark Overlay */}
        <div className="hidden w-1/2 flex-col justify-between bg-[#111f42]/40 p-12 lg:flex backdrop-blur-sm border-r border-white/10">
          
          <div className="flex flex-col">
            {/* Top Logo */}
            <div className="flex items-center gap-4 text-white mb-16 cursor-pointer group">
              <div className="relative flex h-14 w-14 items-center justify-center transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1273/1273709.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <span className="text-[15px] font-serif font-bold tracking-[0.2em] text-[#e2e8f0] drop-shadow-md">
                INTELLIGENCE CERTIFICATION LIBRARY
              </span>
            </div>

            {/* Main Branding */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-[75px] font-serif tracking-widest text-white leading-none mb-4 shadow-black/20 drop-shadow-xl">
                SMART CERT LIBRARY V1.0
              </h1>
              <h2 className="text-[26px] font-bold text-white mb-8 tracking-wide drop-shadow-md">
                Intelligent Certificate Hub
              </h2>
              <p className="max-w-md text-[15px] leading-relaxed text-white/80 font-medium">
                Streamline the management of external certificates,<br />
                ensure seamless compliance tracking, and centralize<br />
                all your credentials required for system audits.<br />
              </p>

              <div className="mt-12 mb-8 h-px w-[85%] bg-white/20" />

              <div className="grid grid-cols-2 gap-8 max-w-sm">
                <div>
                  <div className="text-[40px] font-black text-[#E3624A] tracking-tighter leading-none mb-2 drop-shadow-lg">100%</div>
                  <div className="text-[13px] font-bold text-white/60 tracking-wider">Compliance Rate</div>
                </div>
                <div>
                  <div className="text-[40px] font-black text-[#E3624A] tracking-tighter leading-none mb-2 drop-shadow-lg">24/7</div>
                  <div className="text-[13px] font-bold text-white/60 tracking-wider">Real-time Analytics</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="flex w-full items-end justify-between mt-auto">
            <div className="text-[13px] text-white/70 space-y-1">
              <div className="font-bold text-white text-[16px] mb-1">T All Intelligence</div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-white/90">Smart Solutions</span>
                <span className="text-white/30">|</span>
                <span className="flex items-center gap-1.5"><Phone size={14} className="text-white/70" /> 082-5695654</span>
                <span className="text-white/30">|</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail size={14} className="text-white/70" /> tallintelligence.ho@gmail.com
              </div>
              <div className="mt-3 pt-1 text-[10px] font-bold text-white/40 tracking-[0.1em]">
                &copy; 2026 ALL RIGHTS RESERVED
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl border border-white/20 bg-[#2a2d45]/40 backdrop-blur-md p-4 shadow-2xl">
              <img 
                src="https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400" 
                alt="Developer" 
                className="h-12 w-12 rounded-full object-cover border-2 border-[#E3624A]/60 shadow-lg"
              />
              <div className="flex flex-col pr-2">
                <span className="text-[14px] font-bold text-white tracking-wide">CERT LIBRARY Developer</span>
                <span className="text-[12px] font-bold text-[#E3624A] mt-0.5">Lead Developer</span>
                <span className="text-[10px] text-white/40 mt-1">tallintelligence.dcc@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[380px] rounded-[20px] bg-white/50 backdrop-blur-xl border-2 border-white/60 p-5 sm:p-6 shadow-[0_30px_60px_rgba(0,0,0,0.15)]"
          >
            <div className="mb-5">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#E3624A] text-white mb-4 lg:hidden shadow-lg">
                <Shield size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-[26px] font-bold text-[#1a2035] mb-1.5 tracking-wide">
                Welcome back
              </h2>
              <p className="text-[13px] font-medium text-[#4a5568] leading-snug pr-4">
                Please enter your credentials to access the system.
              </p>
            </div>
            
            <form className="space-y-0" onSubmit={handleSubmit}>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[13px] font-bold text-[#1a2035] mb-2.5">
                    Staff Code
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500/80">
                      <UserIcon size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      className="block w-full bg-white/40 border border-white/60 rounded-xl py-2.5 pl-12 pr-4 text-[13px] font-bold text-slate-800 placeholder:text-slate-500/60 focus:bg-white/70 focus:border-white focus:ring-2 focus:ring-white/50 outline-none transition-all shadow-inner"
                      placeholder="e.g., DEMO"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#1a2035] mb-2.5">
                    ID Card Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500/80">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showIdCard ? "text" : "password"}
                      required
                      className="block w-full bg-white/40 border border-white/60 rounded-xl py-2.5 pl-12 pr-12 text-[13px] font-bold text-slate-800 placeholder:text-slate-500/60 focus:bg-white/70 focus:border-white focus:ring-2 focus:ring-white/50 outline-none transition-all shadow-inner"
                      placeholder="13 digits or DEMO123456789"
                      value={idCard}
                      onChange={(e) => setIdCard(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500/80 hover:text-slate-800 transition-colors"
                      onClick={() => setShowIdCard(!showIdCard)}
                    >
                      {showIdCard ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-[13px] font-bold text-red-600 text-center backdrop-blur-sm"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full bg-[#111f42] text-white mt-5 py-3 px-6 rounded-[10px] text-[13px] font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-[#111f42]/90 transition-all disabled:opacity-70 group"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Sign in to account
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-between">
                <div className="h-px w-full bg-slate-300"></div>
                <span className="px-3 text-[11px] font-medium text-slate-500">OR</span>
                <div className="h-px w-full bg-slate-300"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading}
                className="gsi-material-button w-full flex items-center justify-center py-2.5 px-6 mt-3 rounded-[10px] border border-slate-300 bg-white hover:bg-slate-50 transition-all disabled:opacity-70 shadow-sm"
              >
                {isGoogleLoading ? (
                  <Loader2 size={20} className="animate-spin mr-2 text-slate-800" />
                ) : (
                  <div className="flex items-center gap-2.5">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                    <span className="text-[13px] font-bold text-slate-700">Sign in with Google</span>
                  </div>
                )}
              </button>
              
              <div className="mt-4 rounded-[10px] bg-white/60 p-3 text-center shadow-inner border border-white/60 backdrop-blur-sm">
                <div className="font-bold text-[#1a2035] text-[12px] mb-1">Demo Credentials</div>
                <div className="text-[12px] font-semibold text-slate-700">User: DEMO / Pass: DEMO123456789</div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

