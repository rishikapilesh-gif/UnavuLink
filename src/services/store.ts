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

class UnavuLinkStore {
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
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
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

  // --- DONATION REQUESTS ---
  getRequests(): DonationRequest[] {
    return this.getStorage('requests', INITIAL_DONATION_REQUESTS);
  }

  addRequest(req: DonationRequest): void {
    const list = [req, ...this.getRequests()];
    this.setStorage('requests', list);
  }

  updateRequest(req: DonationRequest): void {
    const list = this.getRequests().map(r => r.id === req.id ? req : r);
    this.setStorage('requests', list);
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
  }
}

export const store = new UnavuLinkStore();
