var data = [
 {day: 1, movie1: 20, movie2: 8},
 {day: 2, movie1: 18, movie2: 5}
]

var x = d3.scaleLinear()
    .domain([0, 10])
    .range([0, 500]);
    
var y = d3.scaleLinear()
    .domain([0, 100])
    .range([500, 0]);

var stack = d3.stack()
    .keys(["movie1", "movie2"])
    .offset(d3.stackOffsetSilhouette)
    .order(d3.stackOrderInsideOut);
    
var series= stack(data);  

var area = d3.area()    
    .x(function(d) { return x(d.day); })
    .y0(function(d) { return y(d[1]); })
    .y1(function(d) { return y(d[2]); })
    .curve(d3.curveBasis);
    
var test = area(data)