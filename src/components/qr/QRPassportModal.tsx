import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { FoodListing } from '../../types';
import { ShieldCheck, AlertTriangle, Thermometer, Clock, X, MapPin, CheckCircle2, QrCode } from 'lucide-react';

interface QRPassportModalProps {
  listing: FoodListing | null;
  onClose: () => void;
}

export const QRPassportModal: React.FC<QRPassportModalProps> = ({ listing, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!listing) return;

    const payload = JSON.stringify({
      passport_type: 'UNAVULINK_FOOD_SAFETY_PASSPORT',
      batch_id: listing.batch_id,
      food_name: listing.food_name,
      portions: listing.estimated_portions,
      prep_time: listing.preparation_time,
      handling_deadline: listing.permitted_handling_deadline,
      temperature: listing.temperature_celsius ? `${listing.temperature_celsius}°C` : 'Standard Ambient',
      allergens: listing.allergens,
      safety_status: listing.safety_status,
      donor: listing.donor_name || 'Verified Donor'
    });

    QRCode.toDataURL(payload, {
      width: 240,
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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-card shadow-lift max-w-lg w-full border border-sage overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-forest text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-orange-warm" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">Food Safety Passport</h3>
              <p className="text-xs text-forest-light">Batch Traceability & Verification</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Alert if Frozen/Recalled */}
          {isFrozen && (
            <div className="p-3 bg-cherry/10 border border-cherry/30 rounded-subtle flex items-start gap-2.5 text-cherry text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">SAFETY RECALL / BATCH FROZEN</p>
                <p className="text-xs mt-0.5">This batch is currently under safety quarantine. Distribution is prohibited.</p>
              </div>
            </div>
          )}

          {/* QR & Batch ID Box */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-cream p-4 rounded-subtle border border-sage">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Batch QR Code" className="w-36 h-36 rounded-lg bg-white p-1 border border-sage shadow-sm shrink-0" />
            ) : (
              <div className="w-36 h-36 bg-gray-100 rounded-lg animate-pulse" />
            )}
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-forest bg-forest/10 px-2 py-0.5 rounded-full inline-block">
                Batch ID
              </span>
              <h4 className="text-lg font-extrabold text-charcoal">{listing.batch_id}</h4>
              <p className="text-xs text-muted">Scan with any standard QR scanner or UnavuLink mobile volunteer app to verify handover.</p>
              <div className="pt-1 flex items-center gap-1.5 justify-center sm:justify-start text-xs font-semibold text-status-success">
                <CheckCircle2 className="w-4 h-4" />
                <span>Digitally Signed by Safety Gate</span>
              </div>
            </div>
          </div>

          {/* Verified Food Specs */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white border border-sage rounded-subtle">
              <span className="text-muted block">Food Item</span>
              <span className="font-bold text-charcoal text-sm">{listing.food_name}</span>
            </div>
            <div className="p-3 bg-white border border-sage rounded-subtle">
              <span className="text-muted block">Quantity / Portions</span>
              <span className="font-bold text-charcoal text-sm">{listing.quantity} {listing.unit} ({listing.estimated_portions} meals)</span>
            </div>
            <div className="p-3 bg-white border border-sage rounded-subtle flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-warm shrink-0" />
              <div>
                <span className="text-muted block">Prepared At</span>
                <span className="font-semibold text-charcoal">{new Date(listing.preparation_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            <div className="p-3 bg-white border border-sage rounded-subtle flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cherry shrink-0" />
              <div>
                <span className="text-muted block">Holding Temp</span>
                <span className="font-semibold text-charcoal">{listing.temperature_celsius ? `${listing.temperature_celsius}°C` : 'Ambient'}</span>
              </div>
            </div>
          </div>

          {/* Location & Allergens */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-1.5 text-muted">
              <MapPin className="w-4 h-4 text-forest shrink-0 mt-0.5" />
              <span><strong>Pickup Location:</strong> {listing.pickup_location}</span>
            </div>
            {listing.allergens && listing.allergens.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-charcoal">Declared Allergens:</span>
                {listing.allergens.map(a => (
                  <span key={a} className="bg-cherry/10 text-cherry font-medium px-2 py-0.5 rounded-full">
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Safety Disclaimer Banner */}
          <div className="bg-sage/30 p-2.5 rounded-subtle text-[11px] text-muted flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-forest shrink-0 mt-0.5" />
            <span>
              <strong>Traceability Notice:</strong> This Food Safety Passport records verified custody, handling conditions and timing declarations. It establishes transparent accountability throughout rescue logistics.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-cream border-t border-sage flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-forest text-white rounded-subtle font-medium text-xs hover:bg-forest-dark transition-all"
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
};
