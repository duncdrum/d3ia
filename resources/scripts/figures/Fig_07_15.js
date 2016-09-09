d3.queue().defer(d3.json, "../data/source/world.geojson").defer(d3.csv, "../data/source/cities.csv").await(function (error, file1, file2) {
    createMap(file1, file2);
});

function createMap(countries, cities) {
    expData = countries;
    width = 500;
    height = 500;
    projection = d3.geo.satellite().scale(1330).translate([250, 250]).rotate([-30.24, -31, -56]).tilt(30).distance(1.199).clipAngle(45)
    
    geoPath = d3.geoPath().projection(projection);
    
    var mapZoom = d3.zoom().translate(projection.translate()).scale(projection.scale()).on("zoom", zoomed);
    d3.select("svg").call(mapZoom);
    
    function zoomed() {
        var currentRotate = projection.rotate()[0];
        projection.translate(mapZoom.translate()).scale(mapZoom.scale());
        d3.selectAll("path.graticule").attr("d", geoPath);
        d3.selectAll("path.countries").attr("d", geoPath);
        
        d3.selectAll("circle.cities").attr("cx", function (d) {
            return projection([d.y, d.x])[0]
        }).attr("cy", function (d) {
            return projection([d.y, d.x])[1]
        }).style("display", function (d) {
            return parseInt(d.y) + currentRotate < 45 && parseInt(d.y) + currentRotate > -45 ? "block": "none"
        })
    }
    
    featureSize = d3.extent(countries.features, function (d) {
        return geoPath.area(d)
    });
    countryColor = d3.scaleQuantize().domain(featureSize).range(colorbrewer.Reds[7]);
    
    var graticule = d3.geoGraticule();
    
    d3.select("svg").append("path").datum(graticule).attr("class", "graticule line").attr("d", geoPath).style("fill", "none").style("stroke", "lightgray").style("stroke-width", "1px");
    
    d3.select("svg").selectAll("path.countries").data(countries.features).enter().append("path").attr("d", geoPath).attr("class", "countries").style("fill", function (d) {
        return countryColor(geoPath.area(d))
    }).style("stroke-width", 1).style("stroke", "black").style("opacity", .5)
    
    d3.select("svg").selectAll("circle").data(cities).enter().append("circle").attr("class", "cities").style("fill", "black").style("stroke", "white").style("stroke-width", 1).attr("r", 3).attr("cx", function (d) {
        return projection([d.y, d.x])[0]
    }).attr("cy", function (d) {
        return projection([d.y, d.x])[1]
    }).style("display", function (d) {
        return parseInt(d.y) -30.24 < 45 && parseInt(d.y) -30.24 > -45 ? "block": "none"
    })
}