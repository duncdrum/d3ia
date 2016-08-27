
d3.csv("boxplot.csv", scatterplot)

function scatterplot(data) {
    xScale = d3.scaleLinear().domain([1, 8]).range([20, 470]);
    yScale = d3.scaleLinear().domain([0, 100]).range([480, 20]);
    
    console.log(data)
    yAxis = d3.svg.axis().scale(yScale).orient("right").ticks(8).tickSize(-470).tickSubdivide(true);
    
    d3.select("svg").append("g").attr("transform", "translate(470,0)").attr("id", "yAxisG").call(yAxis);
    
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(-470).tickValues([1, 2, 3, 4, 5, 6, 7]);
    
    d3.select("svg").append("g").attr("transform", "translate(0,480)").attr("id", "xAxisG").call(xAxis);
    
    d3.select("svg").selectAll("circle.median").data(data).enter().append("circle").attr("class", "tweets").attr("r", 5).attr("cx", function (d) {
        return xScale(d.day)
    }).attr("cy", function (d) {
        return yScale(d.median)
    }).style("fill", "darkgray");
}