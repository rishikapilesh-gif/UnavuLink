-- ====================================================================
-- UNAVULINK SEED DATA - REALISTIC TAMIL NADU DEMO DATA
-- Note: All sample records are clearly labelled as demonstration data
-- ====================================================================

-- 1. Insert Demo Profiles
INSERT INTO public.profiles (id, full_name, email, phone, role, verification_status, account_status, location, city, state, latitude, longitude, is_volunteer, volunteer_approved)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Dr. Sundaramoorthy Admin', 'admin@unavulink.org', '+91 98422 10001', 'Admin', 'verified', 'active', 'Gandhipuram, Coimbatore', 'Coimbatore', 'Tamil Nadu', 11.0183, 76.9644, false, false),
  ('22222222-2222-2222-2222-222222222222', 'Senthil Kumar (Annapoorna Caterers)', 'senthil@annapoorna.demo', '+91 98422 20002', 'Donor', 'verified', 'active', 'RS Puram, Coimbatore', 'Coimbatore', 'Tamil Nadu', 11.0123, 76.9482, false, false),
  ('33333333-3333-3333-3333-333333333333', 'Meenakshi Sundaram (Grand Palace Banquet)', 'meenakshi@grandpalace.demo', '+91 98422 30003', 'Donor', 'verified', 'active', 'Avinashi Road, Coimbatore', 'Coimbatore', 'Tamil Nadu', 11.0315, 77.0189, false, false),
  ('44444444-4444-4444-4444-444444444444', 'Sister Mary (Anbalayam Shelter)', 'sister.mary@anbalayam.demo', '+91 98422 40004', 'NGO', 'verified', 'active', 'Saibaba Colony, Coimbatore', 'Coimbatore', 'Tamil Nadu', 11.0264, 76.9421, false, false),
  ('55555555-5555-5555-5555-555555555555', 'Murugan Swamy (Karunai Illam)', 'murugan@karunai.demo', '+91 98422 50005', 'NGO', 'verified', 'active', 'Ramanathapuram, Coimbatore', 'Coimbatore', 'Tamil Nadu', 10.9982, 76.9854, false, false),
  ('66666666-6666-6666-6666-666666666666', 'Karthik Subramanian', 'karthik.volunteer@unavulink.demo', '+91 98422 60006', 'Common People', 'verified', 'active', 'Peelamedu, Coimbatore', 'Coimbatore', 'Tamil Nadu', 11.0287, 77.0012, true, true),
  ('77777777-7777-7777-7777-777777777777', 'Priya Ramasamy', 'priya.volunteer@unavulink.demo', '+91 98422 70007', 'Common People', 'verified', 'active', 'Singanallur, Coimbatore', 'Coimbatore', 'Tamil Nadu', 10.9998, 77.0210, true, true),
  ('88888888-8888-8888-8888-888888888888', 'Selvi Anbarasan (Community Kitchen)', 'selvi.acceptor@unavulink.demo', '+91 98422 80008', 'Acceptor', 'verified', 'active', 'Ukkadam, Coimbatore', 'Coimbatore', 'Tamil Nadu', 10.9912, 76.9601, false, false),
  ('99999999-9999-9999-9999-999999999999', 'Arun Kumar Citizen', 'arun.citizen@unavulink.demo', '+91 98422 90009', 'Common People', 'verified', 'active', 'Town Hall, Coimbatore', 'Coimbatore', 'Tamil Nadu', 10.9965, 76.9632, false, false)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Organizations
INSERT INTO public.organizations (id, profile_id, organisation_name, organisation_type, registration_number, address, city, latitude, longitude, contact_phone, verification_status, receiving_capacity_kg, storage_capabilities)
VALUES
  ('a1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Annapoorna Gourmet & Caterers (Demo)', 'Catering & Restaurant', 'TN-CBE-FSSAI-8921', '78 East Sambandam Rd, RS Puram', 'Coimbatore', 11.0123, 76.9482, '+91 98422 20002', 'verified', 200.0, ARRAY['hot_storage', 'cold_storage']),
  ('a2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Grand Palace Convention & Banquet (Demo)', 'Wedding Hall / Banquet', 'TN-CBE-FSSAI-4321', '450 Avinashi Road, Peelamedu', 'Coimbatore', 11.0315, 77.0189, '+91 98422 30003', 'verified', 500.0, ARRAY['hot_holding', 'chiller']),
  ('a3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Anbalayam Children Shelter & Care (Demo)', 'NGO / Children Home', 'NGO-DARPAN-TN-1092', '12 Thadagam Road, Saibaba Colony', 'Coimbatore', 11.0264, 76.9421, '+91 98422 40004', 'verified', 150.0, ARRAY['refrigeration', 'ambient']),
  ('a4444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'Karunai Illam Destitute Shelter (Demo)', 'Shelter / Old Age Home', 'NGO-DARPAN-TN-4819', '84 Trichy Road, Ramanathapuram', 'Coimbatore', 10.9982, 76.9854, '+91 98422 50005', 'verified', 120.0, ARRAY['refrigeration'])
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Volunteer Profiles
INSERT INTO public.volunteer_profiles (id, user_id, transport_type, max_carrying_capacity_kg, service_area, availability_status, is_approved, rescue_credits, total_rescues)
VALUES
  ('b1111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'Two Wheeler', 25.0, 'Peelamedu, Gandhipuram, RS Puram', 'available', true, 180, 24),
  ('b2222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 'Car', 60.0, 'Singanallur, Ramanathapuram, Ukkadam', 'available', true, 120, 15)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Food Listings
INSERT INTO public.food_listings (id, batch_id, donor_id, organization_id, food_name, description, food_category, dietary_category, quantity, unit, estimated_portions, preparation_time, storage_information, temperature_celsius, ingredients, allergens, permitted_handling_deadline, pickup_location, latitude, longitude, pickup_start, pickup_end, safety_status, listing_status, is_emergency)
VALUES
  (
    'c1111111-1111-1111-1111-111111111111',
    'UNV-2026-CBE-001',
    '22222222-2222-2222-2222-222222222222',
    'a1111111-1111-1111-1111-111111111111',
    'Fresh Vegetable Biryani & Mixed Veg Kurma',
    'High quality Seeraga Samba vegetable biryani cooked for a banquet. Untouched, hygienically hot-packed in stainless catering containers.',
    'Cooked Meals',
    'Vegetarian',
    35.0,
    'kg',
    80,
    NOW() - INTERVAL '1 hour 30 minutes',
    'Maintained in insulated hot containers (>65°C)',
    68.5,
    'Seeraga samba rice, carrots, beans, peas, ghee, aromatic spices',
    ARRAY['Dairy']::TEXT[],
    NOW() + INTERVAL '3 hours 30 minutes',
    'Annapoorna Kitchen, RS Puram, Coimbatore',
    11.0123,
    76.9482,
    NOW(),
    NOW() + INTERVAL '2 hours',
    'eligible',
    'available',
    false
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    'UNV-2026-CBE-002',
    '33333333-3333-3333-3333-333333333333',
    'a2222222-2222-2222-2222-222222222222',
    'Traditional South Indian Sambar Rice & Poriyal',
    'Wedding reception surplus. Freshly prepared ponni boiled rice sambar with assorted root vegetables, accompanied by beans carrot poriyal.',
    'Cooked Meals',
    'Vegetarian',
    60.0,
    'kg',
    140,
    NOW() - INTERVAL '2 hours',
    'Stored in thermo-insulated catering drums',
    64.0,
    'Ponni rice, toor dal, drumstick, shallots, tamarind, mustard, curry leaves',
    ARRAY[]::TEXT[],
    NOW() + INTERVAL '2 hours 45 minutes',
    'Grand Palace Banquet Hall, Peelamedu, Coimbatore',
    11.0315,
    77.0189,
    NOW(),
    NOW() + INTERVAL '1 hour 45 minutes',
    'eligible',
    'approved',
    false
  ),
  (
    'c3333333-3333-3333-3333-333333333333',
    'UNV-2026-CBE-003',
    '22222222-2222-2222-2222-222222222222',
    'a1111111-1111-1111-1111-111111111111',
    'Assorted Fresh Whole Wheat Rotis & Paneer Butter Masala',
    'Corporate dinner surplus. Soft tawa phulkas with rich paneer gravy packed in food-grade foil containers.',
    'Cooked Meals',
    'Vegetarian',
    20.0,
    'kg',
    50,
    NOW() - INTERVAL '1 hour',
    'Room temperature insulated thermal bags',
    58.0,
    'Whole wheat flour, cottage cheese (paneer), tomatoes, butter, cashew paste',
    ARRAY['Dairy', 'Nuts', 'Gluten']::TEXT[],
    NOW() + INTERVAL '4 hours',
    'Annapoorna Kitchen, RS Puram, Coimbatore',
    11.0123,
    76.9482,
    NOW(),
    NOW() + INTERVAL '2 hours 30 minutes',
    'eligible',
    'available',
    false
  ),
  (
    'c4444444-4444-4444-4444-444444444444',
    'UNV-2026-CBE-004-EMG',
    '33333333-3333-3333-3333-333333333333',
    'a2222222-2222-2222-2222-222222222222',
    '[EMERGENCY SURPLUS] Mega Reception Feast - 250 Meals',
    'Large wedding event reception concluded early. Huge surplus of vegetarian feast meals including variety rices, sweets, and savouries.',
    'Cooked Meals',
    'Vegetarian',
    110.0,
    'kg',
    250,
    NOW() - INTERVAL '45 minutes',
    'Commercial grade temperature controlled hot holding unit',
    71.0,
    'Assorted South Indian wedding menu items',
    ARRAY['Dairy', 'Nuts']::TEXT[],
    NOW() + INTERVAL '4 hours 30 minutes',
    'Grand Palace Convention Hall, Avinashi Rd',
    11.0315,
    77.0189,
    NOW(),
    NOW() + INTERVAL '3 hours',
    'eligible',
    'available',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Food Batch Passports (QR code traceability)
INSERT INTO public.food_batch_passports (id, batch_id, food_listing_id, qr_code_payload, safety_status)
VALUES
  (
    'd1111111-1111-1111-1111-111111111111',
    'UNV-2026-CBE-001',
    'c1111111-1111-1111-1111-111111111111',
    '{"batch_id":"UNV-2026-CBE-001","donor":"Annapoorna Caterers","food":"Veg Biryani","portions":80,"temp":"68.5C","deadline":"2026-11-12T16:00:00Z"}'::jsonb,
    'eligible'
  ),
  (
    'd2222222-2222-2222-2222-222222222222',
    'UNV-2026-CBE-002',
    'c2222222-2222-2222-2222-222222222222',
    '{"batch_id":"UNV-2026-CBE-002","donor":"Grand Palace Banquet","food":"Sambar Rice","portions":140,"temp":"64.0C","deadline":"2026-11-12T15:15:00Z"}'::jsonb,
    'eligible'
  )
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Active Rescue Mission
INSERT INTO public.rescue_missions (id, batch_id, food_listing_id, donor_id, recipient_id, recipient_organization_id, volunteer_id, mission_status, pickup_otp, delivery_otp, pickup_address, pickup_lat, pickup_lng, delivery_address, delivery_lat, delivery_lng, distance_km, estimated_duration_mins)
VALUES
  (
    'e1111111-1111-1111-1111-111111111111',
    'UNV-2026-CBE-002',
    'c2222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444',
    'a3333333-3333-3333-3333-333333333333',
    '66666666-6666-6666-6666-666666666666',
    'volunteer_assigned',
    '582194',
    '914372',
    'Grand Palace Banquet Hall, Peelamedu, Coimbatore',
    11.0315,
    77.0189,
    'Anbalayam Children Shelter, Saibaba Colony, Coimbatore',
    11.0264,
    76.9421,
    7.8,
    22
  )
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Volunteer Task for Karthik
INSERT INTO public.volunteer_tasks (id, rescue_mission_id, volunteer_id, task_status, assigned_at)
VALUES
  (
    'f1111111-1111-1111-1111-111111111111',
    'e1111111-1111-1111-1111-111111111111',
    '66666666-6666-6666-6666-666666666666',
    'assigned',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- 8. Insert Community Hotspots in Tamil Nadu
INSERT INTO public.community_hotspots (id, name, location, city, latitude, longitude, category, severity, verified_by_admin, status)
VALUES
  ('h1111111-1111-1111-1111-111111111111', 'Gandhipuram Transit Shelter Point', 'Behind Town Bus Stand, Gandhipuram', 'Coimbatore', 11.0175, 76.9660, 'High Hunger Area', 'Critical', true, 'active'),
  ('h2222222-2222-2222-2222-222222222222', 'Ukkadam Fishermen Settlement', 'Ukkadam Lake Embankment Colony', 'Coimbatore', 10.9890, 76.9580, 'High Hunger Area', 'High', true, 'active'),
  ('h3333333-3333-3333-3333-333333333333', 'Salem Railway Station Labour Zone', 'Suramangalam, Junction Area', 'Salem', 11.6680, 78.1320, 'High Hunger Area', 'High', true, 'active'),
  ('h4444444-4444-4444-4444-444444444444', 'Erode Central Vegetable Market Surplus Hub', 'Netaji Road Market', 'Erode', 11.3440, 77.7210, 'Food Waste Hub', 'Medium', true, 'active'),
  ('h5555555-5555-5555-5555-555555555555', 'Tiruppur Garment Worker Quarters', 'Dharapuram Road, Tiruppur', 'Tiruppur', 11.1020, 77.3480, 'High Hunger Area', 'High', true, 'active')
ON CONFLICT (id) DO NOTHING;

-- 9. Insert Verified Community Fridges / Hubs
INSERT INTO public.community_hubs (id, name, address, city, latitude, longitude, operator_name, contact_phone, opening_hours, capacity_kg, current_availability_kg)
VALUES
  ('hb111111-1111-1111-1111-111111111111', 'Coimbatore Lions Community Fridge', 'Near VOC Park Gate 2, Park Gate Rd', 'Coimbatore', 11.0065, 76.9715, 'Lions Club of Coimbatore Central', '+91 94433 11220', '07:00 - 22:00', 40.0, 14.5),
  ('hb222222-2222-2222-2222-222222222222', 'RS Puram Rotary Kindness Hub', 'DB Road Roundabout', 'Coimbatore', 11.0135, 76.9495, 'Rotary Club of RS Puram', '+91 94433 22330', '08:00 - 21:00', 50.0, 22.0)
ON CONFLICT (id) DO NOTHING;

-- 10. Insert Historical Impact Report
INSERT INTO public.impact_reports (id, period, total_food_rescued_kg, total_meals_served, co2_saved_kg, water_saved_litres, active_donors_count, active_ngos_count, volunteers_count)
VALUES
  ('i1111111-1111-1111-1111-111111111111', 'All Time', 14280.50, 31730, 28560.00, 4284000.00, 38, 24, 85)
ON CONFLICT (id) DO NOTHING;
