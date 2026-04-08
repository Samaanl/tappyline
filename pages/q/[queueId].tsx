import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import {
  queueOperations,
  customerOperations,
  type Queue,
  type Customer,
} from "../../lib/appwrite";
import toast from "react-hot-toast";

// ── Gumroad Ad Configuration ──
const GUMROAD_URL = "https://nasifasayed.gumroad.com/l/ccpjs";
const AD_DISMISS_KEY = "ebook_ad_dismissed";

export default function CustomerQueue() {
  const router = useRouter();
  const { queueId } = router.query;

  const [queue, setQueue] = useState<Queue | null>(null);
  const [myCustomer, setMyCustomer] = useState<Customer | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");
  const [queueSize, setQueueSize] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [peopleAhead, setPeopleAhead] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [adDismissed, setAdDismissed] = useState(true); // start hidden, reveal after mount
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const myCustomerRef = useRef<Customer | null>(null);

  useEffect(() => {
    myCustomerRef.current = myCustomer;
  }, [myCustomer]);

  // Determine if customer is actively in queue (waiting or next)
  const isInQueue = myCustomer && ["waiting", "next"].includes(myCustomer.status);

  // Show ad after mount (check localStorage) — but always show when in queue
  useEffect(() => {
    if (isInQueue) {
      // Always show ad while waiting — non-dismissable
      setAdDismissed(false);
      return;
    }
    const dismissed = localStorage.getItem(AD_DISMISS_KEY);
    if (!dismissed) {
      // small delay so it slides up nicely
      const timer = setTimeout(() => setAdDismissed(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isInQueue]);

  const handleDismissAd = () => {
    if (isInQueue) return; // can't dismiss while waiting
    setAdDismissed(true);
    localStorage.setItem(AD_DISMISS_KEY, "1");
  };

  // ... existing useEffects ...

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (myCustomer?.status === "served") {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            exitQueueState();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [myCustomer?.status]);

  // ... existing code ...



  useEffect(() => {
    if (!queueId || typeof queueId !== "string") return;

    loadQueueData();

    // Check if user already joined
    const savedCustomer = localStorage.getItem(`customer_${queueId}`);
    if (savedCustomer) {
      const parsed = JSON.parse(savedCustomer);
      setMyCustomer(parsed);
    }
  }, [queueId]);

  useEffect(() => {
    if (!queueId || typeof queueId !== "string") return;

    const unsubscribe = customerOperations.subscribeToQueue(
      queueId,
      (payload) => {
        console.log("Realtime update:", payload);
        loadQueueSize();

        // Reload my customer data using ref
        if (myCustomerRef.current?.$id) {
          checkCustomerStatus();
        }
      }
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [queueId]);

  useEffect(() => {
    if (myCustomer?.$id) {
      checkCustomerStatus();
    }
  }, [myCustomer?.$id]);

  const loadQueueData = async () => {
    if (typeof queueId !== "string") return;

    try {
      const queueData = await queueOperations.getQueue(queueId);

      if (!queueData) {
        toast.error("Queue not found");
        router.push("/");
        return;
      }

      if (!queueData.isActive) {
        toast.error("This queue is no longer active");
        return;
      }

      setQueue(queueData);
      await loadQueueSize();
    } catch (error) {
      console.error("Error loading queue:", error);
      toast.error("Failed to load queue");
    } finally {
      setLoading(false);
    }
  };

  const loadQueueSize = async () => {
    if (typeof queueId !== "string") return;

    try {
      const customers = await customerOperations.getQueueCustomers(queueId);
      setQueueSize(customers.length);
    } catch (error) {
      console.error("Error loading queue size:", error);
    }
  };

  const exitQueueState = () => {
    setMyCustomer(null);
    setPeopleAhead(null);
    if (typeof queueId === "string") {
      localStorage.removeItem(`customer_${queueId}`);
    }
  };

  const checkCustomerStatus = async () => {
    const currentCustomer = myCustomerRef.current;
    if (!currentCustomer?.$id || typeof queueId !== "string") return;

    try {
      // 1. Fetch my specific document to check true status
      const me = await customerOperations.getCustomer(currentCustomer.$id);

      if (!me) {
        toast.error("You were removed from the queue");
        exitQueueState();
        return;
      }

      setMyCustomer(me);
      localStorage.setItem(`customer_${queueId}`, JSON.stringify(me));

      if (me.status === "left") {
        toast.error("You were removed from the queue");
        exitQueueState();
        return;
      }

      if (me.status === "served") {
        if (currentCustomer.status !== "served") {
          toast.success("It's your turn! Please proceed! 🎊");
        }
        return;
      }

      if (me.status === "next") {
        if (currentCustomer.status !== "next") {
          toast("You're next! Get ready! 🎉", {
            icon: "👋",
            duration: 6000,
          });
        }
      }

      // 2. Calculate people ahead
      // robust calculation: count how many waiting customers have a smaller position number
      const customers = await customerOperations.getQueueCustomers(queueId);

      // Filter out myself just in case, and count those with smaller position
      const aheadCount = customers.filter(c =>
        c.$id !== me.$id && c.position < me.position
      ).length;

      setPeopleAhead(aheadCount);

    } catch (error) {
      console.error("Error checking customer status:", error);
      if ((error as any).code === 404) {
        toast.error("You were removed from the queue");
        exitQueueState();
      }
    }
  };

  const handleJoinQueue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (typeof queueId !== "string") return;

    setJoining(true);

    try {
      const customer = await customerOperations.addCustomer(
        queueId,
        customerName,
        customerPhone || undefined,
        customerMessage || undefined
      );

      setMyCustomer(customer);
      localStorage.setItem(`customer_${queueId}`, JSON.stringify(customer));
      toast.success("You've joined the queue!");

      // Calculate initial people ahead
      // Since we just joined, we are at the end.
      // But let's fetch to be sure and get the count.
      await checkCustomerStatus();
      await loadQueueSize();
    } catch (error) {
      console.error("Error joining queue:", error);
      toast.error("Failed to join queue. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveQueue = async () => {
    if (!confirm("Are you sure you want to leave the queue? You will lose your spot.")) {
      return;
    }

    if (!myCustomer?.$id || typeof queueId !== "string") {
      exitQueueState();
      return;
    }

    try {
      await customerOperations.removeCustomer(myCustomer.$id, queueId);
      toast.success("You've left the queue");
      exitQueueState();
    } catch (error) {
      console.error("Error leaving queue:", error);
      toast.error("Failed to leave queue");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading queue...</p>
        </div>
      </div>
    );
  }

  if (!queue) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {queue.businessName}
            </h1>
            <p className="text-sm text-gray-600">Queue Management</p>
          </div>
        </div>
      </header>

      <main className={`container mx-auto px-4 py-8 ${!adDismissed ? 'pb-36 sm:pb-28' : ''}`}>
        <div className="max-w-2xl mx-auto">
          {!myCustomer ? (
            /* Join Queue Form */
            <div className="card">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Join the Queue
                </h2>
                <p className="text-gray-600">
                  {queueSize === 0
                    ? "Be the first in line!"
                    : `${queueSize} ${queueSize === 1 ? "person" : "people"
                    } currently waiting`}
                </p>
              </div>

              <form onSubmit={handleJoinQueue} className="space-y-4">
                <div>
                  <label
                    htmlFor="customerName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Your Name <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    className="input"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    maxLength={50}
                    disabled={joining}
                  />
                </div>

                <div>
                  <label
                    htmlFor="customerPhone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Phone Number (optional)
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    className="input"
                    placeholder="+1234567890"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    disabled={joining}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Get SMS updates when it's your turn
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="customerMessage"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Message to Vendor (optional)
                  </label>
                  <textarea
                    id="customerMessage"
                    className="input resize-none"
                    placeholder="E.g., 'I want to order 2 pizzas' or 'Looking for a haircut'"
                    value={customerMessage}
                    onChange={(e) => setCustomerMessage(e.target.value)}
                    disabled={joining}
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tell the vendor what you need (max 200 characters)
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={joining}
                >
                  {joining ? "Joining..." : "Join Queue"}
                </button>
              </form>
            </div>
          ) : (
            /* Queue Status */
            <div className="space-y-6">
              <div className="card text-center">
                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                    Ticket Number
                  </div>
                  <div
                    className={`inline-block w-24 h-24 rounded-full flex items-center justify-center mb-4 ${myCustomer.status === "next"
                      ? "bg-orange-100 animate-pulse"
                      : myCustomer.status === "served"
                        ? "bg-green-100"
                        : "bg-gray-100"
                      }`}
                  >
                    <span
                      className={`text-4xl font-black ${myCustomer.status === "next"
                        ? "text-orange-600"
                        : myCustomer.status === "served"
                          ? "text-green-600"
                          : "text-gray-700"
                        }`}
                    >
                      #{myCustomer.position}
                    </span>
                  </div>

                  {myCustomer.status === "served" ? (
                    <>
                      <h2 className="text-3xl font-bold text-green-600 mb-2">
                        It's Your Turn!
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Please proceed! 🎉
                      </p>
                      <div className="text-sm font-medium text-orange-600 bg-orange-50 py-2 px-4 rounded-full inline-block">
                        Leaving queue in {timeLeft}s
                      </div>
                    </>
                  ) : myCustomer.status === "next" ? (
                    <>
                      <h2 className="text-3xl font-bold text-orange-600 mb-2">
                        You're Next!
                      </h2>
                      <p className="text-gray-600">
                        Get ready! You'll be called soon 👋
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        You're in Line
                      </h2>
                      <p className="text-gray-600">
                        {peopleAhead === null ? (
                          <span className="animate-pulse">Calculating position...</span>
                        ) : peopleAhead === 0 ? (
                          "You're next in line!"
                        ) : (
                          `${peopleAhead} ${peopleAhead === 1 ? "person" : "people"
                          } ahead of you`
                        )}
                      </p>
                    </>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold text-gray-900">
                      {myCustomer.customerName}
                    </span>
                  </div>
                  {myCustomer.customerPhone && (
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-semibold text-gray-900">
                        {myCustomer.customerPhone}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Joined:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(myCustomer.joinedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {["waiting", "next"].includes(myCustomer.status) && (
                  <button
                    onClick={handleLeaveQueue}
                    className="w-full px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-all duration-200"
                  >
                    Leave Queue
                  </button>
                )}
              </div>

              <div className="card bg-blue-50 border-2 border-blue-200">
                <p className="text-sm text-blue-900 text-center">
                  💡 <strong>Tip:</strong> Keep this page open to see real-time
                  updates on your position
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* ── Floating Bottom Ad Banner ── */}
      {!adDismissed && (
        <div
          id="ebook-ad-banner"
          className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
          style={{
            background: 'linear-gradient(135deg, #6B21A8 0%, #9333EA 30%, #F97316 100%)',
            boxShadow: '0 -4px 30px rgba(107, 33, 168, 0.4)',
          }}
        >
          {/* Dismiss button — hidden while waiting in queue */}
          {!isInQueue && (
            <button
              onClick={handleDismissAd}
              aria-label="Dismiss ad"
              className="absolute -top-3 right-3 w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-800 hover:scale-110 transition-all duration-200 border border-gray-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Ad Content */}
          <a
            href={GUMROAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 sm:py-4"
          >
            <div className="max-w-lg mx-auto flex items-center gap-3 sm:gap-4">
              {/* Book emoji icon */}
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">📚</span>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm sm:text-base leading-tight">
                  750+ Self-Improvement eBooks
                </p>
                <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                  Mindset · Confidence · Productivity · Goals
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-extrabold text-xs sm:text-sm rounded-full shadow-lg transition-all duration-200 whitespace-nowrap">
                  $1.99
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        </div>
      )}
    </div>
  );
}
