window.requestAnimationFrame(displayPercentage);

function displayPercentage(){
  var timeBox = document.getElementById("timeBox");
  var begin = new Date(2015, 1, 1);
  var now = new Date();
  var difference = now.getTime() - begin.getTime();
  var days = difference / 1000 / 3600 / 24;
  var percentage = days / 365 * 100;
  timeBox.innerHTML = percentage.toFixed(2) + "%<br>";
  timeBox.innerHTML = timeBox.innerHTML + percentage.toFixed(6) + "%<br>";
  var schoolYearStart = new Date(2014, 8, 18);
  var schoolYearEnd = new Date(2015, 5, 22);
  var schoolLength = schoolYearEnd.getTime() - schoolYearStart.getTime();
  var lengthThroughSchoolYear = now.getTime() - schoolYearStart.getTime();
  var percentageThroughSchoolYear = lengthThroughSchoolYear / schoolLength * 100;
  timeBox.innerHTML = timeBox.innerHTML + percentageThroughSchoolYear.toFixed(2) + "%<br>";
  timeBox.innerHTML = timeBox.innerHTML + percentageThroughSchoolYear.toFixed(6) + "%";
  window.requestAnimationFrame(displayPercentage);
}
