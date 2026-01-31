import { useMemo } from 'react';
import SummaryCard from '../components/SummaryCard';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import {
  getBudgets,
  getVendorBills,
  getCustomerInvoices,
  getAnalyticalAccounts,
  formatCurrency,
  formatDate
} from '../utils/dataLoader';
import './Dashboard.css';

const Dashboard = () => {
  const budgets = getBudgets();
  const vendorBills = getVendorBills();
  const customerInvoices = getCustomerInvoices();
  const analyticalAccounts = getAnalyticalAccounts();

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
      const accountBudgets = budgets.filter(b => b.analyticalAccountId === account.id);
      const budgetAmount = accountBudgets.reduce((sum, b) => sum + b.amount, 0);
      const spentAmount = accountBudgets.reduce((sum, b) => sum + b.spentAmount, 0);
      
      return {
        accountName: account.name,
        budgetAmount,
        spentAmount,
        remainingAmount: budgetAmount - spentAmount
      };
    }).filter(item => item.budgetAmount > 0);
  }, [budgets, analyticalAccounts]);

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
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Budget Accounting System Overview</p>
      </div>

      <div className="dashboard-kpis">
        <SummaryCard
          title="Total Budget"
          value={formatCurrency(kpis.totalBudget)}
          subtitle="All active budgets"
        />
        <SummaryCard
          title="Actual Spent"
          value={formatCurrency(kpis.actualSpent)}
          subtitle="Total vendor bills"
          trend="up"
          trendValue={`${((kpis.actualSpent / kpis.totalBudget) * 100).toFixed(1)}%`}
        />
        <SummaryCard
          title="Remaining Budget"
          value={formatCurrency(kpis.remainingBudget)}
          subtitle="Available balance"
        />
        <SummaryCard
          title="Budget Utilization"
          value={`${kpis.utilization}%`}
          subtitle="Spent vs Budget"
        />
      </div>

      <div className="dashboard-charts">
        <div className="dashboard-chart-card">
          <h3 className="chart-title">Budget vs Actual by Analytical Account</h3>
          <div className="chart-placeholder">
            <table className="budget-chart-table">
              <thead>
                <tr>
                  <th>Analytical Account</th>
                  <th>Budget</th>
                  <th>Spent</th>
                  <th>Remaining</th>
                  <th>% Used</th>
                </tr>
              </thead>
              <tbody>
                {budgetByAccount.map((item, idx) => {
                  const percentUsed = item.budgetAmount > 0 
                    ? ((item.spentAmount / item.budgetAmount) * 100).toFixed(1) 
                    : 0;
                  return (
                    <tr key={idx}>
                      <td>{item.accountName}</td>
                      <td>{formatCurrency(item.budgetAmount)}</td>
                      <td>{formatCurrency(item.spentAmount)}</td>
                      <td>{formatCurrency(item.remainingAmount)}</td>
                      <td>
                        <div className="progress-bar-container">
                          <div 
                            className="progress-bar"
                            style={{ width: `${Math.min(percentUsed, 100)}%` }}
                          />
                          <span className="progress-text">{percentUsed}%</span>
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

      <div className="dashboard-tables">
        <div className="dashboard-table-card">
          <h3 className="table-card-title">Recent Customer Invoices</h3>
          <DataTable
            data={recentInvoices}
            columns={invoiceColumns}
            searchable={false}
            pagination={false}
          />
        </div>

        <div className="dashboard-table-card">
          <h3 className="table-card-title">Pending Vendor Bills</h3>
          <DataTable
            data={pendingBills}
            columns={billColumns}
            searchable={false}
            pagination={false}
          />
        </div>

        <div className="dashboard-table-card">
          <h3 className="table-card-title">Unpaid Invoices</h3>
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
