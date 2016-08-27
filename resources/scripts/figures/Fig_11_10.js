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

d3.select("svg").selectAll("circle.node").data(sampleNodes).enter().append("circle").attr("r", 3).style("fill", "red").attr("class", "node").style("stroke", "white").style("stroke-width", "1px");

force.start();

function forceTick() {
    var context = d3.select("canvas").node().getContext("2d");
    context.clearRect(0, 0, 500, 500);
    
    context.lineWidth = 1;
    context.strokeStyle = "rgba(0, 0, 0, 0.5)";
    
    sampleLinks.forEach(function (link) {
        context.beginPath();
        context.moveTo(link.source.x, link.source.y)
        context.lineTo(link.target.x, link.target.y)
        context.stroke();
    })
    
    d3.selectAll("circle.node").attr("cx", function (d) {
        return d.x
    }).attr("cy", function (d) {
        return d.y
    });
}