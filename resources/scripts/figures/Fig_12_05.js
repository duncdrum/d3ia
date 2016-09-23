var initialLength = 0;
var initialScale = 1;
d3.select("svg").on("touchstart", touchBegin);
d3.select("svg").on("touchmove", touchStatus);
var touchColor = d3.scale.linear().domain([0, 10]).range([ "pink", "darkred"]) 
var graphicsG = d3.select("svg").append("g").attr("id", "graphics").attr("transform", "scale(1)");
graphicsG.append("rect").attr("width", 250).attr("height", 50).attr("x", 50).attr("y", 50).style("fill", "red").style("stroke", "gray").style("stroke-width", "1px");
graphicsG.append("rect").attr("width", 100).attr("height", 400).attr("x", 350).attr("cy", 400).style("fill", "gray").style("stroke", "black").style("stroke-width", "1px");
function touchBegin() {
    d3.event.preventDefault();
    d3.event.stopPropagation();
    d = d3.touches(this);
    if (d.length == 2) {
        initialLength = Math.sqrt(Math.abs(d[0][0] - d[1][0]) + Math.abs(d[0][1] - d[1][1]));
        initialScale = d3.transform(d3.select("#graphics").attr("transform")).scale[0];
    }
}
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
    if (d.length == 2) {
        var currentLength = Math.sqrt(Math.abs(d[0][0] - d[1][0]) + Math.abs(d[0][1] - d[1][1]));
        var zoom = currentLength / initialLength;
        var newScale = zoom * initialScale;
        d3.select("#touchStatus").html("") 
        d3.select("#touchStatus").append("p").html("Initial Scale: " + initialScale);
        d3.select("#touchStatus").append("p").html("Initial Length: " + initialLength);
        d3.select("#touchStatus").append("p").html("Current Length: " + currentLength);
        d3.select("#touchStatus").append("p").html("Zoom: " + zoom);
        d3.select("#touchStatus").append("p").html("New Scale: " + newScale);
        d3.select("#graphics").attr("transform", "scale(" + newScale + ")")
    }
}