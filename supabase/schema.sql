-- ==============================================================================
-- FindBack LK — Lost & Found Verification Network Database Schema (PostgreSQL)
-- Supabase Architecture with Row Level Security (RLS) & Admin Role Verification
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    district TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Item Reports Table
CREATE TABLE IF NOT EXISTS public.item_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_no TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_email TEXT,
    user_name TEXT,
    report_type TEXT NOT NULL CHECK (report_type IN ('lost', 'found')),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Electronics', 'Documents', 'Bags', 'Keys', 'Jewellery', 
        'Clothing', 'Pets', 'Books', 'Other'
    )),
    description TEXT NOT NULL,
    private_identifying_details TEXT, -- Hidden from public views, accessible only to owner & admin
    district TEXT NOT NULL,
    approximate_location TEXT NOT NULL, -- Safe public descriptor (e.g., 'Fort Railway Station')
    date_occurred DATE NOT NULL,
    contact_preference TEXT NOT NULL DEFAULT 'platform_only' CHECK (
        contact_preference IN ('platform_only', 'email', 'phone_masked')
    ),
    contact_phone TEXT, -- Masked / protected
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending_review' CHECK (
        status IN ('pending_review', 'approved', 'under_claim', 'recovered', 'closed')
    ),
    is_sample BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Item Images Table
CREATE TABLE IF NOT EXISTS public.item_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.item_reports(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Ownership Claims Table (Strictly Private Evidence)
CREATE TABLE IF NOT EXISTS public.ownership_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_reference_no TEXT NOT NULL UNIQUE,
    item_id UUID NOT NULL REFERENCES public.item_reports(id) ON DELETE CASCADE,
    claimant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    claimant_name TEXT NOT NULL,
    claimant_email TEXT NOT NULL,
    claimant_phone TEXT NOT NULL,
    private_evidence_notes TEXT NOT NULL, -- Distinctive signs, secret engraving, contents
    private_proof_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'under_review', 'approved', 'rejected')
    ),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('report', 'claim', 'user', 'system')),
    target_id TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- Indexes for High Performance Queries
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_item_reports_status ON public.item_reports(status);
CREATE INDEX IF NOT EXISTS idx_item_reports_category ON public.item_reports(category);
CREATE INDEX IF NOT EXISTS idx_item_reports_district ON public.item_reports(district);
CREATE INDEX IF NOT EXISTS idx_item_reports_date ON public.item_reports(date_occurred DESC);
CREATE INDEX IF NOT EXISTS idx_item_reports_user ON public.item_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_ownership_claims_item ON public.ownership_claims(item_id);
CREATE INDEX IF NOT EXISTS idx_ownership_claims_claimant ON public.ownership_claims(claimant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- ==============================================================================
-- Helper Functions & Admin Verification
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile record automatically upon Supabase auth sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Member'),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ownership_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are readable by self and admins"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Item Reports Policies
-- Anyone (including guests) can browse approved reports (with public fields)
CREATE POLICY "Anyone can view approved reports"
  ON public.item_reports FOR SELECT
  USING (status IN ('approved', 'under_claim', 'recovered') OR auth.uid() = user_id OR public.is_admin());

-- Authenticated users can insert their own reports
CREATE POLICY "Authenticated users can create reports"
  ON public.item_reports FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Owners can edit reports while pending_review
CREATE POLICY "Users can update own pending reports"
  ON public.item_reports FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

-- Only admins can delete reports
CREATE POLICY "Only admins can delete reports"
  ON public.item_reports FOR DELETE
  USING (public.is_admin());

-- 3. Ownership Claims Policies (Strictly Private)
-- Claimant can see their own claims; Admins can see all claims
CREATE POLICY "Claimants and admins can view ownership claims"
  ON public.ownership_claims FOR SELECT
  USING (auth.uid() = claimant_id OR public.is_admin());

-- Authenticated users can submit a claim
CREATE POLICY "Authenticated users can submit claims"
  ON public.ownership_claims FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only admins can update claim status and review notes
CREATE POLICY "Only admins can update claim status"
  ON public.ownership_claims FOR UPDATE
  USING (public.is_admin());

-- 4. Notifications Policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark own notifications as read"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- 5. Admin Audit Logs Policies
CREATE POLICY "Only admins can view audit logs"
  ON public.admin_audit_logs FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Only admins or triggers can insert audit logs"
  ON public.admin_audit_logs FOR INSERT
  WITH CHECK (public.is_admin());
