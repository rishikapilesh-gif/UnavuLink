import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  Sparkles,
  Play,
  Pause,
  MessageSquare
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
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(35); // default 35% in transit
  const [etaRemaining, setEtaRemaining] = useState(mission.estimated_duration_mins || 15);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routePointsRef = useRef<[number, number][]>([]);

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

  // Initialize mini Leaflet route map with OSRM routing
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    const pLat = mission.pickup_lat || 11.0168;
    const pLng = mission.pickup_lng || 76.9558;
    const dLat = mission.delivery_lat || 11.0264;
    const dLng = mission.delivery_lng || 76.9421;

    const map = L.map(mapRef.current, {
      center: [(pLat + dLat) / 2, (pLng + dLng) / 2],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(map);

    mapInstanceRef.current = map;

    // Custom icons
    const donorIcon = L.divIcon({
      className: 'donor-pin',
      html: `<div style="background:#2E6B3F;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,0.3);border:2px solid white;font-size:12px;">🍲</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const dropIcon = L.divIcon({
      className: 'drop-pin',
      html: `<div style="background:#1E40AF;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,0.3);border:2px solid white;font-size:12px;">🏠</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const scooterIcon = L.divIcon({
      className: 'scooter-pin',
      html: `<div style="background:#F28C28;color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(242,140,40,0.6);border:2px solid white;font-size:15px;animation:pulse 1.5s infinite;">🛵</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    // Add pickup and drop markers
    L.marker([pLat, pLng], { icon: donorIcon })
      .bindPopup(`<b>Pickup:</b> ${mission.pickup_address}`)
      .addTo(map);

    L.marker([dLat, dLng], { icon: dropIcon })
      .bindPopup(`<b>Drop:</b> ${mission.delivery_address}`)
      .addTo(map);

    // Initial vehicle position
    const vLat = pLat + (dLat - pLat) * (simProgress / 100);
    const vLng = pLng + (dLng - pLng) * (simProgress / 100);
    const vMarker = L.marker([vLat, vLng], { icon: scooterIcon }).addTo(map);
    vehicleMarkerRef.current = vMarker;

    // Fetch real road polyline from OSRM public API with fallback
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`;

    fetch(osrmUrl)
      .then(res => res.json())
      .then(data => {
        if (data.routes && data.routes[0]) {
          const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
          routePointsRef.current = coords;
          const polyline = L.polyline(coords, {
            color: '#2E6B3F',
            weight: 5,
            opacity: 0.85,
            dashArray: '8, 8'
          }).addTo(map);
          routePolylineRef.current = polyline;
          map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
        } else {
          throw new Error('OSRM empty');
        }
      })
      .catch(() => {
        // Fallback straight interpolated line
        const fallbackCoords: [number, number][] = [
          [pLat, pLng],
          [pLat + (dLat - pLat) * 0.4, pLng + (dLng - pLng) * 0.35 + 0.005],
          [pLat + (dLat - pLat) * 0.7, pLng + (dLng - pLng) * 0.75 - 0.003],
          [dLat, dLng]
        ];
        routePointsRef.current = fallbackCoords;
        const polyline = L.polyline(fallbackCoords, {
          color: '#2E6B3F',
          weight: 5,
          opacity: 0.85
        }).addTo(map);
        routePolylineRef.current = polyline;
        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mission]);

  // Handle live simulated motion along the route
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSimProgress(prev => {
        if (prev >= 95) {
          setIsSimulating(false);
          setEtaRemaining(1);
          return 98;
        }
        const next = prev + 5;
        setEtaRemaining(Math.max(1, Math.round((100 - next) * 0.2)));

        // Update scooter marker on map
        if (vehicleMarkerRef.current) {
          const points = routePointsRef.current;
          if (points.length > 0) {
            const index = Math.min(
              points.length - 1,
              Math.floor((next / 100) * points.length)
            );
            vehicleMarkerRef.current.setLatLng(points[index]);
          } else {
            const pLat = mission.pickup_lat || 11.0168;
            const pLng = mission.pickup_lng || 76.9558;
            const dLat = mission.delivery_lat || 11.0264;
            const dLng = mission.delivery_lng || 76.9421;
            const lat = pLat + (dLat - pLat) * (next / 100);
            const lng = pLng + (dLng - pLng) * (next / 100);
            vehicleMarkerRef.current.setLatLng([lat, lng]);
          }
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, mission]);

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

      {/* Interactive Live OSRM Route Map with Real Vehicle Simulation */}
      <div className="space-y-2 border border-sage rounded-subtle p-3 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-forest" />
            <h4 className="font-bold text-charcoal text-xs">Live OSRM Transit Route</h4>
            <span className="text-[10px] text-muted">• Courier is {simProgress}% along route</span>
          </div>

          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
              isSimulating
                ? 'bg-status-danger text-white hover:bg-status-danger/90'
                : 'bg-forest text-white hover:bg-forest-dark'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Motion</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-orange-warm" />
                <span>Simulate Vehicle Movement</span>
              </>
            )}
          </button>
        </div>

        {/* Leaflet Map Div */}
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-lg overflow-hidden border border-sage/60 z-10" 
          style={{ minHeight: '260px' }}
        />

        {/* Route Details Bar */}
        <div className="flex items-center justify-between text-[11px] text-muted px-1 pt-1">
          <span>🟢 Pickup: {mission.pickup_address.substring(0, 32)}...</span>
          <span className="font-extrabold text-forest">ETA: ~{etaRemaining} mins</span>
          <span>🔵 Drop: {mission.delivery_address.substring(0, 32)}...</span>
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

      {/* Contextual In-App Chat Action Bar */}
      <div className="p-4 bg-cream rounded-subtle border border-sage flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs shadow-xs">
            💬
          </div>
          <div>
            <h4 className="font-bold text-charcoal text-xs">Mission Coordination Channel</h4>
            <p className="text-[11px] text-muted">Coordinate directly with {mission.donor_name} &amp; {mission.volunteer_name || 'RescueMate'}.</p>
          </div>
        </div>

        <Link
          to={`/messages`}
          className="px-4 py-2 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Open Mission Chat</span>
        </Link>
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
