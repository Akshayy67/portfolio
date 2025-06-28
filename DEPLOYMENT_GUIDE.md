# 🚀 Portfolio Deployment Guide

## Option 1: Vercel Deployment (Recommended)

### Step 1: Prepare Your Project
```bash
# Build your project
npm run build

# Test the build locally
npm run preview
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite settings
6. Click "Deploy"

### Step 3: Custom Domain
1. Go to your project dashboard
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Option 2: Netlify Deployment

### Step 1: Build Settings
Create `netlify.toml` in your project root:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop your `dist` folder
3. Or connect GitHub for auto-deployment

## Option 3: GitHub Pages

### Step 1: Install gh-pages
```bash
npm install --save-dev gh-pages
```

### Step 2: Update package.json
```json
{
  "homepage": "https://yourusername.github.io/project",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 3: Deploy
```bash
npm run deploy
```

## 🌐 Domain Purchase Options

### Budget-Friendly (.dev domains)
- **Namecheap**: $12-15/year
- **Google Domains**: $12/year
- **Cloudflare**: $9.15/year

### Premium (.com domains)
- **Namecheap**: $8-12/year
- **GoDaddy**: $12-20/year
- **Porkbun**: $8-10/year

## 🔧 Environment Variables for Production

Create production environment variables:
```env
# For Vercel/Netlify
VITE_EMAILJS_SERVICE_ID=service_mshm1ku
VITE_EMAILJS_TEMPLATE_ID=template_gjtmaxv
VITE_EMAILJS_PUBLIC_KEY=e8z9fkbuNRmd04-70
```

## 📊 Performance Optimization

### Before Deployment:
```bash
# Optimize build
npm run build

# Check bundle size
npx vite-bundle-analyzer dist
```

### Add to vite.config.ts:
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion']
        }
      }
    }
  }
})
```

## 🚀 Quick Start Commands

### For Vercel:
```bash
npm install -g vercel
vercel
```

### For Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 📈 Post-Deployment Checklist

- [ ] Test all pages and functionality
- [ ] Verify contact form works
- [ ] Check mobile responsiveness
- [ ] Test loading speed
- [ ] Set up analytics (Google Analytics)
- [ ] Add favicon and meta tags
- [ ] Test EmailJS in production
- [ ] Set up SSL certificate (auto with most platforms)

## 🔗 Recommended Domain + Hosting Combinations

1. **Professional**: `akshayjuluri.dev` + Vercel
2. **Budget**: `akshayjuluri.netlify.app` (free subdomain)
3. **Custom**: `akshaybuilds.dev` + Netlify
4. **Enterprise**: `akshayjuluri.com` + Vercel Pro
