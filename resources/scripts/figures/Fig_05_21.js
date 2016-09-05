d3.csv("../data/source/movies.csv", function (error, data) {
    data.forEach(function(d) {
    d.day = parseInt(d.day); 
  });
  dataViz(data)
});


function dataViz(incData) {    
/*    expData = incData;*/
    var keys = incData.columns.slice(1); //"movie1", "movie2", etc. Not "day"
    stackData = incData; 
    
    var xScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, 500]);
    
    var yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([500, 0]);
    
    var movieColors = d3.scaleOrdinal(d3.schemeCategory10);
    
    function type(d, i, columns) {
/*        d.day = parseInt(d.day);*/
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] ;
        return d;
    }
   
    
    stackLayout = d3.stack()
    .keys(keys)
    .offset(d3.stackOffsetSilhouette)
    .order(d3.stackOrderInsideOut)
/*    .value(function(d){return (d)});*/

    
    var stackArea = d3.area()
    .curve(d3.curveBasis)
    .x(function(d, i) { return xScale(d.data.day); })
    .y0(function(d) { return yScale(d[0]); })
    .y1(function(d) { return yScale(d[1]); });
     
    
    d3.select("svg")
    .selectAll("path")
    .data(stackLayout(stackData))
    .enter()
    .append("path")
/*    .append('g')*/
    .attr('transform', 'translate(' + -20 + ',' + -150 + ')')
    .style("fill", 
        function (d) { return movieColors(d.key); })
    .attr("d",
        function(d) { return stackArea(d); })
}