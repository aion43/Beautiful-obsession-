# A Beautiful Obsession — Authorised Access Hub

This repository contains two deliverables for the **A Beautiful Obsession** Manchester City documentary availability page.

| Deliverable | Location | Purpose |
|---|---|---|
| Full application | `client/`, `server/`, `drizzle/` | The original full-stack site with authenticated owner access and a database-backed link manager. |
| GitHub Pages edition | `github-pages/` | A static public mirror deployed to GitHub Pages by the repository workflow. |

## GitHub Pages deployment

Pushing changes to `main` that affect `github-pages/` or `.github/workflows/deploy-pages.yml` triggers the official GitHub Pages workflow. In the repository settings, ensure **Pages → Build and deployment → Source** is set to **GitHub Actions**.

The static public page starts at `github-pages/index.html`, which is deployed as the Pages root. The static editor is available at `admin.html` and is protected by the fixed credential gate requested for this GitHub-hosted edition.

> **Security limitation:** GitHub Pages is static hosting. Its credential gate is a client-side deterrent, not a secure administrator identity system. Use the full application for server-enforced owner access and shared persistent link management.

## Updating public static links

1. Open `admin.html` in the GitHub Pages edition and sign in using the configured static-admin credentials.
2. Update the four destinations and choose **Download site-config.js**.
3. Replace `github-pages/site-config.js` in this repository with the downloaded file, then commit to `main`.
4. The Pages workflow publishes the new link configuration.

## Local application checks

```bash
pnpm test
pnpm check
pnpm build
```

The project is intended for authorised distribution only. The site owner is responsible for holding all relevant documentary and promotional-image permissions.
