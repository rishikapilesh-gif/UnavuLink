import React from 'react';
import { Sparkles, Calendar, TrendingDown, Lightbulb, CheckCircle2 } from 'lucide-react';

const PREDICTIONS = [
  {
    event: 'Upcoming Weekend Wedding Reception (Sunday 7 PM)',
    estimatedSurplusKg: '45 - 65 kg',
    portions: '~110 - 150 meals',
    confidence: '92%',
    recommendation: 'Pre-schedule Anbalayam Shelter & volunteer pick-up 90 minutes before buffet wrap.'
  },
  {
    event: 'Friday Corporate Lunch Buffet',
    estimatedSurplusKg: '15 - 25 kg',
    portions: '~40 - 60 meals',
    confidence: '88%',
    recommendation: 'Pack in 500ml food-grade takeaway bowls for immediate distribution to Lions Community Fridge.'
  }
];

export const PredictiveSurplusPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-card border border-sage shadow-soft flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-warm" />
            <span className="text-xs font-bold text-forest uppercase tracking-wider">Predictive Intelligence</span>
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal">Food Waste Prevention & Surplus Forecasts</h1>
          <p className="text-xs text-muted">
            Analyzing historical banquet consumption patterns to forecast surplus before cooking begins.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {PREDICTIONS.map((p, idx) => (
          <div key={idx} className="bg-white p-5 rounded-card border border-sage shadow-soft space-y-3 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded uppercase">
                  Confidence Score: {p.confidence}
                </span>
                <h3 className="font-bold text-charcoal text-sm mt-1">{p.event}</h3>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-orange-warm text-base block">{p.estimatedSurplusKg}</span>
                <span className="text-muted text-[11px]">{p.portions}</span>
              </div>
            </div>

            <div className="p-3 bg-cream rounded-subtle border border-sage flex items-start gap-2 text-muted">
              <Lightbulb className="w-4 h-4 text-orange-warm shrink-0 mt-0.5" />
              <span><strong>Pre-emptive Logistics Advice:</strong> {p.recommendation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
