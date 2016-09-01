d3.json("../data/source/tweets.json",
function (error, data) {dataViz(data.tweets)});

function dataViz(incData) {
    
    nestedTweets = d3.nest()
    .key(function (el) {return el.user})
    .entries(incData);
    
    packableTweets = d3.hierarchy({
        id: "root", values: nestedTweets
    },
    function (d) {return d.values})
    .sum(function (d) {return d.children ? 0: 1;})
    .sort(null);
    
    var depthScale = d3.scaleOrdinal(d3.schemeCategory10);
    
    exposedData = incData;
    packChart = d3.pack()
    .size([500, 500])
    .padding(1);
    
    packChart(packableTweets);
    
    d3.select("svg")
    .append("g")
    .attr("transform", "translate(0,0)")
    .selectAll("circle")
    .data(packableTweets.descendants())
    .enter()
    .append("circle")
        .attr("r", function (d) {return d.r - (d.depth * 0)})
        .attr("cx", function (d) {return d.x})
        .attr("cy", function (d) {return d.y})    
    .style("fill", function (d) {return depthScale(d.depth)})
    .style("stroke", "black").style("stroke", "2px")
}
