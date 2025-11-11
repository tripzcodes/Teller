<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';
  import type { CategoryTotal } from '../utils/analytics';
  import { getCategoryColor } from '../utils/categorizer';

  export let data: CategoryTotal[] = [];
  export let width: number = 400;
  export let height: number = 400;

  let svgElement: SVGSVGElement;
  let tooltipVisible = false;
  let tooltipContent = '';
  let tooltipX = 0;
  let tooltipY = 0;

  function renderChart() {
    if (!svgElement || data.length === 0) return;

    // Clear previous chart
    d3.select(svgElement).selectAll('*').remove();

    const radius = Math.min(width, height) / 2;
    const svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create pie layout
    const pie = d3.pie<CategoryTotal>()
      .value(d => d.total)
      .sort(null);

    // Create arc generator
    const arc = d3.arc<d3.PieArcDatum<CategoryTotal>>()
      .innerRadius(radius * 0.5) // Donut chart
      .outerRadius(radius * 0.8);

    const hoverArc = d3.arc<d3.PieArcDatum<CategoryTotal>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.85);

    // Create arcs
    const arcs = g.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // Add paths
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => getCategoryColor(d.data.category))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', hoverArc);

        const total = d.data.total;
        const percentage = d.data.percentage;
        tooltipContent = `${d.data.category}\n$${total.toFixed(2)} (${percentage.toFixed(1)}%)`;
        tooltipX = event.pageX;
        tooltipY = event.pageY;
        tooltipVisible = true;
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc);

        tooltipVisible = false;
      });

    // Add center text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '1.5rem')
      .style('font-weight', '600')
      .style('fill', 'currentColor')
      .text(() => {
        const total = data.reduce((sum, cat) => sum + cat.total, 0);
        return `$${total.toLocaleString()}`;
      });

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '0.875rem')
      .style('fill', 'currentColor')
      .style('opacity', '0.7')
      .text('Total Spending');
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
    display: flex;
    justify-content: center;
    align-items: center;
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
