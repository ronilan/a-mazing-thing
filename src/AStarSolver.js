/**
 * Class encapsulating an A* maze solving algorithm.
 */
export default class AStarSolver {
  /**
  * constructor - creates a
  *
  * @param {Array} maze - a two dimensional array of numbers representing a maze.
  * Any cell contain a 0 (or null, or empty string) is considered passable.
  * Any other cell is like a maze wall.
  */
  constructor(maze) {
    this.maze = maze;

    this.path = [];
    this.start = [];
    this.goal = [];

    this.mappedMaze = this._mapMaze();
  }

  /**
  * _mapMaze - maps the supplied maze to an array of similar dimensions
  * containing objects required by the A* algo.
  *
  * @private
  */
  _mapMaze() {
    return this.maze.map((row, rowIndex) => {
      const mappedRow = row.map((column, columnIndex) => ({
        row: rowIndex,
        column: columnIndex,
        parent: null,
        value: column,
        f: 0,
        g: 0,
        h: 0,
      }));

      return mappedRow;
    });
  }

  /**
  * _huristicDistance - calculates distance between two points using taxicab geometry
  * https://en.wikipedia.org/wiki/Taxicab_geometry
  *
  * @private
  * @param {array} fromPoint - array containing row and column coordinates of point.
  * @param {array} toPoint - array containing row and column coordinates of point.
  * @returns {number} - the distance.
  */
  _huristicDistance(fromPoint, toPoint) {
    return Math.abs(fromPoint[0] - toPoint[0]) + Math.abs(fromPoint[1] - toPoint[1]);
  }

  /**
  * _findNeighbours - finds the neighbours of a given node
  *
  * @private
  * @param {object} node - an object from the mapped maze.
  * @returns {Array} - the neighbours found (either 2, 3 or 4)
  */
  _findNeighbours(node) {
    const maze = this.mappedMaze;
    const { row, column } = node;
    const neighbours = [];

    if (maze[row + 1] !== undefined) neighbours.push(maze[row + 1][column]); // east
    if (maze[row][column + 1] !== undefined) neighbours.push(maze[row][column + 1]); // south
    if (maze[row - 1] !== undefined) neighbours.push(maze[row - 1][column]); // west
    if (maze[row][column - 1] !== undefined) neighbours.push(maze[row][column - 1]); // north

    return neighbours;
  }

  /**
  * _findPath - finds the path by tracing the nodes from goal back to start via parents.
  *
  * @private
  * @param {object} current - an object from the mapped maze.
  * @returns {Array} - the path of nodes from start to goal.
  */
  _findPath(current) {
    const result = [];
    let curr = current;

    while (curr.parent) {
      result.push(curr);
      curr = curr.parent;
    }
    result.push(curr);

    this.path = result.reverse();
  }

  /**
  * solves - solves the maze using A*
  *
  * @param {array} start - array containing row and column coordinates of point.
  * @param {array} goal - array containing row and column coordinates of point.
  * @returns {Array} - the path of nodes from start to goal.
  */
  solve(start, goal) {
    // if this was already solved - return the path
    if (start.every(item => this.start.includes(item))
       && goal.every(item => this.goal.includes(item))
       && this.path.length) {
      return this.path;
    }

    this.start = start;
    this.goal = goal;
    this.path = [];
    this.mappedMaze = this._mapMaze();

    // The set of nodes already evaluated
    const closedSet = [];

    // The set of currently discovered nodes that are not evaluated yet.
    // Initially, only the start node is known.
    let openSet = [this.mappedMaze[start[0]][start[1]]];

    while (openSet.length > 0 && openSet.length < 500) {
      // current is the node with lowest f score.
      const current = openSet.reduce((finder, item) => (item.f < finder.f ? item : finder));

      // reached goal
      if (current.row === goal[0] && current.column === goal[1]) {
        this._findPath(current);
        break;
      }

      // move current from open to closed
      openSet = openSet.filter(item => item !== current);
      closedSet.push(current);

      // find possible next moves. Note: diagonal move not supported.
      const currentNeighbours = this._findNeighbours(current);

      // check each
      for (let i = 0; i < currentNeighbours.length; i += 1) {
        const child = currentNeighbours[i];
        let best = false;

        // neighbour is not closed and is passable (has value of 0)
        if (closedSet.indexOf(child) === -1 && !current.value) {
          // new node
          if (openSet.indexOf(child) === -1) {
            best = true; // first visit always best
            openSet.push(child);
          }
          // node is not new has a lower score that previously calculated
          if ((current.g + 1) < child.g) {
            best = true;
          }
          // update values
          if (best) {
            child.parent = current;
            child.g = current.g + 1;
            child.h = this._huristicDistance([child.row, child.column], goal);
            child.f = child.g + child.h;
          }
        }
      }
    }

    return this.path;
  }
}
