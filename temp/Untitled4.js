var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var x = d3.scaleLinear()
    .domain([0, 10])
    .range([0, 500]);
    
var y = d3.scaleLinear()
    .domain([0, 100])
    .range([500, 0]);   
    
var z = d3.scaleOrdinal(d3.schemeCategory10);    
    
var stack = d3.stack();    
    
    
d3.csv("../data/source/movies.csv", function (error, data) {
/*    delete data.columns;  */
    if (error) throw error;
    

  x.domain(data.map(function(d) { return d.x; }));
  y.domain([0, d3.max(data, function(d) { return d.y; })]).nice();
  z.domain(data.columns.slice(1));
  
  g.selectAll(".serie")
    .data(stack.keys(data.columns.slice(1))(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.x); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());
 });   
    
   
 function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}   
    
   