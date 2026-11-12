import React from 'react';
import { FoodListing } from '../../types';
import { 
  Clock, 
  MapPin, 
  ShieldCheck, 
  QrCode, 
  Flame, 
  AlertTriangle, 
  Utensils, 
  Thermometer,
  ArrowRight
} from 'lucide-react';

interface FoodCardProps {
  listing: FoodListing;
  onRequestClick?: (listing: FoodListing) => void;
  onPassportClick?: (listing: FoodListing) => void;
  onCardClick?: (listing: FoodListing) => void;
  hideRequestButton?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  listing,
  onRequestClick,
  onPassportClick,
  onCardClick,
  hideRequestButton = false
}) => {
  const isVeg = listing.dietary_category !== 'Non-Vegetarian';
  const isEmergency = listing.is_emergency;
  const isFrozen = listing.safety_status === 'frozen';
  const isExpired = listing.safety_status === 'expired';

  // Calculate remaining hours
  const now = new Date().getTime();
  const deadline = new Date(listing.permitted_handling_deadline).getTime();
  const diffHours = Math.max(0, Number(((deadline - now) / (1000 * 60 * 60)).toFixed(1)));
  const isUrgent = diffHours > 0 && diffHours < 2.0;

  // Fallback image if not provided
  const imageUrl = listing.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80';

  return (
    <div 
      className={`group bg-white rounded-card border transition-all duration-200 overflow-hidden flex flex-col justify-between hover:shadow-lift cursor-pointer ${
        isFrozen 
          ? 'border-cherry/50 bg-cherry/5 opacity-85' 
          : isEmergency 
          ? 'border-cherry/40 ring-1 ring-cherry/20' 
          : 'border-sage hover:border-forest/40 shadow-soft'
      }`}
      onClick={() => onCardClick && onCardClick(listing)}
    >
      <div>
        {/* Food Image with Swiggy-Style Overlays */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <img 
            src={imageUrl} 
            alt={listing.food_name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-black/20" />

          {/* Top Left: Dietary & Urgency Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            {/* Swiggy-Style Veg / Non-Veg Indicator */}
            <div 
              className={`w-5 h-5 bg-white/95 rounded flex items-center justify-center border shadow-xs ${
                isVeg ? 'border-status-success' : 'border-cherry'
              }`}
              title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${isVeg ? 'bg-status-success' : 'bg-cherry'}`} />
            </div>

            {/* Emergency / Urgent Tag */}
            {isEmergency && (
              <span className="bg-cherry text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs uppercase tracking-wide">
                <Flame className="w-3 h-3 fill-current" />
                <span>Emergency</span>
              </span>
            )}

            {isUrgent && !isEmergency && (
              <span className="bg-orange-warm text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Clock className="w-3 h-3" />
                <span>Under 2 hrs</span>
              </span>
            )}

            {isFrozen && (
              <span className="bg-cherry text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <AlertTriangle className="w-3 h-3" />
                <span>Safety Frozen</span>
              </span>
            )}
          </div>

          {/* Top Right: Safety Gate Verified Pill */}
          <div className="absolute top-3 right-3">
            <span className="bg-white/95 backdrop-blur-sm text-forest font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
              <span>Safety Gate</span>
            </span>
          </div>

          {/* Bottom Overlay: Quantity & Portions Count */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
            <span className="font-extrabold text-sm tracking-tight drop-shadow-sm flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-orange-warm" />
              <span>{listing.estimated_portions} Meals Available</span>
            </span>
            <span className="text-xs font-mono font-bold bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded border border-white/20">
              {listing.quantity} {listing.unit}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-forest uppercase tracking-wider block">
                {listing.batch_id} • {listing.food_category}
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-charcoal line-clamp-1 group-hover:text-forest transition-colors">
                {listing.food_name}
              </h3>
            </div>
          </div>

          <p className="text-xs text-muted line-clamp-2 leading-relaxed">
            {listing.description}
          </p>

          {/* Location & Holding Conditions */}
          <div className="bg-cream/70 rounded-subtle p-2.5 border border-sage/60 space-y-1 text-xs">
            <div className="flex items-center justify-between text-muted">
              <span className="flex items-center gap-1 truncate max-w-[70%]">
                <MapPin className="w-3.5 h-3.5 text-orange-warm shrink-0" />
                <span className="truncate">{listing.pickup_location}</span>
              </span>
              <span className="font-semibold text-charcoal shrink-0">~2.4 km away</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-sage/40 text-[11px]">
              <span className="flex items-center gap-1 text-forest font-semibold">
                <Clock className="w-3 h-3" />
                <span>Safe until {new Date(listing.permitted_handling_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </span>
              {listing.temperature_celsius && (
                <span className="flex items-center gap-1 text-charcoal font-medium">
                  <Thermometer className="w-3 h-3 text-cherry" />
                  <span>{listing.temperature_celsius}°C</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-4 pb-4 pt-1 flex items-center justify-between gap-2 border-t border-sage/40">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPassportClick && onPassportClick(listing);
          }}
          className="text-xs font-bold text-forest hover:text-forest-dark flex items-center gap-1 py-1 px-1.5 rounded hover:bg-forest/5 transition-colors"
        >
          <QrCode className="w-4 h-4 text-orange-warm" />
          <span>Passport</span>
        </button>

        {!hideRequestButton ? (
          <button
            type="button"
            disabled={isFrozen || isExpired}
            onClick={(e) => {
              e.stopPropagation();
              onRequestClick && onRequestClick(listing);
            }}
            className={`px-4 py-2 rounded-subtle font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs ${
              isFrozen || isExpired
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-forest hover:bg-forest-dark text-white'
            }`}
          >
            <span>Request Food</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="text-[10px] font-bold text-forest bg-forest/10 px-2.5 py-1 rounded-full">
            Active Donation Batch
          </span>
        )}
      </div>
    </div>
  );
};
