var manhattenBoundingBox = {
    geometry: { coordinates:[[[-74.0479, 40.8820],[-73.9067, 40.8820],[-73.9067, 40.6829],[-74.0479, 40.6829],[-74.0479, 40.8820]]],
    type: "Polygon" },
    id: 999999, properties: { },
    type: "Feature"
};

var width = 500,
height = 500;

d3.select("svg")
.append("g")
.attr("id", "tiles");

d3.select("svg")
.append("g")
.attr("id", "vectors");

var tile = d3.tile()
.size([width, height]);

var projection = d3.geoMercator()
.scale((1 << 18) / 2 / Math.PI)
.translate([width / 2, height / 2]);

var center = projection([-73.95, 40.7]);

var path = d3.geoPath()
.projection(projection);

var zoom = d3.zoom()
.scaleExtent(projection.scale() * 2 * Math.PI)
.translateExtent([width - center[0], height - center[1]])
.on("zoom", redraw);

d3.select("svg").call(zoom);
projection.scale(1 / 2 / Math.PI)
.translate([0, 0]);

geoPath = d3.geoPath()
.projection(projection); 

d3.select("#vectors")
.selectAll("path.countries")
.data([manhattenBoundingBox])
.enter().append("path")
.attr("d", geoPath)
.attr("class", "countries")
.style("fill", "red")
.style("stroke-width", 3)
.style("stroke", "black")
.style("fill-opacity", .25)

redraw();

function redraw() {
    var tiles = tile.scale(zoom.scaleExtent())
    .translate(zoom.translateExtent())
    ();
    
    var image = d3.select("#tiles")
    .attr("transform", "scale(" + tiles.scale + ")translate(" + tiles.translate + ")")
    .selectAll("image")
    .data(tiles, function (d) { return d; });
    
    image.exit().remove();
    
    image.enter()
    .append("image")
    .attr("xlink:href", function (d) {
        return "http://" +[ "a", "b", "c", "d"][Math.random() * 4 | 0] + ".tiles.mapbox.com/v3/examples.map-zgrqqx0w/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
        .attr("width", 1).attr("height", 1)
        .attr("x", function (d) { return d[0]; })
        .attr("y", function (d) { return d[1]; });
    
    projection.scale(zoom.scaleExtent() / 2 / Math.PI)
    .translate(zoom.translateExtent());
    
    d3.selectAll("path")
    .attr("d", geoPath);
}