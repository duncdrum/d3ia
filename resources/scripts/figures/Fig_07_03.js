
d3.json("world.geojson", createMap);

function createMap(countries) {
    var aProjection = d3.geo.mercator();
    var geoPath = d3.geo.path().projection(aProjection);
    d3.select("svg").selectAll("path").data(countries.features).enter().append("path").attr("d", geoPath).attr("class", "countries")
}