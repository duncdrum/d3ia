
d3.csv("movies.csv", function (error, data) {
    dataViz(data)
});

function dataViz(incData) {
    expData = incData;
    stackData =[];
    
    var xScale = d3.scaleLinear().domain([1, 10]).range([20, 440]);
    
    var yScale = d3.scaleLinear().domain([0, 70]).range([480, 0]);
    
    var heightScale = d3.scaleLinear().domain([0, 70]).range([0, 480]);
    
    var movieColors = d3.scale.category10([ "movie1", "movie2", "movie3", "movie4", "movie5", "movie6"]);
    
    for (x in incData[0]) {
        if (x != "day") {
            var newMovieObject = {
                name: x, values:[]
            };
            for (y in incData) {
                newMovieObject.values.push({
                    x: parseInt(incData[y][ "day"]), y: parseInt(incData[y][x])
                })
            }
            stackData.push(newMovieObject);
        }
    }
    
    stackLayout = d3.stack().values(function (d) {
        return d.values;
    });
    
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(480).ticks(10);
    d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
    
    yAxis = d3.svg.axis().scale(yScale).orient("right").ticks(8).tickSize(480).tickSubdivide(true);
    d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);
    
    
    d3.select("svg").selectAll("g.bar").data(stackLayout(stackData)).enter().append("g").attr("class", "bar").each(function (d) {
        d3.select(this).selectAll("rect").data(d.values).enter().append("rect").attr("x", function (p) {
            return xScale(p.x) - 15;
        }).attr("y", function (p) {
            return yScale(p.y + p.y0);
        }).attr("height", function (p) {
            return heightScale(p.y);
        }).attr("width", 30).style("fill", movieColors(d.name))
    })
}