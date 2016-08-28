
d3.csv("../data/source/boxplot.csv", scatterplot)

function scatterplot(data) {
    xScale = d3.scaleLinear().domain([1, 8]).range([20, 470]);
    yScale = d3.scaleLinear().domain([0, 100]).range([480, 20]);
    
    console.log(data)
    
    yAxis = d3.axisRight(yScale)
    .ticks(8)
    .tickSize(-470);
    /*Depreceated  https://github.com/d3/d3/commit/bd0ce6cab8a2b0d2aaffc7ce21a873fc514eb8ed
    yAxis.tickSubdivide(true)*/
    d3.select("svg").append("g").attr("transform", "translate(470,0)").attr("id", "yAxisG").call(yAxis);
    
    
    xAxis = d3.axisBottom(xScale)
    .ticks(7)
    .tickSize(-470);
    d3.select("svg").append("g").attr("transform", "translate(0,480)").attr("id", "xAxisG").call(xAxis);
    
    d3.select("svg").selectAll("circle.median").data(data).enter().append("circle").attr("class", "tweets").attr("r", 5).attr("cx", function (d) {
        return xScale(d.day)
    }).attr("cy", function (d) {
        return yScale(d.median)
    }).style("fill", "darkgray");
}