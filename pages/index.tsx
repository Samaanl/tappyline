import { useState } from "react";
import { useRouter } from "next/router";
import { queueOperations } from "../lib/appwrite";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateQueue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (businessName.trim().length < 2) {
      toast.error("Please enter a business name");
      return;
    }

    setLoading(true);

    try {
      const queue = await queueOperations.createQueue(
        businessName,
        contactEmail || undefined,
        contactPhone || undefined
      );

      // Store password in localStorage for vendor access
      if (contactEmail || contactPhone) {
        const password = contactEmail || contactPhone;
        localStorage.setItem(`vendor_auth_${queue.queueId}`, password);
      }

      toast.success("Queue created! Redirecting...");

      // Navigate to vendor dashboard
      setTimeout(() => {
        router.push(`/vendor/${queue.queueId}`);
      }, 1000);
    } catch (error) {
      console.error("Error creating queue:", error);
      toast.error("Failed to create queue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">T</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">TappyLine</h1>
          </div>

          <Link
            href="/how-it-works"
            className="text-orange-600 hover:text-orange-700 font-medium text-sm md:text-base"
          >
            How it works
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
              No apps. No accounts. Just tap and go! 🚀
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Queue Management
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
                Made Simple
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto">
              If it takes more than 30 seconds, it's too complicated.
            </p>

            <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">
              Create queues instantly. Customers scan and join. Everyone gets
              real-time updates.
            </p>
          </div>

          {/* Create Queue Form */}
          <div className="card max-w-xl mx-auto">
            <form onSubmit={handleCreateQueue} className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Create Your Queue
                </h3>
                <p className="text-gray-600 text-sm">
                  Get started in seconds. No signup required.
                </p>
              </div>

              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Business Name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  id="businessName"
                  className="input"
                  placeholder="e.g., Mario's Pizza"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  maxLength={50}
                  disabled={loading}
                />
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
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
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      🔒 Security Protection
                    </p>
                    <p className="text-xs text-blue-800">
                      Add your email OR phone to password-protect your vendor
                      dashboard. This prevents unauthorized access to your queue
                      management.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email{" "}
                    <span className="text-blue-600">(security password)</span>
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    className="input"
                    placeholder="your@email.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used as password to protect your dashboard
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="contactPhone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Phone{" "}
                    <span className="text-blue-600">(security password)</span>
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    className="input"
                    placeholder="+1234567890"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used as password to protect your dashboard
                  </p>
                </div>
              </div>

              {!contactEmail && !contactPhone && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-800 text-center">
                    ⚠️ <strong>Warning:</strong> Without email or phone, anyone
                    with your queue link can manage it. Add at least one for
                    security!
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Queue Now →"
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By creating a queue, you'll get a unique QR code that customers
                can scan to join
              </p>
            </form>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">30 Second Setup</h3>
              <p className="text-sm text-gray-600">
                Create queue, get QR code, start managing. That's it.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">No App Needed</h3>
              <p className="text-sm text-gray-600">
                Works in any web browser. Customers scan and go.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                Real-Time Updates
              </h3>
              <p className="text-sm text-gray-600">
                Everyone sees their position update instantly.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 text-sm">
        <p>Made with ❤️ to make queues simple again</p>
      </footer>
    </div>
  );
}
