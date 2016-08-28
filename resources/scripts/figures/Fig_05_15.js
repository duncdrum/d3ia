
d3.json("../data/source/tweets.json", function (error, data) {
    dataViz(data.tweets)
});

function dataViz(incData) {
    
    nestedTweets = d3.nest().key(function (el) {
        return el.user
    }).entries(incData);
    
    packableTweets = {
        id: "root", values: nestedTweets
    }
    
    var depthScale = d3.scale.category10([0, 1, 2]);
    
    treeChart = d3.tree();
    treeChart.size([500, 500]).children(function (d) {
        return d.values
    });
    
    var linkGenerator = d3.svg.diagonal();
    
    linkGenerator.projection(function (d) {
        return[d.y, d.x]
    })
    
    d3.select("svg").append("g").attr("class", "treeG").selectAll("g").data(treeChart(packableTweets)).enter().append("g").attr("class", "node").attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")"
    });
    
    d3.selectAll("g.node").append("circle").attr("r", 10).style("fill", function (d) {
        return depthScale(d.depth)
    }).style("stroke", "white").style("stroke-width", "2px");
    
    d3.selectAll("g.node").append("text").text(function (d) {
        return d.id || d.key || d.content
    })
    
    d3.select("g.treeG").selectAll("path").data(treeChart.links(treeChart(packableTweets))).enter().insert("path", "g").attr("d", linkGenerator).style("fill", "none").style("stroke", "black").style("stroke-width", "2px");
}