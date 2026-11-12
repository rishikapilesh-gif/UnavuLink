import React from 'react';
import { MealPulsePage } from './MealPulsePage';

/**
 * Backward-compatible wrapper preserving existing /rescuetwin route imports.
 * Rebranded to MealPulse AI: Predict. Alert. Rescue.
 */
export const RescueTwinPage: React.FC = () => {
  return <MealPulsePage />;
};

export default RescueTwinPage;
