import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { TamilNaduMap } from '../../components/maps/TamilNaduMap';
import { QRPassportModal } from '../../components/qr/QRPassportModal';
import { ReportIncidentModal } from '../../components/common/ReportIncidentModal';
import { FoodListing, UserProfile, SafetyIncident } from '../../types';
import { 
  ShieldAlert, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  RotateCcw, 
  Cpu, 
  QrCode, 
  Navigation, 
  Activity, 
  FileText,
  UserCheck,
  Building,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminCommandCentre: React.FC = () => {
  const { user } = useAuth();
  const profiles = store.getProfiles();
  const listings = store.getListings();
  const missions = store.getMissions();
  const hotspots = store.getHotspots();
  const hubs = store.getHubs();
  const incidents = store.getIncidents();

  const [selectedPassportListing, setSelectedPassportListing] = useState<FoodListing | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Verification Action
  const handleVerifyUser = (profile: UserProfile) => {
    store.updateProfile({
      ...profile,
      verification_status: 'verified',
      volunteer_approved: profile.is_volunteer ? true : profile.volunteer_approved
    });
    setActionNotice(`User "${profile.full_name}" has been verified and granted active privileges.`);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Standout Demo B Action: Safety Incident Batch Freeze / Recall
  const handleClearBatchFreeze = (batchId: string) => {
    const listing = store.getListingByBatchId(batchId);
    if (listing) {
      store.updateListing({
        ...listing,
        safety_status: 'eligible',
        listing_status: 'available',
        handling_information: 'Cleared by Admin Food Safety Officer after physical re-inspection.'
      });
      setActionNotice(`Batch ${batchId} cleared of quarantine. Returned to normal allocation.`);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  // Emergency Mode Activation
  const handleActivateEmergencyMode = () => {
    const emgListing = listings.find(l => l.is_emergency);
    if (emgListing) {
      setActionNotice(`🚨 EMERGENCY SURPLUS RESCUE ACTIVATED for Batch ${emgListing.batch_id} (250 meals). Auto-notified nearby community kitchens and volunteers!`);
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 }
      });
      setTimeout(() => setActionNotice(null), 5000);
    }
  };

  const verifiedDonors = profiles.filter(p => p.role === 'Donor' && p.verification_status === 'verified').length;
  const verifiedNgos = profiles.filter(p => p.role === 'NGO' && p.verification_status === 'verified').length;
  const approvedVols = profiles.filter(p => p.is_volunteer && p.volunteer_approved).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-card border border-sage shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-ping"></span>
            <span className="text-xs font-bold text-forest uppercase tracking-wider">State Platform Command</span>
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal">Tamil Nadu Food Rescue Command Centre</h1>
          <p className="text-xs text-muted">
            Logged in as {user?.full_name} • Full Administrative Oversight & Incident Enforcement
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setReportModalOpen(true)}
            className="px-3.5 py-2 bg-cherry hover:bg-cherry-coral text-white rounded-subtle font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>[Demo B] Quarantine Batch</span>
          </button>

          <button
            onClick={handleActivateEmergencyMode}
            className="px-3.5 py-2 bg-orange-warm hover:bg-orange-warm/90 text-white rounded-subtle font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Flame className="w-4 h-4" />
            <span>Emergency Mode</span>
          </button>
        </div>
      </div>

      {/* Action Toast Notification */}
      {actionNotice && (
        <div className="p-4 bg-forest/10 border border-forest/30 text-forest text-xs rounded-subtle flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold">{actionNotice}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-card border border-sage shadow-soft">
          <span className="text-muted block text-[10px] font-bold uppercase">Total Users</span>
          <span className="text-xl font-extrabold text-charcoal">{profiles.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-card border border-sage shadow-soft">
          <span className="text-muted block text-[10px] font-bold uppercase">Verified Donors</span>
          <span className="text-xl font-extrabold text-forest">{verifiedDonors}</span>
        </div>
        <div className="bg-white p-3.5 rounded-card border border-sage shadow-soft">
          <span className="text-muted block text-[10px] font-bold uppercase">Verified NGOs</span>
          <span className="text-xl font-extrabold text-blue-700">{verifiedNgos}</span>
        </div>
        <div className="bg-white p-3.5 rounded-card border border-sage shadow-soft">
          <span className="text-muted block text-[10px] font-bold uppercase">Approved Vols</span>
          <span className="text-xl font-extrabold text-orange-warm">{approvedVols}</span>
        </div>
        <div className="bg-white p-3.5 rounded-card border border-sage shadow-soft">
          <span className="text-muted block text-[10px] font-bold uppercase">Active Missions</span>
          <span className="text-xl font-extrabold text-charcoal">{missions.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-card border border-cherry/40 shadow-soft bg-cherry/5">
          <span className="text-cherry block text-[10px] font-bold uppercase">Active Incidents</span>
          <span className="text-xl font-extrabold text-cherry">{incidents.length}</span>
        </div>
      </div>

      {/* Live Geospatial Command Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-charcoal">Real-Time Operations Map (OpenStreetMap)</h2>
          <span className="text-xs text-muted">Tracking donors, food listings, NGO shelters & community fridges</span>
        </div>
        <TamilNaduMap
          listings={listings}
          hotspots={hotspots}
          hubs={hubs}
          height="450px"
        />
      </div>

      {/* Two Column Grid: Safety Incident Desk & User Verifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Safety Incidents & Batch Quarantines */}
        <div className="lg:col-span-6 bg-white rounded-card p-6 border border-sage shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cherry" />
              <h3 className="font-bold text-sm text-charcoal">Food Safety Incident & Recall Desk</h3>
            </div>
            <span className="text-xs font-bold text-cherry bg-cherry/10 px-2 py-0.5 rounded-full">
              {incidents.length} Quarantined
            </span>
          </div>

          <div className="space-y-3">
            {incidents.map(inc => (
              <div
                key={inc.id}
                className="p-3.5 bg-cherry/5 border border-cherry/30 rounded-subtle text-xs space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cherry bg-white px-2 py-0.5 rounded border border-cherry/20">
                        {inc.batch_id}
                      </span>
                      <span className="font-bold text-charcoal">{inc.incident_type}</span>
                    </div>
                    <p className="text-muted mt-1">{inc.description}</p>
                    <span className="text-[10px] text-muted block mt-1">
                      Reported by: <strong>{inc.reporter_name}</strong> • Severity: <strong>{inc.severity.toUpperCase()}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-cherry/20">
                  <span className="text-[11px] text-cherry font-extrabold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Batch Frozen Across All Portals</span>
                  </span>

                  <button
                    onClick={() => handleClearBatchFreeze(inc.batch_id)}
                    className="px-3 py-1 bg-white border border-sage text-forest hover:bg-forest/10 rounded font-bold text-xs transition-colors"
                  >
                    Clear & Restore Batch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: User & Organisation Verification Queue */}
        <div className="lg:col-span-6 bg-white rounded-card p-6 border border-sage shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-forest" />
              <h3 className="font-bold text-sm text-charcoal">Identity & Verification Approvals</h3>
            </div>
            <span className="text-[11px] text-muted">Role-Based Security Gate</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs">
            {profiles.map(prof => {
              const isVerified = prof.verification_status === 'verified';
              return (
                <div
                  key={prof.id}
                  className="p-3 bg-cream rounded-subtle border border-sage flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-charcoal">{prof.full_name}</span>
                      <span className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded border border-sage">
                        {prof.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted">{prof.email} • {prof.location}</p>
                  </div>

                  <div>
                    {isVerified ? (
                      <span className="text-status-success font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleVerifyUser(prof)}
                        className="px-3 py-1.5 bg-forest hover:bg-forest-dark text-white rounded font-bold text-xs"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* QR Passport Modal */}
      <QRPassportModal
        listing={selectedPassportListing}
        onClose={() => setSelectedPassportListing(null)}
      />

      {/* Report Incident Modal */}
      <ReportIncidentModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};
