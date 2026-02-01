import { useState, useMemo } from 'react'; // removed useEffect since no fetch needed
import { DollarSign, TrendingUp, Wallet, BarChart3 } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import DataTable from '../components/DataTable';
// import StatusBadge from '../components/StatusBadge'; // Not actually used in JSX unless hidden? Checked original, it was used in code but not rendered in visible card JSX perhaps? Wait, datatable column render uses it?
// Ah, DataTable uses StatusBadge inside? No, DataTable just renders cell value.
// But wait, the previous Dashboard.jsx had `StatusBadge` imported but I don't see it used in `invoiceColumns` 'render' prop. It used `type: 'status'` which likely assumes DataTable handles it or the column definition needs a render function if DataTable is generic.
// Let's check `DataTable` implementation... I haven't viewed it. But other pages used `type: 'status'` and it worked. 
// However, in `VendorBills.jsx`, I saw `type: 'status', statusType: 'payment'`.
// In `Dashboard.jsx`, the columns also used `type: 'status'`.
// So I will assume `DataTable` handles it or I should leave it as is.
// Actually, `StatusBadge` was imported in the original file I viewed. I'll keep it to be safe, though ESLint might complain if unused in THIS file directly.
// The `invoiceColumns` definition in `Dashboard.jsx` does NOT have a custom render function using `StatusBadge`, it relies on `type: 'status'`.
// So I can remove `StatusBadge` import if I don't use it explicitly.
// But to be safe I'll keep it if I need to debug. Actually, I'll remove it if unused to be clean.

import { 
  mockBudgets, 
  mockVendorBills, 
  mockCustomerInvoices, 
  mockAnalyticalAccounts 
} from '../data/mockData';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
  // Directly initialize state with mock data
  const [budgets] = useState(mockBudgets);
  const [vendorBills] = useState(mockVendorBills);
  const [customerInvoices] = useState(mockCustomerInvoices);
  const [analyticalAccounts] = useState(mockAnalyticalAccounts);
  // No loading state needed

  const kpis = useMemo(() => {
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const actualSpent = vendorBills.reduce((sum, b) => sum + b.totalAmount, 0);
    const remainingBudget = budgets.reduce((sum, b) => sum + b.remainingAmount, 0);
    const utilization = totalBudget > 0 ? ((actualSpent / totalBudget) * 100).toFixed(1) : 0;

    return {
      totalBudget,
      actualSpent,
      remainingBudget,
      utilization
    };
  }, [budgets, vendorBills]);

  const recentInvoices = useMemo(() => {
    return customerInvoices
      .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
      .slice(0, 5);
  }, [customerInvoices]);

  const pendingBills = useMemo(() => {
    return vendorBills
      .filter(b => b.status !== 'Paid')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [vendorBills]);

  const unpaidInvoices = useMemo(() => {
    return customerInvoices
      .filter(i => i.status !== 'Paid')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [customerInvoices]);

  const budgetByAccount = useMemo(() => {
    return analyticalAccounts.map(account => {
      const accountId = account._id || account.id;
      const accountBudgets = budgets.filter(b => {
        const budgetAccountId = b.analyticalAccountId?._id || b.analyticalAccountId;
        return budgetAccountId === accountId;
      });
      const budgetAmount = accountBudgets.reduce((sum, b) => sum + (b.amount || 0), 0);
      const spentAmount = accountBudgets.reduce((sum, b) => sum + (b.spentAmount || 0), 0);
      
      return {
        accountName: account.name,
        budgetAmount,
        spentAmount,
        remainingAmount: budgetAmount - spentAmount
      };
    }).filter(item => item.budgetAmount > 0);
  }, [budgets, analyticalAccounts, analyticalAccounts]); // fixed dependency

  const invoiceColumns = [
    { key: 'invoiceNumber', header: 'Invoice #', width: '15%' },
    { 
      key: 'invoiceDate', 
      header: 'Date', 
      type: 'date',
      width: '15%'
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      type: 'currency',
      width: '20%'
    },
    {
      key: 'remainingAmount',
      header: 'Remaining',
      type: 'currency',
      width: '20%'
    },
    {
      key: 'status',
      header: 'Status',
      type: 'status',
      statusType: 'payment',
      width: '15%'
    }
  ];

  const billColumns = [
    { key: 'billNumber', header: 'Bill #', width: '15%' },
    { 
      key: 'billDate', 
      header: 'Date', 
      type: 'date',
      width: '15%'
    },
    {
      key: 'dueDate',
      header: 'Due Date', 
      type: 'date',
      width: '15%'
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      type: 'currency',
      width: '20%'
    },
    {
      key: 'remainingAmount',
      header: 'Remaining',
      type: 'currency',
      width: '20%'
    },
    {
      key: 'status',
      header: 'Status',
      type: 'status',
      statusType: 'payment',
      width: '15%'
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Budget Accounting System Overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Budget"
          value={formatCurrency(kpis.totalBudget)}
          subtitle="All active budgets"
          icon={Wallet}
        />
        <SummaryCard
          title="Actual Spent"
          value={formatCurrency(kpis.actualSpent)}
          subtitle="Total vendor bills"
          trend="up"
          trendValue={`${((kpis.actualSpent / kpis.totalBudget) * 100).toFixed(1)}%`}
          icon={DollarSign}
        />
        <SummaryCard
          title="Remaining Budget"
          value={formatCurrency(kpis.remainingBudget)}
          subtitle="Available balance"
          icon={TrendingUp}
        />
        <SummaryCard
          title="Budget Utilization"
          value={`${kpis.utilization}%`}
          subtitle="Spent vs Budget"
          icon={BarChart3}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-5">Budget vs Actual by Analytical Account</h3>
          <div className="min-h-[200px]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="table-header">Analytical Account</th>
                  <th className="table-header">Budget</th>
                  <th className="table-header">Spent</th>
                  <th className="table-header">Remaining</th>
                  <th className="table-header">% Used</th>
                </tr>
              </thead>
              <tbody>
                {budgetByAccount.map((item, idx) => {
                  const percentUsed = item.budgetAmount > 0 
                    ? ((item.spentAmount / item.budgetAmount) * 100).toFixed(1) 
                    : 0;
                  return (
                    <tr key={idx} className="table-row">
                      <td className="table-cell">{item.accountName}</td>
                      <td className="table-cell">{formatCurrency(item.budgetAmount)}</td>
                      <td className="table-cell">{formatCurrency(item.spentAmount)}</td>
                      <td className="table-cell">{formatCurrency(item.remainingAmount)}</td>
                      <td className="table-cell">
                        <div className="relative w-full h-6 bg-gray-200 rounded overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${Math.min(percentUsed, 100)}%` }}
                          />
                          <span className="relative z-10 block text-center leading-6 text-xs font-medium text-gray-900">
                            {percentUsed}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Customer Invoices</h3>
          <DataTable
            data={recentInvoices}
            columns={invoiceColumns}
            searchable={false}
            pagination={false}
          />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Vendor Bills</h3>
          <DataTable
            data={pendingBills}
            columns={billColumns}
            searchable={false}
            pagination={false}
          />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Unpaid Invoices</h3>
          <DataTable
            data={unpaidInvoices}
            columns={invoiceColumns}
            searchable={false}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
