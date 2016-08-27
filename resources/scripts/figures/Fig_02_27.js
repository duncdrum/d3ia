d3.json("tweets.json", function (error, data) {
    dataViz(data.tweets)
});

function dataViz(incomingData) {
    
    incomingData.forEach(function (el) {
        el.impact = el.favorites.length + el.retweets.length
        el.tweetTime = new Date(el.timestamp);
    })
    
    var maxImpact = d3.max(incomingData, function (el) {
        return el.impact
    });
    var startEnd = d3.extent(incomingData, function (el) {
        return el.tweetTime
    });
    var timeRamp = d3.time.scale().domain(startEnd).range([50, 450]);
    var yScale = d3.scaleLinear().domain([0, maxImpact]).range([0, 460]);
    var radiusScale = d3.scaleLinear().domain([0, maxImpact]).range([1, 20]);
    
    d3.select("svg").selectAll("circle").data(incomingData, function (d) {
        return JSON.stringify(d)
    }).enter().append("circle").attr("r", function (d) {
        return radiusScale(d.impact)
    }).attr("cx", function (d, i) {
        return timeRamp(d.tweetTime)
    }).attr("cy", function (d) {
        return 480 - yScale(d.impact)
    }).style("fill", "#990000").style("stroke", "black").style("stroke-width", "1px");
    
    var filteredData = incomingData.filter(
    function (el) {
        return el.impact > 0
    });
    
    d3.selectAll("circle").data(filteredData, function (d) {
        return JSON.stringify(d)
    }).exit().remove();
}