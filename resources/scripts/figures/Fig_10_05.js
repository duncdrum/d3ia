d3.json("../data/source/tweets.json", function (error, data) {
    makeAGrid(data);
}) 
function makeAGrid(data) {
    var grid = d3.layout.grid();
    grid.size([400, 400]);
    var griddedData = grid(data.tweets);
    d3.select("svg").append("g").attr("transform", "translate(50,50)").selectAll("circle").data(griddedData).enter().append("rect").attr("x", function (d) {
        return d.x - (d.width / 2)
    }).attr("y", function (d) {
        return d.y - (d.height / 2)
    }).attr("width", function (d) {
        return d.width
    }).attr("height", function (d) {
        return d.height
    }).style("fill", "pink") 
    var fakeTweets =[] 
    for (x = 0; x < 12; x++) {
        var tweet = {
            id: x, content: "Fake Tweet #" + x
        };
        fakeTweets.push(tweet);
    }
    var doubledArray = data.tweets.concat(fakeTweets);
    var newGriddedData = grid(doubledArray);
    d3.select("g").selectAll("rect").data(newGriddedData).enter().append("rect").attr("x", 0).attr("y", 0).style("fill", "darkred");
    d3.select("g").selectAll("rect").transition().duration(1000).attr("x", function (d) {
        return d.x - (d.width / 2)
    }).attr("y", function (d) {
        return d.y - (d.height / 2)
    }).attr("width", function (d) {
        return d.width
    }).attr("height", function (d) {
        return d.height
    }).each("end", resizeGrid1) 
    function resizeGrid1() {
        grid.size([200, 200]) 
        grid(doubledArray) 
        d3.select("g").selectAll("rect").transition().duration(1000).attr("x", function (d) {
            return d.x - (d.width / 2)
        }).attr("y", function (d) {
            return d.y - (d.height / 2)
        }).attr("width", function (d) {
            return d.width
        }).attr("height", function (d) {
            return d.height
        }).each("end", resizeGrid2)
    }
    function resizeGrid2() {
        grid.size([200, 400]) 
        grid(doubledArray) 
        d3.select("g").selectAll("rect").transition().duration(1000).attr("x", function (d) {
            return d.x - (d.width / 2)
        }).attr("y", function (d) {
            return d.y - (d.height / 2)
        }).attr("width", function (d) {
            return d.width
        }).attr("height", function (d) {
            return d.height
        })
    }
}
d3.layout.grid = function () {
    var gridSize =[10, 10];
    var gridCellWidth;
    var gridCellHeight;
    var gridXScale = d3.scale.linear();
    var gridYScale = d3.scale.linear();
    function processGrid(data) {
        var rows = Math.ceil(Math.sqrt(data.length));
        var columns = Math.ceil(Math.sqrt(data.length));
        gridCellWidth = gridSize[0] / columns;   
        gridCellHeight = gridSize[1] / rows;
        gridXScale.domain([1, columns]).range([0, gridSize[0]]);
        gridYScale.domain([1, rows]).range([0, gridSize[1]]);
        var x = 0;
        for (i = 1; i <= rows; i++) {
            for (j = 1; j <= columns; j++) {
                if (data[x]) {
                    data[x].x = gridXScale(j);
                    data[x].y = gridYScale(i);
                    data[x].height = gridCellHeight;
                    data[x].width = gridCellWidth;
                    x++;
                } else {
                    break;
                }
            }
        }
        return data;
    }
    processGrid.size = function (newSize) {
        if (! arguments.length) return gridSize;
        gridSize = newSize;
        return this;
    }
    return processGrid;
}