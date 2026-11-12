import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../../services/store';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  CheckCheck, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Clock, 
  PhoneCall, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  Mic
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    route?: string;
    onClick?: () => void;
  };
  details?: {
    batchId?: string;
    status?: string;
    portions?: number;
    location?: string;
  };
}

const PERSONA_QUICK_CHIPS = [
  { id: 'all', label: '🌟 All Questions' },
  { id: 'donor', label: '🍲 Donor: Donate Food' },
  { id: 'ngo', label: '🤝 NGO: Request & Track' },
  { id: 'volunteer', label: '🛵 Volunteer: Missions & OTP' },
  { id: 'citizen', label: '📍 Public: Nearby Free Meals' },
  { id: 'safety', label: '🛡️ FSSAI Thermal Rules' }
];

export const WhatsAppAssistantModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePersona, setActivePersona] = useState('all');
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Vanakkam! 🙏 I am UnavuLink’s WhatsApp Food Assistance Bot for Tamil Nadu. How can I help you today?',
      timestamp: '10:30 AM'
    },
    {
      id: 'm2',
      sender: 'bot',
      text: 'Choose a quick action below or type any question regarding food donation, live delivery tracking, or community fridges.',
      timestamp: '10:30 AM'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const addBotResponse = (text: string, action?: ChatMessage['action'], details?: ChatMessage['details']) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text,
          timestamp: time,
          action,
          details
        }
      ]);
    }, 400);
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: time
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    const q = query.toLowerCase();

    // Natural Language Query Matching
    if (q.includes('donate') || q.includes('surplus') || q.includes('food to give')) {
      addBotResponse(
        'Excellent! UnavuLink connects your surplus kitchen food with verified nearby shelters in under 3 minutes.',
        {
          label: 'Launch 4-Step Donation Stepper',
          route: '/donor/donate'
        }
      );
    } else if (q.includes('track') || q.includes('delivery') || q.includes('mission') || q.includes('status')) {
      const activeMission = store.getMissions()[0];
      addBotResponse(
        `Active rescue in progress: Batch ${activeMission.batch_id} (${activeMission.food_name}). Volunteer ${activeMission.volunteer_name} is in transit with ETA ~${activeMission.estimated_duration_mins} mins.`,
        {
          label: 'Open Live OSRM Delivery Tracker',
          route: '/tracking'
        },
        {
          batchId: activeMission.batch_id,
          status: activeMission.mission_status,
          location: activeMission.delivery_address
        }
      );
    } else if (q.includes('otp') || q.includes('dual otp') || q.includes('handover')) {
      addBotResponse(
        'Dual OTP Protocol: Donor provides the 6-digit Pickup OTP to the volunteer at collection. The receiving shelter gives the Delivery OTP at drop-off. This guarantees unbroken custody!'
      );
    } else if (q.includes('fssai') || q.includes('temp') || q.includes('safe') || q.includes('hazard')) {
      addBotResponse(
        'FSSAI Safe Food Standards:\n• Hot Cooked Food: Maintain >60°C\n• Chilled / Cold Food: Maintain <4°C\n• Room Temp Window: Maximum 2 hours consumption limit\nBatches in danger zones (5°C - 60°C) are quarantined by our Safety Gate.'
      );
    } else if (q.includes('fridge') || q.includes('hub') || q.includes('free meal') || q.includes('nearby')) {
      const city = store.getSelectedCity();
      addBotResponse(
        `Displaying active surplus batches and community refrigeration hubs in ${city}. You can filter dietary preferences on our interactive map.`,
        {
          label: `View ${city} Food Map`,
          route: '/map'
        }
      );
    } else if (q.includes('volunteer') || q.includes('rider') || q.includes('help deliver')) {
      addBotResponse(
        'Volunteers are the backbone of UnavuLink! Join our vetted logistics fleet to earn community impact badges and rescue meals in your spare time.',
        {
          label: 'Register as Rescue Volunteer',
          route: '/register'
        }
      );
    } else if (q.includes('twin') || q.includes('simulat') || q.includes('crisis')) {
      addBotResponse(
        'Our Predictive Digital Twin engine stress-tests food reallocation against road bottlenecks and sudden volunteer drops.',
        {
          label: 'Open Digital Twin Simulator',
          route: '/admin/digital-twin'
        }
      );
    } else {
      addBotResponse(
        `Thank you for messaging! You can donate food, track an active rescue, or discover verified community shelters across Tamil Nadu.`,
        {
          label: 'Explore Available Food',
          route: '/'
        }
      );
    }
  };

  const executeAction = (action: ChatMessage['action']) => {
    if (!action) return;
    if (action.route) {
      setIsOpen(false);
      navigate(action.route);
    } else if (action.onClick) {
      action.onClick();
    }
  };

  return (
    <>
      {/* Floating WhatsApp Action Pill */}
      {!isOpen && (
        <aside 
          aria-label="WhatsApp Assistant"
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[600] flex items-center gap-2 group"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-3 rounded-full shadow-lift hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 active:scale-95"
            title="Open UnavuLink WhatsApp Assistant"
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5 fill-current" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-warm rounded-full animate-ping" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold leading-tight">WhatsApp FoodBot</div>
              <div className="text-[10px] text-white/90 leading-tight">Tamil Nadu Live Help</div>
            </div>
          </button>
        </aside>
      )}

      {/* WhatsApp Modal Window */}
      {isOpen && (
        <aside 
          aria-label="WhatsApp Assistant Window"
          className="fixed bottom-4 right-4 z-[9999] w-[95vw] sm:w-[380px] h-[550px] bg-[#EFEAE2] rounded-2xl shadow-2xl border border-sage/60 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        >
          {/* Authentic WhatsApp Green Header */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src="/logo/unavulink-icon.svg"
                  alt="Bot"
                  className="w-9 h-9 rounded-full bg-white p-0.5 border border-white/40"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] border-2 border-[#075E54] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold leading-tight">UnavuLink Bot</h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                </div>
                <p className="text-[10px] text-white/80 leading-tight">State Rescue Hub • online</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/90">
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Persona Filter Chips */}
          <div className="bg-[#128C7E]/10 p-2 border-b border-sage/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {PERSONA_QUICK_CHIPS.map(chip => (
              <button
                key={chip.id}
                onClick={() => setActivePersona(chip.id)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                  activePersona === chip.id
                    ? 'bg-[#075E54] text-white shadow-xs'
                    : 'bg-white text-charcoal hover:bg-cream border border-sage/50'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Encryption notice */}
            <div className="text-center my-1">
              <span className="inline-block bg-[#FFF3C4] text-[#856404] text-[10px] px-3 py-1 rounded-lg shadow-2xs max-w-[90%] leading-tight border border-[#FFEEBA]">
                🔒 Messages are end-to-end encrypted & FSSAI food safety audited.
              </span>
            </div>

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 shadow-xs space-y-1.5 ${
                    msg.sender === 'user'
                      ? 'bg-[#E7FFDB] text-charcoal rounded-tr-none'
                      : 'bg-white text-charcoal rounded-tl-none border border-sage/30'
                  }`}
                >
                  <p className="text-xs leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {/* Optional Action Pill / Card */}
                  {msg.action && (
                    <div className="pt-1">
                      <button
                        onClick={() => executeAction(msg.action)}
                        className="w-full bg-[#075E54] hover:bg-[#128C7E] text-white font-extrabold text-[11px] py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <span>{msg.action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Timestamp & Double Ticks */}
                  <div className="flex items-center justify-end gap-1 text-[9px] text-muted pt-0.5">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'user' && (
                      <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Suggestions based on Persona */}
          <div className="bg-white/80 p-2 border-t border-sage/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {activePersona === 'donor' && (
              <>
                <button
                  onClick={() => handleSend('I have 50 hot meals from a marriage hall in Coimbatore')}
                  className="bg-cream hover:bg-forest/10 text-forest text-[10px] font-bold px-2.5 py-1 rounded-full border border-forest/30 whitespace-nowrap"
                >
                  🍲 Donate 50 meals
                </button>
                <button
                  onClick={() => handleSend('What is the FSSAI temperature rule for cooked food?')}
                  className="bg-cream hover:bg-forest/10 text-forest text-[10px] font-bold px-2.5 py-1 rounded-full border border-forest/30 whitespace-nowrap"
                >
                  🌡️ FSSAI temp check
                </button>
              </>
            )}

            {activePersona === 'ngo' && (
              <>
                <button
                  onClick={() => handleSend('Need 60 dinner meals for Ukkadam shelter')}
                  className="bg-cream hover:bg-forest/10 text-forest text-[10px] font-bold px-2.5 py-1 rounded-full border border-forest/30 whitespace-nowrap"
                >
                  🙋 Request 60 meals
                </button>
                <button
                  onClick={() => handleSend('Track active incoming food delivery')}
                  className="bg-cream hover:bg-forest/10 text-forest text-[10px] font-bold px-2.5 py-1 rounded-full border border-forest/30 whitespace-nowrap"
                >
                  🚚 Track incoming
                </button>
              </>
            )}

            {activePersona === 'volunteer' && (
              <>
                <button
                  onClick={() => handleSend('How does the Dual OTP verification work?')}
                  className="bg-cream hover:bg-forest/10 text-forest text-[10px] font-bold px-2.5 py-1 rounded-full border border-forest/30 whitespace-nowrap"
                >
                  🔑 Dual OTP guide
                </button>
                <button
                  onClick={() => handleSend('Show active rescue missions near me')}
                  className="bg-cream hover:bg-forest/10 text-forest text-[10px] font-bold px-2.5 py-1 rounded-full border border-forest/30 whitespace-nowrap"
                >
                  🛵 Active missions
                </button>
              </>
            )}

            {(activePersona === 'all' || activePersona === 'citizen') && (
              <>
                <button
                  onClick={() => handleSend('Where can I find free surplus food today?')}
                  className="bg-cream hover:bg-forest/10 text-forest text-[10px] font-bold px-2.5 py-1 rounded-full border border-forest/30 whitespace-nowrap"
                >
                  📍 Find nearby food
                </button>
                <button
                  onClick={() => handleSend('How do community fridges work in Tamil Nadu?')}
                  className="bg-cream hover:bg-forest/10 text-forest text-[10px] font-bold px-2.5 py-1 rounded-full border border-forest/30 whitespace-nowrap"
                >
                  ❄️ Community fridges
                </button>
              </>
            )}

            {activePersona === 'safety' && (
              <button
                onClick={() => handleSend('Explain FSSAI temperature hazard zones')}
                className="bg-cream hover:bg-forest/10 text-forest text-[10px] font-bold px-2.5 py-1 rounded-full border border-forest/30 whitespace-nowrap"
              >
                🌡️ Hazard zone rules
              </button>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="bg-[#F0F2F5] px-3 py-2 border-t border-sage/50 flex items-center gap-2 shrink-0">
            <button className="text-muted hover:text-charcoal p-1">
              <Smile className="w-5 h-5" />
            </button>
            <button className="text-muted hover:text-charcoal p-1">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-white border border-sage/60 rounded-full px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#075E54]"
            />
            {inputVal.trim() ? (
              <button
                onClick={() => handleSend()}
                className="w-8 h-8 rounded-full bg-[#075E54] hover:bg-[#128C7E] text-white flex items-center justify-center transition-colors shadow-xs"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            ) : (
              <button 
                onClick={() => handleSend('Tell me about today’s active surplus food')}
                className="w-8 h-8 rounded-full bg-[#075E54] hover:bg-[#128C7E] text-white flex items-center justify-center transition-colors shadow-xs"
                title="Voice query"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        </aside>
      )}
    </>
  );
};
