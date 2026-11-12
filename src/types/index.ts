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

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  verification_status: VerificationStatus;
  account_status: string;
  location?: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  avatar_url?: string;
  is_volunteer: boolean;
  volunteer_approved: boolean;
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
