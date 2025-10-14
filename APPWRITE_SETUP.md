# TappyLine - Appwrite Setup Guide

## 📋 Prerequisites

- Node.js 18+ installed
- An Appwrite Cloud account (free at [cloud.appwrite.io](https://cloud.appwrite.io))

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd tappyline-app
npm install
```

### Step 2: Create Appwrite Project

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Sign up or log in
3. Click **"Create Project"**
4. Name it: `TappyLine`
5. Copy your **Project ID**

### Step 3: Set Up Database

#### Create Database

1. In your project, click **"Databases"** in the left sidebar
2. Click **"Create Database"**
3. Name it: `tappyline-db`
4. Copy the **Database ID**

#### Create Collections

**Collection 1: Queues**

1. Inside your database, click **"Create Collection"**
2. Name: `queues`
3. Copy the **Collection ID**
4. Go to **"Attributes"** tab and add these:

| Attribute        | Type    | Size | Required | Default |
| ---------------- | ------- | ---- | -------- | ------- |
| `queueId`        | String  | 50   | ✅ Yes   | -       |
| `businessName`   | String  | 100  | ✅ Yes   | -       |
| `contactEmail`   | Email   | 320  | ❌ No    | -       |
| `contactPhone`   | String  | 20   | ❌ No    | -       |
| `isActive`       | Boolean | -    | ✅ Yes   | true    |
| `createdAt`      | String  | 50   | ✅ Yes   | -       |
| `currentServing` | Integer | -    | ❌ No    | 0       |

5. Go to **"Indexes"** tab and create:

   - Index name: `queueId_idx`
   - Attribute: `queueId`
   - Type: Key

6. Go to **"Settings"** tab → **"Permissions"**
   - Add: **Any** with these permissions:
     - ✅ Read
     - ✅ Create
     - ✅ Update
   - Click **"Update"**

**Collection 2: Customers**

1. Click **"Create Collection"** again
2. Name: `customers`
3. Copy the **Collection ID**
4. Go to **"Attributes"** tab and add these:

| Attribute       | Type    | Size | Required | Default |
| --------------- | ------- | ---- | -------- | ------- |
| `queueId`       | String  | 50   | ✅ Yes   | -       |
| `customerName`  | String  | 100  | ✅ Yes   | -       |
| `customerPhone` | String  | 20   | ❌ No    | -       |
| `position`      | Integer | -    | ✅ Yes   | -       |
| `status`        | String  | 20   | ✅ Yes   | waiting |
| `joinedAt`      | String  | 50   | ✅ Yes   | -       |
| `notifiedAt`    | String  | 50   | ❌ No    | -       |

5. Go to **"Indexes"** tab and create:

   - Index name: `queueId_idx`
   - Attribute: `queueId`
   - Type: Key

   - Index name: `position_idx`
   - Attribute: `position`
   - Type: Key

6. Go to **"Settings"** tab → **"Permissions"**
   - Add: **Any** with these permissions:
     - ✅ Read
     - ✅ Create
     - ✅ Update
   - Click **"Update"**

### Step 4: Configure Platform Settings

1. In your Appwrite project, click **"Settings"** in the left sidebar
2. Scroll to **"Platforms"**
3. Click **"Add Platform"** → **"New Web App"**
4. Name: `TappyLine Web`
5. Hostname: `localhost`
6. Click **"Next"**

### Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your IDs:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here

# Database Configuration
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
NEXT_PUBLIC_APPWRITE_QUEUES_COLLECTION_ID=your_queues_collection_id_here
NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID=your_customers_collection_id_here

# App URL (for QR codes)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 6: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

---

## 📱 How to Use

### For Vendors (Business Owners)

1. Go to homepage
2. Enter your business name
3. Click **"Create Queue Now"**
4. You'll get:
   - A unique QR code
   - A vendor dashboard to manage the queue
5. Display the QR code at your business
6. Use **"Serve Next"** button to call customers
7. Remove customers if needed
8. Share the queue link with customers

### For Customers

1. Scan the vendor's QR code OR open the queue link
2. Enter your name (optional: phone number)
3. Click **"Join Queue"**
4. See your position in real-time
5. Get notified when you're next or when it's your turn!

---

## 🔧 Troubleshooting

### Error: "Cannot find module 'appwrite'"

**Solution:** Run `npm install` in the `tappyline-app` directory

### Error: "Queue not found"

**Solution:**

- Check that your environment variables are correct in `.env.local`
- Make sure you copied the correct IDs from Appwrite
- Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

### Real-time updates not working

**Solution:**

- Verify collection permissions are set to "Any" with Read, Create, Update
- Check browser console for WebSocket errors
- Ensure you're using Appwrite Cloud endpoint: `https://cloud.appwrite.io/v1`

### QR Code not generating

**Solution:**

- Check that `NEXT_PUBLIC_APP_URL` is set in `.env.local`
- For local testing: `http://localhost:3000`
- For production: Your actual domain

---

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Update `NEXT_PUBLIC_APP_URL` to your Vercel domain
6. Update Appwrite platform settings with your Vercel domain

### Update Appwrite for Production

1. In Appwrite, go to **Settings** → **Platforms**
2. Add your production domain (e.g., `tappyline.vercel.app`)
3. Update CORS settings if needed

---

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Change these to your brand colors
        50: '#fff7ed',
        // ... other shades
      }
    }
  }
}
```

### Change App Name/Logo

Edit `pages/_app.tsx` and `pages/index.tsx`

---

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify all Appwrite IDs are correct
3. Ensure collection permissions are set properly
4. Make sure you ran `npm install`

---

## 🎉 You're Done!

Your queue management system is now ready. Share the QR code and start managing queues in 30 seconds! 🚀
