

d3.json("../data/source/tweets.json", function (error, data) {
    histogram(data.tweets)
});

function histogram(tweetsData) {
    
    xScale = d3.scaleLinear().domain([0, 5]).range([0, 500])
    var yScale = d3.scaleLinear().domain([0, 10]).range([400, 0]);
    
    var xAxis = d3.svg.axis().scale(xScale).ticks(5).orient("bottom");
    
    var histoChart = d3.histogram();
    
    histoChart.bins([0, 1, 2, 3, 4, 5]).value(function (d) {
        return d.favorites.length
    });
    
    histoData = histoChart(tweetsData);
    
    d3.select("svg").selectAll("rect").data(histoData).enter().append("rect").attr("x", function (d) {
        return xScale(d.x)
    }).attr("y", function (d) {
        return yScale(d.y)
    }).attr("width", xScale(histoData[0].dx) - 2).attr("height", function (d) {
        return 400 - yScale(d.y);
    }).on("click", retweets)
    
    d3.select("svg").append("g").attr("class", "x axis").attr("transform", "translate(0,400)").call(xAxis);
    
    d3.select("g.axis").selectAll("text").attr("dx", 50)
    function retweets() {
        histoChart.value(function (d) {
            return d.retweets.length
        });
        
        histoData = histoChart(tweetsData);
        
        d3.selectAll("rect").data(histoData).transition().duration(500).attr("x", function (d) {
            return xScale(d.x)
        }).attr("y", function (d) {
            return yScale(d.y)
        }).attr("height", function (d) {
            return 400 - yScale(d.y);
        });
    }
}