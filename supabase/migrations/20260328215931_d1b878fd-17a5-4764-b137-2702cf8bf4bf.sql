
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed for frontend)
CREATE POLICY "Site settings are publicly readable"
  ON public.site_settings FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Prevent public deletes
CREATE POLICY "Prevent public setting deletes"
  ON public.site_settings FOR DELETE
  TO public
  USING (false);

-- Seed default values
INSERT INTO public.site_settings (key, value) VALUES
  ('is_open_to_work', 'true'),
  ('current_location', 'Philadelphia, PA');
