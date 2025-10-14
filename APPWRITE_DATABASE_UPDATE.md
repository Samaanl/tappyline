# 📝 Appwrite Database Update - Customer Message Feature

## What Changed?

We added a **customer message** feature that allows customers to send notes to vendors when joining the queue. For example:

- "I want to order 2 pizzas"
- "Looking for a haircut"
- "Need a table for 4"
- "Picking up my online order #1234"

---

## 🔧 Required Database Changes

### Step 1: Log into Appwrite Console

1. Go to [https://cloud.appwrite.io](https://cloud.appwrite.io) (or your Appwrite endpoint)
2. Log in to your account
3. Select your **TappyLine** project

---

### Step 2: Navigate to Your Database

1. Click on **Databases** in the left sidebar
2. Select your TappyLine database (the one with ID: `68edf1ac00327571a08f`)
3. Click on the **`customers`** collection

---

### Step 3: Add New Attribute

You need to add a new attribute to store customer messages.

#### Click "Create Attribute"

Select: **String**

#### Configuration:

| Field             | Value                                 |
| ----------------- | ------------------------------------- |
| **Attribute Key** | `customerMessage`                     |
| **Size**          | `200`                                 |
| **Required**      | **No** (uncheck this - it's optional) |
| **Array**         | **No** (uncheck this)                 |
| **Default Value** | Leave empty                           |

#### Click "Create"

Wait for the attribute to be created (may take a few seconds).

---

## ✅ Verification

After adding the attribute:

1. Go to the **Documents** tab in your `customers` collection
2. You should see a new column called `customerMessage`
3. It will be empty for existing customers (that's fine!)

---

## 📸 Visual Guide

### Before (Old Schema):

```
customers collection:
- queueId (string, required)
- customerName (string, required)
- customerPhone (string, optional)
- position (integer, required)
- status (string, required)
- joinedAt (datetime, required)
- notifiedAt (datetime, optional)
```

### After (New Schema):

```
customers collection:
- queueId (string, required)
- customerName (string, required)
- customerPhone (string, optional)
- customerMessage (string, optional) ← NEW!
- position (integer, required)
- status (string, required)
- joinedAt (datetime, required)
- notifiedAt (datetime, optional)
```

---

## 🚀 What This Enables

### For Customers:

- Can send a message when joining the queue
- Tell vendor what they need
- Provide order details or preferences
- Optional field (200 character limit)

### For Vendors:

- See customer messages on the dashboard
- Prepare orders in advance
- Better understand customer needs
- Messages appear in a blue bubble 💬

---

## 🎯 Example Messages Customers Can Send

**Restaurant:**

- "2 pepperoni pizzas, large"
- "Table for 4, anniversary dinner"
- "Picking up takeout order #456"

**Salon:**

- "Haircut and beard trim"
- "Need coloring, have 2 hours"
- "Just a quick trim, no wash"

**Pop-up Shop:**

- "Looking for size M t-shirts"
- "Interested in the blue backpack"
- "Just browsing, no rush"

**Event:**

- "Registering for workshop #3"
- "VIP ticket pickup - John Smith"
- "Question about pricing"

---

## 🔍 Troubleshooting

### "Attribute already exists" error?

- The attribute might already be created. Check the attributes list.
- If it exists with wrong settings, delete it and recreate with correct settings.

### Messages not showing on vendor dashboard?

- Make sure you've deployed the latest code to Vercel
- Clear your browser cache
- Check that the attribute is named exactly `customerMessage` (case-sensitive!)

### Can't create attribute?

- Make sure you have the correct permissions in Appwrite
- Make sure the collection isn't locked or in use
- Wait a few seconds and try again

---

## 💡 Tips

1. **The field is optional** - Customers don't have to write a message to join
2. **200 character limit** - Keeps messages short and relevant
3. **Messages are stored permanently** - They stay with the customer record
4. **No editing after joining** - Customers can't change their message once they've joined (they'd need to leave and rejoin)

---

## ✅ That's It!

Once you've added the `customerMessage` attribute to your Appwrite `customers` collection, the feature is ready to use!

Deploy your updated code to Vercel, and customers will see the new message field when joining queues.
