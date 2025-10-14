# 🔒 Password Protection - Quick Reference

## At a Glance

### Creating a Queue

```
┌─────────────────────────────────────┐
│  Create Your Queue                  │
├─────────────────────────────────────┤
│                                     │
│  🔒 Security Protection             │
│  Add email OR phone to protect      │
│  your dashboard                     │
│                                     │
│  Business Name: Mario's Pizza       │
│                                     │
│  Email (security password):         │
│  ├─ mario@pizza.com ✓               │
│  └─ Used as password                │
│                                     │
│  Phone (security password):         │
│  ├─ (empty)                         │
│  └─ Used as password                │
│                                     │
│  [Create Queue Now →]               │
│                                     │
└─────────────────────────────────────┘
         ↓
    Queue Created!
         ↓
┌─────────────────────────────────────┐
│  Vendor Dashboard                   │
│  Mario's Pizza  🔒 Protected        │
├─────────────────────────────────────┤
│  [🔓 Logout]  [← Home]              │
│                                     │
│  ✓ Auto-authenticated               │
│  (password saved in browser)        │
└─────────────────────────────────────┘
```

### Accessing Protected Dashboard (New Device)

```
Open vendor link
         ↓
┌─────────────────────────────────────┐
│  🔒 Protected Queue                 │
│                                     │
│  Mario's Pizza                      │
│  This dashboard is password-        │
│  protected                          │
│                                     │
│  Enter Email or Phone Number:      │
│  ├─ mario@pizza.com                 │
│  └─ Use credentials from setup      │
│                                     │
│  [Unlock Dashboard]                 │
│                                     │
│  Lost access? You'll need the       │
│  exact email or phone you used.     │
└─────────────────────────────────────┘
         ↓
    Correct password?
         ↓
       YES ──→ Dashboard Access ✓
         ↓
        NO ──→ "Incorrect password" ✗
```

### Without Password Protection

```
┌─────────────────────────────────────┐
│  Create Your Queue                  │
├─────────────────────────────────────┤
│  Business Name: Quick Stand         │
│                                     │
│  Email: (empty)                     │
│  Phone: (empty)                     │
│                                     │
│  ⚠️ Warning: Anyone with your link  │
│  can manage it. Add email/phone!    │
│                                     │
│  [Create Queue Now →]               │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Vendor Dashboard                   │
│  Quick Stand                        │
├─────────────────────────────────────┤
│  [← Home]                           │
│                                     │
│  ✓ No password required             │
│  ⚠️ Open access                     │
└─────────────────────────────────────┘
```

## Key Points

### ✅ DO

1. **Add email OR phone** when creating queue
2. **Remember your credentials** (no recovery!)
3. **Use logout** on shared devices
4. **Keep credentials private** (they are your password)

### ❌ DON'T

1. **Share vendor dashboard link** publicly
2. **Use someone else's email** (you won't remember it)
3. **Forget to logout** on public computers
4. **Leave both email and phone empty** (unless you want open access)

## Password Rules

| Scenario    | Email  | Phone  | Result                            |
| ----------- | ------ | ------ | --------------------------------- |
| Both filled | ✅ Yes | ✅ Yes | Email is password (phone ignored) |
| Email only  | ✅ Yes | ❌ No  | Email is password                 |
| Phone only  | ❌ No  | ✅ Yes | Phone is password                 |
| Neither     | ❌ No  | ❌ No  | ⚠️ No protection (open access)    |

## URLs Explained

```
Homepage:
https://tappyline.app
  └─ Anyone can access
  └─ Create new queues

Vendor Dashboard:
https://tappyline.app/vendor/marios-pizza-a1b2
  └─ 🔒 Protected (if email/phone set)
  └─ Only vendor should know this link
  └─ Manage queue, serve customers

Customer Queue:
https://tappyline.app/q/marios-pizza-a1b2
  └─ ✅ Public (share this!)
  └─ Customers scan QR to get this
  └─ Join queue, see position
```

## Common Scenarios

### Scenario 1: Lost Credentials

**Problem:** "I forgot my email!"
**Solution:** Create a new queue
**Prevention:** Write it down or use your actual email

### Scenario 2: Typo in Email

**Problem:** Typed `mario@gmail.co` instead of `.com`
**Solution:** Create new queue (can't fix typo)
**Prevention:** Double-check before submitting

### Scenario 3: Multiple Staff

**Problem:** "My employee needs access"
**Solution:** Share the email/phone password with them
**Better:** Create separate queues per shift

### Scenario 4: Device Lost

**Problem:** "My phone with queue link is lost!"
**Solution:**

- If you remember the queueId: Access from any device
- Enter email/phone when prompted
- If you don't remember queueId: Create new queue

## Quick Commands

### Save Queue Link

```
Bookmark this in your browser:
https://tappyline.app/vendor/{your-queue-id}
```

### Logout (Clear Credentials)

```
Click "🔓 Logout" button in header
OR
Clear browser localStorage manually
```

### Share Customer Link

```
Give customers this link:
https://tappyline.app/q/{your-queue-id}
OR
Display the QR code (same link)
```

## Security Levels

### 🔴 LOW (No Password)

- Skip email and phone
- Dashboard is open to anyone
- Use for: Temporary pop-ups, low-risk scenarios

### 🟡 MEDIUM (Email or Phone)

- Add email OR phone
- Dashboard is password-protected
- Use for: Regular businesses, most scenarios

### 🟢 HIGH (Not Available Yet)

- Would need: Proper authentication system
- Features: 2FA, password reset, account management
- Use for: Multi-location, enterprise scenarios

## Troubleshooting

### "Incorrect password"

- Check for typos in email/phone
- Try both if you entered both during setup
- Email is used first (if both were provided)

### "Queue not found"

- QueueId might be wrong
- Queue might have been deleted
- Check the URL carefully

### "Lost access" message

- No password recovery available
- Must use exact credentials from setup
- Create new queue if truly lost

### Dashboard doesn't prompt for password

- Queue was created without email/phone
- This is expected (open access)
- Anyone with link can manage

## Best Practices

1. **Use your real email** - Easy to remember
2. **Write down queueId** - In case you need to share link
3. **Test access once** - Open in private window to verify
4. **Logout on shared devices** - Don't leave authenticated
5. **Don't share vendor link** - Only share customer QR/link

---

## One-Line Summary

> **Email or phone = password. Add one to protect, leave empty for open access.**

---

**Made with ❤️ to keep queues simple AND secure**
