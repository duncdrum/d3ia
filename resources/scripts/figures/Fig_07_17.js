
d3.queue().defer(d3.json, "world.topojson").defer(d3.csv, "cities.csv").await(function (error, file1, file2) {
    createMap(file1, file2);
});

function createMap(countries1, cities) {
    expCountries = countries1;
    var countries = topojson.feature(countries1, countries1.objects.countries)
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
    }).style("stroke-width", 1).style("stroke", "black").style("opacity", .5)
    
    d3.select("svg").selectAll("circle").data(cities).enter().append("circle").style("fill", "black").style("stroke", "white").style("stroke-width", 1).attr("r", 3).attr("cx", function (d) {
        return projection([d.y, d.x])[0]
    }).attr("cy", function (d) {
        return projection([d.y, d.x])[1]
    })
    
    mergeAt(0);
    
    function mergeAt(boundingBox) {
        
        var filteredCountries = countries1.objects.countries.geometries.filter(function (d) {
            thisCenter = d3.geo.centroid(
            topojson.feature(expCountries, d));
            return thisCenter[1] &gt; boundingBox ? true: null;
        })
        
        d3.select("svg").insert("g", "circle").datum(topojson.merge(countries1, filteredCountries)).insert("path").style("fill", "gray").style("stroke", "black").style("stroke-width", "2px").attr("d", geoPath)
    }
}