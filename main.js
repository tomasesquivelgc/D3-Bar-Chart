import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Declare the chart dimensions and margins.
const width = 800;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;


// Create the SVG container.
const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height);

var tooltip = d3
  .select('.visHolder')
  .append('div')
  .attr('id', 'tooltip');

  function onMouseMove(event) {
    // Get mouse coordinates relative to the page
    const x = event.clientX;
    const y = event.clientY;
    const dataDate = event.target.getAttribute('data-date');
    const dataGDP = event.target.getAttribute('data-gdp');
  
    // Use the x and y coordinates to position the tooltip
    tooltip.style('left', x-170+"px") // Adjust the offset as needed
           .style('top', y-10+"px") // Adjust the offset as needed
           .style('opacity', 1)
           .attr('data-date', dataDate)
           .html(`Date: ${dataDate}<br>GDP: $${dataGDP} Billion`);
  }
      
// Function to hide the tooltip on mouseout
function onMouseOut() {
    tooltip.style('opacity', 0);
}

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(data => {
    const dataset = data.data;
    const minX = d3.min(dataset, d => d[0]);
    const maxX = d3.max(dataset, d => d[0]);
    const minY = d3.min(dataset, d => d[1]);
    const maxY = d3.max(dataset, d => d[1]);
    console.log(minX, maxX, minY, maxY);

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -200)
      .attr('y', 80)
      .text('Gross Domestic Product');

    svg
      .append('text')
      .attr('x', width / 2 -50)
      .attr('y', height)
      .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
      .attr('class', 'info');

    // Declare the x (horizontal position) scale.
    const x = d3.scaleTime()
        .domain([new Date(minX), new Date(maxX)])
        .range([marginLeft, width - marginRight]);

        // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([0, maxY])
        .range([height - marginBottom, marginTop]);

    // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .attr("id", "x-axis")
        .call(d3.axisBottom(x));

    // Add the y-axis.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .attr("id", "y-axis")
        .call(d3.axisLeft(y));

    // Add the bars.
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .attr("x", d => x(new Date(d[0])))
        .attr("y", d => y(d[1]))
        .attr("width", 3)
        .attr("height", d => height - marginBottom - y(d[1]))
        .attr("fill", "navy")
        .on("mouseover", onMouseMove)
        .on("mouseout", onMouseOut);

    // Append the SVG element.
    container.append(svg.node());
  })
  .catch(error => {
    console.error("Error fetching data:", error);
});