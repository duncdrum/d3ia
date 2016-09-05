var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

/*var parseDate = d3.timeParse("%Y %b %d");*/

var x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var stack = d3.stack();

var area = d3.area()
    .x(function(d, i) { return x(d.data.day); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); });

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("../data/source/movies.csv", type, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  x.domain(d3.extent(data, function(d) { return d.day; }));
  z.domain(keys);
  stack.keys(keys);

  var layer = g.selectAll(".layer")
    .data(stack(data))
    .enter().append("g")
      .attr("class", "layer");

  layer.append("path")
      .attr("class", "area")
      .style("fill", function(d) { return z(d.key); })
      .attr("d", area);

  layer
/*  .filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })*/
    .append("text")
      .attr("x", width - 6)
      .attr("y", function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1])/100); })
      .attr("dy", ".35em")
      .style("font", "10px sans-serif")
      .style("text-anchor", "end")
      .text(function(d) { return d.key; });

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"));
});

function type(d, i, columns) {
  d.day = parseInt(d.day);
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] /4;
  return d;
}







/*var data = [
 {day: 1, movie1: 20, movie2: 8, movie3: 3},
 {day: 2, movie1: 18, movie2: 5, movie3: 1}
]

var x = d3.scaleLinear()
    .domain([0, 10])
    .range([0, 500]);
    
var y = d3.scaleLinear()
    .domain([0, 100])
    .range([500, 0]);
    
var movieColors = d3.scaleOrdinal(d3.schemeCategory10);    

var stack = d3.stack()
    .keys(["movie1", "movie2", "movie3"])
    .offset(d3.stackOffsetSilhouette)
    .order(d3.stackOrderInsideOut);
    
var series= stack(data);  

var area = d3.area()    
    .x(function(d) { return x(d.day); })
    .y0(function(d) { return y(d[1]); })
    .y1(function(d) { return y(d[2]); })
    .curve(d3.curveBasis);
    
var test = area(series)
*/
