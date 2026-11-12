# Deploy the portal on Vercel

This deployment keeps the address on Vercel and serves the published portal from Lovable. All stored records and private credentials stay in the existing Lovable Cloud project. No database migration or record deletion is performed.

## Vercel settings

1. Import the connected repository into Vercel, or deploy its updated source.
2. Use the repository root as the **Root Directory** and **Other** as the framework.
3. Remove any previously saved build, install, or output-directory overrides so `vercel.json` supplies them. The configuration skips dependency installation and creates an empty output directory; Vercel forwards requests instead of running another copy of the server.
4. Deploy. No database service key, admin password, or Telegram token is needed in Vercel for this forwarding deployment.
5. Open the Vercel address, select **Exam portal**, and check the name step. Select **Admin** and sign in to check **Exam bot**.

## Updating the site

Publish changes in Lovable first. The Vercel address serves that published version, not the in-progress preview. Keep `https://bhsss-exam-bridge.lovable.app` published and publicly reachable. If this published address changes, update the rewrite destination in `vercel.json` and redeploy Vercel.

The forwarding rule covers the home page, assets, server functions, query strings, and Telegram webhook path. It replaces the old rule that sent only server functions to another project's address, which could mismatch pages with server functions.

## Verification and limitations

The configuration is covered by automated tests. The published home page is reachable, but a real Vercel deployment must still be checked after deploying; no Vercel account or deployment address has been provided here. Forwarding is not independent self-hosting: availability depends on the published Lovable portal. Do not upload private credentials to the repository.

Deploying this configuration does not change Telegram's registered webhook or bot menu address. Those existing settings remain unchanged.