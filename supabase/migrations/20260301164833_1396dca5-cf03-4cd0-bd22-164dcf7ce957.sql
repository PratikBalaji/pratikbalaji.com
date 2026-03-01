
CREATE TABLE public.meeting_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  requested_date DATE NOT NULL,
  requested_time TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.meeting_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit meeting requests"
ON public.meeting_requests
FOR INSERT
WITH CHECK (true);

CREATE POLICY "No public reads on meeting requests"
ON public.meeting_requests
FOR SELECT
USING (false);
