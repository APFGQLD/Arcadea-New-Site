# Automatic rebuilds when content is published in Sanity

Listing pages, blog pages and `sitemap.xml` are generated at build time. Hostinger
only builds when `main` is pushed, so publishing in Sanity needs a nudge:

```
Publish in Sanity → Sanity webhook → GitHub Action (.github/workflows/sanity-rebuild.yml)
  → empty commit on main → Hostinger auto-deploy (~3 min wait + build time)
```

The Action waits 3 minutes and restarts that wait on every new publish, so a
batch of edits produces a single rebuild.

## One-time setup

### 1. GitHub token

GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token

- **Repository access:** Only select repositories → `APFGQLD/Arcadea-New-Site`
- **Permissions → Repository → Contents:** Read and write
- **Expiration:** up to 1 year. Set a calendar reminder: when it expires, rebuilds silently stop until a new token is pasted into the Sanity webhook.

### 2. Sanity webhook

[sanity.io/manage](https://www.sanity.io/manage) → project **b6pkfjxp** → API → Webhooks → **Create webhook**

| Field | Value |
|---|---|
| Name | Rebuild website |
| URL | `https://api.github.com/repos/APFGQLD/Arcadea-New-Site/dispatches` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type in ["property", "propertyCollection", "post"]` |
| Projection | `{"event_type": "sanity-content-change", "client_payload": {"type": _type, "id": _id}}` |
| HTTP method | POST |
| HTTP headers | `Authorization` = `Bearer <your token>` and `Accept` = `application/vnd.github+json` |
| Trigger on drafts | Off |

## Checking it works

Publish a small edit to any listing, then open the repo's **Actions** tab: a
"Rebuild on Sanity publish" run should appear. About 3 minutes later it pushes
a "Rebuild site for Sanity content update" commit to `main` and Hostinger
starts deploying.

If no run appears, open the webhook in Sanity → **Attempts log**. A 401/403/404
there almost always means the token is wrong, expired, or lacks Contents write.

To rebuild by hand at any time: Actions → Rebuild on Sanity publish → **Run workflow**.
