import React, { useState } from 'react';
import { 
  Mail, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is FindBack LK free to use?',
      a: 'Yes, FindBack LK is completely free for all Sri Lankan citizens to report lost belongings, publish found items, and submit ownership verification claims. We do not charge mandatory fees.'
    },
    {
      q: 'How does ownership verification protect me from impostors?',
      a: 'When you report a found item or submit a claim, you provide confidential secret evidence (e.g. unique scratches, serial numbers, wallpapers, internal compartment contents) that is kept invisible from the public. Only when these matching proof points are verified by moderation is a safe handover scheduled.'
    },
    {
      q: 'Where should we meet to hand over a found item?',
      a: 'For high-value electronics, wallets, jewellery, or official documents, we strongly recommend meeting at your local Sri Lanka Police Station reception desk or a well-lit community centre during daylight hours. Never meet in isolated locations.'
    },
    {
      q: 'What should I do if I find a Sri Lanka National Identity Card (NIC)?',
      a: 'Publish a general found report without displaying the full NIC number or home address. You can also surrender it to the nearest Police Station or postal box according to Sri Lanka Post guidelines.'
    },
    {
      q: 'Can I offer a cash reward (LKR) to the finder?',
      a: 'Yes, voluntary tokens of appreciation in Sri Lankan Rupees (LKR) are permitted if offered voluntarily by the owner after authentic physical receipt. However, no finder may demand advance payments or hold items hostage.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please complete all form fields.');
      return;
    }

    if (message.length < 15) {
      setErrorMessage('Please enter a descriptive message (at least 15 characters).');
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Contact Support &amp; FAQ
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Have questions about reporting, verification, or community safety in Sri Lanka? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900">
              Send an Inquiry to Support
            </h2>

            {submitted ? (
              <div className="p-6 bg-teal-50 border border-teal-200 rounded-xl text-center space-y-3">
                <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-teal-900">Message Received</h3>
                <p className="text-xs text-teal-800 leading-relaxed">
                  Thank you for reaching out, {name}. Our moderation team will review your inquiry and follow up at <strong>{email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-2 text-xs font-semibold text-teal-700 underline cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kasun Bandara"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.lk"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Report Verification Issue">Report Verification Issue</option>
                    <option value="Report Fraudulent Claim">Report Fraudulent Claim / Scammer</option>
                    <option value="Police Station Liaison">Police Station Liaison Assistance</option>
                    <option value="Supabase Database Inquiry">Supabase Database &amp; Cloud Storage Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your query or report reference code..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Details & Emergency Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Official Support Channels</h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <Mail className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">Email Support</div>
                    <div className="text-slate-600 font-mono text-[11px]">support@findback.lk</div>
                    <div className="text-[11px] text-slate-400">Response within 24 hours</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <PhoneCall className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">Emergency &amp; Police Hotline</div>
                    <div className="text-slate-600 font-mono text-[11px]">Sri Lanka Police Emergency: 119</div>
                    <div className="text-[11px] text-slate-400">Tourist Police Division: 011-2421052</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Anti-Fraud Notice */}
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Notice Regarding Fake Callers</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                FindBack LK representatives will never call you asking for OTPs, ATM PINs, bank account credentials, or courier cash transfers. If someone contacts you demanding advance payment, report them immediately.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Common Inquiries</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>

          <div className="divide-y divide-slate-100 pt-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-900 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {openFaq === idx && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-2 border-l-2 border-blue-200">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
