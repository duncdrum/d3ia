d3.csv("../data/source/movies.csv", function (error, data) {
/*    delete data.columns; /\*nuclear option*\/*/ 
    dataViz(data)
});

function dataViz(incData) {    
    expData = [incData];
    stackData =[];    
    
    var xScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, 500]);
    
    var yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([500, 0]);
    
    var movieColors = d3.scaleOrdinal(d3.schemeCategory10);
    
    var stackArea = d3.area()
    .curve(d3.curveBasis)
    .x(function(d) { return xScale(d.x); })
    .y0(function(d) { return yScale(500); })
    .y1(function(d) { return yScale(d.y[1]); });
    
    
    /*var newMovieObject = {
                name: x, values:[]
            };
    for (y in incData.slice(0, 10)) { //incData.slice(0, 10) vs incData
                newMovieObject                
                .values
                 .push({
                    x: parseInt(incData[y][ "day"]), 
                    y: parseInt(incData[y][x])
                })
            }
            stackData
            .push(newMovieObject);
        */

    
    
    stackLayout = d3.stack()
    .keys(incData.columns.slice(1))
    .offset(d3.stackOffsetSilhouette)
    .order(d3.stackOrderInsideOut)
    .value(function(d) { return d.values});
    
/*    stackLayout(stackData);*/
    
    
    d3.select("svg")
    .selectAll("path")
    .data(stackLayout(stackData))
    .enter()
    .append("path")
    .style("fill", 
        function (d) { return movieColors(d.key); })
    .attr("d",
        function(d) { return stackArea(d.values); })
/*    .merge(stackData)*/
}