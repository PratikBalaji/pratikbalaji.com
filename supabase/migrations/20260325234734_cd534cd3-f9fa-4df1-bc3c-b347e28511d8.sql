
-- 1. Replace overly permissive INSERT policy on contact_messages with input validation
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Rate-limited contact submissions" ON public.contact_messages
  FOR INSERT TO public
  WITH CHECK (
    -- Require non-empty fields with length limits
    length(trim(name)) > 0 AND length(trim(name)) <= 100
    AND length(trim(email)) > 0 AND length(trim(email)) <= 255
    AND length(trim(message)) > 0 AND length(trim(message)) <= 2000
    -- Basic email format check
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    -- Block HTML/script injection at DB level
    AND name !~* '<[^>]*>'
    AND message !~* '<script'
  );

-- 2. Replace overly permissive INSERT policy on meeting_requests with input validation
DROP POLICY IF EXISTS "Anyone can submit meeting requests" ON public.meeting_requests;
CREATE POLICY "Validated meeting submissions" ON public.meeting_requests
  FOR INSERT TO public
  WITH CHECK (
    length(trim(name)) > 0 AND length(trim(name)) <= 100
    AND length(trim(email)) > 0 AND length(trim(email)) <= 255
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND name !~* '<[^>]*>'
    AND (message IS NULL OR length(trim(message)) <= 1000)
    AND (message IS NULL OR message !~* '<script')
  );

-- 3. Add rate limiting function for public inserts
CREATE OR REPLACE FUNCTION public.check_rate_limit(table_name text, ip_or_email text, max_per_hour int DEFAULT 5)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count int;
BEGIN
  -- Count recent inserts by email in last hour
  IF table_name = 'contact_messages' THEN
    SELECT count(*) INTO recent_count
    FROM public.contact_messages
    WHERE email = ip_or_email AND created_at > now() - interval '1 hour';
  ELSIF table_name = 'meeting_requests' THEN
    SELECT count(*) INTO recent_count
    FROM public.meeting_requests
    WHERE email = ip_or_email AND created_at > now() - interval '1 hour';
  ELSE
    RETURN true;
  END IF;
  RETURN recent_count < max_per_hour;
END;
$$;
