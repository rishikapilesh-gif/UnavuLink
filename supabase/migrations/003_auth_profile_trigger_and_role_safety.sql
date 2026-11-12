-- UnavuLink migration 003: create a profile for every confirmed Supabase Auth identity.
-- Safe/additive: does not drop or rewrite existing user records.
-- Public registration can never assign the Admin role.

CREATE OR REPLACE FUNCTION public.handle_unavulink_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_role text;
  safe_role public.user_role;
  volunteer_flag boolean;
BEGIN
  requested_role := COALESCE(NEW.raw_user_meta_data ->> 'role', 'Common People');
  IF requested_role NOT IN ('Donor', 'Acceptor', 'NGO', 'Common People') THEN
    requested_role := 'Common People';
  END IF;
  safe_role := requested_role::public.user_role;
  volunteer_flag := lower(COALESCE(NEW.raw_user_meta_data ->> 'is_volunteer', 'false')) = 'true'
                    AND safe_role = 'Common People';

  INSERT INTO public.profiles (
    id, full_name, email, phone, role, verification_status, account_status,
    city, state, is_volunteer, volunteer_approved
  )
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''), 'UnavuLink Member'),
    lower(NEW.email),
    NULLIF(NEW.raw_user_meta_data ->> 'phone', ''),
    safe_role,
    'pending',
    'active',
    COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'city', ''), 'Coimbatore'),
    COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'state', ''), 'Tamil Nadu'),
    volunteer_flag,
    false
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_unavulink ON auth.users;
CREATE TRIGGER on_auth_user_created_unavulink
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_unavulink_new_user();

-- Remove the original public-read policy: account profiles contain private contact data.
DROP POLICY IF EXISTS "Public profiles are readable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can read own profile" ON public.profiles;
CREATE POLICY "Authenticated users can read own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own basic profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (auth.uid() = id OR public.is_admin());

-- Prevent privilege escalation through direct profile updates.
CREATE OR REPLACE FUNCTION public.prevent_unavulink_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
    IF NEW.role IS DISTINCT FROM OLD.role
       OR NEW.verification_status IS DISTINCT FROM OLD.verification_status
       OR NEW.is_volunteer IS DISTINCT FROM OLD.is_volunteer
       OR NEW.volunteer_approved IS DISTINCT FROM OLD.volunteer_approved
       OR NEW.account_status IS DISTINCT FROM OLD.account_status THEN
      RAISE EXCEPTION 'You are not allowed to modify privileged account fields';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_unavulink_profile_privileges ON public.profiles;
CREATE TRIGGER protect_unavulink_profile_privileges
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_unavulink_role_escalation();
