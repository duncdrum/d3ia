d3.json("../data/source/tweets.json", function (error, data) {
    dataViz(data.tweets)
});

function dataViz(incData) {
      
    var packableTweets = d3.hierarchy({values: incData
    });
    
    /*{
        id: "root", values: nestedTweets
    }*/
    
    var depthScale = d3.scaleOrdinal(d3.schemeCategory10);
    
    exposedData = incData;
    packChart = d3.pack()
    .size([500, 500])
    ;
    
    packChart(packableTweets);
    
/*    packChart(packableTweets[0]);*/

    /*  */
    
    
    d3.select("svg")
    .append("g").attr("transform", "translate(0,0)")
    .selectAll("circle")
    .data(packChart(packableTweets))
    .enter()
    .append("circle")
    .attr("r", function (d) {
        return d.r - (d.depth * 0)
    }).attr("cx", function (d) {
        return d.x
    }).attr("cy", function (d) {
        return d.y
    }).style("fill", function (d) {
        return depthScale(d.depth)
    }).style("stroke", "black").style("stroke", "2px")
}