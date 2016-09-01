d3.json("../data/source/tweets.json",
function (error, data) {dataViz(data.tweets)});

function dataViz(incData) {
    
    nestedTweets = d3.nest()
    .key(function (el) {return el.user})
    .entries(incData);
    
    packableTweets = d3.hierarchy({id: "root", values: nestedTweets},
    function (d) {return d.values})
    .sum(function (d) {return d.children ? 0: 1;})
    .sort(null);
    
    var depthScale = d3.scaleOrdinal(d3.schemeCategory10);
    
    treeChart = d3.tree()
    .size([200, 200]);

    treeChart(packableTweets)
    
    var linkGenerator = d3.radialLine()    
    .angle(function (d) {return d.x / 180 * Math.PI})
    .radius(function (d) {return d.y / 180 * Math.PI})
    
    linkGenerator(packableTweets)
    
    d3.select("svg")
    .append("g")
    .attr("class", "treeG")
    .selectAll("g")
    .data(packableTweets.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"});
    
    d3.selectAll("g.node")
    .append("circle")
    .attr("r", 10)
    .style("fill", function (d) {return depthScale(d.depth)})
    .style("stroke", "white")
    .style("stroke-width", "2px");
    
    d3.selectAll("g.node")
    .append("text")
    .text(function (d) {return (d.data.id || d.data.key || d.data.content)})

    
    d3.select("g.treeG")
    .selectAll("path")
    .data(packableTweets.descendants().slice(1))
    .enter()
    .insert("path", "g")
    .attr("d", function(d) {
         return "M" + project(d.x, d.y)
            + "C" + project(d.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, d.parent.y);
      })  
    .style("fill", "none")
    .style("stroke", "black")
    .style("stroke-width", "2px");
    
    treeZoom = d3.zoom()
    .on("zoom", zoomed);
    
    d3.select("svg")
    .call(treeZoom)
    
    function zoomed() {
        d3.select("g.treeG")
        .attr("transform", d3.event.transform)
        }
        
    function project(x, y) {
    var angle = (x - 90) / 180 * Math.PI, radius = y;
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
        }     
}
