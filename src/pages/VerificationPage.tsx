import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  ShieldCheck, 
  FileCheck, 
  Upload, 
  Lock, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const VerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preSelectedItemId = searchParams.get('item');
  const { reports, claims, submitClaim } = useData();
  const { user, isSupabaseActive } = useAuth();

  // Active view: 'submit' or 'track'
  const [mode, setMode] = useState<'submit' | 'track'>('submit');

  // Submit Claim Form State
  const [selectedItemId, setSelectedItemId] = useState(preSelectedItemId || '');
  const [claimantName, setClaimantName] = useState(user?.fullName || '');
  const [claimantEmail, setClaimantEmail] = useState(user?.email || '');
  const [claimantPhone, setClaimantPhone] = useState(user?.phone || '');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [proofImagePreview, setProofImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdClaimRef, setCreatedClaimRef] = useState<string | null>(null);

  // Track Claim State
  const [trackRefInput, setTrackRefInput] = useState('');
  const [searchedClaim, setSearchedClaim] = useState<any | null>(null);
  const [trackError, setTrackError] = useState('');

  useEffect(() => {
    if (preSelectedItemId) {
      setSelectedItemId(preSelectedItemId);
    }
  }, [preSelectedItemId]);

  const selectedItem = reports.find((r) => r.id === selectedItemId);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('Evidence photo exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!selectedItemId) {
      setSubmitError('Please select which item you are claiming ownership for.');
      return;
    }

    if (!claimantName.trim() || !claimantEmail.trim() || !claimantPhone.trim()) {
      setSubmitError('Please provide your full contact details (Name, Email, Phone).');
      return;
    }

    if (!evidenceNotes.trim() || evidenceNotes.length < 20) {
      setSubmitError('Please provide comprehensive ownership evidence (minimum 20 characters). Describe distinctive marks, serial numbers, exact contents, or purchase history.');
      return;
    }

    setSubmitting(true);
    try {
      const claim = await submitClaim({
        itemId: selectedItemId,
        itemTitle: selectedItem?.title || 'Reported Belonging',
        claimantId: user?.id || `claimant-${Date.now()}`,
        claimantName: claimantName.trim(),
        claimantEmail: claimantEmail.trim(),
        claimantPhone: claimantPhone.trim(),
        privateEvidenceNotes: evidenceNotes.trim(),
        privateProofImageUrl: proofImagePreview || undefined,
      });

      setCreatedClaimRef(claim.claimReferenceNo);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit claim.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setSearchedClaim(null);

    const ref = trackRefInput.trim().toUpperCase();
    if (!ref) {
      setTrackError('Please enter a claim reference number (e.g. CLM-2026-4401).');
      return;
    }

    const found = claims.find((c) => c.claimReferenceNo.toUpperCase() === ref);
    if (!found) {
      setTrackError(`No ownership claim found matching reference "${ref}". Please check the code.`);
    } else {
      setSearchedClaim(found);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-md">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Anti-Fraud Ownership Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Claim Ownership &amp; Verification
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            To prevent fraud, items are never released based on casual descriptions alone. You must provide private confidential evidence that only the genuine owner possesses.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex justify-center">
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl">
            <button
              onClick={() => setMode('submit')}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'submit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Submit New Ownership Claim
            </button>
            <button
              onClick={() => setMode('track')}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'track' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Track Existing Claim Status
            </button>
          </div>
        </div>

        {/* SUBMIT CLAIM VIEW */}
        {mode === 'submit' && (
          <>
            {createdClaimRef ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-6 shadow-xs max-w-lg mx-auto">
                <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900">
                    Verification Claim Registered
                  </h2>
                  <p className="text-xs text-slate-600">
                    {isSupabaseActive
                      ? "✓ Claim recorded directly in live Supabase database."
                      : "Your claim is now queued for administrative evidence review."}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Unique Claim Reference
                  </div>
                  <div className="text-2xl font-mono font-bold text-teal-700">
                    {createdClaimRef}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Status: <span className="font-semibold text-amber-700">Pending Review</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Our moderators cross-check your private details with the finder&apos;s confidential report. You will receive an email/notification once reviewed.
                </p>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setCreatedClaimRef(null);
                      setTrackRefInput(createdClaimRef);
                      setMode('track');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Track Status
                  </button>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
                  >
                    Go to Citizen Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
                <form onSubmit={handleClaimSubmit} className="space-y-6">
                  {submitError && (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* 1. Item Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Target Belonging Being Claimed <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Choose an item from registered reports --</option>
                      {reports.map((r) => (
                        <option key={r.id} value={r.id}>
                          [{r.referenceNo}] {r.title} ({r.district} - {r.category})
                        </option>
                      ))}
                    </select>

                    {selectedItem && (
                      <div className="mt-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-900">{selectedItem.title}</span> · Location: {selectedItem.approximateLocation}
                        </div>
                        <span className="text-[11px] text-blue-600 font-mono font-medium">
                          Ref: {selectedItem.referenceNo}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 2. Claimant Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={claimantName}
                        onChange={(e) => setClaimantName(e.target.value)}
                        placeholder="e.g. Kasun Bandara"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={claimantEmail}
                        onChange={(e) => setClaimantEmail(e.target.value)}
                        placeholder="e.g. kasun@example.lk"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Contact Phone (+94) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={claimantPhone}
                        onChange={(e) => setClaimantPhone(e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  {/* 3. Private Ownership Evidence (Mandatory) */}
                  <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
                      <Lock className="w-4 h-4 text-teal-700" />
                      <span>Confidential Ownership Evidence (Strictly Private)</span>
                    </div>
                    <p className="text-[11px] text-teal-800 leading-relaxed">
                      Prove that you are the lawful owner. Describe unique attributes not visible in the public photos:
                      serial/IMEI number, precise interior contents, engraving, original purchase shop, or password lock description.
                    </p>
                    <textarea
                      required
                      rows={4}
                      value={evidenceNotes}
                      onChange={(e) => setEvidenceNotes(e.target.value)}
                      placeholder="e.g. The wallet contains my driving license (ID ending in 410V), an expired medical card, and 3 currency notes. The laptop has serial number SN-8829-LK with a blue sticker under the battery."
                      className="w-full px-3 py-2 text-xs bg-white border border-teal-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-teal-500 leading-relaxed"
                    />
                  </div>

                  {/* 4. Supporting Document / Receipt / Photo Evidence */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Supporting Photo Evidence (Invoice, Box Serial, or Past Photo with Item)
                    </label>
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                      {proofImagePreview ? (
                        <div className="flex items-center justify-between">
                          <img
                            src={proofImagePreview}
                            alt="Proof Preview"
                            className="h-20 w-28 object-cover rounded-lg border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => setProofImagePreview('')}
                            className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center gap-3 cursor-pointer py-2">
                          <Upload className="w-5 h-5 text-slate-400" />
                          <div>
                            <div className="text-xs font-medium text-slate-700">
                              Upload proof document or receipt
                            </div>
                            <div className="text-[11px] text-slate-400">
                              PNG, JPG, PDF receipt snapshot up to 5MB
                            </div>
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

                  {/* Anti-Fraud Disclaimer */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      Notice: Sri Lanka Penal Code strictly prohibits fraudulent claims. Submitting false claims for property belonging to another is an offense subject to investigation by the Sri Lanka Police Department.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>{submitting ? 'Verifying & Submitting...' : 'Submit Ownership Claim'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

        {/* TRACK CLAIM STATUS VIEW */}
        {mode === 'track' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div className="max-w-lg mx-auto space-y-4">
              <h2 className="text-lg font-bold text-slate-900 text-center">
                Track Claim Verification Status
              </h2>
              <form onSubmit={handleTrackClaim} className="flex gap-2">
                <input
                  type="text"
                  value={trackRefInput}
                  onChange={(e) => setTrackRefInput(e.target.value)}
                  placeholder="Enter Claim Reference (e.g. CLM-2026-4401)"
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
                >
                  Check Status
                </button>
              </form>

              {trackError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{trackError}</span>
                </div>
              )}
            </div>

            {/* Display Found Claim Result */}
            {searchedClaim && (
              <div className="max-w-xl mx-auto border border-slate-200 rounded-xl p-6 bg-slate-50/50 space-y-4 mt-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <div className="text-[11px] font-mono font-bold text-slate-500">
                      {searchedClaim.claimReferenceNo}
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {searchedClaim.itemTitle}
                    </div>
                  </div>
                  <div>
                    <StatusBadge status={searchedClaim.status} type="claim" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Claimant</span>
                    <span className="font-medium text-slate-800">{searchedClaim.claimantName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Submitted Date</span>
                    <span className="font-medium text-slate-800">
                      {new Date(searchedClaim.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {searchedClaim.adminNotes && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-1">
                    <span className="font-bold text-blue-900 block">Staff Moderator Notes:</span>
                    <p className="text-blue-800">{searchedClaim.adminNotes}</p>
                  </div>
                )}

                <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                  {searchedClaim.status === 'approved' ? (
                    <span className="text-emerald-700 font-medium">
                      Ownership verified! Please proceed to the agreed police station or community desk with your National ID for physical handover.
                    </span>
                  ) : searchedClaim.status === 'rejected' ? (
                    <span className="text-rose-700 font-medium">
                      The provided evidence did not match the item specifications or could not be verified.
                    </span>
                  ) : (
                    <span>
                      Our verification team is cross-checking submitted serials and distinctive marks.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
