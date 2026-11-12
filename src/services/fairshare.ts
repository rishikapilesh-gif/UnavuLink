import { FoodListing, Organization, VolunteerProfile } from '../types';
import { evaluateSafetyGate } from './safetyGate';

export interface FairShareMatch {
  organization: Organization;
  score: number; // 0 to 100
  breakdown: {
    dietaryCompatibility: number; // 0 to 30
    timeFeasibility: number;       // 0 to 25
    receivingCapacity: number;     // 0 to 20
    storageReadiness: number;      // 0 to 15
    volunteerAvailability: number; // 0 to 10
  };
  distanceKm: number;
  estimatedTransitMins: number;
  explanation: string;
}

// Calculate Haversine distance in km
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export function rankRecipientsForListing(
  listing: FoodListing,
  recipients: Organization[],
  volunteers: VolunteerProfile[]
): FairShareMatch[] {
  // First, Safety Gate is mandatory
  const safety = evaluateSafetyGate(listing);
  if (!safety.isEligible) {
    return [];
  }

  const matches: FairShareMatch[] = recipients
    .filter(org => org.organisation_type.includes('NGO') || org.organisation_type.includes('Shelter') || org.organisation_type.includes('Community'))
    .map(org => {
      const dist = calculateDistanceKm(listing.latitude, listing.longitude, org.latitude, org.longitude);
      const transitMins = Math.round(dist * 3 + 10); // estimate based on city traffic

      // 1. Dietary Compatibility (Weight: 30%)
      let dietaryScore = 30;
      if (listing.dietary_category === 'Non-Vegetarian' && !org.storage_capabilities.includes('non_veg')) {
        dietaryScore = 10;
      }

      // 2. Time Feasibility (Weight: 25%)
      // Remaining window in minutes vs transit time
      const windowMinutes = Math.max(0, safety.hoursRemaining * 60);
      let timeScore = 25;
      if (windowMinutes < transitMins) {
        timeScore = 0; // cannot reach before expiry
      } else if (windowMinutes < transitMins * 2) {
        timeScore = 15;
      }

      // 3. Receiving Capacity (Weight: 20%)
      // If org capacity is sufficient for batch
      const capacityRatio = Math.min(1, org.receiving_capacity_kg / listing.quantity);
      const capacityScore = Math.round(capacityRatio * 20);

      // 4. Storage Readiness (Weight: 15%)
      let storageScore = 10;
      if (listing.storage_information.toLowerCase().includes('cold') && org.storage_capabilities.includes('refrigeration')) {
        storageScore = 15;
      } else if (listing.storage_information.toLowerCase().includes('hot') && org.storage_capabilities.includes('hot_storage')) {
        storageScore = 15;
      }

      // 5. Volunteer Availability (Weight: 10%)
      const nearbyVolunteers = volunteers.filter(v => v.availability_status === 'available');
      const volunteerScore = nearbyVolunteers.length > 0 ? 10 : 3;

      const totalScore = dietaryScore + timeScore + capacityScore + storageScore + volunteerScore;

      let explanation = `Match Score: ${totalScore}/100. `;
      if (dist < 5) {
        explanation += `High proximity (${dist} km away). `;
      }
      if (capacityRatio >= 1) {
        explanation += `Full capacity available (${org.receiving_capacity_kg} kg max). `;
      }

      return {
        organization: org,
        score: totalScore,
        breakdown: {
          dietaryCompatibility: dietaryScore,
          timeFeasibility: timeScore,
          receivingCapacity: capacityScore,
          storageReadiness: storageScore,
          volunteerAvailability: volunteerScore
        },
        distanceKm: dist,
        estimatedTransitMins: transitMins,
        explanation
      };
    })
    .filter(m => m.breakdown.timeFeasibility > 0) // reject impossible transit
    .sort((a, b) => b.score - a.score);

  return matches;
}
