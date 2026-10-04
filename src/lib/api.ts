import {
  User,
  ServiceItem,
  Product,
  QuotationRequest,
  Quotation,
  ServiceRequest,
  Invoice,
  WarrantyRecord,
  CCTVDevice,
  NotificationItem,
  AuditLogItem,
  AppSettings,
} from '../types';
import { mockFetch, isMockMode } from './mockApi';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('digihub_auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('digihub_auth_token', token);
    } else {
      localStorage.removeItem('digihub_auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const fullEndpoint = `/api${endpoint}`;

    // If running in client mode (GitHub Pages or standalone static)
    if (isMockMode()) {
      const mockRes = await mockFetch(fullEndpoint, {
        ...options,
        headers,
      });
      const data = await mockRes.json().catch(() => ({}));
      if (!mockRes.ok) {
        throw new Error(data.error || `Error! status: ${mockRes.status}`);
      }
      return data as T;
    }

    try {
      const response = await fetch(fullEndpoint, {
        ...options,
        headers,
      });

      if (!response.ok) {
        // Fallback to mock API if backend returns 404 or fails
        const mockRes = await mockFetch(fullEndpoint, {
          ...options,
          headers,
        });
        const data = await mockRes.json().catch(() => ({}));
        if (!mockRes.ok) {
          throw new Error(data.error || `HTTP error! status: ${mockRes.status}`);
        }
        return data as T;
      }

      const data = await response.json().catch(() => ({}));
      return data as T;
    } catch {
      // Fallback on network failure
      const mockRes = await mockFetch(fullEndpoint, {
        ...options,
        headers,
      });
      const data = await mockRes.json().catch(() => ({}));
      if (!mockRes.ok) {
        throw new Error(data.error || `HTTP error! status: ${mockRes.status}`);
      }
      return data as T;
    }
  }

  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    return res;
  }

  async register(data: { fullName: string; email: string; phone: string; password: string; address: string }): Promise<{ user: User; token: string }> {
    const res = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.token);
    return res;
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/me');
  }

  async updateProfile(data: Partial<User>): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async switchRole(role?: string, email?: string): Promise<{ user: User; token: string }> {
    const res = await this.request<{ user: User; token: string }>('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role, email }),
    });
    this.setToken(res.token);
    return res;
  }

  // Services
  async getServices(params?: { category?: string; search?: string }): Promise<{ services: ServiceItem[] }> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<{ services: ServiceItem[] }>(`/services${query ? `?${query}` : ''}`);
  }

  async createService(data: Partial<ServiceItem>): Promise<{ service: ServiceItem }> {
    return this.request<{ service: ServiceItem }>('/admin/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: Partial<ServiceItem>): Promise<{ service: ServiceItem }> {
    return this.request<{ service: ServiceItem }>(`/admin/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Products
  async getProducts(params?: { category?: string; brand?: string; search?: string; inStockOnly?: boolean }): Promise<{ products: Product[]; total: number }> {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ products: Product[]; total: number }>(`/products${query ? `?${query}` : ''}`);
  }

  async createProduct(data: Partial<Product>): Promise<{ product: Product }> {
    return this.request<{ product: Product }>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<{ product: Product }> {
    return this.request<{ product: Product }>(`/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Quotations
  async requestQuotation(data: any): Promise<{ quotationRequest: QuotationRequest }> {
    return this.request<{ quotationRequest: QuotationRequest }>('/quotations/request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getQuotationRequests(): Promise<{ quotationRequests: QuotationRequest[] }> {
    return this.request<{ quotationRequests: QuotationRequest[] }>('/quotations/requests');
  }

  async getQuotations(): Promise<{ quotations: Quotation[] }> {
    return this.request<{ quotations: Quotation[] }>('/quotations');
  }

  async createQuotation(data: any): Promise<{ quotation: Quotation }> {
    return this.request<{ quotation: Quotation }>('/admin/quotations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateQuotationStatus(id: string, status: string): Promise<{ quotation: Quotation }> {
    return this.request<{ quotation: Quotation }>(`/quotations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Service Requests
  async createServiceRequest(data: any): Promise<{ serviceRequest: ServiceRequest }> {
    return this.request<{ serviceRequest: ServiceRequest }>('/service-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getServiceRequests(): Promise<{ serviceRequests: ServiceRequest[] }> {
    return this.request<{ serviceRequests: ServiceRequest[] }>('/service-requests');
  }

  async assignTechnician(id: string, data: { technicianId: string; scheduledDate?: string; scheduledTime?: string }): Promise<{ serviceRequest: ServiceRequest }> {
    return this.request<{ serviceRequest: ServiceRequest }>(`/admin/service-requests/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateServiceTicketStatus(id: string, data: any): Promise<{ serviceRequest: ServiceRequest }> {
    return this.request<{ serviceRequest: ServiceRequest }>(`/service-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Technicians
  async getTechnicians(): Promise<{ technicians: any[] }> {
    return this.request<{ technicians: any[] }>('/technicians');
  }

  async getTechnicianJobs(): Promise<{ allJobs: ServiceRequest[]; todayJobs: ServiceRequest[]; upcomingJobs: ServiceRequest[]; completedJobs: ServiceRequest[]; pendingJobs: ServiceRequest[] }> {
    return this.request<any>('/technicians/jobs');
  }

  // Invoices
  async getInvoices(): Promise<{ invoices: Invoice[] }> {
    return this.request<{ invoices: Invoice[] }>('/invoices');
  }

  async createInvoice(data: any): Promise<{ invoice: Invoice }> {
    return this.request<{ invoice: Invoice }>('/admin/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInvoiceStatus(id: string, paymentStatus: string): Promise<{ invoice: Invoice }> {
    return this.request<{ invoice: Invoice }>(`/admin/invoices/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus }),
    });
  }

  // Warranties
  async getWarranties(): Promise<{ warranties: WarrantyRecord[] }> {
    return this.request<{ warranties: WarrantyRecord[] }>('/warranties');
  }

  async createWarranty(data: any): Promise<{ warranty: WarrantyRecord }> {
    return this.request<{ warranty: WarrantyRecord }>('/admin/warranties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // CCTV Devices
  async getCctvDevices(): Promise<{ devices: CCTVDevice[] }> {
    return this.request<{ devices: CCTVDevice[] }>('/cctv-devices');
  }

  async addCctvDevice(data: any): Promise<{ device: CCTVDevice }> {
    return this.request<{ device: CCTVDevice }>('/cctv-devices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async pingCctvDevice(id: string): Promise<{ device: CCTVDevice; ping: { success: boolean; latencyMs: number; protocol: string; port: number; timestamp: string } }> {
    return this.request<any>(`/cctv-devices/${id}/ping`, {
      method: 'POST',
    });
  }

  // Notifications
  async getNotifications(): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
    return this.request<{ notifications: NotificationItem[]; unreadCount: number }>('/notifications');
  }

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async broadcastNotification(data: { title: string; message: string; type?: string }): Promise<any> {
    return this.request<any>('/admin/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin Customer List & Toggle
  async getAdminCustomers(): Promise<{ customers: User[] }> {
    return this.request<{ customers: User[] }>('/admin/customers');
  }

  async toggleCustomerActive(id: string): Promise<{ customer: User }> {
    return this.request<{ customer: User }>(`/admin/customers/${id}/toggle-active`, {
      method: 'PATCH',
    });
  }

  // Audit Logs & Stats
  async getAuditLogs(): Promise<{ logs: AuditLogItem[] }> {
    return this.request<{ logs: AuditLogItem[] }>('/audit-logs');
  }

  async getDashboardStats(): Promise<any> {
    return this.request<any>('/stats/dashboard');
  }

  // Settings
  async getSettings(): Promise<{ settings: AppSettings }> {
    return this.request<{ settings: AppSettings }>('/settings');
  }

  async updateSettings(data: Partial<AppSettings>): Promise<{ settings: AppSettings }> {
    return this.request<{ settings: AppSettings }>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // File Upload
  async uploadFile(base64Data: string, filename: string): Promise<{ url: string; filename: string; size: number }> {
    return this.request<{ url: string; filename: string; size: number }>('/upload', {
      method: 'POST',
      body: JSON.stringify({ fileData: base64Data, filename }),
    });
  }
}

export const api = new ApiClient();
