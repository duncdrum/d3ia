
d3.select("svg").on("touchstart", touchStatus);
d3.select("svg").on("touchmove", touchStatus);

var touchColor = d3.scaleLinear().domain([0, 10]).range([ "pink", "darkred"])

function touchStatus() {
    d3.event.preventDefault();
    d3.event.stopPropagation();
    d = d3.touches(this);
    d3.select("svg").selectAll("circle").data(d).enter().append("circle").attr("r", 75).style("fill", function (d, i) {
        return touchColor(i)
    });
    
    d3.select("svg").selectAll("circle").data(d).exit().remove();
    
    d3.select("svg").selectAll("circle").attr("cx", function (d) {
        return d[0]
    }).attr("cy", function (d) {
        return d[1]
    });
    
    var l =[];
    if (d.length &gt; 1) {
        for (x in d) {
            for (y in d) {
                if (y != x) {
                    var lineObj = {
                        source: d[x],
                        target: d[y]
                    };
                    l.push(lineObj);
                }
            }
        }
        d3.select("svg").selectAll("line").data(l).enter().append("line").style("stroke", "black").style("stroke-width", "3px");
        
        d3.select("svg").selectAll("line").attr("x1", function (d) {
            return d.source[0]
        }).attr("y1", function (d) {
            return d.source[1]
        }).attr("x2", function (d) {
            return d.target[0]
        }).attr("y2", function (d) {
            return d.target[1]
        })
    }
    d3.select("svg").selectAll("line").data(l).exit().remove();
}