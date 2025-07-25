# Vouch for Me - Tasks

[Back to Project Board](./BOARD.md)

<br>

- AC MODIFICATION Types
  - [AC-MOD_NOT-POSSIBLE-ALT-SOLUTION]

- REJECTION Types
  - [TECH-NOT-POSSIBLE]
  - [TECH-NOT-BEST-PRACTICE]
  - [AT-CUSTOMER-REQUEST]
  - [NO-LONGER-NEEDED]

<br>

## (Complete) VOUCH-000 - Project scaffolding

### Description:

^^

- Sveltekit for now...

### Acceptance Criteria:

Verified By cube on: 6/29/25

<br>

## (Complete) VOUCH-001 - Sign-in via email page (non-func, display only)

### Description:

^^

### Acceptance Criteria:

Verified By cube on: 6/29/25

<br>

## (Complete) VOUCH-002 - Deploy to fly.io dev env

### Description:

^^

### Acceptance Criteria:

Verified By cube on: 6/29/25

<br>

## (Complete) VOUCH-003 - Simulate email auth flow

### Description:

^^

Until a more permanent auth provider is actually used (firebase, supabase, self-hosted...),
simulate the email link sign-in flow via svelte-kit auth layouts/locals

Return a simple user object (uuid, ~~~email~~~, invitee_uid, ~~~invitee_display_name~~~)

store in local storage, add sign-out button to remove

### Acceptance Criteria:

Verified By cube on: 6/30/25

<br>

## (Complete) VOUCH-004 - View invitee inventory or profile setup (non-func, display only)

### Description:

^^

upon their first log in, allow user to see their invitees inventory or continue setup process.
for now scaffold pages, but non-func.

later on the user's first visit will be store in the backend somehow, for now continuous.

### Acceptance Criteria:

Verified By cube on: 7/7/25

<br>

## (Complete) VOUCH-005 - View invitee inventory

### Description:

^^

mock up cards, list/detail views, request items (not saved)

### Acceptance Criteria:

Verified By cube on: 7/8/25

<br>

## (Complete) VOUCH-006 - Profile Setup

### Description:

^^

-user details tab
-inventory

### Acceptance Criteria:

Verified By cube on: 7/15/25

<br>

## (Complete) VOUCH-007 - Profile Setup Pages - Save form data to svelte backend

### Description:

^^

- simulate on sveltekit backend, try to add delay for ui spinner plz
- display new item on ui
- ~~save to local storage for now~~

### Acceptance Criteria:

going to impl supabase, no point in saving to local storage. maybe as a fallback for when save to cloud doesnt work!

Verified By cube on: 7/15/25

<br>

## (Complete) VOUCH-008 - sign-in page ad

### Description:

^^

- cycle between 7 diff videos per day, to get a good feel for irl
- planning to make these for non-profit or free ad-runs locally...

### Acceptance Criteria:

Verified By cube on: 7/15/25

<br>

## (Deferred) VOUCH-009 - home page tab/after second-login, landing page

### Description:

^^

- new item postings via friends
- search
- network tab (find friends)

### Acceptance Criteria:

Deferring until auth in place, but this is somewhat mocked currently using the session id and inventory search bar. network is a bit more challenging.

Verified By cube on: 7/15/25

<br>

## (Complete) VOUCH-010 - invite someone

### Description:

^^

- ~~save info (relationship)~~
- prelim rating (1-7)
- save as invite request sent

### Acceptance Criteria:

Verified By cube on: 7/15/25

<br>

## (Complete) VOUCH-011 - backend impl (supabase, firebase, etc...)

### Description:

^^

- hard to proceed further without, but will help solidify app!

### Acceptance Criteria:

NOTE: made new app, and will need to port some things over

Verified By cube on: 7/24/25

<br>

## VOUCH-012 - invite someone ranking guage ui

### Description:

^^

- thinking a guage ranking ui, 1-7, vibrating, easing motion between values, popping text w/explanation, a11y alternative!

### Acceptance Criteria:

Verified By <> on:

<br>

## VOUCH-013 - Bring back a11y components

### Description:

^^

### Acceptance Criteria:

Verified By <> on:

<br>

## VOUCH-014 - Add Stuff page impl (my inventory - add)

### Description:

^^

- name\*
- photo(s)\* (also, new gallery component)
- required trust level
- description?
- available?: true by default

### Acceptance Criteria:

Verified By <> on:

<br>

## VOUCH-015 - Edit Stuff page impl (my inventory - edit)

### Description:

^^

- 'Preview Post' button, a la github text editor preview, but for a Stuff post

### Acceptance Criteria:

Verified By <> on:

<br>
