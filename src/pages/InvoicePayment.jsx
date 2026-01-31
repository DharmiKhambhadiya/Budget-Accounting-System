import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { CreditCard, Smartphone, Building2, Wallet, ArrowLeft } from 'lucide-react';

const InvoicePayment = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Format invoice number
  const formatInvoiceNumber = (id) => {
    const year = new Date().getFullYear();
    const paddedId = String(id).padStart(4, '0');
    return `INV/${year}/${paddedId}`;
  };

  // Mock invoice data
  const invoice = {
    id: invoiceId,
    invoiceNumber: formatInvoiceNumber(invoiceId),
    amount: 12500.00,
    customerName: user?.name || 'Customer',
  };

  const paymentMethods = [
    { id: 'upi', name: 'UPI / QR', icon: Smartphone, description: 'Pay using UPI apps' },
    { id: 'cards', name: 'Cards', icon: CreditCard, description: 'Credit/Debit cards' },
    { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'Internet banking' },
    { id: 'wallet', name: 'Wallet', icon: Wallet, description: 'Digital wallets' },
  ];

  const handlePayNow = async () => {
    if (!selectedMethod) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update invoice status in localStorage
    localStorage.setItem(`invoice_${invoiceId}_status`, 'Paid');
    
    // Navigate to success page with payment details
    navigate('/payment-success', {
      state: {
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount,
        paymentMethod: selectedMethod,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/invoices/${invoiceId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoice
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-10 text-white">
            <h1 className="text-3xl font-bold mb-2">Complete Payment</h1>
            <p className="text-blue-100 text-sm font-medium">Invoice: {invoice.invoiceNumber}</p>
          </div>

          {/* Amount Display */}
          <div className="px-6 py-10 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Amount to Pay</p>
              <p className="text-5xl font-extrabold text-gray-900">
                ₹{invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Select Payment Method</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full flex items-center p-5 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className={`p-3 rounded-xl mr-4 transition-all ${
                      isSelected ? 'bg-blue-600 shadow-lg scale-110' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 transition-colors ${
                        isSelected ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-bold text-base ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {method.name}
                      </p>
                      <p className={`text-sm mt-0.5 ${
                        isSelected ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        {method.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pay Now Button */}
          <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handlePayNow}
              disabled={!selectedMethod || isProcessing}
              className="btn-primary w-full py-4 text-base"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Pay Now'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePayment;
