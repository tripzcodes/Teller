<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';
  import type { MerchantTotal } from '../utils/analytics';
  import { getCategoryColor } from '../utils/categorizer';

  export let data: MerchantTotal[] = [];
  export let width: number = 800;
  export let height: number = 400;

  let svgElement: SVGSVGElement;

  function renderChart() {
    if (!svgElement || data.length === 0) return;

    // Clear previous chart
    d3.select(svgElement).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 100, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // X scale - merchants
    const x = d3.scaleBand()
      .domain(data.map(d => d.merchant))
      .range([0, chartWidth])
      .padding(0.2);

    // Y scale - amounts
    const maxAmount = d3.max(data, d => d.total) || 0;
    const y = d3.scaleLinear()
      .domain([0, maxAmount * 1.1])
      .range([chartHeight, 0]);

    // Add axes
    const xAxis = g.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(x));

    xAxis.selectAll('text')
      .style('fill', 'currentColor')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

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

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.merchant) || 0)
      .attr('y', d => y(d.total))
      .attr('width', x.bandwidth())
      .attr('height', d => chartHeight - y(d.total))
      .attr('fill', d => getCategoryColor(d.category))
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this).attr('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.8);
      });

    // Add value labels on bars
    g.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => (x(d.merchant) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.total) - 5)
      .attr('text-anchor', 'middle')
      .style('fill', 'currentColor')
      .style('font-size', '0.75rem')
      .style('font-weight', '600')
      .text(d => `$${d.total.toFixed(0)}`);
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
</style>
