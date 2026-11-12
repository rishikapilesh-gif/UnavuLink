# UNAVULINK ARCHITECTURE & SYSTEM DESIGN
**AI-Powered Food Rescue, Redistribution & Community Intelligence Platform**

## 1. System Overview
UnavuLink is built as a reactive, multi-role web application delivering full-lifecycle food rescue across Tamil Nadu districts (Coimbatore, Salem, Erode, Tiruppur, Chennai, Madurai, Tiruchirappalli).

The architecture unites five core stakeholder roles:
1. **Admin**: System-wide oversight, account verifications, food safety incidents, recalls, emergency surplus coordination, and digital twin simulation.
2. **Donor**: Hotels, caterers, wedding halls, and restaurants posting surplus food, receiving Gemini Vision draft suggestions, inspecting safety parameters, approving requests, and monitoring pickups.
3. **Acceptor**: Receiving organizations requesting food allocations, tracking arrivals, and confirming receipts.
4. **NGO**: Shelters, orphanages, and community kitchens coordinating bulk missions, maintaining beneficiary dietary requirements, and logging verified meal distributions.
5. **Common People**: Public discovery of community fridges and food hotspots, reporting food waste, and verified volunteer rescue task operations.

---

## 2. Six Signature Modular Engines

### A. Safety Eligibility Gate (`services/safetyGate.ts`)
- Evaluates preparation timestamps, storage conditions (hot box >60°C, cold storage <4°C), handling window deadlines, and declared allergens.
- Outputs `eligible`, `under_review`, `frozen`, `recalled`, or `expired`.

### B. FairShare & Priority Matching Engine (`services/fairshare.ts`)
- Multi-objective scoring algorithm:
  $$S = 0.30D + 0.25T + 0.20C + 0.15R + 0.10V$$
  - $D$ = Dietary compatibility
  - $T$ = Time feasibility (remaining handling window vs transit time)
  - $C$ = Receiving capacity ratio
  - $R$ = Storage readiness
  - $V$ = Volunteer availability
- Prevents over-allocating only to the closest shelter.

### C. Rescue Failure Recovery Engine (`services/recoveryEngine.ts`)
- Autonomous resilience module for in-transit failures:
  - Volunteer cancellation: Re-routes mission to the nearest available approved volunteer.
  - NGO sudden overflow / rejection: Re-evaluates FairShare and reroutes batch to secondary eligible shelter or community fridge hub.
  - Delivery delay: Computes traffic delay and warns coordinators before temperature abuse thresholds are breached.

### D. Food Rescue Digital Twin (`services/digitalTwin.ts`)
- Interactive simulation environment allowing administrators to model volunteer vehicle breakdowns, capacity overflow, and highway corridor congestion.

### E. AI Vision Assistance Boundary (`services/gemini.ts`)
- Integrated with Google Gemini API to analyze food photographs, estimate portion counts, detect visible ingredients, and flag potential allergens.

### F. Dual-OTP Verification Handover (`components/common/OtpModal.tsx`)
- Cryptographic OTP verification at both collection (Pickup OTP) and delivery (Delivery OTP) to ensure physical accountability before updating the immutable impact ledger.
