var yScale = d3.scale.linear().domain([0, 100, 1000, 24500]).range([0, 50, 75, 100]);
d3.select("svg").selectAll("rect").data([14, 68, 24500, 430, 19, 1000, 5555]).enter().append("rect").attr("width", 10).attr("height", function (d) {
    return yScale(d)
}).style("fill", "blue").style("stroke", "red").style("stroke-width", "1px").style("opacity", .25).attr("x", function (d, i) {
    return i * 10
}).attr("y", function (d) {
    return 100 - yScale(d)
});