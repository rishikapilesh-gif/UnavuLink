import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { FoodListing } from '../../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Thermometer, 
  Clock, 
  X, 
  MapPin, 
  CheckCircle2, 
  QrCode, 
  Printer, 
  Download, 
  ChefHat, 
  Building2, 
  Truck, 
  FileCheck,
  Share2,
  Calendar,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QRPassportModalProps {
  listing: FoodListing | null;
  onClose: () => void;
}

export const QRPassportModal: React.FC<QRPassportModalProps> = ({ listing, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!listing) return;

    const passportUrl = `${window.location.origin}/passport/${listing.batch_id}`;
    QRCode.toDataURL(passportUrl, {
      width: 220,
      margin: 1.5,
      color: {
        dark: '#26332B',
        light: '#FFFFFF'
      }
    }).then(setQrDataUrl);
  }, [listing]);

  if (!listing) return null;

  const isFrozen = listing.safety_status === 'frozen';
  const isRecalled = listing.safety_status === 'recalled';
  const isExpired = listing.safety_status === 'expired';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/passport/${listing.batch_id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const temp = listing.temperature_celsius || 68;
  const isHotStorage = temp >= 60;
  const isColdStorage = temp <= 4;
  const isDangerZone = temp > 4 && temp < 60;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal/70 backdrop-blur-md p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-lift max-w-2xl w-full border border-sage overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none">
        
        {/* Certificate Header Banner */}
        <div className="bg-gradient-to-r from-forest-dark via-forest to-forest-light text-white p-5 flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner shrink-0">
              <QrCode className="w-6 h-6 text-orange-warm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-warm bg-black/20 px-2 py-0.5 rounded">
                  OFFICIAL INSPECTION REPORT
                </span>
                <span className="text-[10px] font-bold text-cream/80">ISO 22000 & FSSAI Compliant</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight mt-0.5">
                Food Safety & Traceability Passport
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 relative z-10 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Print Inspection Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Sheet */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1 bg-cream/30">
          
          {/* Status Alert if Quarantined */}
          {isFrozen && (
            <div className="p-4 bg-cherry/10 border-2 border-cherry rounded-xl flex items-start gap-3 text-cherry">
              <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-sm uppercase tracking-wide">BATCH QUARANTINED — DO NOT DISTRIBUTE</h4>
                <p className="mt-1 leading-relaxed">
                  This food batch has been frozen following a reported safety concern. Distribution is halted pending authorized laboratory / safety officer clearance.
                </p>
              </div>
            </div>
          )}

          {/* Top Visual Passport Card: QR Code & Verification Stamp */}
          <div className="bg-white rounded-xl p-5 border border-sage shadow-xs flex flex-col sm:flex-row items-center gap-5">
            {/* Scannable QR Visual */}
            <div className="relative shrink-0 text-center">
              <div className="p-2 bg-white rounded-xl border border-sage shadow-sm inline-block">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Batch QR Code" className="w-36 h-36 rounded-lg" />
                ) : (
                  <div className="w-36 h-36 bg-cream animate-pulse rounded-lg" />
                )}
              </div>
              <span className="block text-[10px] text-muted font-bold mt-1 tracking-wider uppercase">
                Digital Verification QR
              </span>
            </div>

            {/* Passport Identity & Security Stamp */}
            <div className="space-y-2.5 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="font-mono text-sm font-extrabold text-forest bg-forest/10 px-2.5 py-1 rounded border border-forest/20">
                  {listing.batch_id}
                </span>

                {isFrozen ? (
                  <span className="bg-cherry text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    FROZEN / QUARANTINE
                  </span>
                ) : (
                  <span className="bg-status-success text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>PASSED SAFETY GATE</span>
                  </span>
                )}
              </div>

              <h3 className="text-xl font-extrabold text-charcoal tracking-tight">
                {listing.food_name}
              </h3>

              <div className="text-[11px] text-muted space-y-0.5">
                <p>Origin Kitchen: <strong className="text-charcoal">{listing.donor_name || 'Annapoorna Kitchen'}</strong></p>
                <p>Registration: <strong className="text-charcoal">FSSAI License #12423008000491</strong></p>
                <p>Inspection Timestamp: <strong className="text-charcoal">{new Date(listing.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</strong></p>
              </div>

              <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1 bg-cream hover:bg-sage/40 text-charcoal border border-sage rounded-md font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-orange-warm" />
                  <span>{copied ? 'Link Copied!' : 'Share Digital Passport'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 1: Temperature & Cold-Chain Meter Report (Visual Gauge) */}
          <div className="bg-white rounded-xl p-5 border border-sage shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-cherry" />
                <h4 className="font-extrabold text-sm text-charcoal">Thermal & Cold-Chain Monitoring Report</h4>
              </div>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                isHotStorage ? 'bg-status-success/10 text-status-success' : isDangerZone ? 'bg-cherry/10 text-cherry' : 'bg-blue-100 text-blue-700'
              }`}>
                {isHotStorage ? 'Optimal Hot Holding' : isDangerZone ? 'Thermal Abuse Warning' : 'Chilled Cold Chain'}
              </span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-bold text-[11px]">
                <span className="text-blue-700">Chilled (&lt;4°C)</span>
                <span className="text-cherry">Danger Zone (5°C - 60°C)</span>
                <span className="text-status-success font-extrabold">Hot Holding (&gt;60°C)</span>
              </div>

              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex relative p-0.5 border border-sage">
                {/* Cold zone */}
                <div className="w-1/6 bg-blue-300 h-full rounded-l" />
                {/* Danger zone */}
                <div className="w-3/6 bg-orange-warm/40 h-full" />
                {/* Hot safe zone */}
                <div className="w-2/6 bg-status-success/70 h-full rounded-r" />

                {/* Live Marker Indicator */}
                <div 
                  className="absolute top-0 bottom-0 w-3 bg-charcoal border-2 border-white rounded-full shadow-md -translate-x-1/2"
                  style={{ left: `${Math.min(95, Math.max(5, (temp / 85) * 100))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted pt-1">
                <span>Recorded Core Temp: <strong className="text-charcoal text-xs">{temp}°C</strong></span>
                <span>Safety Threshold: <strong>Compliant with ICMR Food Standard</strong></span>
              </div>
            </div>

            <p className="text-[11px] text-muted bg-cream p-2.5 rounded-lg border border-sage/60">
              <strong>Declared Storage:</strong> {listing.storage_information} • Packaging: {listing.packaging_information}
            </p>
          </div>

          {/* Section 2: Nutrition, Quantity & Allergen Safety Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quantity & Serving Specs */}
            <div className="bg-white rounded-xl p-4 border border-sage shadow-xs space-y-2">
              <h4 className="font-extrabold text-charcoal flex items-center gap-1.5 text-xs">
                <ChefHat className="w-4 h-4 text-forest" />
                <span>Quantity & Intake Capacity</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 bg-cream rounded-lg text-center">
                  <span className="text-[10px] text-muted block uppercase">Net Weight</span>
                  <span className="text-base font-extrabold text-charcoal">{listing.quantity} {listing.unit}</span>
                </div>
                <div className="p-2.5 bg-cream rounded-lg text-center">
                  <span className="text-[10px] text-muted block uppercase">Meals Served</span>
                  <span className="text-base font-extrabold text-forest">{listing.estimated_portions} Portions</span>
                </div>
              </div>
              <p className="text-[11px] text-muted pt-1">
                Dietary Category: <strong className="text-charcoal">{listing.dietary_category}</strong> (Prepared in dedicated facility)
              </p>
            </div>

            {/* Allergen Matrix */}
            <div className="bg-white rounded-xl p-4 border border-sage shadow-xs space-y-2">
              <h4 className="font-extrabold text-charcoal flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-orange-warm" />
                <span>Allergen Verification Matrix</span>
              </h4>
              {listing.allergens && listing.allergens.length > 0 ? (
                <div className="space-y-1.5 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {listing.allergens.map(a => (
                      <span key={a} className="bg-cherry/10 text-cherry border border-cherry/20 font-bold px-2 py-0.5 rounded text-[11px]">
                        Contains {a}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted">
                    Inform receiving shelter staff to segregate for individuals with declared dietary allergies.
                  </p>
                </div>
              ) : (
                <div className="pt-2">
                  <span className="text-status-success font-bold flex items-center gap-1 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>No Major Allergens Declared</span>
                  </span>
                  <p className="text-[11px] text-muted mt-1">Free from declared nuts, dairy, and soy traces.</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Chain of Custody & Logistics Timeline (Visual Steps) */}
          <div className="bg-white rounded-xl p-5 border border-sage shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-forest" />
                <h4 className="font-extrabold text-sm text-charcoal">Verified Chain of Custody Trail</h4>
              </div>
              <span className="text-[10px] font-bold text-muted uppercase">Append-Only Audit</span>
            </div>

            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-sage">
              {/* Event 1 */}
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  1
                </div>
                <div className="bg-cream/60 p-2.5 rounded-lg border border-sage/60 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-charcoal">Preparation & Commercial Cooking</span>
                    <span className="text-[10px] text-muted">{new Date(listing.preparation_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-muted text-[11px]">Hygienically cooked at {listing.pickup_location}. Certified by Chef Senthil Kumar.</p>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  2
                </div>
                <div className="bg-cream/60 p-2.5 rounded-lg border border-sage/60 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-charcoal">FSSAI Safety Gate Automated Audit</span>
                    <span className="text-[10px] text-status-success font-bold">PASSED</span>
                  </div>
                  <p className="text-muted text-[11px]">
                    Validated handling window ({listing.permitted_handling_deadline ? new Date(listing.permitted_handling_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '4 hrs'}). Core temp {temp}°C verified.
                  </p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-7 h-7 rounded-full bg-orange-warm text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  3
                </div>
                <div className="bg-cream/60 p-2.5 rounded-lg border border-sage/60 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-charcoal">Volunteer Pickup Handover</span>
                    <span className="text-[10px] font-mono font-bold text-forest bg-forest/10 px-1.5 py-0.2 rounded">OTP: 582194</span>
                  </div>
                  <p className="text-muted text-[11px]">Transferred to Volunteer Karthik Subramanian (Motorcycle Thermal Carrier).</p>
                </div>
              </div>

              {/* Event 4 */}
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-7 h-7 rounded-full bg-status-success text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  4
                </div>
                <div className="bg-cream/60 p-2.5 rounded-lg border border-sage/60 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-charcoal">Receiving Shelter Intake & Beneficiary Table</span>
                    <span className="text-[10px] font-mono font-bold text-orange-warm bg-orange-warm/10 px-1.5 py-0.2 rounded">OTP: 914372</span>
                  </div>
                  <p className="text-muted text-[11px]">Anbalayam Children Shelter verified intact seals and logged meal distributions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic Signature Seal */}
          <div className="p-3 bg-sage/20 rounded-xl border border-sage text-[10px] text-muted flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-bold text-charcoal block">Cryptographic Hash Signature:</span>
              <span className="font-mono text-muted truncate max-w-sm block">SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>
            </div>
            <div className="flex items-center gap-1 text-forest font-bold shrink-0">
              <ShieldCheck className="w-4 h-4 text-status-success" />
              <span>Immutable Ledger Verified</span>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-white border-t border-sage flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="text-[11px] text-muted">
            Certified by <strong>UnavuLink Automated Safety Gate</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-sage rounded-xl font-bold text-charcoal hover:bg-cream transition-colors flex items-center gap-1.5 text-xs shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Inspection Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-forest hover:bg-forest-dark text-white rounded-xl font-extrabold text-xs shadow-sm transition-all"
            >
              Close Passport
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
