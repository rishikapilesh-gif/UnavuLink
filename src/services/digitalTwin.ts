export interface DigitalTwinScenarioResult {
  id: string;
  title: string;
  simulationType: 'volunteer_cancellation' | 'ngo_overflow' | 'route_gridlock' | 'bulk_surge' | 'event_surplus' | 'hostel_wastage' | 'simultaneous_claiming';
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
  },
  {
    id: 'dt-wedding-pulse',
    title: 'Scenario 1: Wedding Surplus Prediction & Early Rescue (EventPulse)',
    simulationType: 'event_surplus',
    status: 'Resolved',
    originalPlan: {
      batchId: 'EVT-PULSE-WED-600',
      foodName: 'Wedding Reception Dinner (750 Meals Planned for 600 Guests)',
      portions: 750,
      assignedVolunteer: 'Pre-Notified Volunteer Group (Karthik S. & Team)',
      destinationNgo: 'Anbalayam Shelter (40 meals) & Karunai Illam (25 meals)',
      plannedEtaMins: 30
    },
    simulatedFailure: {
      event: 'Pre-event surplus predicted at 60-100 meals; 75 actual surplus confirmed at 9:30 PM.',
      impactDescription: 'High risk of waste if coordination waited until after buffet wrap; hot holding temperature drops below 60°C in 2.5 hours.',
      foodRiskLevel: 'High'
    },
    recoverySolution: {
      actionTaken: 'EventPulse early alert triggered at 11:00 AM: Anbalayam & Karunai Illam pre-registered interest; volunteer auto-staged at 9:15 PM for immediate thermal vessel pickup.',
      reallocatedVolunteer: 'Karthik Subramanian (Two-wheeler with Thermal Bag)',
      reallocatedNgo: 'Anbalayam Children Shelter (40) + Karunai Illam (25) + Community Kitchen (10)',
      newEtaMins: 22,
      delayDeltaMins: -8
    },
    metrics: {
      mealsPreserved: 75,
      foodSavedKg: 32,
      carbonOffsetKg: 64,
      recoveryTimeSeconds: 1.2
    }
  },
  {
    id: 'dt-hostel-pulse',
    title: 'Scenario 2: College Hostel Dinner Wastage Intelligence (HostelPulse)',
    simulationType: 'hostel_wastage',
    status: 'Resolved',
    originalPlan: {
      batchId: 'HST-PULSE-SECE-400',
      foodName: 'Hostel Mess Dinner (400 Prepared vs 340 Actual Footfall)',
      portions: 400,
      assignedVolunteer: 'Local Community Volunteer (Priya Ramasamy)',
      destinationNgo: 'Vadasithur Rural Children Learning Centre',
      plannedEtaMins: 20
    },
    simulatedFailure: {
      event: 'Friday evening student departure pattern created 58 portions unconsumed mess food.',
      impactDescription: 'Institutional mess halls without real-time rescue routinely discard food into disposal bins by 10:00 PM.',
      foodRiskLevel: 'Medium'
    },
    recoverySolution: {
      actionTaken: 'HostelPulse anticipated 50-65 portions drop-off; Mess Manager 1-click confirmed 58 portions at 9:10 PM; nearby rural centre received direct delivery within 45 mins.',
      reallocatedVolunteer: 'Priya Ramasamy (Car)',
      reallocatedNgo: 'Vadasithur Rural Children Learning Centre',
      newEtaMins: 25,
      delayDeltaMins: 5
    },
    metrics: {
      mealsPreserved: 58,
      foodSavedKg: 24,
      carbonOffsetKg: 48,
      recoveryTimeSeconds: 2.1
    }
  },
  {
    id: 'dt-race-condition',
    title: 'Scenario 3: Simultaneous Volunteer Claiming Race Condition (LiveSync Atomic)',
    simulationType: 'simultaneous_claiming',
    status: 'Resolved',
    originalPlan: {
      batchId: 'LIVE-SYNC-ATOMIC-01',
      foodName: 'High-Demand Urgent Feast Batch (90 Portions)',
      portions: 90,
      assignedVolunteer: 'Unassigned (Broadcast to 2 active RescueMates)',
      destinationNgo: 'Anbalayam Children Shelter',
      plannedEtaMins: 15
    },
    simulatedFailure: {
      event: 'Two volunteers (Karthik S. and Priya R.) hit "Accept Mission" at the exact same millisecond.',
      impactDescription: 'In non-atomic systems, duplicate dispatch causes two drivers showing up to pick up the same batch, causing wasted mileage and volunteer frustration.',
      foodRiskLevel: 'Critical'
    },
    recoverySolution: {
      actionTaken: 'LiveSync atomic lock awarded assignment to Karthik S. (Transaction #1 winning). Priya R. instantly received notification: "Already accepted by Karthik Subramanian" and UI real-time refreshed to next mission.',
      reallocatedVolunteer: 'Karthik Subramanian (Single Winner)',
      reallocatedNgo: 'Anbalayam Children Shelter',
      newEtaMins: 14,
      delayDeltaMins: 0
    },
    metrics: {
      mealsPreserved: 90,
      foodSavedKg: 38,
      carbonOffsetKg: 76,
      recoveryTimeSeconds: 0.04
    }
  }
];
