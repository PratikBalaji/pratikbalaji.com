import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, User, MessageSquare } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function ContactMessagesViewer() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setMessages(data);
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

  if (messages.length === 0) {
    return (
      <Card className="border-border/20 bg-card/40 backdrop-blur-xl">
        <CardContent className="p-8 text-center">
          <Mail className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No contact messages yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{messages.length} message{messages.length !== 1 ? 's' : ''}</p>
      {messages.map((msg) => (
        <Card key={msg.id} className="border-border/20 bg-card/40 backdrop-blur-xl shadow-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-accent" />
                <span className="text-sm font-medium text-foreground">{msg.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="text-xs">
                  {new Date(msg.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-muted-foreground" />
              <a href={`mailto:${msg.email}`} className="text-xs text-accent hover:underline">{msg.email}</a>
            </div>
            <div className="pt-1 border-t border-border/10">
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
