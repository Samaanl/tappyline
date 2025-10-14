import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { queueOperations, isAppwriteConfigured } from "../lib/appwrite";
import toast from "react-hot-toast";
import Link from "next/link";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    // Check if Appwrite is configured
    setIsConfigured(isAppwriteConfigured());
  }, []);

  const handleCreateQueue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfigured) {
      toast.error(
        "Appwrite is not configured. Please check your environment variables."
      );
      return;
    }

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
      <Head>
        <title>
          TappyLine - Free Virtual Queue Management System | No App Required
        </title>
        <meta
          name="description"
          content="Create virtual queues instantly with TappyLine. No downloads, no sign-ups, zero friction. Perfect for restaurants, salons, pop-up shops, and events. QR code-based queue management with real-time updates."
        />
        <meta
          name="keywords"
          content="virtual queue, queue management system, no app queue, QR code queue, web-based queue, free queue app, restaurant waitlist, salon queue, pop-up shop queue, event queue management, zero friction, real-time queue updates, contactless queue"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="TappyLine - Free Virtual Queue Management | No App Required"
        />
        <meta
          property="og:description"
          content="The simplest virtual queue system. Create queues in 10 seconds. Customers scan QR code and join. Everyone gets real-time updates. No downloads needed."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="TappyLine - Virtual Queue Management Made Simple"
        />
        <meta
          name="twitter:description"
          content="No apps. No accounts. Just tap and go! Create virtual queues for your business in seconds."
        />
        <link rel="canonical" href="https://tappyline.com" />
      </Head>

      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">T</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">TappyLine</h1>
          </div>

          <button
            onClick={() => {
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-orange-600 hover:text-orange-700 font-medium text-sm md:text-base cursor-pointer"
          >
            How it works
          </button>
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

            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto">
              Create queues instantly. Customers scan and join. Everyone gets
              real-time updates.
            </p>
          </div>

          {/* Configuration Warning Banner */}
          {!isConfigured && (
            <div className="max-w-xl mx-auto mb-8">
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-bold text-red-900 mb-2">
                      🔧 Configuration Required
                    </h4>
                    <p className="text-sm text-red-800 mb-3">
                      Appwrite environment variables are not configured. Please
                      add these variables to your environment:
                    </p>
                    <ul className="text-xs text-red-700 space-y-1 font-mono bg-red-100 p-3 rounded">
                      <li>• NEXT_PUBLIC_APPWRITE_ENDPOINT</li>
                      <li>• NEXT_PUBLIC_APPWRITE_PROJECT_ID</li>
                      <li>• NEXT_PUBLIC_APPWRITE_DATABASE_ID</li>
                      <li>• NEXT_PUBLIC_APPWRITE_QUEUES_COLLECTION_ID</li>
                      <li>• NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID</li>
                      <li>• NEXT_PUBLIC_APP_URL</li>
                    </ul>
                    <p className="text-xs text-red-700 mt-3">
                      See{" "}
                      <code className="bg-red-200 px-1 py-0.5 rounded">
                        APPWRITE_SETUP.md
                      </code>{" "}
                      for setup instructions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

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

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                How TappyLine Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The simplest virtual queue management system. No downloads, no
                sign-ups, no friction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-white text-3xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Create Your Queue
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Enter your business name and optional contact info. Get
                    instant access to your vendor dashboard with a unique QR
                    code.
                  </p>
                  <div className="text-sm text-orange-600 font-semibold">
                    ⏱️ Takes 10 seconds
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-white text-3xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Customers Scan & Join
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Display your QR code. Customers scan it with their phone
                    camera, enter their name, and join your queue instantly.
                  </p>
                  <div className="text-sm text-orange-600 font-semibold">
                    🚀 Zero app downloads
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-white text-3xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Manage & Serve
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Watch customers join in real-time. Click "Serve Next" when
                    ready. Everyone's position updates automatically.
                  </p>
                  <div className="text-sm text-orange-600 font-semibold">
                    ⚡ Live updates for all
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Example */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border-2 border-orange-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Perfect For:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-3xl mb-2">🍕</div>
                  <div className="text-sm font-semibold text-gray-900">
                    Restaurants
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-3xl mb-2">💇</div>
                  <div className="text-sm font-semibold text-gray-900">
                    Salons
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-3xl mb-2">🏪</div>
                  <div className="text-sm font-semibold text-gray-900">
                    Pop-up Shops
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-3xl mb-2">🎪</div>
                  <div className="text-sm font-semibold text-gray-900">
                    Events
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="features"
        className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-20"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Why Choose TappyLine?
              </h2>
              <p className="text-lg text-gray-600">
                The virtual queue system designed for zero friction
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Registration Required
                </h3>
                <p className="text-gray-600">
                  Vendors and customers don't need accounts. Just create a queue
                  and start using it immediately.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  100% Web-Based
                </h3>
                <p className="text-gray-600">
                  Works on any device with a web browser. No app stores, no
                  storage space needed, no updates to install.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-orange-600"
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Secure & Private
                </h3>
                <p className="text-gray-600">
                  Password-protect your vendor dashboard with your email or
                  phone. Only you can manage your queue.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-orange-600"
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Real-Time Synchronization
                </h3>
                <p className="text-gray-600">
                  Everyone sees live updates instantly. Customers know their
                  exact position at all times.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Completely Free
                </h3>
                <p className="text-gray-600">
                  No hidden costs, no premium plans, no payment required. Create
                  unlimited queues for your business.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Simple QR System
                </h3>
                <p className="text-gray-600">
                  Every phone camera can scan QR codes natively. Print it,
                  display it on a screen, or share the link.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Who Uses TappyLine?
              </h2>
              <p className="text-lg text-gray-600">
                Perfect for any business that needs queue management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 border-2 border-orange-200">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🍕</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Restaurants & Cafes
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Manage dine-in waiting lists, takeout orders, and table
                      reservations without the chaos.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✓ Reduce crowding at entrance</li>
                      <li>✓ Customers wait comfortably anywhere</li>
                      <li>✓ No more shouting names</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 border-2 border-orange-200">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">💇</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Salons & Barbershops
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Let customers know exactly when they'll be served. No more
                      awkward waiting room situations.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✓ Customers can run errands while waiting</li>
                      <li>✓ Reduced waiting room congestion</li>
                      <li>✓ Better appointment flow</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 border-2 border-orange-200">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🏪</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Pop-up Shops & Vendors
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Perfect for temporary setups at markets, festivals, and
                      events. Setup in seconds.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✓ No equipment needed</li>
                      <li>✓ Works anywhere with internet</li>
                      <li>✓ Professional impression instantly</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 border-2 border-orange-200">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🎪</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Events & Conferences
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Manage registration desks, food stalls, demo booths, and
                      meet-and-greets efficiently.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✓ Multiple queues for different booths</li>
                      <li>✓ Attendees stay informed</li>
                      <li>✓ Improves event experience</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 border-2 border-orange-200">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🏥</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Clinics & Healthcare
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Manage patient flow in waiting rooms while maintaining
                      social distancing.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✓ Contactless check-in</li>
                      <li>✓ Reduced waiting room capacity</li>
                      <li>✓ Better patient experience</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 border-2 border-orange-200">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🛒</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Retail Stores
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Manage Black Friday rushes, product launches, and peak
                      hours without stress.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✓ Control store capacity</li>
                      <li>✓ Fair first-come, first-served system</li>
                      <li>✓ Happier customers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-20"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to know about TappyLine
              </p>
            </div>

            <div className="space-y-6">
              {/* FAQ 1 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Do customers need to download an app?
                </h3>
                <p className="text-gray-700">
                  No! TappyLine is 100% web-based. Customers simply scan your QR
                  code with their phone's camera, and it opens in their web
                  browser. No app downloads, no app store visits, no storage
                  space needed. It works on any device with a web browser -
                  iPhone, Android, tablets, or computers.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Do I need to create an account or sign up?
                </h3>
                <p className="text-gray-700">
                  Not at all! This is one of TappyLine's biggest advantages.
                  Just enter your business name on the homepage, and you
                  instantly get a queue with a QR code. No email verification,
                  no passwords (unless you want protection), no personal
                  information required. You can start managing customers in
                  literally 10 seconds.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How do I protect my vendor dashboard from unauthorized access?
                </h3>
                <p className="text-gray-700">
                  When creating your queue, simply add your email OR phone
                  number. This becomes your password for the vendor dashboard.
                  Without it, anyone with the link could manage your queue, so
                  we highly recommend adding at least one. You can also logout
                  and log back in anytime using your email/phone.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Is TappyLine really free? Are there any hidden costs?
                </h3>
                <p className="text-gray-700">
                  Yes, it's completely free! No trial periods, no premium plans,
                  no "limited features" for free users. We built TappyLine to
                  make queue management accessible to everyone, from small food
                  trucks to large restaurants. Create unlimited queues, serve
                  unlimited customers, completely free forever.
                </p>
              </div>

              {/* FAQ 5 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How do customers know when it's their turn?
                </h3>
                <p className="text-gray-700">
                  After joining your queue, customers see their position number
                  in real-time on their phone. As you serve each customer and
                  click "Serve Next," everyone's position automatically updates.
                  When they're next in line, they see a prominent "YOU'RE NEXT!"
                  notification. The updates happen instantly thanks to our
                  real-time technology.
                </p>
              </div>

              {/* FAQ 6 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Can I use TappyLine for multiple locations or businesses?
                </h3>
                <p className="text-gray-700">
                  Absolutely! You can create as many queues as you need. Each
                  queue gets its own unique link and QR code. Perfect if you run
                  multiple businesses, have multiple locations, or manage
                  different service counters within the same venue.
                </p>
              </div>

              {/* FAQ 7 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  What happens if a customer leaves without completing service?
                </h3>
                <p className="text-gray-700">
                  Customers can leave the queue anytime by clicking the "Leave
                  Queue" button on their screen. From your vendor dashboard, you
                  can also manually remove any customer by clicking the "Remove"
                  button next to their name. When someone is removed, everyone
                  else's position automatically updates.
                </p>
              </div>

              {/* FAQ 8 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Does TappyLine work offline or need internet?
                </h3>
                <p className="text-gray-700">
                  TappyLine requires an internet connection to work because it
                  uses real-time synchronization to keep everyone updated. Both
                  you (the vendor) and your customers need to be online.
                  However, the data usage is minimal, just small updates
                  whenever someone joins or is served.
                </p>
              </div>

              {/* FAQ 9 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How is TappyLine different from other queue management apps?
                </h3>
                <p className="text-gray-700">
                  Most queue apps require customers to download apps, create
                  accounts, and navigate complicated interfaces. TappyLine
                  removes ALL friction: no downloads, no accounts, no learning
                  curve. Scan → Join → Done. It's designed for speed and
                  simplicity above everything else. If it takes more than 30
                  seconds, we consider it too complicated.
                </p>
              </div>

              {/* FAQ 10 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Can I print my QR code and display it physically?
                </h3>
                <p className="text-gray-700">
                  Yes! On your vendor dashboard, you'll find a "Download QR
                  Code" button. Click it to download a high-quality PNG image of
                  your QR code. Print it on paper, a poster, a table tent,
                  stickers, or even a t-shirt! You can also display it on
                  tablets, TVs, or digital signage.
                </p>
              </div>

              {/* FAQ 11 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  What if I lose my vendor dashboard link?
                </h3>
                <p className="text-gray-700">
                  Save your vendor dashboard link somewhere safe (bookmark it,
                  save in notes, or email it to yourself). Since there's no
                  account system, we can't recover your specific queue if you
                  lose the link. However, you can always create a new queue in
                  seconds if needed.
                </p>
              </div>

              {/* FAQ 12 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Is my customer data secure and private?
                </h3>
                <p className="text-gray-700">
                  We only collect the minimum information needed: customer names
                  and optional phone numbers (if they choose to provide them).
                  We don't track, sell, or share any customer data. Your queue
                  data is stored securely using Appwrite's enterprise-grade
                  infrastructure with encryption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-orange-500 to-amber-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Ready to Simplify Your Queue?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Join hundreds of businesses managing queues the smart way
            </p>
            <a
              href="#create-queue"
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector("form")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Create Your Free Queue Now →
            </a>
            <p className="text-sm mt-4 opacity-75">
              No credit card required • No sign up needed • Start in 10 seconds
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl font-bold">T</span>
                  </div>
                  <h3 className="text-2xl font-bold">TappyLine</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  The simplest virtual queue management web app. No downloads,
                  no sign-ups, no friction. Perfect for restaurants, salons,
                  pop-up shops, events, and any business that needs queue
                  management.
                </p>
                <p className="text-sm text-gray-500">
                  Made with ❤️ to make queues simple again
                </p>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a
                      href="#how-it-works"
                      className="hover:text-white transition-colors"
                    >
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#features"
                      className="hover:text-white transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#use-cases"
                      className="hover:text-white transition-colors"
                    >
                      Use Cases
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      className="hover:text-white transition-colors"
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4">Keywords</h4>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Virtual queue system</p>
                  <p>Web-based queue management</p>
                  <p>No-app queue solution</p>
                  <p>QR code queue system</p>
                  <p>Zero friction queue app</p>
                  <p>Free queue management</p>
                  <p>Real-time queue updates</p>
                  <p>Restaurant waitlist app</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
              <p>
                &copy; 2025 TappyLine. Built for vendors who value simplicity.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
