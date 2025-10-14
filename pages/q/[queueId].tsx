import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import {
  queueOperations,
  customerOperations,
  type Queue,
  type Customer,
} from "../../lib/appwrite";
import toast from "react-hot-toast";

export default function CustomerQueue() {
  const router = useRouter();
  const { queueId } = router.query;

  const [queue, setQueue] = useState<Queue | null>(null);
  const [myCustomer, setMyCustomer] = useState<Customer | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");
  const [queueSize, setQueueSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

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

        // Reload my customer data
        if (myCustomer?.$id) {
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
  }, [queueId, myCustomer]);

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

  const checkCustomerStatus = async () => {
    if (!myCustomer?.$id || typeof queueId !== "string") return;

    try {
      const customers = await customerOperations.getQueueCustomers(queueId);
      const found = customers.find((c) => c.$id === myCustomer.$id);

      if (found) {
        setMyCustomer(found);
        localStorage.setItem(`customer_${queueId}`, JSON.stringify(found));

        // Show notification if customer is next
        if (found.status === "next") {
          toast("You're next! Get ready! 🎉", {
            icon: "👋",
            duration: 6000,
          });
        }

        // Show notification if customer was served
        if (found.status === "served") {
          toast.success("It's your turn! Head to the counter! 🎊");
        }
      } else {
        // Customer was removed
        toast.error("You were removed from the queue");
        handleLeaveQueue();
      }
    } catch (error) {
      console.error("Error checking customer status:", error);
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

      await loadQueueSize();
    } catch (error) {
      console.error("Error joining queue:", error);
      toast.error("Failed to join queue. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveQueue = async () => {
    if (!myCustomer?.$id) {
      setMyCustomer(null);
      if (typeof queueId === "string") {
        localStorage.removeItem(`customer_${queueId}`);
      }
      return;
    }

    if (typeof queueId !== "string") return;

    try {
      // Actually remove from queue in database
      await customerOperations.removeCustomer(myCustomer.$id, queueId);

      setMyCustomer(null);
      localStorage.removeItem(`customer_${queueId}`);
      toast.success("You've left the queue");
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

      <main className="container mx-auto px-4 py-8">
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
                    : `${queueSize} ${
                        queueSize === 1 ? "person" : "people"
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
                  <div
                    className={`inline-block w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                      myCustomer.status === "next"
                        ? "bg-orange-100 animate-pulse"
                        : myCustomer.status === "served"
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <span
                      className={`text-4xl font-black ${
                        myCustomer.status === "next"
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
                      <p className="text-gray-600">
                        Please head to the counter now 🎉
                      </p>
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
                        {myCustomer.position === 1
                          ? "You're first!"
                          : `${myCustomer.position - 1} ${
                              myCustomer.position - 1 === 1
                                ? "person"
                                : "people"
                            } ahead of you`}
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

                <button
                  onClick={handleLeaveQueue}
                  className="w-full px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-all duration-200"
                >
                  Leave Queue
                </button>
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
    </div>
  );
}
