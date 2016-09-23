var scatterData =[ {
    friends: 5, salary: 22000
},
{
    friends: 3, salary: 18000
},
{
    friends: 10, salary: 88000
},
{
    friends: 0, salary: 180000
},
{
    friends: 27, salary: 56000
},
{
    friends: 8, salary: 74000
}] 

xScale = d3.scale.linear().domain([0, 180000]).range([0, 480]);
yScale = d3.scale.linear().domain([0, 27]).range([0, 480]);
xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(480).ticks(4);
d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
yAxis = d3.svg.axis().scale(yScale).orient("right").ticks(10).tickSize(480).tickSubdivide(10);
d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);
d3.select("svg").selectAll("circle").data(scatterData).enter().append("circle").attr("r", 5).attr("cx", function (d) {
    return xScale(d.salary)
}).attr("cy", function (d) {
    return yScale(d.friends)
})