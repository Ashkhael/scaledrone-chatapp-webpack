function getRandomColor() {
  var color = "#" + Math.floor(Math.random() * 0xffffff).toString(16);
  if (color === "#979494") {
    var color = "#" + Math.floor(Math.random() * 0xffffff).toString(16);
  }
  return color;
}

module.exports = getRandomColor;
