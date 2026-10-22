import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SRI_LANKA_DISTRICTS } from '../types';
import { 
  User, 
  FileText, 
  ShieldCheck, 
  Bell, 
  Trash2, 
  PlusCircle, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const { user, updateProfile, isSupabaseActive } = useAuth();
  const { reports, claims, notifications, deleteUserReport, markNotifAsRead } = useData();

  const [activeTab, setActiveTab] = useState<'reports' | 'claims' | 'notifications' | 'profile'>('reports');

  // Profile form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [district, setDistrict] = useState(user?.district || 'Colombo');
  const [profileSaved, setProfileSaved] = useState(false);

  // Filter items created by current user or demo fallback
  const myReports = reports.filter(r => r.userId === user?.id || r.userEmail === user?.email);
  const myClaims = claims.filter(c => c.claimantId === user?.id || c.claimantEmail === user?.email);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      district,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleDeleteReport = async (id: string) => {
    if (window.confirm('Are you sure you want to withdraw this item report?')) {
      await deleteUserReport(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* User Hero Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-900 text-teal-300 flex items-center justify-center font-bold text-xl shadow-xs">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {user?.fullName || 'Citizen User'}
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                  {user?.role === 'admin' ? 'Staff Moderator' : 'Verified Citizen'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user?.email}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {user?.district || 'Western Province'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/report"
              className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Item</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Item Reports ({myReports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'claims'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>My Ownership Claims ({myClaims.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'notifications'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications ({notifications.filter(n => !n.isRead).length} new)</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* TAB 1: MY ITEM REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {myReports.length > 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3.5">Reference No</th>
                        <th className="px-5 py-3.5">Type</th>
                        <th className="px-5 py-3.5">Item Title</th>
                        <th className="px-5 py-3.5">District</th>
                        <th className="px-5 py-3.5">Date</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myReports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3.5 font-mono-numbers font-medium text-slate-900">
                            {report.referenceNo}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-semibold uppercase text-[10px]">
                              {report.reportType}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-medium text-slate-900 max-w-xs truncate">
                            {report.title}
                          </td>
                          <td className="px-5 py-3.5">{report.district}</td>
                          <td className="px-5 py-3.5 font-mono-numbers">{report.dateOccurred}</td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={report.status} type="report" />
                          </td>
                          <td className="px-5 py-3.5 text-right space-x-2">
                            <Link
                              to={`/items/${report.id}`}
                              className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => handleDeleteReport(report.id)}
                              className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                            >
                              Withdraw
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No reports submitted yet</h3>
                <p className="text-xs text-slate-500">
                  Have you misplaced a belonging or found something in Sri Lanka? Register a report to start the safe return process.
                </p>
                <Link
                  to="/report"
                  className="inline-block mt-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                >
                  Create First Report
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY OWNERSHIP CLAIMS */}
        {activeTab === 'claims' && (
          <div className="space-y-4">
            {myClaims.length > 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3.5">Claim Ref</th>
                        <th className="px-5 py-3.5">Claimed Item</th>
                        <th className="px-5 py-3.5">Date Filed</th>
                        <th className="px-5 py-3.5">Verification Status</th>
                        <th className="px-5 py-3.5">Moderator Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myClaims.map((claim) => (
                        <tr key={claim.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3.5 font-mono-numbers font-medium text-slate-900">
                            {claim.claimReferenceNo}
                          </td>
                          <td className="px-5 py-3.5 font-medium text-slate-900 max-w-xs truncate">
                            {claim.itemTitle || 'Belonging'}
                          </td>
                          <td className="px-5 py-3.5 font-mono-numbers">
                            {new Date(claim.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={claim.status} type="claim" />
                          </td>
                          <td className="px-5 py-3.5 text-xs text-slate-500">
                            {claim.adminNotes || 'Under initial review by moderation team'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No ownership claims filed</h3>
                <p className="text-xs text-slate-500">
                  If an item listed on FindBack LK belongs to you, submit private proof to claim ownership.
                </p>
                <Link
                  to="/verify"
                  className="inline-block mt-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                >
                  File Ownership Claim
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-3">
            {notifications.length > 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                      notif.isRead ? 'bg-white' : 'bg-blue-50/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        )}
                        <span>{notif.title}</span>
                      </div>
                      <p className="text-xs text-slate-600">{notif.message}</p>
                      <div className="text-[11px] text-slate-400 font-mono-numbers">
                        {new Date(notif.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {notif.link && (
                        <Link
                          to={notif.link}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                      )}
                      {!notif.isRead && (
                        <button
                          onClick={() => markNotifAsRead(notif.id)}
                          className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <Bell className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No notifications</h3>
                <p className="text-xs text-slate-500">
                  Updates on your reports and verification claims will appear here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE & CONTACT PREFERENCES */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Profile &amp; Notification Preferences
            </h2>

            {profileSaved && (
              <div className="mb-4 p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Profile details saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Account ID)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone (+94 Sri Lanka)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Sri Lanka District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  {SRI_LANKA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist} District
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
                >
                  Update Information
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
