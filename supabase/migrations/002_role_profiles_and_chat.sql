-- ====================================================================
-- UNAVULINK DATABASE MIGRATION - 002_ROLE_PROFILES_AND_CHAT.SQL
-- Additive Schema: Role-Specific Profiles, RescueMate, Chat & WhatsApp Config
-- Target: Supabase / PostgreSQL (with Row Level Security)
-- ====================================================================

-- 1. DONOR BUSINESS PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.donor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL, -- 'Restaurant', 'Hotel', 'Hostel', 'Wedding hall', etc.
    fssai_licence_number TEXT,
    fssai_doc_url TEXT,
    address TEXT NOT NULL,
    district TEXT NOT NULL DEFAULT 'Coimbatore',
    city TEXT NOT NULL DEFAULT 'Coimbatore',
    postal_code TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    operating_hours TEXT NOT NULL,
    food_prep_facility_type TEXT NOT NULL,
    authorized_contact_name TEXT NOT NULL,
    authorized_contact_phone TEXT NOT NULL,
    authorized_contact_email TEXT NOT NULL,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    rescue_credits INTEGER NOT NULL DEFAULT 0,
    total_donations INTEGER NOT NULL DEFAULT 0,
    total_kg_donated NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. ACCEPTOR PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.acceptor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    entity_type TEXT NOT NULL DEFAULT 'Individual', -- 'Individual', 'Community group', 'Other'
    dietary_preferences TEXT[] NOT NULL DEFAULT '{}',
    allergen_restrictions TEXT[] NOT NULL DEFAULT '{}',
    approx_portions_needed INTEGER NOT NULL DEFAULT 10,
    people_served_count INTEGER,
    preferred_receiving_method TEXT NOT NULL DEFAULT 'Self-Pickup',
    address_privacy_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    address_neighborhood TEXT,
    district TEXT NOT NULL DEFAULT 'Coimbatore',
    city TEXT NOT NULL DEFAULT 'Coimbatore',
    postal_code TEXT,
    storage_capacity_description TEXT,
    preferred_collection_times TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. NGO PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.ngo_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    organisation_name TEXT NOT NULL,
    registration_type TEXT NOT NULL DEFAULT 'Trust',
    registration_number TEXT NOT NULL,
    organisation_description TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    year_established INTEGER NOT NULL,
    contact_person TEXT NOT NULL,
    official_email TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    designation TEXT NOT NULL,
    verification_document_url TEXT,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    primary_location TEXT NOT NULL,
    service_areas TEXT[] NOT NULL DEFAULT '{}',
    operating_hours TEXT NOT NULL,
    daily_receiving_capacity_kg NUMERIC(10, 2) NOT NULL DEFAULT 50,
    storage_capacity_kg NUMERIC(10, 2) NOT NULL DEFAULT 100,
    refrigeration_available BOOLEAN NOT NULL DEFAULT FALSE,
    accepted_food_categories TEXT[] NOT NULL DEFAULT '{}',
    beneficiary_service_capacity INTEGER NOT NULL DEFAULT 80,
    distribution_facilities TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. RESCUEMATE PROFILES TABLE (Common People Volunteer Approval)
CREATE TABLE IF NOT EXISTS public.rescuemate_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    email TEXT NOT NULL,
    profile_photo_url TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'en',
    service_areas TEXT[] NOT NULL DEFAULT '{}',
    city TEXT NOT NULL DEFAULT 'Coimbatore',
    district TEXT NOT NULL DEFAULT 'Coimbatore',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    available_days TEXT[] NOT NULL DEFAULT '{}',
    available_time_slots TEXT[] NOT NULL DEFAULT '{}',
    transport_type TEXT NOT NULL DEFAULT 'Two-wheeler', -- 'Walking', 'Bicycle', 'Two-wheeler', 'Car', 'Other'
    carrying_capacity_kg NUMERIC(10, 2) NOT NULL DEFAULT 20,
    preferred_travel_distance_km NUMERIC(10, 2) NOT NULL DEFAULT 10,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    safety_agreement_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    approval_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMPTZ,
    rescue_credits INTEGER NOT NULL DEFAULT 0,
    total_rescues INTEGER NOT NULL DEFAULT 0,
    active_mission_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. CHAT CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_type TEXT NOT NULL, -- 'donor_ngo', 'donor_rescuemate', 'ngo_rescuemate', 'acceptor_ngo', 'admin_support'
    title TEXT NOT NULL,
    related_donation_id UUID REFERENCES public.food_listings(id) ON DELETE SET NULL,
    related_batch_id TEXT,
    related_mission_id UUID REFERENCES public.rescue_missions(id) ON DELETE SET NULL,
    food_name TEXT,
    pickup_address TEXT,
    delivery_address TEXT,
    mission_status TEXT,
    participant_ids UUID[] NOT NULL DEFAULT '{}',
    last_message_text TEXT,
    last_message_time TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_role user_role NOT NULL,
    sender_avatar TEXT,
    message_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'image', 'predefined_action', 'system'
    content TEXT NOT NULL,
    attachment_url TEXT,
    delivery_status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'delivered', 'read'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    read_at TIMESTAMPTZ
);

-- 7. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    whatsapp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    requests_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    approvals_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    assignments_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    pickup_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    delivery_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    delays_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    safety_incidents_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    whatsapp_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    whatsapp_phone TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.donor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acceptor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescuemate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles Access: Public read of verified business names, owner update
CREATE POLICY "Public can view verified donor profiles" ON public.donor_profiles
    FOR SELECT USING (true);
CREATE POLICY "Donors manage own business profile" ON public.donor_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Acceptors manage own profile" ON public.acceptor_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view verified NGOs" ON public.ngo_profiles
    FOR SELECT USING (true);
CREATE POLICY "NGOs manage own profile" ON public.ngo_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "RescueMate profiles read policy" ON public.rescuemate_profiles
    FOR SELECT USING (auth.uid() = user_id OR approval_status = 'approved');
CREATE POLICY "RescueMate updates own application" ON public.rescuemate_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Chat RLS: Only conversation participants can view/send messages
CREATE POLICY "Participants view conversations" ON public.chat_conversations
    FOR SELECT USING (auth.uid() = ANY(participant_ids));

CREATE POLICY "Participants view messages" ON public.chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_conversations c 
            WHERE c.id = conversation_id AND auth.uid() = ANY(c.participant_ids)
        )
    );

CREATE POLICY "Participants insert messages" ON public.chat_messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.chat_conversations c 
            WHERE c.id = conversation_id AND auth.uid() = ANY(c.participant_ids)
        )
    );
