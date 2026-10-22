import React from 'react';
import { ReportStatus, ClaimStatus } from '../../types';
import { Clock, CheckCircle2, ShieldCheck, AlertCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ReportStatus | ClaimStatus;
  type?: 'report' | 'claim';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'report' }) => {
  // Report Status configuration
  if (type === 'report') {
    switch (status) {
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
            <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            Pending Review
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-blue-600" />
            Active Listing
          </span>
        );
      case 'under_claim':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-teal-600" />
            Claim Under Verification
          </span>
        );
      case 'recovered':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
            Recovered &amp; Returned
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <XCircle className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            Closed
          </span>
        );
      default:
        return <span className="text-xs text-slate-500">{status}</span>;
    }
  }

  // Claim Status configuration
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
          <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          Pending Verification
        </span>
      );
    case 'under_review':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-blue-600" />
          Evidence Under Review
        </span>
      );
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          Ownership Verified
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
          Claim Declined
        </span>
      );
    default:
      return <span className="text-xs text-slate-500">{status}</span>;
  }
};
