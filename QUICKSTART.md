# 🚀 TappyLine - Quick Start Guide

Get your queue management system running in **5 minutes**!

## 📋 What You Need

- Node.js 18+ (check: `node --version`)
- An Appwrite Cloud account ([Sign up free](https://cloud.appwrite.io))

## ⚡ Quick Setup

### 1. Install Dependencies ✅ (DONE)

Dependencies are already installed!

### 2. Set Up Appwrite (5 minutes)

#### Create Appwrite Project

1. Go to **https://cloud.appwrite.io**
2. Sign in / Sign up
3. Click **"Create Project"**
4. Name: `TappyLine`
5. **Copy the Project ID** → Save it!

#### Create Database

1. Click **"Databases"** (left sidebar)
2. Click **"Create Database"**
3. Name: `tappyline-db`
4. **Copy the Database ID** → Save it!

#### Create Collection #1: Queues

1. Click **"Create Collection"**
2. Name: `queues`
3. **Copy the Collection ID** → Save it!

4. Click **"Attributes"** tab → Add these attributes:

```
queueId       → String (50) → Required
businessName  → String (100) → Required
contactEmail  → Email (320) → Optional
contactPhone  → String (20) → Optional
isActive      → Boolean → Required → Default: true
createdAt     → String (50) → Required
currentServing → Integer → Optional → Default: 0
```

5. Click **"Indexes"** tab → Create index:

   - Name: `queueId_idx`
   - Attribute: `queueId`
   - Type: Key

6. Click **"Settings"** tab:
   - Scroll to **"Permissions"**
   - Click **"Add Role"**
   - Select: **Any**
   - Check: ✅ Read, ✅ Create, ✅ Update
   - Click **"Update"**

#### Create Collection #2: Customers

1. Click **"Create Collection"** again
2. Name: `customers`
3. **Copy the Collection ID** → Save it!

4. Click **"Attributes"** tab → Add these attributes:

```
queueId      → String (50) → Required
customerName → String (100) → Required
customerPhone → String (20) → Optional
position     → Integer → Required
status       → String (20) → Required → Default: waiting
joinedAt     → String (50) → Required
notifiedAt   → String (50) → Optional
```

5. Click **"Indexes"** tab → Create two indexes:

   **Index 1:**

   - Name: `queueId_idx`
   - Attribute: `queueId`
   - Type: Key

   **Index 2:**

   - Name: `position_idx`
   - Attribute: `position`
   - Type: Key

6. Click **"Settings"** tab:
   - Scroll to **"Permissions"**
   - Click **"Add Role"**
   - Select: **Any**
   - Check: ✅ Read, ✅ Create, ✅ Update
   - Click **"Update"**

#### Add Platform

1. Click **"Settings"** in left sidebar
2. Scroll to **"Platforms"**
3. Click **"Add Platform"** → **"New Web App"**
4. Name: `TappyLine Web`
5. Hostname: `localhost`
6. Click **"Next"**

### 3. Configure Environment

1. Open `.env.local` in the `tappyline-app` folder
2. Replace the placeholder values with your IDs:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=<your_project_id>

# Database Configuration
NEXT_PUBLIC_APPWRITE_DATABASE_ID=<your_database_id>
NEXT_PUBLIC_APPWRITE_QUEUES_COLLECTION_ID=<your_queues_collection_id>
NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID=<your_customers_collection_id>

# App URL (for QR codes)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the App

```bash
npm run dev
```

Open your browser: **http://localhost:3000**

## 🎉 You're Done!

### Test It Out

1. **Create a Queue**:

   - Enter a business name: "Mario's Pizza"
   - Click "Create Queue Now"
   - You'll see the vendor dashboard with a QR code

2. **Join as Customer**:

   - Right-click the QR code → "Copy Link Address"
   - Open in a new incognito/private window
   - Enter your name and join the queue

3. **Manage the Queue**:
   - Back in the vendor dashboard
   - Click "Serve Next" to call the customer
   - See real-time updates in both windows!

## 📖 What's Next?

- **Read the full README**: `README.md`
- **Detailed Appwrite guide**: `APPWRITE_SETUP.md`
- **Deploy to production**: Follow deployment guide in README

## 🐛 Something Wrong?

### Common Issues

**Error: Cannot find module**

```bash
npm install
```

**Queue not loading**

- Check all IDs in `.env.local` are correct
- Restart dev server: Stop (Ctrl+C) and run `npm run dev`

**Real-time not working**

- Verify collection permissions are set to "Any" with Read, Create, Update
- Check browser console for errors

**Need more help?**

- Check `APPWRITE_SETUP.md` for detailed troubleshooting
- Review Appwrite console for error messages

## 🎊 Success Checklist

- ✅ Dependencies installed
- ⬜ Appwrite project created
- ⬜ Database created
- ⬜ Queues collection created with attributes, indexes, and permissions
- ⬜ Customers collection created with attributes, indexes, and permissions
- ⬜ Platform added (localhost)
- ⬜ Environment variables configured
- ⬜ Dev server running
- ⬜ Successfully created first queue!

---

**Made with ❤️ to make queues simple again**

_Remember: If it takes more than 30 seconds, it's too complicated!_
