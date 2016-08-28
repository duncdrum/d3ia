
d3.json("../data/source/tweets.json", function (error, data) {
    createSpreadsheet(data.tweets)
});

function createSpreadsheet(incData) {
    
    var keyValues = d3.keys(incData[0])
    
    d3.select("#traditional").append("table")
    
    d3.select("table").append("tr").attr("class", "head").selectAll("th").data(keyValues).enter().append("th").html(function (d) {
        return d
    })
    
    d3.select("table").selectAll("tr.data").data(incData).enter().append("tr").attr("class", "data")
    
    d3.selectAll("tr").selectAll("td").data(function (d) {
        return d3.entries(d)
    }).enter().append("td").html(function (d) {
        return d.value
    })
}