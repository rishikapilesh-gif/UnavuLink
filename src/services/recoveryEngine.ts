import { RescueMission, VolunteerProfile, Organization } from '../types';
import { store } from './store';
import { calculateDistanceKm } from './fairshare';

export interface RecoveryActionPlan {
  success: boolean;
  scenario: 'volunteer_cancellation' | 'ngo_rejection' | 'delivery_delay' | 'safety_recall';
  previousState: string;
  proposedAction: string;
  reassignedEntityName?: string;
  newEtaMins?: number;
  logMessage: string;
}

export class RescueRecoveryEngine {
  /**
   * Handle Volunteer Cancellation
   */
  static handleVolunteerCancellation(
    missionId: string, 
    reason: string
  ): RecoveryActionPlan {
    const mission = store.getMissionById(missionId);
    if (!mission) {
      return {
        success: false,
        scenario: 'volunteer_cancellation',
        previousState: 'Unknown mission',
        proposedAction: 'Mission not found in system',
        logMessage: 'Recovery abort: Mission ID invalid'
      };
    }

    const allVolunteers = store.getVolunteers();
    // Exclude currently assigned volunteer
    const eligibleReplacements = allVolunteers.filter(
      v => v.user_id !== mission.volunteer_id && v.is_approved && v.availability_status === 'available'
    );

    if (eligibleReplacements.length === 0) {
      // Escalate to coordinator
      const updatedMission: RescueMission = {
        ...mission,
        mission_status: 'failed',
        volunteer_id: undefined,
        volunteer_name: undefined
      };
      store.updateMission(updatedMission);

      return {
        success: false,
        scenario: 'volunteer_cancellation',
        previousState: `Volunteer ${mission.volunteer_name || 'Assigned'} cancelled: "${reason}"`,
        proposedAction: 'No immediate replacement volunteers online. Escalate to Admin Command Centre for emergency dispatch.',
        logMessage: `[ESCALATION] Mission ${mission.batch_id} marked as FAILED - volunteer shortage.`
      };
    }

    // Pick best replacement volunteer
    const replacement = eligibleReplacements[0];
    const newEta = mission.estimated_duration_mins + 12; // add re-routing buffer

    const updatedMission: RescueMission = {
      ...mission,
      volunteer_id: replacement.user_id,
      volunteer_name: replacement.full_name || 'Replacement Volunteer',
      mission_status: 'reassigned',
      estimated_duration_mins: newEta
    };
    store.updateMission(updatedMission);

    return {
      success: true,
      scenario: 'volunteer_cancellation',
      previousState: `Volunteer ${mission.volunteer_name || 'Assigned'} cancelled: "${reason}"`,
      proposedAction: `Auto-reassigned to approved volunteer ${replacement.full_name} (${replacement.transport_type}).`,
      reassignedEntityName: replacement.full_name,
      newEtaMins: newEta,
      logMessage: `[RECOVERY SUCCESS] Mission ${mission.batch_id} re-routed to ${replacement.full_name}. New ETA: ${newEta} mins.`
    };
  }

  /**
   * Handle NGO Rejection (e.g. unexpected capacity full)
   */
  static handleNgoRejection(
    missionId: string,
    reason: string,
    allOrganizations: Organization[]
  ): RecoveryActionPlan {
    const mission = store.getMissionById(missionId);
    if (!mission) {
      return {
        success: false,
        scenario: 'ngo_rejection',
        previousState: 'Mission not found',
        proposedAction: 'Cannot find mission',
        logMessage: 'Abort recovery'
      };
    }

    // Find alternative eligible NGOs
    const alternatives = allOrganizations.filter(
      org => org.profile_id !== mission.recipient_id && (org.organisation_type.includes('NGO') || org.organisation_type.includes('Shelter'))
    );

    if (alternatives.length === 0) {
      return {
        success: false,
        scenario: 'ngo_rejection',
        previousState: `NGO rejected food batch ${mission.batch_id}: "${reason}"`,
        proposedAction: 'Reroute to nearest Community Hub Fridge (Coimbatore Lions Fridge) for immediate public cold-storage dispensing.',
        logMessage: `[RECOVERY FALLBACK] Mission ${mission.batch_id} directed to Community Fridge Hub.`
      };
    }

    const altOrg = alternatives[0];
    const newDist = calculateDistanceKm(mission.pickup_lat, mission.pickup_lng, altOrg.latitude, altOrg.longitude);
    const newEta = Math.round(newDist * 3 + 12);

    const updatedMission: RescueMission = {
      ...mission,
      recipient_id: altOrg.profile_id,
      recipient_name: altOrg.organisation_name,
      delivery_address: `${altOrg.address}, ${altOrg.city}`,
      delivery_lat: altOrg.latitude,
      delivery_lng: altOrg.longitude,
      distance_km: newDist,
      estimated_duration_mins: newEta,
      mission_status: 'reassigned'
    };
    store.updateMission(updatedMission);

    return {
      success: true,
      scenario: 'ngo_rejection',
      previousState: `Original NGO rejected: "${reason}"`,
      proposedAction: `Successfully re-allocated to secondary FairShare match: ${altOrg.organisation_name} (${newDist} km).`,
      reassignedEntityName: altOrg.organisation_name,
      newEtaMins: newEta,
      logMessage: `[RECOVERY SUCCESS] Batch ${mission.batch_id} rerouted to ${altOrg.organisation_name}.`
    };
  }
}
