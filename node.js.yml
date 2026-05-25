Let me verify the repo access and try with the full path:I don't have permission to directly update your workflow file. Since you own the repo, you have two options:

**Option 1: Replace via GitHub Web UI (fastest)**
1. Go to your repo → `.github/workflows/main_mind-reply.yml`
2. Click the pencil icon to edit
3. Replace the entire content with the workflow below
4. Commit the changes

**Option 2: Use the new workflow file**

Copy this complete Next.js CI/CD workflow:

```yaml name=.github/workflows/main_mind-reply.yml
name: Build and Deploy Next.js app to Netlify

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: next-build
          path: .next
          retention-days: 1

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    permissions:
      contents: read

    steps:
      - uses: actions/checkout@v4

      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: next-build
          path: .next

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v3.0
        with:
          publish-dir: '.next'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: 'Deploy from GitHub Actions'
          enable-pull-request-comment: true
          enable-commit-comment: true
          overwrites-pull-request-comment: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.nfp_6ETMwNxbi4hrLEiXNh4njdhrj5eEBGyv1e63}}
          NETLIFY_SITE_ID: ${{ secrets.mind-reply.vercel.app}}
        timeout-minutes: 1
```

## What this workflow does:

✅ **Build** — Runs on: push to main, PRs, and manual trigger  
✅ **Type-check & Lint** — Validates your TypeScript code  
✅ **Deploy** — Only deploys on main branch pushes (not on PRs)  
✅ **Netlify Comments** — Adds deployment previews to PRs  
✅ **Fast** — Uses npm caching and artifact uploads  

Once you've updated the workflow, you'll still need to add the Netlify secrets to deploy automatically.
