# Admin Access

The `/admin` route is a **protected link-control panel**. It manages the four public delivery destinations—Mega, Google Drive, Telegram, and Torrent—stored in the `download_links` database table.

## Access model

The panel uses the project’s built-in authenticated owner role. The owner account is promoted automatically by the platform based on the configured project owner identity, and server mutations are guarded with `adminProcedure`. This avoids placing a reusable username or plaintext password in application code, browser storage, or the public bundle.

Open the small key control in the public footer and choose **Open link control**, then complete the owner sign-in when prompted. A non-owner can view neither the saved settings nor the update action.

## Optional credential-based access

If a separate username/password flow is specifically required later, credentials should be configured as secure deployment secrets and verified against a server-side password hash. They should not be hardcoded in this repository or placed in client-side source. The current owner-authentication design is ready to use without creating or exposing a default password.
