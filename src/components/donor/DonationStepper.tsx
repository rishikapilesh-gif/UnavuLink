import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { analyzeFoodImageDraft } from '../../services/gemini';
import { evaluateSafetyGate } from '../../services/safetyGate';
import { FoodListing } from '../../types';
import { 
  Sparkles, 
  Utensils, 
  Scale, 
  ShieldCheck, 
  MapPin, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Thermometer, 
  Clock, 
  Flame, 
  AlertTriangle,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STEPS = [
  { id: 1, label: 'Food Details', icon: Utensils },
  { id: 2, label: 'Quantity & Portions', icon: Scale },
  { id: 3, label: 'Safety & Storage', icon: ShieldCheck },
  { id: 4, label: 'Pickup & Publish', icon: MapPin }
];

export const DonationStepper: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [foodCategory, setFoodCategory] = useState<FoodListing['food_category']>('Cooked Meals');
  const [dietaryCategory, setDietaryCategory] = useState<FoodListing['dietary_category']>('Vegetarian');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80');

  const [quantity, setQuantity] = useState<number>(30);
  const [unit, setUnit] = useState('kg');
  const [portions, setPortions] = useState<number>(75);

  const [storageInfo, setStorageInfo] = useState('Maintained in insulated hot containers (>65°C)');
  const [temperature, setTemperature] = useState<number>(68);
  const [ingredients, setIngredients] = useState('');
  const [allergens, setAllergens] = useState<string[]>([]);
  const [hoursWindow, setHoursWindow] = useState<number>(4);

  const [pickupLocation, setPickupLocation] = useState(user?.location || 'RS Puram, Coimbatore');
  const [isEmergency, setIsEmergency] = useState(false);
  const [donorCertified, setDonorCertified] = useState(false);

  // AI Assist
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiNote, setAiNote] = useState<string | null>(null);

  const commonAllergens = ['Dairy', 'Nuts', 'Gluten', 'Mustard', 'Soy', 'Eggs'];

  const toggleAllergen = (item: string) => {
    if (allergens.includes(item)) {
      setAllergens(allergens.filter(a => a !== item));
    } else {
      setAllergens([...allergens, item]);
    }
  };

  const handleAiVision = async () => {
    setIsAiAnalyzing(true);
    try {
      const draft = await analyzeFoodImageDraft('mock_food_image');
      setFoodName(draft.suggestedFoodName);
      setFoodCategory(draft.suggestedCategory);
      setDietaryCategory(draft.suggestedDietary);
      setPortions(draft.estimatedPortions);
      setIngredients(draft.detectedIngredients.join(', '));
      setStorageInfo(draft.suggestedStorage);
      setHoursWindow(draft.suggestedHandlingWindowHours);
      setAiNote(draft.aiExplanation);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !foodName.trim()) {
      alert('Please enter the food name before continuing.');
      return;
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorCertified) {
      alert('Please certify the mandatory food safety confirmation.');
      return;
    }

    const now = new Date();
    const deadline = new Date(now.getTime() + hoursWindow * 3600 * 1000).toISOString();
    const batchId = `UNV-${now.getFullYear()}-CBE-${Math.floor(100 + Math.random() * 900)}${isEmergency ? '-EMG' : ''}`;

    const newListing: FoodListing = {
      id: `list-${Date.now()}`,
      batch_id: batchId,
      donor_id: user?.id || 'usr-donor-1',
      donor_name: user?.full_name || 'Annapoorna Kitchen',
      food_name: foodName,
      description: description || `Freshly prepared ${foodName} packaged hygienically.`,
      image_url: imageUrl,
      food_category: foodCategory,
      dietary_category: dietaryCategory,
      quantity: Number(quantity),
      unit: unit,
      estimated_portions: Number(portions),
      preparation_time: new Date(now.getTime() - 40 * 60 * 1000).toISOString(),
      storage_information: storageInfo,
      temperature_celsius: Number(temperature),
      ingredients: ingredients,
      allergens: allergens,
      packaging_information: 'Food grade insulated catering containers',
      handling_information: 'Consume within permitted safety handling window',
      permitted_handling_deadline: deadline,
      pickup_location: pickupLocation,
      latitude: user?.latitude || 11.0123,
      longitude: user?.longitude || 76.9482,
      pickup_start: now.toISOString(),
      pickup_end: new Date(now.getTime() + (hoursWindow - 1) * 3600 * 1000).toISOString(),
      safety_status: 'eligible',
      listing_status: 'available',
      is_emergency: isEmergency,
      created_at: now.toISOString()
    };

    const check = evaluateSafetyGate(newListing);
    newListing.safety_status = check.status;

    store.addListing(newListing);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    navigate('/donor');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Step Progress Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-card border border-sage shadow-soft">
        <div className="flex items-center justify-between relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex-1 flex flex-col items-center relative z-10">
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-forest text-white ring-4 ring-forest/20 shadow-md'
                      : isCompleted
                      ? 'bg-status-success text-white'
                      : 'bg-cream text-muted border border-sage'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </button>
                <span className={`text-[10px] mt-1.5 font-bold tracking-tight text-center ${
                  isCurrent ? 'text-forest' : isCompleted ? 'text-charcoal' : 'text-muted'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Step Form Card */}
      <div className="bg-white rounded-card border border-sage shadow-soft p-6 sm:p-8 text-xs space-y-6">
        {/* STEP 1: FOOD DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-forest tracking-wider">Step 1 of 4</span>
                <h3 className="text-lg font-extrabold text-charcoal">What food are you donating?</h3>
              </div>

              <button
                type="button"
                onClick={handleAiVision}
                disabled={isAiAnalyzing}
                className="px-3 py-1.5 bg-forest/10 hover:bg-forest/20 text-forest border border-forest/30 rounded-subtle font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-4 h-4 text-orange-warm animate-spin-slow" />
                <span>{isAiAnalyzing ? 'Analyzing...' : 'AI Autofill'}</span>
              </button>
            </div>

            {aiNote && (
              <div className="p-3 bg-orange-warm/10 border border-orange-warm/30 rounded-subtle flex items-start gap-2.5 text-xs">
                <Sparkles className="w-4 h-4 text-orange-warm shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-charcoal">Gemini AI Suggested Draft:</span>
                  <p className="text-muted mt-0.5">{aiNote}</p>
                </div>
              </div>
            )}

            <div>
              <label className="font-bold text-charcoal block mb-1">Food Item Name *</label>
              <input
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Traditional Sambar Rice & Assorted Poriyal"
                className="w-full p-3 border border-sage rounded-subtle bg-cream focus:bg-white text-xs font-semibold text-charcoal"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-charcoal block mb-1">Food Category</label>
                <select
                  value={foodCategory}
                  onChange={(e) => setFoodCategory(e.target.value as any)}
                  className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs font-semibold"
                >
                  <option value="Cooked Meals">Cooked Meals (Buffet / Banquet)</option>
                  <option value="Bakery">Bakery & Breads</option>
                  <option value="Raw Produce">Fresh Fruits & Vegetables</option>
                  <option value="Packaged Food">Packaged Staples & Dry Goods</option>
                  <option value="Dairy">Dairy Products</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-charcoal block mb-1">Dietary Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDietaryCategory('Vegetarian')}
                    className={`py-2 px-3 rounded-subtle border font-bold text-center flex items-center justify-center gap-2 ${
                      dietaryCategory === 'Vegetarian'
                        ? 'border-status-success bg-status-success/10 text-status-success'
                        : 'border-sage bg-white text-muted'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-status-success" />
                    <span>Pure Veg</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDietaryCategory('Non-Vegetarian')}
                    className={`py-2 px-3 rounded-subtle border font-bold text-center flex items-center justify-center gap-2 ${
                      dietaryCategory === 'Non-Vegetarian'
                        ? 'border-cherry bg-cherry/10 text-cherry'
                        : 'border-sage bg-white text-muted'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-cherry" />
                    <span>Non-Veg</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-charcoal block mb-1">Short Description / Menu Items</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention specific dishes, sides, and freshness details..."
                className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 2: QUANTITY & PORTIONS */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className="text-[10px] font-bold uppercase text-forest tracking-wider">Step 2 of 4</span>
              <h3 className="text-lg font-extrabold text-charcoal">How much food is available?</h3>
              <p className="text-muted text-xs">Accurate portion estimation allows the FairShare engine to match suitable shelters.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-charcoal block mb-1">Weight / Quantity *</label>
                <div className="flex">
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => {
                      const q = Number(e.target.value);
                      setQuantity(q);
                      setPortions(Math.round(q * 2.5)); // Auto portion estimate
                    }}
                    className="w-2/3 p-3 border border-r-0 border-sage rounded-l-subtle bg-cream font-extrabold text-sm text-charcoal"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-1/3 p-3 border border-sage rounded-r-subtle bg-white text-xs font-bold"
                  >
                    <option value="kg">kg</option>
                    <option value="portions">meals</option>
                    <option value="boxes">boxes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-charcoal block mb-1">Estimated Servings (Meals) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={portions}
                  onChange={(e) => setPortions(Number(e.target.value))}
                  className="w-full p-3 border border-sage rounded-subtle bg-cream font-extrabold text-sm text-forest"
                />
              </div>
            </div>

            {/* Quick Quantity Presets */}
            <div>
              <span className="text-[11px] font-semibold text-muted block mb-1.5">Common Banquet Batch Sizes:</span>
              <div className="flex flex-wrap gap-2">
                {[15, 30, 60, 100, 200].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setQuantity(amt);
                      setPortions(Math.round(amt * 2.5));
                    }}
                    className={`px-3 py-1.5 rounded-subtle font-bold border ${
                      quantity === amt ? 'bg-forest text-white border-forest' : 'bg-cream text-charcoal border-sage'
                    }`}
                  >
                    {amt} kg (~{Math.round(amt * 2.5)} meals)
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SAFETY & STORAGE */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className="text-[10px] font-bold uppercase text-forest tracking-wider">Step 3 of 4</span>
              <h3 className="text-lg font-extrabold text-charcoal">Food Safety & Holding Conditions</h3>
              <p className="text-muted text-xs">Essential parameters required to pass the FSSAI Safety Eligibility Gate.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-charcoal block mb-1">Measured Temperature (°C)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream font-bold text-cherry"
                  />
                  <Thermometer className="w-4 h-4 text-cherry absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="font-bold text-charcoal block mb-1">Holding Standard</label>
                <input
                  type="text"
                  value={storageInfo}
                  onChange={(e) => setStorageInfo(e.target.value)}
                  placeholder="e.g. Insulated hot box (>65°C)"
                  className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-charcoal block mb-1">Permitted Safe Window (Hours)</label>
              <div className="flex gap-2">
                {[2, 3, 4, 6].map(hrs => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setHoursWindow(hrs)}
                    className={`flex-1 py-2 rounded-subtle font-bold border transition-colors ${
                      hoursWindow === hrs
                        ? 'bg-forest text-white border-forest'
                        : 'bg-cream text-charcoal border-sage'
                    }`}
                  >
                    {hrs} Hours
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-charcoal block mb-1">Declared Allergens</label>
              <div className="flex flex-wrap gap-2">
                {commonAllergens.map(alg => {
                  const active = allergens.includes(alg);
                  return (
                    <button
                      key={alg}
                      type="button"
                      onClick={() => toggleAllergen(alg)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        active
                          ? 'bg-cherry text-white'
                          : 'bg-cream text-charcoal border border-sage'
                      }`}
                    >
                      {alg}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PICKUP & PUBLISH */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className="text-[10px] font-bold uppercase text-forest tracking-wider">Step 4 of 4</span>
              <h3 className="text-lg font-extrabold text-charcoal">Pickup Location & Verification</h3>
              <p className="text-muted text-xs">Review collection details before generating the QR Safety Passport.</p>
            </div>

            <div>
              <label className="font-bold text-charcoal block mb-1">Kitchen / Banquet Address *</label>
              <input
                type="text"
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full p-3 border border-sage rounded-subtle bg-cream font-semibold text-charcoal"
              />
            </div>

            {/* Emergency Toggle */}
            <div className="p-3.5 bg-cherry/5 border border-cherry/20 rounded-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-cherry" />
                <div>
                  <span className="font-bold text-charcoal block">Emergency Bulk Surplus Rescue</span>
                  <span className="text-[11px] text-muted">Broadcast to all nearby community kitchens immediately.</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="w-4 h-4 rounded text-cherry focus:ring-cherry"
              />
            </div>

            {/* FSSAI Declaration Check */}
            <div className="p-3.5 bg-forest/5 rounded-subtle border border-forest/30 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="fssaiCert"
                required
                checked={donorCertified}
                onChange={(e) => setDonorCertified(e.target.checked)}
                className="mt-0.5 rounded text-forest focus:ring-forest"
              />
              <label htmlFor="fssaiCert" className="text-xs text-charcoal cursor-pointer leading-relaxed">
                <strong>Mandatory Safety Declaration:</strong> I confirm this surplus food was cooked under certified hygienic standards, stored at declared temperatures, and is fit for community consumption.
              </label>
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-sage">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 border border-sage rounded-subtle font-bold text-charcoal hover:bg-cream flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold flex items-center gap-1.5 shadow-md transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-orange-warm" />
              <span>Publish & Generate Passport</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
