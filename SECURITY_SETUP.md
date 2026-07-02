# Security setup — two one-time steps

The dashboard code now supports locked-down access, but two switches live in
consoles that only you can flip. Until you do, everything keeps working
exactly as before — these steps just close the doors.

## 1. Redeploy the AI proxy worker

The worker now only answers requests coming from the dashboard itself
(`https://owlalum.github.io`), only allows the model the dashboard actually
uses, and caps response size. To activate:

```
wrangler deploy
```

That's it — the API key secret you already set is unchanged.

If the dashboard ever moves to a different address, add that address to
`ALLOWED_ORIGINS` at the top of `worker.js` and redeploy.

## 2. Lock the Firebase database

Today the database accepts reads/writes from anyone because the dashboard
has no login. The dashboard now signs in **anonymously** (invisible to you
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
