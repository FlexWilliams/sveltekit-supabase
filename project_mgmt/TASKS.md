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

dev notes:

1. ~~create api endpoint for invite (POST /invite)~~
1. ~~Create service account to~~
   - create user w/temp password
   - send email invite
   - create user_meta table (with new field `email_confirmed` & `reset_password`)
   - update friends table
1. ~~Create new send invite page~~
   - Do we care to add a new invite table to view/cancel/etc...
1. ~~Create new reset password page w/ server handler....~~
   - update user_meta table (`email_confirmed` = true)
1. ~~update auth guard to check if user-confirmed~~
1. ~~On invitee link click, proceed to reset password page~~
   - after reset
   - update user_meta table (`reset_password` = true)
   - proceed to home

### Acceptance Criteria:

Verified By cube on: 8/15/25

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

## (Complete) VOUCH-014 - Add Stuff page impl (my inventory - add)

### Description:

^^

- name\*
- photo(s)\* (also, new gallery component)
- required trust level
- description?
- available?: true by default

### Acceptance Criteria:

Verified By cube on: 7/29/25

<br>

## (Complete) VOUCH-015 - Edit Stuff page impl (my inventory - edit)

### Description:

^^

### Acceptance Criteria:

Verified By cube on: 7/29/25

<br>

## VOUCH-016 - Resize images before upload

### Description:

^^

- Similar to play dead app.

### Acceptance Criteria:

Verified By <> on:

<br>

## VOUCH-017 - 'Preview Post' button (My Stuff - Edit page)

### Description:

^^

- a la github text editor preview, but for a Stuff post

### Acceptance Criteria:

Verified By <> on:

<br>

## (Complete) VOUCH-018 - Search Page Mock

### Description:

^^

### Acceptance Criteria:

Verified By cube on: 8/5/25

<br>

## (Complete) VOUCH-019 - Search Page Impl

### Description:

^^

### Acceptance Criteria:

Verified By cube on: 8/5/25

<br>

## (Complete) VOUCH-020 - View items only by direct friends

### Description:

^^

- View items only by direct friends, currently app allows all items searchable

### Acceptance Criteria:

Verified By cube on: 8/8/25

<br>

## (Complete) VOUCH-021 - My rentals page

### Description:

^^

- need to create new db table `my_rentals`
  (
  id,
  created_on,
  renterId,
  renterName,
  renteeId,
  renteeName,
  rentStartDate,
  rentEndDate,
  itemName,
  pickupMethod,
  returnMethod,
  status
  )
- For now just a card list with button to cancel (ie remove rental from db) and link to stuff page
- stuff detail page should show item as rented is rented (button disbaled)

### Acceptance Criteria:

Verified By cube on: 8/8/25

<br>

## (Complete) VOUCH-022 - Friend Stuff Detail page UX changes

### Description:

^^

May need to impl image resizing, public bucket first... (VOUCH-029)

### Acceptance Criteria:

Verified By cube on: 8/12/25

<br>

## VOUCH-023 - Chat/Message friend/Rental Inbox...

### Description:

^^

may be 3 diff stories or a single overlay component...

### Acceptance Criteria:

Verified By <> on:

<br>

## VOUCH-024 - Notifications

### Description:

^^

_sigh_ tuffy, not sure if supabase offers a push notification service...don't want to impl my self

### Acceptance Criteria:

Verified By <> on:

<br>

## (Complete) VOUCH-025 - Auth redirect (logged out)

### Description:

^^

Seems like some pages can be routed to such as `/search` when user not logged in.

Should always redirect to home page w/ad and sign in link only.

### Acceptance Criteria:

fixed during VOUCH-010

Verified By cube on: 8/15/25

<br>

## (Complete) VOUCH-026 - Search page UX cleanup

### Description:

^^

### Acceptance Criteria:

Verified By cube on: 8/12/25

<br>

## VOUCH-027 - Friend Activity Impl and UX

### Description:

^^

### Acceptance Criteria:

Verified By <> on:

<br>

## (Complete) VOUCH-028 - Fix new user flow

### Description:

^^

Looks like supabase complains when doing crud for a new user if the `user_meta` db table doesn't have a row, which currently there is no stored proc or code path that does...

Either impl one of the 2 above, or fix relationship requirement at db level:

```
{"code":"23503","details":"Key is not present in table \"user_meta\".","hint":null,"message":"insert or update on table \"user_stuff\" violates foreign key constraint \"user_stuff_user_id_fkey\""}
My Stuff API [POST]: Error occurred at the DB level
```

### Acceptance Criteria:

fixed during VOUCH-010

Verified By cube on: 8/15/25

<br>

## VOUCH-029 - Rework photo upload

### Description:

^^

### Acceptance Criteria:

Verified By cube on: 8/11/25

<br>
