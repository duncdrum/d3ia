queue().defer(d3.json, "../data/source/world.geojson").defer(d3.csv, "../data/source/cities.csv").await(function (error, file1, file2) {
    createMap(file1, file2);
});
function createMap(countries, cities) {
    expData = countries;
    width = 500;
    height = 500;
    projection = d3.geo.mollweide().scale(120).translate([width / 2, height / 2]).center([20, 0]) 
    geoPath = d3.geo.path().projection(projection);
    var mapZoom = d3.behavior.zoom().translate(projection.translate()).scale(projection.scale()).on("zoom", 
    zoomed);
    d3.select("svg").call(mapZoom);
    function zoomed() {
        projection.translate(mapZoom.translate()).scale(mapZoom.scale());
        d3.selectAll("path.graticule").attr("d", geoPath);
        d3.selectAll("path.countries").attr("d", geoPath);
        d3.selectAll("circle.cities").attr("cx", function (d) {
            return projection([d.y, d.x])[0]
        }).attr("cy", function (d) {
            return projection([d.y, d.x])[1]
        })
    }
    function zoomButton(zoomDirection) {
        if (zoomDirection == "in") {
            var newZoom = mapZoom.scale() * 1.5;
            var newX = ((mapZoom.translate()[0] - (width / 2)) * 1.5) + width / 2;
            var newY = ((mapZoom.translate()[1] - (height / 2)) * 1.5) + height / 2;
        } else if (zoomDirection == "out") {
            var newZoom = mapZoom.scale() * .75;
            var newX = ((mapZoom.translate()[0] - (width / 2)) * .75) + width / 2;
            var newY = ((mapZoom.translate()[1] - (height / 2)) * .75) + height / 2;
        }
        mapZoom.scale(newZoom).translate([newX, newY]) 
        zoomed();
    }
    d3.select("#controls").append("button").on("click", function () {
        zoomButton("in")
    }).html("Zoom In");
    d3.select("#controls").append("button").on("click", function () {
        zoomButton("out")
    }).html("Zoom Out");
    featureSize = d3.extent(countries.features, function (d) {
        return geoPath.area(d)
    });
    countryColor = d3.scale.quantize().domain(featureSize).range(colorbrewer.Reds[7]);
    var graticule = d3.geo.graticule();
    d3.select("svg").append("path").datum(graticule).attr("class", "graticule line").attr("d", geoPath).style("fill", "none").style("stroke", "lightgray").style("stroke-width", "1px");
    d3.select("svg").append("path").datum(graticule.outline).attr("class", "graticule outline").attr("d", geoPath).style("fill", "none").style("stroke", "black").style("stroke-width", "1px");
    d3.select("svg").selectAll("path.countries").data(countries.features).enter().append("path").attr("d", geoPath).attr("class", "countries").style("fill", function (d) {
        return countryColor(geoPath.area(d))
    }).style("stroke-width", 1).style("stroke", "black").style("opacity", .5).on("mouseover", centerBounds).on("mouseout", clearCenterBounds) 
    d3.select("svg").selectAll("circle").data(cities).enter().append("circle").attr("class", "cities").style("fill", "black").style("stroke", "white").style("stroke-width", 1).attr("r", 3).attr("cx", function (d) {
        return projection([d.y, d.x])[0]
    }).attr("cy", function (d) {
        return projection([d.y, d.x])[1]
    }) 
    function centerBounds(d, i) {
        thisBounds = geoPath.bounds(d);
        thisCenter = geoPath.centroid(d);
        d3.select("svg").append("rect").attr("class", "bbox").attr("x", thisBounds[0][0]).attr("y", thisBounds[0][1]).attr("width", thisBounds[1][0] - thisBounds[0][0]).attr("height", thisBounds[1][1] - thisBounds[0][1]).style("fill", "none").style("stroke-dasharray", "5 5").style("stroke", "black").style("stroke-width", 2).style("pointer-events", "none") 
        d3.select("svg").append("circle").attr("class", "centroid").attr("r", 5).attr("cx", thisCenter[0]).attr("cy", thisCenter[1]).style("pointer-events", "none")
    }
    function clearCenterBounds() {
        d3.selectAll("circle.centroid").remove();
        d3.selectAll("rect.bbox").remove();
    }
}