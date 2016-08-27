d3.select("svg").selectAll("rect").data([15, 50, 22, 8, 100, 10]).enter().append("rect").attr("width", 10).attr("height", function (d) {
    return d
}).style("fill", "blue").style("stroke", "red").style("stroke-width", "1px").style("opacity", .25).attr("x", function (d, i) {
    return i * 10
}).attr("y", function (d) {
    return 100 - d
})