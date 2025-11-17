# Change: Add GitHub Pages Deployment

## Why
The application is ready for deployment and needs to be accessible online. GitHub Pages provides free hosting for static sites, which is perfect for this React + Vite app that uses only client-side features (localStorage). It integrates seamlessly with our existing GitHub workflow.

## What Changes
Add automated deployment to GitHub Pages using GitHub Actions:
- Configure Vite to build for GitHub Pages with correct base path
- Create GitHub Actions workflow for automatic deployment on push to main
- Add deployment script to package.json
- Set up proper permissions for GitHub Actions
- Configure GitHub Pages settings

## Implementation Details

### Vite Configuration
- Add `base: '/pulikon/'` to vite.config.ts for correct asset paths
- Ensure build outputs to `dist/` directory

### GitHub Actions Workflow
- Trigger on push to main branch
- Install dependencies and run build
- Deploy to `gh-pages` branch using official GitHub Pages action
- Use Node.js 23 (matching .nvmrc)

### Deployment Flow
1. Developer pushes to main branch
2. GitHub Actions automatically triggers
3. Runs `npm ci` and `npm run build`
4. Deploys dist/ folder to gh-pages branch
5. GitHub Pages serves the site at `https://fmaule.github.io/pulikon/`

### Required GitHub Settings
- Actions: Read and write permissions
- Pages: Deploy from gh-pages branch
- Source: GitHub Actions

## Impact
- Affected specs: Not applicable (infrastructure change)
- Affected code: vite.config.ts, package.json
- New files: .github/workflows/deploy.yml
- Result: App publicly accessible at https://fmaule.github.io/pulikon/

## Benefits
- ✅ Free hosting (unlimited bandwidth for public repos)
- ✅ Automatic deployments on every push
- ✅ HTTPS by default
- ✅ No additional accounts needed
- ✅ localStorage works perfectly (client-side only)
- ✅ Fast global CDN
- ✅ Version history via gh-pages branch

## Post-Deployment Steps
1. Enable GitHub Pages in repository settings
2. Set source to "gh-pages" branch
3. Wait ~2 minutes for first deployment
4. Visit https://fmaule.github.io/pulikon/

## Future Enhancements (Not in this change)
- Custom domain configuration
- Deploy preview for pull requests
- Deployment status badges
