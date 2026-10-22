import React, { useState } from 'react';
import { 
  getSupabaseCredentials, 
  saveSupabaseCredentials, 
  clearSupabaseCredentials, 
  testSupabaseConnection, 
  isSupabaseConfigured 
} from '../../lib/supabase';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Copy, 
  ExternalLink, 
  Key, 
  Globe, 
  RefreshCw,
  Code
} from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionSuccess?: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ 
  isOpen, 
  onClose,
  onConnectionSuccess 
}) => {
  const currentCreds = getSupabaseCredentials();
  const [url, setUrl] = useState(currentCreds.url);
  const [key, setKey] = useState(currentCreds.key);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showSql, setShowSql] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setResult(null);
    const res = await testSupabaseConnection(url.trim(), key.trim());
    setTesting(false);
    setResult(res);
  };

  const handleSave = async () => {
    if (!url.trim() || !key.trim()) {
      setResult({ success: false, message: 'Please enter both Supabase URL and Anon Key.' });
      return;
    }
    setTesting(true);
    const testRes = await testSupabaseConnection(url.trim(), key.trim());
    setTesting(false);
    
    saveSupabaseCredentials(url, key);
    setResult(testRes);

    if (testRes.success) {
      setTimeout(() => {
        if (onConnectionSuccess) onConnectionSuccess();
        window.location.reload();
      }, 800);
    }
  };

  const handleDisconnect = () => {
    clearSupabaseCredentials();
    setUrl('');
    setKey('');
    setResult({ success: true, message: 'Disconnected from custom Supabase. Reset to default sandbox.' });
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const sampleSqlSnippet = `-- 1. Item Reports Table
CREATE TABLE IF NOT EXISTS public.item_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_no TEXT NOT NULL UNIQUE,
    user_id UUID,
    user_email TEXT,
    user_name TEXT,
    report_type TEXT NOT NULL CHECK (report_type IN ('lost', 'found')),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    private_identifying_details TEXT,
    district TEXT NOT NULL,
    approximate_location TEXT NOT NULL,
    date_occurred DATE NOT NULL,
    contact_preference TEXT NOT NULL DEFAULT 'platform_only',
    contact_phone TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'approved',
    is_sample BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ownership Claims Table
CREATE TABLE IF NOT EXISTS public.ownership_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_reference_no TEXT NOT NULL UNIQUE,
    item_id UUID,
    claimant_id UUID,
    claimant_name TEXT NOT NULL,
    claimant_email TEXT NOT NULL,
    claimant_phone TEXT NOT NULL,
    private_evidence_notes TEXT NOT NULL,
    private_proof_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sampleSqlSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Connect Real Supabase Database
              </h2>
              <p className="text-xs text-slate-500">
                Save lost &amp; found reports and ownership claims directly into your Supabase project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Connection Status */}
        <div className="p-3.5 rounded-xl border flex items-center justify-between text-xs bg-slate-50 border-slate-200">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="font-semibold text-slate-800">
              {isSupabaseConfigured() ? 'Live Supabase Connected' : 'Local Sandbox (Awaiting Credentials)'}
            </span>
          </div>
          {isSupabaseConfigured() && (
            <button
              onClick={handleDisconnect}
              className="text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Input Form */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Supabase Project URL</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project-id.supabase.co"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Found under Project Settings &rarr; API &rarr; Project URL
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              <span>Supabase Anon / Public API Key</span>
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Found under Project Settings &rarr; API &rarr; Project API Keys &rarr; anon / public
            </span>
          </div>
        </div>

        {/* Result Message */}
        {result && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-start gap-2 ${
              result.success
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {result.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            )}
            <div className="leading-relaxed">{result.message}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setShowSql(!showSql)}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showSql ? 'Hide SQL Schema' : 'View SQL Schema'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !url || !key}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={testing || !url || !key}
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              Save &amp; Connect Live
            </button>
          </div>
        </div>

        {/* SQL Schema Preview Collapsible */}
        {showSql && (
          <div className="p-4 bg-slate-900 rounded-xl text-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-teal-400 font-semibold">
                Supabase SQL Editor Commands:
              </span>
              <button
                onClick={copySqlToClipboard}
                className="text-xs text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto text-slate-300 max-h-48">
              {sampleSqlSnippet}
            </pre>
            <p className="text-[11px] text-slate-400">
              Run this in your <strong>Supabase Dashboard &rarr; SQL Editor</strong> to create the tables in seconds!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
