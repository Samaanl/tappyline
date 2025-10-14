import { Client, Databases, ID, Query } from "appwrite";

// Appwrite client configuration with fallbacks for build time
const client = new Client();

// Only set endpoint and project if environment variables are available
if (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
  client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
}
if (process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
  client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
}

export const databases = new Databases(client);

// Database and Collection IDs with fallbacks
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
export const QUEUES_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_QUEUES_COLLECTION_ID || "";
export const CUSTOMERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID || "";

// Types
export interface Queue {
  $id?: string;
  queueId: string;
  businessName: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
  createdAt: string;
  currentServing?: number;
}

export interface Customer {
  $id?: string;
  queueId: string;
  customerName: string;
  customerPhone?: string;
  customerMessage?: string;
  position: number;
  status: "waiting" | "next" | "served" | "left";
  joinedAt: string;
  notifiedAt?: string;
}

// Queue Operations
export const queueOperations = {
  // Create a new queue
  async createQueue(
    businessName: string,
    contactEmail?: string,
    contactPhone?: string
  ): Promise<Queue> {
    const queueId = generateQueueId(businessName);

    const queue: Omit<Queue, "$id"> = {
      queueId,
      businessName,
      contactEmail,
      contactPhone,
      isActive: true,
      createdAt: new Date().toISOString(),
      currentServing: 0,
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      QUEUES_COLLECTION_ID,
      ID.unique(),
      queue
    );

    return response as unknown as Queue;
  },

  // Get queue by queueId
  async getQueue(queueId: string): Promise<Queue | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        QUEUES_COLLECTION_ID,
        [Query.equal("queueId", queueId), Query.limit(1)]
      );

      return response.documents.length > 0
        ? (response.documents[0] as unknown as Queue)
        : null;
    } catch (error) {
      console.error("Error getting queue:", error);
      return null;
    }
  },

  // Update queue
  async updateQueue(documentId: string, data: Partial<Queue>): Promise<Queue> {
    const response = await databases.updateDocument(
      DATABASE_ID,
      QUEUES_COLLECTION_ID,
      documentId,
      data as any
    );
    return response as unknown as Queue;
  },

  // Delete queue
  async deleteQueue(documentId: string): Promise<void> {
    await databases.deleteDocument(
      DATABASE_ID,
      QUEUES_COLLECTION_ID,
      documentId
    );
  },
};

// Customer Operations
export const customerOperations = {
  // Add customer to queue
  async addCustomer(
    queueId: string,
    customerName: string,
    customerPhone?: string,
    customerMessage?: string
  ): Promise<Customer> {
    // Get current queue size
    const existingCustomers = await this.getQueueCustomers(queueId);
    const position = existingCustomers.length + 1;

    const customer: Omit<Customer, "$id"> = {
      queueId,
      customerName,
      customerPhone,
      customerMessage,
      position,
      status: "waiting",
      joinedAt: new Date().toISOString(),
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      CUSTOMERS_COLLECTION_ID,
      ID.unique(),
      customer
    );

    return response as unknown as Customer;
  },

  // Get all customers in a queue
  async getQueueCustomers(queueId: string): Promise<Customer[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CUSTOMERS_COLLECTION_ID,
        [
          Query.equal("queueId", queueId),
          Query.notEqual("status", "served"),
          Query.notEqual("status", "left"),
          Query.orderAsc("position"),
        ]
      );

      return response.documents as unknown as Customer[];
    } catch (error) {
      console.error("Error getting queue customers:", error);
      return [];
    }
  },

  // Update customer status
  async updateCustomer(
    documentId: string,
    data: Partial<Customer>
  ): Promise<Customer> {
    const response = await databases.updateDocument(
      DATABASE_ID,
      CUSTOMERS_COLLECTION_ID,
      documentId,
      data as any
    );
    return response as unknown as Customer;
  },

  // Reorder positions after a customer is removed or served
  async reorderPositions(queueId: string): Promise<void> {
    const customers = await this.getQueueCustomers(queueId);

    // Update positions to be sequential (1, 2, 3, ...)
    const updates = customers.map((customer, index) =>
      this.updateCustomer(customer.$id!, {
        position: index + 1,
        status: index === 0 ? "next" : "waiting",
      })
    );

    await Promise.all(updates);
  },

  // Remove customer from queue
  async removeCustomer(documentId: string, queueId: string): Promise<void> {
    // Mark as left
    await databases.updateDocument(
      DATABASE_ID,
      CUSTOMERS_COLLECTION_ID,
      documentId,
      { status: "left" } as any
    );

    // Reorder remaining customers
    await this.reorderPositions(queueId);
  },

  // Serve next customer
  async serveNext(queueId: string): Promise<Customer | null> {
    const customers = await this.getQueueCustomers(queueId);
    if (customers.length === 0) return null;

    const nextCustomer = customers[0];

    // Mark as served
    await this.updateCustomer(nextCustomer.$id!, {
      status: "served",
      notifiedAt: new Date().toISOString(),
    });

    // Reorder remaining customers and mark first as "next"
    await this.reorderPositions(queueId);

    return nextCustomer;
  },

  // Subscribe to queue updates (realtime)
  subscribeToQueue(queueId: string, callback: (payload: any) => void) {
    return client.subscribe(
      `databases.${DATABASE_ID}.collections.${CUSTOMERS_COLLECTION_ID}.documents`,
      (response) => {
        const customer = response.payload as Customer;
        if (customer.queueId === queueId) {
          callback(response);
        }
      }
    );
  },
};

// Helper Functions
export function isAppwriteConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT &&
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID &&
    process.env.NEXT_PUBLIC_APPWRITE_QUEUES_COLLECTION_ID &&
    process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID
  );
}

function generateQueueId(businessName: string): string {
  const cleaned = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 30);

  const random = Math.random().toString(36).substring(2, 6);
  return `${cleaned}-${random}`;
}

export function getQueueUrl(queueId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/q/${queueId}`;
}

export { client, ID, Query };
