import React, { useState } from 'react';
import { FoodListing, DonationRequest } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { 
  X, 
  Utensils, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Minus, 
  Plus, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RequestModalProps {
  listing: FoodListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (req: DonationRequest) => void;
}

export const RequestModal: React.FC<RequestModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  if (!isOpen || !listing) return null;

  const [quantity, setQuantity] = useState<number>(Math.min(25, listing.quantity));
  const [selectedOrg, setSelectedOrg] = useState('Anbalayam Children Shelter & Care');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState<string>('');

  // Calculate estimated meals requested proportionally
  const portionsRatio = listing.quantity > 0 ? listing.estimated_portions / listing.quantity : 2.5;
  const requestedMeals = Math.round(quantity * portionsRatio);

  const handleQuickPercent = (percent: number) => {
    const val = Math.max(1, Math.round((listing.quantity * percent) / 100));
    setQuantity(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reqId = `REQ-${Date.now().toString().slice(-6)}`;
    const newRequest: DonationRequest = {
      id: reqId,
      food_listing_id: listing.id,
      requester_id: user?.id || 'usr-acceptor-1',
      requester_name: user?.full_name || 'Shelter Intake Officer',
      organization_name: selectedOrg,
      requested_quantity: quantity,
      request_status: 'pending',
      donor_response_notes: notes,
      created_at: new Date().toISOString()
    };

    store.addRequest(newRequest);
    setCreatedRequestId(reqId);
    setIsSubmitted(true);

    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 }
    });

    if (onSuccess) onSuccess(newRequest);
  };

  return (
    <div className="fixed inset-0 z-[9995] flex items-center justify-center bg-charcoal/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-card shadow-lift max-w-lg w-full border border-sage overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-forest text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-orange-warm" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Request Food Allocation</h3>
              <p className="text-[11px] text-forest-light">Direct shelter dispatch request</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsSubmitted(false);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
            {/* Food Summary Pill */}
            <div className="p-3 bg-cream rounded-subtle border border-sage flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-forest font-bold">{listing.batch_id}</span>
                <h4 className="font-bold text-sm text-charcoal">{listing.food_name}</h4>
                <p className="text-[11px] text-muted">{listing.pickup_location}</p>
              </div>
              <span className="font-extrabold text-sm text-charcoal bg-white px-2.5 py-1 rounded border border-sage">
                {listing.quantity} {listing.unit} total
              </span>
            </div>

            {/* Quantity Stepper (Swiggy-style) */}
            <div className="space-y-2">
              <label className="font-bold text-charcoal block">How much food do you need?</label>
              
              <div className="flex items-center justify-between bg-cream p-3 rounded-subtle border border-sage">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 5))}
                    className="w-9 h-9 rounded-full bg-white border border-sage text-charcoal font-extrabold flex items-center justify-center hover:bg-sage/40 transition-colors shadow-2xs"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="text-center min-w-[80px]">
                    <span className="text-xl font-extrabold text-charcoal block">{quantity} {listing.unit}</span>
                    <span className="text-[11px] text-forest font-semibold">~{requestedMeals} Meals</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(listing.quantity, quantity + 5))}
                    className="w-9 h-9 rounded-full bg-white border border-sage text-charcoal font-extrabold flex items-center justify-center hover:bg-sage/40 transition-colors shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Selection Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {[25, 50, 100].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleQuickPercent(p)}
                      className="px-2 py-1 bg-white border border-sage text-[10px] font-bold rounded hover:bg-sage/40 text-muted"
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Receiving Organization */}
            <div className="space-y-1.5">
              <label className="font-bold text-charcoal block">Receiving Shelter / Organization</label>
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs font-semibold"
              >
                <option value="Anbalayam Children Shelter & Care">Anbalayam Children Shelter & Care (Saibaba Colony)</option>
                <option value="Karunai Illam Destitute Shelter">Karunai Illam Destitute Shelter (Ramanathapuram)</option>
                <option value="Ukkadam Community Feeding Center">Ukkadam Community Feeding Center (Ukkadam)</option>
                <option value="Coimbatore Lions Community Fridge">Coimbatore Lions Community Fridge (VOC Park)</option>
              </select>
            </div>

            {/* Special Instructions */}
            <div className="space-y-1.5">
              <label className="font-bold text-charcoal block">Logistics Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Need immediate delivery before 1:30 PM lunch service..."
                className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
              />
            </div>

            {/* Trust Notice */}
            <div className="bg-forest/5 p-3 rounded-subtle border border-forest/20 flex items-start gap-2 text-muted text-[11px]">
              <ShieldCheck className="w-4 h-4 text-forest shrink-0 mt-0.5" />
              <span>
                <strong>Zero-Waste Promise:</strong> Your request directly notifies the donor kitchen. Upon donor confirmation, a verified volunteer will be dispatched immediately.
              </span>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-sage bg-white hover:bg-cream rounded-subtle font-semibold text-charcoal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold flex items-center gap-2 shadow-xs"
              >
                <span>Confirm Request ({quantity} {listing.unit})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Success Screen */
          <div className="p-8 text-center space-y-4 text-xs animate-in fade-in">
            <div className="w-14 h-14 bg-status-success/15 text-status-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-forest uppercase tracking-wider block">
                Request ID: {createdRequestId}
              </span>
              <h3 className="text-xl font-extrabold text-charcoal">Your Food Request is Submitted!</h3>
              <p className="text-muted max-w-sm mx-auto">
                Requested <strong>{quantity} {listing.unit}</strong> of <strong>{listing.food_name}</strong> for {selectedOrg}.
              </p>
            </div>

            <div className="p-4 bg-cream rounded-subtle border border-sage text-left space-y-2 max-w-sm mx-auto">
              <div className="flex items-center justify-between">
                <span className="text-muted">Status:</span>
                <span className="font-bold text-orange-warm bg-orange-warm/15 px-2 py-0.5 rounded-full">
                  Pending Donor Approval
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Next Step:</span>
                <span className="font-semibold text-charcoal">Donor notification dispatched</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-forest text-white rounded-subtle font-bold hover:bg-forest-dark transition-all"
            >
              Back to Available Food
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
