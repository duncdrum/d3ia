d3.csv("../data/source/movies.csv", areaChart)


function areaChart(data) {
    
    xScale = d3.scaleLinear()
    .domain([1, 10.5])
    .range([20, 480]);
    
    yScale = d3.scaleLinear()
    .domain([0, 35])
    .range([240, 20]);
    
    xAxis = d3.axisBottom(xScale)
    .tickSize(480)
    .ticks(10);
    
    d3.select("svg")
    .append("g")
    .attr("id", "xAxisG")
    .call(xAxis);
    
    yAxis = d3.axisRight(yScale)
    .ticks(10)
    .tickSize(480);
    
    d3.select("svg")
    .append("g")
    .attr("id", "yAxisG")
    .call(yAxis);
    
    for (x in data[0]) {
        if (x != "day") {
            
            movieArea = d3.area()
            .x(function (d) { return xScale(d.day) })
            .y0(function (d) { return yScale(d[x]) })
            .y1(function (d) { return yScale(-d[x]) })
            .curve(d3.curveCardinal)
            
            d3.select("svg")
            .append("path")
            .style("id", x + "Area")
            .attr("d", movieArea(data))
            .attr("fill", "darkgray")
            .attr("stroke", "lightgray")
            .attr("stroke-width", 2)
            .style("opacity", .5)
        }
    }
}