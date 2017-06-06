function setup() {
  createCanvas(displayWidth, displayHeight);
  clear();
  background(0);
  noStroke();
}

function draw() {
  // slightly wash out canvas with black
  fill(0, 0, 0, 1);
  rect(0, 0, displayWidth, displayHeight);

  // draw a triangle from the top center
  var widthCenter = displayWidth / 2;
  fill(255, 255, 255);
  triangle(widthCenter - 5, -1, widthCenter + 5, -1, random(displayWidth), random(displayHeight));
}
