import React from 'react';
import { FoodListing } from '../../types';
import { 
  X, 
  MapPin, 
  Clock, 
  Thermometer, 
  ShieldCheck, 
  QrCode, 
  Flame, 
  AlertTriangle, 
  Utensils, 
  ChefHat, 
  Package, 
  ArrowRight 
} from 'lucide-react';

interface FoodDetailsModalProps {
  listing: FoodListing | null;
  onClose: () => void;
  onRequest: (listing: FoodListing) => void;
  onOpenPassport: (listing: FoodListing) => void;
}

export const FoodDetailsModal: React.FC<FoodDetailsModalProps> = ({
  listing,
  onClose,
  onRequest,
  onOpenPassport
}) => {
  if (!listing) return null;

  const isVeg = listing.dietary_category !== 'Non-Vegetarian';
  const isEmergency = listing.is_emergency;
  const isFrozen = listing.safety_status === 'frozen';
  const isExpired = listing.safety_status === 'expired';
  const imageUrl = listing.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-charcoal/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-card shadow-lift max-w-2xl w-full border border-sage overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Top Image Banner */}
        <div className="relative h-64 w-full bg-gray-100 shrink-0">
          <img 
            src={imageUrl} 
            alt={listing.food_name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-black/30" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div 
              className={`w-6 h-6 bg-white/95 rounded flex items-center justify-center border shadow-xs ${
                isVeg ? 'border-status-success' : 'border-cherry'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${isVeg ? 'bg-status-success' : 'bg-cherry'}`} />
            </div>
            {isEmergency && (
              <span className="bg-cherry text-white text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wide">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Emergency Bulk Surplus</span>
              </span>
            )}
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-warm mb-1">
              <span>{listing.batch_id}</span>
              <span>•</span>
              <span>{listing.food_category}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold leading-snug drop-shadow-sm">
              {listing.food_name}
            </h2>
            <p className="text-xs text-cream/90 flex items-center gap-1.5 mt-1">
              <ChefHat className="w-3.5 h-3.5 text-orange-warm" />
              <span>Donated by <strong>{listing.donor_name || 'Verified Banquet Kitchen'}</strong></span>
            </p>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Status Alert if Frozen/Quarantined */}
          {isFrozen && (
            <div className="p-3.5 bg-cherry/10 border border-cherry/30 rounded-subtle flex items-start gap-3 text-cherry">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block">BATCH UNDER ACTIVE SAFETY QUARANTINE</span>
                <p className="mt-0.5 text-xs">{listing.handling_information}</p>
              </div>
            </div>
          )}

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-cream p-3 rounded-subtle border border-sage text-center">
              <span className="text-[10px] text-muted block font-semibold uppercase">Quantity</span>
              <span className="text-base font-extrabold text-charcoal">{listing.quantity} {listing.unit}</span>
            </div>
            <div className="bg-cream p-3 rounded-subtle border border-sage text-center">
              <span className="text-[10px] text-muted block font-semibold uppercase">Meal Servings</span>
              <span className="text-base font-extrabold text-forest">{listing.estimated_portions} portions</span>
            </div>
            <div className="bg-cream p-3 rounded-subtle border border-sage text-center">
              <span className="text-[10px] text-muted block font-semibold uppercase">Prep Time</span>
              <span className="text-base font-extrabold text-charcoal">
                {new Date(listing.preparation_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="bg-cream p-3 rounded-subtle border border-sage text-center">
              <span className="text-[10px] text-muted block font-semibold uppercase">Holding Temp</span>
              <span className="text-base font-extrabold text-cherry">
                {listing.temperature_celsius ? `${listing.temperature_celsius}°C` : 'Ambient'}
              </span>
            </div>
          </div>

          {/* Food Description */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-charcoal text-sm">About This Rescue Food</h4>
            <p className="text-muted leading-relaxed text-xs">{listing.description}</p>
          </div>

          {/* Ingredients & Allergens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 bg-cream/50 p-3.5 rounded-subtle border border-sage">
              <h4 className="font-bold text-charcoal flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-forest" />
                <span>Declared Ingredients</span>
              </h4>
              <p className="text-muted leading-relaxed">
                {listing.ingredients || 'Prepared with standard South Indian banquet spices and grains.'}
              </p>
            </div>

            <div className="space-y-1.5 bg-cream/50 p-3.5 rounded-subtle border border-sage">
              <h4 className="font-bold text-charcoal flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-cherry" />
                <span>Allergen Declarations</span>
              </h4>
              {listing.allergens && listing.allergens.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {listing.allergens.map(a => (
                    <span key={a} className="bg-cherry/10 text-cherry font-semibold px-2 py-0.5 rounded-full text-[11px]">
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No major allergens declared by donor.</p>
              )}
            </div>
          </div>

          {/* Storage & Packaging Info */}
          <div className="space-y-2 bg-sage/20 p-3.5 rounded-subtle border border-sage">
            <div className="flex items-start gap-2">
              <Package className="w-4 h-4 text-forest shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-charcoal block">Packaging & Handling Standard:</span>
                <span className="text-muted block mt-0.5">{listing.packaging_information}</span>
                <span className="text-forest font-semibold block mt-1">
                  Permitted handling window closes at: <strong>{new Date(listing.permitted_handling_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Location & Map Preview Button */}
          <div className="flex items-center justify-between p-3 bg-white border border-sage rounded-subtle">
            <div className="flex items-center gap-2 text-muted">
              <MapPin className="w-4 h-4 text-orange-warm shrink-0" />
              <div>
                <span className="font-bold text-charcoal block">Pickup Location</span>
                <span>{listing.pickup_location}</span>
              </div>
            </div>
            <button
              onClick={() => onOpenPassport(listing)}
              className="px-3 py-1.5 bg-forest/10 hover:bg-forest/20 text-forest rounded font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-orange-warm" />
              <span>Safety Passport</span>
            </button>
          </div>
        </div>

        {/* Sticky Bottom Action Bar (Swiggy-style) */}
        <div className="p-4 bg-cream border-t border-sage flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[11px] text-muted block">Available to Request:</span>
            <span className="text-lg font-extrabold text-charcoal">{listing.quantity} {listing.unit} ({listing.estimated_portions} meals)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-sage bg-white hover:bg-cream rounded-subtle font-semibold text-charcoal transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isFrozen || isExpired}
              onClick={() => {
                onRequest(listing);
                onClose();
              }}
              className={`px-6 py-2.5 rounded-subtle font-extrabold text-xs transition-all flex items-center gap-2 shadow-sm ${
                isFrozen || isExpired
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-forest hover:bg-forest-dark text-white'
              }`}
            >
              <span>Request Food Allocation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
