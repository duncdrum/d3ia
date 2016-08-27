
d3.csv("movies.csv", areaChart)

function areaChart(data) {
    
    xScale = d3.scaleLinear().domain([1, 10.5]).range([20, 480]);
    yScale = d3.scaleLinear().domain([0, 35]).range([480, 20]);
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(480).tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    
    d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
    
    yAxis = d3.svg.axis().scale(yScale).orient("right").ticks(10).tickSize(480).tickSubdivide(true);
    
    d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);
    for (x in data[0]) {
        if (x != "day") {
            
            movieArea = d3.svg.line().x(function (d) {
                return xScale(d.day)
            }).y(function (d) {
                return yScale(d[x])
            }).interpolate("cardinal")
            
            d3.select("svg").append("path").style("id", x + "Area").attr("d", movieArea(data)).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 3).style("opacity", .75)
        }
    }
}