
var initialD =[];
var initialTransform;

d3.select("svg").on("touchstart", touchBegin);
d3.select("svg").on("touchend", touchBegin);
d3.select("svg").on("touchmove", touchUpdate);

var touchColor = d3.scaleLinear().domain([0, 10]).range([ "pink", "darkred"])

var graphicsG = d3.select("svg").append("g").attr("id", "graphics").attr("transform-origin", "250 250");

sampleData = d3.range(10).map(function (d) {
    var datapoint = {
    };
    datapoint.id = "Sample " + d;
    datapoint.x = Math.random() * 500;
    datapoint.y = Math.random() * 500;
    return datapoint;
})

var samples = graphicsG.selectAll("g").data(sampleData).enter().append("g").attr("transform", function (d) {
    return "translate(" + d.x + "," + d.y + ")"
});

var sampleSubG = samples.append("g").attr("class", "sample");
sampleSubG.append("rect").attr("width", 100).attr("height", 100).style("fill", "red").style("stroke", "gray").style("stroke-width", "1px");

sampleSubG.append("text").text(function (d) {
    return d.id
}).attr("y", 20);

function touchBegin() {
    d3.event.preventDefault();
    d3.event.stopPropagation();
    
    d = d3.touches(this);
    initialD = d;
    initialTransform = d3.transform(d3.select("#graphics").attr("transform"));
}
function touchUpdate() {
    d3.event.preventDefault();
    d3.event.stopPropagation();
    d = d3.touches(this);
    d3.select("svg").selectAll("circle.fingertips").data(d).enter().append("circle").attr("class", "fingertips").attr("r", 75).style("fill", function (d, i) {
        return touchColor(i)
    });
    
    d3.select("svg").selectAll("circle.fingertips").data(d).exit().remove();
    
    d3.select("svg").selectAll("circle.fingertips").attr("cx", function (d) {
        return d[0]
    }).attr("cy", function (d) {
        return d[1]
    });
    
    var newX = initialTransform.translate[0];
    var newY = initialTransform.translate[1];
    var newRotate = initialTransform.rotate;
    var newScale = initialTransform.scale[0];
    
    d3.select("#touchStatus").html("")
    
    if (d.length == 1) {
        newX = -(initialD[0][0] - d[0][0] - initialTransform.translate[0]);
        newY = -(initialD[0][1] - d[0][1] - initialTransform.translate[1]);
    } else if (d.length == 2) {
        d3.select("#touchStatus").append("p").html("Two Fingers");
        
        var initialLength = Math.sqrt(Math.abs(initialD[0][0] - initialD[1][0]) + Math.abs(initialD[0][1] - initialD[1][1]));
        var currentLength = Math.sqrt(Math.abs(d[0][0] - d[1][0]) + Math.abs(d[0][1] - d[1][1]));
        var zoom = currentLength / initialLength;
        newScale = zoom * initialTransform.scale[0];
    } else if (d.length == 3) {
        var slope1 = (initialD[0][1] - initialD[1][1]) / (initialD[0][0] - initialD[1][0]);
        var slope2 = (d[0][1] - d[1][1]) / (d[0][0] - d[1][0]);
        
        var angle = Math.atan((slope1 - slope2) /(1 + slope1 * slope2)) * 180 / Math.PI;
        var newRotate = initialTransform.rotate - angle;
        
        d3.selectAll("g.sample > text").attr("transform", "rotate(" +(- newRotate) + ")")
    }
    
    d3.select("#touchStatus").append("p").html("New Scale: " + newScale);
    
    d3.select("#graphics").attr("transform", "translate(" +(newX) + "," + (newY) + ") scale(" + newScale + ") rotate(" + newRotate + ")")
}