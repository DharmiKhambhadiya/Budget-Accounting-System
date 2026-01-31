import { useMemo } from 'react';
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
import './Reports.css';

const Reports = () => {
  const budgets = getBudgets();
  const vendorBills = getVendorBills();
  const customerInvoices = getCustomerInvoices();
  const analyticalAccounts = getAnalyticalAccounts();

  const budgetVsActual = useMemo(() => {
    return analyticalAccounts.map(account => {
      const accountBudgets = budgets.filter(b => b.analyticalAccountId === account.id);
      const budgetAmount = accountBudgets.reduce((sum, b) => sum + b.amount, 0);
      const spentAmount = accountBudgets.reduce((sum, b) => sum + b.spentAmount, 0);
      const remainingAmount = budgetAmount - spentAmount;
      const variance = budgetAmount - spentAmount;
      const variancePercent = budgetAmount > 0 ? ((variance / budgetAmount) * 100).toFixed(1) : 0;
      const isOverBudget = spentAmount > budgetAmount;

      return {
        accountName: account.name,
        budgetAmount,
        spentAmount,
        remainingAmount,
        variance,
        variancePercent,
        isOverBudget
      };
    }).filter(item => item.budgetAmount > 0);
  }, [budgets, analyticalAccounts]);

  const overBudgetAlerts = useMemo(() => {
    return budgetVsActual
      .filter(item => item.isOverBudget)
      .map(item => ({
        accountName: item.accountName,
        budgetAmount: item.budgetAmount,
        spentAmount: item.spentAmount,
        overAmount: item.spentAmount - item.budgetAmount,
        overPercent: ((item.spentAmount / item.budgetAmount - 1) * 100).toFixed(1)
      }));
  }, [budgetVsActual]);

  const paymentAging = useMemo(() => {
    const today = new Date();
    const agingBills = vendorBills
      .filter(b => b.status !== 'Paid')
      .map(bill => {
        const dueDate = new Date(bill.dueDate);
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        return {
          billNumber: bill.billNumber,
          billDate: bill.billDate,
          dueDate: bill.dueDate,
          totalAmount: bill.totalAmount,
          remainingAmount: bill.remainingAmount,
          daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
          agingBucket: daysOverdue <= 0 ? 'Not Due' :
                      daysOverdue <= 30 ? '0-30 Days' :
                      daysOverdue <= 60 ? '31-60 Days' :
                      daysOverdue <= 90 ? '61-90 Days' : '90+ Days'
        };
      })
      .sort((a, b) => b.daysOverdue - a.daysOverdue);

    const agingInvoices = customerInvoices
      .filter(i => i.status !== 'Paid')
      .map(invoice => {
        const dueDate = new Date(invoice.dueDate);
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        return {
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: invoice.invoiceDate,
          dueDate: invoice.dueDate,
          totalAmount: invoice.totalAmount,
          remainingAmount: invoice.remainingAmount,
          daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
          agingBucket: daysOverdue <= 0 ? 'Not Due' :
                      daysOverdue <= 30 ? '0-30 Days' :
                      daysOverdue <= 60 ? '31-60 Days' :
                      daysOverdue <= 90 ? '61-90 Days' : '90+ Days'
        };
      })
      .sort((a, b) => b.daysOverdue - a.daysOverdue);

    return { bills: agingBills, invoices: agingInvoices };
  }, [vendorBills, customerInvoices]);

  const budgetColumns = [
    { key: 'accountName', header: 'Analytical Account', width: '25%' },
    {
      key: 'budgetAmount',
      header: 'Budget',
      type: 'currency',
      width: '15%'
    },
    {
      key: 'spentAmount',
      header: 'Actual Spent',
      type: 'currency',
      width: '15%'
    },
    {
      key: 'remainingAmount',
      header: 'Remaining',
      type: 'currency',
      width: '15%'
    },
    {
      key: 'variance',
      header: 'Variance',
      type: 'currency',
      width: '15%',
      render: (row) => {
        const color = row.isOverBudget ? '#dc3545' : '#28a745';
        return <span style={{ color }}>{formatCurrency(row.variance)}</span>;
      }
    },
    {
      key: 'variancePercent',
      header: 'Variance %',
      width: '15%',
      render: (row) => {
        const color = row.isOverBudget ? '#dc3545' : '#28a745';
        return <span style={{ color }}>{row.variancePercent}%</span>;
      }
    }
  ];

  const overBudgetColumns = [
    { key: 'accountName', header: 'Analytical Account', width: '25%' },
    {
      key: 'budgetAmount',
      header: 'Budget',
      type: 'currency',
      width: '18%'
    },
    {
      key: 'spentAmount',
      header: 'Spent',
      type: 'currency',
      width: '18%'
    },
    {
      key: 'overAmount',
      header: 'Over Budget',
      type: 'currency',
      width: '18%',
      render: (row) => <span style={{ color: '#dc3545' }}>{formatCurrency(row.overAmount)}</span>
    },
    {
      key: 'overPercent',
      header: 'Over %',
      width: '21%',
      render: (row) => <span style={{ color: '#dc3545' }}>{row.overPercent}%</span>
    }
  ];

  const agingColumns = [
    { key: 'billNumber', header: 'Bill/Invoice #', width: '15%' },
    {
      key: 'dueDate',
      header: 'Due Date',
      type: 'date',
      width: '12%'
    },
    {
      key: 'daysOverdue',
      header: 'Days Overdue',
      width: '12%',
      render: (row) => row.daysOverdue > 0 ? <span style={{ color: '#dc3545' }}>{row.daysOverdue}</span> : '0'
    },
    {
      key: 'agingBucket',
      header: 'Aging Bucket',
      width: '15%'
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      type: 'currency',
      width: '18%'
    },
    {
      key: 'remainingAmount',
      header: 'Remaining',
      type: 'currency',
      width: '18%'
    }
  ];

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1 className="reports-title">Reports</h1>
        <p className="reports-subtitle">Budget analysis and payment aging reports</p>
      </div>

      <div className="reports-section">
        <h2 className="report-section-title">Budget vs Actual by Analytical Account</h2>
        <DataTable
          data={budgetVsActual}
          columns={budgetColumns}
          searchable={true}
        />
      </div>

      {overBudgetAlerts.length > 0 && (
        <div className="reports-section">
          <h2 className="report-section-title">Over-Budget Alerts</h2>
          <div className="alert-banner">
            ⚠️ {overBudgetAlerts.length} analytical account(s) have exceeded their budget
          </div>
          <DataTable
            data={overBudgetAlerts}
            columns={overBudgetColumns}
            searchable={true}
          />
        </div>
      )}

      <div className="reports-section">
        <h2 className="report-section-title">Payment Aging Report - Vendor Bills</h2>
        <DataTable
          data={paymentAging.bills}
          columns={agingColumns}
          searchable={true}
        />
      </div>

      <div className="reports-section">
        <h2 className="report-section-title">Payment Aging Report - Customer Invoices</h2>
        <DataTable
          data={paymentAging.invoices}
          columns={agingColumns}
          searchable={true}
        />
      </div>
    </div>
  );
};

export default Reports;
