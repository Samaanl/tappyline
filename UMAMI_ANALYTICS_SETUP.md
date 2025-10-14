# 📊 Umami Analytics Integration Guide

## What is Umami?

Umami is a simple, privacy-focused, open-source analytics platform. It's a great alternative to Google Analytics because:

- ✅ Privacy-friendly (GDPR compliant)
- ✅ No cookies required
- ✅ Lightweight and fast
- ✅ Open-source
- ✅ Beautiful dashboard

---

## 🎯 What Was Integrated?

I've added Umami Analytics tracking to your TappyLine app. It will automatically track:

### Page Views:

- Homepage visits
- Queue creation page
- Customer queue view (`/q/[queueId]`)
- Vendor dashboard (`/vendor/[queueId]`)

### Events You Can Track:

You can add custom event tracking for:

- Queue creation
- Customer joins queue
- Customer leaves queue
- Vendor serves customer
- QR code downloads
- Link shares

---

## 🔧 What Changed in Your Code?

### 1. `pages/_document.tsx`

Added the Umami tracking script:

```tsx
{
  /* Umami Analytics */
}
{
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
    <script
      async
      src="https://cloud.umami.is/script.js"
      data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
    ></script>
  );
}
```

### 2. `.env.example`

Added documentation for the new environment variable:

```bash
# Umami Analytics (Optional)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your_umami_website_id_here
```

### 3. `.env.local`

Added your Umami website ID (locally):

```bash
NEXT_PUBLIC_UMAMI_WEBSITE_ID="key for umami"
```

---

## 🚀 Vercel Environment Variables Setup

### Step 1: Go to Vercel Dashboard

1. Open your Vercel dashboard: https://vercel.com
2. Select your **TappyLine** project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Umami Variable

Click **"Add New"** and enter:

| Field           | Value                                                               |
| --------------- | ------------------------------------------------------------------- |
| **Key**         | `NEXT_PUBLIC_UMAMI_WEBSITE_ID`                                      |
| **Value**       | `key for umami`                                                     |
| **Environment** | Select **Production**, **Preview**, and **Development** (all three) |

### Step 3: Redeploy

After adding the environment variable:

- Click **"Save"**
- Go to **Deployments** tab
- Click **"Redeploy"** on the latest deployment
- OR push a new commit to trigger auto-deployment

---

## 📊 What Will You See in Umami?

Once deployed, your Umami dashboard will show:

### Real-Time Metrics:

- **Current visitors** - How many people are on your site right now
- **Page views** - Total page loads
- **Unique visitors** - Individual users (based on IP/browser)
- **Bounce rate** - Single-page visits
- **Average time** - How long users stay

### Traffic Sources:

- **Referrers** - Where visitors came from
- **Direct traffic** - Direct URL visits
- **Social media** - Facebook, Twitter, etc.
- **Search engines** - Google, Bing, etc.

### Page Analytics:

- Most visited pages
- Entry pages (first page users see)
- Exit pages (last page before leaving)

### Device Analytics:

- Desktop vs Mobile vs Tablet
- Browser types (Chrome, Safari, Firefox)
- Operating systems (Windows, Mac, iOS, Android)
- Screen sizes

### Geographic Data:

- Countries
- Cities
- Languages

---

## 🎨 Custom Event Tracking (Optional)

If you want to track specific actions, you can add custom events. Here are examples:

### Track Queue Creation:

In `pages/index.tsx`, add after successful queue creation:

```typescript
// After queue is created successfully
if (window.umami) {
  window.umami.track("queue-created", {
    businessName: businessName,
    hasPassword: !!(contactEmail || contactPhone),
  });
}
```

### Track Customer Joins:

In `pages/q/[queueId].tsx`, add after customer joins:

```typescript
// After customer joins successfully
if (window.umami) {
  window.umami.track("customer-joined", {
    queueId: queueId,
    position: customer.position,
  });
}
```

### Track Vendor Actions:

In `pages/vendor/[queueId].tsx`:

```typescript
// When serving next customer
if (window.umami) {
  window.umami.track("customer-served", {
    queueId: queueId,
  });
}

// When downloading QR code
if (window.umami) {
  window.umami.track("qr-code-downloaded");
}
```

### TypeScript Declaration (if needed):

Add to `types/umami.d.ts`:

```typescript
interface Window {
  umami?: {
    track: (eventName: string, eventData?: Record<string, any>) => void;
  };
}
```

---

## 🔍 Verification

### Test Locally:

1. Run `npm run dev`
2. Open http://localhost:3000
3. Open browser DevTools → Network tab
4. Look for request to `cloud.umami.is/script.js`
5. If you see it, analytics is working! ✅

### Test Production:

1. Deploy to Vercel
2. Visit https://tappyline.com
3. Open browser DevTools → Network tab
4. Look for Umami script request
5. Go to your Umami dashboard
6. You should see your visit in real-time!

---

## 🛡️ Privacy & Compliance

Umami is privacy-friendly by design:

✅ **No cookies** - Doesn't use cookies for tracking
✅ **No personal data** - Doesn't collect personally identifiable information
✅ **GDPR compliant** - Meets EU privacy regulations
✅ **CCPA compliant** - Meets California privacy laws
✅ **No consent banner needed** - Privacy-friendly tracking doesn't require cookie consent
✅ **Data ownership** - You own all your analytics data

---

## 📈 Analytics Dashboard Access

### Umami Cloud (Recommended):

- URL: https://cloud.umami.is
- Login with your Umami account
- Select your TappyLine website
- View all analytics data

### Self-Hosted (Advanced):

If you're self-hosting Umami:

- Use your custom domain
- Same tracking script, just change the `src` URL in `_document.tsx`

---

## 🎯 What to Track?

Here are the most valuable metrics for TappyLine:

### Business Metrics:

- **Queue creations** - How many vendors use your app
- **Customer joins** - Total customers using queues
- **Repeat vendors** - Vendors who create multiple queues
- **Peak hours** - When is your app most used?

### User Behavior:

- **Time on page** - Are users engaged?
- **Bounce rate** - Do they leave immediately?
- **Customer wait time** - Average time in queue
- **Conversion rate** - Visitors → Queue creators

### Technical Metrics:

- **Page load time** - Is your app fast?
- **Error rates** - Any issues?
- **Device breakdown** - Mobile vs Desktop usage
- **Browser compatibility** - Which browsers are used?

---

## 🚨 Troubleshooting

### Analytics Not Working?

1. **Check Environment Variable:**

   - Go to Vercel → Settings → Environment Variables
   - Verify `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set
   - Make sure it's enabled for Production

2. **Check Script Loading:**

   - Open browser DevTools → Network tab
   - Filter by "umami"
   - Script should load from `cloud.umami.is`

3. **Ad Blockers:**

   - Some ad blockers block analytics scripts
   - Test in incognito mode
   - Or whitelist your own domain

4. **Incorrect Website ID:**

   - Double-check your Umami website ID
   - Go to Umami dashboard → Settings → Websites
   - Copy the correct ID

5. **Cache Issues:**
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Try different browser

### Script Not Loading?

Check the script URL in `_document.tsx`:

- Default: `https://cloud.umami.is/script.js`
- Self-hosted: `https://your-domain.com/script.js`

---

## 📚 Umami Resources

**Official Documentation:**

- Website: https://umami.is
- Docs: https://umami.is/docs
- GitHub: https://github.com/umami-software/umami

**Tutorials:**

- [Getting Started](https://umami.is/docs/getting-started)
- [Tracking Events](https://umami.is/docs/track-events)
- [API Reference](https://umami.is/docs/api)

---

## ✅ Checklist

- [x] Add Umami script to `_document.tsx`
- [x] Add environment variable to `.env.example`
- [x] Add environment variable to `.env.local`
- [x] Test build (successful ✅)
- [ ] Add `NEXT_PUBLIC_UMAMI_WEBSITE_ID` to Vercel
- [ ] Redeploy on Vercel
- [ ] Verify script loads on production
- [ ] Check Umami dashboard for traffic

---

## 🎉 You're All Set!

Once you add the environment variable to Vercel and redeploy, Umami will automatically start tracking all your TappyLine visitors!

**Remember:** The analytics is privacy-friendly and doesn't require any cookie consent banners. 🎊
