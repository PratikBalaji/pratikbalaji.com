-- Allow authenticated users to read contact messages
CREATE POLICY "Authenticated users can read contact messages"
ON public.contact_messages FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to read meeting requests
CREATE POLICY "Authenticated users can read meeting requests"
ON public.meeting_requests FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);