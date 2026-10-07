# Releasing to production

The live site (<https://threestargym.vercel.app>) only updates when you **publish a GitHub release**.
Merging into `main` no longer deploys anything. Pull requests still get their own preview deployment.

**How it works:** `vercel.json` turns off Vercel's automatic deploys for `main`
(`"git": { "deploymentEnabled": { "main": false } }`). Publishing a release runs the GitHub Action in
`.github/workflows/release.yml`, which pulls the Production environment variables from Vercel, builds the
site and deploys it to production with the Vercel CLI.

## One-time setup

Do these once, in order. Steps 1–4 happen before the PR that adds this file is merged.

### 1. Create a Vercel token

1. vercel.com → your avatar → **Account Settings** → **Tokens** → **Create Token**.
2. Name: `github-release-three-star`. Scope: the team the project lives in. Expiration: 1 year.
3. Copy the token now; Vercel shows it only once.
4. Note the expiry date. When it expires, releases fail until you create a new token and repeat step 3.

### 2. Find the two IDs

- **Project ID:** Vercel → project **three-star-gym** → **Settings** → **General** → *Project ID*
  (starts with `prj_`).
- **Team ID** (used as `VERCEL_ORG_ID`): Vercel → your team → **Settings** → **General** → *Team ID*
  (starts with `team_`).

### 3. Add three GitHub secrets

GitHub → repo **three_star_gym** → **Settings** → **Secrets and variables** → **Actions** →
**New repository secret**, three times:

| Name | Value |
| --- | --- |
| `VERCEL_TOKEN` | The token from step 1 |
| `VERCEL_ORG_ID` | The Team ID from step 2 |
| `VERCEL_PROJECT_ID` | The Project ID from step 2 |

Or from the terminal in the project folder (each command asks you to paste the value):

```sh
gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID
```

### 4. Check the Production environment variables in Vercel

Vercel → project → **Settings** → **Environment Variables**. For **Production**:

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`: must be set.
- `VITE_SITE_URL`: `https://threestargym.vercel.app` (later the custom domain).
- `VITE_UMAMI_WEBSITE_ID`: only when analytics is switched on.

None of these may be marked **Sensitive**: the release job can't read sensitive values, and it stops with
"… is missing from Vercel's Production environment" rather than deploying a broken site. They are all public
values that end up in the page anyway.

### 5. Merge the PR and publish the first release

1. Merge the PR that adds this setup. Nothing deploys on that merge.
2. Publish release `v1.0.0` (next section) and check that it deploys. This is the test that the setup works.

## Publishing a release

1. Merge the pull requests you want to ship into `main`, as usual. Check them on their preview links first.
2. Create the release, on GitHub or in the terminal:
   - **GitHub:** repo → **Releases** → **Draft a new release** → **Choose a tag** → type the new version
     (e.g. `v1.1.0`) → **Create new tag on publish** → target `main` → **Generate release notes** →
     **Publish release**.
   - **Terminal:**

     ```sh
     gh release create v1.1.0 --target main --generate-notes
     ```

3. Watch it: repo → **Actions** → **Release to production**. It takes about 2–3 minutes. The new deployment
   also shows in the Vercel dashboard.
4. Open the live site and check the change.

**Drafts don't deploy.** Saving a release as a draft does nothing until you publish it. A release marked
**pre-release** does deploy when published, so don't use pre-releases for testing.

## Version numbers

Use `vMAJOR.MINOR.PATCH`, starting at `v1.0.0`:

| Change | Bump | Example |
| --- | --- | --- |
| Fixes, copy or small style tweaks | Patch | `v1.0.0` → `v1.0.1` |
| New section, page or feature | Minor | `v1.0.1` → `v1.1.0` |
| Redesign or big structural change | Major | `v1.4.2` → `v2.0.0` |

Content edited in the admin (prices, photos, posts) goes live immediately and never needs a release.

## Redeploying without a new release

Changing environment variables in Vercel (for example `VITE_SITE_URL` after the custom domain) needs a
rebuild. Run the same job by hand: repo → **Actions** → **Release to production** → **Run workflow** →
`ref` = the latest tag (e.g. `v1.1.0`) → **Run workflow**.

The same works for redeploying an older tag.

## Rolling back

- **Fastest:** Vercel → project → **Deployments** → the previous production deployment → **⋯** →
  **Instant Rollback**. The site switches back in seconds.
- **From GitHub:** run the workflow by hand (section above) with the last good tag.

Then fix the problem on a branch and publish a new patch release.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Job fails at "Check required environment variables" | Set the named variable for Production in Vercel, not marked Sensitive; then run the workflow by hand |
| Job fails with a 401 or 403 from Vercel | The token expired or has the wrong scope. Create a new one (setup step 1) and update `VERCEL_TOKEN` |
| Publishing a release started no job | Check it was published, not saved as a draft, and that the workflow file is on `main` |
| A merge to `main` deployed anyway | Check `vercel.json` on `main` still has `"git": { "deploymentEnabled": { "main": false } }` |
