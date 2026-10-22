import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ItemCard } from '../components/common/ItemCard';
import { 
  ItemCategory, 
  ITEM_CATEGORIES, 
  SRI_LANKA_DISTRICTS, 
  ReportType, 
  ReportStatus 
} from '../types';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  PlusCircle, 
  Database, 
  Sparkles,
  MapPin,
  Tag
} from 'lucide-react';

export const LostFoundPage: React.FC = () => {
  const { reports, loading } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params or state
  const typeFilter = searchParams.get('type') || 'all';
  const categoryFilter = searchParams.get('category') || 'all';
  const districtFilter = searchParams.get('district') || 'all';
  const statusFilter = searchParams.get('status') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const originFilter = searchParams.get('origin') || 'all'; // all, sample, live

  // Filter application
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesRef = item.referenceNo.toLowerCase().includes(q);
        const matchesLoc = item.approximateLocation.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesRef && !matchesLoc) {
          return false;
        }
      }

      // Type (Lost / Found)
      if (typeFilter !== 'all' && item.reportType !== typeFilter) {
        return false;
      }

      // Category
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      // District
      if (districtFilter !== 'all' && item.district !== districtFilter) {
        return false;
      }

      // Status
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Origin (Sample vs Live DB)
      if (originFilter === 'sample' && !item.isSample) return false;
      if (originFilter === 'live' && item.isSample) return false;

      return true;
    });
  }, [reports, searchQuery, typeFilter, categoryFilter, districtFilter, statusFilter, originFilter]);

  const updateParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val === 'all' || !val) {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Browse Lost &amp; Found Items
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Search verified reports across Sri Lanka. Filter by district, category, or report type.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/report?type=lost"
              className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Lost</span>
            </Link>
            <Link
              to="/report?type=found"
              className="px-4 py-2.5 text-xs font-semibold text-slate-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-teal-700" />
              <span>Report Found</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          {/* Search Input Row */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateParam('q', e.target.value)}
              placeholder="Search by item name, description, location (e.g. 'Fort Station', 'Samsung', 'NIC')..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Interactive Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
            {/* 1. Report Type Filter */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Report Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => updateParam('type', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types (Lost &amp; Found)</option>
                <option value="lost">Lost Belongings</option>
                <option value="found">Found Items</option>
              </select>
            </div>

            {/* 2. Category Filter */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => updateParam('category', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. District Filter (All 25 Sri Lankan Districts) */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Sri Lanka District
              </label>
              <select
                value={districtFilter}
                onChange={(e) => updateParam('district', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All 25 Districts</option>
                {SRI_LANKA_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Status Filter */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Listing Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => updateParam('status', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Active Listings</option>
                <option value="under_claim">Under Verification</option>
                <option value="recovered">Recovered &amp; Returned</option>
                <option value="pending_review">Pending Review</option>
              </select>
            </div>

            {/* 5. Origin Filter (Sample vs Live DB) */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Data Origin
              </label>
              <select
                value={originFilter}
                onChange={(e) => updateParam('origin', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Records</option>
                <option value="live">Live Community DB Only</option>
                <option value="sample">Sample Demonstrations Only</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges & Reset Button */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <span className="font-medium text-slate-700">
                Showing {filteredReports.length} of {reports.length} reports
              </span>
              {(typeFilter !== 'all' || categoryFilter !== 'all' || districtFilter !== 'all' || statusFilter !== 'all' || originFilter !== 'all' || searchQuery) && (
                <span className="text-blue-600 font-medium">· Filtered</span>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>

        {/* Items Grid View */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 animate-pulse">
                <div className="h-48 bg-slate-200 rounded-lg"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-12 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No matching reports found</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We couldn&apos;t find any item matching your current search parameters. Try broadening your filter options or report a new lost/found item.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
              <Link
                to="/report"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
              >
                Create New Report
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
