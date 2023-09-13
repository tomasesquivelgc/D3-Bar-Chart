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
  .attr('id', 'tooltip')
  .style('opacity', 0);

  function onMouseMove(event) {
    // Get mouse coordinates relative to the page
    const x = event.clientX;
    const y = event.clientY;
  
    // Use the x and y coordinates to position the tooltip
    tooltip.style('left', `${x + 10}px`) // Adjust the offset as needed
           .style('top', `${y + 10}px`); // Adjust the offset as needed
  }
      
// Function to hide the tooltip on mouseout
function onMouseOut() {
    tooltip.transition().duration(200).style('opacity', 0);
}

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(data => {
    const dataset = data.data;
    const minX = d3.min(dataset, d => d[0]);
    const maxX = d3.max(dataset, d => d[0]);
    const minY = d3.min(dataset, d => d[1]);
    const maxY = d3.max(dataset, d => d[1]);
    console.log(minX, maxX, minY, maxY);

    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc()
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
        .attr("width", 5)
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