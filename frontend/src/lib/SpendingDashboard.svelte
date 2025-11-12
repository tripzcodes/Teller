<script lang="ts">
  import { transactions } from '../stores/transactionStore';
  import {
    calculateCategoryTotals,
    getTopMerchants,
    getDailySpending,
    getMonthlySpending,
    getSpendingSummary,
    detectAnomalies
  } from '../utils/analytics';
  import CategoryPieChart from './CategoryPieChart.svelte';
  import SpendingTimeline from './SpendingTimeline.svelte';
  import TopMerchantsChart from './TopMerchantsChart.svelte';
  import { TrendingDown, TrendingUp, Wallet, Receipt, AlertTriangle } from 'lucide-svelte';

  $: summary = getSpendingSummary($transactions);
  $: categoryTotals = calculateCategoryTotals($transactions);
  $: topMerchants = getTopMerchants($transactions, 10);
  $: dailySpending = getDailySpending($transactions);
  $: monthlySpending = getMonthlySpending($transactions);
  $: anomalies = detectAnomalies($transactions, 2.5);

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  function formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  }
</script>

<div class="dashboard">
  <div class="dashboard-header">
    <h2>Spending Dashboard</h2>
    {#if summary.dateRange.start && summary.dateRange.end}
      <p class="date-range">
        {formatDate(summary.dateRange.start)} - {formatDate(summary.dateRange.end)}
      </p>
    {/if}
  </div>

  <!-- Summary Cards -->
  <div class="summary-cards">
    <div class="card">
      <div class="card-icon expenses">
        <TrendingDown size={24} />
      </div>
      <div class="card-content">
        <p class="card-label">Total Expenses</p>
        <p class="card-value expenses">{formatCurrency(summary.totalExpenses)}</p>
      </div>
    </div>

    <div class="card">
      <div class="card-icon income">
        <TrendingUp size={24} />
      </div>
      <div class="card-content">
        <p class="card-label">Total Income</p>
        <p class="card-value income">{formatCurrency(summary.totalIncome)}</p>
      </div>
    </div>

    <div class="card">
      <div class="card-icon net">
        <Wallet size={24} />
      </div>
      <div class="card-content">
        <p class="card-label">Net Change</p>
        <p class="card-value" class:negative={summary.netChange < 0} class:positive={summary.netChange > 0}>
          {formatCurrency(summary.netChange)}
        </p>
      </div>
    </div>

    <div class="card">
      <div class="card-icon">
        <Receipt size={24} />
      </div>
      <div class="card-content">
        <p class="card-label">Transactions</p>
        <p class="card-value">{summary.transactionCount}</p>
      </div>
    </div>
  </div>

  <!-- Anomalies Alert -->
  {#if anomalies.length > 0}
    <div class="anomalies-alert">
      <div class="alert-header">
        <AlertTriangle size={20} />
        <h3>Unusual Transactions Detected</h3>
      </div>
      <p class="alert-description">
        Found {anomalies.length} transaction{anomalies.length > 1 ? 's' : ''} with unusually high amounts
      </p>
      <div class="anomaly-list">
        {#each anomalies.slice(0, 3) as anomaly}
          <div class="anomaly-item">
            <span class="anomaly-desc">{anomaly.description}</span>
            <span class="anomaly-amount">{formatCurrency(anomaly.amount)}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Charts Grid -->
  <div class="charts-grid">
    <!-- Spending Timeline -->
    {#if dailySpending.length > 0}
      <div class="chart-section full-width">
        <h3>Spending Over Time</h3>
        <SpendingTimeline data={dailySpending} width={1100} height={300} />
      </div>
    {/if}

    <!-- Category Breakdown -->
    {#if categoryTotals.length > 0}
      <div class="chart-section">
        <h3>Spending by Category</h3>
        <CategoryPieChart data={categoryTotals} width={450} height={400} />

        <div class="legend">
          {#each categoryTotals.slice(0, 5) as category}
            <div class="legend-item">
              <span class="legend-color" style="background-color: {import('../utils/categorizer').then(m => m.getCategoryColor(category.category))}"></span>
              <span class="legend-label">{category.category}</span>
              <span class="legend-value">{formatCurrency(category.total)}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Top Merchants -->
    {#if topMerchants.length > 0}
      <div class="chart-section">
        <h3>Top Merchants</h3>
        <TopMerchantsChart data={topMerchants} width={550} height={400} />
      </div>
    {/if}
  </div>

  <!-- Monthly Comparison -->
  {#if monthlySpending.length > 1}
    <div class="monthly-section">
      <h3>Monthly Comparison</h3>
      <div class="monthly-grid">
        {#each monthlySpending as month}
          <div class="month-card">
            <p class="month-label">{month.month}</p>
            <p class="month-expenses">{formatCurrency(month.expenses)}</p>
            <p class="month-details">
              <span class="detail-item">
                <TrendingUp size={14} /> {formatCurrency(month.income)}
              </span>
              <span class="detail-item">
                {month.transactionCount} txns
              </span>
            </p>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .dashboard {
    margin-top: 2rem;
  }

  .dashboard-header {
    margin-bottom: 2rem;
  }

  .dashboard-header h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.875rem;
    color: #111827;
    font-weight: 600;
  }

  :global(.dark) .dashboard-header h2 {
    color: #f9fafb;
  }

  .date-range {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
  }

  :global(.dark) .date-range {
    color: #9ca3af;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  :global(.dark) .card {
    background: #1f2937;
    border-color: #374151;
  }

  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    color: #6b7280;
  }

  .card-icon.expenses {
    background: #fee2e2;
    color: #dc2626;
  }

  .card-icon.income {
    background: #d1fae5;
    color: #059669;
  }

  .card-icon.net {
    background: #dbeafe;
    color: #2563eb;
  }

  :global(.dark) .card-icon {
    background: #374151;
    color: #9ca3af;
  }

  :global(.dark) .card-icon.expenses {
    background: #7f1d1d;
    color: #fca5a5;
  }

  :global(.dark) .card-icon.income {
    background: #064e3b;
    color: #6ee7b7;
  }

  :global(.dark) .card-icon.net {
    background: #1e3a8a;
    color: #93c5fd;
  }

  .card-content {
    flex: 1;
  }

  .card-label {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  :global(.dark) .card-label {
    color: #9ca3af;
  }

  .card-value {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
  }

  :global(.dark) .card-value {
    color: #f9fafb;
  }

  .card-value.expenses {
    color: #dc2626;
  }

  .card-value.income {
    color: #059669;
  }

  .card-value.negative {
    color: #dc2626;
  }

  .card-value.positive {
    color: #059669;
  }

  :global(.dark) .card-value.expenses {
    color: #fca5a5;
  }

  :global(.dark) .card-value.income {
    color: #6ee7b7;
  }

  .anomalies-alert {
    background: #fef3c7;
    border: 1px solid #fde68a;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  :global(.dark) .anomalies-alert {
    background: #78350f;
    border-color: #92400e;
  }

  .alert-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: #92400e;
  }

  :global(.dark) .alert-header {
    color: #fde68a;
  }

  .alert-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .alert-description {
    margin: 0 0 1rem 0;
    font-size: 0.875rem;
    color: #92400e;
  }

  :global(.dark) .alert-description {
    color: #fde68a;
  }

  .anomaly-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .anomaly-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    background: white;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  :global(.dark) .anomaly-item {
    background: #92400e;
  }

  .anomaly-desc {
    color: #374151;
    flex: 1;
  }

  :global(.dark) .anomaly-desc {
    color: #fef3c7;
  }

  .anomaly-amount {
    font-weight: 600;
    color: #dc2626;
  }

  :global(.dark) .anomaly-amount {
    color: #fca5a5;
  }

  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .chart-section {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
  }

  .chart-section.full-width {
    grid-column: 1 / -1;
  }

  :global(.dark) .chart-section {
    background: #1f2937;
    border-color: #374151;
  }

  .chart-section h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }

  :global(.dark) .chart-section h3 {
    color: #f9fafb;
  }

  .legend {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
  }

  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
  }

  .legend-label {
    flex: 1;
    color: #374151;
  }

  :global(.dark) .legend-label {
    color: #d1d5db;
  }

  .legend-value {
    font-weight: 600;
    color: #111827;
  }

  :global(.dark) .legend-value {
    color: #f9fafb;
  }

  .monthly-section {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
  }

  :global(.dark) .monthly-section {
    background: #1f2937;
    border-color: #374151;
  }

  .monthly-section h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }

  :global(.dark) .monthly-section h3 {
    color: #f9fafb;
  }

  .monthly-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }

  .month-card {
    background: #f9fafb;
    border-radius: 6px;
    padding: 1rem;
  }

  :global(.dark) .month-card {
    background: #111827;
  }

  .month-label {
    margin: 0 0 0.5rem 0;
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    font-weight: 600;
  }

  :global(.dark) .month-label {
    color: #9ca3af;
  }

  .month-expenses {
    margin: 0 0 0.75rem 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }

  :global(.dark) .month-expenses {
    color: #f9fafb;
  }

  .month-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: #6b7280;
  }

  :global(.dark) .month-details {
    color: #9ca3af;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  /* Mobile responsive styles */
  @media (max-width: 640px) {
    .summary-cards {
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .summary-card {
      padding: 1.25rem;
    }

    .summary-card h3 {
      font-size: 0.8125rem;
    }

    .summary-value {
      font-size: 1.75rem;
    }

    .charts-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .chart-section {
      padding: 1.25rem;
    }

    .chart-section h3 {
      font-size: 1rem;
      margin-bottom: 1rem;
    }

    .legend {
      margin-top: 1rem;
      gap: 0.5rem;
    }

    .legend-item {
      font-size: 0.8125rem;
    }

    .monthly-section {
      padding: 1.25rem;
    }

    .monthly-section h3 {
      font-size: 1rem;
      margin-bottom: 1rem;
    }

    .monthly-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .month-card {
      padding: 0.875rem;
    }

    .month-expenses {
      font-size: 1.125rem;
    }
  }

  @media (max-width: 768px) {
    .charts-grid {
      grid-template-columns: 1fr;
      gap: 1.75rem;
    }

    .summary-cards {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
    }

    .monthly-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
  }
</style>
