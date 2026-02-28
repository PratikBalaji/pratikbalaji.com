import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Token refresh failed [${res.status}]: ${errText}`);
  }

  const data = await res.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID');
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET');
    const refreshToken = Deno.env.get('SPOTIFY_REFRESH_TOKEN');

    if (!clientId || !clientSecret || !refreshToken) {
      return new Response(JSON.stringify({
        is_playing: false,
        item: { name: 'Spotify Not Connected', artists: [{ name: 'Add credentials' }], album: { images: [] } },
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);

    // Try currently playing
    const nowRes = await fetch(NOW_PLAYING_URL, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (nowRes.status === 200) {
      const data = await nowRes.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Nothing playing — try recently played
    const recentRes = await fetch(RECENTLY_PLAYED_URL, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (recentRes.ok) {
      const recentData = await recentRes.json();
      const lastTrack = recentData.items?.[0]?.track;
      if (lastTrack) {
        return new Response(JSON.stringify({
          is_playing: false,
          item: lastTrack,
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    return new Response(JSON.stringify({
      is_playing: false,
      item: null,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Spotify error:', error);
    return new Response(JSON.stringify({
      is_playing: false,
      item: { name: 'Error', artists: [{ name: 'Check logs' }], album: { images: [] } },
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
