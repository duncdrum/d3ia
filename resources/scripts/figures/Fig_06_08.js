var marker = d3.select("svg")
.append('defs')
.append('marker')
.attr("id", "Triangle")
.attr("refX", 12).attr("refY", 6)
.attr("markerUnits", 'userSpaceOnUse')
.attr("markerWidth", 12)
.attr("markerHeight", 18)
.attr("orient", 'auto')
.append('path')
.attr("d", 'M 0 0 12 6 0 12 3 6');

queue()
.defer(d3.csv, "../data/source/nodelist.csv")
.defer(d3.csv, "../data/source/edgelist.csv")
.await(function (error, file1, file2) {
   /* delete file1.columns; //if you can't beat em, nuke em
    delete file2.columns;*/
    createForceLayout(file1, file2);
});

function createForceLayout(nodes, edges) {
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
    
    //      chargeScale = d3.scaleLinear().domain(d3.extent(nodes, function(d) {return d.followers})).range([-500,-2000])
    //      nodeSize = d3.scaleLinear().domain(d3.extent(nodes, function(d) {return d.followers})).range([5,20])
    var weightScale = d3.scaleLinear()
    .domain(d3.extent(edges, function (d) { return d.weight }))
    .range([.1, 1])
    
    force = d3.forceSimulation(nodes)
    //      .charge(-1000)
    .force("charge", d3.forceManyBody()
      .strength(-65))    
    .force("link", d3.forceLink(edges)
    //.strength (function (d) {return weightScale(d.weight)})
    .distance(50))
    .force("center", d3.forceCenter(250, 250)) //  width / 2, height / 2
     .on("tick", forceTick);
     
     //break
         
    
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
    
    nodeEnter
    .append("circle")
    .attr("r", 5)
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
    force.restart();
    
    function forceTick() {
        d3.selectAll("line.link")
        .attr("x1", function (d) { return d.source.x })
        .attr("x2", function (d) { return d.target.x })
        .attr("y1", function (d) { return d.source.y })
        .attr("y2", function (d) { return d.target.y });
        
        d3.selectAll("g.node")
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")" })
    }
}

function dragstarted(d) {
  if (!d3.event.active) force.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) force.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}