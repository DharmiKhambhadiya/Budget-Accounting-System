export const mockUsers = [
  { _id: "1", name: "Admin User", loginId: "admin", email: "admin@company.com", role: "admin", isActive: true },
  { _id: "2", name: "John Manager", loginId: "manager", email: "john@company.com", role: "user", isActive: true },
  { _id: "3", name: "Sarah Staff", loginId: "sarah", email: "sarah@company.com", role: "user", isActive: true },
];

export const mockProducts = [
  { _id: "1", name: "Ergonomic Office Chair", category: "Furniture", unit: "Piece", salePrice: 249.99, purchasePrice: 150.00, stockQuantity: 45 },
  { _id: "2", name: "Standing Desk - Motorized", category: "Furniture", unit: "Piece", salePrice: 599.00, purchasePrice: 400.00, stockQuantity: 12 },
  { _id: "3", name: "27-inch Monitor", category: "Electronics", unit: "Piece", salePrice: 329.50, purchasePrice: 210.00, stockQuantity: 28 },
  { _id: "4", name: "Mechanical Keyboard", category: "Accessories", unit: "Piece", salePrice: 129.99, purchasePrice: 65.00, stockQuantity: 50 },
  { _id: "5", name: "USB-C Hub", category: "Accessories", unit: "Piece", salePrice: 49.99, purchasePrice: 25.00, stockQuantity: 100 },
];

export const mockContacts = [
  { _id: "1", name: "TechSupplies Corp", contactType: "Vendor", email: "orders@techsupplies.com", phone: "+1 555-0123", address: "123 Tech Park, CA", tags: ["hardware", "preferred"] },
  { _id: "2", name: "Office Depot Inc.", contactType: "Vendor", email: "b2b@officedepot.com", phone: "+1 555-0199", address: "45 Business Rd, NY", tags: ["supplies"] },
  { _id: "3", name: "Acme Innovations", contactType: "Customer", email: "purchasing@acme.com", phone: "+1 555-0888", address: "789 Innovation Dr, TX", tags: ["vip", "enterprise"] },
  { _id: "4", name: "StartUp Hub", contactType: "Customer", email: "hello@startuphub.io", phone: "+1 555-0777", address: "505 Founder St, CA", tags: ["monthly"] },
];

export const mockAnalyticalAccounts = [
  { _id: "1", name: "IT Department", description: "Hardware, Software, and Infrastructure", accountType: "Expense" },
  { _id: "2", name: "Marketing & Sales", description: "Campaigns, Ads, and Collateral", accountType: "Expense" },
  { _id: "3", name: "Product Development", description: "R&D and Prototyping", accountType: "Expense" },
  { _id: "4", name: "General Revenue", description: "Sales Income", accountType: "Revenue" },
];

export const mockBudgets = [
  { 
    _id: "1", 
    name: "Q1 IT Hardware Upgrade", 
    analyticalAccountId: { _id: "1", name: "IT Department" }, 
    period_startDate: "2024-01-01", 
    period_endDate: "2024-03-31", 
    amount: 50000, 
    spentAmount: 12500, 
    remainingAmount: 37500 
  },
  { 
    _id: "2", 
    name: "Q1 Digital Marketing", 
    analyticalAccountId: { _id: "2", name: "Marketing & Sales" }, 
    period_startDate: "2024-01-01", 
    period_endDate: "2024-03-31", 
    amount: 25000, 
    spentAmount: 20000, 
    remainingAmount: 5000 
  },
  { 
    _id: "3", 
    name: "Q2 R&D Fund", 
    analyticalAccountId: { _id: "3", name: "Product Development" }, 
    period_startDate: "2024-04-01", 
    period_endDate: "2024-06-30", 
    amount: 100000, 
    spentAmount: 0, 
    remainingAmount: 100000 
  }
];

export const mockPurchaseOrders = [
  {
    _id: "1",
    orderNumber: "PO-2024-001",
    vendorId: { _id: "1", name: "TechSupplies Corp" },
    orderDate: "2024-02-15",
    expectedDeliveryDate: "2024-02-28",
    analyticalAccountId: { _id: "1", name: "IT Department" },
    status: "Done",
    totalAmount: 5000,
    subtotal: 4500,
    taxAmount: 500
  },
  {
    _id: "2",
    orderNumber: "PO-2024-002",
    vendorId: { _id: "2", name: "Office Depot Inc." },
    orderDate: "2024-03-01",
    expectedDeliveryDate: "2024-03-10",
    analyticalAccountId: { _id: "2", name: "Marketing & Sales" },
    status: "In Transit",
    totalAmount: 1200,
    subtotal: 1000,
    taxAmount: 200
  },
  {
    _id: "3",
    orderNumber: "PO-2024-003",
    vendorId: { _id: "1", name: "TechSupplies Corp" },
    orderDate: "2024-03-05",
    expectedDeliveryDate: "2024-03-20",
    analyticalAccountId: { _id: "3", name: "Product Development" },
    status: "Draft",
    totalAmount: 7500,
    subtotal: 6800,
    taxAmount: 700
  }
];

export const mockVendorBills = [
  {
    _id: "101",
    billNumber: "BILL-TS-99",
    vendorId: { _id: "1", name: "TechSupplies Corp" },
    purchaseOrderId: { _id: "1", orderNumber: "PO-2024-001" },
    billDate: "2024-02-28",
    dueDate: "2024-03-28",
    analyticalAccountId: { _id: "1", name: "IT Department" },
    status: "Paid",
    totalAmount: 5000,
    paidAmount: 5000,
    remainingAmount: 0
  },
  {
    _id: "102",
    billNumber: "BILL-OD-55",
    vendorId: { _id: "2", name: "Office Depot Inc." },
    purchaseOrderId: { _id: "2", orderNumber: "PO-2024-002" },
    billDate: "2024-03-02",
    dueDate: "2024-04-02",
    analyticalAccountId: { _id: "2", name: "Marketing & Sales" },
    status: "Unpaid",
    totalAmount: 1200,
    paidAmount: 0,
    remainingAmount: 1200
  }
];

export const mockCustomerInvoices = [
  {
    _id: "201",
    invoiceNumber: "INV-2024-001",
    customerId: { _id: "3", name: "Acme Innovations" },
    invoiceDate: "2024-02-20",
    dueDate: "2024-03-20",
    status: "Paid",
    totalAmount: 15000,
    remainingAmount: 0
  },
  {
    _id: "202",
    invoiceNumber: "INV-2024-002",
    customerId: { _id: "4", name: "StartUp Hub" },
    invoiceDate: "2024-03-10",
    dueDate: "2024-04-10",
    status: "Unpaid",
    totalAmount: 2500,
    remainingAmount: 2500
  }
];

export const mockSalesOrders = [
  {
    _id: "301",
    orderNumber: "SO-2024-001",
    customerId: { _id: "3", name: "Acme Innovations" },
    orderDate: "2024-02-18",
    deliveryDate: "2024-02-25",
    analyticalAccountId: { _id: "4", name: "General Revenue" },
    status: "Done",
    totalAmount: 4500,
    subtotal: 4000,
    taxAmount: 500
  },
  {
    _id: "302",
    orderNumber: "SO-2024-002",
    customerId: { _id: "4", name: "StartUp Hub" },
    orderDate: "2024-03-05",
    deliveryDate: "2024-03-12",
    analyticalAccountId: { _id: "4", name: "General Revenue" },
    status: "Draft",
    totalAmount: 1200,
    subtotal: 1000,
    taxAmount: 200
  }
];

export const mockAutoAnalyticalModels = [
  {
    _id: "401",
    ruleType: "Vendor Based",
    conditions: {
      vendorId: { _id: "1", name: "TechSupplies Corp" },
      productId: "",
      minAmount: "",
      keywords: []
    },
    analyticalAccountId: { _id: "1", name: "IT Department" },
    priority: 1
  }
];
