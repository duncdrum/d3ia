d3.csv("../data/source/movies.csv", areaChart)
/*delete areaChart.columns; /\*nuclear option*\/*/ 

/*!! Note on Bl.ocks the axis labels are also invisible !!*/

function areaChart(data) {
    expData = data;
    xScale = d3.scaleLinear()
    .domain([0, 11])
    .range([0, 500]);
    
    yScale = d3.scaleLinear()
    .domain([-100, 100])
    .range([500, 0]);
    
    sizeScale = d3.scaleLinear()
    .domain([0, 200])
    .range([20, 20]);
    
    yAxis = d3.axisRight(yScale)
    .ticks(8)
    .tickSize(500);
    
    d3.select("svg")
    .append("g")
    .attr("id", "yAxisG")
    .call(yAxis);
    
    xAxis = d3.axisBottom(xScale)
    .tickSize(500)
    .ticks(4);
    
    d3.select("svg")
    .append("g")
    .attr("id", "xAxisG")
    .call(xAxis);
    
    fillScale = d3.scaleLinear()
    .domain([1, 10])
    .range([ "lightgray", "black"]);
    n = 0;
    
    for (x in data[0]) {
        if (x != "day") {
            
            movieArea = d3.area()
            .x(function (d) { return xScale(d.day) })
            .y0(function (d) { return yScale(alternatingStacking(d, x, "top")) })
            .y1(function (d) { return yScale(alternatingStacking(d, x, "bottom")); })
            .curve(d3.curveBasis)
            
            d3.select("svg")
            .insert("path", ".movie")
            .attr("class", "movie")
            .style("id", x + "Area")
            .attr("d", movieArea(data))
            .attr("fill", fillScale(n))
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .style("opacity", 1)
        }
        n++;
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
    
    function alternatingStacking(incomingData, incomingAttribute, topBottom) {
        var newHeight = 0;
        var skip = true;
        for (x in incomingData) {
            if (x != "day") {
                if (x == "movie1" || skip == false) {
                    newHeight += parseInt(incomingData[x]);
                    if (x == incomingAttribute) {
                        break;
                    }
                    if (skip == false) {
                        skip = true;
                    } else {
                        n % 2 == 0 ? skip = false: skip = true;
                    }
                } else {
                    skip = false;
                }
            }
        }
        if (topBottom == "bottom") {
            newHeight = - newHeight;
        }
        if (n > 1 && n % 2 == 1 && topBottom == "bottom") {
            newHeight = 0;
        }
        if (n > 1 && n % 2 == 0 && topBottom == "top") {
            newHeight = 0;
        }
        return newHeight;
    }
}