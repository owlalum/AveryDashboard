# Decision-season Gmail watcher

A scheduled Claude task that scans **owlalum@gmail.com** each day for new
admission / honors / housing / scholarship notifications from Avery's 11
schools and pings you when something lands. It is a companion to the
**Decision & Deposit Timeline** on the dashboard (the timeline tells you *when*
to expect a decision; the watcher tells you *the moment one arrives*).

## Important: how to actually schedule it (durable)

This prompt has to be scheduled the **same way the weekly refresh agent is** —
as an account-level scheduled task in your Claude setup. A watcher created from
inside a normal chat session is session-only and dies when the session goes
idle, so it won't survive decision season. Add it where your weekly scan lives,
on a **daily** cadence (decisions post on fixed days; a daily check catches them
within hours). Suggested time: a bit after 4 pm ET on weekdays, since several
schools (UGA, GT, OSU) release at ~4 pm ET. Turn it off after May 1.

## Coverage caveat — widen your forward keywords

The watcher only sees what reaches **owlalum@gmail.com**. Avery's iCloud
auto-forwards currently fire only on subjects containing **"honors"** or
**"decision."** That misses housing, scholarship, waitlist, and many admit
emails (the Auburn housing email only arrived because Avery forwarded it by
hand). Add these forward keywords on averyedenney@icloud.com:
`housing`, `admission`, `admitted`, `congratulations`, `waitlist`,
`scholarship`, `deposit`, `award`, `financial aid`.

## The scheduled prompt (paste this)

> You are Avery Denney's college decision-season email watcher. Avery (Class of
> 2027, Fall 2027 enrollment) has applied to 11 schools: Auburn (already
> accepted), Clemson, NC State, Ohio State, Purdue, University of Georgia,
> UT Knoxville, University of Wisconsin-Madison, Virginia Tech, University of
> Florida, Georgia Tech.
>
> Search owlalum@gmail.com (Gmail tools) for messages received since your last
> run (use `newer_than:2d`) from or about those schools — admission decisions,
> honors-college decisions, housing/room-selection notices, scholarship/merit
> and financial-aid award letters, waitlist/deferral notices, and deposit
> deadlines. Read the full thread of anything that looks like a real decision or
> a dated action item (don't rely on snippets).
>
> Then send ONE push notification summarizing only what is NEW and actionable:
> which school, what happened (admitted / deferred / waitlisted / honors result
> / award amount / housing slot), and any deadline. If a financial-aid award
> letter arrived, note the award amount and the school so the dashboard's net
> cost can be updated. If nothing new and actionable arrived, send nothing (or a
> brief "no new decisions" note at most once a day).
>
> Do NOT send emails, reply, or take any external action. Only read and notify.
> Report findings; the family updates the dashboard and responds to schools.

## What it will NOT do

- It will not log into application portals (those are password/2FA-protected and
  not reachable by a background task) — email is the reliable signal.
- It will not change the live dashboard data (that lives in the family's
  browser/Firestore). It reports; you update the dashboard, or ask Claude to
  prep a PR.
