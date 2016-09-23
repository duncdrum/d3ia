sampleData = d3.range(3000).map(function (d) {
    var datapoint = {
    };
    datapoint.id = "Sample Node " + d; datapoint.x = Math.random() * 500; datapoint.y = Math.random() * 500; return datapoint;
}) 
d3.select("svg").selectAll("circle").data(sampleData).enter().append("circle").attr("r", 3).attr("cx", function (d) {
    return d.x
}).attr("cy", function (d) {
    return d.y
}).style("fill", "pink").style("stroke", "black").style("stroke-width", "1px") 
var brush = d3.svg.brush().x(d3.scale.identity().domain([0, 500])).y(d3.scale.identity().domain([0, 500])).on("brush", brushed);
d3.select("svg").call(brush);
function brushed() {
    var e = brush.extent();
    d3.selectAll("circle").style("fill", function (d) {
        if (d.x >= e[0][0] && d.x <= e[1][0] && d.y >= e[0][1] && d.y <= e[1][1]) {
            return "darkred";
        } else {
            return "pink";
        }
    })
}