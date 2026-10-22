import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { SupabaseModal } from '../common/SupabaseModal';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  User, 
  Bell, 
  LogOut, 
  ShieldAlert, 
  PlusCircle,
  Database,
  SlidersHorizontal
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isSupabaseActive, switchDemoRole } = useAuth();
  const { notifications } = useData();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Top Connectivity Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-400"></span>
            <span className="text-slate-300">
              Sri Lanka Lost &amp; Found Verification Network · 25 Districts
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Supabase Status & Setup Trigger */}
            <button
              onClick={() => setSupabaseModalOpen(true)}
              className="flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
              title="Configure real Supabase PostgreSQL connection"
            >
              <Database className={`w-3 h-3 ${isSupabaseActive ? 'text-teal-400' : 'text-amber-400'}`} />
              <span>
                {isSupabaseActive ? (
                  <span className="text-teal-300 font-semibold">Supabase Connected</span>
                ) : (
                  <span className="text-amber-300 font-medium">Connect Real Supabase</span>
                )}
              </span>
            </button>

            {/* Quick Role Switcher for instant testing */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
              >
                Role: <span className="font-semibold text-white capitalize">{user?.role || 'Guest'}</span>
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 top-6 w-52 bg-white text-slate-900 rounded-lg shadow-xl border border-slate-200 p-2 z-50">
                  <div className="text-[11px] font-semibold text-slate-500 px-2 py-1 uppercase tracking-wider">
                    Quick Role Test
                  </div>
                  <button
                    onClick={() => {
                      switchDemoRole('user');
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span>Regular Citizen</span>
                    {user?.role === 'user' && <span className="text-blue-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('admin');
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span>Staff Moderator</span>
                    {user?.role === 'admin' && <span className="text-blue-600 font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-8">
          {/* Zone 1: Brand title wordmark */}
          <Link to="/" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-800 transition-colors">
              <ShieldCheck className="w-6 h-6 text-teal-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                FindBack <span className="text-blue-600">LK</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-600 -mt-0.5">
                Verification Network
              </span>
            </div>
          </Link>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <Link
              to="/items"
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
                isActive('/items') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Browse Items
            </Link>
            <Link
              to="/report"
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
                isActive('/report') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Report Item
            </Link>
            <Link
              to="/verify"
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
                isActive('/verify') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Verify Ownership
            </Link>
            <Link
              to="/about"
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
                isActive('/about') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
                isActive('/contact') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Contact &amp; FAQ
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`whitespace-nowrap shrink-0 flex items-center gap-1.5 text-blue-700 font-semibold px-2.5 py-1 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors ${
                  isActive('/admin') ? 'ring-1 ring-blue-400' : ''
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* Zone 3: 1 primary action or user control */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 pl-3 pr-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="max-w-[120px] truncate">{user.fullName}</span>
                </Link>

                <Link
                  to="/report"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Item</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  Log In
                </Link>
                <Link
                  to="/report"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                >
                  Report Item
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/items"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Browse Items
              </Link>
              <Link
                to="/report"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Report Lost or Found Item
              </Link>
              <Link
                to="/verify"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Ownership Verification
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Contact &amp; FAQ
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSupabaseModalOpen(true);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg flex items-center justify-between"
              >
                <span>Supabase Database Settings</span>
                <Database className="w-4 h-4 text-teal-600" />
              </button>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg"
                >
                  Admin Moderation Console
                </Link>
              )}
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-medium text-slate-800 bg-slate-100 rounded-lg flex items-center justify-between"
                  >
                    <span>User Dashboard</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 text-xs font-semibold text-white bg-blue-700 rounded-lg"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Supabase Connection Modal */}
      <SupabaseModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </>
  );
};
