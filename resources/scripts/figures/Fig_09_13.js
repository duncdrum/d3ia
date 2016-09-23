window.onresize = function (event) {
    redraw();
}
function hover(hoverD) {
    d3.selectAll("circle.pack").filter(function (d) {
        return d == hoverD
    }).style("fill", "#94B8FF");
    d3.selectAll("div.datarow").filter(function (d) {
        return d == hoverD
    }).style("background", "#94B8FF");
    d3.selectAll("rect.bar").filter(function (d) {
        return d == hoverD
    }).style("fill", "#94B8FF");
    d3.selectAll("rect.bar").filter(function (d) {
        return d.values.indexOf(hoverD) > -1
    }).style("fill", "#94B8FF");
}
function mouseOut() {
    d3.selectAll("circle.pack").style("fill", function (d) {
        return depthScale(d.depth)
    });
    d3.selectAll("rect.bar").style("fill", "gray").style("stroke-width", 0);
    d3.selectAll("div.datarow").style("background", "white");
}
d3.json("../data/source/tweets.json", function (error, data) {
    main(data.tweets)
});
function main(incData) {
    createSpreadsheet(incData, "#spreadsheet");
    var nestedTweets = d3.nest().key(function (el) {
        return el.user
    }).entries(incData);
    packableTweets = {
        id: "root", values: nestedTweets
    }
    createBar(nestedTweets, "#rightSVG");
    createPack(packableTweets, "#leftSVG");
    createBrush(incData);
    redraw();
}
function createBrush(incData) {
    timeRange = d3.extent(incData.map(function (d) {
        return new Date(d.timestamp)
    }));
    timeScale = d3.time.scale().domain(timeRange).range([10, 990]);
    timeAxis = d3.svg.axis().scale(timeScale).orient('bottom').ticks(d3.time.hours, 2).tickFormat(d3.time.format('%I%p'));
    timeBrush = d3.svg.brush().x(timeScale).extent(timeRange).on("brush", brushed);
    var brushSVG = d3.select("#brush").append("svg").attr("height", "100%").attr("width", "100%");
    brushSVG.append("g").attr("transform", "translate(0,100)").attr("id", "brushAxis").call(timeAxis);
    brushSVG.append("g").attr("transform", "translate(0,50)").attr("id", "brushG").call(timeBrush).selectAll("rect").attr("height", 50);
    function brushed() {
        var rightSize = canvasSize("#rightSVG");
        var e = timeBrush.extent();
        d3.selectAll("circle.pack").filter(function (d) {
            return d.depth == 2
        }).style("display", function (d) {
            return new Date(d.timestamp) >= e[0] && new Date(d.timestamp) <= e[1] ? "block": "none"
        });
        d3.select("#rightSVG").selectAll("rect").attr("x", function (d, i) {
            return barXScale(d.key) + 5
        }).attr("width", function () {
            return barXScale.rangeBand() - 5
        }).attr("y", function (d) {
            return barYScale(filteredLength(d))
        }).style("stroke", "black").attr("height", function (d) {
            return rightSize[1] - barYScale(filteredLength(d))
        }) 
        function filteredLength(d) {
            var filteredValues = d.values.filter(function (p) {
                return new Date(p.timestamp) >= e[0] && new Date(p.timestamp) <= e[1]
            }) 
            return filteredValues.length;
        }
    }
}
function canvasSize(targetElement) {
    var newHeight = parseFloat(d3.select(targetElement).node().clientHeight);
    var newWidth = parseFloat(d3.select(targetElement).node().clientWidth);
    return[newWidth, newHeight];
}
function redraw() {
    var leftSize = canvasSize("#leftSVG");
    packChart.size(leftSize);
    d3.select("#leftSVG").selectAll("circle").attr("class", "pack").data(packChart(packableTweets)).attr("r", function (d) {
        return d.r - (d.depth * 0)
    }).attr("cx", function (d) {
        return d.x
    }).attr("cy", function (d) {
        return d.y
    }).style("stroke", "black").style("stroke", "2px").on("brushstart", function () {
        d3.select(this).style("stroke-width", "4px")
    }).on("brushend", function () {
        d3.select(this).style("stroke-width", "2px")
    });
    var rectNumber = d3.select("#rightSVG").selectAll("rect").size();
    var rectData = d3.select("#rightSVG").selectAll("rect").data();
    var rectMax = d3.max(rectData, function (d) {
        return d.values.length
    });
    var rightSize = canvasSize("#rightSVG");
    barXScale = d3.scale.ordinal().domain(rectData.map(function (d) {
        return d.key
    })).rangeBands([0, rightSize[0]]);
    barYScale = d3.scale.linear().domain([0, rectMax]).range([rightSize[1], 0]) 
    timeTickScale = d3.scale.linear().domain([0, 1000]).rangeRound([10, 1]).clamp(true);
    var bExtent = timeBrush.extent();
    timeScale.range([10, rightSize[0] + leftSize[0] - 10]);
    timeAxis.scale(timeScale).ticks(d3.time.hours, timeTickScale((rightSize[0] + leftSize[0])));
    timeBrush.x(timeScale);
    d3.select("#rightSVG").selectAll("rect").attr("x", function (d, i) {
        return barXScale(d.key) + 5
    }).attr("width", function () {
        return barXScale.rangeBand() - 5
    }).attr("y", function (d) {
        return barYScale(d.values.length)
    }).style("stroke", "black").attr("height", function (d) {
        return rightSize[1] - barYScale(d.values.length)
    }) 
    d3.select("#brushAxis").call(timeAxis);
    d3.select("#brushG").call(timeBrush.extent(bExtent));
    d3.select("#brushG").selectAll("circle.timeline").attr("cx", function (d) {
        return timeScale(new Date(d.timestamp))
    });
    var tweets = d3.selectAll("div.datarow").data();
    d3.selectAll("g.resize").append("circle").attr("r", 25).attr("cy", 25).style("fill", "white").style("stroke", "black").style("stroke-width", "4px").style("opacity", .75) 
    d3.select("#brushG").selectAll("circle.timeline").data(tweets).enter().append("circle").style("fill", "red").style("stroke", "black").style("stroke-width", "1px").style("pointer-events", "none").attr("class", "timeline").attr("r", 5).attr("cy", 25).attr("cx", function (d) {
        return timeScale(new Date(d.timestamp))
    })
}
function createBar(incData, targetSVG) {
    d3.select(targetSVG).selectAll("rect").data(incData).enter().append("rect").attr("class", "bar").attr("fill", "darkred").on("mouseover", hover).on("mouseout", mouseOut);
}
function createPack(incData, targetSVG) {
    depthScale = d3.scale.quantize().domain([0, 1, 2]).range(colorbrewer.Reds[3]);
    packChart = d3.layout.pack();
    packChart.size([500, 500]).children(function (d) {
        return d.values
    }).value(function (d) {
        return 1
    }) 
    d3.select(targetSVG).append("g").attr("transform", "translate(0,0)").selectAll("circle").data(packChart(incData)).enter().append("circle").style("fill", function (d) {
        return depthScale(d.depth)
    }).on("mouseover", hover).on("mouseout", mouseOut);
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
    }).on("mouseover", hover).on("mouseout", mouseOut);
    d3.selectAll("div.datarow").selectAll("div.data").data(function (d) {
        return d3.entries(d)
    }).enter().append("div").attr("class", "data").html(function (d) {
        return d.value
    }).style("left", function (d, i, j) {
        return (i * 100) + "px"
    });
}