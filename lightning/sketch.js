//
// Known issues:
//   * Effect will look very different with significantly different FPS
//   * Effect is hand-tuned to a specific screen resolution,
//       Lightning.nextPosition could take screen size / resolution into account
//   * When lightning 'forks' it can disappear before/after the 'parent'.
//       There is no link in code between parent and child forks
//
var backgroundShadeMax = 200;
var backgroundShade = backgroundShadeMax;
var lightning = [];

function setup() {
  // setup
  createCanvas(displayWidth, displayHeight);

  // instant gratification
  spawnLightning([gaussianRandom(0, displayWidth), 0]);
}

function draw() {
  clear();
  background(backgroundShade);
  backgroundShade = _.max([0, backgroundShade - 10]);

  // remove lightning that has hit the ground
  lightning = _.filter(lightning, n => !n.complete);

  // create new lightning
  if (random() < 0.004) {
    spawnLightning([gaussianRandom(0, displayWidth), 0]);
    backgroundShade = _.min([backgroundShade + 100, backgroundShadeMax])
  }

  // fork existing lightning
  _.each(lightning, function(lightning){
    if (random() < 0.04) {
      spawnLightning(lightning.lastPosition());
    }
  })

  _.each(lightning, x => x.tick(2));

  drawLightning();
}

function drawLightning() {
  stroke(255);

  lightning.forEach(function(l) {
    var lastPosition = _.first(l.positions)

    _.slice(l.positions, 1).forEach(function(position){
      line(lastPosition[0], lastPosition[1], position[0], position[1]);
      lastPosition = position;
    })
  });
}

function spawnLightning(initialPosition) {
  lightning.push(new Lightning(initialPosition));
}

function Lightning(initialPosition) {
  // set to true when the lightning has hit the 'ground'
  this.complete = false;
  this.positions = [initialPosition];

  this.lastPosition = function() {
    return _.last(this.positions);
  }

  this.nextPosition = function() {
    var lastPosition = this.lastPosition();
    return [lastPosition[0] + gaussianRandom(-80, 80), lastPosition[1] + gaussianRandom(-20, 60)]
  }

  this.tick = function(rounds) {
    for (var i = 0; i < rounds; i++) {
      if (this.complete) { return; }

      var nextPosition = this.nextPosition();
      this.positions.push(nextPosition);
      if (nextPosition[1] > displayHeight) {
        this.complete = true;
      }
    }
  }
}

// fake a gaussian distribution
function gaussianRandom(start, end) {
  // increase rounds to get a tighter distribution
  var rounds = 3;
  var rand = 0;

  for (var i = 0; i < rounds; i += 1) {
      rand += Math.random();
  }

  rand /= rounds;
  return Math.floor(start + (rand) * (end - start + 1));
}
