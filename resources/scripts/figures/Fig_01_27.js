var someNumbers =[17, 82, 9, 500, 40];
smallerNumbers = someNumbers.filter(function (el) {
    return el <= 40 ? this: null
});
d3.select("body").selectAll("div").data(smallerNumbers).enter().append("div").html(function (d) {
    return d
});