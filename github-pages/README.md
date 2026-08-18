# GitHub Pages Static Version

This directory is the static GitHub Pages edition of the website. The workflow in `.github/workflows/deploy-pages.yml` deploys this folder when changes reach `main`.

## Publishing links

The browser-based link editor at `admin.html` uses the fixed credentials configured for this edition and lets the administrator edit the four link destinations. It saves edits to that browser’s local storage for preview. To make link changes public for everyone, choose **Download site-config.js**, then replace `github-pages/site-config.js` in GitHub and commit the change.

## Important security limitation

GitHub Pages is static hosting. It cannot keep passwords, server-side sessions, or a private database secret from a visitor. The gate is a client-side deterrent only, **not real access control**. The original hosted application remains the secure version: it uses authenticated owner access and server-side protected procedures to manage the shared public links.
