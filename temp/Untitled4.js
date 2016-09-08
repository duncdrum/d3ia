d3.queue()
.defer(d3.csv, "../data/source/nodelist.csv")
.defer(d3.csv, "../data/source/edgelist.csv")
.await(function (error, file1, file2) {
    delete file1.columns; //if you can't beat em, nuke em
    delete file2.columns;
    test(file1, file2);
});

function test(nodes, edges) {

var nodeHash = {
    };
    for (x in nodes) {
        nodeHash[nodes[x].id] = nodes[x];
    }
    for (x in edges) {
        edges[x].weight = parseInt(edges[x].weight);
        edges[x].source = nodeHash[edges[x].source];
        edges[x].target = nodeHash[edges[x].target];
    }
    
    var weightScale = d3.scaleLinear()
    .domain(d3.extent(edges, function (d) { return d.weight }))
    .range([.1, 1])
    
    var newNodes = d3.map(nodes, function(d) {return d.id});
    var forceLink = d3.forceLink()
        .links(edges)
        .id(function(d) { return d.index })
        .strength (function (d) {return weightScale(d.weight)})
        .distance(55);
    
    graph = d3.forceSimulation()
    .nodes(nodes)
    .force("charge", d3.forceManyBody()
      .strength(-75)  // -1000
      .distanceMax([250]))    
    .force("link", d3.forceLink()
        .links(edges)
/*        .id(function(d) { return d.index })*/
        .strength (function (d) {return weightScale(d.weight)})
        .distance(55))
    .force("center", d3.forceCenter(250, 250)) //  width / 2, height / 2
    .on("tick", forceTick);
         
    
    d3.select("svg")
    .selectAll("line.link")
    .data(edges, function (d) { return d.source.id + "-" + d.target.id })
    .enter()
    .append("line")
    .attr("class", "link")
    .style("stroke", "black")
    .style("opacity", .5)
    .style("stroke-width", function (d) { return d.weight });
    
    var nodeEnter = d3.select("svg")
    .selectAll("g.node")
    .data(nodes, function (d) { return d.id  })
    .enter()
    .append("g")
    .attr("class", "node")
    .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
    .on("click", fixNode);
    
    function fixNode(d) {
        d3.select(this)
        .select("circle")
        .style("stroke-width", 4);
        d.fixed = true;
    }
    
    var degree = function() {    
    count = 0;
    var n = nodes.length, m = edges.length
    for (i = 0; i < m; ++i) {
        o = edges[i];
        if  (o.source == i ||  o.target == i) { count += 1;};
        }
        return count
        };
      
       /*force.start = function() {
      var i, n = nodes.length, m = links.length, w = size[0], h = size[1], neighbors, o;
      for (i = 0; i < n; ++i) {
        (o = nodes[i]).index = i;
        o.weight = 0;
      }
      for (i = 0; i < m; ++i) {
        o = links[i];
        if (typeof o.source == "number") o.source = nodes[o.source];
        if (typeof o.target == "number") o.target = nodes[o.target];
        ++o.source.weight;
        ++o.target.weight;
      }*/
    
    
    nodeEnter
    .append("circle")
    .attr("r",  degree)
    .style("fill", "lightgray")
    .style("stroke", "black")
    .style("stroke-width", "1px");
    
    nodeEnter
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", 15)
    .text(function (d) { return d.id })
    
    d3.selectAll("line")
    .attr("marker-end", "url(#Triangle)");
    graph.restart();
    
    function forceTick() {
        d3.selectAll("line.link")
        .attr("x1", function (d) { return d.source.x })
        .attr("x2", function (d) { return d.target.x })
        .attr("y1", function (d) { return d.source.y })
        .attr("y2", function (d) { return d.target.y });        

        
        d3.selectAll("g.node")
        .attr("cx", function(d) { return d.x = Math.max(15, Math.min(500 - 15, d.x)); }) // Bounding box
        .attr("cy", function(d) { return d.y = Math.max(15, Math.min(500 - 15, d.y)); }) // Bounding box
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")" })
    }
    
    function dragstarted(d) {
  if (!d3.event.active) graph.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) graph.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

}