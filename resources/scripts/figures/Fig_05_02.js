d3.json("../data/source/tweets.json", function (error, data) {
    histogram(data.tweets)
});

function histogram(tweetsData) {

    xScale = d3.scaleLinear().domain([0, 5]).range([0, 500])
    yScale = d3.scaleLinear().domain([0, 10]).range([400, 0]);
    
    var xAxis = d3.axisBottom(xScale).ticks(5);
    
    var histoChart = d3.histogram()
    .domain(xScale.domain())
    .thresholds(xScale.ticks(5))
    .value(function(d){
        return d.favorites.length
    });
    
    histoData = histoChart(tweetsData)
    
    d3.select("svg")
    .selectAll("rect")
    .data(histoData)
    .enter()
    .append("rect")
    .attr("x", 1) /*not sure whats going on here compared to v3*/
    .attr("y", 1)
    .attr("width", xScale(histoData[0].x1) - xScale(histoData[0].x0)- 2)
    .attr("height", function(d) {return 400 - yScale(d.length) })
    /* this is a v4 addition its precise nature somehwat eludes me   */
    .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
    .on("click", retweets);
    
    d3.select("svg").append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,400)")
        .call(xAxis);
        
    d3.select("g.axis")
    .selectAll("text")
    .attr("dx", 50);

    function retweets() {
            histoChart.value(function(d) {return d.retweets.length});
            
            histoData = histoChart(tweetsData);
            
            d3.selectAll("rect")
            .data(histoData)
            .transition()
            .duration(500)
            .attr("x", 1)
            .attr("y", 1)
            .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
            .attr("height", function(d) {return 400 - yScale(d.length) });
            }
    
}

