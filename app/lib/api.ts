// banksecure-frontend/app/lib/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("banksecure_token");
}

function headers(auth = false): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) h["Authorization"] = `Bearer ${token}`;
  }
  return h;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  auth = false
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: headers(auth),
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data as T;
}

// ── AUTH ──
export const authAPI = {
  register: (fullName: string, email: string, password: string, phone: string) =>
    request<{ message: string; userId: string }>("POST", "/auth/register", {
      fullName, email, password, phone,
    }),

  login: (email: string, password: string) =>
    request<{ message: string; userId?: string; requiresOTP?: boolean; requiresVerification?: boolean }>(
      "POST", "/auth/login", { email, password }
    ),

  verifyOTP: (userId: string, otp: string) =>
    request<{ token: string; user: User; message: string }>("POST", "/auth/verify-otp", {
      userId, otp,
    }),

  resendOTP: (userId: string) =>
    request<{ message: string }>("POST", "/auth/resend-otp", { userId }),

  getMe: () => request<{ user: User }>("GET", "/auth/me", undefined, true),

  logout: () => request<{ message: string }>("POST", "/auth/logout", undefined, true),
};

// ── ACCOUNT ──
export const accountAPI = {
  getAccount: () => request<{ user: User }>("GET", "/account", undefined, true),

  updateProfile: (data: { fullName?: string; phone?: string; profilePicture?: string }) =>
    request<{ message: string; user: User }>("PUT", "/account/profile", data, true),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ message: string }>("PUT", "/account/change-password", {
      currentPassword, newPassword,
    }, true),
    uploadProfilePicture: async (file: File) => {
    const token = getToken();
    const formData = new FormData();
    formData.append("profilePicture", file);
    const res = await fetch(`${BASE_URL}/account/profile-picture`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData, // ✅ no Content-Type header — browser sets multipart boundary automatically
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
    return data as { message: string; profilePicture: string };
  },
};

// ── TRANSACTIONS ──
export const transactionAPI = {
  transfer: (toAccountNumber: string, amount: number, description?: string) =>
    request<{ message: string; transaction: Transaction; newBalance: number }>(
      "POST", "/transactions/transfer", { toAccountNumber, amount, description }, true
    ),

  getMyTransactions: () =>
    request<{ transactions: Transaction[] }>("GET", "/transactions/my", undefined, true),
};

// ── ADMIN ──
export const adminAPI = {
  getAllUsers: () => request<{ users: User[] }>("GET", "/admin/users", undefined, true),

  lockUser: (id: string) =>
    request<{ message: string; user: User }>("PUT", `/admin/users/${id}/lock`, undefined, true),

  unlockUser: (id: string) =>
    request<{ message: string; user: User }>("PUT", `/admin/users/${id}/unlock`, undefined, true),

  getAllTransactions: () =>
    request<{ transactions: Transaction[] }>("GET", "/admin/transactions", undefined, true),

  getActivityLogs: () =>
    request<{ logs: ActivityLog[] }>("GET", "/admin/logs", undefined, true),
};

// ── TYPES ──
export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "customer" | "admin" | "manager";
  accountNumber: string;
  balance: number;
  phone?: string;
  profilePicture?: string;
  isVerified?: boolean;
  isLocked?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface Transaction {
  _id: string;
  sender: { _id: string; fullName: string; accountNumber: string };
  receiver: { _id: string; fullName: string; accountNumber: string };
  amount: number;
  type: string;
  status: string;
  description: string;
  reference: string;
  createdAt: string;
}

export interface ActivityLog {
  _id: string;
  user: { fullName: string; email: string };
  action: string;
  status: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}