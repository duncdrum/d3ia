
d3.csv("../data/source/tweetdata.csv", lineChart)

function lineChart(data) {
    
    xScale = d3.scaleLinear().domain([1, 10.5]).range([20, 480]);
    yScale = d3.scaleLinear().domain([0, 35]).range([480, 20]);
    
    xAxis = d3.axisBottom(xScale).tickSize(480).ticks([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);    
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
    }).style("fill", "gray")
}