d3.json("../data/source/tweets.json", function (error, data) {
    makeAGrid(data);
})

function makeAGrid(data) {
    var scale = d3.scaleLinear().domain([0, 5]).range([100, 400]);
    var grid = d3.layout.grid()
    var griddedData = grid(data.tweets);
    
    d3.select("svg").selectAll("circle").data(griddedData).enter().append("circle").attr("cx", function (d) {
        return scale(d.x)
    }).attr("cy", function (d) {
        return scale(d.y)
    }).attr("r", 20).style("fill", "pink")
    
    var fakeTweets =[]
    for (x = 0; x < 12; x++) {
        var tweet = {
            id: x, content: "Fake Tweet #" + x
        };
        fakeTweets.push(tweet);
    }
    var doubledArray = data.tweets.concat(fakeTweets);
    
    var newGriddedData = grid(doubledArray);
    
    d3.select("svg").selectAll("circle").data(newGriddedData).enter().append("circle").attr("cx", 0).attr("cy", 0).attr("r", 20).style("fill", "darkred");
    
    d3.select("svg").selectAll("circle").transition().duration(1000).attr("cx", function (d) {
        return scale(d.x)
    }).attr("cy", function (d) {
        return scale(d.y)
    })
}

d3.layout.grid = function () {
    var gridSize =[10, 10];
    var gridColumns;
    var gridRows;
    
    function processGrid(data) {
        
        var rows = Math.ceil(Math.sqrt(data.length));
        var columns = Math.ceil(Math.sqrt(data.length));
        
        var x = 0;
        
        for (i = 0; i < rows; i++) {
            for (j = 0; j < columns; j++) {
                if (data[x]) {
                    data[x].x = j;
                    data[x].y = i;
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