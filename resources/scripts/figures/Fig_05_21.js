d3.csv("../data/source/movies.csv", function (error, data) {
    data.forEach(function(d) {
    d.day = parseInt(d.day); 
  });
  dataViz(data)
});
/*    delete data.columns; /*nuclear option*/



/*d3.csv('../data/source/movies.csv', function(error, data) {
  movieColors.domain(d3.keys(data[0]).filter(function(key) { return key !== 'day'; }));
  var keys = data.columns.filter(function(key) { return key !== 'day'; })
  data.forEach(function(d) {
    d.day = parseInt(d.day); });
        dataViz(data);});*/

function dataViz(incData) {    
/*    expData = incData;*/
    var keys = incData.columns.slice(1); //"movie1", "movie2", etc. not "day"
    stackData = incData; 
    
    var xScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, 500]);
    
    var yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([500, 0]);
    
    var movieColors = d3.scaleOrdinal(d3.schemeCategory10);
    
    function type(d, i, columns) {
        d.day = parseInt(d.day);
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] ;
        return d;
    }
   
    
    stackLayout = d3.stack()
    .keys(keys)
    .offset(d3.stackOffsetSilhouette)
    .order(d3.stackOrderInsideOut)
/*    .value(function(d){return (d)});*/


    
/*    stackLayout(stackData);*/
    
    var stackArea = d3.area()
    .curve(d3.curveBasis)
    .x(function(d, i) { return xScale(d.data.day); })
    .y0(function(d) { return yScale(d[0]); })
    .y1(function(d) { return yScale(d[1]); });
    
    
/*  function type(d, i, columns) {
  d.day = parseInt(d.day);
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] ;
  return d;
}*/
    
    /*for (x in incData[0]) {
      if (x != "day") {var newMovieObject = {
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
            }
     }*/
        

   
    
    
    
    
    d3.select("svg")
    .selectAll("path")
    .data(stackLayout(stackData))
    .enter()
    .append("path")
    .style("fill", 
        function (d) { return movieColors(d.key); })
    .attr("d",
        function(d) { return stackArea; })
/*    .merge(stackData)*/
}