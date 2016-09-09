
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
    projection = d3.geoMercator().scale(100).translate([250, 250]);
    geoPath = d3.geoPath().projection(projection);
    canvasPath = d3.geoPath().projection(projection);
    
    mapZoom = d3.zoom().translate(projection.translate()).scale(projection.scale()).on("zoom", zoomed).on("zoomstart", zoomInitialized).on("zoomend", zoomFinished);
    
    d3.select("svg").call(mapZoom);
    
    var g = d3.select("svg").append("g")
    
    g.selectAll("path.sample").data(sampleData).enter().append("path").attr("class", "sample").style("stroke", "black").style("stroke-width", "1px").style("fill", "red").style("fill-opacity", .5).on("mouseover", function () {
        d3.select(this).style("fill", "pink")
    });
    
    
    zoomFinished();
    
    function zoomed() {
        projection.translate(mapZoom.translate()).scale(mapZoom.scale());
        
        var context = d3.select("canvas").node().getContext("2d");
        context.clearRect(0, 0, 500, 500);
        
        context.strokeStyle = "black";
        context.fillStyle = "gray";
        context.lineWidth = "1px";
        for (var x in countries.features) {
            context.beginPath();
            canvasPath.context(context)(countries.features[x]);
            context.stroke()
            context.fill();
        }
        
        context.strokeStyle = "black";
        context.fillStyle = "rgba(255,0,0,.5)";
        context.lineWidth = 1;
        for (var x in sampleData) {
            context.beginPath();
            canvasPath.context(context)(sampleData[x]);
            context.stroke()
            context.fill();
        }
    }
    
    function zoomInitialized() {
        d3.selectAll("path.sample").style("display", "none");
        zoomed();
    }
    function zoomFinished() {
        var context = d3.select("canvas").node().getContext("2d");
        context.clearRect(0, 0, 500, 500);
        
        context.strokeStyle = "black";
        context.fillStyle = "gray";
        context.lineWidth = "1px";
        for (var x in countries.features) {
            context.beginPath();
            canvasPath.context(context)(countries.features[x]);
            context.stroke()
            context.fill();
        }
        
        d3.selectAll("path.sample").style("display", "block").attr("d", geoPath);
    }
}

function randomCoords() {
    var randX = (Math.random() * 350) - 175;
    var randY = (Math.random() * 170) - 85;
    return[[[randX - 5, randY],[randX, randY - 5],[randX - 10, randY - 5],[randX - 5, randY]]];
}