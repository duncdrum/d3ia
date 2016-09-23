d3.csv("../data/source/cities.csv", function (error, data) {
    dataViz(data)
});
function dataViz(incomingData) {
    d3.select("[role=main]").selectAll("div.cities").data(incomingData).enter().append("div").attr("class", "cities").html(function (d, i) {
        return d.label
    })
}