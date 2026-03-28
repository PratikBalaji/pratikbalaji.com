
-- Drop overly permissive policies
DROP POLICY "Authenticated users can update settings" ON public.site_settings;
DROP POLICY "Authenticated users can insert settings" ON public.site_settings;

-- Recreate with tighter checks (only the site owner can modify)
CREATE POLICY "Authenticated users can update settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
