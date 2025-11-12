<script lang="ts">
  import { onMount, afterUpdate, onDestroy } from 'svelte';
  import * as d3 from 'd3';
  import type { MerchantTotal } from '../utils/analytics';
  import { getCategoryColor } from '../utils/categorizer';

  export let data: MerchantTotal[] = [];
  export let width: number = 800;
  export let height: number = 400;

  let containerElement: HTMLDivElement;
  let svgElement: SVGSVGElement;
  let resizeObserver: ResizeObserver;

  function updateDimensions() {
    if (containerElement) {
      const containerWidth = containerElement.clientWidth;
      width = containerWidth;
      // Adjust height for mobile
      if (containerWidth < 640) {
        height = 350;
      } else if (containerWidth < 768) {
        height = 380;
      } else {
        height = 400;
      }
      renderChart();
    }
  }

  function renderChart() {
    if (!svgElement || data.length === 0) return;

    // Clear previous chart
    d3.select(svgElement).selectAll('*').remove();

    // Responsive margins
    const isMobile = width < 640;
    const margin = isMobile
      ? { top: 20, right: 10, bottom: 120, left: 50 }
      : { top: 20, right: 30, bottom: 100, left: 60 };
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
      .style('font-size', isMobile ? '0.7rem' : '0.875rem')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    xAxis.selectAll('line, path')
      .style('stroke', 'currentColor')
      .style('opacity', '0.3');

    const yTicks = isMobile ? 4 : 5;
    const yAxis = g.append('g')
      .call(d3.axisLeft(y).ticks(yTicks).tickFormat(d => `$${d}`));

    yAxis.selectAll('text')
      .style('fill', 'currentColor')
      .style('font-size', isMobile ? '0.75rem' : '0.875rem');

    yAxis.selectAll('line, path')
      .style('stroke', 'currentColor')
      .style('opacity', '0.3');

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).ticks(yTicks).tickSize(-chartWidth).tickFormat(() => ''))
      .style('stroke', 'currentColor')
      .style('stroke-opacity', '0.1')
      .select('.domain')
      .remove();

    // Add bars with touch support
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
      })
      .on('touchstart', function(event) {
        event.preventDefault();
        d3.select(this).attr('opacity', 1);
      })
      .on('touchend', function() {
        d3.select(this).attr('opacity', 0.8);
      });

    // Add value labels on bars
    const labelFontSize = isMobile ? '0.7rem' : '0.75rem';
    g.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => (x(d.merchant) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.total) - 5)
      .attr('text-anchor', 'middle')
      .style('fill', 'currentColor')
      .style('font-size', labelFontSize)
      .style('font-weight', '600')
      .text(d => `$${d.total.toFixed(0)}`);
  }

  onMount(() => {
    updateDimensions();

    // Set up ResizeObserver for responsive sizing
    resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerElement) {
      resizeObserver.observe(containerElement);
    }
  });

  afterUpdate(() => {
    renderChart();
  });

  onDestroy(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });
</script>

<div class="chart-container" bind:this={containerElement}>
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
