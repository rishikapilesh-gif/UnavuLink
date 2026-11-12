import React, { useState } from 'react';
import { PRESET_SCENARIOS, DigitalTwinScenarioResult } from '../../services/digitalTwin';
import { 
  Cpu, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Navigation, 
  Award, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DigitalTwinPage: React.FC = () => {
  const [scenarios] = useState<DigitalTwinScenarioResult[]>(PRESET_SCENARIOS);
  const [selectedScenario, setSelectedScenario] = useState<DigitalTwinScenarioResult>(PRESET_SCENARIOS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setHasRun(false);

    setTimeout(() => {
      setIsSimulating(false);
      setHasRun(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-card border border-sage shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-forest" />
            <span className="text-xs font-bold text-forest uppercase tracking-wider">Predictive Digital Twin</span>
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal">Food Rescue Digital Twin Simulator</h1>
          <p className="text-xs text-muted">
            Stress-test rescue missions against volunteer cancellations, highway gridlocks and capacity overflows before physical dispatch.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="px-5 py-3 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current text-orange-warm" />
          <span>{isSimulating ? 'Simulating Dynamic Failure...' : 'Run Selected Simulation'}</span>
        </button>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {scenarios.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenario(sc);
                setHasRun(false);
              }}
              className={`p-4 rounded-card text-left border transition-all text-xs space-y-1 ${
                isSelected
                  ? 'bg-forest text-white border-forest shadow-md'
                  : 'bg-white text-charcoal border-sage hover:border-forest/50'
              }`}
            >
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block ${
                isSelected ? 'bg-white/20 text-white' : 'bg-forest/10 text-forest'
              }`}>
                {sc.simulationType.replace('_', ' ').toUpperCase()}
              </span>
              <h3 className="font-bold text-sm block leading-snug">{sc.title}</h3>
              <p className={`text-[11px] ${isSelected ? 'text-cream' : 'text-muted'}`}>
                {sc.originalPlan.portions} meals • {sc.originalPlan.destinationNgo}
              </p>
            </button>
          );
        })}
      </div>

      {/* Simulation Workspace Card */}
      <div className="bg-white rounded-card p-6 border border-sage shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-sage/60 pb-3">
          <h2 className="text-base font-bold text-charcoal">
            Simulation Matrix: <span className="text-forest">{selectedScenario.title}</span>
          </h2>
          <span className="text-xs font-semibold text-muted">
            Deterministic Algorithmic Solver
          </span>
        </div>

        {/* 3 Step Comparison: Original Plan -> Simulated Failure -> Automated Recovery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Step 1: Original Plan */}
          <div className="p-4 bg-cream rounded-subtle border border-sage space-y-2">
            <span className="font-bold text-forest block uppercase text-[10px]">1. Initial Dispatch Plan</span>
            <div className="space-y-1">
              <span className="font-bold text-charcoal text-sm">{selectedScenario.originalPlan.foodName}</span>
              <p className="text-muted">Batch: <strong>{selectedScenario.originalPlan.batchId}</strong></p>
              <p className="text-muted">Assigned: <strong>{selectedScenario.originalPlan.assignedVolunteer}</strong></p>
              <p className="text-muted">Target: <strong>{selectedScenario.originalPlan.destinationNgo}</strong></p>
              <p className="text-forest font-semibold">Planned ETA: {selectedScenario.originalPlan.plannedEtaMins} mins</p>
            </div>
          </div>

          {/* Step 2: Simulated Failure Trigger */}
          <div className="p-4 bg-cherry/5 rounded-subtle border border-cherry/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cherry uppercase text-[10px]">2. Simulated Failure Event</span>
              <AlertTriangle className="w-4 h-4 text-cherry" />
            </div>
            <div className="space-y-1">
              <span className="font-bold text-charcoal block">{selectedScenario.simulatedFailure.event}</span>
              <p className="text-muted">{selectedScenario.simulatedFailure.impactDescription}</p>
              <span className="text-[10px] font-extrabold bg-cherry text-white px-2 py-0.5 rounded inline-block mt-1">
                Risk Level: {selectedScenario.simulatedFailure.foodRiskLevel}
              </span>
            </div>
          </div>

          {/* Step 3: Automated System Recovery */}
          <div className="p-4 bg-forest/10 rounded-subtle border border-forest/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-forest uppercase text-[10px]">3. Algorithmic Recovery</span>
              <RotateCcw className="w-4 h-4 text-forest" />
            </div>
            <div className="space-y-1">
              <span className="font-bold text-charcoal block">Self-Healing Mitigation</span>
              <p className="text-muted leading-relaxed">{selectedScenario.recoverySolution.actionTaken}</p>
              <p className="text-forest font-extrabold pt-1">
                New Resolved ETA: {selectedScenario.recoverySolution.newEtaMins} mins (+{selectedScenario.recoverySolution.delayDeltaMins}m buffer)
              </p>
            </div>
          </div>
        </div>

        {/* Quantified Outcome Impact Delta */}
        <div className="p-4 bg-sage/20 rounded-subtle border border-sage space-y-3">
          <h4 className="font-bold text-xs text-charcoal uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-warm" />
            <span>Digital Twin Measured Preservation Impact</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-3 rounded-subtle border border-sage">
              <span className="text-[10px] text-muted block font-semibold uppercase">Meals Preserved</span>
              <span className="text-xl font-extrabold text-forest">{selectedScenario.metrics.mealsPreserved}</span>
            </div>
            <div className="bg-white p-3 rounded-subtle border border-sage">
              <span className="text-[10px] text-muted block font-semibold uppercase">Food Waste Avoided</span>
              <span className="text-xl font-extrabold text-orange-warm">{selectedScenario.metrics.foodSavedKg} kg</span>
            </div>
            <div className="bg-white p-3 rounded-subtle border border-sage">
              <span className="text-[10px] text-muted block font-semibold uppercase">Carbon Offset Saved</span>
              <span className="text-xl font-extrabold text-forest-kelly">{selectedScenario.metrics.carbonOffsetKg} kg CO2</span>
            </div>
            <div className="bg-white p-3 rounded-subtle border border-sage">
              <span className="text-[10px] text-muted block font-semibold uppercase">Solver Decision Speed</span>
              <span className="text-xl font-extrabold text-charcoal">{selectedScenario.metrics.recoveryTimeSeconds}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
