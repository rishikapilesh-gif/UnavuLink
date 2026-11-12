import React from 'react';
import { DonationStepper } from '../../components/donor/DonationStepper';
import { useAuth } from '../../contexts/AuthContext';

export const DonateFoodPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="text-center max-w-lg mx-auto space-y-1">
        <span className="text-xs font-bold text-forest uppercase tracking-wider">Fast Food Rescue Posting</span>
        <h1 className="text-2xl font-extrabold text-charcoal">Post Surplus Food</h1>
        <p className="text-xs text-muted">
          Welcome back, {user?.full_name || 'Chef'}. Fill out 4 quick steps or use AI Autofill to register your food batch.
        </p>
      </div>

      <DonationStepper />
    </div>
  );
};
