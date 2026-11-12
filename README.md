# UNAVULINK
### Predicting Surplus. Prioritising Need. Delivering Food Safely.
**Every Meal Deserves a Destination. Every Rescue Makes a Difference.**

UnavuLink is an AI-powered food rescue, redistribution, and community intelligence platform engineered for Tamil Nadu communities (Coimbatore, Salem, Erode, Tiruppur, Chennai, Madurai, Tiruchirappalli).

---

## 🌟 12 Signature Platform Features

1. **Quick Food Rescue Posting**: Rapid donation intake with Gemini Vision draft assistance and mandatory donor safety confirmation.
2. **QR Food Safety Passport**: Unique digital passport for every food batch encoding custody chain, storage temperatures, allergens, and preparation timestamps.
3. **AI Matching & FairShare Priority Engine**: Transparent scoring algorithm ($S = 0.30D + 0.25T + 0.20C + 0.15R + 0.10V$) prioritizing community need and capacity over mere proximity.
4. **Live Expiry & Urgency Timer**: Countdown of permitted food safety handling windows with automatic expiration lock.
5. **Volunteer Assignment & Route Tracking**: Real-time dispatching with vehicle capacity matching, ETA calculation, and Leaflet routing.
6. **Rescue Failure Recovery Engine**: Autonomous self-healing module that immediately reroutes batches upon volunteer dropouts or shelter capacity overflows.
7. **Food Safety Incident & Recall Management**: Instant quarantine and batch freezing across all portals upon reported spoilage or temperature hazards.
8. **Cold-Chain & Handling Monitoring**: Temperature tracking with danger zone warnings (>60°C hot, <4°C cold).
9. **Food Rescue Digital Twin**: Interactive administrator simulator to stress-test logistics against breakdowns and highway gridlocks.
10. **AI Food Waste Intelligence**: Historical surplus analytics and banquet waste prevention recommendations.
11. **Trust Score & Transparent Audit Trail**: Immutable logging of verified handovers, volunteer rescues, and administrative actions.
12. **Live Impact & Community Rescue Dashboard**: Recharts visualisations tracking kilograms rescued, meals served, and LCA environmental offsets.

---

## 👥 Five Primary User Roles

- **Admin**: Command Centre, user verification, incident recalls, emergency mode, digital twin, audit logs.
- **Donor**: Restaurants, banquet halls, and caterers posting surplus and managing requests.
- **Acceptor**: Receiving organizations requesting portions and verifying deliveries.
- **NGO**: Shelters and community kitchens managing intake capacity, beneficiary requirements, and distribution ledgers.
- **Common People**: Community fridge discovery, food waste hotspot alerts, and approved volunteer rescue dispatches.

---

## 🗺️ Real-World Tamil Nadu Map (Leaflet + OpenStreetMap)
Interactive map covering Tamil Nadu districts with color-coded custom markers:
- 🟢 **Green**: Verified Donors
- 📦 **Orange**: Available Food Batches
- 🤝 **Blue**: Verified NGO Shelters
- ❄️ **Purple**: Community Fridges & Hubs
- 🚨 **Red**: Emergency Surplus & Safety Hazards
- ⚠️ **Yellow**: Crowdsourced Need Hotspots

---

## 🚀 Getting Started

```bash
# Clone or navigate to directory
cd unavulink

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` to explore. Use the top bar to switch between the 5 roles instantly with pre-loaded realistic Tamil Nadu demonstration data!

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Mapping**: Leaflet, OpenStreetMap
- **Charts**: Recharts
- **Database & Auth**: Supabase PostgreSQL, Row-Level Security (RLS)
- **AI Vision**: Google Gemini API integration boundary
- **QR & Verification**: qrcode, canvas-confetti, Dual-OTP Handover
