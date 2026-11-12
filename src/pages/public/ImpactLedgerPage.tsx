import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  Utensils, 
  Award, 
  ShieldCheck, 
  Search, 
  Filter, 
  Truck, 
  Building2, 
  ChefHat,
  ArrowRight
} from 'lucide-react';

export const ImpactLedgerPage: React.FC = () => {
  const store = useStore();
  const ledgerItems = store.getImpactLedger();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'served' | 'in_transit'>('all');

  const filteredItems = ledgerItems.filter(item => {
    if (activeFilter === 'served' && !item.stages.served.status) return false;
    if (activeFilter === 'in_transit' && (!item.stages.pickedUp.status || item.stages.served.status)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.batchId.toLowerCase().includes(q) ||
        item.foodName.toLowerCase().includes(q) ||
        item.donorName.toLowerCase().includes(q) ||
        item.recipientName.toLowerCase().includes(q) ||
        item.rescueMateName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sage/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-forest" />
            <span className="text-xs font-bold text-forest uppercase tracking-wider">Unbroken Chain of Custody</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
            Verified Impact & Contribution Ledger
          </h1>
          <p className="text-xs text-muted">
            Tracking every rescued meal across 7 rigorous stages: Listed → Approved → Allocated → Picked Up → Received → Distributed → Served.
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-forest/10 border border-forest/30 px-4 py-2 rounded-2xl text-center">
            <span className="text-[10px] text-muted uppercase font-bold block">Verified Handover Batches</span>
            <span className="text-lg font-extrabold text-forest">{ledgerItems.length} Batches Audited</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-card border border-sage shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by batch ID, donor kitchen, recipient shelter, or RescueMate..."
            className="w-full pl-9 pr-3 py-2 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full font-bold text-xs transition-colors ${
              activeFilter === 'all' ? 'bg-forest text-white' : 'bg-cream text-charcoal hover:bg-forest/10'
            }`}
          >
            All Batches
          </button>
          <button
            onClick={() => setActiveFilter('served')}
            className={`px-3 py-1.5 rounded-full font-bold text-xs transition-colors ${
              activeFilter === 'served' ? 'bg-forest text-white' : 'bg-cream text-charcoal hover:bg-forest/10'
            }`}
          >
            ✓ Fully Served to Tables
          </button>
          <button
            onClick={() => setActiveFilter('in_transit')}
            className={`px-3 py-1.5 rounded-full font-bold text-xs transition-colors ${
              activeFilter === 'in_transit' ? 'bg-forest text-white' : 'bg-cream text-charcoal hover:bg-forest/10'
            }`}
          >
            🛵 In Transit / Picked Up
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-card border border-sage shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream border-b border-sage text-charcoal font-bold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Batch ID & Food</th>
                <th className="py-3.5 px-4">Donor Kitchen</th>
                <th className="py-3.5 px-4">RescueMate</th>
                <th className="py-3.5 px-4">Recipient Shelter</th>
                <th className="py-3.5 px-4">Quantity / Portions</th>
                <th className="py-3.5 px-4 text-center">7-Stage Custody Trail</th>
                <th className="py-3.5 px-4 text-right">Verified Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/40">
              {filteredItems.map(item => (
                <tr key={item.batchId} className="hover:bg-cream/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-extrabold text-forest text-[11px] block">{item.batchId}</span>
                    <span className="font-bold text-charcoal">{item.foodName}</span>
                    <span className="text-[10px] text-muted block capitalize">{item.category}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-semibold text-charcoal">
                      <ChefHat className="w-3.5 h-3.5 text-orange-warm shrink-0" />
                      <span>{item.donorName}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-charcoal">
                      <Truck className="w-3.5 h-3.5 text-forest shrink-0" />
                      <span className="font-medium">{item.rescueMateName}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-charcoal">
                      <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-medium">{item.recipientName}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-charcoal block">{item.quantityKg} kg</span>
                    <span className="text-[10px] text-muted">{item.portions} Portions</span>
                  </td>

                  {/* 7-Stage Visual Custody Dots */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-cream px-2 py-1 rounded-full border border-sage">
                      {Object.entries(item.stages).map(([stageName, stageData]) => (
                        <span
                          key={stageName}
                          title={`${stageName.toUpperCase()}: ${stageData.status ? 'Complete' : 'Pending'}`}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            stageData.status ? 'bg-forest' : 'bg-sage/70'
                          }`}
                        />
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {item.verifiedCredits > 0 ? (
                      <span className="font-extrabold text-forest bg-forest/10 px-2.5 py-1 rounded-full text-xs">
                        +{item.verifiedCredits} Pts
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted font-semibold">In Progress</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
