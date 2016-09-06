d3.csv("../data/source/movies.csv", function (error, data) {
    data.forEach(function(d) {
    d.day = parseInt(d.day); 
  });
  dataViz(data)
});

function dataViz(incData) {
    expData = incData;
    var keys = incData.columns.slice(1);
    stackData =incData;
    
    var xScale = d3.scaleLinear()
    .domain([1, 10])
    .range([20, 440]);
    
    var yScale = d3.scaleLinear()
    .domain([0, 70])
    .range([480, 0]);
    
    var heightScale = d3.scaleLinear()
    .domain([0, 70])
    .range([0, 480]);
    
    var movieColors = d3.scaleOrdinal(d3.schemeCategory10);
    
     function type(d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] ;
        return d;
    }
    
    stackLayout = d3.stack()
    .keys(keys)

    
    xAxis = d3.axisBottom(xScale)
    .tickSize(480)
    .ticks(10);
    
    d3.select("svg")
    .append("g")
    .attr("id", "xAxisG")
    .call(xAxis);
    
    yAxis = d3.axisRight(yScale)
    .ticks(8)
    .tickSize(480);

    d3.select("svg")
    .append("g")
    .attr("id", "yAxisG")
    .call(yAxis);
    
    
    d3.select("svg")
    .selectAll("g.bar")
    .data(stackLayout(stackData))
    .enter()
    .append("g")
    .attr("class", "bar")
    .each(function (d) {
        d3.select(this)
        .selectAll("rect")
        .data(function(d) { return d; }) //!
        .enter()
        .append("rect")
        .attr("x", function(p, i) { return xScale(p.data.day); })
        .attr("y", function(p) { return yScale(p[1]); })
        .attr("height", function(p) { return heightScale(p[1]) - heightScale(p[0]); })
        .attr("width", 30)
        .style("fill", movieColors(d))
    })
}