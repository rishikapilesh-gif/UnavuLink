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
  DistributionRecord,
  DonorBusinessProfile,
  AcceptorProfile,
  NGOProfile,
  RescueMateProfile,
  ChatConversation,
  ChatMessage,
  WhatsAppIntegrationConfig,
  NotificationPreferences,
  UserRole
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
  INITIAL_DISTRIBUTIONS,
  INITIAL_DONOR_PROFILES,
  INITIAL_ACCEPTOR_PROFILES,
  INITIAL_NGO_PROFILES,
  INITIAL_RESCUEMATES,
  INITIAL_CONVERSATIONS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_WHATSAPP_CONFIG,
  INITIAL_NOTIFICATION_PREFERENCES
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

  // --- MODULE 2 & 3: ROLE-SPECIFIC PROFILES ---

  // DONOR BUSINESS PROFILES
  getDonorProfiles(): DonorBusinessProfile[] {
    return this.getStorage('donor_profiles', INITIAL_DONOR_PROFILES);
  }

  getDonorProfileByUserId(userId: string): DonorBusinessProfile | undefined {
    return this.getDonorProfiles().find(d => d.user_id === userId);
  }

  addDonorProfile(profile: DonorBusinessProfile): void {
    const list = [profile, ...this.getDonorProfiles()];
    this.setStorage('donor_profiles', list);
  }

  updateDonorProfile(profile: DonorBusinessProfile): void {
    const list = this.getDonorProfiles().map(d => d.id === profile.id ? profile : d);
    this.setStorage('donor_profiles', list);
  }

  // ACCEPTOR PROFILES
  getAcceptorProfiles(): AcceptorProfile[] {
    return this.getStorage('acceptor_profiles', INITIAL_ACCEPTOR_PROFILES);
  }

  getAcceptorProfileByUserId(userId: string): AcceptorProfile | undefined {
    return this.getAcceptorProfiles().find(a => a.user_id === userId);
  }

  addAcceptorProfile(profile: AcceptorProfile): void {
    const list = [profile, ...this.getAcceptorProfiles()];
    this.setStorage('acceptor_profiles', list);
  }

  // NGO PROFILES
  getNGOProfiles(): NGOProfile[] {
    return this.getStorage('ngo_profiles', INITIAL_NGO_PROFILES);
  }

  getNGOProfileByUserId(userId: string): NGOProfile | undefined {
    return this.getNGOProfiles().find(n => n.user_id === userId);
  }

  addNGOProfile(profile: NGOProfile): void {
    const list = [profile, ...this.getNGOProfiles()];
    this.setStorage('ngo_profiles', list);
  }

  // --- MODULE 2.5: RESCUEMATE WORKFLOW & PERMISSIONS ---
  getRescueMates(): RescueMateProfile[] {
    return this.getStorage('rescuemates', INITIAL_RESCUEMATES);
  }

  getRescueMateByUserId(userId: string): RescueMateProfile | undefined {
    return this.getRescueMates().find(r => r.user_id === userId);
  }

  addRescueMateApplication(application: RescueMateProfile): void {
    const list = [application, ...this.getRescueMates()];
    this.setStorage('rescuemates', list);
  }

  approveRescueMate(applicationId: string, adminUserId: string): void {
    const list = this.getRescueMates().map(r => {
      if (r.id === applicationId) {
        return {
          ...r,
          approval_status: 'approved' as const,
          approved_by: adminUserId,
          approved_at: new Date().toISOString()
        };
      }
      return r;
    });
    this.setStorage('rescuemates', list);

    // Update corresponding user profile to volunteer_approved: true
    const approvedRm = list.find(r => r.id === applicationId);
    if (approvedRm) {
      const user = this.getProfileById(approvedRm.user_id);
      if (user) {
        this.updateProfile({
          ...user,
          is_volunteer: true,
          volunteer_approved: true
        });
      }
    }
  }

  rejectRescueMate(applicationId: string): void {
    const list = this.getRescueMates().map(r => {
      if (r.id === applicationId) {
        return {
          ...r,
          approval_status: 'rejected' as const
        };
      }
      return r;
    });
    this.setStorage('rescuemates', list);
  }

  acceptMissionAsRescueMate(missionId: string, rescueMate: RescueMateProfile): boolean {
    const mission = this.getMissionById(missionId);
    if (!mission) return false;

    const updatedMission: RescueMission = {
      ...mission,
      volunteer_id: rescueMate.user_id,
      volunteer_name: rescueMate.full_name,
      volunteer_phone: rescueMate.mobile_number,
      mission_status: 'volunteer_assigned'
    };
    this.updateMission(updatedMission);

    // Update RescueMate active mission
    const updatedRm: RescueMateProfile = {
      ...rescueMate,
      active_mission_id: missionId
    };
    const list = this.getRescueMates().map(r => r.id === rescueMate.id ? updatedRm : r);
    this.setStorage('rescuemates', list);

    return true;
  }

  // --- MODULE 8 & 9: CHAT CONVERSATIONS & REAL-TIME INBOX ---
  getConversations(): ChatConversation[] {
    return this.getStorage('conversations', INITIAL_CONVERSATIONS);
  }

  getConversationById(id: string): ChatConversation | undefined {
    return this.getConversations().find(c => c.id === id);
  }

  getMessagesByConversationId(conversationId: string): ChatMessage[] {
    const all = this.getStorage('chat_messages', INITIAL_CHAT_MESSAGES);
    return all.filter(m => m.conversation_id === conversationId);
  }

  sendMessage(
    conversationId: string, 
    senderId: string, 
    senderName: string, 
    senderRole: UserRole, 
    content: string, 
    messageType: 'text' | 'image' | 'predefined_action' | 'system' = 'text'
  ): ChatMessage {
    const all = this.getStorage('chat_messages', INITIAL_CHAT_MESSAGES);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: senderId,
      sender_name: senderName,
      sender_role: senderRole,
      message_type: messageType,
      content,
      delivery_status: 'sent',
      created_at: new Date().toISOString()
    };

    this.setStorage('chat_messages', [...all, newMsg]);

    // Update conversation last message preview
    const convs = this.getConversations().map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          last_message_text: content,
          last_message_time: new Date().toISOString()
        };
      }
      return c;
    });
    this.setStorage('conversations', convs);

    return newMsg;
  }

  getOrCreateMissionConversation(mission: RescueMission, currentUserId: string): ChatConversation {
    const convs = this.getConversations();
    let found = convs.find(c => c.related_mission_id === mission.id);

    if (!found) {
      found = {
        id: `conv-${mission.id}`,
        conversation_type: 'donor_rescuemate',
        title: `Mission ${mission.batch_id} Coordination`,
        related_donation_id: mission.food_listing_id,
        related_batch_id: mission.batch_id,
        related_mission_id: mission.id,
        food_name: mission.food_name,
        pickup_address: mission.pickup_address,
        delivery_address: mission.delivery_address,
        mission_status: mission.mission_status,
        participant_ids: [mission.donor_id, mission.recipient_id, mission.volunteer_id || currentUserId],
        last_message_text: `Mission initialized. Ready for pickup.`,
        last_message_time: new Date().toISOString(),
        unread_count: 0,
        created_at: new Date().toISOString()
      };
      this.setStorage('conversations', [found, ...convs]);
    }

    return found;
  }

  // --- MODULE 8.3: WHATSAPP CONFIGURATION ---
  getWhatsAppConfig(): WhatsAppIntegrationConfig {
    return this.getStorage('whatsapp_config', INITIAL_WHATSAPP_CONFIG);
  }

  updateWhatsAppConfig(config: Partial<WhatsAppIntegrationConfig>): WhatsAppIntegrationConfig {
    const current = this.getWhatsAppConfig();
    const updated = { ...current, ...config };
    this.setStorage('whatsapp_config', updated);
    return updated;
  }

  // --- MODULE 10: NOTIFICATION PREFERENCES ---
  getNotificationPreferences(userId?: string): NotificationPreferences {
    return this.getStorage('notification_prefs', INITIAL_NOTIFICATION_PREFERENCES);
  }

  updateNotificationPreferences(prefs: NotificationPreferences): void {
    this.setStorage('notification_prefs', prefs);
  }

  // --- MODULE 7: IMPACT LEDGER & VERIFIED TRACEABILITY ---
  getImpactLedger() {
    const listings = this.getListings();
    const missions = this.getMissions();
    const distributions = this.getDistributions();

    return listings.map(l => {
      const mission = missions.find(m => m.food_listing_id === l.id || m.batch_id === l.batch_id);
      const dist = distributions.find(d => d.batch_id === l.batch_id);

      const isListed = true;
      const isApproved = l.listing_status !== 'draft' && l.listing_status !== 'rejected';
      const isAllocated = Boolean(mission);
      const isPickedUp = mission?.mission_status === 'picked_up' || mission?.mission_status === 'in_transit' || mission?.mission_status === 'delivered' || mission?.mission_status === 'completed';
      const isReceived = mission?.mission_status === 'delivered' || mission?.mission_status === 'completed';
      const isDistributed = Boolean(dist && dist.quantity_distributed_kg > 0);
      const isServed = Boolean(dist && dist.meals_served_count > 0);

      return {
        batchId: l.batch_id,
        foodName: l.food_name,
        donorName: l.donor_name || 'Verified Kitchen',
        donorId: l.donor_id,
        quantityKg: l.quantity,
        portions: l.estimated_portions,
        category: l.food_category,
        recipientName: mission?.recipient_name || dist?.distribution_location || 'Pending Allocation',
        rescueMateName: mission?.volunteer_name || 'Unassigned',
        stages: {
          listed: { status: isListed, timestamp: l.created_at },
          approved: { status: isApproved, timestamp: l.created_at },
          allocated: { status: isAllocated, timestamp: mission?.created_at },
          pickedUp: { status: isPickedUp, timestamp: mission?.created_at },
          received: { status: isReceived, timestamp: dist?.distribution_time },
          distributed: { status: isDistributed, timestamp: dist?.distribution_time },
          served: { status: isServed, timestamp: dist?.distribution_time }
        },
        verifiedCredits: isServed ? Math.round(l.estimated_portions * 1.5) : 0,
        safetyStatus: l.safety_status
      };
    });
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
