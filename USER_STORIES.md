# TappyLine - User Stories

## 🏪 Vendor User Stories

### Story 1: Creating a Queue (First Time User)

**As a** business owner running a busy café

**I want to** create a queue management system quickly without any technical knowledge

**So that** I can organize my customers better without downloading apps or creating accounts

**Acceptance Criteria:**

- I can access the homepage from any web browser
- I only need to enter my business name (required)
- Contact info (email/phone) is optional
- The entire process takes less than 30 seconds
- I receive a unique QR code immediately
- I get a direct link to my vendor dashboard

**Example Flow:**

1. Opens `tappyline.app` on their phone
2. Sees "Create Your Queue" form
3. Types "Mario's Pizza" as business name
4. Clicks "Create Queue Now"
5. Instantly redirected to dashboard with QR code
6. Downloads QR code and prints it
7. Places it at the counter

---

### Story 2: Managing the Queue (Active Vendor)

**As a** vendor with customers in my queue

**I want to** see all waiting customers and call them in order

**So that** I can serve customers efficiently and fairly

**Acceptance Criteria:**

- I can see the current queue size at a glance
- Each customer shows: position number, name, phone, join time
- The next customer to serve is highlighted prominently
- I can click "Serve Next" to call the next customer
- I can remove specific customers if they leave
- I can clear the entire queue if needed
- Changes reflect in real-time without refreshing

**Example Flow:**

1. Opens vendor dashboard (bookmarked)
2. Sees 5 customers waiting
3. Customer #1 (John) is highlighted in orange
4. Clicks "Serve Next"
5. Toast notification: "John has been served!"
6. Customer #2 (Sarah) automatically moves to #1 position
7. The customer list updates instantly

---

### Story 3: Sharing the Queue

**As a** vendor who wants more customers to use the system

**I want to** easily share my queue link multiple ways

**So that** customers can join even if they can't scan the QR code

**Acceptance Criteria:**

- QR code is prominently displayed and downloadable
- "Copy Link" button copies queue URL to clipboard
- Confirmation toast appears when link is copied
- Link works on any device without app installation
- QR code can be saved as a high-quality PNG image

**Example Flow:**

1. Customer asks "How do I join the queue?"
2. Vendor clicks "Copy Link" button
3. Toast: "Link copied to clipboard!"
4. Sends link via WhatsApp to customer
5. Customer opens link on their phone
6. Immediately sees queue join form

---

### Story 4: Handling Customer Removals

**As a** vendor dealing with customers who change their mind

**I want to** remove customers from the queue safely

**So that** the queue stays accurate and positions auto-adjust

**Acceptance Criteria:**

- I can click "Remove" button next to any customer
- A confirmation dialog prevents accidental removals
- After confirmation, customer is removed instantly
- All remaining customers' positions update automatically
- Removed customer sees notification on their screen
- No gaps in position numbers (1, 2, 3... continuous)

**Example Flow:**

1. Customer #4 (Mike) decides to leave
2. Vendor clicks "Remove" next to Mike's name
3. Confirms: "Remove Mike from the queue?"
4. Mike is removed
5. Previous #5 becomes new #4
6. Mike's phone shows: "You were removed from the queue"

---

## 👥 Customer User Stories

### Story 5: Joining a Queue (New Customer)

**As a** customer at a busy business

**I want to** join the queue quickly from my phone

**So that** I don't have to physically stand in line

**Acceptance Criteria:**

- I can scan a QR code using my phone's camera
- The queue page loads instantly
- I only need to provide my name (required)
- Phone number is optional but recommended
- I can join the queue in under 10 seconds
- No app download or account creation required

**Example Flow:**

1. Scans QR code at café counter
2. Browser opens queue page automatically
3. Sees: "Mario's Pizza - Join the Queue"
4. Types name: "Sarah"
5. Optionally adds phone: "+1234567890"
6. Clicks "Join Queue"
7. Toast: "You've joined the queue!"
8. Sees current position: #5

---

### Story 6: Monitoring Position (Waiting Customer)

**As a** customer waiting in the queue

**I want to** see my current position update in real-time

**So that** I know when to return to the business

**Acceptance Criteria:**

- My position number is displayed prominently
- Shows how many people are ahead of me
- Position updates automatically without refreshing
- Visual indicator changes when I'm next (orange highlight)
- Shows my join time for reference
- I can leave the queue if I change my mind

**Example Flow:**

1. Joins queue at position #5
2. Sees: "4 people ahead of you"
3. Browses nearby shops while monitoring phone
4. Position updates: #5 → #4 → #3
5. Automatically sees changes as others are served
6. Gets visual feedback with each update

---

### Story 7: Getting Notified (Almost Ready)

**As a** customer who is next in line

**I want to** receive a clear notification

**So that** I know to return to the business counter

**Acceptance Criteria:**

- When I become "next," page highlights in orange
- Toast notification: "You're next! Get ready! 👋"
- Badge changes from gray to orange
- Clear message: "You're Next!"
- Can still see I'm position #1
- When served, notification: "It's your turn! Head to the counter! 🎊"

**Example Flow:**

1. Currently at position #2
2. Customer #1 gets served
3. Instant orange highlight animation
4. Toast pops up: "You're next! Get ready!"
5. Starts walking back to café
6. A minute later: "It's your turn!"
7. Goes to counter to collect order

---

### Story 8: Leaving the Queue (Changed Mind)

**As a** customer who needs to leave

**I want to** remove myself from the queue easily

**So that** I don't hold up others and the queue stays accurate

**Acceptance Criteria:**

- "Leave Queue" button is clearly visible
- Clicking removes me immediately
- My position is freed up for others
- Confirmation message appears
- Can rejoin if I change my mind again
- No data is saved after leaving (fresh start)

**Example Flow:**

1. Currently at position #4
2. Receives urgent phone call
3. Clicks "Leave Queue" button
4. Immediately removed
5. Toast: "You've left the queue"
6. Page shows join form again
7. Can rejoin as position #5 if returning

---

### Story 9: Using Without QR Code (Link Sharing)

**As a** customer who received a queue link

**I want to** join by clicking the link

**So that** I can participate without scanning a code

**Acceptance Criteria:**

- Queue link works in any browser
- No QR scanner app needed
- Link format is shareable (SMS, WhatsApp, email)
- Opens directly to queue join page
- Same experience as QR code users

**Example Flow:**

1. Friend sends link via WhatsApp
2. Clicks link on phone
3. Opens in mobile browser
4. Sees queue join form
5. Fills name and joins
6. Same real-time experience as others

---

## 🔄 Real-Time Update Stories

### Story 10: Simultaneous Multi-User Updates

**As a** system user (vendor or customer)

**I want to** see changes made by others instantly

**So that** everyone has the same accurate view of the queue

**Acceptance Criteria:**

- When vendor serves a customer, all customers see position changes
- When a customer joins, vendor sees count increase immediately
- When a customer leaves, both vendor and other customers see updates
- No page refresh required
- Updates happen within 1-2 seconds
- WebSocket connection handles real-time sync

**Example Flow:**

1. **Vendor**: Clicks "Serve Next" for customer #1
2. **Customer #2**: Sees position change from 2→1 instantly
3. **Customer #3**: Sees position change from 3→2 instantly
4. **New Customer**: Joins queue
5. **Vendor**: Queue count updates from 4→5 automatically
6. **All Customers**: See new person added at end

---

## 🎯 Edge Case Stories

### Story 11: Handling Network Issues

**As a** user with unstable internet

**I want to** still see my queue status when connection returns

**So that** I don't lose my place or data

**Acceptance Criteria:**

- Saved position in localStorage persists
- Reconnects to real-time updates when online
- Shows loading states during connectivity issues
- Doesn't duplicate entries when reconnecting

---

### Story 12: Multiple Device Access

**As a** vendor managing from multiple devices

**I want to** access my queue from any browser

**So that** multiple staff members can manage the same queue

**Acceptance Criteria:**

- Same queue ID works on all devices
- All devices see real-time updates
- Can bookmark vendor dashboard link
- No login required, just know the URL

---

## 📱 Mobile-First Stories

### Story 13: Mobile Vendor Management

**As a** vendor using a smartphone

**I want** a mobile-optimized dashboard

**So that** I can manage queues from anywhere

**Acceptance Criteria:**

- Dashboard works perfectly on mobile screens
- Buttons are large and touch-friendly
- QR code is readable and downloadable on mobile
- Can switch between customers easily
- Portrait and landscape modes both work

---

### Story 14: Mobile Customer Experience

**As a** customer on a smartphone

**I want** an easy-to-read queue status

**So that** I can monitor my position comfortably

**Acceptance Criteria:**

- Large position number (easy to glance at)
- Swipe-friendly interface
- Readable text without zooming
- Works in both portrait and landscape
- Low battery consumption

---

## 🏁 Success Metrics

**Vendor Success:**

- Creates queue in < 30 seconds ✅
- Can manage 20+ customers easily ✅
- Reduces physical crowding ✅
- No training required ✅

**Customer Success:**

- Joins queue in < 10 seconds ✅
- Clear visibility of position ✅
- Timely notifications ✅
- No app download needed ✅

**System Success:**

- Real-time updates < 2 seconds ✅
- Works on all devices ✅
- Zero registration friction ✅
- 99.9% uptime (Appwrite Cloud) ✅
