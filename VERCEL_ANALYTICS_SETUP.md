# 🔧 Google Analytics Setup for Vercel Deployment

## 🚨 **Current Issue: "Google tag wasn't detected"**

Your site is deployed on Vercel but Google Analytics isn't detecting the tag. Here's how to fix it.

## 📋 **Step-by-Step Fix**

### **Step 1: Update Google Analytics Data Stream**

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Click Admin** (gear icon in bottom left)
3. **Under Property**, click **Data Streams**
4. **Click on your web stream** (or create new one)
5. **Update these settings**:
   - **Stream URL**: `https://portfolio-akshays-projects-06aa4db7.vercel.app/`
   - **Stream name**: "Portfolio Website"
   - **Measurement ID**: `G-5FRYGYCJ20` (should match)

### **Step 2: Create New Data Stream (If Needed)**

If you need to create a new stream:

1. **Click "Add Stream"** → **Web**
2. **Enter Website URL**: `https://portfolio-akshays-projects-06aa4db7.vercel.app/`
3. **Enter Stream name**: "Portfolio Website"
4. **Click "Create Stream"**
5. **Copy the new Measurement ID** (if different from G-5FRYGYCJ20)

### **Step 3: Update Environment Variables**

If you got a new Measurement ID, update your Vercel environment variables:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your portfolio project**
3. **Go to Settings** → **Environment Variables**
4. **Add/Update**:
   - **Name**: `VITE_GA_TRACKING_ID`
   - **Value**: Your Measurement ID (G-5FRYGYCJ20 or new one)
   - **Environment**: Production, Preview, Development

### **Step 4: Redeploy Your Site**

1. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "Update analytics for Vercel deployment"
   git push
   ```

2. **Vercel will auto-deploy** (or trigger manual deployment)

### **Step 5: Test Analytics**

1. **Visit your live site**: https://portfolio-akshays-projects-06aa4db7.vercel.app/
2. **Open browser console** (F12)
3. **Look for these logs**:
   ```
   === Analytics Debug Info ===
   Environment: production
   Tracking ID: G-5FRYGYCJ20
   Debug Mode: false
   Gtag Available: true
   Google Analytics initialized successfully
   Test pageview sent to GA
   ```

4. **Check Google Analytics Real-Time**:
   - Go to **Reports** → **Realtime** → **Overview**
   - You should see active users

## 🔍 **Troubleshooting**

### **Issue 1: Tag Still Not Detected**

**Solutions:**
1. **Wait 24-48 hours** for Google to detect the tag
2. **Use Google Tag Assistant**:
   - Install [Tag Assistant Legacy](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
   - Visit your live site
   - Check for GA4 tag firing

3. **Check Network Tab**:
   - Open DevTools → Network
   - Filter by "google-analytics"
   - Look for requests to `google-analytics.com`

### **Issue 2: Wrong Domain in GA**

**Make sure your data stream points to the correct Vercel URL:**
- **Current**: `https://portfolio-akshays-projects-06aa4db7.vercel.app/`
- **Not**: `https://yourusername.github.io/portfolio`

### **Issue 3: Environment Variables Not Working**

**For Vercel, you need to set environment variables in the dashboard:**
1. Go to Vercel Dashboard → Your Project → Settings
2. Environment Variables → Add Variable
3. Name: `VITE_GA_TRACKING_ID`
4. Value: `G-5FRYGYCJ20`
5. Environment: Production, Preview, Development

## 🛠 **Alternative: Create New GA4 Property**

If the current setup doesn't work:

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Create Property**:
   - Click **Create Property**
   - Name: "Portfolio Analytics"
   - Timezone: Your timezone
   - Currency: Your currency

3. **Set up data stream**:
   - Choose **Web**
   - Website URL: `https://portfolio-akshays-projects-06aa4db7.vercel.app/`
   - Stream name: "Portfolio Website"

4. **Get new tracking ID** and update Vercel environment variables

## ✅ **Verification Checklist**

- [ ] Data stream URL matches your Vercel domain
- [ ] Measurement ID is correct (G-5FRYGYCJ20)
- [ ] Environment variables set in Vercel dashboard
- [ ] Site redeployed after changes
- [ ] Console shows "Google Analytics initialized successfully"
- [ ] Real-time reports show active users
- [ ] No ad blockers interfering

## 🎯 **Expected Results**

After fixing:
- **Real-time reports** show active users
- **Page views** are tracked
- **Events** (voice commands, theme changes) appear
- **Audience data** starts collecting
- **Traffic sources** become available

## 📞 **Still Having Issues?**

1. **Check browser console** for specific errors
2. **Verify data stream URL** matches your Vercel domain exactly
3. **Test on different browsers** and devices
4. **Wait 24-48 hours** for Google to detect the tag
5. **Contact Google Analytics support** if needed

Your analytics should work perfectly once the data stream is properly configured for your Vercel deployment! 🚀 