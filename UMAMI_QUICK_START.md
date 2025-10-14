# 📊 Umami Analytics - Quick Start

## ✅ What I Did

1. **Added Umami tracking script** to `pages/_document.tsx`
2. **Updated environment files** with new variable
3. **Created comprehensive documentation** in `UMAMI_ANALYTICS_SETUP.md`
4. **Tested build** - Everything works! ✅

---

## 🚀 What YOU Need to Do

### ⚡ Quick Setup (3 steps):

#### Step 1: Add Environment Variable to Vercel

1. Go to https://vercel.com
2. Open your **TappyLine** project
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Enter:
   - **Key:** `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
   - **Value:** `key for umami`
   - **Environment:** Check all three (Production, Preview, Development)
6. Click **"Save"**

#### Step 2: Redeploy

1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait for build to complete (~2-3 minutes)

#### Step 3: Verify

1. Visit https://tappyline.com
2. Open browser DevTools (F12)
3. Go to **Network** tab
4. Look for request to `cloud.umami.is/script.js`
5. If you see it → Analytics is working! 🎉

---

## 📈 What You'll Track

Once deployed, Umami will automatically track:

### Automatic Tracking:

- ✅ Page views (homepage, queue pages, vendor dashboards)
- ✅ Unique visitors
- ✅ Traffic sources (where visitors come from)
- ✅ Device types (mobile, desktop, tablet)
- ✅ Browsers (Chrome, Safari, Firefox, etc.)
- ✅ Countries & cities
- ✅ Real-time visitor count

### Optional Custom Events:

You can later add tracking for:

- Queue creations
- Customers joining queues
- Vendors serving customers
- QR code downloads
- Link shares

(See `UMAMI_ANALYTICS_SETUP.md` for code examples)

---

## 🎯 Vercel Environment Variable Summary

Add this ONE variable to Vercel:

```
Key:   NEXT_PUBLIC_UMAMI_WEBSITE_ID
Value: key for umami
Environments: Production, Preview, Development (all three)
```

---

## 🛡️ Privacy-Friendly

Umami is GDPR & CCPA compliant:

- ✅ No cookies
- ✅ No personal data collection
- ✅ No consent banner needed
- ✅ 100% privacy-friendly

---

## 📊 Accessing Your Analytics

**Umami Dashboard:**

- URL: https://cloud.umami.is
- Login with your Umami account
- Select your TappyLine website
- View all analytics in real-time!

---

## 🔍 Files Changed

1. `pages/_document.tsx` - Added Umami script
2. `.env.example` - Added variable documentation
3. `.env.local` - Added your Umami key (local only)
4. `UMAMI_ANALYTICS_SETUP.md` - Full documentation

---

## ✅ That's It!

Just add the environment variable to Vercel, redeploy, and you're tracking! 🚀

For detailed instructions, advanced features, and troubleshooting, see:
👉 **UMAMI_ANALYTICS_SETUP.md**
