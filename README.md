# TappyLine - Queue Management Made Simple

> If it takes more than 30 seconds, it's too complicated.

A blazingly fast, no-nonsense queue management system built with Next.js and Appwrite. No apps to download, no accounts to create—just scan, join, and go!

## ✨ Features

- **30-Second Setup**: Create a queue in seconds, get a QR code, start managing
- **No App Required**: Works in any web browser on any device
- **Real-Time Updates**: See queue positions update instantly using Appwrite Realtime
- **QR Code Generation**: Automatic QR codes for easy customer onboarding
- **Vendor Dashboard**: Manage queue, serve customers, remove entries
- **Customer View**: Join queue, see position, get notifications
- **Browser Notifications**: Customers get notified when they're next
- **Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile
- **Zero Registration**: Vendors can create queues without signing up

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- An Appwrite Cloud account (free at [cloud.appwrite.io](https://cloud.appwrite.io))

### Installation

1. **Install dependencies**:

   ```bash
   cd tappyline-app
   npm install
   ```

2. **Set up Appwrite**:

   - Follow the detailed guide in [APPWRITE_SETUP.md](./APPWRITE_SETUP.md)
   - Create your project, database, and collections
   - Takes about 5 minutes

3. **Configure environment**:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Appwrite credentials in `.env.local`

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Open your browser**:
   ```
   http://localhost:3000
   ```

🎉 **You're ready!** Create your first queue and start managing!

## 📖 Documentation

- **[Appwrite Setup Guide](./APPWRITE_SETUP.md)** - Complete Appwrite configuration
- **[User Stories](./USER_STORIES.md)** - How vendors and customers use the app

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Backend**: Appwrite Cloud (Database + Realtime)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **QR Codes**: qrcode library
- **Notifications**: React Hot Toast
- **Language**: TypeScript

## 📂 Project Structure

```
tappyline-app/
├── pages/
│   ├── index.tsx              # Homepage with queue creation
│   ├── vendor/[queueId].tsx   # Vendor dashboard
│   ├── q/[queueId].tsx        # Customer queue view
│   ├── _app.tsx               # App wrapper
│   └── _document.tsx          # HTML document
├── lib/
│   └── appwrite.ts            # Appwrite client & operations
├── styles/
│   └── globals.css            # Global styles & components
├── components/                # Reusable components (if needed)
├── .env.local                 # Environment variables (create this)
├── .env.example               # Environment template
└── package.json               # Dependencies
```

## 🎯 User Flow

### Vendor Flow

1. Open homepage → Enter business name → Create queue
2. Get vendor dashboard with QR code
3. Display QR code at business location
4. Click "Serve Next" to call customers
5. Remove customers if needed
6. Share queue link via copy button

### Customer Flow

1. Scan QR code or open queue link
2. Enter name (optional: phone number)
3. Join queue
4. See real-time position updates
5. Get notified when next in line
6. Get notified when it's your turn
7. Leave queue if needed

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT`
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
   - `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
   - `NEXT_PUBLIC_APPWRITE_QUEUES_COLLECTION_ID`
   - `NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
4. Deploy!
5. Update Appwrite platform settings with your Vercel domain

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your brand colors here
      }
    }
  }
}
```

### Modify Queue Logic

Edit `lib/appwrite.ts` for custom business logic:

- Change queue ordering
- Add customer priorities
- Implement waiting time estimates

## 🐛 Troubleshooting

**Dependencies not found?**

```bash
npm install
```

**Environment variables not working?**

- Restart dev server after changing `.env.local`
- Verify variable names start with `NEXT_PUBLIC_`

**Real-time not working?**

- Check Appwrite collection permissions (Any: Read, Create, Update)
- Verify WebSocket connection in browser console

**QR Code not generating?**

- Check `NEXT_PUBLIC_APP_URL` in `.env.local`
- Ensure qrcode package is installed

## 📊 Database Schema

### Queues Collection

- `queueId`: Unique identifier
- `businessName`: Business name
- `contactEmail`: Optional contact
- `contactPhone`: Optional contact
- `isActive`: Queue status
- `createdAt`: Creation timestamp
- `currentServing`: Current number being served

### Customers Collection

- `queueId`: Reference to queue
- `customerName`: Customer name
- `customerPhone`: Optional phone
- `position`: Queue position
- `status`: waiting | next | served | left
- `joinedAt`: Join timestamp
- `notifiedAt`: Notification timestamp

## 🔐 Security

- No authentication required for basic usage
- Appwrite handles all security
- Collections have "Any" permissions for public access
- Consider adding vendor authentication for production

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 💡 Philosophy

**"If it takes more than 30 seconds, it's too complicated."**

TappyLine embodies simplicity:

- No app downloads
- No account creation
- No complex setup
- Just scan, join, and go!

## 🙏 Credits

Built with:

- [Next.js](https://nextjs.org/)
- [Appwrite](https://appwrite.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hot Toast](https://react-hot-toast.com/)

---

**Made with ❤️ to make queues simple again**

For detailed setup instructions, see [APPWRITE_SETUP.md](./APPWRITE_SETUP.md)
