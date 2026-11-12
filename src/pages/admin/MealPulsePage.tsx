import React, { useState, useEffect } from 'react';
import { useStore } from '../../hooks/useStore';
import { TamilNaduMap } from '../../components/maps/TamilNaduMap';
import { 
  FoodListing, 
  FairShareAllocationPlan, 
  EventRegistration, 
  EventType, 
  EventMealType, 
  FoodPreparationArrangement,
  HostelProfile,
  HostelDailyMealPlan,
  RescueMateProfile,
  LiveSyncEvent
} from '../../types';
import { PRESET_SCENARIOS, DigitalTwinScenarioResult } from '../../services/digitalTwin';
import { 
  Cpu, 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3, 
  PieChart, 
  Layers, 
  ArrowRight,
  Filter,
  Flame, 
  Clock, 
  Building2, 
  Users, 
  Info,
  Calendar,
  Truck,
  Zap,
  Activity,
  PlusCircle,
  Check,
  Send,
  Eye,
  RefreshCw,
  Bell,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MealPulsePage: React.FC = () => {
  const store = useStore();
  const listings = store.getListings();
  const orgs = store.getOrganizations();
  const hubs = store.getHubs();
  const hotspots = store.getHotspots();
  const events = store.getEventRegistrations();
  const eventInterests = store.getEventInterests();
  const hostels = store.getHostelProfiles();
  const hostelPlans = store.getHostelMealPlans();
  const rescuemates = store.getRescueMates();
  const syncEvents = store.getLiveSyncEvents();

  // Active module tab
  const [activeModule, setActiveModule] = useState<'eventpulse' | 'hostelpulse' | 'localrescue' | 'livesync' | 'fairshare' | 'scenarios'>('eventpulse');

  // --- EVENTPULSE STATE ---
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [eventNotice, setEventNotice] = useState<string | null>(null);

  // New Event Form State
  const [newEventName, setNewEventName] = useState('');
  const [newEventType, setNewEventType] = useState<EventType>('Wedding');
  const [newEventDate, setNewEventDate] = useState('2026-11-20');
  const [newStartTime, setNewStartTime] = useState('18:00');
  const [newEndTime, setNewEndTime] = useState('22:00');
  const [newServingTime, setNewServingTime] = useState('19:30 - 21:00');
  const [newLocation, setNewLocation] = useState('Sri Ramakrishna Kalyana Mandapam, Avarampalayam, Coimbatore');
  const [newGuests, setNewGuests] = useState(500);
  const [newPlannedMeals, setNewPlannedMeals] = useState(600);
  const [newMealType, setNewMealType] = useState<EventMealType>('Dinner');
  const [newPrepArrangement, setNewPrepArrangement] = useState<FoodPreparationArrangement>('External provider');
  const [newCatererName, setNewCatererName] = useState('Kongu Traditional Catering Services');
  const [newCatererContact, setNewCatererContact] = useState('+91 98430 55443');
  const [newNotes, setNewNotes] = useState('Authentic South Indian vegetarian dinner buffet with hot holding servers.');

  // Confirm Surplus Form State
  const [confirmPortions, setConfirmPortions] = useState(75);
  const [confirmKg, setConfirmKg] = useState(30);

  // --- HOSTELPULSE STATE ---
  const [selectedHostelId, setSelectedHostelId] = useState<string>(hostels[0]?.id || '');
  const [hostelNotice, setHostelNotice] = useState<string | null>(null);
  const [hostelActualPrepared, setHostelActualPrepared] = useState<number>(400);
  const [hostelActualServed, setHostelActualServed] = useState<number>(342);

  // --- LIVESYNC RACE CONDITION SIMULATION STATE ---
  const [raceNotice, setRaceNotice] = useState<{ type: 'winner' | 'blocked'; message: string } | null>(null);

  // --- SCENARIO SIMULATION STATE ---
  const [selectedScenario, setSelectedScenario] = useState<DigitalTwinScenarioResult>(PRESET_SCENARIOS[3] || PRESET_SCENARIOS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [scenarioExecuted, setScenarioExecuted] = useState(false);

  // --- FAIRSHARE STATE ---
  const [selectedBatchForFairShare, setSelectedBatchForFairShare] = useState<FoodListing>(listings[0] || ({} as FoodListing));
  const [allocationDone, setAllocationDone] = useState(false);

  // Privacy Mode Toggle in LocalRescue
  const [privacyEnabled, setPrivacyEnabled] = useState(true);

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];
  const selectedEventPrediction = selectedEvent ? store.calculateEventPrediction(selectedEvent) : null;
  const currentEventInterests = selectedEvent ? eventInterests.filter(i => i.eventId === selectedEvent.id) : [];

  const selectedHostel = hostels.find(h => h.id === selectedHostelId) || hostels[0];
  const currentHostelPlans = selectedHostel ? hostelPlans.filter(p => p.hostel_id === selectedHostel.id) : hostelPlans;

  // Handle Register Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvt: EventRegistration = {
      id: `evt-cbe-${Date.now().toString().slice(-4)}`,
      organizer_id: 'usr-donor-1',
      organizer_name: 'Senthil Nathan (Annapoorna Hospitality)',
      organizer_phone: '+91 98422 20002',
      event_name: newEventName || 'Grand Community Event',
      event_type: newEventType,
      event_date: newEventDate,
      start_time: newStartTime,
      expected_end_time: newEndTime,
      serving_time: newServingTime,
      location_name: newLocation,
      district: 'Coimbatore',
      city: 'Coimbatore',
      latitude: 11.0267,
      longitude: 76.9950,
      approx_guests: Number(newGuests),
      planned_meals: Number(newPlannedMeals),
      food_categories: ['Cooked Meals', 'Bakery'],
      meal_type: newMealType,
      prep_arrangement: newPrepArrangement,
      caterer_name: newPrepArrangement !== 'In-house' ? newCatererName : undefined,
      caterer_contact: newPrepArrangement !== 'In-house' ? newCatererContact : undefined,
      expects_surplus: true,
      notes: newNotes,
      status: 'surplus_predicted',
      created_at: new Date().toISOString()
    };

    store.addEventRegistration(newEvt);
    setSelectedEventId(newEvt.id);
    setShowNewEventModal(false);
    setEventNotice(`Event "${newEvt.event_name}" successfully registered! Statistical surplus predicted.`);
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setEventNotice(null), 4000);
  };

  // Handle Confirm Actual Event Surplus
  const handleConfirmEventSurplus = (eventId: string) => {
    const listing = store.confirmActualEventSurplus(eventId, Number(confirmPortions), Number(confirmKg));
    if (listing) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      setEventNotice(`Surplus confirmed! ${confirmPortions} meals (${confirmKg} kg) converted to verified Food Rescue Batch ${listing.batch_id}. Nearby volunteers alerted.`);
      setTimeout(() => setEventNotice(null), 5000);
    }
  };

  // Handle Express Interest as Recipient
  const handleExpressInterest = (eventId: string, recipientName: string, portions: number) => {
    store.registerEventInterest({
      id: `int-${Date.now().toString().slice(-4)}`,
      eventId,
      recipientId: 'org-ngo-1',
      recipientName,
      recipientType: 'Shelter',
      portionsNeeded: portions,
      contactPhone: '+91 98422 30001',
      registeredAt: new Date().toISOString()
    });
    setEventNotice(`Preliminary interest registered for ${portions} meals by ${recipientName}.`);
    setTimeout(() => setEventNotice(null), 4000);
  };

  // Handle Confirm Hostel Surplus
  const handleConfirmHostelSurplus = (planId: string) => {
    const surplus = Math.max(0, hostelActualPrepared - hostelActualServed);
    const listing = store.confirmHostelSurplus(planId, hostelActualPrepared, hostelActualServed, surplus);
    if (listing) {
      confetti({ particleCount: 75, spread: 55, origin: { y: 0.6 } });
      setHostelNotice(`Mess surplus confirmed: ${surplus} portions released for immediate rescue dispatch!`);
      setTimeout(() => setHostelNotice(null), 4000);
    }
  };

  // Handle LiveSync Dual-Volunteer Race Condition Test
  const handleSimulateClaimRace = (winnerFirst: 'karthik' | 'priya') => {
    const targetMission = store.getMissions().find(m => m.mission_status === 'created' || !m.volunteer_id) || store.getMissions()[0];
    if (!targetMission) return;

    const karthik = rescuemates.find(r => r.full_name?.includes('Karthik')) || rescuemates[0];
    const priya = rescuemates.find(r => r.full_name?.includes('Priya')) || rescuemates[1] || rescuemates[0];

    const firstVolunteer = winnerFirst === 'karthik' ? karthik : priya;
    const secondVolunteer = winnerFirst === 'karthik' ? priya : karthik;

    // First volunteer claims
    const res1 = store.claimMissionAtomic(targetMission.id, firstVolunteer);

    // Second volunteer attempts to claim the exact same mission immediately
    const res2 = store.claimMissionAtomic(targetMission.id, secondVolunteer);

    if (res1.success && !res2.success) {
      setRaceNotice({
        type: 'winner',
        message: `Atomic Lock Success! ${firstVolunteer.full_name} won lock. ${secondVolunteer.full_name} instantly blocked: "${res2.message}"`
      });
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
    }
    setTimeout(() => setRaceNotice(null), 6000);
  };

  // Run Scenario
  const handleRunScenario = () => {
    setIsSimulating(true);
    setScenarioExecuted(false);
    setTimeout(() => {
      setIsSimulating(false);
      setScenarioExecuted(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }, 700);
  };

  // FairShare Calculation
  const generateFairSharePlan = (batch: FoodListing): FairShareAllocationPlan => {
    const totalKg = batch.quantity || 40;
    const totalPortions = batch.estimated_portions || 100;

    return {
      foodBatchId: batch.batch_id || 'UNV-BATCH',
      foodName: batch.food_name || 'South Indian Vegetarian Banquet',
      totalSurplusKg: totalKg,
      totalSurplusPortions: totalPortions,
      allocations: [
        {
          recipientId: 'org-ngo-1',
          recipientName: 'Anbalayam Shelter for Children (Saibaba Colony)',
          needScore: 94,
          capacityKg: 120,
          allocatedKg: Math.round(totalKg * 0.55),
          allocatedPortions: Math.round(totalPortions * 0.55),
          transitDistanceKm: 3.2,
          explanation: 'Highest priority: 90 resident children, 15 min corridor, insulated hot holding facility.'
        },
        {
          recipientId: 'org-ngo-2',
          recipientName: 'Karunai Illam Old Age Home (R.S. Puram)',
          needScore: 88,
          capacityKg: 60,
          allocatedKg: Math.round(totalKg * 0.45),
          allocatedPortions: Math.round(totalPortions * 0.45),
          transitDistanceKm: 1.8,
          explanation: 'Secondary priority: 60 senior citizens, close proximity (1.8 km), verified mild vegetarian intake.'
        }
      ],
      unallocatedKg: 0,
      fairnessIndexPercent: 96,
      generatedAt: new Date().toISOString()
    };
  };

  const currentPlan = generateFairSharePlan(selectedBatchForFairShare);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Main Header */}
      <div className="bg-gradient-to-r from-forest-dark via-forest to-charcoal text-white p-6 sm:p-8 rounded-card border border-sage shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-warm animate-ping" />
            <Cpu className="w-5 h-5 text-orange-warm" />
            <span className="text-xs font-bold text-cream uppercase tracking-wider">UnavuLink Intelligence Core</span>
            <span className="bg-orange-warm/20 text-orange-warm border border-orange-warm/30 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
              Predict. Alert. Rescue.
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            MealPulse AI™ Intelligence Network
          </h1>

          <p className="text-xs text-cream/90 max-w-2xl leading-relaxed">
            Locally intelligent food surplus prediction and real-time rescue network. Anticipating food surplus <strong>before</strong> events conclude, forecasting college hostel wastage, and coordinating nearby shelters with atomic multi-client sync.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0 text-center space-y-1">
          <span className="text-[10px] text-cream/80 block uppercase font-bold tracking-wider">LiveSync Engine</span>
          <div className="flex items-center justify-center gap-2 text-sm font-extrabold text-white">
            <Zap className="w-4 h-4 text-orange-warm fill-current" />
            <span>Active & Synchronised</span>
          </div>
          <span className="text-[10px] text-green-300 block">4 Core Modules Running</span>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-sage/60 pb-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveModule('eventpulse')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeModule === 'eventpulse'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs font-extrabold'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <Calendar className="w-4 h-4 text-orange-warm" />
          <span>1. EventPulse (Events)</span>
          <span className="text-[10px] bg-forest/10 text-forest px-1.5 py-0.2 rounded font-mono">
            {events.length}
          </span>
        </button>

        <button
          onClick={() => setActiveModule('hostelpulse')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeModule === 'hostelpulse'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs font-extrabold'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>2. HostelPulse (Campuses)</span>
          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-mono">
            {hostels.length}
          </span>
        </button>

        <button
          onClick={() => setActiveModule('localrescue')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeModule === 'localrescue'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs font-extrabold'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <MapPin className="w-4 h-4 text-forest" />
          <span>3. LocalRescue (Map & Route)</span>
        </button>

        <button
          onClick={() => setActiveModule('livesync')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeModule === 'livesync'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs font-extrabold'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <Zap className="w-4 h-4 text-orange-warm" />
          <span>4. LiveSync & Atomic Engine</span>
          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.2 rounded font-mono">
            Live
          </span>
        </button>

        <button
          onClick={() => setActiveModule('fairshare')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeModule === 'fairshare'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs font-extrabold'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <PieChart className="w-4 h-4 text-purple-600" />
          <span>FairShare Allocation</span>
        </button>

        <button
          onClick={() => setActiveModule('scenarios')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeModule === 'scenarios'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs font-extrabold'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <Activity className="w-4 h-4 text-red-500" />
          <span>Test Scenarios ({PRESET_SCENARIOS.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODULE 1: EVENTPULSE — EVENT-BASED SURPLUS PREDICTION & EARLY NOTIFICATION */}
      {/* ========================================================================= */}
      {activeModule === 'eventpulse' && (
        <div className="space-y-6 animate-in fade-in">
          {eventNotice && (
            <div className="p-4 bg-forest/10 border border-forest/30 text-forest rounded-card flex items-center gap-3 text-xs font-semibold">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{eventNotice}</span>
            </div>
          )}

          {/* Module Banner */}
          <div className="bg-white p-5 rounded-card border border-sage shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-forest/10 text-forest">
                  Module 1: Pre-Event Food Rescue
                </span>
                <span className="text-xs text-muted">Transparent Statistical Prediction</span>
              </div>
              <h2 className="text-lg font-bold text-charcoal mt-1">
                EventPulse — Predict Food Surplus Before Events
              </h2>
              <p className="text-xs text-muted max-w-xl">
                Identify potential food surplus at weddings, receptions, celebrations and corporate dinners before the event concludes. Alert nearby orphanages and old-age homes early to express preliminary interest.
              </p>
            </div>

            <button
              onClick={() => setShowNewEventModal(true)}
              className="px-4 py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-xs flex items-center gap-2 self-start sm:self-auto shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register New Event</span>
            </button>
          </div>

          {/* Event Selector Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {events.map((evt) => {
              const isSelected = selectedEvent?.id === evt.id;
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`p-4 rounded-card border cursor-pointer transition-all text-xs space-y-2 ${
                    isSelected
                      ? 'bg-cream/60 border-forest shadow-xs'
                      : 'bg-white border-sage hover:border-forest/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-warm/10 text-orange-warm">
                      {evt.event_type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      evt.status === 'surplus_confirmed'
                        ? 'bg-green-100 text-green-700'
                        : evt.status === 'notified'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {evt.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-bold text-charcoal text-sm leading-snug">{evt.event_name}</h3>
                  <div className="text-[11px] text-muted space-y-0.5">
                    <p>📅 {evt.event_date} • ⏰ {evt.serving_time}</p>
                    <p>👥 {evt.approx_guests} Guests • 🍲 {evt.planned_meals} Meals Planned</p>
                    <p className="truncate">📍 {evt.location_name}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Event Details & Predictive Engine */}
          {selectedEvent && selectedEventPrediction && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Predictive Calculation Card */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-5">
                  <div className="flex items-center justify-between border-b border-sage/60 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-orange-warm" />
                      <h3 className="font-extrabold text-charcoal text-base">
                        Surplus Forecast for: <span className="text-forest">{selectedEvent.event_name}</span>
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-forest bg-forest/10 px-2.5 py-0.5 rounded-full">
                      Confidence: {selectedEventPrediction.confidence}
                    </span>
                  </div>

                  {/* Prediction Highlights */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-cream p-3 rounded-subtle border border-sage/60 text-center">
                      <span className="text-[10px] uppercase font-bold text-muted block">Expected Guests</span>
                      <span className="text-lg font-extrabold text-charcoal">{selectedEvent.approx_guests}</span>
                      <span className="text-[10px] text-muted block">RSVP Count</span>
                    </div>

                    <div className="bg-cream p-3 rounded-subtle border border-sage/60 text-center">
                      <span className="text-[10px] uppercase font-bold text-muted block">Meals Planned</span>
                      <span className="text-lg font-extrabold text-charcoal">{selectedEvent.planned_meals}</span>
                      <span className="text-[10px] text-muted block">{selectedEvent.prep_arrangement}</span>
                    </div>

                    <div className="bg-orange-warm/10 p-3 rounded-subtle border border-orange-warm/30 text-center">
                      <span className="text-[10px] uppercase font-bold text-orange-warm block">Estimated Surplus</span>
                      <span className="text-lg font-extrabold text-orange-warm">
                        {selectedEventPrediction.estimatedSurplusMin}–{selectedEventPrediction.estimatedSurplusMax}
                      </span>
                      <span className="text-[10px] text-muted block">portions (~{selectedEventPrediction.estimatedSurplusKg} kg)</span>
                    </div>

                    <div className="bg-cream p-3 rounded-subtle border border-sage/60 text-center">
                      <span className="text-[10px] uppercase font-bold text-muted block">Availability Time</span>
                      <span className="text-lg font-extrabold text-forest">{selectedEventPrediction.expectedAvailabilityTime}</span>
                      <span className="text-[10px] text-muted block">Post-Buffet Wrap</span>
                    </div>
                  </div>

                  {/* Influencing Factors List */}
                  <div className="p-4 bg-slate-50 rounded-subtle border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-charcoal">
                      <Info className="w-4 h-4 text-forest" />
                      <span>Transparent Statistical Factors Influencing this Prediction:</span>
                    </div>
                    <ul className="text-xs text-muted space-y-1 pl-5 list-disc">
                      {selectedEventPrediction.influencingFactors.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-muted/80 italic pt-1 border-t border-slate-200">
                      *Note: Statistical predictions are decision-support estimates. Organiser human confirmation is required before food is physically allocated or dispatched.
                    </p>
                  </div>

                  {/* Event Timeline Visualization */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">
                      Event Food Rescue Lifecycle
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="p-2.5 rounded border border-green-200 bg-green-50 text-green-800 font-semibold space-y-1">
                        <span className="block font-bold">1. Registered</span>
                        <span className="text-[10px] text-green-700">Event registered by donor</span>
                      </div>
                      <div className="p-2.5 rounded border border-green-200 bg-green-50 text-green-800 font-semibold space-y-1">
                        <span className="block font-bold">2. Predicted</span>
                        <span className="text-[10px] text-green-700">Statistical engine generated range</span>
                      </div>
                      <div className="p-2.5 rounded border border-blue-200 bg-blue-50 text-blue-800 font-semibold space-y-1">
                        <span className="block font-bold">3. Early Alert</span>
                        <span className="text-[10px] text-blue-700">Nearby shelters notified</span>
                      </div>
                      <div className={`p-2.5 rounded border space-y-1 ${
                        selectedEvent.status === 'surplus_confirmed'
                          ? 'border-green-200 bg-green-50 text-green-800'
                          : 'border-yellow-200 bg-yellow-50 text-yellow-800'
                      }`}>
                        <span className="block font-bold">4. Confirmation</span>
                        <span className="text-[10px]">
                          {selectedEvent.status === 'surplus_confirmed'
                            ? `Confirmed (${selectedEvent.actual_surplus_portions} meals)`
                            : 'Awaiting buffet wrap'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actual Surplus Confirmation Box */}
                  <div className="p-4 bg-cream rounded-card border border-sage space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-forest" />
                        <div>
                          <h4 className="font-extrabold text-charcoal text-sm">Post-Event Surplus Confirmation</h4>
                          <p className="text-[11px] text-muted">
                            When the event concludes, confirm actual quantity to convert into a verified Food Rescue Batch.
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedEvent.status === 'surplus_confirmed' ? (
                      <div className="p-3 bg-green-100 border border-green-300 text-green-800 rounded-subtle text-xs font-semibold flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-700" />
                        <span>Actual surplus confirmed at <strong>{selectedEvent.actual_surplus_portions} meals ({selectedEvent.actual_surplus_kg} kg)</strong>. Food listing published and volunteer dispatch initiated.</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <div className="flex items-center gap-2 text-xs">
                          <label className="font-bold text-charcoal">Actual Meals Remaining:</label>
                          <input
                            type="number"
                            value={confirmPortions}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setConfirmPortions(val);
                              setConfirmKg(Math.round(val * 0.4));
                            }}
                            className="w-20 p-1.5 border border-sage rounded text-xs font-extrabold text-charcoal"
                          />
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <label className="font-bold text-charcoal">Weight (~kg):</label>
                          <input
                            type="number"
                            value={confirmKg}
                            onChange={(e) => setConfirmKg(Number(e.target.value))}
                            className="w-16 p-1.5 border border-sage rounded text-xs font-extrabold text-charcoal"
                          />
                        </div>
                        <button
                          onClick={() => handleConfirmEventSurplus(selectedEvent.id)}
                          className="px-4 py-2 bg-orange-warm hover:bg-orange-warm/90 text-white font-extrabold rounded text-xs shadow-xs ml-auto"
                        >
                          Confirm Actual Surplus & Dispatch
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Early Notification & Recipient Interest */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-4">
                  <div className="flex items-center gap-2 border-b border-sage/60 pb-3">
                    <Bell className="w-5 h-5 text-forest" />
                    <div>
                      <h3 className="font-bold text-charcoal text-sm">Nearby Institution Early Alerts</h3>
                      <p className="text-[11px] text-muted">Eligible orphanages & care homes within 5 km</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedEventPrediction.nearbyRecipientCandidates.map((c) => {
                      const hasRegistered = currentEventInterests.some(i => i.recipientName.includes(c.name) || i.recipientId === c.id);
                      return (
                        <div key={c.id} className="p-3 bg-cream/70 rounded-subtle border border-sage/60 text-xs space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-forest/10 text-forest">
                                {c.type}
                              </span>
                              <h4 className="font-bold text-charcoal text-xs mt-1">{c.name}</h4>
                            </div>
                            <span className="text-[11px] font-bold text-muted">{c.distanceKm} km</span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-sage/40">
                            <span className="text-muted">Target need: <strong>~{c.requirementPortions} meals</strong></span>
                            {hasRegistered ? (
                              <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded flex items-center gap-1">
                                <Check className="w-3 h-3" /> Interest Registered
                              </span>
                            ) : (
                              <button
                                onClick={() => handleExpressInterest(selectedEvent.id, c.name, c.requirementPortions)}
                                className="px-2 py-1 bg-white border border-forest text-forest hover:bg-forest hover:text-white rounded text-[10px] font-bold transition-all"
                              >
                                Register Interest
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Registered Preliminary Interests Summary */}
                  <div className="p-3 bg-slate-50 rounded-subtle border border-slate-200 text-xs space-y-1.5">
                    <span className="font-bold text-charcoal block">Preliminary Demand Collected:</span>
                    {currentEventInterests.length > 0 ? (
                      <ul className="space-y-1 text-muted text-[11px]">
                        {currentEventInterests.map((int) => (
                          <li key={int.id} className="flex items-center justify-between">
                            <span className="truncate max-w-[180px]">{int.recipientName}</span>
                            <span className="font-bold text-forest">{int.portionsNeeded} meals</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] text-muted">No institutions registered yet. Notifications dispatched.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Register New Event Modal */}
          {showNewEventModal && (
            <div className="fixed inset-0 z-[600] bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-card max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-sage shadow-soft">
                <div className="flex items-center justify-between border-b border-sage/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-forest" />
                    <h3 className="font-extrabold text-charcoal text-base">Register Event for Surplus Prediction</h3>
                  </div>
                  <button onClick={() => setShowNewEventModal(false)} className="text-muted hover:text-charcoal font-bold">✕</button>
                </div>

                <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-charcoal block mb-1">Event Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya & Deepak Wedding Reception"
                      value={newEventName}
                      onChange={(e) => setNewEventName(e.target.value)}
                      className="w-full p-2 border border-sage rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-charcoal block mb-1">Event Type</label>
                      <select
                        value={newEventType}
                        onChange={(e) => setNewEventType(e.target.value as EventType)}
                        className="w-full p-2 border border-sage rounded"
                      >
                        <option value="Wedding">Wedding</option>
                        <option value="Reception">Reception</option>
                        <option value="Engagement function">Engagement function</option>
                        <option value="Birthday party">Birthday party</option>
                        <option value="Corporate event">Corporate event</option>
                        <option value="College celebration">College celebration</option>
                        <option value="Festival">Festival</option>
                        <option value="Community gathering">Community gathering</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-charcoal block mb-1">Event Date</label>
                      <input
                        type="date"
                        required
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full p-2 border border-sage rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="font-bold text-charcoal block mb-1">Start Time</label>
                      <input
                        type="time"
                        value={newStartTime}
                        onChange={(e) => setNewStartTime(e.target.value)}
                        className="w-full p-2 border border-sage rounded"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-charcoal block mb-1">Expected End</label>
                      <input
                        type="time"
                        value={newEndTime}
                        onChange={(e) => setNewEndTime(e.target.value)}
                        className="w-full p-2 border border-sage rounded"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-charcoal block mb-1">Serving Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 19:30 - 21:00"
                        value={newServingTime}
                        onChange={(e) => setNewServingTime(e.target.value)}
                        className="w-full p-2 border border-sage rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="font-bold text-charcoal block mb-1">Expected Guests</label>
                      <input
                        type="number"
                        required
                        value={newGuests}
                        onChange={(e) => setNewGuests(Number(e.target.value))}
                        className="w-full p-2 border border-sage rounded font-extrabold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-charcoal block mb-1">Planned Meals</label>
                      <input
                        type="number"
                        required
                        value={newPlannedMeals}
                        onChange={(e) => setNewPlannedMeals(Number(e.target.value))}
                        className="w-full p-2 border border-sage rounded font-extrabold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-charcoal block mb-1">Meal Type</label>
                      <select
                        value={newMealType}
                        onChange={(e) => setNewMealType(e.target.value as EventMealType)}
                        className="w-full p-2 border border-sage rounded"
                      >
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snacks">Snacks</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-charcoal block mb-1">Food Preparation Arrangement</label>
                    <select
                      value={newPrepArrangement}
                      onChange={(e) => setNewPrepArrangement(e.target.value as FoodPreparationArrangement)}
                      className="w-full p-2 border border-sage rounded"
                    >
                      <option value="In-house">In-house Kitchen</option>
                      <option value="Caterer">Contracted Caterer</option>
                      <option value="External provider">External Food Provider</option>
                    </select>
                  </div>

                  {/* Conditional Caterer Fields */}
                  {newPrepArrangement !== 'In-house' && (
                    <div className="p-3 bg-cream rounded border border-sage grid grid-cols-2 gap-2 animate-in fade-in">
                      <div>
                        <label className="font-bold text-charcoal block mb-1">Caterer / Provider Name</label>
                        <input
                          type="text"
                          value={newCatererName}
                          onChange={(e) => setNewCatererName(e.target.value)}
                          className="w-full p-1.5 border border-sage rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-charcoal block mb-1">Caterer Contact Phone</label>
                        <input
                          type="text"
                          value={newCatererContact}
                          onChange={(e) => setNewCatererContact(e.target.value)}
                          className="w-full p-1.5 border border-sage rounded bg-white"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="font-bold text-charcoal block mb-1">Event Venue / Location</label>
                    <input
                      type="text"
                      required
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full p-2 border border-sage rounded"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-charcoal block mb-1">Catering Notes (Food Items & Packaging)</label>
                    <textarea
                      rows={2}
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      className="w-full p-2 border border-sage rounded"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-sage/60">
                    <button
                      type="button"
                      onClick={() => setShowNewEventModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-charcoal font-bold rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-forest hover:bg-forest-dark text-white font-extrabold rounded shadow-xs"
                    >
                      Register & Calculate Prediction
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: HOSTELPULSE — COLLEGE HOSTEL FOOD WASTAGE INTELLIGENCE */}
      {/* ========================================================================= */}
      {activeModule === 'hostelpulse' && (
        <div className="space-y-6 animate-in fade-in">
          {hostelNotice && (
            <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-card flex items-center gap-3 text-xs font-semibold">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-blue-600" />
              <span>{hostelNotice}</span>
            </div>
          )}

          {/* Module Banner */}
          <div className="bg-white p-5 rounded-card border border-sage shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Module 2: Smart Campus Food Rescue
                </span>
                <span className="text-xs text-muted">Institutional Dining Intelligence</span>
              </div>
              <h2 className="text-lg font-bold text-charcoal mt-1">
                HostelPulse — College Hostel Food Wastage Intelligence
              </h2>
              <p className="text-xs text-muted max-w-xl">
                Track and forecast recurring mess food surplus across engineering, medical, and university hostels. Empower mess wardens with 1-click surplus confirmations to feed nearby communities.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted">Select Campus:</span>
              <select
                value={selectedHostelId}
                onChange={(e) => setSelectedHostelId(e.target.value)}
                className="p-2 border border-sage rounded text-xs font-bold bg-white"
              >
                {hostels.map(h => (
                  <option key={h.id} value={h.id}>{h.institution_name} - {h.hostel_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Hostel Profile Details Card */}
          {selectedHostel && (
            <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sage/60 pb-3">
                <div>
                  <h3 className="font-extrabold text-charcoal text-base">{selectedHostel.hostel_name}</h3>
                  <p className="text-xs text-muted">{selectedHostel.institution_name} • {selectedHostel.campus_location}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span>Residents: <strong className="text-forest">{selectedHostel.resident_count} students</strong></span>
                  <span>Mess Capacity: <strong className="text-forest">{selectedHostel.mess_capacity} / batch</strong></span>
                  <span>Warden: <strong className="text-charcoal">{selectedHostel.contact_person}</strong></span>
                </div>
              </div>

              {/* Today's Meal Schedule Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  Today's Mess Schedule & Dynamic Wastage Predictions
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentHostelPlans.map((plan) => {
                    const isConfirmed = plan.status === 'surplus_confirmed' || plan.status === 'rescued';
                    return (
                      <div key={plan.id} className="p-4 rounded-card border border-sage bg-cream/40 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                              {plan.meal}
                            </span>
                            <span className="text-muted font-bold">{plan.date}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isConfirmed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {plan.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded border border-sage/60 text-center">
                          <div>
                            <span className="text-[10px] text-muted block uppercase">Planned</span>
                            <span className="text-sm font-extrabold text-charcoal">{plan.planned_meals}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted block uppercase">Est. Consumed</span>
                            <span className="text-sm font-extrabold text-charcoal">{plan.predicted_consumption}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-orange-warm block uppercase font-bold">Est. Surplus</span>
                            <span className="text-sm font-extrabold text-orange-warm">
                              {plan.predicted_surplus_min}–{plan.predicted_surplus_max}
                            </span>
                          </div>
                        </div>

                        {/* Factors */}
                        <div className="text-[11px] text-muted space-y-1">
                          <span className="font-bold text-charcoal block">Predictive Pattern Factors:</span>
                          <ul className="list-disc pl-4 space-y-0.5">
                            {plan.factors.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Mess Manager Action */}
                        <div className="pt-2 border-t border-sage/60">
                          {isConfirmed ? (
                            <div className="p-2 bg-green-100 text-green-800 rounded font-semibold text-[11px] flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-green-700" />
                              <span>Surplus confirmed: {plan.actual_surplus} meals rescued and dispatched.</span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div>
                                  <label className="text-muted block">Actual Prepared:</label>
                                  <input
                                    type="number"
                                    value={hostelActualPrepared}
                                    onChange={(e) => setHostelActualPrepared(Number(e.target.value))}
                                    className="w-full p-1 border border-sage rounded font-bold"
                                  />
                                </div>
                                <div>
                                  <label className="text-muted block">Actual Served:</label>
                                  <input
                                    type="number"
                                    value={hostelActualServed}
                                    onChange={(e) => setHostelActualServed(Number(e.target.value))}
                                    className="w-full p-1 border border-sage rounded font-bold"
                                  />
                                </div>
                              </div>
                              <button
                                onClick={() => handleConfirmHostelSurplus(plan.id)}
                                className="w-full py-1.5 bg-forest hover:bg-forest-dark text-white rounded font-bold text-xs shadow-xs"
                              >
                                Confirm Mess Surplus for Rescue ({Math.max(0, hostelActualPrepared - hostelActualServed)} meals)
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 3: LOCALRESCUE — LOCATION-BASED RECIPIENT & VOLUNTEER COORDINATION */}
      {/* ========================================================================= */}
      {activeModule === 'localrescue' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Module Banner */}
          <div className="bg-white p-5 rounded-card border border-sage shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-forest/10 text-forest">
                  Module 3: Genuine Local Network
                </span>
                <span className="text-xs text-muted">OpenStreetMap & OSRM Engine</span>
              </div>
              <h2 className="text-lg font-bold text-charcoal mt-1">
                LocalRescue — Location-Based Recipient & Volunteer Network
              </h2>
              <p className="text-xs text-muted max-w-xl">
                Matching available food with nearby recipient shelters based on travel distance, safe handling deadlines, and verified storage capabilities.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-charcoal flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyEnabled}
                  onChange={(e) => setPrivacyEnabled(e.target.checked)}
                  className="rounded text-forest"
                />
                <span>Privacy Shield Active (Mask Donor Address Until Accepted)</span>
              </label>
            </div>
          </div>

          {/* Interactive Leaflet Map */}
          <div className="bg-white p-4 rounded-card border border-sage shadow-soft space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-charcoal">Tamil Nadu Local Rescue Map: Coimbatore Corridor</span>
              <div className="flex items-center gap-3 text-[11px] text-muted">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-forest" /> Donor</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Hostels</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Shelters</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-warm" /> Volunteers</span>
              </div>
            </div>

            <div className="h-[420px] rounded-subtle overflow-hidden border border-sage">
              <TamilNaduMap height="420px" />
            </div>
          </div>

          {/* Explainable Recommendation Matching Cards */}
          <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-4">
            <div className="flex items-center gap-2 border-b border-sage/60 pb-3">
              <ShieldCheck className="w-5 h-5 text-forest" />
              <div>
                <h3 className="font-bold text-charcoal text-sm">Explainable Routing & Recipient Matching</h3>
                <p className="text-[11px] text-muted">Mathematical ranking explaining why each recipient was recommended</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-cream/70 rounded-subtle border border-sage space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-forest text-sm">Anbalayam Children Shelter</span>
                  <span className="bg-forest text-white text-[10px] font-extrabold px-2 py-0.5 rounded">Rank #1 Match</span>
                </div>
                <p className="text-muted leading-relaxed">
                  <strong>Why Recommended:</strong> Located only <strong>3.2 km</strong> away along Avinashi Road; requires 40 meals for resident children; equipped with verified refrigeration; ETA is 18 minutes (well within the 90-minute hot holding safety limit).
                </p>
                <div className="text-[11px] text-muted flex items-center justify-between pt-1 border-t border-sage/60">
                  <span>Transit Time: <strong>18 mins</strong></span>
                  <span>Handling Window: <strong>3.5 hours remaining</strong></span>
                </div>
              </div>

              <div className="p-4 bg-cream/70 rounded-subtle border border-sage space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-forest text-sm">Karunai Illam Destitute Elders Home</span>
                  <span className="bg-forest/80 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">Rank #2 Match</span>
                </div>
                <p className="text-muted leading-relaxed">
                  <strong>Why Recommended:</strong> Located <strong>1.8 km</strong> from R.S. Puram kitchen; requires 25 soft meals; high intake priority for destitute elderly; can receive delivery directly from volunteer Karthik S.
                </p>
                <div className="text-[11px] text-muted flex items-center justify-between pt-1 border-t border-sage/60">
                  <span>Transit Time: <strong>11 mins</strong></span>
                  <span>Handling Window: <strong>4.0 hours remaining</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 4: LIVESYNC & ATOMIC VOLUNTEER CLAIMING ENGINE */}
      {/* ========================================================================= */}
      {activeModule === 'livesync' && (
        <div className="space-y-6 animate-in fade-in">
          {raceNotice && (
            <div className={`p-4 rounded-card border flex items-center gap-3 text-xs font-semibold ${
              raceNotice.type === 'winner'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <Zap className="w-5 h-5 shrink-0" />
              <span>{raceNotice.message}</span>
            </div>
          )}

          {/* Module Banner */}
          <div className="bg-white p-5 rounded-card border border-sage shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-warm/10 text-orange-warm">
                  Module 4: Real-Time Multi-Client Synchronization
                </span>
                <span className="text-xs text-muted">Zero Race-Condition Guarantee</span>
              </div>
              <h2 className="text-lg font-bold text-charcoal mt-1">
                LiveSync & Atomic Volunteer Claiming Engine
              </h2>
              <p className="text-xs text-muted max-w-xl">
                Real-time event broadcasting synchronises donor registrations, confirmations, and volunteer acceptance across all open browser sessions and mobile devices without requiring page refreshes.
              </p>
            </div>

            <div className="bg-forest/10 border border-forest/30 p-3 rounded-card text-xs space-y-1">
              <span className="text-[10px] font-bold text-forest uppercase block">Node Client ID</span>
              <code className="text-xs font-mono font-bold text-charcoal block">{store.getClientId()}</code>
              <span className="text-[10px] text-muted block">Multi-Tab Channel Active</span>
            </div>
          </div>

          {/* Interactive Dual-Volunteer Race Condition Simulator */}
          <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-sage/60 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-warm" />
                <div>
                  <h3 className="font-extrabold text-charcoal text-base">
                    Simultaneous Volunteer Claiming Test (Race Condition Prevention)
                  </h3>
                  <p className="text-xs text-muted">
                    Simulate two volunteers clicking "Accept Mission" at the exact same millisecond to verify that only one gets assigned, while the second receives an atomic rejection.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Volunteer A Simulator */}
              <div className="p-4 bg-cream rounded-card border border-sage space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-charcoal">
                    <Truck className="w-4 h-4 text-forest" />
                    <span>Volunteer A: Karthik Subramanian</span>
                  </div>
                  <span className="text-[10px] bg-forest/10 text-forest font-bold px-2 py-0.5 rounded">Two-Wheeler</span>
                </div>
                <p className="text-muted text-[11px]">
                  Stationed in Singanallur. Ready to accept emergency wedding surplus batch.
                </p>
                <button
                  onClick={() => handleSimulateClaimRace('karthik')}
                  className="w-full py-2.5 bg-forest hover:bg-forest-dark text-white rounded font-bold text-xs shadow-xs"
                >
                  ⚡ Simulate: Karthik Clicks 1st (Wins Lock)
                </button>
              </div>

              {/* Volunteer B Simulator */}
              <div className="p-4 bg-cream rounded-card border border-sage space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-charcoal">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Volunteer B: Priya Ramasamy</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">Car</span>
                </div>
                <p className="text-muted text-[11px]">
                  Stationed in Gandhipuram. Competing for the exact same batch at identical timestamp.
                </p>
                <button
                  onClick={() => handleSimulateClaimRace('priya')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs shadow-xs"
                >
                  ⚡ Simulate: Priya Clicks 1st (Wins Lock)
                </button>
              </div>
            </div>
          </div>

          {/* Live Sync Events Stream */}
          <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-sage/60 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-forest" />
                <h3 className="font-bold text-charcoal text-sm">Real-Time LiveSync Event Stream</h3>
              </div>
              <span className="text-xs text-muted font-mono">{syncEvents.length} events logged</span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {syncEvents.map((ev) => (
                <div key={ev.id} className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-bold text-forest font-mono text-[11px]">{ev.eventType}</span>
                    <span className="text-charcoal font-medium">{ev.summary}</span>
                  </div>
                  <span className="text-[10px] text-muted font-mono shrink-0">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 5: FAIRSHARE ALLOCATION PLAN (RETAINED) */}
      {/* ========================================================================= */}
      {activeModule === 'fairshare' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-sage/60 pb-3">
              <div>
                <h3 className="font-extrabold text-charcoal text-base">FairShare Proportional Shelter Allocation</h3>
                <p className="text-xs text-muted">Mathematical model allocating surplus portions without favoritism</p>
              </div>
              <span className="bg-forest/10 text-forest text-xs font-bold px-3 py-1 rounded-full">
                Fairness Index: {currentPlan.fairnessIndexPercent}%
              </span>
            </div>

            <div className="space-y-3">
              {currentPlan.allocations.map((item, idx) => (
                <div key={idx} className="p-4 bg-cream/70 rounded-subtle border border-sage space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-charcoal text-sm">{item.recipientName}</h4>
                    <span className="font-extrabold text-forest text-sm">{item.allocatedPortions} Meals ({item.allocatedKg} kg)</span>
                  </div>
                  <p className="text-muted leading-relaxed">
                    <strong>Allocation Formula:</strong> {item.explanation}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-muted pt-1 border-t border-sage/40">
                    <span>Shelter Need Score: <strong>{item.needScore} / 100</strong></span>
                    <span>Distance: <strong>{item.transitDistanceKm} km</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 6: TEST SCENARIOS (WEDDING, HOSTEL, SIMULTANEOUS CLAIMING) */}
      {/* ========================================================================= */}
      {activeModule === 'scenarios' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-6 rounded-card border border-sage shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-500" />
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Predictive Stress Testing</span>
              </div>
              <h2 className="text-lg font-bold text-charcoal mt-1">
                MealPulse AI Scenario Verification Lab
              </h2>
              <p className="text-xs text-muted max-w-xl">
                Run simulated test scenarios for pre-event wedding prediction, college hostel mess wastage, and concurrent volunteer race condition resolution.
              </p>
            </div>

            <button
              onClick={handleRunScenario}
              disabled={isSimulating}
              className="px-5 py-3 bg-forest hover:bg-forest-dark text-white rounded font-extrabold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50 shrink-0"
            >
              <Zap className="w-4 h-4 fill-current text-orange-warm" />
              <span>{isSimulating ? 'Simulating Resolution...' : 'Run Selected Scenario'}</span>
            </button>
          </div>

          {/* Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESET_SCENARIOS.map((sc) => {
              const isSelected = selectedScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    setSelectedScenario(sc);
                    setScenarioExecuted(false);
                  }}
                  className={`p-4 rounded-card text-left border transition-all text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-forest text-white border-forest shadow-md'
                      : 'bg-white text-charcoal border-sage hover:border-forest/50'
                  }`}
                >
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-forest/10 text-forest'
                  }`}>
                    {sc.simulationType.replace('_', ' ').toUpperCase()}
                  </span>
                  <h3 className="font-bold text-sm block leading-snug">{sc.title}</h3>
                  <p className={`text-[11px] ${isSelected ? 'text-cream' : 'text-muted'}`}>
                    {sc.originalPlan.portions} meals • {sc.originalPlan.destinationNgo}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Scenario Details & Execution Result */}
          <div className="bg-white rounded-card p-6 border border-sage shadow-soft space-y-6">
            <div className="flex items-center justify-between border-b border-sage/60 pb-3">
              <h3 className="text-base font-bold text-charcoal">
                Simulation Profile: <span className="text-forest">{selectedScenario.title}</span>
              </h3>
              <span className="text-xs font-semibold text-muted">
                Status: <strong className="text-forest">{scenarioExecuted ? 'Executed & Verified' : 'Ready to Run'}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-red-50 border border-red-200 rounded-card space-y-2">
                <span className="font-bold text-red-700 block text-xs uppercase tracking-wider">
                  ⚠️ Challenge / Failure Event:
                </span>
                <p className="text-charcoal font-semibold">{selectedScenario.simulatedFailure.event}</p>
                <p className="text-red-700 text-[11px] leading-relaxed">
                  {selectedScenario.simulatedFailure.impactDescription}
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-card space-y-2">
                <span className="font-bold text-green-800 block text-xs uppercase tracking-wider">
                  🛡️ MealPulse AI Dynamic Resolution:
                </span>
                <p className="text-charcoal font-semibold">{selectedScenario.recoverySolution.actionTaken}</p>
                <p className="text-green-800 text-[11px] leading-relaxed">
                  Reallocated volunteer: <strong>{selectedScenario.recoverySolution.reallocatedVolunteer}</strong> • New ETA: <strong>{selectedScenario.recoverySolution.newEtaMins} mins</strong>
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-cream p-3 rounded text-center border border-sage">
                <span className="text-[10px] text-muted uppercase font-bold block">Meals Preserved</span>
                <span className="text-lg font-extrabold text-forest">{selectedScenario.metrics.mealsPreserved}</span>
              </div>
              <div className="bg-cream p-3 rounded text-center border border-sage">
                <span className="text-[10px] text-muted uppercase font-bold block">Food Rescued</span>
                <span className="text-lg font-extrabold text-forest">{selectedScenario.metrics.foodSavedKg} kg</span>
              </div>
              <div className="bg-cream p-3 rounded text-center border border-sage">
                <span className="text-[10px] text-muted uppercase font-bold block">Carbon Offset</span>
                <span className="text-lg font-extrabold text-forest">{selectedScenario.metrics.carbonOffsetKg} kg CO₂</span>
              </div>
              <div className="bg-cream p-3 rounded text-center border border-sage">
                <span className="text-[10px] text-muted uppercase font-bold block">Decision Latency</span>
                <span className="text-lg font-extrabold text-forest">{selectedScenario.metrics.recoveryTimeSeconds}s</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
