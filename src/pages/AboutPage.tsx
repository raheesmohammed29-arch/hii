import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  HeartHandshake, 
  Lock, 
  Building2, 
  Scale, 
  Users, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Hero Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-md">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Sri Lanka Community Trust Initiative</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About FindBack LK
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            FindBack LK was built to solve a pressing challenge across Sri Lanka: connecting citizens who lost valuable belongings with honest finders through a secure, fraud-resistant verification system.
          </p>
        </div>

        {/* Mission & Purpose */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Our Core Mission</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every day in Sri Lanka, thousands of people lose national identity cards (NICs), student passes, passports, smartphones, keys, and heirloom jewellery in public transit—on the intercity bus routes between Kandy and Colombo, at Fort and Maradana railway stations, in universities, or coastal promenades. 
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Historically, people turned to public social media groups, exposing their confidential NIC numbers, phone numbers, and home addresses to scammers, identity thieves, and extortionists. <strong>FindBack LK changes this.</strong> We provide a centralized, verified registry where public listings omit sensitive markings, while true owners verify their rights via private, encrypted proof.
          </p>
        </div>

        {/* 3 Pillars of Security */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Zero Public Exposure</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never broadcast private serial numbers, phone numbers, or residential addresses on public boards.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Anti-Fraud Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No item is released simply because someone claims &ldquo;that looks like mine&rdquo;. Claimants must provide secret indicators.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Police Handover Protocol</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              For high-value items, we recommend exchanging at local police stations to ensure both parties remain secure.
            </p>
          </div>
        </div>

        {/* Safety Principles & Voluntary Gratitude */}
        <div id="safety" className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Principles Regarding Rewards &amp; Sri Lankan Rupees (LKR)
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            FindBack LK is 100% free for all Sri Lankan citizens to report and claim belongings. We do <strong>not</strong> charge mandatory finder fees or platform commissions.
          </p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-900">
              Voluntary Tokens of Appreciation:
            </div>
            <p className="leading-relaxed">
              If an owner chooses to offer a voluntary cash reward (in Sri Lankan Rupees - LKR) or cover courier expenses for the kind citizen who safeguarded their belonging, this is handled purely voluntarily between the parties after physical verification. Never pay upfront fees to unknown individuals claiming to have your item.
            </p>
          </div>
        </div>

        {/* Sri Lanka Police Coordination */}
        <div id="police" className="bg-slate-900 text-white rounded-2xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Community Police Desk Coordination</span>
          </div>
          <h2 className="text-2xl font-bold">Official Police Handover Guidelines</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Sri Lanka Police regulations mandate that lost government credentials (such as National Identity Cards, Passports, Driving Licenses, and Vehicle Revenue Licenses) should be reported to the local police station to obtain an official police entry extract (Police Report).
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/items"
              className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors"
            >
              Browse Lost &amp; Found Database
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
