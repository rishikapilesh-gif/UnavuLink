export interface DigitalTwinScenarioResult {
  id: string;
  title: string;
  simulationType: 'volunteer_cancellation' | 'ngo_overflow' | 'route_gridlock' | 'bulk_surge';
  status: 'Simulated' | 'Resolved';
  originalPlan: {
    batchId: string;
    foodName: string;
    portions: number;
    assignedVolunteer: string;
    destinationNgo: string;
    plannedEtaMins: number;
  };
  simulatedFailure: {
    event: string;
    impactDescription: string;
    foodRiskLevel: 'Medium' | 'High' | 'Critical';
  };
  recoverySolution: {
    actionTaken: string;
    reallocatedVolunteer?: string;
    reallocatedNgo?: string;
    newEtaMins: number;
    delayDeltaMins: number;
  };
  metrics: {
    mealsPreserved: number;
    foodSavedKg: number;
    carbonOffsetKg: number;
    recoveryTimeSeconds: number;
  };
}

export const PRESET_SCENARIOS: DigitalTwinScenarioResult[] = [
  {
    id: 'dt-1',
    title: 'Volunteer Two-Wheeler Breakdown (Peelamedu)',
    simulationType: 'volunteer_cancellation',
    status: 'Resolved',
    originalPlan: {
      batchId: 'UNV-2026-CBE-002',
      foodName: 'Traditional Sambar Rice (60 kg)',
      portions: 140,
      assignedVolunteer: 'Karthik Subramanian',
      destinationNgo: 'Anbalayam Children Shelter',
      plannedEtaMins: 22
    },
    simulatedFailure: {
      event: 'Volunteer motorcycle puncture 3 km before pickup.',
      impactDescription: 'Volunteer cancelled. Batch at risk of exceeding hot holding threshold in 75 mins.',
      foodRiskLevel: 'High'
    },
    recoverySolution: {
      actionTaken: 'Recovery Engine intercepted cancellation. Auto-dispatched Priya Ramasamy (Car) stationed in Singanallur.',
      reallocatedVolunteer: 'Priya Ramasamy',
      reallocatedNgo: 'Anbalayam Children Shelter',
      newEtaMins: 31,
      delayDeltaMins: 9
    },
    metrics: {
      mealsPreserved: 140,
      foodSavedKg: 60,
      carbonOffsetKg: 120,
      recoveryTimeSeconds: 4.2
    }
  },
  {
    id: 'dt-2',
    title: 'NGO Capacity Overflow & Sudden Refusal',
    simulationType: 'ngo_overflow',
    status: 'Resolved',
    originalPlan: {
      batchId: 'UNV-2026-CBE-001',
      foodName: 'Fresh Veg Biryani (35 kg)',
      portions: 80,
      assignedVolunteer: 'Priya Ramasamy',
      destinationNgo: 'Karunai Illam Destitute Shelter',
      plannedEtaMins: 18
    },
    simulatedFailure: {
      event: 'Karunai Illam received independent donation; shelter capacity 100% full.',
      impactDescription: '80 portions stranded with volunteer en route. Cannot store overnight without refrigeration.',
      foodRiskLevel: 'Critical'
    },
    recoverySolution: {
      actionTaken: 'FairShare priority matrix instantly re-evaluated nearby recipients. Re-routed to Lions Community Fridge & Ukkadam Kitchen.',
      reallocatedVolunteer: 'Priya Ramasamy',
      reallocatedNgo: 'Coimbatore Lions Community Fridge & Ukkadam Hub',
      newEtaMins: 24,
      delayDeltaMins: 6
    },
    metrics: {
      mealsPreserved: 80,
      foodSavedKg: 35,
      carbonOffsetKg: 70,
      recoveryTimeSeconds: 2.8
    }
  },
  {
    id: 'dt-3',
    title: 'Major Traffic Gridlock on Avinashi Highway',
    simulationType: 'route_gridlock',
    status: 'Resolved',
    originalPlan: {
      batchId: 'UNV-2026-CBE-004-EMG',
      foodName: 'Emergency Wedding Feast (110 kg)',
      portions: 250,
      assignedVolunteer: 'Vignesh Soundar (Mini Van)',
      destinationNgo: 'Anbalayam & Karunai Joint Intake',
      plannedEtaMins: 25
    },
    simulatedFailure: {
      event: 'Severe accident block on Avinashi Flyover (+48 mins estimated delay).',
      impactDescription: 'Delivery duration would breach the 2-hour cooked food holding window.',
      foodRiskLevel: 'High'
    },
    recoverySolution: {
      actionTaken: 'OSRM Dynamic Rerouting engaged: Diverted through Hope College bypass corridor, shaving 32 minutes off transit.',
      reallocatedVolunteer: 'Vignesh Soundar',
      reallocatedNgo: 'Anbalayam & Karunai Joint Intake',
      newEtaMins: 38,
      delayDeltaMins: 13
    },
    metrics: {
      mealsPreserved: 250,
      foodSavedKg: 110,
      carbonOffsetKg: 220,
      recoveryTimeSeconds: 1.5
    }
  }
];
