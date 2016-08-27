
var pieChart = d3.pie();
var yourPie = pieChart([1, 1, 2]);

var newArc = d3.svg.arc();
newArc.outerRadius(100);

d3.select("svg").append("g").attr("transform", "translate(250,250)").selectAll("path").data(yourPie).enter().append("path").attr("d", newArc).style("fill", "blue").style("opacity", .5).style("stroke", "black").style("stroke-width", "2px")