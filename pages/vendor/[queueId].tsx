import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import QRCode from "qrcode";
import {
  queueOperations,
  customerOperations,
  getQueueUrl,
  type Queue,
  type Customer,
} from "../../lib/appwrite";
import toast from "react-hot-toast";

export default function VendorDashboard() {
  const router = useRouter();
  const { queueId } = router.query;

  const [queue, setQueue] = useState<Queue | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [authError, setAuthError] = useState("");
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Check authentication and load queue data
  useEffect(() => {
    if (!queueId || typeof queueId !== "string") return;

    checkAuthAndLoadQueue();
  }, [queueId]);

  const checkAuthAndLoadQueue = async () => {
    if (typeof queueId !== "string") return;

    // First, load queue to check if it has password protection
    try {
      const queueData = await queueOperations.getQueue(queueId);

      if (!queueData) {
        toast.error("Queue not found");
        router.push("/");
        return;
      }

      setQueue(queueData);

      // Check if queue has password protection (email or phone)
      const hasPassword = !!(queueData.contactEmail || queueData.contactPhone);

      if (!hasPassword) {
        // No password protection, allow access
        setIsAuthenticated(true);
        await loadCustomers();
        await generateQRCode(queueId);
        setLoading(false);
        return;
      }

      // Check if already authenticated in this session
      const savedAuth = localStorage.getItem(`vendor_auth_${queueId}`);
      const correctPassword = queueData.contactEmail || queueData.contactPhone;

      if (savedAuth === correctPassword) {
        // Already authenticated
        setIsAuthenticated(true);
        await loadCustomers();
        await generateQRCode(queueId);
        setLoading(false);
      } else {
        // Need to authenticate
        setShowPasswordModal(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading queue:", error);
      toast.error("Failed to load queue data");
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!queue) return;

    const correctPassword = queue.contactEmail || queue.contactPhone;

    if (passwordInput === correctPassword) {
      // Correct password
      localStorage.setItem(`vendor_auth_${queueId}`, passwordInput);
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setAuthError("");
      toast.success("Access granted!");

      // Load data after authentication
      loadCustomers();
      generateQRCode(queueId as string);
    } else {
      // Wrong password
      setAuthError(
        "Incorrect password. Please enter the email or phone number you used when creating this queue."
      );
      toast.error("Incorrect password");
    }
  };

  const handleLogout = () => {
    if (typeof queueId !== "string") return;
    localStorage.removeItem(`vendor_auth_${queueId}`);
    setIsAuthenticated(false);
    setShowPasswordModal(true);
    toast("Logged out successfully");
  };

  // Subscribe to realtime updates
  useEffect(() => {
    if (!queueId || typeof queueId !== "string") return;

    const unsubscribe = customerOperations.subscribeToQueue(
      queueId,
      (payload) => {
        console.log("Realtime update:", payload);
        loadCustomers();
      }
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [queueId]);

  const loadQueueData = async () => {
    if (typeof queueId !== "string") return;

    try {
      const queueData = await queueOperations.getQueue(queueId);

      if (!queueData) {
        toast.error("Queue not found");
        router.push("/");
        return;
      }

      setQueue(queueData);
      await loadCustomers();
      await generateQRCode(queueId);
    } catch (error) {
      console.error("Error loading queue:", error);
      toast.error("Failed to load queue data");
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    if (typeof queueId !== "string") return;

    try {
      const customersData = await customerOperations.getQueueCustomers(queueId);
      setCustomers(customersData);
    } catch (error) {
      console.error("Error loading customers:", error);
    }
  };

  const generateQRCode = async (id: string) => {
    try {
      const url = getQueueUrl(id);
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: "#1a1a1a",
          light: "#ffffff",
        },
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleServeNext = async () => {
    if (!queueId || typeof queueId !== "string") return;

    try {
      const served = await customerOperations.serveNext(queueId);

      if (served) {
        toast.success(`${served.customerName} has been served!`);
        // Don't need to loadCustomers - realtime will update
      } else {
        toast("No customers in queue", { icon: "🤷" });
      }
    } catch (error) {
      console.error("Error serving customer:", error);
      toast.error("Failed to serve customer");
    }
  };

  const handleRemoveCustomer = async (
    customerId: string,
    customerName: string
  ) => {
    if (!confirm(`Remove ${customerName} from the queue?`)) return;
    if (typeof queueId !== "string") return;

    try {
      await customerOperations.removeCustomer(customerId, queueId);
      toast.success(`${customerName} removed`);
      // Don't need to loadCustomers - realtime will update
    } catch (error) {
      console.error("Error removing customer:", error);
      toast.error("Failed to remove customer");
    }
  };

  const handleClearQueue = async () => {
    if (!confirm("Clear all customers from the queue? This cannot be undone."))
      return;
    if (typeof queueId !== "string") return;

    try {
      // Remove one by one to trigger reordering properly
      for (const customer of customers) {
        await customerOperations.removeCustomer(customer.$id!, queueId);
      }
      toast.success("Queue cleared");
      // Don't need to loadCustomers - realtime will update
    } catch (error) {
      console.error("Error clearing queue:", error);
      toast.error("Failed to clear queue");
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${queue?.businessName}-qr-code.png`;
    link.click();
  };

  const handleShareLink = () => {
    if (typeof queueId !== "string") return;

    const url = getQueueUrl(queueId);
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
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

  // Password protection modal
  if (showPasswordModal && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Protected Queue
            </h2>
            <p className="text-gray-600 mb-1">{queue.businessName}</p>
            <p className="text-sm text-gray-500">
              This vendor dashboard is password-protected
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Enter Email or Phone Number
              </label>
              <input
                type="text"
                id="password"
                className="input"
                placeholder="your@email.com or +1234567890"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setAuthError("");
                }}
                required
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Use the email or phone you entered when creating this queue
              </p>
            </div>

            {authError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
                <p className="text-sm text-red-800">{authError}</p>
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              Unlock Dashboard
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-all duration-200"
            >
              ← Back to Home
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <p className="text-xs text-blue-900 text-center">
              <strong>Lost access?</strong> You'll need the exact email or phone
              number you used when creating this queue. There's no password
              reset for security reasons.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {queue.businessName}
                </h1>
                {(queue.contactEmail || queue.contactPhone) && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    🔒 Protected
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">Vendor Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              {(queue.contactEmail || queue.contactPhone) && (
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 hover:bg-red-50 rounded-lg transition-colors"
                >
                  🔓 Logout
                </button>
              )}
              <button
                onClick={() => router.push("/")}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                ← Home
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QR Code Section */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Queue QR Code
              </h2>

              {qrCodeUrl && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                    <img
                      src={qrCodeUrl}
                      alt="Queue QR Code"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleDownloadQR}
                      className="btn-primary w-full"
                    >
                      Download QR Code
                    </button>

                    <button
                      onClick={handleShareLink}
                      className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-all duration-200"
                    >
                      Copy Link
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    <p>Customers scan this QR code to join your queue</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Queue Management */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Current Queue
                  </h2>
                  <p className="text-gray-600">
                    {customers.length}{" "}
                    {customers.length === 1 ? "person" : "people"} waiting
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleServeNext}
                    disabled={customers.length === 0}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Serve Next
                  </button>

                  {customers.length > 0 && (
                    <button
                      onClick={handleClearQueue}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-all duration-200"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Customer List */}
              {customers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-gray-400"
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No customers yet
                  </h3>
                  <p className="text-gray-600">
                    Share your QR code to let customers join
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customers.map((customer, index) => (
                    <div
                      key={customer.$id}
                      className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                        index === 0
                          ? "bg-orange-50 border-orange-300 shadow-md"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`queue-badge ${
                            index === 0 ? "bg-orange-500" : "bg-gray-500"
                          }`}
                        >
                          #{customer.position}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {customer.customerName}
                          </p>
                          {customer.customerPhone && (
                            <p className="text-sm text-gray-600">
                              📞 {customer.customerPhone}
                            </p>
                          )}
                          {customer.customerMessage && (
                            <p className="text-sm text-gray-700 mt-1 bg-blue-50 px-2 py-1 rounded border border-blue-200 inline-block">
                              💬 {customer.customerMessage}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Joined{" "}
                            {new Date(customer.joinedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleRemoveCustomer(
                            customer.$id!,
                            customer.customerName
                          )
                        }
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
