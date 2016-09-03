d3.csv("../data/source/movies.csv", function (error, data) {
    dataViz(data)
});

function dataViz(incData) {
    expData = incData;
    stackData =[];
    
    var xScale = d3.scale.linear()
    .domain([0, 10])
    .range([0, 500]);

    var yScale = d3.scale.linear()
    .domain([0, 100])
    .range([500, 0]);
    
    
    for (x in incData[0]) {
        if (x != "day") {
            var newMovieObject = {
                name: x, values:[]
            };             
            for (y in incData) {
                newMovieObject
                .values
                 .push({
                    x: parseInt(incData[y][ "day"]), 
                    y: parseInt(incData[y][x])
                })
            }
            stackData
            .push(newMovieObject);
        }
    }   
    
}

