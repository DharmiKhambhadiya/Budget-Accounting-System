import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import { mockInvoices } from "../data/mockData";

const Invoices = () => {
  const navigate = useNavigate();
  // Use local state initialized from mockData (creates a copy, not a reference)
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    // Create a copy of mockInvoices to avoid mutating original
    setInvoices(mockInvoices.map((inv) => ({ ...inv })));
  }, []);

  const handleRowClick = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoices</h1>
          <p className="text-gray-600">View and manage your invoices</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="table-header">Invoice Number</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Due Date</th>
                  <th className="table-header text-right">Amount</th>
                  <th className="table-header text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        No invoices found
                      </p>
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      onClick={() => handleRowClick(invoice.id)}
                      className="table-row group cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <td className="table-cell">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-blue-50 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 block">
                              {invoice.invoiceNumber}
                            </span>
                            <span className="text-xs text-gray-500">
                              {invoice.title}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell text-gray-600">
                        {new Date(invoice.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="table-cell text-gray-600">
                        {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="table-cell text-right font-semibold text-gray-900">
                        ₹
                        {invoice.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${
                            invoice.status === "Paid"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : invoice.status === "Partial"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
