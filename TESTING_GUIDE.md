# 🧪 Real-Time Position Updates - Testing Guide

## Quick Test Scenarios

### Test 1: Serve Next Updates All Positions

**Setup:**

```
1. Create queue on device A (vendor dashboard)
2. Join queue on device B as "Alice"
3. Join queue on device C as "Bob"
4. Join queue on device D as "Carol"
```

**Expected State:**

```
Vendor Dashboard (A):     Customer View B:     Customer View C:     Customer View D:
┌──────────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ #1 Alice         │     │ Position: #1 │     │ Position: #2 │     │ Position: #3 │
│ #2 Bob           │     │ Status: NEXT │     │ Status: Wait │     │ Status: Wait │
│ #3 Carol         │     │ (orange)     │     │              │     │              │
└──────────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**Action:**

- Vendor (A) clicks "Serve Next"

**Expected Result (Instant):**

```
Vendor Dashboard (A):     Customer View B:     Customer View C:     Customer View D:
┌──────────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ #1 Bob    ✨     │     │ It's your    │     │ Position: #1 │     │ Position: #2 │
│ #2 Carol         │     │ turn! 🎊     │     │ Status: NEXT │     │ Status: Wait │
└──────────────────┘     └──────────────┘     │ (orange) ✨  │     │ ✨           │
                                              └──────────────┘     └──────────────┘
```

**Verification:**

- ✅ Alice sees "Your turn!" message
- ✅ Bob becomes #1 with orange highlight
- ✅ Carol becomes #2
- ✅ Vendor sees Bob as #1

---

### Test 2: Customer Leaves Queue

**Setup:**

```
1. Queue has 3 customers:
   - #1 Alice
   - #2 Bob
   - #3 Carol
```

**Expected State:**

```
Vendor Dashboard:          Bob's Phone:         Carol's Phone:
┌──────────────────┐      ┌──────────────┐     ┌──────────────┐
│ #1 Alice (next)  │      │ Position: #2 │     │ Position: #3 │
│ #2 Bob (waiting) │      │ 1 ahead      │     │ 2 ahead      │
│ #3 Carol (wait)  │      └──────────────┘     └──────────────┘
└──────────────────┘
```

**Action:**

- Bob clicks "Leave Queue" button

**Expected Result (Instant):**

```
Vendor Dashboard:          Bob's Phone:         Carol's Phone:
┌──────────────────┐      ┌──────────────┐     ┌──────────────┐
│ #1 Alice (next)  │      │ You've left  │     │ Position: #2 │
│ #2 Carol ✨      │      │ the queue ✅ │     │ 1 ahead ✨   │
└──────────────────┘      └──────────────┘     └──────────────┘
```

**Verification:**

- ✅ Bob sees "You've left the queue"
- ✅ Carol moves from #3 → #2
- ✅ Vendor sees Carol as #2
- ✅ No gaps in position numbers

---

### Test 3: Vendor Removes Customer

**Setup:**

```
Queue: #1 Alice, #2 Bob, #3 Carol, #4 Dave
```

**Action:**

- Vendor clicks "Remove" next to Bob (#2)
- Confirms removal

**Expected Result:**

```
Before:                    After (Instant):
┌──────────────────┐      ┌──────────────────┐
│ #1 Alice (next)  │      │ #1 Alice (next)  │
│ #2 Bob (waiting) │  →   │ #2 Carol ✨      │
│ #3 Carol (wait)  │      │ #3 Dave ✨       │
│ #4 Dave (wait)   │      └──────────────────┘
└──────────────────┘

Bob's Phone:               Carol's Phone:        Dave's Phone:
┌──────────────┐          ┌──────────────┐      ┌──────────────┐
│ You were     │          │ Position: #2 │      │ Position: #3 │
│ removed ❌   │          │ (was #3) ✨  │      │ (was #4) ✨  │
└──────────────┘          └──────────────┘      └──────────────┘
```

**Verification:**

- ✅ Bob sees removal notification
- ✅ Carol updates from #3 → #2
- ✅ Dave updates from #4 → #3
- ✅ Vendor sees continuous numbering (1, 2, 3)

---

### Test 4: Clear Entire Queue

**Setup:**

```
Queue: #1 Alice, #2 Bob, #3 Carol
```

**Action:**

- Vendor clicks "Clear All"
- Confirms action

**Expected Result:**

```
Vendor Dashboard:          All Customer Phones:
┌──────────────────┐      ┌──────────────┐
│ No customers yet │      │ You were     │
│ 🤷               │      │ removed from │
│                  │      │ the queue    │
└──────────────────┘      └──────────────┘
```

**Verification:**

- ✅ All customers see removal notification
- ✅ Vendor sees empty queue
- ✅ No errors in console

---

### Test 5: First Customer Leaves (Next Status Transfer)

**Setup:**

```
Queue: #1 Alice (status: next), #2 Bob (status: waiting)
```

**Action:**

- Alice clicks "Leave Queue"

**Expected Result:**

```
Before:                    After:
Alice's Phone:             Alice's Phone:
┌──────────────┐          ┌──────────────┐
│ Position: #1 │          │ You've left  │
│ You're NEXT! │   →      │ the queue ✅ │
│ (orange)     │          └──────────────┘
└──────────────┘

Bob's Phone:               Bob's Phone:
┌──────────────┐          ┌──────────────┐
│ Position: #2 │          │ Position: #1 │
│ 1 ahead      │   →      │ You're NEXT! │
│              │          │ (orange) ✨  │
└──────────────┘          └──────────────┘
```

**Verification:**

- ✅ Alice successfully leaves
- ✅ Bob becomes #1
- ✅ Bob's status changes to "next" (orange highlight)
- ✅ Bob sees "You're next! Get ready! 🎉" toast

---

### Test 6: Rapid Multiple Actions

**Setup:**

```
Queue: #1 Alice, #2 Bob, #3 Carol, #4 Dave, #5 Eve
```

**Action:**

- Vendor rapidly clicks:
  1. Serve Next (Alice served)
  2. Remove Bob
  3. Serve Next (Carol served)

**Expected Result:**

```
Final Queue:               Dave's Phone:         Eve's Phone:
┌──────────────────┐      ┌──────────────┐     ┌──────────────┐
│ #1 Dave (next)   │      │ Position: #1 │     │ Position: #2 │
│ #2 Eve (waiting) │      │ Status: NEXT │     │ 1 ahead      │
└──────────────────┘      │ (orange)     │     └──────────────┘
                          └──────────────┘
```

**Verification:**

- ✅ Positions remain sequential (1, 2) - no gaps
- ✅ Dave correctly at position #1
- ✅ Eve correctly at position #2
- ✅ No race conditions or errors

---

## Manual Testing Procedure

### Prerequisites

```bash
# Terminal 1: Start dev server
cd tappyline-app
npm run dev
```

### Step-by-Step

**1. Set Up Appwrite** (if not done)

- Create queue and customers collections
- Set permissions to "Any"
- Configure .env.local

**2. Create Test Queue**

```
1. Open http://localhost:3000
2. Create queue: "Test Restaurant"
3. Note the vendor dashboard URL
4. Download/display QR code
```

**3. Open Multiple Customer Windows**

```
Open 3 incognito/private windows:
- Window A: Customer "Alice"
- Window B: Customer "Bob"
- Window C: Customer "Carol"

All join the same queue via QR/link
```

**4. Test Serve Next**

```
Vendor dashboard:
- Click "Serve Next"
- Observe:
  ✓ Alice sees "Your turn!"
  ✓ Bob moves to #1 with orange
  ✓ Carol moves to #2
```

**5. Test Customer Leave**

```
Bob's window:
- Click "Leave Queue"
- Observe:
  ✓ Bob sees "You've left"
  ✓ Carol updates to #2
  ✓ Vendor sees Carol as #2
```

**6. Test Vendor Remove**

```
Vendor dashboard:
- Click "Remove" next to a customer
- Confirm
- Observe:
  ✓ Customer sees removal message
  ✓ Other positions shift up
  ✓ No gaps in numbering
```

**7. Check Console**

```
In browser DevTools (F12):
- Console tab should show:
  ✓ "Realtime update:" messages
  ✓ No error messages
  ✓ Position updates logged
```

---

## Expected Timings

| Action                   | Expected Latency | Acceptable Max |
| ------------------------ | ---------------- | -------------- |
| Serve Next → UI Update   | < 500ms          | < 1s           |
| Customer Leave → Reorder | < 500ms          | < 1s           |
| Remove → Position Shift  | < 500ms          | < 1s           |
| Realtime Sync            | < 1s             | < 2s           |
| 10 Customer Reorder      | < 1s             | < 2s           |

---

## Common Issues & Fixes

### Issue: Positions Not Updating

**Check:**

```bash
1. Browser console for errors
2. Network tab for failed Appwrite requests
3. Appwrite collection permissions
```

**Fix:**

```
- Ensure collections have "Any" role with Read, Create, Update
- Check .env.local has correct IDs
- Restart dev server
```

### Issue: Slow Updates (> 2 seconds)

**Check:**

```
- Number of customers in queue (> 50?)
- Network connection
- Appwrite Cloud status
```

**Fix:**

```
- Acceptable for large queues
- Check internet speed
- Wait for Appwrite operations to complete
```

### Issue: Duplicate Position Numbers

**Check:**

```
- Browser console for race conditions
- Multiple tabs on same customer ID
```

**Fix:**

```
- Clear localStorage
- Rejoin queue
- Refresh all windows
```

---

## Success Criteria

### ✅ All Tests Pass When:

1. **Position Updates**

   - Positions always sequential (1, 2, 3, ...)
   - No gaps after removals
   - #1 always has "next" status (orange)

2. **Real-Time Sync**

   - All devices update within 1 second
   - No manual refresh needed
   - Vendor and customers see same data

3. **Customer Experience**

   - Clear position visibility
   - Correct "next" status
   - Accurate "people ahead" count

4. **Vendor Experience**

   - Instant feedback on actions
   - Accurate customer list
   - No phantom customers

5. **Edge Cases**
   - Last customer served → Empty queue
   - First customer leaves → Second becomes #1
   - All customers removed → Clean slate

---

## Automated Test Ideas (Future)

```typescript
// Example: Test position reordering
test("positions update after serve next", async () => {
  // Create queue with 3 customers
  const queue = await createTestQueue();
  const [alice, bob, carol] = await addCustomers(queue, 3);

  // Serve first customer
  await serveNext(queue.id);

  // Verify positions
  const updated = await getCustomers(queue.id);
  expect(updated[0].position).toBe(1); // Bob
  expect(updated[1].position).toBe(2); // Carol
  expect(updated[0].status).toBe("next");
});
```

---

## Performance Benchmarks

### Target Metrics (10 Customers)

- Serve Next: < 300ms
- Remove Customer: < 300ms
- Reorder Positions: < 200ms
- Total User-Perceived Delay: < 500ms

### Acceptable (50 Customers)

- Serve Next: < 800ms
- Remove Customer: < 800ms
- Reorder Positions: < 500ms
- Total User-Perceived Delay: < 1.5s

---

**Last Updated:** January 2025  
**Status:** ✅ All Tests Passing
