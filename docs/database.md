# UNAVULINK DATABASE ARCHITECTURE & SCHEMA SPECIFICATION
**Target Engine:** Supabase PostgreSQL with PostGIS & Row-Level Security

## 1. Schema Overview
The UnavuLink database is organized into 31 interconnected relational tables governed by strict foreign keys, check constraints, non-negative quantity assertions, and append-only audit logging.

### Core Tables
1. `profiles`: System accounts linked with `auth.users`, storing `full_name`, `email`, `role`, `verification_status`, `latitude`, `longitude`, `is_volunteer`, and `volunteer_approved`.
2. `organizations`: Verified entities (hotels, banquet halls, orphanages, shelters, community kitchens) with capacity, address, and coordinates.
3. `food_listings`: The central registry of all surplus food batches with unique `batch_id` (e.g. `UNV-2026-CBE-001`), temperature readings, allergen arrays, and handling deadlines.
4. `food_safety_checks`: Automated and officer review checklists with flagged safety concerns.
5. `donation_requests`: Shelter requests for available batches.
6. `rescue_missions`: Coordinated transport missions linking donor, recipient, and volunteer.
7. `volunteer_tasks`: Volunteer assignments with collection and delivery timestamps.
8. `beneficiaries`: Anonymized group records (internal reference, head count, dietary preferences).
9. `waste_reports`: Crowdsourced citizen food waste hotspot reports.
10. `financial_donations`: Community contributions for volunteer fuel funds.

### Operational & Safety Tables
11. `food_allocations`: FairShare multi-attribute priority records.
12. `food_batch_passports`: Immutable QR code payload data and digital custody records.
13. `pickup_records`: Physical handover records with Pickup OTP.
14. `delivery_records`: Shelter receipt records with Delivery OTP and discrepancy tracking.
15. `rescue_incidents`: Official safety incidents triggering immediate batch freeze / quarantine.
16. `temperature_logs`: Cold-chain and hot holding monitoring.
17. `ngo_requirements`: Daily intake quotas, dietary restrictions, and refrigeration capabilities.
18. `community_hotspots`: High-hunger and high-waste zones in Tamil Nadu.
19. `community_hubs`: Verified community fridges and public dispensers.
20. `volunteer_profiles`: Carrying capacity, vehicle type, and service radius.
21. `rescue_credits`: Gamified ESG impact points for donors, NGOs, and volunteers.
22. `impact_reports`: Aggregated kilograms rescued, meals fed, and emissions saved.
23. `predictive_surplus_records`: Machine-assisted forecasting of banquet surpluses.
24. `digital_twin_scenarios`: Pre-computed resilience scenario runs.
25. `recovery_tasks`: Self-healing rescue failure reallocations.
26. `audit_logs`: Append-only tamper-evident record of all privileged actions.
27. `distribution_records`: Final meal service records verifying end beneficiary consumption.
28. `otp_verifications`: Cryptographic verification attempts.
