
var path = require("path");
var express = require("express");
var app = express();

app.use("/angular/vendor",express.static(path.join(__dirname,"node_modules"))); // 将url路径转化为本地路径
app.use("/angular/js",express.static(path.join(__dirname,"js"))); // 将url路径转化为本地路径
app.use("/angular/img",express.static(path.join(__dirname,"img"))); // 将url路径转化为本地路径
app.use("/angular/css",express.static(path.join(__dirname,"css"))); // 将url路径转化为本地路径
app.use("/angular/less",express.static(path.join(__dirname,"less"))); // 将url路径转化为本地路径
app.use("/angular/views",express.static(path.join(__dirname,"views"))); // 将url路径转化为本地路径

app.get("/angular/",function(req,res){
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(5002,function(){
    console.log("listening on port 5002");
})
