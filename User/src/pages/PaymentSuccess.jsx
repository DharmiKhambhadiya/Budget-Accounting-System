import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const paymentData = location.state || {
    invoiceNumber: 'INV/2025/0001',
    amount: 12500.00,
    paymentMethod: 'cards',
  };

  useEffect(() => {
    // Show success toast
    toast.success('Payment completed successfully!');
  }, []);

  const getPaymentMethodName = (method) => {
    const methods = {
      upi: 'UPI / QR',
      cards: 'Cards',
      netbanking: 'Net Banking',
      wallet: 'Wallet',
    };
    return methods[method] || 'Payment';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Success Icon */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-14 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500 mb-5 shadow-lg animate-pulse">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanks for your payment</h1>
          </div>

          {/* Payment Details */}
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <p className="text-4xl font-extrabold text-gray-900 mb-2">
                ₹{paymentData.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm font-medium text-gray-500">has been paid successfully</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 mb-6 border border-gray-200">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Invoice Number:</span>
                  <span className="font-bold text-gray-900">{paymentData.invoiceNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Payment Method:</span>
                  <span className="font-bold text-gray-900">
                    {getPaymentMethodName(paymentData.paymentMethod)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 pt-3 border-t border-gray-300">
                  <span className="text-gray-700 font-semibold">Amount:</span>
                  <span className="font-extrabold text-lg text-gray-900">
                    ₹{paymentData.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center mb-8 font-medium">
              A payment will appear on your statement
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/invoices')}
                className="btn-primary w-full py-3.5 text-base"
              >
                View Invoices
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center justify-center text-gray-600 hover:text-gray-900 font-semibold py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
