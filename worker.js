// Cloudflare Worker — Anthropic API proxy for Avery Dashboard
// Deploy: wrangler deploy
// Set secret: wrangler secret put ANTHROPIC_API_KEY

// Only the dashboard itself may use this proxy. Requests from any other
// origin (or with no Origin header, i.e. curl/scripts) are rejected so the
// API key can't be spent by third parties who find this URL in the page
// source. Add an origin here if the dashboard ever moves.
const ALLOWED_ORIGINS = [
  'https://owlalum.github.io',
];

// Server-side clamps: the client's model/max_tokens are request data, not
// policy — enforce both here so a crafted request can't run an expensive
// model or huge completion on the family's key.
const ALLOWED_MODELS = ['claude-sonnet-4-20250514'];
const MAX_TOKENS_CAP = 2048;

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function jsonResponse(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/api/analyze' || request.method !== 'POST') {
      return jsonResponse({ error: 'Not found' }, 404, origin);
    }

    try {
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return jsonResponse({ error: 'Invalid JSON body' }, 400, origin);
      }
      if (!ALLOWED_MODELS.includes(body.model)) {
        return jsonResponse({ error: 'Model not allowed' }, 400, origin);
      }
      body.max_tokens = Math.min(
        Number.isFinite(body.max_tokens) ? body.max_tokens : MAX_TOKENS_CAP,
        MAX_TOKENS_CAP
      );

      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });
      const data = await resp.text();
      return new Response(data, {
        status: resp.status,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return jsonResponse({ error: 'Proxy error', detail: err.message }, 500, origin);
    }
  },
};
