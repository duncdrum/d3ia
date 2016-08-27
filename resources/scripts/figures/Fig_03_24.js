d3.csv("worldcup.csv", function (data) {
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
    
    d3.html("resources/icon.svg", loadSVG);
    
    function loadSVG(svgData) {
        d3.selectAll("g.overallG").each(function () {
            var gParent = this;
            d3.select(svgData).selectAll("path").each(function () {
                gParent.appendChild(this.cloneNode(true))
            })
        })
        
        recolorFootballs();
    }
    
    function recolorFootballs() {
        d3.selectAll("g.overallG").each(function (d) {
            d3.select(this).selectAll("path").datum(d)
        })
        
        var tenColorScale = d3.scale.category10([ "UEFA", "CONMEBOL", "CAF", "AFC"]);
        
        d3.selectAll("path").style("fill", function (p) {
            return tenColorScale(p.region)
        }).style("stroke", "black").style("stroke-width", "2px");
    }
}