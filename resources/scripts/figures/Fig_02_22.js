d3.json("../data/source/tweets.json", function (error, data) {
    dataViz(data.tweets)
});
function dataViz(incomingData) {
    var nestedTweets = d3.nest().key(function (el) {
        return el.user;
    }).entries(incomingData);
    nestedTweets.forEach(function (el) {
        el.numTweets = el.values.length;
    })
    var maxTweets = d3.max(nestedTweets, function (el) {
        return el.numTweets;
    });
    var yScale = d3.scaleLinear().domain([0, maxTweets]).range([0, 500]);
    d3.select("svg").selectAll("rect").data(nestedTweets).enter().append("rect").attr("width", 50).attr("height", function (d) {
        return yScale(d.numTweets);
    }).attr("x", function (d, i) {
        return i * 60;
    }).attr("y", function (d) {
        return 500 - yScale(d.numTweets);
    }).style("fill", "blue").style("stroke", "red").style("stroke-width", "1px").style("opacity", .25);
}