# FindBack LK — Lost & Found Verification Network (Sri Lanka)

FindBack LK is a secure, modern lost and found verification network engineered specifically for Sri Lanka with direct **Supabase PostgreSQL & Auth** backend integration.

---

## 1. Direct Real Supabase Integration

All reported lost/found belongings, ownership verification claims, admin decisions, and user accounts save directly into your **real Supabase PostgreSQL database**.

### How to Connect Your Real Supabase Project (2 Simple Steps):

#### Step 1: Run the Database Schema in Supabase
1. Log in to [supabase.com](https://supabase.com) and create or open your project.
2. In the Supabase left menu, click **SQL Editor** &rarr; **New Query**.
3. Copy all contents of `supabase/schema.sql` from this project and click **Run**.
   - This creates `item_reports`, `ownership_claims`, `profiles`, `admin_audit_logs`, and `notifications` tables with complete Row Level Security (RLS) policies.

#### Step 2: Connect the Application
You can connect in either of two ways:

- **Method A (Direct in the UI — Easiest)**:
  1. Click the **"Connect Real Supabase"** button located at the top-right of the navigation bar.
  2. Paste your **Supabase Project URL** (e.g. `https://xxxx.supabase.co`).
  3. Paste your **Supabase Anon / Public API Key** (e.g. `eyJhbGci...`).
  4. Click **"Test Connection"** to verify, then click **"Save & Connect Live"**.
  5. The indicator will immediately turn green: **"Supabase Connected"**, and every new report and claim will write straight to your live database!

- **Method B (via `.env` file)**:
  1. Add your keys to `.env`:
     ```env
     VITE_SUPABASE_URL="https://your-project-id.supabase.co"
     VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."
     ```
  2. Run `npm run dev`.

---

## 2. Features

- **25 Districts of Sri Lanka**: Full coverage across Colombo, Kandy, Galle, Jaffna, Gampaha, Kurunegala, etc.
- **Fraud Prevention**: Confidential identifying details (serial numbers, hidden markings) are kept private and verified only during administrative review.
- **Police Handover Coordination**: High-value belongings are guided through Sri Lanka Police desk verification.
- **Zero-Pill Typography**: Clean, uncluttered design using Deep Navy Blue, Electric Blue, Teal, and tabular numbers for reference codes.
