import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Search, 
  AlertTriangle, 
  History, 
  ExternalLink, 
  Lock, 
  Eye, 
  ChevronRight,
  Database,
  Filter
} from 'lucide-react';
import { ReportStatus, ClaimStatus } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { user, switchDemoRole } = useAuth();
  const { reports, claims, logs, stats, changeReportStatus, decideClaim } = useData();

  const [activeTab, setActiveTab] = useState<'claims' | 'reports' | 'audit'>('claims');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal state for reviewing private claim evidence
  const [reviewingClaim, setReviewingClaim] = useState<any | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [decisionPending, setDecisionPending] = useState(false);

  // Guard: Admin authorization check
  const isAdmin = user && user.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Administrator Access Restricted
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            This console is reserved strictly for authorized FindBack LK moderation personnel and police liaison desks.
          </p>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="text-[11px] text-slate-500 font-medium">
              Evaluating in review environment? Switch to Moderator Role:
            </div>
            <button
              onClick={() => switchDemoRole('admin')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
            >
              Switch to Staff Moderator (Demo)
            </button>
            <Link
              to="/"
              className="block text-xs font-semibold text-slate-500 hover:text-slate-800 pt-1"
            >
              Return to Public Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Claims
  const filteredClaims = useMemo(() => {
    return claims.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          c.claimReferenceNo.toLowerCase().includes(q) ||
          c.claimantName.toLowerCase().includes(q) ||
          c.claimantEmail.toLowerCase().includes(q) ||
          (c.itemTitle && c.itemTitle.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [claims, statusFilter, searchTerm]);

  // Filtered Reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          r.referenceNo.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [reports, statusFilter, searchTerm]);

  const handleOpenClaimReview = (claim: any) => {
    setReviewingClaim(claim);
    setAdminNotesInput(claim.adminNotes || '');
  };

  const handleDecideClaim = async (status: ClaimStatus) => {
    if (!reviewingClaim) return;
    setDecisionPending(true);
    await decideClaim(reviewingClaim.id, status, adminNotesInput);
    setDecisionPending(false);
    setReviewingClaim(null);
  };

  const handleQuickReportStatus = async (reportId: string, status: ReportStatus) => {
    await changeReportStatus(reportId, status);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Staff Moderation &amp; Verification Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Administrative Control Center
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Cross-examine confidential evidence, approve legitimate ownership claims, and log audit trails.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono-numbers">
              Moderator: <strong className="text-slate-800">{user.email}</strong>
            </span>
          </div>
        </div>

        {/* Real-time KPI Metric Cards (Strictly tabular nums) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Reports
            </span>
            <div className="text-2xl font-bold font-mono-numbers text-slate-900">
              {stats.totalReports}
            </div>
            <div className="text-[11px] text-slate-400">Islandwide registered</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lost Reports
            </span>
            <div className="text-2xl font-bold font-mono-numbers text-rose-600">
              {stats.lostCount}
            </div>
            <div className="text-[11px] text-slate-400">Missing belongings</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Found Reports
            </span>
            <div className="text-2xl font-bold font-mono-numbers text-teal-600">
              {stats.foundCount}
            </div>
            <div className="text-[11px] text-slate-400">Items discovered</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Claims
            </span>
            <div className="text-2xl font-bold font-mono-numbers text-amber-600">
              {stats.pendingClaims}
            </div>
            <div className="text-[11px] text-slate-400">Requires review</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Recovered &amp; Returned
            </span>
            <div className="text-2xl font-bold font-mono-numbers text-emerald-600">
              {stats.recoveredCount}
            </div>
            <div className="text-[11px] text-slate-400">Successfully united</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => {
              setActiveTab('claims');
              setStatusFilter('all');
            }}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'claims'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ownership Claims Queue ({claims.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('reports');
              setStatusFilter('all');
            }}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'reports'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Reports Moderation ({reports.length})
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Security Audit Trail ({logs.length})
          </button>
        </div>

        {/* Filter & Search Bar for Claims and Reports */}
        {activeTab !== 'audit' && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reference, title, or citizen..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="all">All Statuses</option>
                {activeTab === 'claims' ? (
                  <>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </>
                ) : (
                  <>
                    <option value="approved">Approved (Active)</option>
                    <option value="under_claim">Under Claim</option>
                    <option value="recovered">Recovered</option>
                    <option value="closed">Closed</option>
                  </>
                )}
              </select>
            </div>
          </div>
        )}

        {/* TAB 1: CLAIMS QUEUE */}
        {activeTab === 'claims' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Claim Ref</th>
                    <th className="px-5 py-3.5">Target Belonging</th>
                    <th className="px-5 py-3.5">Claimant Details</th>
                    <th className="px-5 py-3.5">Submitted</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Evidence Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-mono-numbers font-medium text-slate-900">
                        {claim.claimReferenceNo}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-900 max-w-xs truncate">
                        {claim.itemTitle || 'Reported Item'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900">{claim.claimantName}</div>
                        <div className="text-[11px] text-slate-400">{claim.claimantEmail} · {claim.claimantPhone}</div>
                      </td>
                      <td className="px-5 py-3.5 font-mono-numbers">
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={claim.status} type="claim" />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenClaimReview(claim)}
                          className="px-3 py-1.5 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors cursor-pointer text-xs"
                        >
                          Review Evidence
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredClaims.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-xs text-slate-400">
                        No ownership claims found matching current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: REPORTS MODERATION */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Reference</th>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5">Title &amp; Category</th>
                    <th className="px-5 py-3.5">District &amp; Location</th>
                    <th className="px-5 py-3.5">Origin</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Quick Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-mono-numbers font-medium text-slate-900">
                        {report.referenceNo}
                      </td>
                      <td className="px-5 py-3.5 uppercase font-bold text-[10px]">
                        {report.reportType}
                      </td>
                      <td className="px-5 py-3.5">
                        <Link
                          to={`/items/${report.id}`}
                          className="font-semibold text-slate-900 hover:text-blue-600"
                        >
                          {report.title}
                        </Link>
                        <div className="text-[11px] text-slate-400">{report.category}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-slate-800">{report.district}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {report.approximateLocation}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {report.isSample ? (
                          <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Sample</span>
                        ) : (
                          <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-semibold">Live DB</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={report.status} type="report" />
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-1">
                        <button
                          onClick={() => handleQuickReportStatus(report.id, 'approved')}
                          className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-semibold cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleQuickReportStatus(report.id, 'recovered')}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-semibold cursor-pointer"
                        >
                          Recovered
                        </button>
                        <button
                          onClick={() => handleQuickReportStatus(report.id, 'closed')}
                          className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-[11px] font-semibold cursor-pointer"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Tamper-Evident Administrative Log Entries
              </span>
              <span className="text-xs text-slate-400">Total logged events: {logs.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Timestamp</th>
                    <th className="px-5 py-3">Moderator</th>
                    <th className="px-5 py-3">Action Code</th>
                    <th className="px-5 py-3">Target Reference</th>
                    <th className="px-5 py-3">Log Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-numbers">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {log.adminEmail}
                      </td>
                      <td className="px-5 py-3 font-semibold text-blue-700">
                        {log.action}
                      </td>
                      <td className="px-5 py-3 text-slate-900 font-medium">
                        {log.targetId}
                      </td>
                      <td className="px-5 py-3 text-slate-600 font-sans max-w-md">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRIVATE EVIDENCE REVIEW MODAL */}
        {reviewingClaim && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-500">
                    {reviewingClaim.claimReferenceNo}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Confidential Ownership Evidence Review
                  </h3>
                </div>
                <button
                  onClick={() => setReviewingClaim(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Target Item summary */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="font-semibold text-slate-900">Item Being Claimed:</span>
                <div className="text-slate-700">{reviewingClaim.itemTitle}</div>
              </div>

              {/* Claimant Contact Details */}
              <div className="grid grid-cols-3 gap-3 text-xs bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Claimant</span>
                  <span className="font-semibold text-slate-900">{reviewingClaim.claimantName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email</span>
                  <span className="font-medium text-slate-900">{reviewingClaim.claimantEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Phone</span>
                  <span className="font-medium text-slate-900">{reviewingClaim.claimantPhone}</span>
                </div>
              </div>

              {/* Claimant's Private Evidence */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Submitted Private Evidence &amp; Secret Markers:</span>
                </div>
                <p className="text-xs text-amber-950 whitespace-pre-wrap leading-relaxed">
                  {reviewingClaim.privateEvidenceNotes}
                </p>
              </div>

              {/* Private Proof Photo Preview if uploaded */}
              {reviewingClaim.privateProofImageUrl && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">
                    Confidential Evidence Attachment (Invoice/ID/Photo):
                  </span>
                  <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 flex items-center justify-center bg-slate-100">
                    <img
                      src={reviewingClaim.privateProofImageUrl}
                      alt="Private Proof"
                      className="max-h-48 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Moderator Decision & Notes */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Moderator Notes &amp; Verification Directive
                </label>
                <textarea
                  rows={2}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="Enter notes visible to claimant (e.g. 'Evidence verified against registered serial number. Please collect from Colombo Fort Police Post with NIC')."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handleDecideClaim('rejected')}
                  disabled={decisionPending}
                  className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer"
                >
                  Decline Claim (Evidence Inadequate)
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecideClaim('under_review')}
                    disabled={decisionPending}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Keep Under Review
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDecideClaim('approved')}
                    disabled={decisionPending}
                    className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                  >
                    Approve Ownership
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
