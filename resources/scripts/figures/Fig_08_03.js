
d3.json("tweets.json", function (error, data) {
    createSpreadsheet(data.tweets)
});

function createSpreadsheet(incData) {
    
    var keyValues = d3.keys(incData[0])
    
    d3.select("#traditional").append("div").attr("class", "table")
    
    d3.select("div.table").append("div").attr("class", "head").selectAll("div.data").data(keyValues).enter().append("div").attr("class", "data").html(function (d) {
        return d
    }).style("left", function (d, i) {
        return (i * 100) + "px"
    });
    
    d3.select("div.table").selectAll("div.datarow").data(incData, function (d) {
        return d.content
    }).enter().append("div").attr("class", "datarow").style("top", function (d, i) {
        return (40 + (i * 40)) + "px"
    });
    
    d3.selectAll("div.datarow").selectAll("div.data").data(function (d) {
        return d3.entries(d)
    }).enter().append("div").attr("class", "data").html(function (d) {
        return d.value
    }).style("left", function (d, i, j) {
        return (i * 100) + "px"
    });
}