import React, { useState, useEffect } from 'react';
import { emailService, EmailDeliveryConfig, EmailLogEntry } from '../../services/emailService';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Server, 
  ShieldCheck, 
  Clock, 
  Search,
  ExternalLink,
  Sliders
} from 'lucide-react';

export const EmailIntegrationPage: React.FC = () => {
  const [config, setConfig] = useState<EmailDeliveryConfig>(emailService.getConfig());
  const [logs, setLogs] = useState<EmailLogEntry[]>(emailService.getLogs());
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Test Dispatch Form
  const [testTo, setTestTo] = useState('donor@annapoorna.demo');
  const [testSubject, setTestSubject] = useState('Surplus Food Pickup Scheduled — Mission #UNV-2026-081');
  const [testTemplate, setTestTemplate] = useState('pickup_confirmation');
  const [sending, setSending] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<{ success: boolean; msg: string } | null>(null);

  const refreshLogs = () => {
    setLogs(emailService.getLogs());
    setConfig(emailService.getConfig());
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setDispatchResult(null);

    try {
      const res = await emailService.dispatchEmail({
        to: testTo,
        recipientName: 'Taj Vivanta F&B Desk',
        role: 'Donor',
        subject: testSubject,
        category: 'donor',
        templateType: testTemplate,
        title: 'Food Pickup Confirmation Alert',
        bodyLines: [
          'A verified RescueMate volunteer (Karthik S.) has arrived at your facility for Mission #UNV-2026-081.',
          'Surplus item: 40 portions of Dal Makhani & Jeera Rice.',
          'Please verify the 4-digit Pickup OTP before releasing containers.'
        ],
        actionLabel: 'Open Mission Tracking',
        actionUrl: `${window.location.origin}/tracking`
      });

      setDispatchResult({
        success: res.success,
        msg: res.success 
          ? 'Email dispatched and recorded in transaction ledger.' 
          : `Delivery failed: ${res.error}`
      });
      refreshLogs();
    } catch (err: any) {
      setDispatchResult({ success: false, msg: err.message || 'Dispatch error' });
    } finally {
      setSending(false);
    }
  };

  const filteredLogs = logs.filter(entry => {
    const matchesCategory = filterCategory === 'all' || entry.category === filterCategory;
    const matchesQuery = !searchQuery || 
      entry.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.templateType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="bg-white rounded-card p-6 shadow-lift border border-sage flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-charcoal">Real Email Notification Delivery</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-forest/10 text-forest border border-forest/20">
              Active Gateway
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Genuine transactional notifications for account verifications, password resets, donor matching & volunteer missions.
          </p>
        </div>

        <button
          onClick={refreshLogs}
          className="px-3 py-1.5 border border-sage hover:border-forest text-xs font-semibold text-charcoal rounded-subtle flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-forest" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Gateway Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Provider Status */}
        <div className="bg-white p-5 rounded-card border border-sage shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
              <Server className="w-4 h-4 text-forest" />
              <span>Email Delivery Engine</span>
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
              config.isConfigured ? 'bg-forest/10 text-forest' : 'bg-orange-warm/10 text-orange-warm'
            }`}>
              {config.provider.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-charcoal font-semibold">
            {config.statusMessage}
          </p>
          <p className="text-[11px] text-muted">
            Sender: <code className="text-forest font-bold">{config.senderAddress}</code>
          </p>
        </div>

        {/* Security & Hashing */}
        <div className="bg-white p-5 rounded-card border border-sage shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-forest" />
              <span>Credential Security</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700">
              SHA-256 + Salt
            </span>
          </div>
          <p className="text-xs text-charcoal font-semibold">
            Zero Plaintext Password Storage
          </p>
          <p className="text-[11px] text-muted">
            Rate limiting: 5 attempts / 3 min lockout. Privacy-preserving reset responses.
          </p>
        </div>

        {/* Total Deliveries */}
        <div className="bg-white p-5 rounded-card border border-sage shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-forest" />
              <span>Delivery Ledger</span>
            </span>
            <span className="text-xs font-extrabold text-forest">
              {logs.length} logged
            </span>
          </div>
          <p className="text-xs text-charcoal font-semibold">
            Real-time Delivery Trail
          </p>
          <p className="text-[11px] text-muted">
            All sent emails, verification links and reset alerts are tracked immutably.
          </p>
        </div>
      </div>

      {/* Main Grid: Test Dispatcher & Live Delivery Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1: Dispatch Test Email Form */}
        <div className="bg-white rounded-card p-6 shadow-lift border border-sage space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-charcoal flex items-center gap-1.5">
              <Send className="w-4 h-4 text-forest" />
              <span>Dispatch Test Notification</span>
            </h2>
          </div>
          <p className="text-[11px] text-muted">
            Send a sample transactional email to test template styling and delivery receipt.
          </p>

          <form onSubmit={handleSendTestEmail} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-charcoal mb-1">Recipient Address</label>
              <input
                type="email"
                required
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
                className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Notification Subject</label>
              <input
                type="text"
                required
                value={testSubject}
                onChange={(e) => setTestSubject(e.target.value)}
                className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Template Category</label>
              <select
                value={testTemplate}
                onChange={(e) => setTestTemplate(e.target.value)}
                className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white font-medium"
              >
                <option value="pickup_confirmation">Donor: Pickup Confirmation</option>
                <option value="request_approved">Acceptor: Surplus Approved</option>
                <option value="mission_assigned">RescueMate: New Mission Alert</option>
                <option value="volunteer_verification">Admin: New Verification</option>
              </select>
            </div>

            {dispatchResult && (
              <div className={`p-2.5 rounded-subtle text-xs flex items-center gap-2 ${
                dispatchResult.success 
                  ? 'bg-forest/10 border border-forest/30 text-forest' 
                  : 'bg-cherry/10 border border-cherry/30 text-cherry'
              }`}>
                {dispatchResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{dispatchResult.msg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Send Transactional Email</span>
            </button>
          </form>
        </div>

        {/* Col 2-3: Transaction Delivery Logs Table */}
        <div className="lg:col-span-2 bg-white rounded-card shadow-lift border border-sage p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-forest" />
                <span>Email Delivery Audit Trail</span>
              </h2>
              <p className="text-[11px] text-muted">Recent emails dispatched by UnavuLink auth and logistics.</p>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 text-xs">
              {['all', 'account', 'donor', 'acceptor', 'volunteer'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-full capitalize text-[10px] font-bold transition-colors ${
                    filterCategory === cat 
                      ? 'bg-forest text-white' 
                      : 'bg-cream text-charcoal border border-sage hover:border-forest/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email, subject or template..."
              className="w-full pl-8 pr-3 py-2 text-xs border border-sage rounded-subtle bg-cream focus:bg-white"
            />
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream border-b border-sage text-muted text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Recipient</th>
                  <th className="py-2.5 px-3">Subject & Template</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Dispatched</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/60 font-medium">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted text-xs">
                      No matching email logs recorded.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-cream/40 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-charcoal">{log.recipientName}</div>
                        <div className="text-[10px] text-muted">{log.recipientEmail}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="text-charcoal font-semibold truncate max-w-xs">{log.subject}</div>
                        <div className="text-[10px] text-forest font-mono">{log.templateType}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="capitalize px-2 py-0.5 rounded text-[10px] font-bold bg-cream border border-sage">
                          {log.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.status === 'delivered' || log.status === 'sent'
                            ? 'bg-forest/10 text-forest'
                            : 'bg-cherry/10 text-cherry'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            log.status === 'delivered' || log.status === 'sent' ? 'bg-forest' : 'bg-cherry'
                          }`} />
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[10px] text-muted whitespace-nowrap">
                        {new Date(log.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
