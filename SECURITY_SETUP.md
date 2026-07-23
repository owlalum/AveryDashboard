# Security setup — two one-time steps

The dashboard code now supports locked-down access, but two switches live in
consoles that only you can flip. Until you do, everything keeps working
exactly as before — these steps just close the doors.

## 1. Set the AI passphrase and redeploy the worker

The worker's origin check only stops *browsers* — a script with `curl` can
fake the Origin header, and the worker URL is visible in the page source, so
until this step anyone could quietly spend the Anthropic key. The July 2026
update adds a **family passphrase**: the worker refuses requests without it,
and the passphrase is never in the page source — each family device is
prompted once and remembers it.

Pick a passphrase (anything memorable — it's shared by the family, not per
person), then in the `AveryDashboard` folder:

```
wrangler secret put PROXY_SHARED_SECRET
```

(paste the passphrase when prompted)

```
wrangler deploy
```

Then open the dashboard, run an AI Analysis, and enter the passphrase when
asked — once per device (yours, your spouse's, Avery's). The worker also now
caps request size (400 KB) alongside the existing model allowlist and
response cap, so even a leaked passphrase bounds the damage per request.

**Optional extra:** in the Cloudflare dashboard (Workers → avery-ai-proxy →
Settings), you can add a rate-limiting rule (e.g. 10 requests/minute) as a
final backstop. Not required — the passphrase is the real gate.

If the dashboard ever moves to a different address, add that address to
`ALLOWED_ORIGINS` at the top of `worker.js` and redeploy.

## 2. Lock the Firebase database — ✅ DONE (verified 2026-07-23)

Rules requiring a signed-in visitor were published 2026-07-02 and Anonymous
sign-in is enabled; an unauthenticated read probe returns PERMISSION_DENIED.
Nothing to do here — the steps below are kept for reference (e.g. if the
project is ever recreated).

Originally: the database accepted reads/writes from anyone because the
dashboard has no login. The dashboard now signs in **anonymously** (invisible to you
and Avery — no accounts, no passwords), which lets the database require a
signed-in visitor. Two clicks in the Firebase console:

**Step A — enable Anonymous sign-in:**
1. Go to https://console.firebase.google.com → project **avery-dashboard**
2. Build → **Authentication** → Get started (if prompted) → **Sign-in method** tab
3. Enable **Anonymous** and Save.

**Step B — tighten the rules** (do this only AFTER Step A):
1. Build → **Firestore Database** → **Rules** tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /dashboards/main {
      allow read, write: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Publish.

**Order matters:** if you publish the rules before enabling Anonymous
sign-in, the dashboard loses sync (it falls back to device-local storage
and will say so in the sync indicator). If that happens, just complete
Step A and reload.

### What this does and doesn't protect against

- ✅ Stops random strangers/scripts from reading or overwriting the data.
- ⚠️ Anonymous sign-in is a low fence, not a vault: someone who studies the
  page source could still sign in anonymously themselves. For a family
  dashboard this is a reasonable trade against the convenience of no login
  screen. The step up, if ever wanted, is real sign-in (e.g. Google accounts
  restricted to your two emails) — a bigger change to the app.
- The data itself contains no passwords or financial account numbers; the
  main assets being protected are Avery's academic profile and your notes.
