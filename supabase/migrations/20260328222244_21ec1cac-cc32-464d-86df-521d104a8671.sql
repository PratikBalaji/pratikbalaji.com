
-- Allow authenticated users to manage projects
CREATE POLICY "Authenticated users can insert projects"
ON public.projects FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update projects"
ON public.projects FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete projects"
ON public.projects FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to manage skills
CREATE POLICY "Authenticated users can insert skills"
ON public.skills FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update skills"
ON public.skills FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete skills"
ON public.skills FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);
