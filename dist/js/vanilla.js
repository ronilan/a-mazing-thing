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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function vanilla(solver) {
  const { mappedMaze } = solver;
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

  /* UI functions */

  // there is a solution
  function tracePath(path, cloned) {
    const drawPath = [...path];
    const clonedMaze = cloned;

    const intervalId = setInterval(() => {
      if (!drawPath.length) {
        clearInterval(intervalId);
        // reset
        setTimeout(() => {
          render(mappedMaze); // eslint-disable-line no-use-before-define
          start = null;
          goal = null;
        }, 1000);
      } else {
        const item = drawPath.shift();
        clonedMaze[item.row][item.column].path = true;
        render(clonedMaze); // eslint-disable-line no-use-before-define
      }
    }, 133);
  }

  // there is no solution
  function noPath(goalPoint, cloned) {
    console.log('no path');
    const clonedMaze = cloned;

    clonedMaze[goalPoint[0]][goalPoint[1]].goal = false;
    render(clonedMaze); // eslint-disable-line no-use-before-define

    // reset
    setTimeout(() => {
      delete clonedMaze[goalPoint[0]][goalPoint[1]].goal;
      render(clonedMaze); // eslint-disable-line no-use-before-define
      goal = null;
    }, 1000);
  }

  // handle a click
  function clickHandler(cell, cloned) {
    const clonedMaze = cloned;
    const cellEl = cell;
    const row = parseInt(cellEl.dataset.row, 10);
    const column = parseInt(cellEl.dataset.column, 10);

    if (!start) {
      start = [row, column];
      clonedMaze[row][column].start = true;
      render(clonedMaze); // eslint-disable-line no-use-before-define
    } else if (!goal) {
      goal = [row, column];
      clonedMaze[row][column].goal = true;

      // solve
      const path = solver.solve(start, goal);
      // draw
      if (solver.path.length) {
        tracePath(path, clonedMaze);
      } else {
        noPath(goal, clonedMaze);
      }
    }
  }

  /* render the whole screen with each change */
  function render(mapped) {
    // create a deep copy of the maze to be modified and rendered
    const clonedMaze = mapped.map(row => row.map((column) => {
      const obj = Object.assign({}, column);
      return obj;
    }));

    // will be removed and reappended.
    const containerEl = window.document.createElement('DIV');
    containerEl.id = 'container';
    containerEl.className = 'maze';

    const tableEl = window.document.createElement('TABLE');

    clonedMaze.forEach((row, rowIndex) => {
      const rowEl = window.document.createElement('TR');

      row.forEach((column, columnIndex) => {
        const cellEl = window.document.createElement('TD');
        cellEl.dataset.row = rowIndex;
        cellEl.dataset.column = columnIndex;

        // only clicks on open spaces allowed
        if (!clonedMaze[rowIndex][columnIndex].value) {
          cellEl.addEventListener('click', () => {
            clickHandler(cellEl, clonedMaze);
          });
        }

        // UI variations of cells
        const val = clonedMaze[rowIndex][columnIndex].value;
        cellEl.innerHTML = numberToEmoji(val);
        if (!val) {
          cellEl.style.cursor = 'pointer';
        } else {
          cellEl.style.cursor = 'none';
        }

        if (clonedMaze[rowIndex][columnIndex].goal) {
          cellEl.style.color = 'darkblue';
          cellEl.innerHTML = '&#9679';
          cellEl.style.backgroundColor = '#eeeeff';
        }

        if (clonedMaze[rowIndex][columnIndex].goal === false) {
          cellEl.style.color = 'darkblue';
          cellEl.innerHTML = 'X';
          cellEl.style.backgroundColor = '#eeeeff';
        }

        if (clonedMaze[rowIndex][columnIndex].start) {
          cellEl.style.color = 'blue';
          cellEl.innerHTML = '&#9679';
          cellEl.style.backgroundColor = '#eeeeff';
        }

        if (clonedMaze[rowIndex][columnIndex].path) {
          cellEl.style.color = 'blue';
          cellEl.innerHTML = '&#9679';
          cellEl.style.backgroundColor = '#eeeeff';
        }

        rowEl.appendChild(cellEl);
      });

      tableEl.appendChild(rowEl);
    });

    containerEl.appendChild(tableEl);

    const existing = window.document.getElementById('container');
    if (existing) window.document.body.removeChild(existing);

    window.document.body.appendChild(containerEl);
  }

  // render it
  render(solver.mappedMaze);
}

/* listen to the loader */
window.document.addEventListener('mazed', (e) => {
  vanilla(e.detail.solver);
});


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZhbmlsbGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7OztBQ2xGQTtBQUNBLFNBQVMsYUFBYTtBQUN0QjtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBeUI7O0FBRXpCLDRCQUE0QjtBQUM1QixvQ0FBb0M7QUFDcEMsb0NBQW9DO0FBQ3BDLG9DQUFvQztBQUNwQyxvQ0FBb0M7QUFDcEMsb0NBQW9DOztBQUVwQztBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1Qjs7QUFFdkI7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU87O0FBRVA7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsImZpbGUiOiJ2YW5pbGxhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuIiwiZnVuY3Rpb24gdmFuaWxsYShzb2x2ZXIpIHtcbiAgY29uc3QgeyBtYXBwZWRNYXplIH0gPSBzb2x2ZXI7XG4gIGxldCBzdGFydCA9IG51bGw7XG4gIGxldCBnb2FsID0gbnVsbDtcblxuICAvKiB1dGlscyAqL1xuICBmdW5jdGlvbiBudW1iZXJUb0Vtb2ppKG51bSkge1xuICAgIGxldCBjaGFyID0gJyYjMTI3Nzk0Oyc7XG5cbiAgICBpZiAoIW51bSkgY2hhciA9ICcmc2RvdDsnO1xuICAgIGlmIChudW0gPT09IDEpIGNoYXIgPSAnJiMxMjc3OTQ7JztcbiAgICBpZiAobnVtID09PSAyKSBjaGFyID0gJyYjMTI3Nzk1Oyc7XG4gICAgaWYgKG51bSA9PT0gMykgY2hhciA9ICcmIzEyNzc5NjsnO1xuICAgIGlmIChudW0gPT09IDQpIGNoYXIgPSAnJiMxMjc5Njg7JztcbiAgICBpZiAobnVtID09PSA1KSBjaGFyID0gJyYjMTI3Nzk3Oyc7XG5cbiAgICByZXR1cm4gY2hhcjtcbiAgfVxuXG4gIC8qIFVJIGZ1bmN0aW9ucyAqL1xuXG4gIC8vIHRoZXJlIGlzIGEgc29sdXRpb25cbiAgZnVuY3Rpb24gdHJhY2VQYXRoKHBhdGgsIGNsb25lZCkge1xuICAgIGNvbnN0IGRyYXdQYXRoID0gWy4uLnBhdGhdO1xuICAgIGNvbnN0IGNsb25lZE1hemUgPSBjbG9uZWQ7XG5cbiAgICBjb25zdCBpbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKCFkcmF3UGF0aC5sZW5ndGgpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElkKTtcbiAgICAgICAgLy8gcmVzZXRcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgcmVuZGVyKG1hcHBlZE1hemUpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVzZS1iZWZvcmUtZGVmaW5lXG4gICAgICAgICAgc3RhcnQgPSBudWxsO1xuICAgICAgICAgIGdvYWwgPSBudWxsO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBkcmF3UGF0aC5zaGlmdCgpO1xuICAgICAgICBjbG9uZWRNYXplW2l0ZW0ucm93XVtpdGVtLmNvbHVtbl0ucGF0aCA9IHRydWU7XG4gICAgICAgIHJlbmRlcihjbG9uZWRNYXplKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11c2UtYmVmb3JlLWRlZmluZVxuICAgICAgfVxuICAgIH0sIDEzMyk7XG4gIH1cblxuICAvLyB0aGVyZSBpcyBubyBzb2x1dGlvblxuICBmdW5jdGlvbiBub1BhdGgoZ29hbFBvaW50LCBjbG9uZWQpIHtcbiAgICBjb25zb2xlLmxvZygnbm8gcGF0aCcpO1xuICAgIGNvbnN0IGNsb25lZE1hemUgPSBjbG9uZWQ7XG5cbiAgICBjbG9uZWRNYXplW2dvYWxQb2ludFswXV1bZ29hbFBvaW50WzFdXS5nb2FsID0gZmFsc2U7XG4gICAgcmVuZGVyKGNsb25lZE1hemUpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVzZS1iZWZvcmUtZGVmaW5lXG5cbiAgICAvLyByZXNldFxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZGVsZXRlIGNsb25lZE1hemVbZ29hbFBvaW50WzBdXVtnb2FsUG9pbnRbMV1dLmdvYWw7XG4gICAgICByZW5kZXIoY2xvbmVkTWF6ZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdXNlLWJlZm9yZS1kZWZpbmVcbiAgICAgIGdvYWwgPSBudWxsO1xuICAgIH0sIDEwMDApO1xuICB9XG5cbiAgLy8gaGFuZGxlIGEgY2xpY2tcbiAgZnVuY3Rpb24gY2xpY2tIYW5kbGVyKGNlbGwsIGNsb25lZCkge1xuICAgIGNvbnN0IGNsb25lZE1hemUgPSBjbG9uZWQ7XG4gICAgY29uc3QgY2VsbEVsID0gY2VsbDtcbiAgICBjb25zdCByb3cgPSBwYXJzZUludChjZWxsRWwuZGF0YXNldC5yb3csIDEwKTtcbiAgICBjb25zdCBjb2x1bW4gPSBwYXJzZUludChjZWxsRWwuZGF0YXNldC5jb2x1bW4sIDEwKTtcblxuICAgIGlmICghc3RhcnQpIHtcbiAgICAgIHN0YXJ0ID0gW3JvdywgY29sdW1uXTtcbiAgICAgIGNsb25lZE1hemVbcm93XVtjb2x1bW5dLnN0YXJ0ID0gdHJ1ZTtcbiAgICAgIHJlbmRlcihjbG9uZWRNYXplKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11c2UtYmVmb3JlLWRlZmluZVxuICAgIH0gZWxzZSBpZiAoIWdvYWwpIHtcbiAgICAgIGdvYWwgPSBbcm93LCBjb2x1bW5dO1xuICAgICAgY2xvbmVkTWF6ZVtyb3ddW2NvbHVtbl0uZ29hbCA9IHRydWU7XG5cbiAgICAgIC8vIHNvbHZlXG4gICAgICBjb25zdCBwYXRoID0gc29sdmVyLnNvbHZlKHN0YXJ0LCBnb2FsKTtcbiAgICAgIC8vIGRyYXdcbiAgICAgIGlmIChzb2x2ZXIucGF0aC5sZW5ndGgpIHtcbiAgICAgICAgdHJhY2VQYXRoKHBhdGgsIGNsb25lZE1hemUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9QYXRoKGdvYWwsIGNsb25lZE1hemUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qIHJlbmRlciB0aGUgd2hvbGUgc2NyZWVuIHdpdGggZWFjaCBjaGFuZ2UgKi9cbiAgZnVuY3Rpb24gcmVuZGVyKG1hcHBlZCkge1xuICAgIC8vIGNyZWF0ZSBhIGRlZXAgY29weSBvZiB0aGUgbWF6ZSB0byBiZSBtb2RpZmllZCBhbmQgcmVuZGVyZWRcbiAgICBjb25zdCBjbG9uZWRNYXplID0gbWFwcGVkLm1hcChyb3cgPT4gcm93Lm1hcCgoY29sdW1uKSA9PiB7XG4gICAgICBjb25zdCBvYmogPSBPYmplY3QuYXNzaWduKHt9LCBjb2x1bW4pO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9KSk7XG5cbiAgICAvLyB3aWxsIGJlIHJlbW92ZWQgYW5kIHJlYXBwZW5kZWQuXG4gICAgY29uc3QgY29udGFpbmVyRWwgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XG4gICAgY29udGFpbmVyRWwuaWQgPSAnY29udGFpbmVyJztcbiAgICBjb250YWluZXJFbC5jbGFzc05hbWUgPSAnbWF6ZSc7XG5cbiAgICBjb25zdCB0YWJsZUVsID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ1RBQkxFJyk7XG5cbiAgICBjbG9uZWRNYXplLmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHJvd0VsID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ1RSJyk7XG5cbiAgICAgIHJvdy5mb3JFYWNoKChjb2x1bW4sIGNvbHVtbkluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGNlbGxFbCA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdURCcpO1xuICAgICAgICBjZWxsRWwuZGF0YXNldC5yb3cgPSByb3dJbmRleDtcbiAgICAgICAgY2VsbEVsLmRhdGFzZXQuY29sdW1uID0gY29sdW1uSW5kZXg7XG5cbiAgICAgICAgLy8gb25seSBjbGlja3Mgb24gb3BlbiBzcGFjZXMgYWxsb3dlZFxuICAgICAgICBpZiAoIWNsb25lZE1hemVbcm93SW5kZXhdW2NvbHVtbkluZGV4XS52YWx1ZSkge1xuICAgICAgICAgIGNlbGxFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGNsaWNrSGFuZGxlcihjZWxsRWwsIGNsb25lZE1hemUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVUkgdmFyaWF0aW9ucyBvZiBjZWxsc1xuICAgICAgICBjb25zdCB2YWwgPSBjbG9uZWRNYXplW3Jvd0luZGV4XVtjb2x1bW5JbmRleF0udmFsdWU7XG4gICAgICAgIGNlbGxFbC5pbm5lckhUTUwgPSBudW1iZXJUb0Vtb2ppKHZhbCk7XG4gICAgICAgIGlmICghdmFsKSB7XG4gICAgICAgICAgY2VsbEVsLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjZWxsRWwuc3R5bGUuY3Vyc29yID0gJ25vbmUnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsb25lZE1hemVbcm93SW5kZXhdW2NvbHVtbkluZGV4XS5nb2FsKSB7XG4gICAgICAgICAgY2VsbEVsLnN0eWxlLmNvbG9yID0gJ2RhcmtibHVlJztcbiAgICAgICAgICBjZWxsRWwuaW5uZXJIVE1MID0gJyYjOTY3OSc7XG4gICAgICAgICAgY2VsbEVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZWVlZWZmJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbG9uZWRNYXplW3Jvd0luZGV4XVtjb2x1bW5JbmRleF0uZ29hbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBjZWxsRWwuc3R5bGUuY29sb3IgPSAnZGFya2JsdWUnO1xuICAgICAgICAgIGNlbGxFbC5pbm5lckhUTUwgPSAnWCc7XG4gICAgICAgICAgY2VsbEVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZWVlZWZmJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbG9uZWRNYXplW3Jvd0luZGV4XVtjb2x1bW5JbmRleF0uc3RhcnQpIHtcbiAgICAgICAgICBjZWxsRWwuc3R5bGUuY29sb3IgPSAnYmx1ZSc7XG4gICAgICAgICAgY2VsbEVsLmlubmVySFRNTCA9ICcmIzk2NzknO1xuICAgICAgICAgIGNlbGxFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2VlZWVmZic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xvbmVkTWF6ZVtyb3dJbmRleF1bY29sdW1uSW5kZXhdLnBhdGgpIHtcbiAgICAgICAgICBjZWxsRWwuc3R5bGUuY29sb3IgPSAnYmx1ZSc7XG4gICAgICAgICAgY2VsbEVsLmlubmVySFRNTCA9ICcmIzk2NzknO1xuICAgICAgICAgIGNlbGxFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2VlZWVmZic7XG4gICAgICAgIH1cblxuICAgICAgICByb3dFbC5hcHBlbmRDaGlsZChjZWxsRWwpO1xuICAgICAgfSk7XG5cbiAgICAgIHRhYmxlRWwuYXBwZW5kQ2hpbGQocm93RWwpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyRWwuYXBwZW5kQ2hpbGQodGFibGVFbCk7XG5cbiAgICBjb25zdCBleGlzdGluZyA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJyk7XG4gICAgaWYgKGV4aXN0aW5nKSB3aW5kb3cuZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChleGlzdGluZyk7XG5cbiAgICB3aW5kb3cuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb250YWluZXJFbCk7XG4gIH1cblxuICAvLyByZW5kZXIgaXRcbiAgcmVuZGVyKHNvbHZlci5tYXBwZWRNYXplKTtcbn1cblxuLyogbGlzdGVuIHRvIHRoZSBsb2FkZXIgKi9cbndpbmRvdy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtYXplZCcsIChlKSA9PiB7XG4gIHZhbmlsbGEoZS5kZXRhaWwuc29sdmVyKTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==