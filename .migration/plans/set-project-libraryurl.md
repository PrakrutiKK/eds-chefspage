# Set `libraryUrl` for the eds-chefspage Project

## Findings

- **Git remote** (`.git/config`): `https://github.com/PrakrutiKK/eds-chefspage.git`
  - Owner: `PrakrutiKK`
  - Repo: `eds-chefspage`
  - Main branch: `main`
- **`.migration/project.json`** currently has **no** `libraryUrl` field (it was removed). Other keys confirm: `previewOrg: prakrutikk`, `previewSite: eds-chefspage`, `type: xwalk`.
- **`fstab.yaml`** mounts content from the AEM author markup endpoint (xwalk project).
- **`tools/sidekick/`** contains only `config.json` — there is no committed `library.json`; the block library is served from the deployed preview host.

## Recommended Value

For an Edge Delivery project, the block library is served from the project's own deployed preview host using the pattern `https://{branch}--{repo}--{owner}.aem.page/tools/sidekick/library.json`. For this repo:

```
https://main--eds-chefspage--PrakrutiKK.aem.page/tools/sidekick/library.json
```

Notes:
- This replaces the earlier boilerplate value (`https://main--sta-xwalk-boilerplate--aemysites.aem.page/tools/sidekick/library.json`), which pointed at the shared boilerplate library rather than this project's own blocks.
- The host segments are case-insensitive on `aem.page`, but matching the GitHub casing (`eds-chefspage`, `PrakrutiKK`) keeps it consistent with the remote.
- The library reflects whatever blocks/content are published to the `main` preview, so the catalog stays in sync with this project's own blocks (carousel-hero, carousel-product, columns-inspiration, etc.) once published.

## Checklist

- [ ] Add `"libraryUrl": "https://main--eds-chefspage--PrakrutiKK.aem.page/tools/sidekick/library.json"` to `.migration/project.json`
- [ ] Confirm the host resolves (even a 404 on the path is acceptable as long as the site is registered/published); if the library page isn't published yet, publish `main` so `library.json` is reachable
- [ ] (Optional) Verify the library loads in tooling that reads `project.json` so block discovery uses this project's blocks rather than the boilerplate

> Execution (editing `.migration/project.json`) requires Execute mode. Switch to Execute mode to apply the change.
