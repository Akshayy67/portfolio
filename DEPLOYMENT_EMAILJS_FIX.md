# EmailJS Deployment Fix for GitHub Pages

This guide explains how to fix EmailJS not working when deployed to GitHub Pages.

## Problem
EmailJS works locally but fails when deployed because environment variables from `.env` files are not available in GitHub Pages static deployments.

## Solution
We've implemented a multi-layered approach:

### 1. Configuration with Fallbacks
- Created `src/config/emailjs.ts` with hardcoded fallback values
- Environment variables are used in development
- Production uses fallback values if env vars aren't available

### 2. GitHub Actions Deployment
- Added `.github/workflows/deploy.yml` for automated deployment
- Injects environment variables during build process
- Uses GitHub Secrets for secure credential storage

### 3. Retry Logic
- Added retry mechanism for network failures
- Handles temporary EmailJS service issues
- Better error handling and logging

## Setup Instructions

### Step 1: Add GitHub Secrets
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these secrets:

```
VITE_EMAILJS_SERVICE_ID = service_mshm1ku
VITE_EMAILJS_TEMPLATE_ID = template_gjtmaxv  
VITE_EMAILJS_PUBLIC_KEY = e8z9fkbuNRmd04-70
VITE_GA_TRACKING_ID = G-5FRYGYCJ20
```

### Step 2: Enable GitHub Actions
1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will automatically deploy when you push to main branch

### Step 3: Verify EmailJS Configuration
1. Check your EmailJS dashboard at https://www.emailjs.com/
2. Verify your service ID, template ID, and public key are correct
3. Make sure your email template includes these variables:
   - `{{from_name}}`
   - `{{from_email}}`
   - `{{to_email}}`
   - `{{subject}}`
   - `{{message}}`
   - `{{reply_to}}`
   - `{{timestamp}}`

### Step 4: Test Deployment
1. Push changes to main branch
2. GitHub Actions will build and deploy automatically
3. Test the contact form on your live site
4. Check browser console for any errors

## Fallback System
If EmailJS still fails, the contact form will:
1. Try EmailJS with retry logic (3 attempts)
2. Fall back to backend API (if available)
3. Provide manual contact options (copy to clipboard, download)

## Troubleshooting

### EmailJS Returns 403/401 Errors
- Check your public key is correct
- Verify your EmailJS account is active
- Make sure you haven't exceeded free tier limits (200 emails/month)

### Environment Variables Not Working
- Verify GitHub Secrets are set correctly
- Check the GitHub Actions build logs
- Make sure secret names match exactly

### CORS Issues
- EmailJS should handle CORS automatically
- If issues persist, check EmailJS dashboard settings
- Verify your domain is allowed in EmailJS settings

### Still Not Working?
The fallback configuration ensures the form works even if environment variables fail:
- Hardcoded values are used as backup
- Multiple retry attempts handle network issues
- Manual contact options always available

## Testing Locally
```bash
# Test with environment variables
npm run dev

# Test without environment variables (simulates production)
# Temporarily rename .env file and test
mv .env .env.backup
npm run dev
mv .env.backup .env
```

## Production Verification
1. Open browser developer tools
2. Go to your deployed site
3. Submit a test message
4. Check console logs for EmailJS status
5. Verify email is received

The new system is much more robust and should work reliably in production!
