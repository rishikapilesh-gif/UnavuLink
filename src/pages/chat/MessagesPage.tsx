import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../hooks/useStore';
import { ChatConversation, ChatMessage } from '../../types';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip, 
  ShieldCheck, 
  Truck, 
  ChefHat, 
  Building2, 
  Clock, 
  MapPin, 
  CheckCheck, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

const PREDEFINED_RESCUE_CHIPS = [
  'I have accepted the rescue mission.',
  'I am on my way to the pickup kitchen.',
  'The food drums have been hygienically collected.',
  'Minor traffic delay: ETA +10 minutes.',
  'Please confirm receiving door at shelter.',
  'Delivery complete! Entering delivery OTP.'
];

export const MessagesPage: React.FC = () => {
  const { user, role } = useAuth();
  const store = useStore();
  const { conversationId } = useParams<{ conversationId?: string }>();

  const conversations = store.getConversations();
  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversationId || (conversations[0]?.id || '')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConv = conversations.find(c => c.id === selectedConvId) || conversations[0];
  const messages = selectedConv ? store.getMessagesByConversationId(selectedConv.id) : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConvId]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !selectedConv || !user) return;

    store.sendMessage(
      selectedConv.id,
      user.id,
      user.full_name,
      role,
      text,
      textToSend ? 'predefined_action' : 'text'
    );

    if (!textToSend) setInputText('');
  };

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.last_message_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.food_name && c.food_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sage/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-forest" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal">
              Mission Coordination Chat
            </h1>
          </div>
          <p className="text-xs text-muted">
            Direct real-time communication between Donors, NGOs, and assigned RescueMates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/whatsapp"
            className="px-3 py-1.5 bg-cream hover:bg-forest/10 text-forest rounded-subtle font-bold text-xs border border-forest/30 flex items-center gap-1.5 transition-colors"
          >
            <span>WhatsApp Business Integration</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Chat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 bg-white rounded-card border border-sage shadow-lift overflow-hidden h-[620px]">
        {/* Left Side: Conversation List */}
        <div className="md:col-span-4 border-r border-sage/60 flex flex-col h-full bg-cream/30">
          {/* Search bar */}
          <div className="p-3 border-b border-sage/60 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations, batches..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-sage rounded-subtle bg-cream focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>
          </div>

          {/* Conversation List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-sage/40">
            {filteredConversations.map(conv => {
              const isSelected = conv.id === selectedConv?.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 ${
                    isSelected ? 'bg-forest/10 border-l-4 border-forest' : 'hover:bg-cream/60'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">
                    {conv.conversation_type === 'donor_rescuemate' ? '🛵' : '🤝'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-charcoal truncate">{conv.title}</h4>
                      <span className="text-[10px] text-muted shrink-0">
                        {new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {conv.food_name && (
                      <p className="text-[10px] font-semibold text-forest truncate mt-0.5">
                        📦 {conv.food_name}
                      </p>
                    )}

                    <p className="text-[11px] text-muted truncate mt-0.5">
                      {conv.last_message_text}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Chat Window */}
        <div className="md:col-span-8 flex flex-col h-full bg-[#FAF8F5]">
          {selectedConv ? (
            <>
              {/* Contextual Rescue Banner atop Chat */}
              <div className="bg-white px-4 py-3 border-b border-sage/60 flex items-center justify-between shrink-0 shadow-2xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-charcoal">{selectedConv.title}</h3>
                    {selectedConv.related_batch_id && (
                      <span className="font-mono text-[10px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded">
                        {selectedConv.related_batch_id}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted flex items-center gap-2">
                    <span>📍 {selectedConv.pickup_address?.substring(0, 30)}...</span>
                    <span>➔</span>
                    <span>🏠 {selectedConv.delivery_address?.substring(0, 30)}...</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="bg-status-success/20 text-status-success font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase">
                    Active Mission
                  </span>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {/* Security notice */}
                <div className="text-center my-1">
                  <span className="inline-block bg-[#FFF3C4] text-[#856404] text-[10px] px-3 py-1 rounded-lg border border-[#FFEEBA]">
                    🔒 End-to-end encrypted logistics channel. Messages logged for FSSAI traceability audit.
                  </span>
                </div>

                {messages.map(msg => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-muted mb-1 px-1">
                        {msg.sender_name} ({msg.sender_role})
                      </span>

                      <div
                        className={`max-w-[80%] rounded-xl px-3.5 py-2.5 shadow-xs space-y-1 ${
                          isMine
                            ? 'bg-forest text-white rounded-tr-none'
                            : 'bg-white text-charcoal border border-sage/60 rounded-tl-none'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>

                        <div className={`flex items-center justify-end gap-1 text-[9px] pt-0.5 ${
                          isMine ? 'text-cream/80' : 'text-muted'
                        }`}>
                          <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMine && <CheckCheck className="w-3.5 h-3.5 text-orange-warm" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Predefined Quick Action Chips */}
              <div className="bg-white/90 p-2 border-t border-sage/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                {PREDEFINED_RESCUE_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip)}
                    className="bg-cream hover:bg-forest/10 text-forest text-[10px] font-bold px-2.5 py-1 rounded-full border border-forest/30 whitespace-nowrap transition-colors"
                  >
                    💬 {chip}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="bg-white px-3 py-2.5 border-t border-sage/60 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type message to mission participants..."
                  className="flex-1 bg-cream border border-sage rounded-full px-4 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
                />

                <button
                  onClick={() => handleSend()}
                  disabled={!inputText.trim()}
                  className="w-8 h-8 rounded-full bg-forest hover:bg-forest-dark text-white flex items-center justify-center transition-colors shadow-xs disabled:opacity-40 shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8 text-muted text-xs">
              Select a conversation on the left to start coordinating.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
