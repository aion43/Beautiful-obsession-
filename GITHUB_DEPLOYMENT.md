# GitHub Backup and Pages Deployment

## Repository

The complete project backup is pushed to [aion43/Beautiful-obsession-](https://github.com/aion43/Beautiful-obsession-).

## Live static site

The GitHub Pages workflow is enabled with the repository’s **GitHub Actions** publishing source. The public static edition is live at:

<https://aion43.github.io/Beautiful-obsession-/>

The fixed-credential static editor is available at:

<https://aion43.github.io/Beautiful-obsession-/admin.html>

## Operational notes

The workflow in `.github/workflows/deploy-pages.yml` deploys `github-pages/` whenever that directory or the workflow changes on `main`. The Pages implementation uses the official `configure-pages`, `upload-pages-artifact`, and `deploy-pages` actions.

Visual assets are served from the project’s managed public URLs rather than duplicated into the GitHub repository. This preserves the working visual presentation while keeping the source backup smaller. The active Pages workflow was run successfully after source activation.

The static credential gate is a client-side convenience only. It cannot provide server-grade access control or shared mutable storage. For secure shared link management, use the original full-stack application’s authenticated owner panel.
