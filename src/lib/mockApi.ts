import {
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_TECHNICIANS,
  INITIAL_SERVICES,
  INITIAL_PRODUCTS,
  INITIAL_QUOTATION_REQUESTS,
  INITIAL_QUOTATIONS,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_INVOICES,
  INITIAL_WARRANTIES,
  INITIAL_CCTV_DEVICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from '../data/seedData';

import {
  User,
  TechnicianProfile,
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

const DB_KEY = 'digihub_mock_db_v2';

interface MockDB {
  settings: AppSettings;
  users: (User & { passwordHash?: string })[];
  technicians: TechnicianProfile[];
  services: ServiceItem[];
  products: Product[];
  quotationRequests: QuotationRequest[];
  quotations: Quotation[];
  serviceRequests: ServiceRequest[];
  invoices: Invoice[];
  warranties: WarrantyRecord[];
  cctvDevices: CCTVDevice[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
}

let db: MockDB;

function loadDb(): void {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(DB_KEY);
    if (stored) {
      try {
        db = JSON.parse(stored);
        return;
      } catch (e) {
        console.error('Failed to parse mock DB from localStorage', e);
      }
    }
  }

  db = {
    settings: { ...INITIAL_SETTINGS },
    users: INITIAL_USERS.map((u) => ({ ...u })),
    technicians: INITIAL_TECHNICIANS.map((t) => ({ ...t })),
    services: INITIAL_SERVICES.map((s) => ({ ...s })),
    products: INITIAL_PRODUCTS.map((p) => ({ ...p })),
    quotationRequests: INITIAL_QUOTATION_REQUESTS.map((q) => ({ ...q })),
    quotations: INITIAL_QUOTATIONS.map((q) => ({ ...q })),
    serviceRequests: INITIAL_SERVICE_REQUESTS.map((s) => ({ ...s })),
    invoices: INITIAL_INVOICES.map((i) => ({ ...i })),
    warranties: INITIAL_WARRANTIES.map((w) => ({ ...w })),
    cctvDevices: INITIAL_CCTV_DEVICES.map((d) => ({ ...d })),
    notifications: INITIAL_NOTIFICATIONS.map((n) => ({ ...n })),
    auditLogs: INITIAL_AUDIT_LOGS.map((a) => ({ ...a })),
  };
  saveDb();
}

function saveDb(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (e) {
      console.warn('Unable to persist mock DB to localStorage', e);
    }
  }
}

// Initial bootstrap
loadDb();

function createId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

function generateToken(user: User): string {
  const data = `${user.id}:${Date.now()}:${user.role}`;
  return typeof btoa === 'function' ? btoa(data) : Buffer.from(data).toString('base64');
}

function verifyToken(token: string): User | null {
  try {
    const decoded = typeof atob === 'function' ? atob(token) : Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    const user = db.users.find((u) => u.id === userId && u.isActive);
    return user || null;
  } catch {
    return null;
  }
}

function createResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function parseUrl(urlString: string) {
  const dummyBase = 'http://localhost';
  const url = new URL(urlString, dummyBase);
  return {
    path: url.pathname,
    params: Object.fromEntries(url.searchParams.entries()),
  };
}

export function isMockMode(): boolean {
  if (typeof window !== 'undefined') {
    // If running on GitHub Pages (github.io) or without a real Express backend port 3000
    return (
      window.location.hostname.includes('github.io') ||
      window.location.hostname !== 'localhost' ||
      window.location.port !== '3000'
    );
  }
  return true;
}

export async function mockFetch(urlString: string, options?: RequestInit): Promise<Response> {
  const method = (options?.method || 'GET').toUpperCase();
  const { path, params } = parseUrl(urlString);

  let body: any = {};
  if (options?.body) {
    if (typeof options.body === 'string') {
      try {
        body = JSON.parse(options.body);
      } catch {
        body = {};
      }
    } else {
      body = options.body;
    }
  }

  // Extract auth user
  const headers = (options?.headers as Record<string, string>) || {};
  const authHeader = headers['Authorization'] || headers['authorization'];
  let authUser: User | null = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    authUser = verifyToken(authHeader.substring(7));
  }

  const matchRoute = (pattern: string) => {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    if (patternParts.length !== pathParts.length) return null;
    const routeParams: Record<string, string> = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        routeParams[patternParts[i].substring(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return routeParams;
  };

  // ----------------------------------------------------
  // AUTH ROUTES
  // ----------------------------------------------------
  if (path === '/api/auth/login' && method === 'POST') {
    const { email, password } = body;
    const normalizedEmail = (email || '').toLowerCase().trim();
    const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

    // Accept valid demo passwords or default matching
    const valid =
      password === 'customer123' ||
      password === 'client123' ||
      password === 'admin123' ||
      password === 'tech123' ||
      user?.passwordHash === password;

    if (!user || (!valid && password !== 'client123')) {
      // If user not found but has a standard test account request, fallback to first user
      if (normalizedEmail.includes('david.chen') || normalizedEmail.includes('admin')) {
        const found = db.users.find((u) => u.email.toLowerCase().includes(normalizedEmail.split('@')[0])) || db.users[0];
        const token = generateToken(found);
        const { passwordHash: _, ...safeUser } = found;
        return createResponse({ user: safeUser, token });
      }
      return createResponse({ error: 'Invalid email or password.' }, 401);
    }

    if (!user.isActive) {
      return createResponse({ error: 'This account has been disabled.' }, 403);
    }

    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;
    return createResponse({ user: safeUser, token });
  }

  if (path === '/api/auth/register' && method === 'POST') {
    const { fullName, email, phone, address } = body;
    const normalizedEmail = (email || '').toLowerCase().trim();
    const newUser: User = {
      id: createId('usr_cust'),
      email: normalizedEmail,
      role: 'CUSTOMER',
      fullName: (fullName || 'New Customer').trim(),
      phone: (phone || '').trim(),
      address: (address || '').trim(),
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveDb();
    const token = generateToken(newUser);
    return createResponse({ user: newUser, token }, 201);
  }

  if (path === '/api/auth/me' && method === 'GET') {
    if (!authUser) {
      // Fallback default customer so app never locks up in preview
      const defaultUser = db.users.find((u) => u.role === 'CUSTOMER') || db.users[0];
      const { passwordHash: _, ...safeUser } = defaultUser;
      return createResponse({ user: safeUser });
    }
    const { passwordHash: _, ...safeUser } = authUser;
    return createResponse({ user: safeUser });
  }

  if (path === '/api/auth/profile' && method === 'PATCH') {
    if (!authUser) return createResponse({ error: 'Unauthenticated' }, 401);
    const target = db.users.find((u) => u.id === authUser!.id);
    if (!target) return createResponse({ error: 'User not found' }, 404);
    if (body.fullName) target.fullName = body.fullName.trim();
    if (body.phone) target.phone = body.phone.trim();
    if (body.address) target.address = body.address.trim();
    if (body.avatarUrl) target.avatarUrl = body.avatarUrl;
    saveDb();
    const { passwordHash: _, ...safeUser } = target;
    return createResponse({ user: safeUser });
  }

  if (path === '/api/auth/switch-role' && method === 'POST') {
    const { role, email } = body;
    let target: User | undefined;
    if (email) {
      target = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    } else if (role) {
      target = db.users.find((u) => u.role === role);
    }
    if (!target) {
      target = db.users[0];
    }
    const token = generateToken(target);
    const { passwordHash: _, ...safeUser } = target;
    return createResponse({ user: safeUser, token });
  }

  // ----------------------------------------------------
  // SERVICES
  // ----------------------------------------------------
  if (path === '/api/services' && method === 'GET') {
    let list = db.services.filter((s) => s.isActive);
    if (params.category) {
      list = list.filter((s) => s.category === params.category);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
    return createResponse({ services: list });
  }

  let routeMatch = matchRoute('/api/services/:id');
  if (routeMatch && method === 'GET') {
    const service = db.services.find((s) => s.id === routeMatch!.id || s.slug === routeMatch!.id);
    if (!service) return createResponse({ error: 'Service not found' }, 404);
    return createResponse({ service });
  }

  if (path === '/api/admin/services' && method === 'POST') {
    const newService: ServiceItem = {
      id: createId('srv'),
      name: body.name || 'New Service',
      slug: (body.name || 'service').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: body.category || 'CCTV',
      description: body.description || '',
      features: Array.isArray(body.features) ? body.features : [],
      startingPrice: Number(body.startingPrice) || 0,
      image: body.image || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
      isActive: true,
    };
    db.services.push(newService);
    saveDb();
    return createResponse({ service: newService }, 201);
  }

  routeMatch = matchRoute('/api/admin/services/:id');
  if (routeMatch && method === 'PATCH') {
    const index = db.services.findIndex((s) => s.id === routeMatch!.id);
    if (index === -1) return createResponse({ error: 'Service not found' }, 404);
    db.services[index] = { ...db.services[index], ...body };
    saveDb();
    return createResponse({ service: db.services[index] });
  }

  // ----------------------------------------------------
  // PRODUCTS
  // ----------------------------------------------------
  if (path === '/api/products' && method === 'GET') {
    let list = [...db.products];
    if (params.category) {
      list = list.filter((p) => p.category === params.category);
    }
    if (params.brand) {
      list = list.filter((p) => p.brand.toLowerCase() === params.brand.toLowerCase());
    }
    if (params.inStockOnly === 'true') {
      list = list.filter((p) => p.stockQuantity > 0);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    return createResponse({ products: list, total: list.length });
  }

  routeMatch = matchRoute('/api/products/:id');
  if (routeMatch && method === 'GET') {
    const product = db.products.find((p) => p.id === routeMatch!.id || p.sku === routeMatch!.id);
    if (!product) return createResponse({ error: 'Product not found' }, 404);
    return createResponse({ product });
  }

  if (path === '/api/admin/products' && method === 'POST') {
    const newProduct: Product = {
      id: createId('prod'),
      name: (body.name || 'New Hardware').trim(),
      sku: (body.sku || `DH-SKU-${Date.now()}`).trim().toUpperCase(),
      category: body.category || 'CCTV Cameras',
      brand: body.brand || 'DIGI Hub Pro',
      description: body.description || '',
      specifications: body.specifications || {},
      price: Number(body.price) || 99,
      discount: body.discount ? Number(body.discount) : undefined,
      stockQuantity: Number(body.stockQuantity) || 10,
      images: Array.isArray(body.images) && body.images.length ? body.images : ['https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80'],
      warranty: body.warranty || '2 Years Warranty',
      isActive: true,
    };
    db.products.unshift(newProduct);
    saveDb();
    return createResponse({ product: newProduct }, 201);
  }

  routeMatch = matchRoute('/api/admin/products/:id');
  if (routeMatch && method === 'PATCH') {
    const idx = db.products.findIndex((p) => p.id === routeMatch!.id);
    if (idx === -1) return createResponse({ error: 'Product not found' }, 404);
    db.products[idx] = { ...db.products[idx], ...body };
    saveDb();
    return createResponse({ product: db.products[idx] });
  }

  if (routeMatch && method === 'DELETE') {
    db.products = db.products.filter((p) => p.id !== routeMatch!.id);
    saveDb();
    return createResponse({ success: true });
  }

  // ----------------------------------------------------
  // QUOTATIONS
  // ----------------------------------------------------
  if (path === '/api/quotations/request' && method === 'POST') {
    const nextIdx = db.quotationRequests.length + 1;
    const requestNumber = `DH-Q-${String(nextIdx).padStart(6, '0')}`;
    const newReq: QuotationRequest = {
      id: createId('qr'),
      requestNumber,
      customerId: authUser ? authUser.id : 'usr_cust_1',
      customerName: body.customerName || 'Valued Client',
      phone: body.phone || '+1 (555) 019-8800',
      email: body.email || 'customer@example.com',
      location: body.location || 'Local Site',
      serviceRequired: body.serviceRequired || 'CCTV Installation',
      numberOfCameras: body.numberOfCameras ? Number(body.numberOfCameras) : undefined,
      propertyType: body.propertyType || 'Residential / Villa',
      preferredDate: body.preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: body.preferredTime || 'Morning (9:00 AM - 12:00 PM)',
      additionalRequirements: body.additionalRequirements || '',
      photos: Array.isArray(body.photos) ? body.photos : [],
      status: 'Submitted',
      createdAt: new Date().toISOString(),
    };
    db.quotationRequests.unshift(newReq);
    saveDb();
    return createResponse({ quotationRequest: newReq }, 201);
  }

  if (path === '/api/quotations/requests' && method === 'GET') {
    let list = [...db.quotationRequests];
    if (authUser && authUser.role === 'CUSTOMER') {
      list = list.filter((q) => q.customerId === authUser!.id || q.email.toLowerCase() === authUser!.email.toLowerCase());
    }
    return createResponse({ quotationRequests: list });
  }

  if (path === '/api/quotations' && method === 'GET') {
    let list = [...db.quotations];
    if (authUser && authUser.role === 'CUSTOMER') {
      list = list.filter((q) => q.customerId === authUser!.id || q.customerEmail.toLowerCase() === authUser!.email.toLowerCase());
    }
    return createResponse({ quotations: list });
  }

  routeMatch = matchRoute('/api/quotations/:id');
  if (routeMatch && method === 'GET') {
    const quote = db.quotations.find((q) => q.id === routeMatch!.id || q.quotationNumber === routeMatch!.id);
    if (!quote) return createResponse({ error: 'Quotation not found' }, 404);
    return createResponse({ quotation: quote });
  }

  if (path === '/api/admin/quotations' && method === 'POST') {
    const items = Array.isArray(body.items) ? body.items : [];
    const calculatedItems = items.map((item: any, idx: number) => ({
      id: createId(`qi_${idx}`),
      description: item.description,
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 0,
      total: (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0),
    }));
    const subtotal = calculatedItems.reduce((acc: number, curr: any) => acc + curr.total, 0);
    const discount = Number(body.discount) || 0;
    const tax = Math.round((subtotal - discount) * (db.settings.taxRatePercent / 100) * 100) / 100;
    const total = Math.max(0, subtotal - discount + tax);
    const quotationNumber = `DH-EST-2026-${String(db.quotations.length + 1).padStart(3, '0')}`;

    const newQuotation: Quotation = {
      id: createId('quote'),
      quotationNumber,
      quotationRequestId: body.quotationRequestId,
      customerId: body.customerId || 'usr_cust_1',
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone || '',
      customerAddress: body.customerAddress || '',
      items: calculatedItems,
      subtotal,
      discount,
      tax,
      total,
      validityDate: body.validityDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      termsAndConditions: body.termsAndConditions || 'Quotation valid for 30 days.',
      notes: body.notes || '',
      status: 'Sent',
      createdAt: new Date().toISOString(),
    };
    db.quotations.unshift(newQuotation);
    saveDb();
    return createResponse({ quotation: newQuotation }, 201);
  }

  routeMatch = matchRoute('/api/quotations/:id/status');
  if (routeMatch && method === 'PATCH') {
    const quote = db.quotations.find((q) => q.id === routeMatch!.id);
    if (!quote) return createResponse({ error: 'Quotation not found' }, 404);
    quote.status = body.status;
    saveDb();
    return createResponse({ quotation: quote });
  }

  // ----------------------------------------------------
  // SERVICE REQUESTS
  // ----------------------------------------------------
  if (path === '/api/service-requests' && method === 'POST') {
    const nextIdx = db.serviceRequests.length + 1;
    const requestNumber = `DH-SR-${String(nextIdx).padStart(6, '0')}`;
    const newReq: ServiceRequest = {
      id: createId('sr'),
      requestNumber,
      customerId: authUser ? authUser.id : 'usr_cust_1',
      customerName: authUser ? authUser.fullName : (body.customerName || 'Valued Customer'),
      phone: body.phone || '+1 (555) 019-8800',
      location: body.location || 'Local Site',
      serviceType: body.serviceType || 'CCTV Maintenance & Health Check',
      problemDescription: body.problemDescription || '',
      preferredDate: body.preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: body.preferredTime || 'Morning (9:00 AM - 12:00 PM)',
      photos: Array.isArray(body.photos) ? body.photos : [],
      additionalNotes: body.additionalNotes || '',
      status: 'Submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.serviceRequests.unshift(newReq);
    saveDb();
    return createResponse({ serviceRequest: newReq }, 201);
  }

  if (path === '/api/service-requests' && method === 'GET') {
    let list = [...db.serviceRequests];
    if (authUser) {
      if (authUser.role === 'CUSTOMER') {
        list = list.filter((sr) => sr.customerId === authUser!.id);
      } else if (authUser.role === 'TECHNICIAN') {
        list = list.filter((sr) => sr.assignedTechnicianId === authUser!.id);
      }
    }
    return createResponse({ serviceRequests: list });
  }

  routeMatch = matchRoute('/api/service-requests/:id');
  if (routeMatch && method === 'GET') {
    const sr = db.serviceRequests.find((s) => s.id === routeMatch!.id || s.requestNumber === routeMatch!.id);
    if (!sr) return createResponse({ error: 'Service request not found' }, 404);
    return createResponse({ serviceRequest: sr });
  }

  routeMatch = matchRoute('/api/admin/service-requests/:id/assign');
  if (routeMatch && method === 'PATCH') {
    const ticket = db.serviceRequests.find((sr) => sr.id === routeMatch!.id);
    if (!ticket) return createResponse({ error: 'Service ticket not found' }, 404);
    const tech = db.technicians.find((t) => t.userId === body.technicianId || t.id === body.technicianId);
    if (tech) {
      ticket.assignedTechnicianId = tech.userId;
      ticket.assignedTechnicianName = tech.fullName;
    }
    if (body.scheduledDate) ticket.scheduledDate = body.scheduledDate;
    if (body.scheduledTime) ticket.scheduledTime = body.scheduledTime;
    ticket.status = 'Assigned';
    ticket.updatedAt = new Date().toISOString();
    saveDb();
    return createResponse({ serviceRequest: ticket });
  }

  routeMatch = matchRoute('/api/service-requests/:id/status');
  if (routeMatch && method === 'PATCH') {
    const ticket = db.serviceRequests.find((sr) => sr.id === routeMatch!.id);
    if (!ticket) return createResponse({ error: 'Service ticket not found' }, 404);
    if (body.status) ticket.status = body.status;
    if (body.technicianNotes !== undefined) ticket.technicianNotes = body.technicianNotes;
    if (body.beforePhotos) ticket.beforePhotos = body.beforePhotos;
    if (body.afterPhotos) ticket.afterPhotos = body.afterPhotos;
    if (body.partsUsed) ticket.partsUsed = body.partsUsed;
    ticket.updatedAt = new Date().toISOString();
    saveDb();
    return createResponse({ serviceRequest: ticket });
  }

  // ----------------------------------------------------
  // TECHNICIANS
  // ----------------------------------------------------
  if (path === '/api/technicians' && method === 'GET') {
    const enriched = db.technicians.map((t) => {
      const activeJobs = db.serviceRequests.filter(
        (sr) => sr.assignedTechnicianId === t.userId && sr.status !== 'Completed' && sr.status !== 'Cancelled'
      ).length;
      return { ...t, activeJobsCount: activeJobs };
    });
    return createResponse({ technicians: enriched });
  }

  if (path === '/api/technicians/jobs' && method === 'GET') {
    let jobs = db.serviceRequests;
    if (authUser && authUser.role === 'TECHNICIAN') {
      jobs = jobs.filter((j) => j.assignedTechnicianId === authUser!.id);
    }
    const todayStr = new Date().toISOString().split('T')[0];
    const todayJobs = jobs.filter((j) => j.scheduledDate === todayStr || j.status === 'In Progress' || j.status === 'Technician On The Way');
    const upcomingJobs = jobs.filter((j) => (j.scheduledDate && j.scheduledDate > todayStr) || j.status === 'Scheduled' || j.status === 'Assigned');
    const completedJobs = jobs.filter((j) => j.status === 'Completed');
    const pendingJobs = jobs.filter((j) => j.status === 'Submitted');

    return createResponse({
      allJobs: jobs,
      todayJobs,
      upcomingJobs,
      completedJobs,
      pendingJobs,
    });
  }

  // ----------------------------------------------------
  // INVOICES
  // ----------------------------------------------------
  if (path === '/api/invoices' && method === 'GET') {
    let list = [...db.invoices];
    if (authUser && authUser.role === 'CUSTOMER') {
      list = list.filter((inv) => inv.customerId === authUser!.id || inv.customerEmail.toLowerCase() === authUser!.email.toLowerCase());
    }
    return createResponse({ invoices: list });
  }

  if (path === '/api/admin/invoices' && method === 'POST') {
    const items = Array.isArray(body.items) ? body.items : [];
    const lineItems = items.map((it: any, i: number) => ({
      id: createId(`inv_item_${i}`),
      description: it.description,
      quantity: Number(it.quantity) || 1,
      unitPrice: Number(it.unitPrice) || 0,
      total: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
    }));
    const subtotal = lineItems.reduce((acc: number, curr: any) => acc + curr.total, 0);
    const disc = Number(body.discount) || 0;
    const tax = Math.round((subtotal - disc) * (db.settings.taxRatePercent / 100) * 100) / 100;
    const total = Math.max(0, subtotal - disc + tax);
    const invoiceNumber = `DH-INV-${String(db.invoices.length + 101).padStart(5, '0')}`;

    const newInvoice: Invoice = {
      id: createId('inv'),
      invoiceNumber,
      customerId: body.customerId || 'usr_cust_1',
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone || '',
      customerAddress: body.customerAddress || '',
      items: lineItems,
      subtotal,
      tax,
      discount: disc,
      total,
      paymentStatus: body.paymentStatus || 'Pending',
      dueDate: body.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      notes: body.notes || 'Thank you for choosing DIGI Hub.',
      createdAt: new Date().toISOString(),
    };
    db.invoices.unshift(newInvoice);
    saveDb();
    return createResponse({ invoice: newInvoice }, 201);
  }

  routeMatch = matchRoute('/api/admin/invoices/:id/status');
  if (routeMatch && method === 'PATCH') {
    const inv = db.invoices.find((i) => i.id === routeMatch!.id);
    if (!inv) return createResponse({ error: 'Invoice not found' }, 404);
    inv.paymentStatus = body.paymentStatus;
    saveDb();
    return createResponse({ invoice: inv });
  }

  // ----------------------------------------------------
  // WARRANTIES
  // ----------------------------------------------------
  if (path === '/api/warranties' && method === 'GET') {
    let list = [...db.warranties];
    if (authUser && authUser.role === 'CUSTOMER') {
      list = list.filter((w) => w.customerId === authUser!.id);
    }
    return createResponse({ warranties: list });
  }

  if (path === '/api/admin/warranties' && method === 'POST') {
    const pDate = body.purchaseDate || new Date().toISOString().split('T')[0];
    const months = Number(body.warrantyMonths) || 24;
    const endDate = new Date(new Date(pDate).getTime() + months * 30 * 86400000).toISOString().split('T')[0];
    const newWarranty: WarrantyRecord = {
      id: createId('war'),
      customerId: body.customerId || 'usr_cust_1',
      customerName: body.customerName,
      productName: body.productName,
      serialNumber: body.serialNumber,
      purchaseDate: pDate,
      warrantyStart: pDate,
      warrantyEnd: endDate,
      warrantyTerms: body.warrantyTerms || 'Standard Warranty',
      status: new Date(endDate) < new Date() ? 'Expired' : 'Active',
    };
    db.warranties.unshift(newWarranty);
    saveDb();
    return createResponse({ warranty: newWarranty }, 201);
  }

  // ----------------------------------------------------
  // CCTV DEVICES
  // ----------------------------------------------------
  if (path === '/api/cctv-devices' && method === 'GET') {
    let list = [...db.cctvDevices];
    if (authUser && authUser.role === 'CUSTOMER') {
      list = list.filter((d) => d.customerId === authUser!.id);
    }
    return createResponse({ devices: list });
  }

  if (path === '/api/cctv-devices' && method === 'POST') {
    const newDevice: CCTVDevice = {
      id: createId('cctv'),
      customerId: authUser ? authUser.id : 'usr_cust_1',
      deviceName: (body.deviceName || 'New Camera').trim(),
      location: (body.location || 'Site Perimeter').trim(),
      deviceType: body.deviceType || 'Bullet Camera',
      manufacturer: body.manufacturer || 'Hikvision',
      model: body.model || 'DS-2CD-PRO',
      serialNumber: body.serialNumber || `SN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      ipAddress: (body.ipAddress || '192.168.1.150').trim(),
      rtspPort: Number(body.rtspPort) || 554,
      channel: Number(body.channel) || 1,
      resolution: body.resolution || '3840x2160 @ 25fps',
      status: 'Online',
      lastPing: new Date().toISOString(),
      isEncrypted: true,
    };
    db.cctvDevices.push(newDevice);
    saveDb();
    return createResponse({ device: newDevice }, 201);
  }

  routeMatch = matchRoute('/api/cctv-devices/:id/ping');
  if (routeMatch && method === 'POST') {
    const device = db.cctvDevices.find((d) => d.id === routeMatch!.id);
    if (!device) return createResponse({ error: 'Device not found' }, 404);
    device.status = 'Online';
    device.lastPing = new Date().toISOString();
    saveDb();
    return createResponse({
      device,
      ping: {
        success: true,
        latencyMs: Math.floor(18 + Math.random() * 32),
        protocol: 'RTSP/ONVIF',
        port: device.rtspPort,
        timestamp: device.lastPing,
      },
    });
  }

  // ----------------------------------------------------
  // NOTIFICATIONS
  // ----------------------------------------------------
  if (path === '/api/notifications' && method === 'GET') {
    const list = authUser
      ? db.notifications.filter((n) => n.userId === authUser!.id || (authUser!.role === 'ADMIN' && n.userId === 'usr_admin'))
      : db.notifications;
    const unreadCount = list.filter((n) => !n.read).length;
    return createResponse({ notifications: list, unreadCount });
  }

  routeMatch = matchRoute('/api/notifications/:id/read');
  if (routeMatch && method === 'PATCH') {
    const notif = db.notifications.find((n) => n.id === routeMatch!.id);
    if (notif) {
      notif.read = true;
      saveDb();
    }
    return createResponse({ success: true });
  }

  if (path === '/api/admin/notifications/broadcast' && method === 'POST') {
    const { title, message, type } = body;
    db.users.forEach((u) => {
      db.notifications.unshift({
        id: createId('notif'),
        userId: u.id,
        title: title || 'Broadcast Announcement',
        message: message || '',
        type: type || 'system',
        read: false,
        createdAt: new Date().toISOString(),
      });
    });
    saveDb();
    return createResponse({ success: true, count: db.users.length });
  }

  // ----------------------------------------------------
  // ADMIN DASHBOARD & AUDIT LOGS
  // ----------------------------------------------------
  if (path === '/api/audit-logs' && method === 'GET') {
    return createResponse({ logs: db.auditLogs });
  }

  if (path === '/api/stats/dashboard' && method === 'GET') {
    const totalCustomers = db.users.filter((u) => u.role === 'CUSTOMER').length;
    const newQuotations = db.quotationRequests.filter((q) => q.status === 'Submitted' || q.status === 'Under Review').length;
    const pendingQuotations = db.quotationRequests.filter((q) => q.status === 'Site Visit Required' || q.status === 'Quotation Prepared').length;
    const openServiceRequests = db.serviceRequests.filter((sr) => sr.status !== 'Completed' && sr.status !== 'Cancelled').length;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayJobs = db.serviceRequests.filter((sr) => sr.scheduledDate === todayStr || sr.status === 'In Progress').length;
    const completedJobs = db.serviceRequests.filter((sr) => sr.status === 'Completed').length;
    const totalProducts = db.products.length;
    const totalTechnicians = db.technicians.length;
    const totalRevenue = db.invoices.filter((i) => i.paymentStatus === 'Paid').reduce((acc, curr) => acc + curr.total, 0);

    const technicianWorkload = db.technicians.map((tech) => {
      const active = db.serviceRequests.filter((sr) => sr.assignedTechnicianId === tech.userId && sr.status !== 'Completed').length;
      return { name: tech.fullName, activeJobs: active, specialization: tech.specialization };
    });

    return createResponse({
      metrics: {
        totalCustomers,
        newQuotations,
        pendingQuotations,
        openServiceRequests,
        todayJobs,
        completedJobs,
        totalProducts,
        totalTechnicians,
        totalRevenue,
      },
      technicianWorkload,
      recentQuotations: db.quotationRequests.slice(0, 5),
      recentServiceRequests: db.serviceRequests.slice(0, 5),
    });
  }

  if (path === '/api/admin/customers' && method === 'GET') {
    const customers = db.users.filter((u) => u.role === 'CUSTOMER').map(({ passwordHash, ...safe }) => safe);
    return createResponse({ customers });
  }

  routeMatch = matchRoute('/api/admin/customers/:id/toggle-active');
  if (routeMatch && method === 'PATCH') {
    const customer = db.users.find((u) => u.id === routeMatch!.id);
    if (!customer) return createResponse({ error: 'Customer not found' }, 404);
    customer.isActive = !customer.isActive;
    saveDb();
    const { passwordHash: _, ...safe } = customer;
    return createResponse({ customer: safe });
  }

  // ----------------------------------------------------
  // SETTINGS
  // ----------------------------------------------------
  if (path === '/api/settings' && method === 'GET') {
    return createResponse({ settings: db.settings });
  }

  if (path === '/api/admin/settings' && method === 'PUT') {
    db.settings = { ...db.settings, ...body };
    saveDb();
    return createResponse({ settings: db.settings });
  }

  // ----------------------------------------------------
  // HEALTH & UPLOAD
  // ----------------------------------------------------
  if (path === '/api/health' && method === 'GET') {
    return createResponse({
      status: 'ok',
      service: 'DIGI Hub CCTV & Network Solutions (Client Mode)',
      version: '1.0.0-client-mock',
      database: 'In-Memory / LocalStorage Simulated Store',
      timestamp: new Date().toISOString(),
    });
  }

  if (path === '/api/upload' && method === 'POST') {
    return createResponse({
      url: body.fileData || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
      filename: body.filename || 'upload.jpg',
      size: 1024,
    });
  }

  return createResponse({ error: `Not found: ${method} ${path}` }, 404);
}
