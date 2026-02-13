# Specification

## Summary
**Goal:** Add a public Introduction page linked across site navigation, and make the admin Works upload flow easy to find and use.

**Planned changes:**
- Add a new public route (e.g., `/introduction`) that renders a dedicated “Introduction” page with H1 title “Introduction” and the provided English introduction text, using existing long-form reading/prose styling patterns.
- Add an “Introduction” link to the top header navigation (desktop) before existing primary sections and include it in the mobile menu, with correct active-state highlighting.
- Add an “Introduction” link to the site footer navigation alongside existing public links.
- Improve admin discoverability for Works uploading by adding a clear navigation path from the Admin area to Works management and ensuring a visible “Upload Work” action on the Works admin page that leads to the upload form and returns to the list on success; show clear authorization messaging for non-admin/non-authenticated users.

**User-visible outcome:** Visitors can open and read an Introduction page from the header, mobile menu, and footer; admins can reliably find the Works admin area and upload new Works via a clearly visible upload flow.
