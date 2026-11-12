import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ShieldCheck, 
  Sparkles, 
  Navigation, 
  MapPin, 
  Users, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  HeartHandshake, 
  Flame, 
  Clock, 
  QrCode,
  Truck,
  RotateCcw
} from 'lucide-react';
import { TamilNaduMap } from '../../components/maps/TamilNaduMap';
import { store } from '../../services/store';
import { QRPassportModal } from '../../components/qr/QRPassportModal';
import { FoodListing } from '../../types';

export const LandingPage: React.FC = () => {
  const { switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const listings = store.getListings();
  const orgs = store.getProfiles().map(p => ({
    id: `org-${p.id}`,
    profile_id: p.id,
    organisation_name: p.full_name,
    organisation_type: p.role === 'NGO' ? 'NGO Shelter' : 'Donor Kitchen',
    address: p.location || 'Coimbatore',
    city: p.city,
    latitude: p.latitude,
    longitude: p.longitude,
    contact_phone: p.phone || '',
    verification_status: 'verified' as const,
    receiving_capacity_kg: 100,
    storage_capabilities: ['refrigeration'],
    operating_hours: '08:00 - 22:00'
  }));
  const hotspots = store.getHotspots();
  const hubs = store.getHubs();

  const [selectedPassportListing, setSelectedPassportListing] = useState<FoodListing | null>(null);

  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream via-cream to-white pt-12 pb-16 border-b border-sage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest/10 text-forest text-xs font-bold">
                <Sparkles className="w-4 h-4 text-orange-warm" />
                <span>AI-Powered Food Rescue & Redistribution Ecosystem</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal tracking-tight leading-[1.15]">
                Every Meal Deserves a Destination.
              </h1>

              <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
                UnavuLink connects surplus food with communities that need it through intelligent matching, safer handling, verified delivery and coordinated rescue operations across Tamil Nadu.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => {
                    switchDemoRole('Donor');
                    navigate('/donor/donate');
                  }}
                  className="px-6 py-3.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-sm transition-all shadow-md flex items-center gap-2 group"
                >
                  <span>Donate Food</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  to="/map"
                  className="px-6 py-3.5 bg-white border border-sage text-charcoal hover:border-forest rounded-subtle font-bold text-sm transition-all shadow-xs flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-orange-warm" />
                  <span>Explore Food Map</span>
                </Link>

                <button
                  onClick={() => {
                    switchDemoRole('Common People');
                    navigate('/community/volunteer');
                  }}
                  className="px-5 py-3.5 bg-orange-warm hover:bg-orange-warm/90 text-white rounded-subtle font-bold text-sm transition-all shadow-xs flex items-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Become a Volunteer</span>
                </button>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-charcoal">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-sage shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-status-success" />
                  <span>FSSAI Compliant Safety Gate</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-sage shadow-2xs">
                  <QrCode className="w-4 h-4 text-forest" />
                  <span>QR Food Safety Passport</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-sage shadow-2xs">
                  <RotateCcw className="w-4 h-4 text-orange-warm" />
                  <span>Self-Recovering Logistics</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual: Live Rescue Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-card shadow-lift border border-sage p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-sage/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-status-success animate-ping"></span>
                    <span className="font-extrabold text-xs text-charcoal uppercase tracking-wider">
                      Live Tamil Nadu Rescue
                    </span>
                  </div>
                  <span className="text-[11px] font-bold bg-orange-warm/15 text-orange-warm px-2 py-0.5 rounded-full">
                    Active Dispatch
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-charcoal text-base">South Indian Sambar Rice & Poriyal</h3>
                      <p className="text-xs text-muted">Grand Palace Banquet, Peelamedu, Coimbatore</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-forest bg-forest/10 px-2 py-1 rounded">
                      60 kg
                    </span>
                  </div>

                  {/* Route Bar */}
                  <div className="bg-cream p-3 rounded-subtle border border-sage space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Destination:</span>
                      <span className="font-bold text-charcoal">Anbalayam Children Shelter (7.8 km)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Assigned Volunteer:</span>
                      <span className="font-bold text-forest">Karthik Subramanian (Bike)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Estimated Arrival:</span>
                      <span className="font-extrabold text-orange-warm">22 mins remaining</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setSelectedPassportListing(listings[1] || listings[0])}
                      className="text-xs font-bold text-forest hover:text-forest-dark flex items-center gap-1.5"
                    >
                      <QrCode className="w-4 h-4 text-orange-warm" />
                      <span>View Food Safety Passport</span>
                    </button>
                    <span className="text-[11px] text-muted">Batch: UNV-2026-CBE-002</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE IMPACT COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-card border border-sage shadow-soft text-center space-y-1">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Food Rescued</span>
            <div className="text-3xl font-extrabold text-forest">14,280 kg</div>
            <span className="text-[11px] text-muted">From caterers & banquets</span>
          </div>
          <div className="bg-white p-5 rounded-card border border-sage shadow-soft text-center space-y-1">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Verified Meals Served</span>
            <div className="text-3xl font-extrabold text-orange-warm">31,730</div>
            <span className="text-[11px] text-muted">Confirmed receipt by NGOs</span>
          </div>
          <div className="bg-white p-5 rounded-card border border-sage shadow-soft text-center space-y-1">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">CO2 Emissions Avoided</span>
            <div className="text-3xl font-extrabold text-forest-kelly">28.5 Tons</div>
            <span className="text-[11px] text-muted">Environmental offset</span>
          </div>
          <div className="bg-white p-5 rounded-card border border-sage shadow-soft text-center space-y-1">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Active Rescues</span>
            <div className="text-3xl font-extrabold text-cherry">4 Active</div>
            <span className="text-[11px] text-muted">Coimbatore & Salem hubs</span>
          </div>
        </div>
      </section>

      {/* HOW UNAVULINK WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-forest uppercase tracking-wider">Ecosystem Architecture</span>
          <h2 className="text-3xl font-extrabold text-charcoal">How UnavuLink Operates</h2>
          <p className="text-sm text-muted">A closed-loop, safety-first workflow connecting surplus donors to community tables.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-extrabold text-base">
              1
            </div>
            <h3 className="font-bold text-charcoal text-base">AI Surplus Posting</h3>
            <p className="text-xs text-muted leading-relaxed">
              Donors snap food photos. Gemini Vision suggests portion size, ingredients and allergens. Donor reviews and approves the listing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-extrabold text-base">
              2
            </div>
            <h3 className="font-bold text-charcoal text-base">Safety Eligibility Gate</h3>
            <p className="text-xs text-muted leading-relaxed">
              Automatic validation checks preparation timestamp, storage temperature, handling window, and generates the unique QR Food Safety Passport.
            </p>
          </div>

          <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-extrabold text-base">
              3
            </div>
            <h3 className="font-bold text-charcoal text-base">FairShare Matching</h3>
            <p className="text-xs text-muted leading-relaxed">
              Engine prioritizes recipient suitability based on dietary preferences, capacity, and historical unmet need—not just distance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-extrabold text-base">
              4
            </div>
            <h3 className="font-bold text-charcoal text-base">Dual OTP Handover</h3>
            <p className="text-xs text-muted leading-relaxed">
              Volunteer collects with Pickup OTP. NGO scans QR and confirms delivery with Delivery OTP. Quantity verified at both points.
            </p>
          </div>
        </div>
      </section>

      {/* REAL TAMIL NADU MAP PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-forest uppercase tracking-wider">Geospatial Intelligence</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal">Interactive Tamil Nadu Food Map</h2>
            <p className="text-xs text-muted">Explore real-time surplus batches, verified NGOs, community fridges and hotspots.</p>
          </div>
          <Link
            to="/map"
            className="px-4 py-2 bg-forest text-white rounded-subtle font-bold text-xs hover:bg-forest-dark transition-all self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>Open Fullscreen Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <TamilNaduMap
          listings={listings}
          organizations={orgs}
          hotspots={hotspots}
          hubs={hubs}
          height="450px"
        />
      </section>

      {/* STANDOUT INNOVATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-orange-warm uppercase tracking-wider">Hackathon Signature Features</span>
          <h2 className="text-3xl font-extrabold text-charcoal">Built to Prevent Failure Before It Happens</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cherry/10 text-cherry flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-charcoal text-base">Rescue Failure Recovery</h3>
            <p className="text-xs text-muted leading-relaxed">
              If an assigned volunteer breaks down or an NGO suddenly overflows, the self-healing recovery engine reassigns the batch immediately within the safe window.
            </p>
          </div>

          <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-charcoal text-base">Food Rescue Digital Twin</h3>
            <p className="text-xs text-muted leading-relaxed">
              Simulates volunteer cancellations, traffic gridlocks and capacity shocks on Tamil Nadu highway corridors to stress-test logistics before real deployment.
            </p>
          </div>

          <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-warm/10 text-orange-warm flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-charcoal text-base">Batch Quarantine & Recall</h3>
            <p className="text-xs text-muted leading-relaxed">
              Any reported odor or temperature hazard immediately locks the batch across all recipient views, stopping dispatches and preserving community safety.
            </p>
          </div>
        </div>
      </section>

      {/* QR Passport Modal if triggered */}
      <QRPassportModal
        listing={selectedPassportListing}
        onClose={() => setSelectedPassportListing(null)}
      />
    </div>
  );
};
