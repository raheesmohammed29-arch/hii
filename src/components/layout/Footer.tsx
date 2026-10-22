import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, MapPin, Heart, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5 text-teal-300" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                FindBack <span className="text-blue-400">LK</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Sri Lanka&apos;s verified lost and found network. Designed to help citizens report misplaced items, verify authentic ownership, and safely reunite people with their belongings across all 25 districts.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Islandwide Island Coverage · Western, Central, Southern &amp; All Provinces</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">Platform</div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/items" className="hover:text-white transition-colors">
                  Browse All Items
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition-colors">
                  Report a Lost Item
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition-colors">
                  Publish a Found Item
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-white transition-colors">
                  Claim Ownership
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Citizen Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification & Trust */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">Security &amp; Safety</div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Verification Principles
                </Link>
              </li>
              <li>
                <Link to="/about#safety" className="hover:text-white transition-colors">
                  Public Safe-Meeting Tips
                </Link>
              </li>
              <li>
                <Link to="/about#police" className="hover:text-white transition-colors">
                  Police Station Protocol
                </Link>
              </li>
              <li>
                <a 
                  href="/supabase/schema.sql" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>PostgreSQL Database Schema</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">Inquiries</div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>support@findback.lk</span>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Help Desk &amp; FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Report Fraudulent Claim
                </Link>
              </li>
              <li>
                <span className="text-slate-500 text-[11px]">
                  Police Emergency Hotline: 119
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 FindBack LK. Designed for community trust in Sri Lanka.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with care for Sri Lankan citizens</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
