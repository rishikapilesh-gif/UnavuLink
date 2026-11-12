import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { ShieldCheck, UserPlus, Info } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('Common People');
  const [city, setCity] = useState('Coimbatore');
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('Restaurant');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      full_name: fullName,
      email: email,
      phone: phone,
      role: role,
      city: city,
      is_volunteer: isVolunteer
    });

    switch (role) {
      case 'Donor': navigate('/donor'); break;
      case 'NGO': navigate('/ngo'); break;
      case 'Acceptor': navigate('/acceptor'); break;
      default: navigate('/community'); break;
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 px-4">
      <div className="bg-white rounded-card shadow-lift border border-sage p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-charcoal">Create Your UnavuLink Account</h1>
          <p className="text-xs text-muted">Join the decentralized food rescue network in Tamil Nadu.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-charcoal mb-1">Full Name / Primary Contact</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Anand Murugesan"
              className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-charcoal mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anand@example.com"
                className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-charcoal mb-1">Mobile Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98422 12345"
                className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-charcoal mb-1">Select Primary Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs"
              >
                <option value="Common People">Common People (Public / Volunteer)</option>
                <option value="Donor">Food Donor (Restaurant / Catering)</option>
                <option value="NGO">NGO / Shelter / Community Kitchen</option>
                <option value="Acceptor">Food Acceptor (Designated Recipient)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-charcoal mb-1">Primary District</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs"
              >
                <option value="Coimbatore">Coimbatore</option>
                <option value="Salem">Salem</option>
                <option value="Erode">Erode</option>
                <option value="Tiruppur">Tiruppur</option>
                <option value="Chennai">Chennai</option>
                <option value="Madurai">Madurai</option>
                <option value="Tiruchirappalli">Tiruchirappalli</option>
              </select>
            </div>
          </div>

          {/* Conditional Org Fields */}
          {(role === 'Donor' || role === 'NGO') && (
            <div className="p-3 bg-cream rounded-subtle border border-sage space-y-3">
              <span className="font-bold text-forest block">Organisation Verification Information</span>
              <div>
                <label className="block font-medium text-muted mb-1">Organisation / Brand Name</label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Sri Krishna Caterers or Karunai Illam"
                  className="w-full p-2 border border-sage rounded-subtle bg-white text-xs"
                />
              </div>
            </div>
          )}

          {/* Volunteer Checkbox for Common People */}
          {role === 'Common People' && (
            <div className="flex items-start gap-2.5 p-3 bg-forest/5 rounded-subtle border border-forest/20">
              <input
                type="checkbox"
                id="volCheck"
                checked={isVolunteer}
                onChange={(e) => setIsVolunteer(e.target.checked)}
                className="mt-0.5 rounded text-forest focus:ring-forest"
              />
              <label htmlFor="volCheck" className="text-xs text-charcoal cursor-pointer">
                <strong>Register my interest as a Rescue Volunteer.</strong>
                <span className="block text-[11px] text-muted">
                  Help transport surplus food from banquets to local shelters. Admin approval required for task dispatch.
                </span>
              </label>
            </div>
          )}

          <div className="p-2.5 bg-sage/20 border border-sage rounded-subtle text-[11px] text-muted flex items-start gap-2">
            <Info className="w-4 h-4 text-forest shrink-0 mt-0.5" />
            <span>
              <strong>Security Policy:</strong> Admin privileges cannot be assigned via public sign up. Donor & NGO publishing permissions activate upon automated document check.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Complete Registration</span>
          </button>
        </form>

        <div className="text-center text-xs text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-forest font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
