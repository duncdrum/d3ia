d3.csv("../data/source/worldcup.csv", function (data) {
    overallTeamViz(data);
}) 

function overallTeamViz(incomingData) {
    d3.select("svg").append("g").attr("id", "teamsG").attr("transform", "translate(50,300)").selectAll("g").data(incomingData).enter().append("g").attr("class", "overallG").attr("transform", function (d, i) {
        return "translate(" + (i * 50) + ", 0)"
    });
    var teamG = d3.selectAll("g.overallG");
    teamG.append("circle").attr("r", 20);
    teamG.append("text").style("text-anchor", "middle").attr("y", 30).text(function (d) {
        return d.team
    });
    var dataKeys = d3.keys(incomingData[0]).filter(function (el) {
        return el != "team" && el != "region"
    }) 
    
    d3.select("#controls").selectAll("button.teams").data(dataKeys).enter().append("button").on("click", buttonClick).html(function (d) {
        return d
    });
    function buttonClick(datapoint) {
        var maxValue = d3.max(incomingData, function (d) {
            return parseFloat(d[datapoint])
        });
        var radiusScale = d3.scale.linear().domain([0, maxValue]).range([2, 20]);
        d3.selectAll("g.overallG").select("circle").transition().duration(1000).attr("r", function (d) {
            return radiusScale(d[datapoint])
        })
    }
    teamG.on("mouseover", highlightRegion);
    teamG.on("mouseout", unHighlight);
    function highlightRegion(d, i) {
        d3.select(this).select("text").attr("y", 10).classed("highlight", true);
        d3.selectAll("g.overallG").each(function (p, i) {
            p.region == d.region ? d3.select(this).select("circle").classed("active", true): d3.select(this).select("circle").classed("inactive", true)
        }) 
        this.parentElement.appendChild(this);
    }
    function unHighlight() {
        d3.selectAll("g.overallG").select("circle").classed("active", false).classed("inactive", false);
        d3.selectAll("g.overallG").select("text").attr("y", 30).classed("highlight", false);
    }
}