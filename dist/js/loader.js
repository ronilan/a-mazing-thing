/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AStarSolver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _maze_generators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);



/**
* init - anachronistically initializes a maze, and a solver for that maze.
* dispatch document level event with solver as payload.
*/
async function init() {
  let json = await Object(_maze_generators__WEBPACK_IMPORTED_MODULE_1__["mazeFromFileNameinHash"])();
  if (!json) json = Object(_maze_generators__WEBPACK_IMPORTED_MODULE_1__["mazeFromRandom"])();

  const solver = new _AStarSolver__WEBPACK_IMPORTED_MODULE_0__["default"](json.maze);

  const event = new window.CustomEvent('mazed', { detail: { solver } });
  window.document.dispatchEvent(event);
}

init();


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AStarSolver; });
/**
 * Class encapsulating an A* maze solving algorithm.
 */
class AStarSolver {
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
  * https://en.wikipedia.org/wiki/Taxicab_geometry
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


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mazeFromFileNameinHash", function() { return mazeFromFileNameinHash; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mazeFromRandom", function() { return mazeFromRandom; });
/**
* Collection of json maze generators
*
* A maze is a json object with (at least) one key "maze",
* which has as value a two-dimensional array of numbers.
* Any cell in tha array that contains a 0 (or null, or empty string) is considered passable.
* Any other value is an obstacle
*/

/**
* mazeFromFileNameinHash - gets what is in the url hash and trys to fetch local file with same name
*
* @returns {object} - a maze json
*/
async function mazeFromFileNameinHash() {
  if (window.location.hash) {
    try {
      const res = await window.fetch(`./mazes/${window.location.hash.substring(1)}.json`);
      const json = await res.json();
      return json;
    } catch (err) {
      return null;
    }
  }
  return null;
}

/**
* mazeFromRandom - generates a given size random maze or a full screen one.
*
* @param {number} rows - number of rows (optional). If not provided will try to fit screen.
* @param {number} columns - number of columns (optional). If not provided will try to fit screen.
* @returns {object} - a maze json
*/
function mazeFromRandom(rows = null, columns = null) {
  const needColumns = rows || parseInt(((window.innerWidth - 30) / 30), 10);
  const needRows = columns || parseInt(((window.innerHeight - 30) / 30), 10);

  const json = {
    maze: new Array(needRows).fill(null).map(() => new Array(needColumns).fill(null).map(() => {
      const ratio = Math.floor(Math.random() * 3); // how many obstacles per space
      if (!ratio) return Math.floor(Math.random() * 10) + 1; // randomize obstacles
      return 0;
    })),
  };

  return json;
}


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQVN0YXJTb2x2ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hemUtZ2VuZXJhdG9ycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQXdDO0FBQ21DOztBQUUzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLCtFQUFzQjtBQUN6QyxvQkFBb0IsdUVBQWM7O0FBRWxDLHFCQUFxQixvREFBVzs7QUFFaEMsaURBQWlELFVBQVUsU0FBUyxFQUFFO0FBQ3RFO0FBQ0E7O0FBRUE7Ozs7Ozs7O0FDakJBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLFlBQVksTUFBTTtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxNQUFNO0FBQ2xCLFlBQVksTUFBTTtBQUNsQixjQUFjLE9BQU87QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixjQUFjLE1BQU07QUFDcEI7QUFDQTtBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCOztBQUVBLDRFQUE0RTtBQUM1RSxvRkFBb0Y7QUFDcEYsNEVBQTRFO0FBQzVFLG9GQUFvRjs7QUFFcEY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixjQUFjLE1BQU07QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksTUFBTTtBQUNsQixZQUFZLE1BQU07QUFDbEIsY0FBYyxNQUFNO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsOEJBQThCO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7OztBQzFLQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNPO0FBQ1A7QUFDQTtBQUNBLGdEQUFnRCxrQ0FBa0M7QUFDbEY7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsT0FBTztBQUNqQixVQUFVLE9BQU87QUFDakIsWUFBWSxPQUFPO0FBQ25CO0FBQ087QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQsNERBQTREO0FBQzVEO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EiLCJmaWxlIjoibG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuIiwiaW1wb3J0IEFTdGFyU29sdmVyIGZyb20gJy4vQVN0YXJTb2x2ZXInO1xuaW1wb3J0IHsgbWF6ZUZyb21GaWxlTmFtZWluSGFzaCwgbWF6ZUZyb21SYW5kb20gfSBmcm9tICcuL21hemUtZ2VuZXJhdG9ycyc7XG5cbi8qKlxuKiBpbml0IC0gYW5hY2hyb25pc3RpY2FsbHkgaW5pdGlhbGl6ZXMgYSBtYXplLCBhbmQgYSBzb2x2ZXIgZm9yIHRoYXQgbWF6ZS5cbiogZGlzcGF0Y2ggZG9jdW1lbnQgbGV2ZWwgZXZlbnQgd2l0aCBzb2x2ZXIgYXMgcGF5bG9hZC5cbiovXG5hc3luYyBmdW5jdGlvbiBpbml0KCkge1xuICBsZXQganNvbiA9IGF3YWl0IG1hemVGcm9tRmlsZU5hbWVpbkhhc2goKTtcbiAgaWYgKCFqc29uKSBqc29uID0gbWF6ZUZyb21SYW5kb20oKTtcblxuICBjb25zdCBzb2x2ZXIgPSBuZXcgQVN0YXJTb2x2ZXIoanNvbi5tYXplKTtcblxuICBjb25zdCBldmVudCA9IG5ldyB3aW5kb3cuQ3VzdG9tRXZlbnQoJ21hemVkJywgeyBkZXRhaWw6IHsgc29sdmVyIH0gfSk7XG4gIHdpbmRvdy5kb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuaW5pdCgpO1xuIiwiLyoqXG4gKiBDbGFzcyBlbmNhcHN1bGF0aW5nIGFuIEEqIG1hemUgc29sdmluZyBhbGdvcml0aG0uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFTdGFyU29sdmVyIHtcbiAgLyoqXG4gICogY29uc3RydWN0b3IgLSBjcmVhdGVzIGFcbiAgKlxuICAqIEBwYXJhbSB7QXJyYXl9IG1hemUgLSBhIHR3byBkaW1lbnNpb25hbCBhcnJheSBvZiBudW1iZXJzIHJlcHJlc2VudGluZyBhIG1hemUuXG4gICogQW55IGNlbGwgY29udGFpbiBhIDAgKG9yIG51bGwsIG9yIGVtcHR5IHN0cmluZykgaXMgY29uc2lkZXJlZCBwYXNzYWJsZS5cbiAgKiBBbnkgb3RoZXIgY2VsbCBpcyBsaWtlIGEgbWF6ZSB3YWxsLlxuICAqL1xuICBjb25zdHJ1Y3RvcihtYXplKSB7XG4gICAgdGhpcy5tYXplID0gbWF6ZTtcblxuICAgIHRoaXMucGF0aCA9IFtdO1xuICAgIHRoaXMuc3RhcnQgPSBbXTtcbiAgICB0aGlzLmdvYWwgPSBbXTtcblxuICAgIHRoaXMubWFwcGVkTWF6ZSA9IHRoaXMuX21hcE1hemUoKTtcbiAgfVxuXG4gIC8qKlxuICAqIF9tYXBNYXplIC0gbWFwcyB0aGUgc3VwcGxpZWQgbWF6ZSB0byBhbiBhcnJheSBvZiBzaW1pbGFyIGRpbWVuc2lvbnNcbiAgKiBjb250YWluaW5nIG9iamVjdHMgcmVxdWlyZWQgYnkgdGhlIEEqIGFsZ28uXG4gICpcbiAgKiBAcHJpdmF0ZVxuICAqL1xuICBfbWFwTWF6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXplLm1hcCgocm93LCByb3dJbmRleCkgPT4ge1xuICAgICAgY29uc3QgbWFwcGVkUm93ID0gcm93Lm1hcCgoY29sdW1uLCBjb2x1bW5JbmRleCkgPT4gKHtcbiAgICAgICAgcm93OiByb3dJbmRleCxcbiAgICAgICAgY29sdW1uOiBjb2x1bW5JbmRleCxcbiAgICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgICB2YWx1ZTogY29sdW1uLFxuICAgICAgICBmOiAwLFxuICAgICAgICBnOiAwLFxuICAgICAgICBoOiAwLFxuICAgICAgfSkpO1xuXG4gICAgICByZXR1cm4gbWFwcGVkUm93O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICogX2h1cmlzdGljRGlzdGFuY2UgLSBjYWxjdWxhdGVzIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50cyB1c2luZyB0YXhpY2FiIGdlb21ldHJ5XG4gICogaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVGF4aWNhYl9nZW9tZXRyeVxuICAqXG4gICogQHByaXZhdGVcbiAgKiBAcGFyYW0ge2FycmF5fSBmcm9tUG9pbnQgLSBhcnJheSBjb250YWluaW5nIHJvdyBhbmQgY29sdW1uIGNvb3JkaW5hdGVzIG9mIHBvaW50LlxuICAqIEBwYXJhbSB7YXJyYXl9IHRvUG9pbnQgLSBhcnJheSBjb250YWluaW5nIHJvdyBhbmQgY29sdW1uIGNvb3JkaW5hdGVzIG9mIHBvaW50LlxuICAqIEByZXR1cm5zIHtudW1iZXJ9IC0gdGhlIGRpc3RhbmNlLlxuICAqL1xuICBfaHVyaXN0aWNEaXN0YW5jZShmcm9tUG9pbnQsIHRvUG9pbnQpIHtcbiAgICByZXR1cm4gTWF0aC5hYnMoZnJvbVBvaW50WzBdIC0gdG9Qb2ludFswXSkgKyBNYXRoLmFicyhmcm9tUG9pbnRbMV0gLSB0b1BvaW50WzFdKTtcbiAgfVxuXG4gIC8qKlxuICAqIF9maW5kTmVpZ2hib3VycyAtIGZpbmRzIHRoZSBuZWlnaGJvdXJzIG9mIGEgZ2l2ZW4gbm9kZVxuICAqIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1RheGljYWJfZ2VvbWV0cnlcbiAgKlxuICAqIEBwcml2YXRlXG4gICogQHBhcmFtIHtvYmplY3R9IG5vZGUgLSBhbiBvYmplY3QgZnJvbSB0aGUgbWFwcGVkIG1hemUuXG4gICogQHJldHVybnMge0FycmF5fSAtIHRoZSBuZWlnaGJvdXJzIGZvdW5kIChlaXRoZXIgMiwgMyBvciA0KVxuICAqL1xuICBfZmluZE5laWdoYm91cnMobm9kZSkge1xuICAgIGNvbnN0IG1hemUgPSB0aGlzLm1hcHBlZE1hemU7XG4gICAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gbm9kZTtcbiAgICBjb25zdCBuZWlnaGJvdXJzID0gW107XG5cbiAgICBpZiAobWF6ZVtyb3cgKyAxXSAhPT0gdW5kZWZpbmVkKSBuZWlnaGJvdXJzLnB1c2gobWF6ZVtyb3cgKyAxXVtjb2x1bW5dKTsgLy8gZWFzdFxuICAgIGlmIChtYXplW3Jvd11bY29sdW1uICsgMV0gIT09IHVuZGVmaW5lZCkgbmVpZ2hib3Vycy5wdXNoKG1hemVbcm93XVtjb2x1bW4gKyAxXSk7IC8vIHNvdXRoXG4gICAgaWYgKG1hemVbcm93IC0gMV0gIT09IHVuZGVmaW5lZCkgbmVpZ2hib3Vycy5wdXNoKG1hemVbcm93IC0gMV1bY29sdW1uXSk7IC8vIHdlc3RcbiAgICBpZiAobWF6ZVtyb3ddW2NvbHVtbiAtIDFdICE9PSB1bmRlZmluZWQpIG5laWdoYm91cnMucHVzaChtYXplW3Jvd11bY29sdW1uIC0gMV0pOyAvLyBub3J0aFxuXG4gICAgcmV0dXJuIG5laWdoYm91cnM7XG4gIH1cblxuICAvKipcbiAgKiBfZmluZFBhdGggLSBmaW5kcyB0aGUgcGF0aCBieSB0cmFjaW5nIHRoZSBub2RlcyBmcm9tIGdvYWwgYmFjayB0byBzdGFydCB2aWEgcGFyZW50cy5cbiAgKlxuICAqIEBwcml2YXRlXG4gICogQHBhcmFtIHtvYmplY3R9IGN1cnJlbnQgLSBhbiBvYmplY3QgZnJvbSB0aGUgbWFwcGVkIG1hemUuXG4gICogQHJldHVybnMge0FycmF5fSAtIHRoZSBwYXRoIG9mIG5vZGVzIGZyb20gc3RhcnQgdG8gZ29hbC5cbiAgKi9cbiAgX2ZpbmRQYXRoKGN1cnJlbnQpIHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBsZXQgY3VyciA9IGN1cnJlbnQ7XG5cbiAgICB3aGlsZSAoY3Vyci5wYXJlbnQpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGN1cnIpO1xuICAgICAgY3VyciA9IGN1cnIucGFyZW50O1xuICAgIH1cbiAgICByZXN1bHQucHVzaChjdXJyKTtcblxuICAgIHRoaXMucGF0aCA9IHJlc3VsdC5yZXZlcnNlKCk7XG4gIH1cblxuICAvKipcbiAgKiBzb2x2ZXMgLSBzb2x2ZXMgdGhlIG1hemUgdXNpbmcgQSpcbiAgKlxuICAqIEBwYXJhbSB7YXJyYXl9IHN0YXJ0IC0gYXJyYXkgY29udGFpbmluZyByb3cgYW5kIGNvbHVtbiBjb29yZGluYXRlcyBvZiBwb2ludC5cbiAgKiBAcGFyYW0ge2FycmF5fSBnb2FsIC0gYXJyYXkgY29udGFpbmluZyByb3cgYW5kIGNvbHVtbiBjb29yZGluYXRlcyBvZiBwb2ludC5cbiAgKiBAcmV0dXJucyB7QXJyYXl9IC0gdGhlIHBhdGggb2Ygbm9kZXMgZnJvbSBzdGFydCB0byBnb2FsLlxuICAqL1xuICBzb2x2ZShzdGFydCwgZ29hbCkge1xuICAgIC8vIGlmIHRoaXMgd2FzIGFscmVhZHkgc29sdmVkIC0gcmV0dXJuIHRoZSBwYXRoXG4gICAgaWYgKHN0YXJ0LmV2ZXJ5KGl0ZW0gPT4gdGhpcy5zdGFydC5pbmNsdWRlcyhpdGVtKSlcbiAgICAgICAmJiBnb2FsLmV2ZXJ5KGl0ZW0gPT4gdGhpcy5nb2FsLmluY2x1ZGVzKGl0ZW0pKVxuICAgICAgICYmIHRoaXMucGF0aC5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhdGg7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuZ29hbCA9IGdvYWw7XG4gICAgdGhpcy5wYXRoID0gW107XG4gICAgdGhpcy5tYXBwZWRNYXplID0gdGhpcy5fbWFwTWF6ZSgpO1xuXG4gICAgLy8gVGhlIHNldCBvZiBub2RlcyBhbHJlYWR5IGV2YWx1YXRlZFxuICAgIGNvbnN0IGNsb3NlZFNldCA9IFtdO1xuXG4gICAgLy8gVGhlIHNldCBvZiBjdXJyZW50bHkgZGlzY292ZXJlZCBub2RlcyB0aGF0IGFyZSBub3QgZXZhbHVhdGVkIHlldC5cbiAgICAvLyBJbml0aWFsbHksIG9ubHkgdGhlIHN0YXJ0IG5vZGUgaXMga25vd24uXG4gICAgbGV0IG9wZW5TZXQgPSBbdGhpcy5tYXBwZWRNYXplW3N0YXJ0WzBdXVtzdGFydFsxXV1dO1xuXG4gICAgd2hpbGUgKG9wZW5TZXQubGVuZ3RoID4gMCAmJiBvcGVuU2V0Lmxlbmd0aCA8IDUwMCkge1xuICAgICAgLy8gY3VycmVudCBpcyB0aGUgbm9kZSB3aXRoIGxvd2VzdCBmIHNjb3JlLlxuICAgICAgY29uc3QgY3VycmVudCA9IG9wZW5TZXQucmVkdWNlKChmaW5kZXIsIGl0ZW0pID0+IChpdGVtLmYgPCBmaW5kZXIuZiA/IGl0ZW0gOiBmaW5kZXIpKTtcblxuICAgICAgLy8gcmVhY2hlZCBnb2FsXG4gICAgICBpZiAoY3VycmVudC5yb3cgPT09IGdvYWxbMF0gJiYgY3VycmVudC5jb2x1bW4gPT09IGdvYWxbMV0pIHtcbiAgICAgICAgdGhpcy5fZmluZFBhdGgoY3VycmVudCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAvLyBtb3ZlIGN1cnJlbnQgZnJvbSBvcGVuIHRvIGNsb3NlZFxuICAgICAgb3BlblNldCA9IG9wZW5TZXQuZmlsdGVyKGl0ZW0gPT4gaXRlbSAhPT0gY3VycmVudCk7XG4gICAgICBjbG9zZWRTZXQucHVzaChjdXJyZW50KTtcblxuICAgICAgLy8gZmluZCBwb3NzaWJsZSBuZXh0IG1vdmVzLiBOb3RlOiBkaWFnb25hbCBtb3ZlIG5vdCBzdXBwb3J0ZWQuXG4gICAgICBjb25zdCBjdXJyZW50TmVpZ2hib3VycyA9IHRoaXMuX2ZpbmROZWlnaGJvdXJzKGN1cnJlbnQpO1xuXG4gICAgICAvLyBjaGVjayBlYWNoXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnROZWlnaGJvdXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkID0gY3VycmVudE5laWdoYm91cnNbaV07XG4gICAgICAgIGxldCBiZXN0ID0gZmFsc2U7XG5cbiAgICAgICAgLy8gbmVpZ2hib3VyIGlzIG5vdCBjbG9zZWQgYW5kIGlzIHBhc3NhYmxlIChoYXMgdmFsdWUgb2YgMClcbiAgICAgICAgaWYgKGNsb3NlZFNldC5pbmRleE9mKGNoaWxkKSA9PT0gLTEgJiYgIWN1cnJlbnQudmFsdWUpIHtcbiAgICAgICAgICAvLyBuZXcgbm9kZVxuICAgICAgICAgIGlmIChvcGVuU2V0LmluZGV4T2YoY2hpbGQpID09PSAtMSkge1xuICAgICAgICAgICAgYmVzdCA9IHRydWU7IC8vIGZpcnN0IHZpc2l0IGFsd2F5cyBiZXN0XG4gICAgICAgICAgICBvcGVuU2V0LnB1c2goY2hpbGQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBub2RlIGlzIG5vdCBuZXcgaGFzIGEgbG93ZXIgc2NvcmUgdGhhdCBwcmV2aW91c2x5IGNhbGN1bGF0ZWRcbiAgICAgICAgICBpZiAoKGN1cnJlbnQuZyArIDEpIDwgY2hpbGQuZykge1xuICAgICAgICAgICAgYmVzdCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHVwZGF0ZSB2YWx1ZXNcbiAgICAgICAgICBpZiAoYmVzdCkge1xuICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gY3VycmVudDtcbiAgICAgICAgICAgIGNoaWxkLmcgPSBjdXJyZW50LmcgKyAxO1xuICAgICAgICAgICAgY2hpbGQuaCA9IHRoaXMuX2h1cmlzdGljRGlzdGFuY2UoW2NoaWxkLnJvdywgY2hpbGQuY29sdW1uXSwgZ29hbCk7XG4gICAgICAgICAgICBjaGlsZC5mID0gY2hpbGQuZyArIGNoaWxkLmg7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGF0aDtcbiAgfVxufVxuIiwiLyoqXG4qIENvbGxlY3Rpb24gb2YganNvbiBtYXplIGdlbmVyYXRvcnNcbipcbiogQSBtYXplIGlzIGEganNvbiBvYmplY3Qgd2l0aCAoYXQgbGVhc3QpIG9uZSBrZXkgXCJtYXplXCIsXG4qIHdoaWNoIGhhcyBhcyB2YWx1ZSBhIHR3by1kaW1lbnNpb25hbCBhcnJheSBvZiBudW1iZXJzLlxuKiBBbnkgY2VsbCBpbiB0aGEgYXJyYXkgdGhhdCBjb250YWlucyBhIDAgKG9yIG51bGwsIG9yIGVtcHR5IHN0cmluZykgaXMgY29uc2lkZXJlZCBwYXNzYWJsZS5cbiogQW55IG90aGVyIHZhbHVlIGlzIGFuIG9ic3RhY2xlXG4qL1xuXG4vKipcbiogbWF6ZUZyb21GaWxlTmFtZWluSGFzaCAtIGdldHMgd2hhdCBpcyBpbiB0aGUgdXJsIGhhc2ggYW5kIHRyeXMgdG8gZmV0Y2ggbG9jYWwgZmlsZSB3aXRoIHNhbWUgbmFtZVxuKlxuKiBAcmV0dXJucyB7b2JqZWN0fSAtIGEgbWF6ZSBqc29uXG4qL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1hemVGcm9tRmlsZU5hbWVpbkhhc2goKSB7XG4gIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCB3aW5kb3cuZmV0Y2goYC4vbWF6ZXMvJHt3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSl9Lmpzb25gKTtcbiAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXMuanNvbigpO1xuICAgICAgcmV0dXJuIGpzb247XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuKiBtYXplRnJvbVJhbmRvbSAtIGdlbmVyYXRlcyBhIGdpdmVuIHNpemUgcmFuZG9tIG1hemUgb3IgYSBmdWxsIHNjcmVlbiBvbmUuXG4qXG4qIEBwYXJhbSB7bnVtYmVyfSByb3dzIC0gbnVtYmVyIG9mIHJvd3MgKG9wdGlvbmFsKS4gSWYgbm90IHByb3ZpZGVkIHdpbGwgdHJ5IHRvIGZpdCBzY3JlZW4uXG4qIEBwYXJhbSB7bnVtYmVyfSBjb2x1bW5zIC0gbnVtYmVyIG9mIGNvbHVtbnMgKG9wdGlvbmFsKS4gSWYgbm90IHByb3ZpZGVkIHdpbGwgdHJ5IHRvIGZpdCBzY3JlZW4uXG4qIEByZXR1cm5zIHtvYmplY3R9IC0gYSBtYXplIGpzb25cbiovXG5leHBvcnQgZnVuY3Rpb24gbWF6ZUZyb21SYW5kb20ocm93cyA9IG51bGwsIGNvbHVtbnMgPSBudWxsKSB7XG4gIGNvbnN0IG5lZWRDb2x1bW5zID0gcm93cyB8fCBwYXJzZUludCgoKHdpbmRvdy5pbm5lcldpZHRoIC0gMzApIC8gMzApLCAxMCk7XG4gIGNvbnN0IG5lZWRSb3dzID0gY29sdW1ucyB8fCBwYXJzZUludCgoKHdpbmRvdy5pbm5lckhlaWdodCAtIDMwKSAvIDMwKSwgMTApO1xuXG4gIGNvbnN0IGpzb24gPSB7XG4gICAgbWF6ZTogbmV3IEFycmF5KG5lZWRSb3dzKS5maWxsKG51bGwpLm1hcCgoKSA9PiBuZXcgQXJyYXkobmVlZENvbHVtbnMpLmZpbGwobnVsbCkubWFwKCgpID0+IHtcbiAgICAgIGNvbnN0IHJhdGlvID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMyk7IC8vIGhvdyBtYW55IG9ic3RhY2xlcyBwZXIgc3BhY2VcbiAgICAgIGlmICghcmF0aW8pIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxOyAvLyByYW5kb21pemUgb2JzdGFjbGVzXG4gICAgICByZXR1cm4gMDtcbiAgICB9KSksXG4gIH07XG5cbiAgcmV0dXJuIGpzb247XG59XG4iXSwic291cmNlUm9vdCI6IiJ9