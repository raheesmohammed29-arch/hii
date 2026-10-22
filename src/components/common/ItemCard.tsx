import React from 'react';
import { Link } from 'react-router-dom';
import { ItemReport } from '../../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Calendar, Tag, ArrowUpRight, Database, Sparkles } from 'lucide-react';

interface ItemCardProps {
  item: ItemReport;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const isLost = item.reportType === 'lost';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors flex flex-col h-full shadow-xs">
      {/* Visual Top Bar / Image */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // Fallback to stylized SVG placeholder if image URL fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <Tag className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs font-medium">No Public Image Provided</span>
          </div>
        )}

        {/* Database Origin Indicator (Distinguishing Sample from Live DB) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-md text-[11px] font-medium text-slate-700 shadow-xs border border-slate-200/80">
          {item.isSample ? (
            <>
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              <span>Sample Record</span>
            </>
          ) : (
            <>
              <Database className="w-3 h-3 text-teal-600 shrink-0" />
              <span className="text-teal-900 font-semibold">Live Database</span>
            </>
          )}
        </div>

        {/* Report Type Header (Lost vs Found) */}
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-900/90 backdrop-blur-xs text-white rounded-md text-[11px] font-semibold tracking-wide uppercase">
          {isLost ? 'Lost Item' : 'Found Item'}
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Unboxed Metadata Line with typographic separators */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span className="font-mono-numbers text-slate-600 font-medium">{item.referenceNo}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{item.category}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{item.district}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-1 hover:text-blue-600 transition-colors">
          <Link to={`/items/${item.id}`}>{item.title}</Link>
        </h3>

        {/* Public-Safe Description */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
          {item.description}
        </p>

        {/* Location & Date Details */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.approximateLocation}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Date: {item.dateOccurred}</span>
          </div>
        </div>

        {/* Card Footer: Status and Action Link */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <StatusBadge status={item.status} type="report" />

          <Link
            to={`/items/${item.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
