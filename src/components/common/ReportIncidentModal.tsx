import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { store } from '../../services/store';
import { useAuth } from '../../contexts/AuthContext';
import { SafetyIncident } from '../../types';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId?: string;
  onSubmitted?: () => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  batchId = 'UNV-2026-CBE-001',
  onSubmitted
}) => {
  const { user } = useAuth();
  const [selectedBatch, setSelectedBatch] = useState(batchId);
  const [incidentType, setIncidentType] = useState<SafetyIncident['incident_type']>('Suspected Spoilage');
  const [severity, setSeverity] = useState<SafetyIncident['severity']>('critical');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const incident: SafetyIncident = {
        id: `inc-${Date.now()}`,
        batch_id: selectedBatch,
        reporter_id: user?.id || 'usr-anonymous',
        reporter_name: user?.full_name || 'Concerned Community Member',
        incident_type: incidentType,
        description: description.trim(),
        severity: severity,
        status: 'batch_frozen',
        resolution_notes: 'Batch immediately locked by Safety Gate incident reporting. Quarantined.',
        reported_at: new Date().toISOString()
      };

      store.addIncident(incident);
      setIsSubmitting(false);
      if (onSubmitted) onSubmitted();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-card shadow-lift max-w-md w-full border border-sage overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-cherry text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-sm">Report Food Safety Incident / Recall</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="bg-cherry/10 p-3 rounded-subtle border border-cherry/20 text-cherry">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Safety Gate Immediate Freeze Protocol
            </p>
            <p className="mt-1 text-[11px] text-charcoal">
              Filing a safety incident will instantly freeze batch <strong>{selectedBatch}</strong> across all recipient portals and stop active volunteer dispatches.
            </p>
          </div>

          <div>
            <label className="font-semibold text-charcoal block mb-1">Batch ID to Quarantine</label>
            <input
              type="text"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full p-2 border border-sage rounded-subtle bg-cream font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-charcoal block mb-1">Incident Category</label>
            <select
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value as any)}
              className="w-full p-2 border border-sage rounded-subtle bg-white"
            >
              <option value="Suspected Spoilage">Suspected Spoilage (Smell / Visual Alteration)</option>
              <option value="Temperature Abuse">Temperature Abuse (Danger Zone Violation)</option>
              <option value="Allergen Mismatch">Undeclared Allergen Detected</option>
              <option value="Packaging Damage">Broken Seals / Contaminated Packaging</option>
              <option value="Other">Other Food Safety Hazard</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-charcoal block mb-1">Severity Level</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="w-full p-2 border border-sage rounded-subtle bg-white"
            >
              <option value="critical">Critical (Immediate Health Risk - Freeze Batch)</option>
              <option value="high">High (Quarantine Pending Inspection)</option>
              <option value="medium">Medium (Requires Label Clarification)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-charcoal block mb-1">Observations & Evidence</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what was observed (e.g. food odor, elevated thermometer reading, unhygienic transport drum)..."
              className="w-full p-2.5 border border-sage rounded-subtle bg-white focus:outline-none focus:ring-1 focus:ring-cherry"
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2 border border-sage rounded-subtle font-semibold text-charcoal hover:bg-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 py-2 bg-cherry text-white rounded-subtle font-semibold hover:bg-cherry-coral transition-all flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? 'Quarantining Batch...' : 'Submit & Freeze Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
