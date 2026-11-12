// ====================================================================
// UNAVULINK DATABASE MIGRATION - 003_SECURE_AUTH_AND_PERMISSIONS.SQL
// Production-Ready Auth Triggers, RBAC Policies, Status Segregation,
// Password Reset Audit Logs & Administrative Safety Verification
// ====================================================================

-- 1. Create distinct status ENUMs if not existing
DO $$ BEGIN
    CREATE TYPE email_verification_status AS ENUM ('unverified', 'verified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_account_status AS ENUM ('active', 'suspended', 'disabled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE org_verification_status AS ENUM ('pending', 'approved', 'rejected', 'requires_resubmission');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE volunteer_service_status AS ENUM ('pending_approval', 'approved', 'rejected', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Enhance public.profiles with separate explicit status columns
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS email_status TEXT NOT NULL DEFAULT 'verified',
    ADD COLUMN IF NOT EXISTS org_verification TEXT NOT NULL DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS volunteer_status TEXT NOT NULL DEFAULT 'pending_approval',
    ADD COLUMN IF NOT EXISTS password_hash TEXT,
    ADD COLUMN IF NOT EXISTS email_verification_token TEXT,
    ADD COLUMN IF NOT EXISTS email_verification_sent_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS password_reset_token TEXT,
    ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS failed_login_count INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;

-- 3. Dedicated Email Dispatch & Audit Logs Table
CREATE TABLE IF NOT EXISTS public.email_delivery_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    recipient_role TEXT,
    subject TEXT NOT NULL,
    category TEXT NOT NULL, -- 'account', 'donor', 'acceptor', 'volunteer', 'admin'
    template_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'delivered', 'failed', 'queued'
    error_message TEXT,
    action_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.email_delivery_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email delivery logs" ON public.email_delivery_logs
    FOR SELECT USING (public.is_admin());

-- 4. Secure Administrative Audit Trail
CREATE TABLE IF NOT EXISTS public.auth_audit_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_email TEXT NOT NULL,
    action TEXT NOT NULL, -- 'LOGIN', 'LOGOUT', 'PASSWORD_RESET', 'ROLE_SWITCH_BLOCKED', 'STATUS_CHANGE'
    ip_address TEXT,
    user_agent TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.auth_audit_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can inspect auth audit logs" ON public.auth_audit_records
    FOR SELECT USING (public.is_admin());

-- 5. Automatic Profile Provisioning Trigger on auth.users Signup
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    requested_role user_role;
    user_full_name TEXT;
BEGIN
    requested_role := COALESCE((new.raw_user_meta_data->>'role')::user_role, 'Common People'::user_role);
    user_full_name := COALESCE(new.raw_user_meta_data->>'full_name', 'UnavuLink Member');

    -- Prevent self-granting Admin role from public registration
    IF requested_role = 'Admin' THEN
        requested_role := 'Common People'::user_role;
    END IF;

    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        email_status,
        account_status,
        org_verification,
        volunteer_status,
        verification_status,
        is_volunteer,
        volunteer_approved
    ) VALUES (
        new.id,
        new.email,
        user_full_name,
        requested_role,
        CASE WHEN new.email_confirmed_at IS NOT NULL THEN 'verified' ELSE 'unverified' END,
        'active',
        'pending',
        'pending_approval',
        'pending',
        (new.raw_user_meta_data->>'is_volunteer')::boolean IS TRUE,
        false
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        email_status = EXCLUDED.email_status;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
