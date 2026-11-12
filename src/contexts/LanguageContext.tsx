import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const DICTIONARY: Record<string, { en: string; ta: string }> = {
  // Brand
  'app.name': { en: 'UnavuLink', ta: 'உணவுலிங்க்' },
  'app.tagline': { en: 'Predicting Surplus. Prioritising Need. Delivering Food Safely.', ta: 'உணவு உபரியை கணித்தல். தேவையை முன்னிறுத்துதல். பாதுகாப்பாக வழங்குதல்.' },
  'app.statement': { en: 'Every Meal Deserves a Destination.', ta: 'ஒவ்வொரு உணவிற்கும் ஒரு இலக்கு உண்டு.' },
  
  // Navigation
  'nav.home': { en: 'Home', ta: 'முகப்பு' },
  'nav.howItWorks': { en: 'How It Works', ta: 'எப்படி இயங்குகிறது' },
  'nav.exploreFood': { en: 'Explore Food', ta: 'உணவு பட்டியல்' },
  'nav.communityMap': { en: 'Community Map', ta: 'சமூக வரைபடம்' },
  'nav.liveImpact': { en: 'Live Impact', ta: 'நேரடி தாக்கம்' },
  'nav.dashboard': { en: 'Dashboard', ta: 'டாஷ்போர்டு' },
  'nav.donateFood': { en: 'Donate Food', ta: 'உணவு தானம் செய்' },
  'nav.myListings': { en: 'My Listings', ta: 'என் பதிவுகள்' },
  'nav.rescueTracking': { en: 'Rescue Tracking', ta: 'மீட்பு கண்காணிப்பு' },
  'nav.reportWaste': { en: 'Report Food Waste', ta: 'உணவு விரயத்தை புகாரளி' },
  'nav.login': { en: 'Sign In', ta: 'உள்நுழைக' },
  'nav.register': { en: 'Register', ta: 'பதிவு செய்க' },
  'nav.logout': { en: 'Sign Out', ta: 'வெளியேறு' },

  // Role names
  'role.admin': { en: 'Admin Command', ta: 'நிர்வாக மையம்' },
  'role.donor': { en: 'Food Donor', ta: 'உணவு வழங்குபவர்' },
  'role.acceptor': { en: 'Food Acceptor', ta: 'உணவு பெறுபவர்' },
  'role.ngo': { en: 'NGO & Shelters', ta: 'தன்னார்வ தொண்டு நிறுவனம்' },
  'role.common': { en: 'Common People', ta: 'பொது மக்கள்' },
  'role.volunteer': { en: 'Verified Volunteer', ta: 'சரிபார்க்கப்பட்ட தொண்டர்' },

  // Actions
  'action.donate': { en: 'Donate Food', ta: 'உணவு வழங்க' },
  'action.findFood': { en: 'Find Food', ta: 'உணவை கண்டறிக' },
  'action.joinVolunteer': { en: 'Become a Volunteer', ta: 'தன்னார்வலராக இணை' },
  'action.emergencyMode': { en: 'Emergency Surplus Rescue', ta: 'அவசர உணவு மீட்பு முறைமை' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    if (DICTIONARY[key]) {
      return DICTIONARY[key][language] || DICTIONARY[key].en;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
