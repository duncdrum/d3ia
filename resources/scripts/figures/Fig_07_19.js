
queue().defer(d3.json, "world.topojson").defer(d3.csv, "cities.csv").await(function (error, file1, file2) {
    createMap(file1, file2);
});

function createMap(countries1, cities) {
    var countries = topojson.feature(countries1, countries1.objects.countries);
    var neighbors = topojson.neighbors(countries1.objects.countries.geometries);
    
    width = 500;
    height = 500;
    projection = d3.geo.mollweide().scale(120).translate([width / 2, height / 2]).center([20, 0])
    geoPath = d3.geo.path().projection(projection);
    
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
    
    d3.select("svg").selectAll("circle").data(cities).enter().append("circle").style("fill", "black").style("stroke", "white").style("stroke-width", 1).attr("r", 3).attr("cx", function (d) {
        return projection([d.y, d.x])[0]
    }).attr("cy", function (d) {
        return projection([d.y, d.x])[1]
    })
    
    function centerBounds(d, i) {
        d3.select(this).style("fill", "blue")
        d3.selectAll("path.countries").filter(function (p, q) {
            return neighbors[i].indexOf(q) &gt; -1
        }).style("fill", "green")
    }
    function clearCenterBounds() {
        d3.selectAll("path.countries").style("fill", function (d) {
            return countryColor(geoPath.area(d))
        })
    }
}