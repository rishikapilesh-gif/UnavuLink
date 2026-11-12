import React from 'react';
import { ShieldCheck, HeartHandshake, QrCode, Cpu, CheckCircle2, RotateCcw } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 text-charcoal">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-forest uppercase tracking-wider bg-forest/10 px-3 py-1 rounded-full">
          Mission & Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Every Meal Deserves a Destination.
        </h1>
        <p className="text-sm text-muted max-w-2xl mx-auto leading-relaxed">
          UnavuLink is an AI-powered food rescue and redistribution ecosystem engineered to solve the real bottlenecks of surplus food logistics: safety verification, fair allocation, reliable transport, and failure recovery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-2.5">
          <ShieldCheck className="w-6 h-6 text-forest" />
          <h3 className="font-bold text-sm text-charcoal">Safety Eligibility Gate</h3>
          <p className="text-muted leading-relaxed">
            Every batch undergoes automated and human-supervised evaluation of preparation timestamps, temperature thresholds, and allergen declarations. Batches that fail or expire are locked from distribution.
          </p>
        </div>

        <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-2.5">
          <QrCode className="w-6 h-6 text-orange-warm" />
          <h3 className="font-bold text-sm text-charcoal">QR Food Safety Passport</h3>
          <p className="text-muted leading-relaxed">
            Unique digital passport for every batch embedding origin kitchen, custody chain, temperature readings, and allergen declarations. Scanned by volunteers and shelters to verify handovers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-2.5">
          <RotateCcw className="w-6 h-6 text-cherry" />
          <h3 className="font-bold text-sm text-charcoal">Rescue Failure Recovery Engine</h3>
          <p className="text-muted leading-relaxed">
            Real logistics fail: volunteers face vehicle punctures and shelters occasionally overflow. The recovery engine detects dropouts and reroutes batches within the safe window without manual panic.
          </p>
        </div>

        <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-2.5">
          <Cpu className="w-6 h-6 text-blue-700" />
          <h3 className="font-bold text-sm text-charcoal">Food Rescue Digital Twin</h3>
          <p className="text-muted leading-relaxed">
            Interactive simulation engine allowing platform coordinators to simulate capacity shocks, traffic corridors, and emergency surges before real operations are launched.
          </p>
        </div>
      </div>
    </div>
  );
};
