import { FoodListing, FoodSafetyStatus } from '../types';

export interface SafetyCheckResult {
  isEligible: boolean;
  status: FoodSafetyStatus;
  flags: string[];
  hoursRemaining: number;
  recommendations: string[];
}

export function evaluateSafetyGate(listing: Partial<FoodListing>): SafetyCheckResult {
  const flags: string[] = [];
  const recommendations: string[] = [];

  // 1. Check required fields
  if (!listing.food_name || !listing.quantity || !listing.pickup_location) {
    flags.push('Missing critical listing information (food name, quantity or pickup location).');
  }

  // 2. Check preparation time
  if (!listing.preparation_time) {
    flags.push('Missing verified preparation timestamp.');
  }

  // 3. Check permitted handling deadline
  const now = new Date().getTime();
  const deadline = listing.permitted_handling_deadline 
    ? new Date(listing.permitted_handling_deadline).getTime() 
    : 0;
  
  const diffMs = deadline - now;
  const hoursRemaining = Math.max(0, Number((diffMs / (1000 * 60 * 60)).toFixed(1)));

  if (deadline > 0 && diffMs <= 0) {
    flags.push('Permitted food safety window has expired. Batch cannot be allocated.');
    return {
      isEligible: false,
      status: 'expired',
      flags,
      hoursRemaining: 0,
      recommendations: ['Dispose safely according to organic waste protocols. Do not distribute.']
    };
  }

  if (hoursRemaining > 0 && hoursRemaining < 1.0) {
    flags.push('Critical urgency: Less than 1 hour remaining in safety window.');
    recommendations.push('Immediate dispatch to ultra-local recipient within 3km required.');
  }

  // 4. Check temperature safety thresholds if provided
  if (listing.temperature_celsius !== undefined && listing.temperature_celsius !== null) {
    const temp = listing.temperature_celsius;
    if (listing.storage_information?.toLowerCase().includes('hot')) {
      if (temp < 60) {
        flags.push(`Temperature Warning: Hot holding recorded at ${temp}°C (below 60°C safety standard).`);
        recommendations.push('Reheat to 74°C or distribute within 90 minutes.');
      }
    } else if (listing.storage_information?.toLowerCase().includes('refrigerat') || listing.storage_information?.toLowerCase().includes('cold')) {
      if (temp > 8) {
        flags.push(`Temperature Warning: Cold storage recorded at ${temp}°C (above 5°C safety standard).`);
      }
    }
  }

  // 5. Existing safety status check
  if (listing.safety_status === 'frozen') {
    flags.push('Batch is currently FROZEN due to an active safety incident investigation.');
    return {
      isEligible: false,
      status: 'frozen',
      flags,
      hoursRemaining,
      recommendations: ['Await Admin food safety clearance before resuming rescue.']
    };
  }

  if (listing.safety_status === 'recalled') {
    flags.push('Batch has been officially RECALLED.');
    return {
      isEligible: false,
      status: 'recalled',
      flags,
      hoursRemaining: 0,
      recommendations: ['Quarantine all containers immediately.']
    };
  }

  const isEligible = flags.filter(f => f.includes('expired') || f.includes('FROZEN') || f.includes('Missing critical')).length === 0;

  return {
    isEligible,
    status: isEligible ? 'eligible' : 'under_review',
    flags,
    hoursRemaining,
    recommendations
  };
}
