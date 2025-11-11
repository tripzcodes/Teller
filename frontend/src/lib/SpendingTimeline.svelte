<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';
  import type { DailySpending } from '../utils/analytics';

  export let data: DailySpending[] = [];
  export let width: number = 800;
  export let height: number = 300;

  let svgElement: SVGSVGElement;
  let tooltipVisible = false;
  let tooltipContent = '';
  let tooltipX = 0;
  let tooltipY = 0;

  function renderChart() {
    if (!svgElement || data.length === 0) return;

    // Clear previous chart
    d3.select(svgElement).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Parse dates
    const parseDate = d3.timeParse('%Y-%m-%d');
    const parsedData = data.map(d => ({
      ...d,
      parsedDate: parseDate(d.date) || new Date()
    }));

    // X scale - time
    const x = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.parsedDate) as [Date, Date])
      .range([0, chartWidth]);

    // Y scale - amount (account for both expenses and income)
    const maxExpenses = d3.max(parsedData, d => d.expenses) || 0;
    const maxIncome = d3.max(parsedData, d => d.income) || 0;
    const maxValue = Math.max(maxExpenses, maxIncome);
    const y = d3.scaleLinear()
      .domain([0, maxValue * 1.1])
      .range([chartHeight, 0]);

    // Line generators
    const expensesLine = d3.line<typeof parsedData[0]>()
      .x(d => x(d.parsedDate))
      .y(d => y(d.expenses))
      .curve(d3.curveMonotoneX);

    const incomeLine = d3.line<typeof parsedData[0]>()
      .x(d => x(d.parsedDate))
      .y(d => y(d.income))
      .curve(d3.curveMonotoneX);

    // Add axes
    const xAxis = g.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(x).ticks(6));

    xAxis.selectAll('text')
      .style('fill', 'currentColor');

    xAxis.selectAll('line, path')
      .style('stroke', 'currentColor')
      .style('opacity', '0.3');

    const yAxis = g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${d}`));

    yAxis.selectAll('text')
      .style('fill', 'currentColor');

    yAxis.selectAll('line, path')
      .style('stroke', 'currentColor')
      .style('opacity', '0.3');

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).ticks(5).tickSize(-chartWidth).tickFormat(() => ''))
      .style('stroke', 'currentColor')
      .style('stroke-opacity', '0.1')
      .select('.domain')
      .remove();

    // Add area for expenses
    const area = d3.area<typeof parsedData[0]>()
      .x(d => x(d.parsedDate))
      .y0(chartHeight)
      .y1(d => y(d.expenses))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(parsedData)
      .attr('fill', '#ef4444')
      .attr('fill-opacity', 0.1)
      .attr('d', area);

    // Add expenses line
    g.append('path')
      .datum(parsedData)
      .attr('fill', 'none')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2.5)
      .attr('d', expensesLine);

    // Add income line (if any)
    if (parsedData.some(d => d.income > 0)) {
      g.append('path')
        .datum(parsedData)
        .attr('fill', 'none')
        .attr('stroke', '#22c55e')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '5,5')
        .attr('d', incomeLine);
    }

    // Add interactive dots
    g.selectAll('.dot')
      .data(parsedData)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.parsedDate))
      .attr('cy', d => y(d.expenses))
      .attr('r', 4)
      .attr('fill', '#ef4444')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 6);

        tooltipContent = `Date: ${d.date}\nExpenses: $${d.expenses.toFixed(2)}\nIncome: $${d.income.toFixed(2)}\nBalance: $${d.balance.toFixed(2)}`;
        tooltipX = event.pageX;
        tooltipY = event.pageY;
        tooltipVisible = true;
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 4);
        tooltipVisible = false;
      });
  }

  onMount(() => {
    renderChart();
  });

  afterUpdate(() => {
    renderChart();
  });
</script>

<div class="chart-container">
  <svg bind:this={svgElement}></svg>

  {#if tooltipVisible}
    <div
      class="tooltip"
      style="left: {tooltipX + 10}px; top: {tooltipY + 10}px;"
    >
      {tooltipContent}
    </div>
  {/if}
</div>

<style>
  .chart-container {
    position: relative;
    width: 100%;
  }

  svg {
    overflow: visible;
  }

  :global(.dark) svg text {
    fill: #f9fafb;
  }

  .tooltip {
    position: fixed;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    pointer-events: none;
    white-space: pre-line;
    z-index: 1000;
    line-height: 1.4;
  }

  :global(.dark) .tooltip {
    background: rgba(255, 255, 255, 0.9);
    color: #111827;
  }
</style>
