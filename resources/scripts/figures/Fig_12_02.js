
d3.select("#vizcontainer").append("div").attr("id", "touchStatus").append("p").append("ol");

d3.select("svg").on("touchstart", touchStatus);
d3.select("svg").on("touchmove", touchStatus);

var touchColor = d3.scaleLinear().domain([0, 10]).range([ "pink", "darkred"])

function touchStatus() {
    d3.event.preventDefault();
    d3.event.stopPropagation();
    d = d3.touches(this);
    d3.select("svg").selectAll("circle").data(d).enter().append("circle").attr("r", 75).style("fill", function (d, i) {
        return touchColor(i)
    });
    
    d3.select("svg").selectAll("circle").data(d).exit().remove();
    
    d3.select("svg").selectAll("circle").attr("cx", function (d) {
        return d[0]
    }).attr("cy", function (d) {
        return d[1]
    });
}