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

d3.queue()
.defer(d3.csv, "../data/source/nodelist.csv")
.defer(d3.csv, "../data/source/edgelist.csv")
.await(function (error, file1, file2) {
    delete file1.columns; //if you can't beat em, nuke em
    delete file2.columns;
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
    
    var nodes = nodes
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


/*d3.select("#controls").append("button").on("click", sizeByDegree).html("Degree Size");*/
/*d3.select("#controls").append("button").on("click", addEdge).html("Add Edge");*/
/*d3.select("#controls").append("button").on("click", filterNetwork).html("Filter Network");*/
/*d3.select("#controls").append("button").on("click", addNodesAndEdges).html("Add Nodes & Edges");*/
d3.select("#controls").append("button").on("click", moveNodes).html("Scatterplot");


/*function sizeByDegree() {
    graph.stop();
    d3.selectAll("circle")
    .attr("r", function(d, i) { count = 0; 
        edges.forEach(function(l) { 
        if (l.source == i || l.target == i) { count += 1;}; }); 
        return count;}) // there is no more weight attribute in v4 for nodes     
}*/


/*function addEdge() {
    graph.stop();
    var oldEdges = graph.links();
    var nodes = graph.nodes();
    newEdge = {
        source: nodes[0], target: nodes[8], weight: 5
    };
    oldEdges.push(newEdge);
    graph.links(oldEdges);
    d3.select("svg").selectAll("line.link").data(oldEdges, function (d) {
        return d.source.id + "-" + d.target.id
    }).enter().insert("line", "g.node").attr("class", "link").style("stroke", "red").style("stroke-width", 5).attr("marker-end", "url(#Triangle)");
    
    graph.restart();
}*/


/*
function filterNetwork() {
    graph.stop()
    originalNodes = graph.nodes();
    originalLinks = graph.links();
    influentialNodes = originalNodes.filter(function (d) {
        return d.followers > 20
    });
    influentialLinks = originalLinks.filter(function (d) {
        return influentialNodes.indexOf(d.source) > -1 && influentialNodes.indexOf(d.target) > -1
    });
    
    d3.selectAll("g.node").data(influentialNodes, function (d) {
        return d.id
    }).exit().transition().duration(12000).style("opacity", 0).remove();
    
    d3.selectAll("line.link").data(influentialLinks, function (d) {
        return d.source.id + "-" + d.target.id
    }).exit().transition().duration(9000).style("opacity", 0).remove();
    
    graph.nodes(influentialNodes).links(influentialLinks)
    
    graph.restart()
}


function addNodesAndEdges() {
    graph.stop();
    var oldEdges = graph.links();
    var oldNodes = graph.nodes();
    newNode1 = {
        id: "raj", followers: 100, following: 67
    };
    newNode2 = {
        id: "wu", followers: 50, following: 33
    };
    newEdge1 = {
        source: oldNodes[0], target: newNode1, weight: 5
    };
    newEdge2 = {
        source: oldNodes[0], target: newNode2, weight: 5
    };
    oldEdges.push(newEdge1, newEdge2);
    oldNodes.push(newNode1, newNode2);
    graph.links(oldEdges).nodes(oldNodes);
    
    d3.select("svg").selectAll("line.link").data(oldEdges, function (d) {
        return d.source.id + "-" + d.target.id
    }).enter().insert("line", "g.node").attr("class", "link").style("stroke", "red").style("stroke-width", 5).attr("marker-end", "url(#Triangle)");
    
    var nodeEnter = d3.select("svg").selectAll("g.node").data(oldNodes, function (d) {
        return d.id
    }).enter().append("g").attr("class", "node").call(graph.drag())
    
    nodeEnter.append("circle").attr("r", 5).style("fill", "red").style("stroke", "darkred").style("stroke-width", "2px");
    
    nodeEnter.append("text").style("text-anchor", "middle").attr("y", 15).text(function (d) {
        return d.id
    })
    
    graph.restart();
}
*/

function moveNodes() {
    var xExtent = d3.extent(graph.nodes(), 
        function (d) { return parseInt(d.followers) })
    
    var yExtent = d3.extent(graph.nodes(), 
        function (d) { return parseInt(d.following) })
    
    var xScale = d3.scaleLinear()
    .domain(xExtent)
    .range([50, 450])
    
    var yScale = d3.scaleLinear()
    .domain(yExtent)
    .range([450, 50])
    
    graph.stop();
    
    d3.selectAll("g.node")
    .transition()
    .duration(1000)
    .attr("transform", function (d) {
        return "translate(" + xScale(d.followers) + "," + yScale(d.following) + ")"
    })
    
    d3.selectAll("line.link")
    .transition()
    .duration(1000)
    .attr("x1", function (d) { return xScale(d.source.followers) })
    .attr("y1", function (d) { return yScale(d.source.following) })
    .attr("x2", function (d) { return xScale(d.target.followers) })
    .attr("y2", function (d) { return yScale(d.target.following) })
    
    xAxis = d3.axisBottom()
    .scale(xScale)
    .tickSize(4);
    
    yAxis = d3.axisRight()
    .scale(yScale)
    .tickSize(4);
    
    d3.select("svg")
    .append("g")
    .attr("transform", "translate(0,460)")
    .call(xAxis);
    
    d3.select("svg")
    .append("g")
    .attr("transform", "translate(460,0)")
    .call(yAxis);
    
    d3.selectAll("g.node")
    .each(function (d) {
        d.x = xScale(d.followers);
        d.px = xScale(d.followers);
        d.y = yScale(d.following);
        d.py = yScale(d.following);
    })
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