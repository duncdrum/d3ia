var linkScale = d3.scaleLinear().domain([0, .9, .95, 1]).range([0, 10, 100, 1000]);

sampleNodes = d3.range(3000).map(function (d) {
    var datapoint = {
    };
    datapoint.id = "Sample Node " + d;
    
    return datapoint;
})
sampleLinks =[];
var y = 0;
while (y < 1000) {
    var randomSource = Math.floor(Math.random() * 1000);
    var randomTarget = Math.floor(linkScale(Math.random()));
    var linkObject = {
        source: sampleNodes[randomSource], target: sampleNodes[randomTarget]
    }
    if (randomSource != randomTarget) {
        sampleLinks.push(linkObject);
    }
    y++;
}

force = d3.forceSimulation().size([500, 500]).gravity(.5).nodes(sampleNodes).links(sampleLinks).on("tick", forceTick);

d3.select("svg").selectAll("line.link").data(sampleLinks).enter().append("line").attr("class", "link").style("stroke-width", "1px").style("stroke", "black").style("stroke-opacity", .5);

d3.select("svg").selectAll("circle.node").data(sampleNodes).enter().append("circle").attr("r", 3).style("fill", "red").attr("class", "node").style("stroke", "white").style("stroke-width", "1px");

force.start();

function forceTick() {
    d3.selectAll("line.link").attr("x1", function (d) {
        return d.source.x
    }).attr("y1", function (d) {
        return d.source.y
    }).attr("x2", function (d) {
        return d.target.x
    }).attr("y2", function (d) {
        return d.target.y
    });
    
    d3.selectAll("circle.node").attr("cx", function (d) {
        return d.x
    }).attr("cy", function (d) {
        return d.y
    });
}