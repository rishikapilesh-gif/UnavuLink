import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { ShieldCheck, Droplet, Leaf, Utensils, Award, TrendingUp } from 'lucide-react';

const MONTHLY_RESCUE_DATA = [
  { month: 'Jun', kg: 1200, meals: 2800 },
  { month: 'Jul', kg: 1850, meals: 4200 },
  { month: 'Aug', kg: 2400, meals: 5500 },
  { month: 'Sep', kg: 2900, meals: 6600 },
  { month: 'Oct', kg: 3800, meals: 8700 },
  { month: 'Nov (Live)', kg: 4680, meals: 10430 }
];

const DISTRICT_DATA = [
  { district: 'Coimbatore', kg: 6420 },
  { district: 'Salem', kg: 2840 },
  { district: 'Erode', kg: 2150 },
  { district: 'Tiruppur', kg: 1720 },
  { district: 'Chennai', kg: 1150 }
];

const CATEGORY_DATA = [
  { name: 'Cooked Banquet Surplus', value: 58, color: '#2E6B3F' },
  { name: 'Fresh Bakery & Bread', value: 18, color: '#F28C28' },
  { name: 'Hostel Mess Variety Rice', value: 16, color: '#5B7E3C' },
  { name: 'Packaged & Dairy Surplus', value: 8, color: '#1E40AF' }
];

export const ImpactPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-forest uppercase tracking-wider bg-forest/10 px-3 py-1 rounded-full">
          Verified Impact Analytics
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal">
          Measurable Change, Meal by Meal
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          UnavuLink tracks every rescued gram from donor kitchen to shelter table with dual-OTP verification. Environmental offsets are derived from empirical food loss LCA standards.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-card border border-sage shadow-soft space-y-2">
          <div className="flex items-center justify-between text-forest">
            <span className="text-xs font-bold text-muted uppercase">Total Rescued</span>
            <Utensils className="w-5 h-5 text-forest" />
          </div>
          <div className="text-3xl font-extrabold text-charcoal">14,280 kg</div>
          <p className="text-[11px] text-muted flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-status-success" />
            <span className="text-status-success font-bold">+28%</span> this month
          </p>
        </div>

        <div className="bg-white p-5 rounded-card border border-sage shadow-soft space-y-2">
          <div className="flex items-center justify-between text-orange-warm">
            <span className="text-xs font-bold text-muted uppercase">Verified Meals</span>
            <Award className="w-5 h-5 text-orange-warm" />
          </div>
          <div className="text-3xl font-extrabold text-charcoal">31,730</div>
          <p className="text-[11px] text-muted">Confirmed by 24 partner shelters</p>
        </div>

        <div className="bg-white p-5 rounded-card border border-sage shadow-soft space-y-2">
          <div className="flex items-center justify-between text-forest-kelly">
            <span className="text-xs font-bold text-muted uppercase">CO2 Prevented</span>
            <Leaf className="w-5 h-5 text-forest-kelly" />
          </div>
          <div className="text-3xl font-extrabold text-charcoal">28,560 kg</div>
          <p className="text-[11px] text-muted">Methane prevention factor</p>
        </div>

        <div className="bg-white p-5 rounded-card border border-sage shadow-soft space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold text-muted uppercase">Water Conserved</span>
            <Droplet className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-charcoal">4.28 M Litres</div>
          <p className="text-[11px] text-muted">Embedded agricultural water</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Rescue Growth AreaChart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-card border border-sage shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-charcoal">Monthly Rescue Velocity (kg)</h3>
              <p className="text-xs text-muted">Surplus redistribution volume across Tamil Nadu hubs</p>
            </div>
            <span className="text-xs font-semibold text-forest bg-forest/10 px-2.5 py-1 rounded-full">
              Live Verified Data
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_RESCUE_DATA}>
                <defs>
                  <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E6B3F" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2E6B3F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCE5DC" />
                <XAxis dataKey="month" stroke="#68736C" fontSize={12} />
                <YAxis stroke="#68736C" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="kg" stroke="#2E6B3F" strokeWidth={3} fillOpacity={1} fill="url(#colorKg)" name="Rescued (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown PieChart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-card border border-sage shadow-soft space-y-4">
          <div>
            <h3 className="font-bold text-base text-charcoal">Food Category Split</h3>
            <p className="text-xs text-muted">Redistribution composition</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {CATEGORY_DATA.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-muted">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-charcoal font-medium">{c.name}</span>
                </div>
                <span className="font-bold text-charcoal">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* District Distribution BarChart */}
      <div className="bg-white p-6 rounded-card border border-sage shadow-soft space-y-4">
        <div>
          <h3 className="font-bold text-base text-charcoal">District-wise Food Rescue Redistribution</h3>
          <p className="text-xs text-muted">Quantities delivered to verified partner shelters across Tamil Nadu</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DISTRICT_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCE5DC" />
              <XAxis dataKey="district" stroke="#68736C" fontSize={12} />
              <YAxis stroke="#68736C" fontSize={12} />
              <Tooltip />
              <Bar dataKey="kg" fill="#F28C28" radius={[6, 6, 0, 0]} name="Rescued (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Methodology Disclaimer */}
      <div className="bg-sage/20 p-4 rounded-subtle border border-sage text-xs text-muted space-y-1">
        <h4 className="font-bold text-charcoal flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-forest" />
          <span>Verification & Methodology Notes</span>
        </h4>
        <p>
          • <strong>Verified Meals:</strong> 1 portion represents ~400g of balanced cooked food according to ICMR nutritional guidelines.
          • <strong>CO2 Equivalent:</strong> Avoided emissions calculated at 2.0 kg CO2e per 1.0 kg of food diverted from municipal landfills.
          • <strong>Embedded Water:</strong> Calculated based on agricultural footprint of rice, vegetables, and pulses at 300L/kg.
        </p>
      </div>
    </div>
  );
};
