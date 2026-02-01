import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";
import { Printer, CreditCard, X, ArrowLeft } from "lucide-react";
import { mockInvoices } from "../data/mockData";

const InvoiceDetail = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find invoice from mock data and create a local copy
    const found = mockInvoices.find((i) => i.id === invoiceId);
    if (found) {
      // Create a copy to avoid mutating original mockData
      setInvoice({ ...found });
    }
    setLoading(false);
  }, [invoiceId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!invoice)
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800">Invoice not found</h2>
        <button
          onClick={() => navigate("/invoices")}
          className="mt-4 text-blue-600 underline"
        >
          Back to Invoices
        </button>
      </div>
    );

  // Calculate totals from local invoice state
  const grandTotal = invoice.amount;
  const totalPaid =
    (invoice.payments?.bank || 0) + (invoice.payments?.cash || 0);
  const amountDue = grandTotal - totalPaid;

  const handlePrint = () => {
    window.print();
  };

  const handlePay = () => {
    navigate(`/invoices/${invoiceId}/pay`);
  };

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

        <button
          onClick={() => navigate("/invoices")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </button>

        {/* Main Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {invoice.title || "Customer Invoice"}
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
                  className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${getStatusBadge(invoice.status)}`}
                >
                  {invoice.status}
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
            {invoice.status !== "Paid" && (
              <button
                onClick={handlePay}
                className="btn-primary flex items-center text-sm"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay
              </button>
            )}
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
                      {user?.name || "Customer"}
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
                      {new Date(invoice.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
                    {invoice.lineItems?.map((item) => (
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
                        colSpan="4"
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

            {/* Payment Summary */}
            <div className="flex justify-end">
              <div className="w-full md:w-96">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-5">
                    Payment Summary
                  </h3>
                  <div className="space-y-4">
                    {/* Simplified payment breakdown */}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-600">
                        Total Paid
                      </span>
                      <span className="text-base font-bold text-gray-900">
                        ₹
                        {totalPaid.toLocaleString("en-IN", {
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
                          className={`text-2xl font-extrabold ${amountDue > 0 ? "text-red-600" : "text-green-600"}`}
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
