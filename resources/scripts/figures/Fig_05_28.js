d3.csv("../data/source/worddata.csv", function (data) {
    dataViz(data)
});

wordScale = d3.scaleLinear()
.domain([0, 100])
.range([10, 160])
.clamp(true);

function dataViz(data) {
    
    randomRotate = d3.scaleLinear()
    .domain([0, 1])
    .range([-20, 20]);
    
    d3.layout.cloud()
    .size([500, 500])
    .words(data)
    .rotate(0)
    .fontSize(function (d) { return wordScale(d.frequency); })
    .on("end", draw)
    .start();
    
    function draw(words) {        
        var wordG = d3.select("svg")
        .append("g")
        .attr("id", "wordCloudG")
        .attr("transform", "translate(250,250)");
        
        wordG.selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", function (d) { return d.size + "px"; })
        .style("opacity", .75)
        .attr("text-anchor", "middle")
        .attr("transform", function (d) { return "translate(" +[d.x, d.y] + ")rotate(" + d.rotate + ")"; })
        .text(function (d) { return d.text; });
    }
}