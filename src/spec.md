# Specification

## Summary
**Goal:** Prevent authenticated admins from losing publish permissions for Works (PDF/documents) after canister upgrades, and ensure the admin UI can reliably view and publish/unpublish both drafts and published Works.

**Planned changes:**
- Persist admin access-control state across canister upgrades (including conditional state migration if needed) so previously-authorized admins remain authorized after deployments.
- Add an admin-only backend query API to list all Works (published + drafts), returning Unauthorized for non-admin callers.
- Update the Admin Works UI to fetch via the admin-only “list all works” API, show drafts + published items, and improve authorization error messaging; keep the public Works page published-only.

**User-visible outcome:** Admins who have been authorized once can continue publishing/unpublishing Works after upgrades without re-initializing, and can see/manage both draft and published Works from the Admin Works page; non-admins receive clear Unauthorized errors where applicable.
