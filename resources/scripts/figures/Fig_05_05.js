var data = [1, 1, 2];

var pieChart = d3.pie();
var yourPie = pieChart(data);

var newArc = d3.arc()
    .outerRadius(100)
    .innerRadius(0); /*This has to be defined now*/

d3.select("svg")
    .append("g")
    .attr("transform", "translate(250,250)")
    .selectAll("path")
    .data(yourPie)
    .enter()
    .append("path")
    .attr("d", newArc)
    .style("fill", "blue")
    .style("opacity", .5)
    .style("stroke", "black")
    .style("stroke-width", "2px")