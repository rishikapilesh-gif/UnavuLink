import React, { useState } from 'react';
import { RescueMission, MissionStatus } from '../../types';
import { store } from '../../services/store';
import { OtpModal } from '../common/OtpModal';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Truck, 
  KeyRound, 
  ShieldCheck, 
  Navigation, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveTrackingViewProps {
  mission: RescueMission;
  onUpdate?: () => void;
}

const MILESTONES: { status: MissionStatus; label: string; description: string }[] = [
  { status: 'created', label: 'Request Submitted', description: 'Shelter requested batch allocation' },
  { status: 'volunteer_assigned', label: 'Volunteer Assigned', description: 'Volunteer accepted rescue route' },
  { status: 'picked_up', label: 'Food Picked Up', description: 'Hygienically verified at donor kitchen' },
  { status: 'in_transit', label: 'In Transit', description: 'Temperature-monitored corridor transit' },
  { status: 'delivered', label: 'Delivered', description: 'Shelter confirmed safe handover' },
  { status: 'completed', label: 'Receipt Confirmed', description: 'Meals logged into community ledger' }
];

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({ mission, onUpdate }) => {
  const [activeOtpStage, setActiveOtpStage] = useState<'pickup' | 'delivery' | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Determine current active step index
  const getStepIndex = (status: MissionStatus) => {
    switch (status) {
      case 'created': return 0;
      case 'volunteer_assigned':
      case 'volunteer_en_route':
      case 'at_pickup': return 1;
      case 'picked_up': return 2;
      case 'in_transit':
      case 'at_destination': return 3;
      case 'delivered': return 4;
      case 'completed': return 5;
      default: return 1;
    }
  };

  const currentStep = getStepIndex(mission.mission_status);

  // Friendly status headline
  const getFriendlyStatus = () => {
    switch (mission.mission_status) {
      case 'created':
        return { title: 'Donation Approved!', subtitle: 'Matching nearest available volunteer...' };
      case 'volunteer_assigned':
        return { title: `${mission.volunteer_name || 'Volunteer'} is en route to pickup!`, subtitle: 'Estimated arrival at kitchen in 12 mins.' };
      case 'picked_up':
        return { title: 'Food safely collected!', subtitle: 'Volunteer is heading to the destination shelter.' };
      case 'in_transit':
        return { title: 'Your rescue is in transit!', subtitle: 'Maintained in thermo-insulated catering drums.' };
      case 'delivered':
        return { title: 'Food delivered to shelter!', subtitle: 'Shelter confirmed delivery OTP.' };
      case 'completed':
        return { title: 'Rescue Completed!', subtitle: 'Verified meals distributed to community tables.' };
      default:
        return { title: 'Rescue in progress', subtitle: 'Coordinating logistics.' };
    }
  };

  const statusInfo = getFriendlyStatus();

  return (
    <div className="bg-white rounded-card border border-sage shadow-soft overflow-hidden text-xs space-y-6 p-6">
      {/* Top Delivery Headline (Swiggy Tracking Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sage/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-ping" />
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-forest bg-forest/10 px-2 py-0.5 rounded">
              {mission.batch_id}
            </span>
            <span className="text-muted">• ETA: ~{mission.estimated_duration_mins} mins</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal tracking-tight">
            {statusInfo.title}
          </h2>
          <p className="text-xs text-muted">{statusInfo.subtitle}</p>
        </div>

        {/* Live Distance Pill */}
        <div className="bg-cream px-4 py-2.5 rounded-subtle border border-sage text-center shrink-0">
          <span className="text-[10px] text-muted block font-semibold uppercase">Route Distance</span>
          <span className="text-lg font-extrabold text-charcoal">{mission.distance_km} km</span>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-forest/10 border border-forest/30 text-forest rounded-subtle flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Swiggy-Style Milestone Tracker */}
      <div className="space-y-3">
        <h4 className="font-bold text-charcoal uppercase tracking-wider text-[11px]">Rescue Milestone Progress</h4>
        
        {/* Horizontal Progress Bar for Desktop, Vertical for Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {MILESTONES.map((m, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={m.status}
                className={`p-3 rounded-subtle border transition-all text-center space-y-1 ${
                  isCurrent
                    ? 'bg-forest text-white border-forest shadow-md ring-2 ring-forest/20'
                    : isDone
                    ? 'bg-forest/10 border-forest/30 text-forest font-semibold'
                    : 'bg-cream/40 border-sage/60 text-muted'
                }`}
              >
                <div className="flex items-center justify-center">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-forest" />
                  ) : (
                    <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      isCurrent ? 'bg-white text-forest' : 'bg-sage/60 text-charcoal'
                    }`}>
                      {idx + 1}
                    </span>
                  )}
                </div>
                <span className="font-bold text-[11px] block leading-tight">{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Volunteer Driver Card (Swiggy Driver Profile style) */}
      <div className="p-4 bg-cream rounded-subtle border border-sage flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-forest text-white flex items-center justify-center text-lg font-bold shadow-xs shrink-0">
            {mission.volunteer_name ? mission.volunteer_name.charAt(0) : 'K'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-charcoal text-sm">{mission.volunteer_name || 'Karthik Subramanian'}</span>
              <span className="bg-status-success/20 text-status-success font-extrabold text-[10px] px-2 py-0.2 rounded-full">
                ★ 4.9 Volunteer
              </span>
            </div>
            <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
              <Truck className="w-3.5 h-3.5 text-forest" />
              <span>Two-Wheeler with Insulated Food Thermal Bag</span>
            </p>
          </div>
        </div>

        {/* Handover OTP Action Trigger Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white px-3 py-1.5 rounded border border-sage text-center">
            <span className="text-[9px] text-muted block uppercase font-bold">Pickup OTP</span>
            <span className="font-mono font-extrabold text-forest text-sm tracking-wider">{mission.pickup_otp}</span>
          </div>

          <div className="bg-white px-3 py-1.5 rounded border border-sage text-center">
            <span className="text-[9px] text-muted block uppercase font-bold">Delivery OTP</span>
            <span className="font-mono font-extrabold text-orange-warm text-sm tracking-wider">{mission.delivery_otp}</span>
          </div>

          {currentStep <= 1 && (
            <button
              onClick={() => setActiveOtpStage('pickup')}
              className="px-3.5 py-2 bg-forest hover:bg-forest-dark text-white rounded font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Enter Pickup OTP</span>
            </button>
          )}

          {currentStep >= 2 && currentStep <= 3 && (
            <button
              onClick={() => setActiveOtpStage('delivery')}
              className="px-3.5 py-2 bg-orange-warm hover:bg-orange-warm/90 text-white rounded font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Enter Delivery OTP</span>
            </button>
          )}
        </div>
      </div>

      {/* Pickup & Destination Addresses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 bg-white border border-sage rounded-subtle space-y-1">
          <span className="text-[10px] text-muted block uppercase font-bold">Pickup Location (Donor)</span>
          <p className="font-bold text-charcoal">{mission.pickup_address}</p>
          <span className="text-[11px] text-forest font-semibold block">Donor: {mission.donor_name}</span>
        </div>

        <div className="p-3 bg-white border border-sage rounded-subtle space-y-1">
          <span className="text-[10px] text-muted block uppercase font-bold">Destination (Shelter)</span>
          <p className="font-bold text-charcoal">{mission.delivery_address}</p>
          <span className="text-[11px] text-blue-700 font-semibold block">Recipient: {mission.recipient_name}</span>
        </div>
      </div>

      {/* OTP Modal */}
      <OtpModal
        isOpen={Boolean(activeOtpStage)}
        stage={activeOtpStage || 'pickup'}
        title={activeOtpStage === 'pickup' ? 'Verify Pickup Handover' : 'Verify Delivery Handover'}
        correctOtp={activeOtpStage === 'pickup' ? mission.pickup_otp : mission.delivery_otp}
        onSuccess={() => {
          if (activeOtpStage === 'pickup') {
            const res = store.confirmPickupHandover(mission.id, mission.pickup_otp);
            setNotice(res.message);
          } else if (activeOtpStage === 'delivery') {
            const res = store.confirmDeliveryHandover(mission.id, mission.delivery_otp);
            setNotice(res.message);
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
          setActiveOtpStage(null);
          if (onUpdate) onUpdate();
        }}
        onClose={() => setActiveOtpStage(null)}
      />
    </div>
  );
};
