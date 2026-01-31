import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";
import { Printer, CreditCard, X } from "lucide-react";

const InvoiceDetail = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock invoice data - replace with API call
  // Format invoice number as INV/YYYY/0001
  const formatInvoiceNumber = (id) => {
    const year = new Date().getFullYear();
    const paddedId = String(id).padStart(4, "0");
    return `INV/${year}/${paddedId}`;
  };

  const invoice = {
    id: invoiceId,
    invoiceNumber: formatInvoiceNumber(invoiceId),
    title: "Customer Invoice",
    status: "Not Paid", // Can be: Paid, Partial, Not Paid
    customerName: user?.name || "Customer Name",
    reference: "REF-2025-001",
    invoiceDate: "2025-01-15",
    dueDate: "2025-02-15",
    lineItems: [
      {
        srNo: 1,
        product: "Office Chair - Premium Model",
        budgetAnalytics: "Furniture - Office",
        quantity: 2,
        unitPrice: 3500.0,
        total: 7000.0,
      },
      {
        srNo: 2,
        product: "Desk - Executive Series",
        budgetAnalytics: "Furniture - Office",
        quantity: 1,
        unitPrice: 5500.0,
        total: 5500.0,
      },
      {
        srNo: 3,
        product: "Conference Table",
        budgetAnalytics: "Furniture - Meeting",
        quantity: 1,
        unitPrice: 12000.0,
        total: 12000.0,
      },
    ],
    payments: {
      cash: 5000.0,
      bank: 7500.0,
    },
  };

  // Calculate totals
  const grandTotal = invoice.lineItems.reduce(
    (sum, item) => sum + item.total,
    0,
  );
  const totalPaid = invoice.payments.cash + invoice.payments.bank;
  const amountDue = grandTotal - totalPaid;

  const handlePrint = () => {
    window.print();
  };

  const handlePay = () => {
    navigate(`/invoices/${invoiceId}/pay`);
  };

  // Get invoice status from localStorage (updated after payment)
  const getInvoiceStatus = () => {
    const savedStatus = localStorage.getItem(`invoice_${invoiceId}_status`);
    return savedStatus || invoice.status;
  };

  const currentStatus = getInvoiceStatus();

  const getStatusBadge = (status) => {
    const statusConfig = {
      Paid: "bg-green-100 text-green-800",
      Partial: "bg-yellow-100 text-yellow-800",
      "Not Paid": "bg-red-100 text-red-800",
    };
    return statusConfig[status] || statusConfig["Not Paid"];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        {/* Main Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {invoice.title}
                </h1>
                <p className="text-gray-600 text-sm font-medium">
                  Invoice Number:{" "}
                  <span className="font-semibold text-gray-900">
                    {invoice.invoiceNumber}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${getStatusBadge(currentStatus)}`}
                >
                  {currentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons - Top */}
          <div className="px-6 py-4 bg-white border-b border-gray-200 flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="btn-secondary flex items-center text-sm"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
            {currentStatus !== "Paid" && (
              <button
                onClick={handlePay}
                className="btn-primary flex items-center text-sm"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay
              </button>
            )}
            <button
              disabled
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Customer Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-medium text-gray-500 block mb-1">
                      Customer Name
                    </span>
                    <p className="text-gray-900 font-semibold text-base">
                      {invoice.customerName}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500 block mb-1">
                      Reference
                    </span>
                    <p className="text-gray-900 font-semibold text-base">
                      {invoice.reference}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">
                  Invoice Dates
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-medium text-gray-500 block mb-1">
                      Invoice Date
                    </span>
                    <p className="text-gray-900 font-semibold text-base">
                      {new Date(invoice.invoiceDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500 block mb-1">
                      Due Date
                    </span>
                    <p className="text-gray-900 font-semibold text-base">
                      {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-5">
                Line Items
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Sr No.
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Budget Analytics
                      </th>
                      <th className="px-5 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoice.lineItems.map((item) => (
                      <tr
                        key={item.srNo}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                          {item.srNo}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-900 font-semibold">
                          {item.product}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {item.budgetAnalytics}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-center">
                          {item.quantity}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                          ₹
                          {item.unitPrice.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                          ₹
                          {item.total.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t-2 border-blue-200">
                    <tr>
                      <td
                        colSpan="5"
                        className="px-5 py-4 text-right text-base font-bold text-gray-700"
                      >
                        Grand Total
                      </td>
                      <td className="px-5 py-4 text-right text-xl font-bold text-blue-600">
                        ₹
                        {grandTotal.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Summary - Bottom Right */}
            <div className="flex justify-end">
              <div className="w-full md:w-96">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-5">
                    Payment Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-600">
                        Paid via Cash
                      </span>
                      <span className="text-base font-bold text-gray-900">
                        ₹
                        {invoice.payments.cash.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-600">
                        Paid via Bank
                      </span>
                      <span className="text-base font-bold text-gray-900">
                        ₹
                        {invoice.payments.bank.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="pt-4 border-t-2 border-gray-300">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-gray-800">
                          Amount Due
                        </span>
                        <span
                          className={`text-2xl font-extrabold ${
                            amountDue > 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          ₹
                          {amountDue.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
