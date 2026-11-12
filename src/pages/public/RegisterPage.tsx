import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { 
  UserRole, 
  DonorBusinessType,
  DonorBusinessProfile,
  AcceptorProfile,
  NGOProfile,
  RescueMateProfile
} from '../../types';
import { 
  ShieldCheck, 
  UserPlus, 
  Building2, 
  HeartHandshake, 
  UtensilsCrossed, 
  Truck, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  Lock, 
  Sparkles,
  Info,
  MapPin,
  Clock,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

type RegistrationCategory = 'Donor' | 'NGO' | 'Acceptor' | 'RescueMate' | 'Common People';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Selected Registration Flow
  const [selectedCategory, setSelectedCategory] = useState<RegistrationCategory>('Donor');

  // Shared Account Credentials
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'ta'>('en');
  const [city, setCity] = useState('Coimbatore');
  const [district, setDistrict] = useState('Coimbatore');

  // DONOR Specific Fields
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<DonorBusinessType>('Restaurant');
  const [businessAddress, setBusinessAddress] = useState('');
  const [fssaiNumber, setFssaiNumber] = useState('');
  const [postalCode, setPostalCode] = useState('641002');
  const [operatingHours, setOperatingHours] = useState('07:00 - 22:30');
  const [facilityType, setFacilityType] = useState('Commercial Hot Kitchen');

  // ACCEPTOR Specific Fields
  const [acceptorEntityType, setAcceptorEntityType] = useState<'Individual' | 'Community group' | 'Other'>('Individual');
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(['Vegetarian']);
  const [approxPortions, setApproxPortions] = useState<number>(20);
  const [peopleServed, setPeopleServed] = useState<number>(25);
  const [receivingMethod, setReceivingMethod] = useState<'Self-Pickup' | 'Shelter Delivery' | 'Community Fridge'>('Self-Pickup');
  const [addressNeighborhood, setAddressNeighborhood] = useState('');
  const [protectAddress, setProtectAddress] = useState(true);

  // NGO Specific Fields
  const [ngoName, setNgoName] = useState('');
  const [ngoRegType, setNgoRegType] = useState<'Trust' | 'Society' | 'Section 8' | 'Charity'>('Trust');
  const [ngoRegNumber, setNgoRegNumber] = useState('');
  const [ngoDescription, setNgoDescription] = useState('');
  const [yearEstablished, setYearEstablished] = useState<number>(2015);
  const [designation, setDesignation] = useState('Shelter Trustee / Director');
  const [dailyReceivingKg, setDailyReceivingKg] = useState<number>(80);
  const [refrigerationAvailable, setRefrigerationAvailable] = useState(true);
  const [beneficiaryCapacity, setBeneficiaryCapacity] = useState<number>(90);

  // RESCUEMATE Specific Fields
  const [transportType, setTransportType] = useState<'Walking' | 'Bicycle' | 'Two-wheeler' | 'Car' | 'Other'>('Two-wheeler');
  const [carryingCapacityKg, setCarryingCapacityKg] = useState<number>(20);
  const [preferredTravelKm, setPreferredTravelKm] = useState<number>(10);
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [safetyAgreement, setSafetyAgreement] = useState(true);

  // Verification & Submission status
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');

    if (!email || !email.includes('@')) {
      setSubmissionError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 8) {
      setSubmissionError('Password must be at least 8 characters long.');
      return;
    }

    setSubmitting(true);

    // Map Category to base UserRole
    const baseRole: UserRole = 
      selectedCategory === 'Donor' ? 'Donor' :
      selectedCategory === 'NGO' ? 'NGO' :
      selectedCategory === 'Acceptor' ? 'Acceptor' : 'Common People';

    const isVolunteerCandidate = selectedCategory === 'RescueMate';

    // 1. Create Base User Profile through genuine auth register
    const regResult = await register({
      full_name: fullName,
      email: email,
      phone: mobile,
      role: baseRole,
      city: city,
      state: 'Tamil Nadu',
      is_volunteer: isVolunteerCandidate,
      volunteer_approved: false // Requires Admin verification!
    }, password);

    if (!regResult.success) {
      setSubmissionError(regResult.message);
      setSubmitting(false);
      return;
    }

    const userId = regResult.userId || `usr-${Date.now()}`;

    // 2. Persist Role-Specific Profile into Store
    if (selectedCategory === 'Donor') {
      const donorProfile: DonorBusinessProfile = {
        id: `donor-${Date.now()}`,
        user_id: userId,
        business_name: businessName || `${fullName}'s Kitchen`,
        business_type: businessType,
        fssai_licence_number: fssaiNumber || 'FSSAI-PENDING-VERIF',
        address: businessAddress || `${city}, Tamil Nadu`,
        district,
        city,
        postal_code: postalCode,
        latitude: 11.0123,
        longitude: 76.9482,
        operating_hours: operatingHours,
        food_prep_facility_type: facilityType,
        authorized_contact_name: fullName,
        authorized_contact_phone: mobile,
        authorized_contact_email: email,
        verification_status: 'pending',
        rescue_credits: 50,
        total_donations: 0,
        total_kg_donated: 0,
        created_at: new Date().toISOString()
      };
      store.addDonorProfile(donorProfile);
    } else if (selectedCategory === 'Acceptor') {
      const acceptorProfile: AcceptorProfile = {
        id: `acceptor-${Date.now()}`,
        user_id: userId,
        full_name: fullName,
        entity_type: acceptorEntityType,
        dietary_preferences: dietaryPreferences,
        allergen_restrictions: [],
        approx_portions_needed: Number(approxPortions),
        people_served_count: Number(peopleServed),
        preferred_receiving_method: receivingMethod,
        address_privacy_enabled: protectAddress,
        address_neighborhood: addressNeighborhood || `${city} Area`,
        district,
        city,
        postal_code: postalCode,
        preferred_collection_times: ['12:00 - 14:00', '19:00 - 21:00'],
        created_at: new Date().toISOString()
      };
      store.addAcceptorProfile(acceptorProfile);
    } else if (selectedCategory === 'NGO') {
      const ngoProfile: NGOProfile = {
        id: `ngo-${Date.now()}`,
        user_id: userId,
        organisation_name: ngoName || `${fullName} Trust`,
        registration_type: ngoRegType,
        registration_number: ngoRegNumber || 'TN/REG/PENDING',
        organisation_description: ngoDescription || 'Community welfare organisation.',
        year_established: Number(yearEstablished),
        contact_person: fullName,
        official_email: email,
        mobile_number: mobile,
        designation: designation,
        verification_status: 'pending',
        primary_location: `${city}, Tamil Nadu`,
        service_areas: [city, 'Surrounding Panchayats'],
        operating_hours: '08:00 - 21:00',
        daily_receiving_capacity_kg: Number(dailyReceivingKg),
        storage_capacity_kg: Number(dailyReceivingKg * 2),
        refrigeration_available: refrigerationAvailable,
        accepted_food_categories: ['Cooked Meals', 'Bakery', 'Raw Produce'],
        beneficiary_service_capacity: Number(beneficiaryCapacity),
        distribution_facilities: ['Main Hall', 'Distribution Gate'],
        created_at: new Date().toISOString()
      };
      store.addNGOProfile(ngoProfile);
    } else if (selectedCategory === 'RescueMate') {
      const rescueMateProfile: RescueMateProfile = {
        id: `rescuemate-${Date.now()}`,
        user_id: userId,
        full_name: fullName,
        mobile_number: mobile,
        email: email,
        preferred_language: preferredLanguage,
        service_areas: [city],
        city,
        district,
        latitude: 11.0168,
        longitude: 76.9558,
        available_days: ['Saturday', 'Sunday'],
        available_time_slots: ['Evening (18:00 - 22:00)'],
        transport_type: transportType,
        carrying_capacity_kg: Number(carryingCapacityKg),
        preferred_travel_distance_km: Number(preferredTravelKm),
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
        safety_agreement_accepted: safetyAgreement,
        approval_status: 'pending', // Pending Admin review!
        rescue_credits: 0,
        total_rescues: 0,
        created_at: new Date().toISOString()
      };
      store.addRescueMateApplication(rescueMateProfile);
    }

    setSubmitting(false);
    setSentToEmail(email);
    setVerificationSent(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  if (verificationSent) {
    return (
      <div className="max-w-md mx-auto my-14 px-4 text-center">
        <div className="bg-white rounded-card shadow-lift border border-sage p-8 space-y-5">
          <div className="w-14 h-14 bg-forest/10 text-forest rounded-2xl mx-auto flex items-center justify-center border border-forest/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal">Verification Email Sent</h1>
          <p className="text-xs text-muted leading-relaxed">
            We have sent a secure verification link to <strong className="text-charcoal">{sentToEmail}</strong>.
            Please verify your email address to complete registration and sign in.
          </p>
          <div className="p-3 bg-cream rounded-subtle border border-sage text-[11px] text-muted text-left space-y-1">
            <p className="font-bold text-charcoal">Next Steps:</p>
            <p>1. Open your email inbox and click "Verify Email Address".</p>
            <p>2. Once verified, return to login using your selected role.</p>
          </div>
          <Link
            to="/login"
            className="w-full py-3 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 px-4 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-extrabold text-forest uppercase tracking-wider bg-forest/10 px-3 py-1 rounded-full">
          Tailored Onboarding
        </span>
        <h1 className="text-3xl font-extrabold text-charcoal">
          Join UnavuLink Food Rescue Network
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto">
          Every participant plays a distinct operational role. Choose your organization or individual profile to access specialized workflows and safety gates.
        </p>
      </div>

      {/* STEP 1: ROLE SELECTOR CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => setSelectedCategory('Donor')}
          className={`p-3.5 rounded-card border text-left transition-all space-y-1.5 ${
            selectedCategory === 'Donor'
              ? 'bg-forest text-white border-forest shadow-md ring-2 ring-forest/30'
              : 'bg-white text-charcoal border-sage hover:border-forest/50'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5 text-orange-warm" />
          <h3 className="font-bold text-xs sm:text-sm leading-tight">Food Donor</h3>
          <p className={`text-[10px] leading-snug ${selectedCategory === 'Donor' ? 'text-cream' : 'text-muted'}`}>
            Restaurant, Caterer, Wedding Hall
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('NGO')}
          className={`p-3.5 rounded-card border text-left transition-all space-y-1.5 ${
            selectedCategory === 'NGO'
              ? 'bg-forest text-white border-forest shadow-md ring-2 ring-forest/30'
              : 'bg-white text-charcoal border-sage hover:border-forest/50'
          }`}
        >
          <Building2 className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-xs sm:text-sm leading-tight">NGO / Shelter</h3>
          <p className={`text-[10px] leading-snug ${selectedCategory === 'NGO' ? 'text-cream' : 'text-muted'}`}>
            Care Home, Trust, Community Kitchen
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('Acceptor')}
          className={`p-3.5 rounded-card border text-left transition-all space-y-1.5 ${
            selectedCategory === 'Acceptor'
              ? 'bg-forest text-white border-forest shadow-md ring-2 ring-forest/30'
              : 'bg-white text-charcoal border-sage hover:border-forest/50'
          }`}
        >
          <HeartHandshake className="w-5 h-5 text-cherry" />
          <h3 className="font-bold text-xs sm:text-sm leading-tight">Food Acceptor</h3>
          <p className={`text-[10px] leading-snug ${selectedCategory === 'Acceptor' ? 'text-cream' : 'text-muted'}`}>
            Individual or Resident Community Group
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('RescueMate')}
          className={`p-3.5 rounded-card border text-left transition-all space-y-1.5 ${
            selectedCategory === 'RescueMate'
              ? 'bg-forest text-white border-forest shadow-md ring-2 ring-forest/30'
              : 'bg-white text-charcoal border-sage hover:border-forest/50'
          }`}
        >
          <Truck className="w-5 h-5 text-orange-warm animate-bounce" />
          <h3 className="font-bold text-xs sm:text-sm leading-tight">RescueMate</h3>
          <p className={`text-[10px] leading-snug ${selectedCategory === 'RescueMate' ? 'text-cream' : 'text-muted'}`}>
            Volunteer Food Responder
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('Common People')}
          className={`p-3.5 rounded-card border text-left transition-all space-y-1.5 col-span-2 sm:col-span-1 ${
            selectedCategory === 'Common People'
              ? 'bg-forest text-white border-forest shadow-md ring-2 ring-forest/30'
              : 'bg-white text-charcoal border-sage hover:border-forest/50'
          }`}
        >
          <Users className="w-5 h-5 text-forest" />
          <h3 className="font-bold text-xs sm:text-sm leading-tight">Citizen</h3>
          <p className={`text-[10px] leading-snug ${selectedCategory === 'Common People' ? 'text-cream' : 'text-muted'}`}>
            Public Discovery & Wastage Reporting
          </p>
        </button>
      </div>

      {/* STEP 2: TAILORED FORM CONTAINER */}
      <div className="bg-white rounded-card shadow-lift border border-sage p-6 sm:p-8 space-y-6">
        <div className="border-b border-sage/60 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-charcoal">
              {selectedCategory === 'Donor' && 'Donor Kitchen Registration & Business Profile'}
              {selectedCategory === 'NGO' && 'NGO Organisation Onboarding & Capacity Registration'}
              {selectedCategory === 'Acceptor' && 'Acceptor Needs & Dietary Profile (Privacy Protected)'}
              {selectedCategory === 'RescueMate' && 'Become a RescueMate — Volunteer Food Responder'}
              {selectedCategory === 'Common People' && 'Citizen Account Registration'}
            </h2>
            <p className="text-xs text-muted">
              {selectedCategory === 'RescueMate'
                ? 'Help good food reach the right people. Applications are reviewed and approved by Platform Admins.'
                : 'All accounts are authenticated securely with Supabase Auth.'}
            </p>
          </div>

          <span className="text-[10px] font-bold text-forest bg-forest/10 px-2.5 py-1 rounded-full uppercase shrink-0">
            {selectedCategory}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* SECTION A: SHARED ACCOUNT INFORMATION */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-charcoal uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-forest" />
              <span>1. Account Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-charcoal mb-1">Full Name / Authorized Contact *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Senthil Kumar"
                  className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 98422 12345"
                  className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="senthil@business.com"
                  className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Account Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Primary District / City *</label>
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setDistrict(e.target.value);
                  }}
                  className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs font-semibold"
                >
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Salem">Salem</option>
                  <option value="Erode">Erode</option>
                  <option value="Tiruppur">Tiruppur</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Madurai">Madurai</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Preferred Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as 'en' | 'ta')}
                  className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs font-semibold"
                >
                  <option value="en">English</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION B: DONOR ROLE-SPECIFIC FIELDS */}
          {selectedCategory === 'Donor' && (
            <div className="space-y-3 pt-3 border-t border-sage/60">
              <h4 className="font-extrabold text-charcoal uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-orange-warm" />
                <span>2. Business & FSSAI Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Commercial Business Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Annapoorna Grand Kitchen"
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Business Classification *</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as DonorBusinessType)}
                    className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs font-semibold"
                  >
                    <option value="Restaurant">Restaurant</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Wedding hall">Wedding Hall</option>
                    <option value="Catering service">Catering Service</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Food manufacturer">Food Manufacturer</option>
                    <option value="Event organiser">Event Organiser</option>
                    <option value="Supermarket">Supermarket</option>
                    <option value="Other">Other Food Business</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">FSSAI Registration / Licence Number</label>
                  <input
                    type="text"
                    value={fssaiNumber}
                    onChange={(e) => setFssaiNumber(e.target.value)}
                    placeholder="e.g. 12422003001892"
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs font-mono"
                  />
                  <span className="text-[10px] text-muted block mt-0.5">Verified by Food Safety Officer before badge issuance</span>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Food Preparation Facility Type</label>
                  <input
                    type="text"
                    value={facilityType}
                    onChange={(e) => setFacilityType(e.target.value)}
                    placeholder="e.g. Commercial Steam Kettles & Hot Hold"
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-charcoal mb-1">Kitchen Pickup Address *</label>
                  <input
                    type="text"
                    required
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="e.g. 42 D.B. Road, RS Puram, Coimbatore"
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION C: ACCEPTOR ROLE-SPECIFIC FIELDS */}
          {selectedCategory === 'Acceptor' && (
            <div className="space-y-3 pt-3 border-t border-sage/60">
              <h4 className="font-extrabold text-charcoal uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-cherry" />
                <span>2. Food Requirements & Privacy Settings</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Recipient Entity Type</label>
                  <select
                    value={acceptorEntityType}
                    onChange={(e) => setAcceptorEntityType(e.target.value as any)}
                    className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs font-semibold"
                  >
                    <option value="Individual">Individual / Family</option>
                    <option value="Community group">Community Group</option>
                    <option value="Other">Local Resident Committee</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Approx. Portions Needed</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={approxPortions}
                    onChange={(e) => setApproxPortions(Number(e.target.value))}
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Preferred Receiving Method</label>
                  <select
                    value={receivingMethod}
                    onChange={(e) => setReceivingMethod(e.target.value as any)}
                    className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs font-semibold"
                  >
                    <option value="Self-Pickup">Self-Pickup at Kitchen</option>
                    <option value="Shelter Delivery">Delivered by RescueMate</option>
                    <option value="Community Fridge">Collect from Community Fridge Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Neighborhood / Area (Public)</label>
                  <input
                    type="text"
                    value={addressNeighborhood}
                    onChange={(e) => setAddressNeighborhood(e.target.value)}
                    placeholder="e.g. Ukkadam South Area"
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                  />
                </div>

                <div className="sm:col-span-2 p-3 bg-cream rounded-subtle border border-sage flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="protectAddress"
                    checked={protectAddress}
                    onChange={(e) => setProtectAddress(e.target.checked)}
                    className="mt-0.5 rounded text-forest"
                  />
                  <label htmlFor="protectAddress" className="text-xs text-charcoal">
                    <strong>Enable Privacy Masking:</strong> Do not publicly expose my exact residential address on public maps. Only disclose neighborhood until allocation is confirmed.
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION D: NGO ROLE-SPECIFIC FIELDS */}
          {selectedCategory === 'NGO' && (
            <div className="space-y-3 pt-3 border-t border-sage/60">
              <h4 className="font-extrabold text-charcoal uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span>2. NGO Registration & Operational Capacity</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Official Organisation Name *</label>
                  <input
                    type="text"
                    required
                    value={ngoName}
                    onChange={(e) => setNgoName(e.target.value)}
                    placeholder="e.g. Anbalayam Shelter for Homeless"
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Registration Type *</label>
                  <select
                    value={ngoRegType}
                    onChange={(e) => setNgoRegType(e.target.value as any)}
                    className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs font-semibold"
                  >
                    <option value="Trust">Registered Trust</option>
                    <option value="Society">Registered Society</option>
                    <option value="Section 8">Section 8 Non-Profit Co.</option>
                    <option value="Charity">Charitable Institution</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Registration Number *</label>
                  <input
                    type="text"
                    required
                    value={ngoRegNumber}
                    onChange={(e) => setNgoRegNumber(e.target.value)}
                    placeholder="e.g. TN/CBE/TRUST/2014/481"
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Designation of Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Managing Trustee / Secretary"
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Daily Receiving Capacity (kg) *</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={dailyReceivingKg}
                    onChange={(e) => setDailyReceivingKg(Number(e.target.value))}
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Beneficiary Service Headcount</label>
                  <input
                    type="number"
                    min="5"
                    max="2000"
                    value={beneficiaryCapacity}
                    onChange={(e) => setBeneficiaryCapacity(Number(e.target.value))}
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                  />
                </div>

                <div className="sm:col-span-2 p-3 bg-cream rounded-subtle border border-sage flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="refrigeration"
                    checked={refrigerationAvailable}
                    onChange={(e) => setRefrigerationAvailable(e.target.checked)}
                    className="rounded text-forest"
                  />
                  <label htmlFor="refrigeration" className="text-xs text-charcoal">
                    <strong>Refrigeration Storage Available:</strong> We possess cold storage or commercial deep freezers to safely preserve perishable dairy or cooked surplus at &lt;4°C.
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION E: RESCUEMATE ROLE-SPECIFIC APPLICATION */}
          {selectedCategory === 'RescueMate' && (
            <div className="space-y-3 pt-3 border-t border-sage/60">
              <h4 className="font-extrabold text-charcoal uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-orange-warm" />
                <span>2. Service, Logistics & Transport Capabilities</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Mode of Transport *</label>
                  <select
                    value={transportType}
                    onChange={(e) => setTransportType(e.target.value as any)}
                    className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs font-semibold"
                  >
                    <option value="Two-wheeler">Two-Wheeler (Motorbike / Scooter)</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Car">Car / Van</option>
                    <option value="Walking">Walking (Ultra-local &lt;1 km)</option>
                    <option value="Other">Other Logistics Vehicle</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Carrying Capacity (kg) *</label>
                  <input
                    type="number"
                    min="5"
                    max="200"
                    value={carryingCapacityKg}
                    onChange={(e) => setCarryingCapacityKg(Number(e.target.value))}
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Max Travel Distance (km)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={preferredTravelKm}
                    onChange={(e) => setPreferredTravelKm(Number(e.target.value))}
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    placeholder="+91 98422 99999"
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
                  />
                </div>

                <div className="sm:col-span-2 p-3 bg-cream rounded-subtle border border-sage flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="safetyAgreement"
                    required
                    checked={safetyAgreement}
                    onChange={(e) => setSafetyAgreement(e.target.checked)}
                    className="mt-0.5 rounded text-forest"
                  />
                  <label htmlFor="safetyAgreement" className="text-xs text-charcoal">
                    <strong>RescueMate Safety Pledge:</strong> I agree to handle all surplus food with clean insulated containers, verify pickup temperatures, deliver promptly within the safety window, and execute dual-OTP handovers.
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON & ERROR MESSAGE */}
          <div className="pt-4 border-t border-sage/60 space-y-3">
            {submissionError && (
              <div className="p-3 bg-cherry/10 border border-cherry/30 text-cherry rounded-subtle text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[11px] text-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-forest font-bold hover:underline">
                  Sign In
                </Link>
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Registering Account & Sending Email...</span>
                ) : (
                  <>
                    <span>
                      {selectedCategory === 'RescueMate' ? 'Submit RescueMate Application' : 'Complete Registration'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
