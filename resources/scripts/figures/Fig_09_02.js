
window.onresize = function (event) {
    redraw();
}

d3.json("../data/source/tweets.json", function (error, data) {
    main(data.tweets)
});

//  d3.selectAll("svg").append("rect").attr("width", 100).attr("height", 100);

function main(incData) {
    createSpreadsheet(incData, "#controls");
    
    var nestedTweets = d3.nest()
    .key(function (el) { return el.user })
    .entries(incData);
    
     packableTweets = d3.hierarchy({
        id: "root", values: nestedTweets
    },
    function (d) {return d.values})
    .sum(function (d) {return d.children ? 0: 1;}) /*shouldn't thins be done under nest.rollup()*/
    .sort(null);
    
    createBar(nestedTweets, "#rightSVG");
    createPack(packableTweets, "#leftSVG");
    redraw();
}

function canvasSize(targetElement) {
    var newHeight = parseFloat(d3.select(targetElement).node().clientHeight);
    var newWidth = parseFloat(d3.select(targetElement).node().clientWidth);
    return[newWidth, newHeight];
}

function redraw() {
    var leftSize = canvasSize("#leftSVG");
    packChart.size(leftSize)
    
    d3.select("#leftSVG").selectAll("circle").data(packChart(packableTweets)).attr("r", function (d) {
        return d.r - (d.depth * 0)
    }).attr("cx", function (d) {
        return d.x
    }).attr("cy", function (d) {
        return d.y
    }).style("stroke", "black").style("stroke", "2px")
    
    var rectNumber = d3.select("#rightSVG").selectAll("rect").size();
    var rectData = d3.select("#rightSVG").selectAll("rect").data();
    var rectMax = d3.max(rectData, function (d) {
        return d.values.length
    });
    
    var rightSize = canvasSize("#rightSVG");
    
    barXScale = d3.scaleBand()
    .domain(rectData.map(function (d) {  return d.key }))
    .range([0, rightSize[0]]);
    
    barYScale = d3.scaleLinear()
    .domain([0, rectMax])
    .range([rightSize[1], 0])
    
    d3.select("#rightSVG")
    .selectAll("rect")
    .attr("x", function (d, i) { return barXScale(d.key) + 5 })
    .attr("width", function () { return barXScale.range() - 5 })
    .attr("y", function (d) { return barYScale(d.values.length) })
    .attr("height", function (d) { return rightSize[1] - barYScale(d.values.length) })
}

function createBar(incData, targetSVG) {
    
    d3.select(targetSVG).selectAll("rect").data(incData).enter().append("rect").attr("fill", "darkred")
}

function createPack(incData, targetSVG) {
    
    var depthScale = d3.scaleQuantize().domain([0, 1, 2]).range(colorbrewer.Reds[3]);
    
    packChart = d3.pack()
        .size([500, 500])
        .padding(3)
        packChart(incData);
/*        .children(function (d) { return d.values })
        .value(function (d) { return 1 });*/
    
    d3.select(targetSVG).append("g").attr("transform", "translate(0,0)").selectAll("circle").data(incData.descendants()).enter().append("circle").style("fill", function (d) {
        return depthScale(d.depth)
    });
}
function createSpreadsheet(incData, targetDiv) {
    
    var keyValues = d3.keys(incData[0])
    
    d3.select(targetDiv).append("div").attr("class", "table")
    
    d3.select("div.table").append("div").attr("class", "head row").selectAll("div.data").data(keyValues).enter().append("div").attr("class", "data").html(function (d) {
        return d
    }).style("left", function (d, i) {
        return (i * 100) + "px"
    });
    
    d3.select("div.table").selectAll("div.datarow").data(incData, function (d) {
        return d.content
    }).enter().append("div").attr("class", "datarow row").style("top", function (d, i) {
        return (40 + (i * 40)) + "px"
    });
    
    d3.selectAll("div.datarow").selectAll("div.data").data(function (d) {
        return d3.entries(d)
    }).enter().append("div").attr("class", "data").html(function (d) {
        return d.value
    }).style("left", function (d, i, j) {
        return (i * 100) + "px"
    });
    
    
    function restoreRows() {
        d3.selectAll("div.datarow").transition().duration(2000).style("top", function (d, i) {
            return (40 + (i * 40)) + "px"
        });
    }
    function sortColumns() {
        d3.selectAll("div.row").selectAll("div.data").transition().duration(10000).style("left", function (d, i, j) {
            return (Math.abs(i - 4) * 100) + "px"
        });
    }
    
    function restoreColumns() {
        d3.selectAll("div.row").selectAll("div.data").transition().duration(2000).style("left", function (d, i, j) {
            return (i * 100) + "px"
        });
    }
    
    function sortRows() {
        var dataset = d3.selectAll("div.datarow").data();
        dataset.sort(function (a, b) {
            var aDate = new Date(a.timestamp);
            var bDate = new Date(b.timestamp);
            if (aDate > bDate)
            return 1;
            if (aDate < bDate)
            return -1;
            return 0;
        });
        d3.selectAll("div.datarow").data(dataset, function (d) {
            return d.content
        }).transition().duration(2000).style("top", function (d, i) {
            return (40 + (i * 40)) + "px"
        });
    }
}