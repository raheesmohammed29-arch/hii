import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  MapPin, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  ArrowLeft, 
  ShieldAlert, 
  Lock, 
  Sparkles, 
  Database,
  Building2,
  Trash2,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reports, deleteUserReport, changeReportStatus } = useData();
  const { user } = useAuth();
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const item = reports.find((r) => r.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-slate-200 space-y-4">
          <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Report Not Found</h2>
          <p className="text-xs text-slate-600">
            The requested lost or found report does not exist or may have been withdrawn.
          </p>
          <Link
            to="/items"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Browse</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && user.id === item.userId;
  const isAdmin = user && user.role === 'admin';
  const isLost = item.reportType === 'lost';

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to withdraw this report?')) {
      await deleteUserReport(item.id);
      navigate('/dashboard');
    }
  };

  const handleAdminStatusChange = async (newStatus: any) => {
    await changeReportStatus(item.id, newStatus);
    setActionSuccess(`Report status updated to ${newStatus}`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link
            to="/items"
            className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Listings</span>
          </Link>

          <div className="flex items-center gap-2">
            <span>Reference No:</span>
            <span className="font-mono-numbers font-semibold text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded text-[11px]">
              {item.referenceNo}
            </span>
          </div>
        </div>

        {/* Action success alert */}
        {actionSuccess && (
          <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Main Details Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Top Banner indicating Origin */}
          <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {item.isSample ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-medium text-amber-300">Sample Demonstration Record</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5 text-teal-400" />
                  <span className="font-medium text-teal-300">Live Database Community Record</span>
                </>
              )}
            </div>
            <div className="uppercase font-bold tracking-wider text-[11px]">
              {isLost ? 'Reported Lost' : 'Reported Found'}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Title & Status Header */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="font-medium text-blue-700">{item.category}</span>
                <span aria-hidden="true">·</span>
                <span>District: {item.district}</span>
                <span aria-hidden="true">·</span>
                <span>Reported on {new Date(item.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {item.title}
                </h1>
                <div>
                  <StatusBadge status={item.status} type="report" />
                </div>
              </div>
            </div>

            {/* Visual Media & Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Media / Photo Column */}
              <div className="md:col-span-5 space-y-3">
                <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 text-slate-400 space-y-2">
                      <Tag className="w-10 h-10 mx-auto opacity-50" />
                      <div className="text-xs font-medium">No Public Photo Attached</div>
                      <div className="text-[11px] text-slate-400 max-w-xs">
                        Private proof images are held confidentially to safeguard against false claims.
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Public view intentionally excludes private identifying marks to ensure genuine owner verification.</span>
                </div>
              </div>

              {/* Information Column */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Public Description
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                    {item.description}
                  </p>
                </div>

                {/* Spatial / Location Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Approximate Location</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900">
                      {item.approximateLocation}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {item.district} District
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Incident Date</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900">
                      {item.dateOccurred}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Safe verified timeline
                    </div>
                  </div>
                </div>

                {/* Privacy & Safe Contact Guarantee */}
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Privacy &amp; Contact Protection Enforced</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Personal telephone numbers and residential addresses are NEVER displayed publicly. Contact and handovers are coordinated through the verified claim protocol or local Police station reception desk.
                  </p>
                </div>

                {/* Owner or Admin Private Identifying Details Note */}
                {(isOwner || isAdmin) && item.privateIdentifyingDetails && (
                  <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/70 space-y-1.5">
                    <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Confidential Identifying Proof (Owner / Staff View Only)</span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      {item.privateIdentifyingDetails}
                    </p>
                  </div>
                )}

                {/* Primary Action Button (Claim Verification) */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    to={`/verify?item=${item.id}`}
                    className="px-6 py-3 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs inline-flex items-center gap-2"
                  >
                    <FileCheck className="w-4 h-4 text-teal-300" />
                    <span>Claim Ownership of This Item</span>
                  </Link>

                  {isOwner && (
                    <button
                      onClick={handleDelete}
                      className="px-4 py-3 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Withdraw Report</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Administrative Fast Actions Panel (Visible ONLY to Admins) */}
            {isAdmin && (
              <div className="mt-8 pt-6 border-t border-slate-200 bg-slate-50 p-5 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-blue-700" />
                  <span>Admin Moderation Shortcuts</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <button
                    onClick={() => handleAdminStatusChange('approved')}
                    className="px-3 py-1.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 cursor-pointer"
                  >
                    Set Active (Approved)
                  </button>
                  <button
                    onClick={() => handleAdminStatusChange('under_claim')}
                    className="px-3 py-1.5 bg-teal-600 text-white font-medium rounded hover:bg-teal-700 cursor-pointer"
                  >
                    Set Under Claim
                  </button>
                  <button
                    onClick={() => handleAdminStatusChange('recovered')}
                    className="px-3 py-1.5 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700 cursor-pointer"
                  >
                    Mark Recovered &amp; Returned
                  </button>
                  <button
                    onClick={() => handleAdminStatusChange('closed')}
                    className="px-3 py-1.5 bg-slate-600 text-white font-medium rounded hover:bg-slate-700 cursor-pointer"
                  >
                    Close Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Safety & Protocol Box */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 text-sm">
              Official Sri Lanka Police Handover Recommendation
            </h4>
            <p className="leading-relaxed">
              If this item is high-value or contains national identity credentials, both finder and claimant are strongly urged to carry out the physical verification and handover in the presence of the officer on duty at your nearest divisional Police Station.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
