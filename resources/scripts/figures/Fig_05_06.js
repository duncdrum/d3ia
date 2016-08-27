
d3.json("tweets.json", function (error, data) {
    dataViz(data.tweets)
});

function dataViz(incData) {
    nestedTweets = d3.nest().key(function (el) {
        return el.user
    }).entries(incData);
    
    var colorScale = d3.scale.category10([0, 1, 2, 3]);
    
    nestedTweets.forEach(function (el) {
        el.numTweets = el.values.length
        el.numFavorites = d3.sum(el.values, function (d) {
            return d.favorites.length
        });
        el.numRetweets = d3.sum(el.values, function (d) {
            return d.retweets.length
        });
    })
    
    pieChart = d3.pie().sort(null);
    pieChart.value(function (d) {
        return d.numTweets
    });
    newArc = d3.svg.arc();
    newArc.outerRadius(100).innerRadius(20);
    
    d3.select("svg").append("g").attr("transform", "translate(250,250)").selectAll("path").data(pieChart(nestedTweets), function (d) {
        return d.data.key
    }).enter().append("path").attr("d", newArc).style("fill", function (d, i) {
        return colorScale(i)
    }).style("opacity", .5).style("stroke", "black").style("stroke-width", "2px").each(function (d) {
        this._current = d;
    });
    
    function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) {
            return newArc(i(t));
        };
    }
}