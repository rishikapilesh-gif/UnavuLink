// ====================================================================
// UNAVULINK CORE TYPES & INTERFACES
// ====================================================================

export type UserRole = 'Admin' | 'Donor' | 'Acceptor' | 'NGO' | 'Common People';
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';
export type FoodSafetyStatus = 'eligible' | 'under_review' | 'ineligible' | 'frozen' | 'recalled' | 'expired';

export type FoodListingStatus = 
  | 'draft' 
  | 'under_review' 
  | 'available' 
  | 'matched' 
  | 'request_received'
  | 'approved' 
  | 'pickup_pending' 
  | 'picked_up' 
  | 'in_transit' 
  | 'delivered'
  | 'completed' 
  | 'rejected' 
  | 'frozen' 
  | 'recalled' 
  | 'expired' 
  | 'cancelled';

export type MissionStatus = 
  | 'created' 
  | 'volunteer_assigned' 
  | 'volunteer_en_route' 
  | 'at_pickup' 
  | 'picked_up' 
  | 'in_transit' 
  | 'at_destination' 
  | 'delivered' 
  | 'completed' 
  | 'failed' 
  | 'reassigned' 
  | 'cancelled';

export type EmailStatus = 'unverified' | 'verified';
export type AccountStatus = 'active' | 'suspended' | 'disabled';
export type OrgVerificationStatus = 'pending' | 'approved' | 'rejected' | 'requires_resubmission';
export type VolunteerServiceStatus = 'pending_approval' | 'approved' | 'rejected' | 'suspended';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  verification_status: VerificationStatus;
  email_status: EmailStatus;
  account_status: AccountStatus;
  org_verification: OrgVerificationStatus;
  volunteer_status: VolunteerServiceStatus;
  location?: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  avatar_url?: string;
  is_volunteer: boolean;
  volunteer_approved: boolean;
  password_hash?: string;
  email_verification_token?: string;
  email_verification_sent_at?: string;
  password_reset_token?: string;
  password_reset_expires_at?: string;
  failed_login_count?: number;
  locked_until?: string;
  created_at: string;
}

export interface Organization {
  id: string;
  profile_id: string;
  organisation_name: string;
  organisation_type: string;
  registration_number?: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  contact_phone: string;
  contact_email?: string;
  verification_status: VerificationStatus;
  receiving_capacity_kg: number;
  storage_capabilities: string[];
  operating_hours: string;
}

export interface FoodListing {
  id: string;
  batch_id: string;
  donor_id: string;
  donor_name?: string;
  organization_id?: string;
  organization_name?: string;
  food_name: string;
  description: string;
  image_url?: string;
  food_category: 'Cooked Meals' | 'Bakery' | 'Raw Produce' | 'Packaged Food' | 'Dairy';
  dietary_category: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Jain';
  quantity: number;
  unit: string;
  estimated_portions: number;
  preparation_time: string;
  storage_information: string;
  temperature_celsius?: number;
  ingredients?: string;
  allergens: string[];
  packaging_information: string;
  handling_information: string;
  permitted_handling_deadline: string;
  pickup_location: string;
  latitude: number;
  longitude: number;
  pickup_start: string;
  pickup_end: string;
  safety_status: FoodSafetyStatus;
  listing_status: FoodListingStatus;
  is_emergency: boolean;
  created_at: string;
}

export interface DonationRequest {
  id: string;
  food_listing_id: string;
  requester_id: string;
  requester_name: string;
  organization_name?: string;
  requested_quantity: number;
  approved_quantity?: number;
  request_status: 'pending' | 'approved' | 'rejected' | 'partial';
  rejection_reason?: string;
  donor_response_notes?: string;
  created_at: string;
}

export interface RescueMission {
  id: string;
  batch_id: string;
  food_listing_id: string;
  food_name?: string;
  donor_id: string;
  donor_name: string;
  recipient_id: string;
  recipient_name: string;
  volunteer_id?: string;
  volunteer_name?: string;
  volunteer_phone?: string;
  mission_status: MissionStatus;
  pickup_otp: string;
  delivery_otp: string;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  delivery_address: string;
  delivery_lat: number;
  delivery_lng: number;
  distance_km: number;
  estimated_duration_mins: number;
  created_at: string;
}

export interface CommunityHotspot {
  id: string;
  name: string;
  location: string;
  city: string;
  latitude: number;
  longitude: number;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  verified_by_admin: boolean;
  status: 'active' | 'resolved';
  created_at: string;
}

export interface CommunityHub {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  operator_name: string;
  contact_phone: string;
  opening_hours: string;
  capacity_kg: number;
  current_availability_kg: number;
  status: string;
}

export interface SafetyIncident {
  id: string;
  batch_id: string;
  food_listing_id?: string;
  reporter_id: string;
  reporter_name: string;
  incident_type: 'Suspected Spoilage' | 'Allergen Mismatch' | 'Temperature Abuse' | 'Packaging Damage' | 'Other';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'batch_frozen' | 'recalled' | 'cleared' | 'resolved';
  resolution_notes?: string;
  reported_at: string;
  resolved_at?: string;
}

export interface BeneficiaryRecord {
  id: string;
  organization_id: string;
  internal_beneficiary_reference: string;
  beneficiary_count: number;
  distribution_location: string;
  dietary_requirements: string;
  record_status: string;
  created_at: string;
}

export interface DistributionRecord {
  id: string;
  organization_id: string;
  batch_id: string;
  quantity_received_kg: number;
  quantity_distributed_kg: number;
  meals_served_count: number;
  remaining_quantity_kg: number;
  distribution_location: string;
  distribution_time: string;
  notes?: string;
}

export interface VolunteerProfile {
  id: string;
  user_id: string;
  full_name?: string;
  transport_type: string;
  max_carrying_capacity_kg: number;
  service_area: string;
  availability_status: 'available' | 'busy' | 'offline';
  is_approved: boolean;
  rescue_credits: number;
  total_rescues: number;
}

// --- MODULE 2 & 3: ROLE-SPECIFIC PROFILES ---

export type DonorBusinessType = 
  | 'Restaurant' 
  | 'Hotel' 
  | 'Hostel' 
  | 'Wedding hall' 
  | 'Catering service' 
  | 'Bakery' 
  | 'Food manufacturer' 
  | 'Event organiser' 
  | 'Supermarket' 
  | 'Other';

export interface DonorBusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_type: DonorBusinessType;
  fssai_licence_number?: string;
  fssai_doc_url?: string;
  address: string;
  district: string;
  city: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  operating_hours: string;
  food_prep_facility_type: string;
  authorized_contact_name: string;
  authorized_contact_phone: string;
  authorized_contact_email: string;
  verification_status: VerificationStatus;
  rescue_credits: number;
  total_donations: number;
  total_kg_donated: number;
  created_at: string;
}

export interface AcceptorProfile {
  id: string;
  user_id: string;
  full_name: string;
  entity_type: 'Individual' | 'Community group' | 'Other';
  dietary_preferences: string[];
  allergen_restrictions: string[];
  approx_portions_needed: number;
  people_served_count?: number;
  preferred_receiving_method: 'Self-Pickup' | 'Shelter Delivery' | 'Community Fridge';
  address_privacy_enabled: boolean;
  address_neighborhood?: string;
  district: string;
  city: string;
  postal_code?: string;
  storage_capacity_description?: string;
  preferred_collection_times: string[];
  created_at: string;
}

export interface NGOProfile {
  id: string;
  user_id: string;
  organisation_name: string;
  registration_type: 'Trust' | 'Society' | 'Section 8' | 'Charity';
  registration_number: string;
  organisation_description: string;
  logo_url?: string;
  website_url?: string;
  year_established: number;
  contact_person: string;
  official_email: string;
  mobile_number: string;
  designation: string;
  verification_document_url?: string;
  verification_status: VerificationStatus;
  primary_location: string;
  service_areas: string[];
  operating_hours: string;
  daily_receiving_capacity_kg: number;
  storage_capacity_kg: number;
  refrigeration_available: boolean;
  accepted_food_categories: string[];
  beneficiary_service_capacity: number;
  distribution_facilities: string[];
  created_at: string;
}

export interface RescueMateProfile {
  id: string;
  user_id: string;
  full_name: string;
  mobile_number: string;
  email: string;
  profile_photo_url?: string;
  preferred_language: string;
  service_areas: string[];
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  available_days: string[];
  available_time_slots: string[];
  transport_type: 'Walking' | 'Bicycle' | 'Two-wheeler' | 'Car' | 'Other';
  carrying_capacity_kg: number;
  preferred_travel_distance_km: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  safety_agreement_accepted: boolean;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  rescue_credits: number;
  total_rescues: number;
  active_mission_id?: string;
  created_at: string;
}

// --- MODULE 8 & 9: CHAT & MESSAGING ARCHITECTURE ---

export type ConversationType = 
  | 'donor_ngo' 
  | 'donor_rescuemate' 
  | 'ngo_rescuemate' 
  | 'acceptor_ngo' 
  | 'admin_support';

export interface ChatConversation {
  id: string;
  conversation_type: ConversationType;
  title: string;
  related_donation_id?: string;
  related_batch_id?: string;
  related_mission_id?: string;
  food_name?: string;
  pickup_address?: string;
  delivery_address?: string;
  mission_status?: MissionStatus;
  participant_ids: string[];
  last_message_text: string;
  last_message_time: string;
  unread_count?: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: UserRole;
  sender_avatar?: string;
  message_type: 'text' | 'image' | 'predefined_action' | 'system';
  content: string;
  attachment_url?: string;
  delivery_status: 'sent' | 'delivered' | 'read';
  created_at: string;
  read_at?: string;
}

// --- MODULE 8.3: WHATSAPP INTEGRATION SETTINGS ---

export interface WhatsAppIntegrationConfig {
  phone_number_id: string;
  business_account_id: string;
  webhook_verify_token: string;
  webhook_callback_url: string;
  is_connected: boolean;
  status_message: string;
  last_webhook_event_at?: string;
  template_count: number;
  missing_configs: string[];
}

// --- MODULE 10: NOTIFICATION PREFERENCES ---

export interface NotificationPreferences {
  user_id: string;
  channels: {
    in_app: boolean;
    whatsapp: boolean;
    email: boolean;
  };
  categories: {
    requests: boolean;
    approvals: boolean;
    assignments: boolean;
    pickup: boolean;
    delivery: boolean;
    delays: boolean;
    safety_incidents: boolean;
  };
  whatsapp_opt_in: boolean;
  whatsapp_phone?: string;
}

// --- MODULE 4.4: FAIRSHARE ALLOCATION PLAN ---

export interface FairShareAllocationItem {
  recipientId: string;
  recipientName: string;
  needScore: number;
  capacityKg: number;
  allocatedKg: number;
  allocatedPortions: number;
  transitDistanceKm: number;
  explanation: string;
}

export interface FairShareAllocationPlan {
  foodBatchId: string;
  foodName: string;
  totalSurplusKg: number;
  totalSurplusPortions: number;
  allocations: FairShareAllocationItem[];
  unallocatedKg: number;
  fairnessIndexPercent: number;
  generatedAt: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent' | 'success';
  link?: string;
  is_read: boolean;
  created_at: string;
}
