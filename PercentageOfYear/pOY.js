var timeBox = document.getElementById("timeBox");
var begin = new Date(2015, 1, 1);
var now = new Date();
var difference = now - begin;
var days = difference / 1000 / 3600 / 24;
var percentage = days / 365 * 100;
timeBox.innerHTML = (percentage.toFixed(2) + "%");