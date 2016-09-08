
d3.json("world.geojson", createMap);

function createMap(countries) {
    var aProjection = d3.geoMercator();
    var geoPath = d3.geoPath().projection(aProjection);
    d3.select("svg").selectAll("path").data(countries.features).enter().append("path").attr("d", geoPath).attr("class", "countries")
}