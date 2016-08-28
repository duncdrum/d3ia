
d3.csv("movies.csv", areaChart)

function areaChart(data) {
    
    xScale = d3.scaleLinear().domain([1, 10.5]).range([20, 480]);
    yScale = d3.scaleLinear().domain([0, 35]).range([480, 20]);
    xAxis = d3.axisBottom(xScale).tickSize(480).ticks([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    
    d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
    
    yAxis = d3.axisRight(yScale).ticks(10).tickSize(480);
    
    d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);
    for (x in data[0]) {
        if (x != "day") {
            
            movieArea = d3.line().x(function (d) {
                return xScale(d.day)
            }).y(function (d) {
                return yScale(d[x])
            }).curve(d3.curveCardinal)
            
            d3.select("svg").append("path").style("id", x + "Area").attr("d", movieArea(data)).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 3).style("opacity", .75)
        }
    }
}