d3.json("realestate.json", function (data) {
    realEstate(data)
});

function realEstate(data) {
    d3.select("svg").style("width", "80%").style("float", "left");
    d3.select("#vizcontainer").append("div").attr("id", "list").style("float", "left").style("height", "90%").style("width", "18%").style("overflow", "auto");
    d3.select("#vizcontainer").append("div").attr("id", "modal");
    
    d3.select("#list").append("ol").selectAll("li").data(data).enter().append("li").attr("class", "datapoint").html(function (d) {
        return d.name
    }).on("mouseover", highlightDatapoint)
    screenHeight = parseFloat(d3.select("svg").node().clientHeight || d3.select("svg").node().parentNode.clientHeight);
    screenWidth = parseFloat(d3.select("svg").node().clientWidth || d3.select("svg").node().parentNode.clientWidth);
    
    sizeExtent = d3.extent(data, function (d) {
        return d.size
    })
    valueExtent = d3.extent(data, function (d) {
        return d.value
    })
    xScale = d3.scaleLinear().domain(sizeExtent).range([40, screenWidth -40])
    yScale = d3.scaleLinear().domain(valueExtent).range([screenHeight -40, 40])
    d3.select("svg").append("g").attr("id", "dataG").selectAll("g.datapoint").data(data, function (d) {
        return d.name
    }).enter().append("g").attr("class", "datapoint");
    
    
    locationScale = d3.scaleOrdinal().domain([ "Rural", "Coastal", "Suburb", "City"]).range(colorbrewer.Reds[4]);
    typeShape = {
        "Spanish": "circle", "Craftsman": "cross", "Ranch": "square", "McMansion": "triangle-down"
    };
    
    dataG = d3.selectAll("g.datapoint").attr("transform", function (d) {
        return "translate(" + xScale(d.size) + "," + yScale(d.value) + ")"
    }).each(function (d) {
        houseSymbol = d3.svg.symbol().type(typeShape[d.type]).size(64);
        d3.select(this).append("path").attr("d", houseSymbol).style("fill", locationScale(d.location)).style("stroke", "black").style("stroke-width", "1px").on("mouseover", highlightDatapoint)
    })
    
    xAxis = d3.svg.axis().scale(xScale).orient("top").tickSize(4);
    yAxis = d3.svg.axis().scale(yScale).orient("right").tickSize(4);
    d3.select("svg").append("g").attr("id", "xAxisG").attr("class", "axis").attr("transform", "translate(0," +(screenHeight - 20) + ")").call(xAxis);
    d3.select("svg").append("g").attr("id", "yAxisG").attr("class", "axis").attr("transform", "translate(20,0)").call(yAxis);
    //    d3.select("body").append("button").html("Tablet").on("click", tabletView)
    var screenSize = screen.width;
    if (screenSize < 480) {
        phoneView();
    } else if (screenSize < 1000) {
        tabletView();
    }
    
    function highlightDatapoint(d) {
        d3.selectAll("li.datapoint").style("font-weight", function (p) {
            return p == d ? 900: 100
        })
        d3.selectAll("g.datapoint").select("path").style("stroke-width", function (p) {
            return p == d ? "3px": "1px"
        })
        var modal = d3.select("#modal").style("top", yScale(d.value) - 135).style("left", xScale(d.size) - 100);
        modal.selectAll("*").remove();
        modal.append("p").html(d.name)
        modal.append("p").html("Location: " + d.location)
        modal.append("p").html("Style: " + d.type)
        modal.append("p").html("Size: " + d.size + "Sq. Ft.")
        modal.append("p").html("Value: $" + d.value)
    }
    function tabletView() {
        d3.select("svg").style("width", "100%");
        
        screenWidth = parseFloat(d3.select("svg").node().clientWidth || d3.select("svg").node().parentNode.clientWidth);
        
        d3.select("#list").remove();
        var cellWidth = screenWidth / 18;
        var cellHeight = screenHeight / 14;
        sortedData = data.sort(function (a, b) {
            if (a.value > b.value)
            return 1;
            if (a.value < b.value)
            return -1;
            return 0;
        });
        d3.selectAll("g.datapoint").data(sortedData, function (d) {
            return d.name
        }).transition().duration(1000).attr("transform", function (d, i) {
            return "translate(" +((Math.floor(i / 6) + .5) * cellWidth) + "," +((i % 6 + .5) * cellHeight) + ")"
        });
        
        d3.selectAll("g.datapoint").select("path").on("mouseover", null).each(function (d) {
            houseSymbol = d3.svg.symbol().type(typeShape[d.type]).size(512);
            d3.select(this).transition().duration(1000).attr("d", houseSymbol);
        })
        
        xScale.range([40, screenWidth -40])
        
        xAxis.orient("bottom").scale(xScale);
        
        yScale.range([40, screenWidth -40])
        yAxis.orient("bottom").scale(yScale);
        
        sizeBrush = d3.brush().x(xScale).extent(sizeExtent).on("brush", brushed);
        
        valueBrush = d3.brush().x(yScale).extent(valueExtent).on("brush", brushed);
        
        d3.select("#xAxisG").transition().duration(1000).attr("transform", "translate(0," +(screenHeight - 150) + ")").call(xAxis);
        d3.select("#yAxisG").transition().duration(1000).attr("transform", "translate(0," +(screenHeight - 50) + ")").call(yAxis);
        
        d3.select("#xAxisG").append("g").attr("class", "brushG").attr("transform", "translate(0,-80)").call(sizeBrush).insert("text", "rect").attr("class", "brushLabel").text("Square Footage").attr("x", screenWidth / 2).attr("y", 50);
        d3.select("#yAxisG").append("g").attr("class", "brushG").attr("transform", "translate(0,-80)").call(valueBrush).insert("text", "rect").attr("class", "brushLabel").text("Home Value").attr("x", screenWidth / 2).attr("y", 50);
        
        d3.selectAll(".brushG").selectAll("rect").attr("height", 80);
        d3.selectAll(".brushG").selectAll(".resize").append("circle").attr("r", 40).attr("cy", 40);
        function brushed() {
            d3.selectAll("g.datapoint").each(function (d) {
                var color = locationScale(d.location);
                if (d.value < valueBrush.extent()[0] || d.value > valueBrush.extent()[1] || d.size < sizeBrush.extent()[0] || d.size > sizeBrush.extent()[1]) {
                    color = "lightgray";
                }
                d3.select(this).select("path").style("fill", color);
            })
        }
    }
    function phoneView() {
        initialLength = 0;
        for (x in data) {
            data[x].oValue = data[x].value;
        }
        nestedTweets = d3.nest().key(function (d) {
            return d.location
        }).entries(data);
        
        for (x in nestedTweets) {
            var subNestedTweets = d3.nest().key(function (d) {
                return d.type
            }).entries(nestedTweets[x].values);
            nestedTweets[x].values = subNestedTweets;
        }
        
        packableTweets = {
            id: "root", key: "All Real Estate", values: nestedTweets
        }
        
        d3.select("svg").style("width", "100%").on("touchstart", pinchInitial).on("touchend", pinchCheck);
        
        function pinchInitial() {
            var touches = d3.touches(this);
            if (touches.length > 2) {
                initialLength = Math.sqrt(Math.abs(initialD[0][0] - initialD[1][0]) + Math.abs(initialD[0][1] - initialD[1][1]));
            }
        }
        
        function pinchCheck() {
            var touches = d3.touches(this);
            if (touches.length > 2) {
                if (initialLength > Math.sqrt(Math.abs(initialD[0][0] - initialD[1][0]) + Math.abs(initialD[0][1] - initialD[1][1]))) {
                    changeView(packableTweets);
                }
            }
        }
        
        screenWidth = parseFloat(d3.select("svg").node().clientWidth || d3.select("svg").node().parentNode.clientWidth);
        d3.select("#list").remove();
        d3.selectAll("g.axis").remove();
        
        circleSize = d3.scaleLinear().domain(sizeExtent).range([2, 10])
        circleStroke = d3.scaleLinear().domain(valueExtent).range([1, 5])
        
        packChart = d3.pack();
        packChart.size([screenWidth, screenHeight -200]).children(function (d) {
            return d.values
        }).value(function (d) {
            return circleSize(d.size)
        })
        
        d3.selectAll("g.datapoint").select("path").style("pointer-events", "none");
        
        d3.select("#dataG").attr("transform", "translate(0,100)").selectAll("circle").data(packChart(packableTweets)).enter().insert("circle", "g").attr("class", "pack").style("fill", "white").style("stroke", "black").style("stroke-width", function (d) {
            return circleStroke(d.oValue)
        }).on("touchmove", changeView).on("click", changeView);
        
        d3.select("#vizcontainer").append("div").attr("class", "viewTitle").html("Current View")
        
        var viewStats = d3.select("#vizcontainer").append("div").attr("class", "viewStats");
        viewStats.append("div").attr("id", "viewValue").html("Average Value");
        viewStats.append("div").attr("id", "viewSize").html("Average Size");
        
        changeView(packableTweets)
        
        function changeView(d) {
            newScale = (screenHeight / 2) / (d.r + 100)
            d3.select("#dataG").selectAll("circle").style("fill", function (p) {
                return p == d ? "lightgray": "white"
            })
            d3.select("#dataG").selectAll("circle").style("pointer-events", function (p) {
                return (p.depth == d.depth || p.parent == d) && p != d ? "auto": "none"
            })
            d3.select("#dataG").transition().duration(1000).attr("transform", "translate(" + ((screenWidth / 2) -(d.x * newScale)) + "," + ((screenHeight / 2) -(d.y * newScale)) + ")");
            
            d3.selectAll("circle.pack").transition().duration(1000).attr("r", function (d) {
                return d.r * newScale
            }).attr("cx", function (d) {
                return d.x * newScale
            }).attr("cy", function (d) {
                return d.y * newScale
            })
            
            
            symbolSize = d3.scaleLinear().domain(sizeExtent).range([100 * newScale, 180 * newScale])
            
            d3.selectAll("g.datapoint").transition().duration(1000).attr("transform", function (d) {
                return "translate(" + (d.x * newScale) + "," + (d.y * newScale) + ")"
            }).select("path").each(function (d) {
                houseSymbol = d3.svg.symbol().type(typeShape[d.type]).size(symbolSize(d.size));
                d3.select(this).transition().duration(1000).attr("d", houseSymbol);
            })
            
            calculateStatistics(d);
            
            function calculateStatistics(d) {
                if (d.name) {
                    d3.select("div.viewTitle").html(d.parent.parent.key + " - " + d.parent.key + "<br>" + d.name);
                    d3.select("#viewValue").html("Value: $" + d.oValue);
                    d3.select("#viewSize").html("Size: " + d.size + " square feet");
                } else {
                    var allDatapoints = allChildren(d);
                    console.log(allDatapoints)
                    var averageValue = d3.mean(allDatapoints, function (d) {
                        return d.oValue
                    })
                    var averageSize = d3.mean(allDatapoints, function (d) {
                        return d.size
                    })
                    d3.select("div.viewTitle").html(d.depth == 2 ? d.parent.key + " - " + d.key: d.key);
                    d3.select("#viewValue").html("Average Value: $" + d3.format("0,000")(Math.floor(averageValue)));
                    d3.select("#viewSize").html("Average Size: " + d3.format("0,000")(Math.floor(averageSize)) + " square feet");
                }
                
                function allChildren(d) {
                    var childArray =[];
                    for (x in d.values) {
                        if (d.values[x].name) {
                            childArray.push(d.values[x]);
                        } else {
                            childArray = allChildren(d.values[x]);
                        }
                    }
                    return childArray;
                }
            }
        }
    }
}