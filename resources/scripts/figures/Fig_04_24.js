
d3.csv("../data/source/movies.csv", areaChart)

function areaChart(data) {
    
    xScale = d3.scaleLinear().domain([1, 10.5]).range([20, 480]);
    yScale = d3.scaleLinear().domain([0, 50]).range([480, 20]);
    
    xAxis = d3.axisBottom(xScale).tickSize(480).ticks(10);
    d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
    
    yAxis = d3.axisRight(yScale).ticks(10).tickSize(480);
    d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);
    
    fillScale = d3.scaleLinear().domain([0, 5]).range([ "lightgray", "black"]);
    var n = 0;
    for (x in data[0]) {
        if (x != "day") {
            movieArea = d3.area().x(function (d) {
                return xScale(d.day)
            }).y(function (d) {
                return yScale(simpleStacking(d, x))
            }).y0(function (d) {
                return yScale(simpleStacking(d, x) - d[x]);
            }).curve(d3.curveBasis)
            d3.select("svg").append("path").style("id", x + "Area").attr("d", movieArea(data)).attr("fill", fillScale(n)).attr("stroke", "none").attr("stroke-width", 2).style("opacity", .5)
            n++;
        }
    }
    function simpleStacking(
    incomingData, incomingAttribute) {
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