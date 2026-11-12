-- ====================================================================
-- UNAVULINK DATABASE MIGRATION - 001_INITIAL_SCHEMA.SQL
-- AI-Powered Food Rescue, Redistribution & Community Intelligence Platform
-- Target: Supabase / PostgreSQL (with Row Level Security)
-- ====================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('Admin', 'Donor', 'Acceptor', 'NGO', 'Common People');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE food_safety_status AS ENUM ('eligible', 'under_review', 'ineligible', 'frozen', 'recalled', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE food_listing_status AS ENUM (
        'draft', 'under_review', 'available', 'matched', 'request_received',
        'approved', 'pickup_pending', 'picked_up', 'in_transit', 'delivered',
        'completed', 'rejected', 'frozen', 'recalled', 'expired', 'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mission_status AS ENUM (
        'created', 'volunteer_assigned', 'volunteer_en_route', 'at_pickup',
        'picked_up', 'in_transit', 'at_destination', 'delivered',
        'completed', 'failed', 'reassigned', 'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CORE PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'Common People',
    verification_status verification_status NOT NULL DEFAULT 'pending',
    account_status TEXT NOT NULL DEFAULT 'active',
    location TEXT,
    city TEXT DEFAULT 'Coimbatore',
    state TEXT DEFAULT 'Tamil Nadu',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    avatar_url TEXT,
    is_volunteer BOOLEAN NOT NULL DEFAULT FALSE,
    volunteer_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    organisation_name TEXT NOT NULL,
    organisation_type TEXT NOT NULL, -- 'Restaurant', 'Hotel', 'Hostel', 'NGO', 'Shelter', 'Catering', etc.
    registration_number TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Coimbatore',
    state TEXT NOT NULL DEFAULT 'Tamil Nadu',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    receiving_capacity_kg NUMERIC(10, 2) DEFAULT 100.00,
    storage_capabilities TEXT[] DEFAULT ARRAY['ambient']::TEXT[],
    operating_hours TEXT DEFAULT '09:00 - 21:00',
    service_radius_km NUMERIC(5, 2) DEFAULT 15.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. FOOD LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.food_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT UNIQUE NOT NULL, -- e.g. 'UNV-2026-CBE-001'
    donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    food_name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    food_category TEXT NOT NULL, -- 'Cooked Meals', 'Bakery', 'Raw Produce', 'Packaged Food', 'Dairy'
    dietary_category TEXT NOT NULL DEFAULT 'Vegetarian', -- 'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain'
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL DEFAULT 'kg', -- 'kg', 'portions', 'litres', 'boxes'
    estimated_portions INTEGER NOT NULL CHECK (estimated_portions > 0),
    preparation_time TIMESTAMPTZ NOT NULL,
    storage_information TEXT NOT NULL, -- 'Ambient', 'Hot Box (>60°C)', 'Refrigerated (<4°C)'
    temperature_celsius NUMERIC(5, 2),
    ingredients TEXT,
    allergens TEXT[] DEFAULT ARRAY[]::TEXT[],
    packaging_information TEXT DEFAULT 'Food grade stainless containers / foil packaging',
    handling_information TEXT DEFAULT 'Consume within permitted safety window',
    permitted_handling_deadline TIMESTAMPTZ NOT NULL,
    pickup_location TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    pickup_start TIMESTAMPTZ NOT NULL,
    pickup_end TIMESTAMPTZ NOT NULL,
    safety_status food_safety_status NOT NULL DEFAULT 'eligible',
    listing_status food_listing_status NOT NULL DEFAULT 'available',
    is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. FOOD SAFETY CHECKS TABLE
CREATE TABLE IF NOT EXISTS public.food_safety_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_listing_id UUID NOT NULL REFERENCES public.food_listings(id) ON DELETE CASCADE,
    checklist_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    missing_information TEXT[],
    flagged_concerns TEXT[],
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_status TEXT NOT NULL DEFAULT 'approved', -- 'approved', 'flagged', 'rejected'
    review_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. DONATION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.donation_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_listing_id UUID NOT NULL REFERENCES public.food_listings(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    requested_quantity NUMERIC(10, 2) NOT NULL CHECK (requested_quantity > 0),
    approved_quantity NUMERIC(10, 2),
    request_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'partial'
    rejection_reason TEXT,
    donor_response_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. RESCUE MISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.rescue_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    food_listing_id UUID NOT NULL REFERENCES public.food_listings(id) ON DELETE CASCADE,
    donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    volunteer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    mission_status mission_status NOT NULL DEFAULT 'created',
    pickup_otp VARCHAR(6) NOT NULL,
    delivery_otp VARCHAR(6) NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_lat DOUBLE PRECISION NOT NULL,
    pickup_lng DOUBLE PRECISION NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_lat DOUBLE PRECISION NOT NULL,
    delivery_lng DOUBLE PRECISION NOT NULL,
    distance_km NUMERIC(6, 2) DEFAULT 4.5,
    estimated_duration_mins INTEGER DEFAULT 25,
    route_geometry JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. VOLUNTEER TASKS TABLE
CREATE TABLE IF NOT EXISTS public.volunteer_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rescue_mission_id UUID NOT NULL REFERENCES public.rescue_missions(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_status TEXT NOT NULL DEFAULT 'assigned', -- 'assigned', 'accepted', 'pickup_done', 'delivered', 'cancelled'
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    pickup_time TIMESTAMPTZ,
    delivery_time TIMESTAMPTZ,
    collected_quantity NUMERIC(10, 2),
    delivered_quantity NUMERIC(10, 2),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. BENEFICIARIES TABLE
CREATE TABLE IF NOT EXISTS public.beneficiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    internal_beneficiary_reference TEXT NOT NULL, -- e.g. 'BEN-SHELTER-004'
    beneficiary_count INTEGER NOT NULL CHECK (beneficiary_count > 0),
    distribution_location TEXT NOT NULL,
    dietary_requirements TEXT DEFAULT 'Standard Vegetarian / High Protein',
    record_status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. WASTE REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.waste_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reporter_name TEXT,
    reporter_phone TEXT,
    location TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Coimbatore',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    food_type TEXT NOT NULL,
    estimated_quantity TEXT NOT NULL, -- 'Small (< 10kg)', 'Medium (10-50kg)', 'Bulk (> 50kg)'
    report_description TEXT,
    image_url TEXT,
    report_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'dispatched', 'resolved', 'dismissed'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. FINANCIAL DONATIONS TABLE
CREATE TABLE IF NOT EXISTS public.financial_donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    donor_name TEXT NOT NULL,
    donor_email TEXT,
    recipient_organisation_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_status TEXT NOT NULL DEFAULT 'completed',
    transaction_reference TEXT UNIQUE NOT NULL,
    purpose TEXT DEFAULT 'Emergency Food Rescue & Volunteer Fuel Fund',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info', -- 'info', 'warning', 'urgent', 'success'
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. FOOD ALLOCATIONS (FAIRSHARE ENGINE)
CREATE TABLE IF NOT EXISTS public.food_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_listing_id UUID NOT NULL REFERENCES public.food_listings(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    allocated_quantity NUMERIC(10, 2) NOT NULL,
    fairshare_score NUMERIC(5, 2) NOT NULL,
    allocation_notes TEXT,
    status TEXT NOT NULL DEFAULT 'proposed', -- 'proposed', 'approved', 'declined', 'fulfilled'
    allocated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. FOOD BATCH PASSPORTS (QR SAFETY PASSPORT)
CREATE TABLE IF NOT EXISTS public.food_batch_passports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT UNIQUE NOT NULL,
    food_listing_id UUID NOT NULL REFERENCES public.food_listings(id) ON DELETE CASCADE,
    qr_code_payload JSONB NOT NULL,
    safety_status food_safety_status NOT NULL DEFAULT 'eligible',
    temperature_records JSONB DEFAULT '[]'::jsonb,
    custody_chain JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. PICKUP RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.pickup_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rescue_mission_id UUID NOT NULL REFERENCES public.rescue_missions(id) ON DELETE CASCADE,
    batch_id TEXT NOT NULL,
    donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    verified_quantity NUMERIC(10, 2) NOT NULL,
    pickup_timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    temperature_at_pickup NUMERIC(5, 2),
    handover_notes TEXT
);

-- 17. DELIVERY RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.delivery_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rescue_mission_id UUID NOT NULL REFERENCES public.rescue_missions(id) ON DELETE CASCADE,
    batch_id TEXT NOT NULL,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    received_quantity NUMERIC(10, 2) NOT NULL,
    discrepancy_amount NUMERIC(10, 2) DEFAULT 0.0,
    discrepancy_reason TEXT,
    temperature_at_delivery NUMERIC(5, 2),
    delivery_timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 18. RESCUE INCIDENTS TABLE (FOOD SAFETY & RECALLS)
CREATE TABLE IF NOT EXISTS public.rescue_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    food_listing_id UUID REFERENCES public.food_listings(id) ON DELETE SET NULL,
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    incident_type TEXT NOT NULL, -- 'Suspected Spoilage', 'Allergen Mismatch', 'Temperature Abuse', 'Packaging Damage', 'Other'
    description TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'critical', -- 'low', 'medium', 'high', 'critical'
    evidence_url TEXT,
    status TEXT NOT NULL DEFAULT 'open', -- 'open', 'investigating', 'batch_frozen', 'recalled', 'cleared', 'resolved'
    resolution_notes TEXT,
    reported_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    resolved_at TIMESTAMPTZ
);

-- 19. TEMPERATURE LOGS (COLD CHAIN MONITORING)
CREATE TABLE IF NOT EXISTS public.temperature_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    temperature_celsius NUMERIC(5, 2) NOT NULL,
    is_simulated BOOLEAN NOT NULL DEFAULT FALSE,
    threshold_exceeded BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 20. NGO REQUIREMENTS TABLE
CREATE TABLE IF NOT EXISTS public.ngo_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    daily_requirement_kg NUMERIC(10, 2) NOT NULL DEFAULT 80.0,
    max_capacity_kg NUMERIC(10, 2) NOT NULL DEFAULT 150.0,
    preferred_categories TEXT[] DEFAULT ARRAY['Cooked Meals', 'Raw Produce']::TEXT[],
    dietary_preferences TEXT[] DEFAULT ARRAY['Vegetarian']::TEXT[],
    refrigeration_available BOOLEAN NOT NULL DEFAULT TRUE,
    storage_type TEXT DEFAULT 'Cold storage & hot buffet chafers',
    receiving_hours TEXT DEFAULT '10:00 - 20:00',
    service_area TEXT DEFAULT 'Coimbatore Urban & Periphery',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 21. COMMUNITY HOTSPOTS TABLE
CREATE TABLE IF NOT EXISTS public.community_hotspots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Coimbatore',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    category TEXT NOT NULL, -- 'High Hunger Area', 'Food Waste Hub', 'Community Kitchen', 'Slum Settlement'
    severity TEXT NOT NULL DEFAULT 'High', -- 'Low', 'Medium', 'High', 'Critical'
    reported_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    verified_by_admin BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 22. COMMUNITY HUBS TABLE (COMMUNITY FRIDGES / HUBS)
CREATE TABLE IF NOT EXISTS public.community_hubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Coimbatore',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    operator_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    opening_hours TEXT NOT NULL DEFAULT '08:00 - 22:00',
    capacity_kg NUMERIC(10, 2) NOT NULL DEFAULT 50.0,
    current_availability_kg NUMERIC(10, 2) NOT NULL DEFAULT 18.0,
    facilities TEXT[] DEFAULT ARRAY['Refrigerator', 'Sheltered Dispenser', 'CCTV']::TEXT[],
    status TEXT NOT NULL DEFAULT 'operational',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 23. VOLUNTEER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.volunteer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    transport_type TEXT NOT NULL DEFAULT 'Two Wheeler', -- 'Two Wheeler', 'Car', 'Mini Van', 'Bicycle'
    max_carrying_capacity_kg NUMERIC(6, 2) NOT NULL DEFAULT 20.0,
    service_area TEXT NOT NULL DEFAULT 'Coimbatore Central & Gandhipuram',
    availability_status TEXT NOT NULL DEFAULT 'available', -- 'available', 'busy', 'offline'
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    rescue_credits INTEGER NOT NULL DEFAULT 50,
    total_rescues INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 24. RESCUE CREDITS TABLE
CREATE TABLE IF NOT EXISTS public.rescue_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    points INTEGER NOT NULL,
    reason TEXT NOT NULL,
    reference_id TEXT,
    awarded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 25. IMPACT REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.impact_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period TEXT NOT NULL, -- '2026-11' or 'All Time'
    total_food_rescued_kg NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    total_meals_served INTEGER NOT NULL DEFAULT 0,
    co2_saved_kg NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    water_saved_litres NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    active_donors_count INTEGER NOT NULL DEFAULT 0,
    active_ngos_count INTEGER NOT NULL DEFAULT 0,
    volunteers_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 26. PREDICTIVE SURPLUS RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.predictive_surplus_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'Wedding Buffet', 'Weekend Dinner', 'Hostel Mess', 'Catering Event'
    predicted_kg_min NUMERIC(8, 2) NOT NULL,
    predicted_kg_max NUMERIC(8, 2) NOT NULL,
    actual_kg NUMERIC(8, 2),
    surplus_date DATE NOT NULL,
    confidence_score NUMERIC(4, 2) DEFAULT 0.88,
    suggestions TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 27. DIGITAL TWIN SCENARIOS TABLE
CREATE TABLE IF NOT EXISTS public.digital_twin_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    simulation_type TEXT NOT NULL, -- 'volunteer_cancellation', 'ngo_rejection', 'route_delay', 'spoilage_freeze'
    original_plan JSONB NOT NULL,
    simulated_failure JSONB NOT NULL,
    alternative_solution JSONB NOT NULL,
    affected_metrics JSONB NOT NULL,
    simulated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 28. RECOVERY TASKS TABLE
CREATE TABLE IF NOT EXISTS public.recovery_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rescue_mission_id UUID NOT NULL REFERENCES public.rescue_missions(id) ON DELETE CASCADE,
    failure_reason TEXT NOT NULL,
    recovery_action_taken TEXT NOT NULL,
    previous_volunteer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    new_volunteer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    previous_recipient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    new_recipient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'executed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 29. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL, -- 'DONOR_VERIFIED', 'BATCH_FROZEN', 'RECALL_ISSUED', 'VOLUNTEER_APPROVED', etc.
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 30. DISTRIBUTION RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.distribution_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    batch_id TEXT NOT NULL,
    quantity_received_kg NUMERIC(10, 2) NOT NULL,
    quantity_distributed_kg NUMERIC(10, 2) NOT NULL,
    meals_served_count INTEGER NOT NULL CHECK (meals_served_count >= 0),
    remaining_quantity_kg NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    distribution_location TEXT NOT NULL,
    distribution_time TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 31. OTP VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.otp_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rescue_mission_id UUID NOT NULL REFERENCES public.rescue_missions(id) ON DELETE CASCADE,
    stage TEXT NOT NULL, -- 'pickup', 'delivery'
    entered_otp VARCHAR(6) NOT NULL,
    is_valid BOOLEAN NOT NULL,
    attempted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_safety_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescue_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_batch_passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescue_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temperature_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_hotspots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescue_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_surplus_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_twin_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distribution_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'Admin'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles: Anyone can view public details, users can update their own profile, admin full access
CREATE POLICY "Public profiles are readable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin has full profile access" ON public.profiles FOR ALL USING (public.is_admin());

-- Food Listings: Eligible listings readable by all authenticated, donors can insert/update own listings
CREATE POLICY "Eligible food listings viewable by all" ON public.food_listings
    FOR SELECT USING (listing_status != 'draft' OR donor_id = auth.uid() OR public.is_admin());
CREATE POLICY "Verified Donors can insert listings" ON public.food_listings
    FOR INSERT WITH CHECK (donor_id = auth.uid());
CREATE POLICY "Donors can update own listings" ON public.food_listings
    FOR UPDATE USING (donor_id = auth.uid() OR public.is_admin());

-- Donation requests: Requester can see their own, Donor can see requests for their listings
CREATE POLICY "Users can see own requests or donor listings" ON public.donation_requests
    FOR SELECT USING (
        requester_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.food_listings fl WHERE fl.id = food_listing_id AND fl.donor_id = auth.uid()) OR
        public.is_admin()
    );
CREATE POLICY "Requesters can create donation requests" ON public.donation_requests
    FOR INSERT WITH CHECK (requester_id = auth.uid());
CREATE POLICY "Donors can update request status" ON public.donation_requests
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.food_listings fl WHERE fl.id = food_listing_id AND fl.donor_id = auth.uid()) OR
        public.is_admin()
    );

-- Rescue Missions: Accessible to donor, recipient, assigned volunteer and admin
CREATE POLICY "Missions accessible to participants and admin" ON public.rescue_missions
    FOR SELECT USING (
        donor_id = auth.uid() OR
        recipient_id = auth.uid() OR
        volunteer_id = auth.uid() OR
        public.is_admin()
    );

-- Notifications: User can only see their own notifications
CREATE POLICY "Users see own notifications" ON public.notifications
    FOR ALL USING (user_id = auth.uid());

-- Hotspots: Viewable by all, insertable by authenticated users
CREATE POLICY "Hotspots viewable by all" ON public.community_hotspots FOR SELECT USING (true);
CREATE POLICY "Users can report hotspots" ON public.community_hotspots FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Community Hubs: Viewable by all
CREATE POLICY "Community hubs viewable by all" ON public.community_hubs FOR SELECT USING (true);

-- Impact Reports: Publicly readable
CREATE POLICY "Impact reports public" ON public.impact_reports FOR SELECT USING (true);
