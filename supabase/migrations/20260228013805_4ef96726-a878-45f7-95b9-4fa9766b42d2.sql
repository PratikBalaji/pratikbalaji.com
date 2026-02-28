
-- Explicit deny policies for skills table write operations
CREATE POLICY "Prevent public skill inserts"
ON public.skills FOR INSERT
WITH CHECK (false);

CREATE POLICY "Prevent public skill updates"
ON public.skills FOR UPDATE
USING (false);

CREATE POLICY "Prevent public skill deletes"
ON public.skills FOR DELETE
USING (false);

-- Harden handle_new_user with input validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  clean_display_name TEXT;
  clean_avatar_url TEXT;
BEGIN
  clean_display_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'display_name'), ''),
    NEW.email
  );
  IF LENGTH(clean_display_name) > 100 THEN
    clean_display_name := SUBSTRING(clean_display_name, 1, 100);
  END IF;

  clean_avatar_url := TRIM(NEW.raw_user_meta_data->>'avatar_url');
  IF clean_avatar_url IS NOT NULL AND NOT clean_avatar_url ~ '^https?://' THEN
    clean_avatar_url := NULL;
  END IF;

  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (NEW.id, clean_display_name, clean_avatar_url);
  RETURN NEW;
END;
$$;
