import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { analyzeFoodImageDraft } from '../../services/gemini';
import { evaluateSafetyGate } from '../../services/safetyGate';
import { FoodListing } from '../../types';
import { 
  Sparkles, 
  Upload, 
  ShieldCheck, 
  Clock, 
  Thermometer, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DonateFoodPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [foodCategory, setFoodCategory] = useState<FoodListing['food_category']>('Cooked Meals');
  const [dietaryCategory, setDietaryCategory] = useState<FoodListing['dietary_category']>('Vegetarian');
  const [quantity, setQuantity] = useState<number>(30);
  const [unit, setUnit] = useState('kg');
  const [portions, setPortions] = useState<number>(70);
  const [storageInfo, setStorageInfo] = useState('Maintained in insulated hot containers (>65°C)');
  const [temperature, setTemperature] = useState<number>(68);
  const [ingredients, setIngredients] = useState('');
  const [allergens, setAllergens] = useState<string[]>([]);
  const [pickupLocation, setPickupLocation] = useState(user?.location || 'RS Puram, Coimbatore');
  const [isEmergency, setIsEmergency] = useState(false);
  const [hoursWindow, setHoursWindow] = useState<number>(4);
  const [donorCertified, setDonorCertified] = useState(false);

  // AI Vision State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  // Common Allergens checklist
  const commonAllergens = ['Dairy', 'Nuts', 'Gluten', 'Mustard', 'Soy', 'Eggs'];

  const toggleAllergen = (item: string) => {
    if (allergens.includes(item)) {
      setAllergens(allergens.filter(a => a !== item));
    } else {
      setAllergens([...allergens, item]);
    }
  };

  // Trigger Gemini Vision Draft Extraction
  const handleAiVisionAssist = async () => {
    setIsAiAnalyzing(true);
    try {
      const draft = await analyzeFoodImageDraft('mock_image_data');
      setFoodName(draft.suggestedFoodName);
      setFoodCategory(draft.suggestedCategory);
      setDietaryCategory(draft.suggestedDietary);
      setPortions(draft.estimatedPortions);
      setIngredients(draft.detectedIngredients.join(', '));
      setStorageInfo(draft.suggestedStorage);
      setHoursWindow(draft.suggestedHandlingWindowHours);
      setAiAnalysisResult(draft.aiExplanation);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorCertified) {
      alert('Please confirm the mandatory food safety verification checkbox before publishing.');
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
      food_category: foodCategory,
      dietary_category: dietaryCategory,
      quantity: Number(quantity),
      unit: unit,
      estimated_portions: Number(portions),
      preparation_time: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
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

    // Run Safety Gate
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-forest uppercase tracking-wider">Donor Portal</span>
          <h1 className="text-2xl font-extrabold text-charcoal">Post Food Rescue Donation</h1>
          <p className="text-xs text-muted">
            Register surplus food, verify safety specifications and generate an immediate QR Food Safety Passport.
          </p>
        </div>

        {/* AI Assist Action Button */}
        <button
          type="button"
          onClick={handleAiVisionAssist}
          disabled={isAiAnalyzing}
          className="px-4 py-2.5 bg-forest/10 hover:bg-forest/20 text-forest border border-forest/30 rounded-subtle font-bold text-xs flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-orange-warm animate-spin-slow" />
          <span>{isAiAnalyzing ? 'Gemini Vision Analyzing...' : 'AI Assist via Gemini Vision'}</span>
        </button>
      </div>

      {/* AI Analysis Feedback Pill */}
      {aiAnalysisResult && (
        <div className="p-3.5 bg-orange-warm/10 border border-orange-warm/30 rounded-subtle text-xs flex items-start gap-3 animate-in fade-in">
          <Sparkles className="w-5 h-5 text-orange-warm shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-charcoal">Gemini Vision Pre-Filled Draft:</span>
            <p className="text-muted mt-0.5">{aiAnalysisResult}</p>
            <p className="text-[11px] text-forest font-semibold mt-1">
              Please inspect and verify all draft values below before publishing.
            </p>
          </div>
        </div>
      )}

      {/* Main Donation Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-card shadow-soft border border-sage p-6 sm:p-8 space-y-6 text-xs">
        {/* Emergency Bulk Surplus Switch */}
        <div className="flex items-center justify-between p-3.5 bg-cherry/5 border border-cherry/20 rounded-subtle">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-cherry" />
            <div>
              <span className="font-bold text-charcoal block">Emergency Bulk Surplus Dispatch</span>
              <span className="text-[11px] text-muted">For cancelled weddings, massive catering overflows, or rapid disaster response.</span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEmergency}
              onChange={(e) => setIsEmergency(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cherry"></div>
          </label>
        </div>

        {/* Section 1: Food Details */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-charcoal border-b border-sage/60 pb-2 flex items-center gap-2">
            <span>1. Food Classification & Portions</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-charcoal mb-1">Food Item Name *</label>
              <input
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Sambar Rice & Veg Kurma"
                className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal mb-1">Food Category</label>
              <select
                value={foodCategory}
                onChange={(e) => setFoodCategory(e.target.value as any)}
                className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs"
              >
                <option value="Cooked Meals">Cooked Meals (Buffet / Banquet)</option>
                <option value="Bakery">Bakery & Breads</option>
                <option value="Raw Produce">Raw Produce (Fruits / Veg)</option>
                <option value="Packaged Food">Packaged Non-Perishables</option>
                <option value="Dairy">Dairy / Milk Products</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-charcoal mb-1">Dietary Classification</label>
              <select
                value={dietaryCategory}
                onChange={(e) => setDietaryCategory(e.target.value as any)}
                className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs font-semibold"
              >
                <option value="Vegetarian">Pure Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Jain">Jain (No Root Veg)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-charcoal mb-1">Weight / Quantity *</label>
              <div className="flex">
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-2/3 p-2.5 border border-r-0 border-sage rounded-l-subtle bg-cream focus:bg-white text-xs font-bold"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-1/3 p-2.5 border border-sage rounded-r-subtle bg-white text-xs"
                >
                  <option value="kg">kg</option>
                  <option value="portions">portions</option>
                  <option value="boxes">boxes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-charcoal mb-1">Estimated Servings (Meals) *</label>
              <input
                type="number"
                min="1"
                required
                value={portions}
                onChange={(e) => setPortions(Number(e.target.value))}
                className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Safety & Storage */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-charcoal border-b border-sage/60 pb-2 flex items-center gap-2">
            <span>2. Safety Gate & Holding Conditions</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-charcoal mb-1">Storage Condition Details</label>
              <input
                type="text"
                value={storageInfo}
                onChange={(e) => setStorageInfo(e.target.value)}
                placeholder="e.g. Insulated thermal containers (>65°C)"
                className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal mb-1">Measured Temperature (°C)</label>
              <div className="relative">
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs font-bold"
                />
                <Thermometer className="w-4 h-4 text-cherry absolute right-3 top-2.5" />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal mb-1">Permitted Safe Handling Window (Hours from Now)</label>
            <div className="flex items-center gap-3">
              {[2, 3, 4, 6].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setHoursWindow(hrs)}
                  className={`px-3 py-1.5 rounded-subtle font-semibold transition-all ${
                    hoursWindow === hrs
                      ? 'bg-forest text-white'
                      : 'bg-cream text-charcoal border border-sage'
                  }`}
                >
                  {hrs} Hours Safe Window
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal mb-1">Declared Allergens</label>
            <div className="flex flex-wrap gap-2">
              {commonAllergens.map((alg) => {
                const active = allergens.includes(alg);
                return (
                  <button
                    key={alg}
                    type="button"
                    onClick={() => toggleAllergen(alg)}
                    className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                      active
                        ? 'bg-cherry text-white font-bold'
                        : 'bg-cream border border-sage text-charcoal'
                    }`}
                  >
                    {alg}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Pickup Location */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-charcoal border-b border-sage/60 pb-2">
            3. Collection & Handover Location
          </h3>

          <div>
            <label className="block font-semibold text-charcoal mb-1">Pickup Address / Premises</label>
            <input
              type="text"
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
            />
          </div>
        </div>

        {/* Mandatory Donor Certification Check */}
        <div className="p-3.5 bg-forest/5 rounded-subtle border border-forest/30 flex items-start gap-2.5">
          <input
            type="checkbox"
            id="certCheck"
            required
            checked={donorCertified}
            onChange={(e) => setDonorCertified(e.target.checked)}
            className="mt-0.5 rounded text-forest focus:ring-forest"
          />
          <label htmlFor="certCheck" className="text-xs text-charcoal cursor-pointer leading-relaxed">
            <strong>Mandatory FSSAI Food Safety Declaration:</strong> I hereby declare that this surplus food was prepared under hygienic conditions, stored at compliant temperatures, and contains no known hazards beyond declared allergens.
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-orange-warm" />
            <span>Publish Food Rescue & Generate QR Passport</span>
          </button>
        </div>
      </form>
    </div>
  );
};
