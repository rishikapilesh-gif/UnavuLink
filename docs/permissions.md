# UNAVULINK ROLE-BASED PERMISSIONS MATRIX (RLS & UI)

## 1. Five Core Stakeholder Roles

| Capability | Admin | Donor | Acceptor | NGO | Common People | Approved Volunteer |
|---|---|---|---|---|---|---|
| View Public Food Map | Yes | Yes | Yes | Yes | Yes | Yes |
| Create Surplus Listing | Oversight | Yes (Verified) | No | Optional | No | No |
| Request Food Allocation | Oversight | No | Yes | Yes | No | No |
| Approve Donation Requests | Oversight | Own listings | No | No | No | No |
| Trigger Pickup Handover OTP | Oversight | Yes (Own) | No | No | No | Yes (Assigned) |
| Confirm Delivery Handover OTP | Oversight | No | Yes (Assigned) | Yes (Assigned) | No | Yes (Assigned) |
| Manage Receiving Capacity | Oversight | No | No | Yes | No | No |
| Manage Beneficiaries | Oversight | No | Limited | Yes | No | No |
| Log Distribution Records | Oversight | No | No | Yes | No | No |
| Report Community Waste Hotspot | Yes | Yes | Yes | Yes | Yes | Yes |
| Quarantine / Recall Batch | Yes (Full) | Report Own | Report Concern | Report Concern | Report Concern | Report Concern |
| Verify Organizations & Users | Yes | No | No | No | No | No |
| Run Digital Twin Simulations | Yes | No | No | No | No | No |
| View Immutable Audit Logs | Yes | No | No | No | No | No |

---

## 2. Security Invariants
1. **Zero Privileged Escalation**: Users cannot elevate their own role or verification status in profiles.
2. **Mandatory Safety Gate Before Allocation**: An unverified or expired batch cannot receive a delivery assignment.
3. **Dual OTP Binding**: Handover state transitions require exact match against the server-generated pickup/delivery OTPs.
4. **Tenant Isolation**: Beneficiary personal identities are shielded from public endpoints.
