
sampleData = d3.range(2000).map(function (d) {
    var datapoint = {
    };
    datapoint.id = "Sample Feature " + d;
    datapoint.type = "Feature";
    datapoint.properties = {
    };
    datapoint.geometry = {
    };
    datapoint.geometry.type = "Polygon";
    datapoint.geometry.coordinates = randomCoords();
    return datapoint;
})

d3.json("../data/source/world.geojson", function (data) {
    createMap(data)
});

function createMap(countries) {
    projection = d3.geoMercator().scale(100);
    geoPath = d3.geoPath().projection(projection);    
    var g = d3.select("svg").append("g").attr("transform", "translate(-250,0)")
    
    g.selectAll("path.country").data(countries.features).enter().append("path").attr("d", geoPath).attr("class", "country").style("fill", "gray").style("stroke-width", 1).style("stroke", "black").style("opacity", .5)    
    g.selectAll("path.sample").data(sampleData).enter().append("path").attr("d", geoPath).attr("class", "sample").style("stroke", "black").style("stroke-width", "1px").style("fill", "red").style("fill-opacity", .5)
    
    var mapZoom = d3.zoom().translate(projection.translate()).scale(projection.scale()).on("zoom", zoomed);
    
    d3.select("svg").call(mapZoom);
    
    function zoomed() {
        projection.translate(mapZoom.translateExtent()).scale(mapZoom.scaleExtent());
        d3.selectAll("path.country").attr("d", geoPath);
        d3.selectAll("path.sample").attr("d", geoPath);
    }
}

function randomCoords() {
    var randX = (Math.random() * 350) - 175;
    var randY = (Math.random() * 170) - 85;
    return[[[randX - 5, randY],[randX, randY - 5],[randX - 10, randY - 5],[randX - 5, randY]]];
}