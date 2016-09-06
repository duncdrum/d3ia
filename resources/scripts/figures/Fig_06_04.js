
queue()
.defer(d3.csv, "../data/source/nodelist.csv")
.defer(d3.csv, "../data/source/edgelist.csv")
.await(function (error, file1, file2) {
    delete file1.columns; //if you can't beat em, nuke em
    delete file2.columns;
    createAdjacencyMatrix(file1, file2);
});

function createAdjacencyMatrix(nodes, edges) {
    var edgeHash = {};
    for (x in edges) {
        var id = edges[x].source + "-" + edges[x].target;
        edgeHash[id] = edges[x];
    }
    matrix =[];
    //create all possible edges
    for (a in nodes) {
        for (b in nodes) {
            var grid = {
                id: nodes[a].id + "-" + nodes[b].id, x: b, y: a, weight: 0
            };
            if (edgeHash[grid.id]) {
                grid.weight = edgeHash[grid.id].weight;
            }
            matrix.push(grid);
        }
    }
    
    d3.select("svg")
    .append("g")
    .attr("transform", "translate(50,50)")
    .attr("id", "adjacencyG")
    .selectAll("rect")
    .data(matrix)
    .enter()
    .append("rect")
    .attr("width", 25)
    .attr("height", 25)
    .attr("x", function (d) { return d.x * 25 })
    .attr("y", function (d) { return d.y * 25 })
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("fill", "red")
    .style("fill-opacity", function (d) { return d.weight * .2 })
    .on("mouseover", gridOver)
    
    var scaleSize = nodes.length * 25;
    var nameScale = d3.scalePoint()

    .domain(nodes.map(function (el) { return el.id }))
    .range([0, scaleSize], 1);
    
    xAxis = xAxis = d3.axisTop()
    .scale(nameScale)
    .tickSize(4);
    
    yAxis = d3.axisLeft()
    .scale(nameScale)
    .tickSize(4);
    
    d3.select("#adjacencyG")
    .append("g")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("transform", "translate(-10,-10) rotate(90)");
    
    d3.select("#adjacencyG")
    .append("g")
    .call(yAxis);
    
    function gridOver(d, i) {
        d3.selectAll("rect")
        .style("stroke-width", function (p) {
            return p.x == d.x || p.y == d.y ? "3px": "1px"
        })
    }
}

// Uncomment below to use JSON with custom D3 module


/*d3.json('../data/source/network.json', createAdjacencyMatrix);

function createAdjacencyMatrix(data) {
  // TODO: refactor d3AdjacencyMatrixLayout to make this function call more concise
  const adjacencyMatrix = d3AdjacencyMatrixLayout.d3AdjacencyMatrixLayout();

  adjacencyMatrix
    .size([530,530])
    .nodes(data.nodes)
    .links(data.links)
    .directed(false)
    .nodeID(function(d) { return data.name});

  const matrixData = adjacencyMatrix();

  console.log(matrixData)

  const someColors = d3.scaleOrdinal(d3.schemeCategory10);
    

  d3.select('svg')
    .append('g')
      .attr('transform', 'translate(30,30)')
      .attr('id', 'adjacencyG')
      .selectAll('rect')
      .data(matrixData)
      .enter()
      .append('rect')
        .attr('width', function(d) { return  d.width })
        .attr('height', function(d) { return  d.height })
        .attr('x', function(d) { return  d.x })
        .attr('y', function(d) { return  d.y })
        .style('stroke', 'black')
        .style('stroke-width', '1px')
        .style('stroke-opacity', .1)
        .style('fill', "red")
        .style('fill-opacity', function(d) { return  d.weight * 0.2 })
        ;

  d3.select('#adjacencyG')
    .call(adjacencyMatrix.xAxis);

  d3.select('#adjacencyG')
    .call(adjacencyMatrix.yAxis);
}*/
