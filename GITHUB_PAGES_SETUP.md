# GitHub Pages Deployment Setup

## Automatic Deployment via GitHub Actions

Your portfolio will now automatically deploy to GitHub Pages whenever you push to the `main` or `master` branch.

### Initial Setup

1. **Enable GitHub Pages** (if not already enabled):
   - Go to your repository on GitHub
   - Settings → Pages
   - Select "GitHub Actions" as the deployment source
   - Save

2. **Configure Base URL** (only if deploying to a subdirectory):
   
   If your site will be at `https://username.github.io/resume/`, update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/resume/',  // Replace 'resume' with your repo name
     plugins: [vue()],
     // ... rest of config
   })
   ```
   
   If your site will be at `https://username.github.io/` (username.github.io repo), leave base as default:
   ```typescript
   export default defineConfig({
     base: '/',  // or just use the default
     plugins: [vue()],
   })
   ```

### How It Works

1. **You push code** to main/master branch
2. **GitHub Actions automatically**:
   - Installs dependencies
   - Builds your Vue + Vite project
   - Uploads the `dist/` folder to GitHub Pages
   - Your site is live!

### Workflow File

The workflow is located at: `.github/workflows/deploy.yml`

It triggers on:
- ✅ Pushes to main/master
- ✅ Pull requests to main/master (builds preview, doesn't deploy)

### Monitoring Deployments

1. Go to your GitHub repository
2. Click on **Actions** tab
3. You'll see the "Deploy to GitHub Pages" workflow runs
4. Click on a run to see build logs

### Troubleshooting

**Site not deploying?**
- Check GitHub Actions tab for error logs
- Ensure "GitHub Actions" is selected in Pages settings
- Verify base URL matches your repository structure

**Content not updating?**
- GitHub Pages caches for a few minutes
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Manual Build & Test

To test the build locally:
```bash
npm run build
npm run preview
```

Then visit `http://localhost:4173`
