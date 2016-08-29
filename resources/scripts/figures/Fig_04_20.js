
d3.csv("../data/source/tweetdata.csv", lineChart)

function lineChart(data) {
    
    xScale = d3.scaleLinear().domain([1, 10.5]).range([20, 480]);
    yScale = d3.scaleLinear().domain([0, 35]).range([480, 20]);
    
    xAxis = d3.axisBottom(xScale).tickSize(480).ticks(10);    
    d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
    
    yAxis = d3.axisRight(yScale).ticks(10).tickSize(480);    
    d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);
    
    d3.select("svg").selectAll("circle.tweets").data(data).enter().append("circle").attr("class", "tweets").attr("r", 5).attr("cx", function (d) {
        return xScale(d.day)
    }).attr("cy", function (d) {
        return yScale(d.tweets)
    }).style("fill", "black")
    
    d3.select("svg").selectAll("circle.retweets").data(data).enter().append("circle").attr("class", "retweets").attr("r", 5).attr("cx", function (d) {
        return xScale(d.day)
    }).attr("cy", function (d) {
        return yScale(d.retweets)
    }).style("fill", "lightgray")
    
    d3.select("svg").selectAll("circle.favorites").data(data).enter().append("circle").attr("class", "favorites").attr("r", 5).attr("cx", function (d) {
        return xScale(d.day)
    }).attr("cy", function (d) {
        return yScale(d.favorites)
    }).style("fill", "gray");
    
    


tweetLine = d3.line()
    .curve(d3.curveCardinal)
    .x(function (d) {
        return xScale(d.day)
    })
    .y(function (d) {
        return yScale(d.tweets)
    })
    
    
    retweetLine = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) {
        return xScale(d.day)
    }).y(function (d) {
        return yScale(d.retweets)
    })
    
    
    favLine = d3.line()
    .curve(d3.curveStepBefore)
    .x(function (d) {
        return xScale(d.day)
    }).y(function (d) {
        return yScale(d.favorites)
    })
    
    
    d3.select("svg").append("path").attr("d", tweetLine(data)).attr("fill", "none").attr("stroke", "darkred").attr("stroke-width", 2)
    
    d3.select("svg").append("path").attr("d", retweetLine(data)).attr("fill", "none").attr("stroke", "gray").attr("stroke-width", 3)
    
    d3.select("svg").append("path").attr("d", favLine(data)).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 2)
}