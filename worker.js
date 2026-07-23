// Cloudflare Worker — Anthropic API proxy for Avery Dashboard
// Deploy: wrangler deploy
// Set secrets: wrangler secret put ANTHROPIC_API_KEY
//              wrangler secret put PROXY_SHARED_SECRET   (family AI passphrase)

// Defense layers, outermost first:
// 1. PROXY_SHARED_SECRET — the real gate. The Origin check below only
//    constrains browsers (curl/scripts can fake the header), so any script
//    that finds this URL in the public page source could otherwise use the
//    family's Anthropic key as a free LLM endpoint. The passphrase is NOT
//    embedded in the page: each family device enters it once (the dashboard
//    prompts on first 401 and stores it in that device's localStorage).
//    Until the secret is set in Cloudflare, the check is skipped so the
//    dashboard keeps working — set it to activate the gate.
// 2. Origin allowlist — stops casual cross-site browser use.
// 3. Model allowlist + max_tokens clamp + body-size cap — bounds worst-case
//    spend per request even for a caller who has the passphrase.
const ALLOWED_ORIGINS = [
  'https://owlalum.github.io',
];

// Both current-generation tiers are allowed so the dashboard can switch
// models without a worker redeploy; the dashboard picks which one to use.
const ALLOWED_MODELS = ['claude-opus-4-8', 'claude-sonnet-5'];
const MAX_TOKENS_CAP = 2048;
// The AI payload (school data + system prompt) runs ~50-150KB; 400KB leaves
// generous headroom while capping input-token cost per request.
const MAX_BODY_BYTES = 400_000;

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Proxy-Key',
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

    // Passphrase gate (active once PROXY_SHARED_SECRET is set in Cloudflare).
    if (env.PROXY_SHARED_SECRET) {
      const provided = request.headers.get('X-Proxy-Key') || '';
      if (provided !== env.PROXY_SHARED_SECRET) {
        return jsonResponse({ error: 'Passphrase required' }, 401, origin);
      }
    }

    try {
      const raw = await request.text();
      if (raw.length > MAX_BODY_BYTES) {
        return jsonResponse({ error: 'Request too large' }, 413, origin);
      }
      let body;
      try {
        body = JSON.parse(raw);
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
