import { 
  UserProfile, 
  Organization,
  FoodListing, 
  RescueMission, 
  DonationRequest, 
  CommunityHotspot, 
  CommunityHub, 
  VolunteerProfile, 
  SafetyIncident, 
  BeneficiaryRecord, 
  DistributionRecord 
} from '../types';

import { 
  INITIAL_PROFILES, 
  INITIAL_ORGANIZATIONS,
  INITIAL_FOOD_LISTINGS, 
  INITIAL_RESCUE_MISSIONS, 
  INITIAL_DONATION_REQUESTS, 
  INITIAL_COMMUNITY_HOTSPOTS, 
  INITIAL_COMMUNITY_HUBS, 
  INITIAL_VOLUNTEERS, 
  INITIAL_SAFETY_INCIDENTS, 
  INITIAL_BENEFICIARIES, 
  INITIAL_DISTRIBUTIONS 
} from './mockData';

type Listener = () => void;

class UnavuLinkStore {
  private listeners: Set<Listener> = new Set();

  private emitChange(): void {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (err) {
        console.error('Store listener error:', err);
      }
    });
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private getStorage<T>(key: string, defaultVal: T): T {
    try {
      const item = localStorage.getItem(`unavulink_${key}`);
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private setStorage<T>(key: string, val: T): void {
    try {
      localStorage.setItem(`unavulink_${key}`, JSON.stringify(val));
      this.emitChange();
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  // --- ENVIRONMENT MODE (REAL SUPABASE VS VIRTUAL WORLD DEMO) ---
  getEnvironmentMode(): 'real' | 'virtual_world' {
    return this.getStorage('env_mode', 'virtual_world');
  }

  setEnvironmentMode(mode: 'real' | 'virtual_world'): void {
    this.setStorage('env_mode', mode);
  }

  // --- CURRENT LOCATION CONTEXT ---
  getSelectedCity(): string {
    return this.getStorage('selected_city', 'Coimbatore');
  }

  setSelectedCity(city: string): void {
    this.setStorage('selected_city', city);
  }

  // --- PROFILES ---
  getProfiles(): UserProfile[] {
    return this.getStorage('profiles', INITIAL_PROFILES);
  }

  getProfileById(id: string): UserProfile | undefined {
    return this.getProfiles().find(p => p.id === id);
  }

  updateProfile(profile: UserProfile): void {
    const list = this.getProfiles().map(p => p.id === profile.id ? profile : p);
    this.setStorage('profiles', list);
  }

  // --- ORGANIZATIONS ---
  getOrganizations(): Organization[] {
    return this.getStorage('organizations', INITIAL_ORGANIZATIONS);
  }

  getOrganizationById(id: string): Organization | undefined {
    return this.getOrganizations().find(o => o.id === id);
  }

  // --- FOOD LISTINGS ---
  getListings(): FoodListing[] {
    return this.getStorage('listings', INITIAL_FOOD_LISTINGS);
  }

  getListingById(id: string): FoodListing | undefined {
    return this.getListings().find(l => l.id === id);
  }

  getListingByBatchId(batchId: string): FoodListing | undefined {
    return this.getListings().find(l => l.batch_id === batchId);
  }

  addListing(listing: FoodListing): void {
    const list = [listing, ...this.getListings()];
    this.setStorage('listings', list);
  }

  updateListing(listing: FoodListing): void {
    const list = this.getListings().map(l => l.id === listing.id ? listing : l);
    this.setStorage('listings', list);
  }

  freezeListing(batchId: string, reason: string): void {
    const list = this.getListings().map(l => {
      if (l.batch_id === batchId) {
        return {
          ...l,
          safety_status: 'frozen' as const,
          listing_status: 'frozen' as const,
          handling_information: `SAFETY FREEZE: ${reason}`
        };
      }
      return l;
    });
    this.setStorage('listings', list);
  }

  // --- RESCUE MISSIONS ---
  getMissions(): RescueMission[] {
    return this.getStorage('missions', INITIAL_RESCUE_MISSIONS);
  }

  getMissionById(id: string): RescueMission | undefined {
    return this.getMissions().find(m => m.id === id);
  }

  addMission(mission: RescueMission): void {
    const list = [mission, ...this.getMissions()];
    this.setStorage('missions', list);
  }

  updateMission(mission: RescueMission): void {
    const list = this.getMissions().map(m => m.id === mission.id ? mission : m);
    this.setStorage('missions', list);
  }

  // --- DONATION REQUESTS & INTERCONNECTED LIFECYCLE ---
  getRequests(): DonationRequest[] {
    return this.getStorage('requests', INITIAL_DONATION_REQUESTS);
  }

  addRequest(req: DonationRequest): void {
    const list = [req, ...this.getRequests()];
    this.setStorage('requests', list);

    // Update listing status to request_received
    const listing = this.getListingById(req.food_listing_id);
    if (listing && listing.listing_status === 'available') {
      this.updateListing({
        ...listing,
        listing_status: 'request_received'
      });
    }
  }

  updateRequest(req: DonationRequest): void {
    const list = this.getRequests().map(r => r.id === req.id ? req : r);
    this.setStorage('requests', list);
  }

  /**
   * SEAMLESS INTERCONNECTION: Approve request and automatically spawn active RescueMission
   */
  approveRequestAndCreateMission(req: DonationRequest, notes?: string): RescueMission {
    // 1. Mark request as approved
    const updatedReq: DonationRequest = {
      ...req,
      request_status: 'approved',
      approved_quantity: req.requested_quantity,
      donor_response_notes: notes || 'Approved for community shelter redistribution.'
    };
    this.updateRequest(updatedReq);

    // 2. Fetch associated listing
    const listing = this.getListingById(req.food_listing_id) || this.getListings()[0];
    
    // Update listing status
    this.updateListing({
      ...listing,
      listing_status: 'approved'
    });

    // 3. Find available volunteer
    const volunteers = this.getVolunteers();
    const assignedVol = volunteers.find(v => v.availability_status === 'available') || volunteers[0];

    // 4. Create interconnected Rescue Mission with secure 6-digit OTPs
    const pickupOtp = `${Math.floor(100000 + Math.random() * 900000)}`;
    const deliveryOtp = `${Math.floor(100000 + Math.random() * 900000)}`;

    const newMission: RescueMission = {
      id: `msn-${Date.now()}`,
      batch_id: listing.batch_id,
      food_listing_id: listing.id,
      food_name: listing.food_name,
      donor_id: listing.donor_id,
      donor_name: listing.donor_name || 'Verified Donor Kitchen',
      recipient_id: req.requester_id,
      recipient_name: req.organization_name || req.requester_name,
      volunteer_id: assignedVol.user_id,
      volunteer_name: assignedVol.full_name || 'Karthik Subramanian',
      volunteer_phone: '+91 98422 60006',
      mission_status: 'volunteer_assigned',
      pickup_otp: pickupOtp,
      delivery_otp: deliveryOtp,
      pickup_address: listing.pickup_location,
      pickup_lat: listing.latitude,
      pickup_lng: listing.longitude,
      delivery_address: 'Saibaba Colony Shelter / Ukkadam Hub',
      delivery_lat: 11.0264,
      delivery_lng: 76.9421,
      distance_km: 6.4,
      estimated_duration_mins: 20,
      created_at: new Date().toISOString()
    };

    this.addMission(newMission);
    return newMission;
  }

  /**
   * SEAMLESS INTERCONNECTION: Complete Pickup Handover with OTP validation
   */
  confirmPickupHandover(missionId: string, enteredOtp: string): { success: boolean; message: string } {
    const mission = this.getMissionById(missionId);
    if (!mission) return { success: false, message: 'Mission not found.' };

    if (enteredOtp.trim() !== mission.pickup_otp.trim()) {
      return { success: false, message: 'Incorrect Pickup OTP entered.' };
    }

    const updatedMission: RescueMission = {
      ...mission,
      mission_status: 'picked_up'
    };
    this.updateMission(updatedMission);

    // Update listing status to in_transit
    const listing = this.getListingById(mission.food_listing_id);
    if (listing) {
      this.updateListing({
        ...listing,
        listing_status: 'in_transit'
      });
    }

    return { success: true, message: 'Pickup handover successfully verified! Food is now in transit.' };
  }

  /**
   * SEAMLESS INTERCONNECTION: Complete Delivery Handover with OTP validation
   */
  confirmDeliveryHandover(missionId: string, enteredOtp: string): { success: boolean; message: string } {
    const mission = this.getMissionById(missionId);
    if (!mission) return { success: false, message: 'Mission not found.' };

    if (enteredOtp.trim() !== mission.delivery_otp.trim()) {
      return { success: false, message: 'Incorrect Delivery OTP entered.' };
    }

    const updatedMission: RescueMission = {
      ...mission,
      mission_status: 'delivered'
    };
    this.updateMission(updatedMission);

    // Update listing status to completed
    const listing = this.getListingById(mission.food_listing_id);
    if (listing) {
      this.updateListing({
        ...listing,
        listing_status: 'completed'
      });

      // Automatically add verified distribution record
      const distRecord: DistributionRecord = {
        id: `dist-${Date.now()}`,
        organization_id: 'org-ngo-1',
        batch_id: listing.batch_id,
        quantity_received_kg: listing.quantity,
        quantity_distributed_kg: listing.quantity,
        meals_served_count: listing.estimated_portions,
        remaining_quantity_kg: 0,
        distribution_location: mission.delivery_address,
        distribution_time: new Date().toISOString(),
        notes: `Verified receipt and distribution of ${listing.food_name} via delivery OTP.`
      };
      this.addDistribution(distRecord);
    }

    return { success: true, message: 'Delivery receipt verified! Meal distribution logged into impact ledger.' };
  }

  // --- COMMUNITY HOTSPOTS ---
  getHotspots(): CommunityHotspot[] {
    return this.getStorage('hotspots', INITIAL_COMMUNITY_HOTSPOTS);
  }

  addHotspot(hotspot: CommunityHotspot): void {
    const list = [hotspot, ...this.getHotspots()];
    this.setStorage('hotspots', list);
  }

  // --- COMMUNITY HUBS ---
  getHubs(): CommunityHub[] {
    return this.getStorage('hubs', INITIAL_COMMUNITY_HUBS);
  }

  // --- VOLUNTEERS ---
  getVolunteers(): VolunteerProfile[] {
    return this.getStorage('volunteers', INITIAL_VOLUNTEERS);
  }

  getVolunteerByUserId(userId: string): VolunteerProfile | undefined {
    return this.getVolunteers().find(v => v.user_id === userId);
  }

  updateVolunteer(vol: VolunteerProfile): void {
    const list = this.getVolunteers().map(v => v.id === vol.id ? vol : v);
    this.setStorage('volunteers', list);
  }

  // --- SAFETY INCIDENTS ---
  getIncidents(): SafetyIncident[] {
    return this.getStorage('incidents', INITIAL_SAFETY_INCIDENTS);
  }

  addIncident(incident: SafetyIncident): void {
    const list = [incident, ...this.getIncidents()];
    this.setStorage('incidents', list);
    // Automatically freeze affected food batch
    this.freezeListing(incident.batch_id, incident.description);
  }

  // --- BENEFICIARIES ---
  getBeneficiaries(): BeneficiaryRecord[] {
    return this.getStorage('beneficiaries', INITIAL_BENEFICIARIES);
  }

  addBeneficiary(ben: BeneficiaryRecord): void {
    const list = [ben, ...this.getBeneficiaries()];
    this.setStorage('beneficiaries', list);
  }

  // --- DISTRIBUTION RECORDS ---
  getDistributions(): DistributionRecord[] {
    return this.getStorage('distributions', INITIAL_DISTRIBUTIONS);
  }

  addDistribution(dist: DistributionRecord): void {
    const list = [dist, ...this.getDistributions()];
    this.setStorage('distributions', list);
  }

  // RESET TO DEMO DEFAULT
  resetDemoData(): void {
    localStorage.clear();
    this.emitChange();
  }
}

export const store = new UnavuLinkStore();

// React hook for component reactivity
export function useStoreState(): UnavuLinkStore {
  const [, setTick] = (window as any).React 
    ? (window as any).React.useState(0) 
    : [0, () => {}];
  return store;
}
