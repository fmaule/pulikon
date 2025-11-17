## 1. Vite Configuration
- [x] 1.1 Add base path to vite.config.ts
- [x] 1.2 Verify build output directory is dist/
- [x] 1.3 Test local build with new configuration

## 2. GitHub Actions Workflow
- [x] 2.1 Create .github/workflows directory
- [x] 2.2 Create deploy.yml workflow file
- [x] 2.3 Configure Node.js version (23)
- [x] 2.4 Set up build steps (install, build)
- [x] 2.5 Configure GitHub Pages deployment action
- [x] 2.6 Set proper permissions (contents: write, pages: write)

## 3. Package Configuration
- [x] 3.1 Add deploy script to package.json (optional for manual deploy)
- [x] 3.2 Verify all build dependencies are in package.json

## 4. Testing
- [x] 4.1 Test local build: npm run build
- [ ] 4.2 Test local preview: npm run preview
- [ ] 4.3 Verify assets load correctly with base path
- [ ] 4.4 Commit and push to trigger workflow

## 5. GitHub Configuration
- [ ] 5.1 Enable Actions with read/write permissions
- [ ] 5.2 Enable GitHub Pages
- [ ] 5.3 Set Pages source to gh-pages branch
- [ ] 5.4 Verify workflow runs successfully
- [ ] 5.5 Verify site is accessible at https://fmaule.github.io/pulikon/

## 6. Validation
- [ ] 6.1 Upload functionality works on deployed site
- [ ] 6.2 localStorage persists between sessions
- [ ] 6.3 All diff sections display correctly
- [ ] 6.4 Follower tracking works with baseline
- [ ] 6.5 Instagram profile links work
- [ ] 6.6 Responsive design works on mobile

## 7. Documentation
- [ ] 7.1 Add deployment instructions to README (if exists)
- [ ] 7.2 Document the deployment URL
