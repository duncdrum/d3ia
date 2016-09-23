imageArray =[];
d3.select("#traditional").append("canvas").attr("height", 500).attr("width", 500);
var context = d3.select("canvas").node().getContext("2d");
context.textAlign = "center";
context.font = "200px Georgia";
colorScale = d3.scale.quantize().domain([0, 1]).range(colorbrewer.Reds[7]);
lineScale = d3.scale.quantize().domain([0, 1]).range([10, 40]);
for (var x = 0; x < 100; x++) {
    context.clearRect(0, 0, 500, 500);
    context.strokeStyle = colorScale(Math.random());
    context.lineWidth = lineScale(Math.random());
    context.fillStyle = colorScale(Math.random());
    context.beginPath();
    context.arc(250, 250, 200, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
    context.fillStyle = "black";
    context.fillText(x, 250, 280);
    var dataURL = d3.select("canvas").node().toDataURL();
    imageArray.push({
        x: x, url: dataURL
    });
}
imgPerLine = 8;
d3.select("canvas").remove();
d3.select("#traditional").append("div").attr("class", "gallery").selectAll("img").data(imageArray).enter().append("img").attr("class", "infinite").attr("src", function (d) {
    return d.url
}) 
redrawGallery();
function redrawGallery() {
    var newWidth = parseFloat(d3.select("div.gallery").node().clientWidth);
    var imageSize = newWidth / imgPerLine;
    function imgX(x) {
        return Math.floor(x / imgPerLine) * imageSize;
    }
    function imgY(x) {
        return Math.floor(x % imgPerLine * imageSize)
    }
    d3.selectAll("img").style("width", newWidth / imgPerLine).style("top", function (d) {
        return imgX(d.x)
    }).style("left", function (d) {
        return imgY(d.x)
    })
}
window.onresize = function (event) {
    redrawGallery();
}