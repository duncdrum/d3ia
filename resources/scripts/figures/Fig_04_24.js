d3.csv("../data/source/movies.csv", areaChart) 
function areaChart(data) {
    xScale = d3.scale.linear().domain([1, 10.5]).range([20, 480]);
    yScale = d3.scale.linear().domain([0, 50]).range([480, 20]);
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(480).tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
    yAxis = d3.svg.axis().scale(yScale).orient("right").ticks(10).tickSize(480).tickSubdivide(true);
    d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);
    fillScale = d3.scale.linear().domain([0, 5]).range([ "lightgray", "black"]);
    var n = 0;
    for (x in data[0]) {
        if (x != "day") {
            movieArea = d3.svg.area().x(function (d) {
                return xScale(d.day)
            }).y(function (d) {
                return yScale(simpleStacking(d, x))
            }).y0(function (d) {
                return yScale(simpleStacking(d, x) - d[x]);
            }).interpolate("basis") 
            d3.select("svg").append("path").style("id", x + "Area").attr("d", movieArea(data)).attr("fill", fillScale(n)).attr("stroke", "none").attr("stroke-width", 2).style("opacity", .5) 
            n++;
        }
    }
    function simpleStacking(incomingData, incomingAttribute) {
        var newHeight = 0;
        for (x in incomingData) {
            if (x != "day") {
                newHeight += parseInt(incomingData[x]);
                if (x == incomingAttribute) {
                    break;
                }
            }
        }
        return newHeight;
    }
}