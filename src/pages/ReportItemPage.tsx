import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  ReportType, 
  ItemCategory, 
  ITEM_CATEGORIES, 
  SRI_LANKA_DISTRICTS 
} from '../types';
import { 
  ShieldCheck, 
  PlusCircle, 
  Upload, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Calendar,
  Image as ImageIcon
} from 'lucide-react';

export const ReportItemPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createReport } = useData();
  const { user, isSupabaseActive } = useAuth();

  const initialType: ReportType = searchParams.get('type') === 'found' ? 'found' : 'lost';

  const [reportType, setReportType] = useState<ReportType>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState(user?.district || 'Colombo');
  const [approximateLocation, setApproximateLocation] = useState('');
  const [dateOccurred, setDateOccurred] = useState(new Date().toISOString().split('T')[0]);
  const [privateIdentifyingDetails, setPrivateIdentifyingDetails] = useState('');
  const [contactPreference, setContactPreference] = useState<'platform_only' | 'email' | 'phone_masked'>('platform_only');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Validation and states
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedReportRef, setSubmittedReportRef] = useState<string | null>(null);
  const [createdReportId, setCreatedReportId] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size exceeds 5MB limit. Please choose a smaller photo.');
        return;
      }
      setErrorMessage('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || title.length < 4) {
      setErrorMessage('Please provide a specific item title (at least 4 characters).');
      return;
    }

    if (!description.trim() || description.length < 15) {
      setErrorMessage('Please provide a clear public description (at least 15 characters).');
      return;
    }

    if (!approximateLocation.trim()) {
      setErrorMessage('Please provide an approximate public location (e.g., Colombo Fort Station, Galle Face Green).');
      return;
    }

    if (!dateOccurred) {
      setErrorMessage('Please specify the date this item was lost or found.');
      return;
    }

    setSubmitting(true);

    try {
      const created = await createReport({
        userId: user?.id || `anon-${Date.now()}`,
        userEmail: user?.email || 'citizen@findback.lk',
        userName: user?.fullName || 'Citizen Reporter',
        reportType,
        title: title.trim(),
        category,
        description: description.trim(),
        privateIdentifyingDetails: privateIdentifyingDetails.trim() || undefined,
        district,
        approximateLocation: approximateLocation.trim(),
        dateOccurred,
        contactPreference,
        contactPhone: contactPreference === 'phone_masked' ? contactPhone : undefined,
        imageUrl: imagePreview || undefined,
        status: 'approved', // Auto-approved for community matching, pending administrative verification
      });

      setSubmittedReportRef(created.referenceNo);
      setCreatedReportId(created.id);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to publish report. Please check input.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedReportRef && createdReportId) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-6 shadow-sm">
          <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Report Submitted Successfully!
            </h2>
            <p className="text-xs text-slate-600">
              {isSupabaseActive 
                ? "✓ Saved directly to your live Supabase PostgreSQL database." 
                : "Saved to local verification storage. (Click 'Connect Real Supabase' in the top bar to save directly to Supabase)."}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Your Reference Number
            </div>
            <div className="text-2xl font-mono font-bold text-blue-700">
              {submittedReportRef}
            </div>
            <div className="text-[11px] text-slate-500">
              Keep this reference number handy for verification and inquiries.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              to={`/items/${createdReportId}`}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
            >
              View Public Listing
            </Link>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Go to Citizen Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Publish a Lost or Found Report
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Provide details to help locate or return the item. Confidential identifying details remain protected from public view.
          </p>
        </div>

        {/* Report Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error banner */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Report Type Selector (Functional segmented tabs) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                I am reporting
              </label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setReportType('lost')}
                  className={`py-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    reportType === 'lost'
                      ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  I Lost An Item
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('found')}
                  className={`py-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    reportType === 'found'
                      ? 'bg-white text-teal-700 shadow-sm border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  I Found An Item
                </button>
              </div>
            </div>

            {/* 2. Item Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Item Name / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Black Leather Wallet, Dell Inspiron Laptop"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  {ITEM_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Public Safe Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Public Description <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Visible to all citizens</span>
              </div>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe visible aspects: color, brand, approximate shape, outer condition. Do NOT include secret passcodes or exact private contents."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white leading-relaxed"
              />
            </div>

            {/* 4. Incident Date & Sri Lanka District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Date {reportType === 'lost' ? 'Lost' : 'Found'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={dateOccurred}
                    onChange={(e) => setDateOccurred(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Sri Lanka District <span className="text-rose-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  {SRI_LANKA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist} District
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 5. Approximate Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Approximate Landmark / Area <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={approximateLocation}
                onChange={(e) => setApproximateLocation(e.target.value)}
                placeholder="e.g. Fort Railway Station Platform 2, Galle Face Green, Kandy City Centre Level 3"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Do not enter private house numbers or exact home addresses.
              </span>
            </div>

            {/* 6. Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-slate-300 transition-colors bg-slate-50/50">
                {imagePreview ? (
                  <div className="space-y-3">
                    <img
                      src={imagePreview}
                      alt="Upload Preview"
                      className="max-h-48 mx-auto rounded-lg object-contain border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview('')}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block space-y-2 py-4">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="text-xs font-medium text-slate-700">
                      Click to upload an image from your device
                    </div>
                    <div className="text-[11px] text-slate-400">
                      PNG, JPG up to 5MB (Supabase Storage supported)
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* 7. Private Identifying Details (Security Feature) */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>Confidential Identifying Details (Hidden from Public)</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Provide secret details that only the true owner would know: IMEI / Serial number, specific wallpaper, scratch on bottom left, or items in a hidden zip compartment. This is used by moderators to verify legitimate claimants!
              </p>
              <textarea
                rows={2}
                value={privateIdentifyingDetails}
                onChange={(e) => setPrivateIdentifyingDetails(e.target.value)}
                placeholder="e.g. Serial No: SN-8921-LK, lock screen photo is of a Golden Retriever, key has a blue ribbon tag"
                className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* 8. Contact Preference */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contact &amp; Handover Preference
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg text-xs cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="contactPref"
                    checked={contactPreference === 'platform_only'}
                    onChange={() => setContactPreference('platform_only')}
                    className="text-blue-600"
                  />
                  <span>Platform Verification Only (Safest)</span>
                </label>
                <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg text-xs cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="contactPref"
                    checked={contactPreference === 'email'}
                    onChange={() => setContactPreference('email')}
                    className="text-blue-600"
                  />
                  <span>Email Notification</span>
                </label>
                <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg text-xs cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="contactPref"
                    checked={contactPreference === 'phone_masked'}
                    onChange={() => setContactPreference('phone_masked')}
                    className="text-blue-600"
                  />
                  <span>Masked Phone (+94)</span>
                </label>
              </div>

              {contactPreference === 'phone_masked' && (
                <div className="mt-3">
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Phone numbers are protected and only revealed upon approved verification.
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{submitting ? 'Publishing Report...' : 'Publish Report'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
