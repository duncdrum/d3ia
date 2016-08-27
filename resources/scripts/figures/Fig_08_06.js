
d3.select("#traditional").append("canvas").attr("height", 500).attr("width", 500);

var context = d3.select("canvas").node().getContext("2d");

context.strokeStyle = "black";
context.lineWidth = 2;
context.fillStyle = "red";
context.beginPath();
context.arc(250, 250, 200, 0, 2 * Math.PI);
context.fill();
context.stroke();

context.textAlign = "center";
context.font = "200px Georgia";
context.fillStyle = "black";
context.textAligh = "center";
context.fillText("1", 250, 250);