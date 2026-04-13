import { useState, useEffect } from 'react';
import { AlertTriangle, Fingerprint, Camera, Video, Mic, ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SOSPage() {
  const [isArmed, setIsArmed] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleSOSClick = () => {
    if (!isArmed) {
      setIsArmed(true);
    } else {
      setShowVerification(true);
    }
  };

  useEffect(() => {
    let timer: number;
    if (showVerification && countdown > 0) {
      timer = window.setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (showVerification && countdown === 0) {
      // Trigger actual SOS
      alert("SOS TRIGGERED! Recording started and guardians notified.");
      setShowVerification(false);
      setIsArmed(false);
      setCountdown(5);
    }
    return () => clearTimeout(timer);
  }, [showVerification, countdown]);

  const cancelSOS = () => {
    setShowVerification(false);
    setIsArmed(false);
    setCountdown(5);
  };

  return (
    <div className="min-h-full bg-[#050505] p-4 pt-8 flex flex-col pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert size={24} className="text-red-500" />
          Smart SOS
        </h1>
        <p className="text-sm text-[#888] mt-1">Emergency broadcast system</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Background pulse rings */}
        {isArmed && (
          <>
            <div className="absolute w-64 h-64 bg-red-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
            <div className="absolute w-80 h-80 bg-red-500/5 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
          </>
        )}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSOSClick}
          className={`relative z-10 w-56 h-56 rounded-full flex items-center justify-center transition-all duration-500 ${
            isArmed ? 'bg-red-600 shadow-2xl shadow-red-600/40' : 'bg-[#111] border border-white/10 hover:bg-[#151515]'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <AlertTriangle size={56} className={isArmed ? 'text-white' : 'text-red-500'} />
            <span className={`font-bold text-2xl tracking-widest ${isArmed ? 'text-white' : 'text-red-500'}`}>
              {isArmed ? 'ARMED' : 'SOS'}
            </span>
          </div>
        </motion.button>

        <p className="text-center text-gray-400 mt-10 max-w-xs text-sm h-10">
          {isArmed 
            ? <span className="text-red-400 font-medium">System armed. Tap again to trigger emergency protocol.</span>
            : "Tap to arm the SOS system. Once armed, a second tap will trigger the emergency protocol."}
        </p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-3xl p-6 mt-auto">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <SettingsIcon /> Protocol Details
        </h3>
        <ul className="space-y-4">
          <ProtocolItem icon={<Fingerprint size={18} />} text="Biometric verification prevents accidental triggers" />
          <ProtocolItem icon={<Video size={18} />} text="Auto-records front & back cameras" />
          <ProtocolItem icon={<Mic size={18} />} text="Captures background audio" />
          <ProtocolItem icon={<Camera size={18} />} text="Live streams to Guardians (if online)" />
        </ul>
      </div>

      {/* Verification Modal */}
      <AnimatePresence>
        {showVerification && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#111] border border-red-500/30 rounded-3xl p-8 w-full max-w-sm shadow-2xl shadow-red-500/20 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-900/30">
                <motion.div 
                  className="h-full bg-red-500"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              </div>

              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Fingerprint size={40} className="text-red-500 animate-pulse" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Verify Identity</h2>
              <p className="text-gray-400 text-sm mb-8">
                Please verify using fingerprint or Face ID to broadcast SOS. Auto-triggering in {countdown}s.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={cancelSOS}
                  className="flex-1 py-3.5 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setCountdown(0)}
                  className="flex-1 py-3.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20"
                >
                  Verify Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProtocolItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <li className="flex items-start gap-4 text-sm text-gray-300">
      <div className="mt-0.5 text-red-500 bg-red-500/10 p-1.5 rounded-lg">{icon}</div>
      <span className="leading-relaxed">{text}</span>
    </li>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}
