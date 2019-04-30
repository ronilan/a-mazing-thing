/* init entities */
const stage = new blockLike.Stage({
  parent: window.document.getElementById('blocklike-parent') || window.document.body,
  width: window.mazeColumns * 30 || window.innerWidth,
  height: window.mazeRows * 30 || window.innerHeight
});
stage.addClass('stage');

const startSprite = new blockLike.Sprite({ width: 25, height: 25, color: '#eeeeff' });
startSprite.costume.css({ color: 'blue' });
startSprite.inner('&#9679');
startSprite.addClass('sprite');

const goalSprite = new blockLike.Sprite({ width: 25, height: 25, color: '#eeeeff' });
goalSprite.costume.css({ color: 'darkblue' });
goalSprite.inner('&#9679');
goalSprite.addClass('sprite');

const dotSprite = new blockLike.Sprite({ width: 25, height: 25, color: '#eeeeff' });
dotSprite.costume.css({ color: 'blue' });
dotSprite.inner('&#9679');
dotSprite.addClass('sprite');

/* settings */
const cellSize = 29;

/* globals */
let maze = [];
let solver = null;

let start = null;
let goal = null;

/* utils */
function numberToEmoji(num) {
  let char = '&#127794;';

  if (!num) char = '&sdot;';
  if (num === 1) char = '&#127794;';
  if (num === 2) char = '&#127795;';
  if (num === 3) char = '&#127796;';
  if (num === 4) char = '&#127968;';
  if (num === 5) char = '&#127797;';

  return char;
}

function gridY(row) {
  const marginHeight = ((stage.height - (maze.length * cellSize)) / 2) + 15;
  return (stage.height / 2) - (row * cellSize) - marginHeight;
}

function gridX(column) {
  const marginWidth = ((stage.width - (maze[0].length * cellSize)) / 2) + 15;
  return (-stage.width / 2) + column * cellSize + marginWidth;
}

/* UI functions */

// there is a solution
function tracePath(path) {
  const pathSprites = [];

  // stand at start
  dotSprite.goTo(startSprite.x, gridY(startSprite.y));

  // loop through path cloning as we go. keep ref for cleanup.
  for (let i = 0; i < path.length; i += 1) {
    const d = dotSprite.clone();
    pathSprites.push(d);
    d.addTo(stage);
    d.goTo(gridX(path[i].column), gridY(path[i].row));
    d.wait(0.1);
  }

  // path has been traced. wait a sec.
  dotSprite.wait(1);

  // cleanup
  pathSprites.forEach((pathSprite) => {
    pathSprite.removeFrom(stage);
  });
  startSprite.removeFrom(stage);
  goalSprite.removeFrom(stage);

  start = null;
  goal = null;
}

// there is no solution
function noPath() {
  goalSprite.inner('X');
  goalSprite.refresh();

  goalSprite.wait(1);
  goalSprite.removeFrom(stage);
  startSprite.removeFrom(stage);

  goalSprite.inner('&#9679');
  goal = null;
  start = null;
}

// handle a click
function clickHandler(sprite) {
  if (!start) {
    startSprite.goTo(gridX(sprite.column), gridY(sprite.row));
    startSprite.addTo(stage);
    start = [sprite.row, sprite.column];
  } else if (!goal) {
    goalSprite.goTo(gridX(sprite.column), gridY(sprite.row));
    goalSprite.addTo(stage);
    goal = [sprite.row, sprite.column];

    // solve
    solver.solve(start, goal);

    // draw
    if (solver.path.length) {
      sprite.invoke(tracePath, [solver.path]);
    } else {
      sprite.invoke(noPath);
    }
  }
}

// build the maze using sprites
stage.whenReceiveMessage('start', () => {
  maze.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const s = new blockLike.Sprite({ width: 25, height: 25 });
      s.goTo(gridX(columnIndex), gridY(rowIndex));

      s.row = rowIndex;
      s.column = columnIndex;
      s.value = column;

      s.addTo(stage);
      s.addClass('sprite');
      s.inner(numberToEmoji(column));

      if (!s.value) {
        s.css({ cursor: 'pointer' });
        s.whenClicked(function () {
          this.invoke(clickHandler, this);
        });
      } else {
        s.css({ cursor: 'none' });
      }
    });
  });
});

/* listen to the loader */
window.document.addEventListener('mazed', (e) => {
  solver = e.detail.solver;
  maze = solver.maze;
  stage.broadcastMessage('start');
});
