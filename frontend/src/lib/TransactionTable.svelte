<script lang="ts">
  import { transactions, updateTransactionCategory } from '../stores/transactionStore';
  import type { Transaction } from '../stores/transactionStore';
  import { getCategoryColor, getAllCategories } from '../utils/categorizer';
  import { ChevronDown } from 'lucide-svelte';

  let sortColumn: keyof Transaction = 'date';
  let sortDirection: 'asc' | 'desc' = 'desc';
  let editingCategoryIndex: number | null = null;

  const allCategories = getAllCategories();

  $: sortedTransactions = [...$transactions].sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal);
    const bStr = String(bVal);
    return sortDirection === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  function handleSort(column: keyof Transaction) {
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'desc';
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  }

  function formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  function handleCategoryChange(index: number, newCategory: string) {
    updateTransactionCategory(index, newCategory);
    editingCategoryIndex = null;
  }

  function toggleCategoryEdit(index: number) {
    editingCategoryIndex = editingCategoryIndex === index ? null : index;
  }
</script>

<div class="table-container">
  <div class="table-header">
    <h2>Transactions</h2>
    <div class="stats">
      <span class="stat">
        <strong>{$transactions.length}</strong> transactions
      </span>
    </div>
  </div>

  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th on:click={() => handleSort('date')} class:active={sortColumn === 'date'}>
            Date
            {#if sortColumn === 'date'}
              <span class="sort-arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>
            {/if}
          </th>
          <th on:click={() => handleSort('description')} class:active={sortColumn === 'description'}>
            Description
            {#if sortColumn === 'description'}
              <span class="sort-arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>
            {/if}
          </th>
          <th on:click={() => handleSort('category')} class:active={sortColumn === 'category'}>
            Category
            {#if sortColumn === 'category'}
              <span class="sort-arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>
            {/if}
          </th>
          <th on:click={() => handleSort('type')} class:active={sortColumn === 'type'}>
            Type
            {#if sortColumn === 'type'}
              <span class="sort-arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>
            {/if}
          </th>
          <th on:click={() => handleSort('amount')} class:active={sortColumn === 'amount'} class="amount">
            Amount
            {#if sortColumn === 'amount'}
              <span class="sort-arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>
            {/if}
          </th>
          <th on:click={() => handleSort('balance')} class:active={sortColumn === 'balance'} class="amount">
            Balance
            {#if sortColumn === 'balance'}
              <span class="sort-arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>
            {/if}
          </th>
        </tr>
      </thead>
      <tbody>
        {#each sortedTransactions as transaction, index}
          <tr>
            <td class="date">{formatDate(transaction.date)}</td>
            <td class="description">{transaction.description}</td>
            <td class="category-cell">
              {#if editingCategoryIndex === index}
                <div class="category-dropdown">
                  <select
                    class="category-select"
                    value={transaction.category}
                    on:change={(e) => handleCategoryChange(index, e.currentTarget.value)}
                    on:blur={() => editingCategoryIndex = null}
                    autofocus
                  >
                    {#each allCategories as category}
                      <option value={category}>{category}</option>
                    {/each}
                  </select>
                </div>
              {:else}
                <button
                  class="category-badge-button"
                  on:click={() => toggleCategoryEdit(index)}
                  title="Click to edit category"
                >
                  <span class="category-badge" style="background-color: {getCategoryColor(transaction.category)};">
                    {transaction.category}
                  </span>
                  <span class="edit-icon">
                    <ChevronDown size={14} />
                  </span>
                </button>
              {/if}
            </td>
            <td>
              <span class="badge badge-{transaction.type}">
                {transaction.type}
              </span>
            </td>
            <td class="amount {transaction.type}">
              {#if transaction.type === 'credit'}
                +{formatCurrency(transaction.amount)}
              {:else}
                -{formatCurrency(transaction.amount)}
              {/if}
            </td>
            <td class="amount">{formatCurrency(transaction.balance)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .table-container {
    margin-top: 2rem;
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  h2 {
    margin: 0;
    color: #111827;
    font-size: 1.5rem;
  }

  :global(.dark) h2 {
    color: #f9fafb;
  }

  .stats {
    color: #7f8c8d;
    font-size: 0.9rem;
  }

  .table-wrapper {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
  }

  thead {
    background: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
  }

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #495057;
    cursor: pointer;
    user-select: none;
    transition: background 0.2s;
  }

  th:hover {
    background: #e9ecef;
  }

  th.active {
    color: #3498db;
  }

  th.amount {
    text-align: right;
  }

  .sort-arrow {
    margin-left: 0.25rem;
    font-size: 0.8rem;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  tbody tr:hover {
    background: #f8f9fa;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .date {
    color: #495057;
    font-variant-numeric: tabular-nums;
  }

  .description {
    color: #2c3e50;
    font-weight: 500;
  }

  .amount {
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }

  .amount.credit {
    color: #27ae60;
  }

  .amount.debit {
    color: #e74c3c;
  }

  .badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .badge-credit {
    background: #d4edda;
    color: #155724;
  }

  .badge-debit {
    background: #f8d7da;
    color: #721c24;
  }

  .category-cell {
    position: relative;
  }

  .category-badge-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    transition: opacity 0.2s;
  }

  .category-badge-button:hover {
    opacity: 0.8;
  }

  .category-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
    white-space: nowrap;
  }

  .edit-icon {
    color: #6b7280;
    display: inline-flex;
    align-items: center;
  }

  :global(.dark) .edit-icon {
    color: #9ca3af;
  }

  .category-select {
    padding: 0.375rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    background: white;
    color: #111827;
    cursor: pointer;
    min-width: 150px;
  }

  .category-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  :global(.dark) .category-select {
    background: #1f2937;
    color: #f9fafb;
    border-color: #374151;
  }

  :global(.dark) .category-select:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
  }

  /* Dark mode support */
  :global(.dark) .table-wrapper {
    border-color: #374151;
  }

  :global(.dark) table {
    background: #1f2937;
  }

  :global(.dark) thead {
    background: #111827;
    border-bottom-color: #374151;
  }

  :global(.dark) th {
    color: #d1d5db;
  }

  :global(.dark) th:hover {
    background: #1f2937;
  }

  :global(.dark) th.active {
    color: #60a5fa;
  }

  :global(.dark) td {
    border-bottom-color: #374151;
  }

  :global(.dark) tbody tr:hover {
    background: #111827;
  }

  :global(.dark) .date {
    color: #9ca3af;
  }

  :global(.dark) .description {
    color: #f9fafb;
  }

  :global(.dark) .stats {
    color: #9ca3af;
  }

  :global(.dark) .amount.credit {
    color: #34d399;
  }

  :global(.dark) .amount.debit {
    color: #f87171;
  }
</style>
