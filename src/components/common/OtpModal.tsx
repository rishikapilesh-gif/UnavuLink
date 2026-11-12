import React, { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  stage: 'pickup' | 'delivery';
  correctOtp: string;
  onSuccess: () => void;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  title,
  stage,
  correctOtp,
  onSuccess
}) => {
  const [enteredOtp, setEnteredOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      if (enteredOtp.trim() === correctOtp.trim()) {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 }
        });
        onSuccess();
        onClose();
      } else {
        setError(`Invalid ${stage === 'pickup' ? 'Pickup' : 'Delivery'} OTP code. Please check with counter-party.`);
      }
      setIsVerifying(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-card shadow-lift max-w-sm w-full border border-sage overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-forest text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-orange-warm" />
            <h3 className="font-bold text-sm">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleVerify} className="p-5 space-y-4">
          <div className="text-center space-y-1">
            <p className="text-xs text-muted">
              Enter the 6-digit secure {stage} OTP provided by the {stage === 'pickup' ? 'Food Donor' : 'Receiving Organization'}.
            </p>
            <p className="text-[11px] text-forest font-semibold bg-forest/10 py-1 px-2 rounded-md inline-block">
              Demo OTP hint: <strong className="tracking-widest">{correctOtp}</strong>
            </p>
          </div>

          <div>
            <input
              type="text"
              maxLength={6}
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              placeholder="000000"
              className="w-full text-center tracking-[0.4em] font-mono text-2xl font-extrabold py-3 border border-sage rounded-subtle bg-cream focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-2.5 bg-cherry/10 border border-cherry/20 text-cherry text-xs rounded-subtle flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2 border border-sage rounded-subtle text-xs font-semibold text-charcoal hover:bg-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={enteredOtp.length < 4 || isVerifying}
              className="w-1/2 py-2 bg-forest text-white rounded-subtle text-xs font-semibold hover:bg-forest-dark transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isVerifying ? (
                <span>Validating...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
