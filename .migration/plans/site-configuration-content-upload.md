# Create Content Package via AEM Sites Console

## Overview

To create a package of the migrated pages in this project, you need to use the AEM Sites console. However, the **"Missing site configuration" error must be resolved first** before you can create packages.

## Pages Available in This Project

| Page | Content Path in AEM |
|------|-------------------|
| **chefpage** | `/content/eds-chefspage/chefpage` |
| **inspirations** | `/content/eds-chefspage/inspirations` |

## Pre-requisite: Register Site with Config Service

The "Create Package" button in AEM Sites console will not work until the site is registered. You must run this **once** from any terminal:

```bash
curl -X PUT https://admin.hlx.page/config/PrakrutiKK/sites/eds-chefspage.json \
  -H "content-type: application/json" \
  -H "x-auth-token: <YOUR_AUTH_TOKEN>" \
  --data '{
  "version": 1,
  "code": {
    "owner": "PrakrutiKK",
    "repo": "eds-chefspage"
  },
  "content": {
    "source": {
      "url": "https://author-p64105-e536191.adobeaemcloud.com/bin/franklin.delivery/prakrutikk/eds-chefspage/main",
      "type": "markup"
    }
  }
}'
```

**Getting your auth token:**
1. Open browser → go to `https://admin.hlx.page/login`
2. Sign in with your Adobe ID
3. Once logged in, copy the token shown (or from DevTools Network tab)

## Steps to Create Package in AEM Sites Console

After site registration is complete:

1. Open: `https://author-p64105-e536191.adobeaemcloud.com/ui#/aem/sites.html/content/eds-chefspage`
2. You should see your pages listed (chefpage, inspirations)
3. **Select the pages** you want to package (tick the checkboxes)
4. Click **"Manage Publication"** in the top toolbar
5. In the wizard:
   - Action: Select **"Publish"**
   - Scheduling: Choose **"Now"** or schedule for later
6. Click **"Next"** to review included pages
7. Click **"Publish"** to create and push the package

### Alternative: Quick Publish
- Select a single page → click **"Quick Publish"** in the toolbar
- This immediately publishes the page to Edge Delivery

## After Publishing

Your pages will be available at:
- `https://main--eds-chefspage--PrakrutiKK.aem.page/chefpage`
- `https://main--eds-chefspage--PrakrutiKK.aem.page/inspirations`

## Checklist

- [ ] Get auth token from `https://admin.hlx.page/login`
- [ ] Run the curl command above to register site with Config Service
- [ ] Verify registration: check `https://main--eds-chefspage--PrakrutiKK.aem.page/` returns a response (even 404 is OK — it means the site is registered)
- [ ] Open AEM Sites console: `https://author-p64105-e536191.adobeaemcloud.com/ui#/aem/sites.html/content/eds-chefspage`
- [ ] Confirm pages are visible in the console (if not, content needs to be authored/uploaded first)
- [ ] Select pages → Manage Publication → Publish
- [ ] Verify published pages at `https://main--eds-chefspage--PrakrutiKK.aem.page/`
