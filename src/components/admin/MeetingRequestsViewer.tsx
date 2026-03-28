import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Mail, MessageSquare } from 'lucide-react';

interface MeetingRequest {
  id: string;
  name: string;
  email: string;
  requested_date: string;
  requested_time: string;
  message: string | null;
  created_at: string;
}

export default function MeetingRequestsViewer() {
  const [requests, setRequests] = useState<MeetingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('meeting_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setRequests(data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="border-border/20 bg-card/40 backdrop-blur-xl">
        <CardContent className="p-8 text-center">
          <Calendar className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No meeting requests yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{requests.length} request{requests.length !== 1 ? 's' : ''}</p>
      {requests.map((req) => (
        <Card key={req.id} className="border-border/20 bg-card/40 backdrop-blur-xl shadow-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-accent" />
                <span className="text-sm font-medium text-foreground">{req.name}</span>
              </div>
              <Badge variant="outline" className="text-xs border-accent/30 text-accent">
                {new Date(req.requested_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {req.requested_time}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-muted-foreground" />
              <a href={`mailto:${req.email}`} className="text-xs text-accent hover:underline">{req.email}</a>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="text-xs">
                Submitted {new Date(req.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
            {req.message && (
              <div className="pt-1 border-t border-border/10">
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{req.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
