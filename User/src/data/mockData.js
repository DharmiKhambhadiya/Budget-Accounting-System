export const mockUser = {
  id: "U001",
  name: "Alex Johnson",
  email: "alex.j@example.com",
  role: "customer",
  avatar: null
};

export const mockStats = [
  {
    title: "Total Invoices",
    value: "12",
    change: "+2",
    type: "neutral"
  },
  {
    title: "Paid Amount",
    value: "1,45,000",
    change: "+15%",
    type: "positive"
  },
  {
    title: "Pending Amount",
    value: "25,500",
    change: "-5%",
    type: "negative"
  }
];

export const mockRecentActivity = [
  {
    id: 1,
    title: "Invoice #INV-2024-001 Paid",
    timestamp: "2 hours ago",
    amount: "+₹12,500",
    type: "success"
  },
  {
    id: 2,
    title: "New Invoice #INV-2024-005 Received",
    timestamp: "5 hours ago",
    amount: "₹8,500",
    type: "info"
  },
  {
    id: 3,
    title: "Payment processed for #INV-2024-002",
    timestamp: "1 day ago",
    amount: "-₹4,200",
    type: "neutral"
  }
];

export const mockInvoices = [
  {
    id: "1",
    invoiceNumber: "INV/2025/0001",
    date: "2025-01-15",
    dueDate: "2025-02-15",
    amount: 12500.00,
    status: "Not Paid",
    customerId: "U001",
    title: "Consulting Services - Jan",
    lineItems: [
        { srNo: 1, product: "Consulting Hours", quantity: 10, unitPrice: 1000, total: 10000 },
        { srNo: 2, product: "Travel Expenses", quantity: 1, unitPrice: 2500, total: 2500 }
    ],
    payments: { cash: 0, bank: 0 }
  },
  {
    id: "2",
    invoiceNumber: "INV/2025/0002",
    date: "2025-01-20",
    dueDate: "2025-02-20",
    amount: 8500.00,
    status: "Paid",
    customerId: "U001",
    title: "Software License Renewal",
    lineItems: [
        { srNo: 1, product: "Pro License 2025", quantity: 1, unitPrice: 8500, total: 8500 }
    ],
    payments: { cash: 0, bank: 8500 }
  },
  {
    id: "3",
    invoiceNumber: "INV/2025/0003",
    date: "2025-02-01",
    dueDate: "2025-03-01",
    amount: 15000.00,
    status: "Partial",
    customerId: "U001",
    title: "Hardware Upgrade",
    lineItems: [
        { srNo: 1, product: "Server RAM 32GB", quantity: 2, unitPrice: 7500, total: 15000 }
    ],
    payments: { cash: 5000, bank: 0 }
  },
  {
    id: "4",
    invoiceNumber: "INV/2025/0004",
    date: "2025-02-10",
    dueDate: "2025-03-10",
    amount: 4500.00,
    status: "Not Paid",
    customerId: "U001",
    title: "Maintenance AMC",
    lineItems: [
        { srNo: 1, product: "Q1 Maintenance", quantity: 1, unitPrice: 4500, total: 4500 }
    ],
    payments: { cash: 0, bank: 0 }
  }
];
