
-- Deny public INSERT on projects
CREATE POLICY "Prevent public project inserts"
ON public.projects FOR INSERT
WITH CHECK (false);

-- Deny public UPDATE on projects
CREATE POLICY "Prevent public project updates"
ON public.projects FOR UPDATE
USING (false);

-- Deny public DELETE on projects
CREATE POLICY "Prevent public project deletes"
ON public.projects FOR DELETE
USING (false);
