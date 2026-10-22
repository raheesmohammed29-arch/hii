import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ItemCard } from '../components/common/ItemCard';
import { 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  Eye, 
  FileCheck, 
  HeartHandshake,
  CheckCircle,
  AlertTriangle,
  Building2,
  Lock
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { reports, stats } = useData();

  // Show 6 most recent approved/active items
  const recentItems = reports
    .filter(r => r.status === 'approved' || r.status === 'under_claim' || r.status === 'recovered')
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-16 lg:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-md">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Sri Lanka&apos;s Verified Return Network</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
                Lost Something? <br />
                <span className="text-blue-600">Let&apos;s Find It Together.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                FindBack LK is a secure verification platform connecting people who lost personal belongings with honest finders across Sri Lanka. Private identifying details protect ownership against false claims.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/report?type=lost"
                  className="px-5 py-3 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs inline-flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Lost Item</span>
                </Link>

                <Link
                  to="/report?type=found"
                  className="px-5 py-3 text-sm font-semibold text-slate-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <HeartHandshake className="w-4 h-4 text-teal-700" />
                  <span>Report Found Item</span>
                </Link>

                <Link
                  to="/items"
                  className="px-5 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Browse Items</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Private proof verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>All 25 districts covered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Police handover support</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Artwork */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
                <img
                  src="/src/assets/images/hero_lost_found_1792644874210.jpg"
                  alt="Sri Lankan citizens recovering lost items through community verification"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover max-h-[420px]"
                  onError={(e) => {
                    // Fallback container
                    const target = e.target as HTMLElement;
                    target.style.display = 'none';
                  }}
                />
              </div>

              {/* Verification Callout Floating Overlay */}
              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200 shadow-lg hidden sm:flex items-center gap-3 max-w-xs">
                <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Zero False Claims</div>
                  <div className="text-[11px] text-slate-500 leading-tight">
                    Items are released only when claimant provides matching secret details.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quantitative Statistics Strip (Strict Tabular Numerals) */}
      <section className="bg-slate-900 text-white py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Total Reported Items
              </div>
              <div className="text-3xl font-extrabold font-mono-numbers text-white">
                {stats.totalReports}
              </div>
              <div className="text-xs text-slate-400">Islandwide reports logged</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Successfully Recovered
              </div>
              <div className="text-3xl font-extrabold font-mono-numbers text-teal-400">
                {stats.recoveredCount}
              </div>
              <div className="text-xs text-slate-400">Returned to confirmed owners</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Active Listings
              </div>
              <div className="text-3xl font-extrabold font-mono-numbers text-blue-400">
                {stats.activeReports}
              </div>
              <div className="text-xs text-slate-400">Currently awaiting match</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Pending Verifications
              </div>
              <div className="text-3xl font-extrabold font-mono-numbers text-amber-400">
                {stats.pendingClaims}
              </div>
              <div className="text-xs text-slate-400">Under moderator review</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Reported Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-1">
                Recent Listings
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Recently Reported Belongings
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Check if your lost belonging or an item you discovered has already been published.
              </p>
            </div>

            <Link
              to="/items"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0"
            >
              <span>View All Items</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1">
              Structured Procedure
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How FindBack LK Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              A 3-step security procedure designed to prevent impostors and protect Sri Lankan citizens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Report with General Description
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Describe the item and its approximate location (e.g. Colombo Fort or Kandy Lake). Never publish private secret marks or serial numbers publicly.
              </p>
              <div className="text-[11px] text-blue-700 font-medium pt-2 border-t border-slate-200">
                Safe public disclosure only
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Submit Private Ownership Proof
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The claimant must provide confidential evidence (invoice, photo of purchase, hidden serial number, device password, or secret engraving) visible only to moderators.
              </p>
              <div className="text-[11px] text-teal-700 font-medium pt-2 border-t border-slate-200">
                Encrypted &amp; private evidence
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Moderator Verification &amp; Safe Handover
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Once evidence is verified, both parties receive a secure reference code to arrange handover at an authorized community station or local police desk.
              </p>
              <div className="text-[11px] text-slate-700 font-medium pt-2 border-t border-slate-200">
                Protected handover protocol
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Community Recovery Spotlight */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 lg:p-12 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src="/src/assets/images/sl_safe_return_1792644874057.jpg"
                  alt="Citizen safe handover in Colombo community center"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  <span>Verified Community Success</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  Safe Handover Protocols Across Sri Lanka
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  We recommend that all high-value items (smartphones, wallets, jewellery, legal deeds, and identity cards) are exchanged in well-lit public areas or directly at the reception desk of your nearest Sri Lanka Police Station.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="border border-slate-100 p-3.5 rounded-lg bg-slate-50/70">
                    <div className="text-xs font-bold text-slate-900">Public Meeting Only</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Never agree to meet alone in isolated roads or private residencies.
                    </div>
                  </div>
                  <div className="border border-slate-100 p-3.5 rounded-lg bg-slate-50/70">
                    <div className="text-xs font-bold text-slate-900">Verify Before Handover</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Verify the unique FindBack Claim Reference code before passing possession.
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <span>Read Full Safety &amp; Legal Guidelines</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Tips Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-rose-700">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Citizen Protection Guidelines</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-8">
            Crucial Safety Advice
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-2">
              <div className="text-sm font-semibold text-slate-900">
                1. Never Share Private Passwords
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                FindBack LK administrators and finders will NEVER ask you for your email passwords, PIN codes, or bank OTPs.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-2">
              <div className="text-sm font-semibold text-slate-900">
                2. No Upfront Courier Demands
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Be vigilant against anyone requesting sudden advance bank transfers before showing proof of possession.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-2">
              <div className="text-sm font-semibold text-slate-900">
                3. Police Verification Form
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                For lost National Identity Cards (NIC) and passports, always lodge an official entry at your local police station first.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (Clearly labeled sample content) */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Sample Community Experiences
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Recoveries in Sri Lanka
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              (Representative testimonials illustrating how the verification flow resolves lost belongings)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <p className="text-sm text-slate-700 italic leading-relaxed">
                &ldquo;I forgot my university laptop bag in an AC bus from Kandy to Colombo. When I checked FindBack LK, the conductor had already listed it as a found item. Because I submitted the serial number and sticker photo in the private verification claim, it was confirmed within hours without anyone else grabbing it.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-xs">
                  DM
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Dilshan Madushanka</div>
                  <div className="text-[11px] text-slate-500">Engineering Student · Colombo District</div>
                </div>
                <div className="ml-auto text-[11px] text-slate-400 font-medium">Sample Case</div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <p className="text-sm text-slate-700 italic leading-relaxed">
                &ldquo;I found a transparent pouch with a National Identity Card and driving license near Galle Face Green. Rather than posting the private NIC number on social media where fraudsters copy it, I posted a general notice here. The owner claimed it safely through the police station protocol.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-700 text-xs">
                  SW
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Sunil Wickramasinghe</div>
                  <div className="text-[11px] text-slate-500">Public Servant · Western Province</div>
                </div>
                <div className="ml-auto text-[11px] text-slate-400 font-medium">Sample Case</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
