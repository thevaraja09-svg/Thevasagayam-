export type UserRole = 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone: string;
  address: string;
  avatarUrl?: string;
  avatar?: string;
  isActive: boolean;
  passwordHash?: string;
  createdAt: string;
}

export interface CustomerProfile extends User {
  companyName?: string;
  notes?: string;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  employeeCode: string;
  specialization: string;
  vehicleNumber: string;
  isAvailable: boolean;
  activeJobsCount: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  features: string[];
  startingPrice?: number;
  category: 'CCTV' | 'Networking' | 'Access Control' | 'Security';
  isActive: boolean;
}

export type ProductCategory =
  | 'CCTV Cameras'
  | 'DVR'
  | 'NVR'
  | 'Network Switches'
  | 'Routers'
  | 'Wi-Fi'
  | 'Cables'
  | 'Hard Drives'
  | 'Access Control'
  | 'Video Doorbells'
  | 'Intercoms'
  | 'Accessories';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  brand: string;
  description: string;
  specifications: Record<string, string>;
  price: number;
  discount?: number;
  discountPrice?: number;
  stockQuantity: number;
  images: string[];
  warranty: string;
  warrantyMonths?: number;
  isActive: boolean;
}

export type QuotationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Site Visit Required'
  | 'Quotation Prepared'
  | 'Customer Accepted'
  | 'Customer Declined'
  | 'Expired';

export interface QuotationRequest {
  id: string;
  requestNumber: string; // e.g. DH-Q-000001
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  location: string;
  serviceRequired: string;
  numberOfCameras?: number;
  propertyType: 'Residential / Villa' | 'Apartment' | 'Commercial Office' | 'Retail Shop' | 'Warehouse / Factory' | 'Educational Institution';
  preferredDate: string;
  preferredTime: string;
  additionalRequirements: string;
  photos: string[];
  videoUrl?: string;
  status: QuotationStatus;
  createdAt: string;
  quoteId?: string; // linked formal quotation if prepared
}

export interface QuotationLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  quotationRequestId?: string;
  requestId?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: QuotationLineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  validityDate: string;
  termsAndConditions: string;
  notes: string;
  status: 'Draft' | 'Sent' | 'Customer Accepted' | 'Customer Declined' | 'Expired' | 'Accepted' | 'Declined';
  createdAt: string;
}

export type ServiceRequestStatus =
  | 'Submitted'
  | 'Assigned'
  | 'Scheduled'
  | 'Technician On The Way'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export interface ServiceRequest {
  id: string;
  requestNumber: string; // e.g. DH-SR-000001
  customerId: string;
  customerName: string;
  phone: string;
  customerPhone?: string;
  location: string;
  serviceType: string;
  problemDescription: string;
  preferredDate: string;
  preferredTime: string;
  photos: string[];
  additionalNotes?: string;
  status: ServiceRequestStatus;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  technicianNotes?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  partsUsed?: string[];
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt: string;
  updatedAt: string;
}

export type InvoicePaymentStatus =
  | 'Pending'
  | 'Partially Paid'
  | 'Paid'
  | 'Overdue'
  | 'Cancelled';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. DH-INV-00102
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: InvoicePaymentStatus;
  dueDate: string;
  notes: string;
  createdAt: string;
}

export interface WarrantyRecord {
  id: string;
  customerId: string;
  customerName: string;
  productName: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyStart: string;
  warrantyEnd: string;
  warrantyTerms: string;
  terms?: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

export type CCTVStatus = 'Online' | 'Offline' | 'Connecting' | 'Unavailable';

export interface CCTVDevice {
  id: string;
  customerId: string;
  deviceName: string;
  name?: string;
  channelName?: string;
  location: string;
  deviceType: 'Dome Camera' | 'Bullet Camera' | 'PTZ Camera' | 'NVR 16-Channel' | 'DVR 8-Channel' | 'Video Doorbell' | 'Turret Camera';
  manufacturer: 'Hikvision' | 'Dahua' | 'Uniview' | 'TP-Link VIGI' | 'Axis' | 'CP PLUS';
  model: string;
  serialNumber: string;
  ipAddress: string;
  rtspPort: number;
  port?: number;
  rtspUrl?: string;
  channel: number;
  resolution: string;
  firmwareVersion?: string;
  status: CCTVStatus;
  lastPing: string;
  isEncrypted: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'quote' | 'service' | 'invoice' | 'warranty' | 'system' | 'SUCCESS' | 'ALERT' | 'INFO';
  read: boolean;
  createdAt: string;
  linkId?: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  targetEntity?: string;
  entityId: string;
  details: string;
  timestamp: string;
  ip: string;
}

export interface AppSettings {
  companyName: string;
  slogan: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  businessHours: string;
  googleMapsEmbedUrl: string;
  currency: string;
  taxRatePercent: number;
}
