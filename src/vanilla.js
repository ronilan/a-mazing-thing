function vanilla (solver) {
  const { mappedMaze } = solver
  let start = null
  let goal = null

  /* utils */
  function numberToEmoji (num) {
    let char = '&#127794;'

    if (!num) char = '&sdot;'
    if (num === 1) char = '&#127794;'
    if (num === 2) char = '&#127795;'
    if (num === 3) char = '&#127796;'
    if (num === 4) char = '&#127968;'
    if (num === 5) char = '&#127797;'

    return char
  }

  /* UI functions */

  // there is a solution
  function tracePath (path, cloned) {
    const drawPath = [...path]
    const clonedMaze = cloned

    const intervalId = setInterval(() => {
      if (!drawPath.length) {
        clearInterval(intervalId)
        // reset
        setTimeout(() => {
          render(mappedMaze) // eslint-disable-line no-use-before-define
          start = null
          goal = null
        }, 1000)
      } else {
        const item = drawPath.shift()
        clonedMaze[item.row][item.column].path = true
        render(clonedMaze) // eslint-disable-line no-use-before-define
      }
    }, 133)
  }

  // there is no solution
  function noPath (startPoint, goalPoint, cloned) {
    const clonedMaze = cloned

    clonedMaze[goalPoint[0]][goalPoint[1]].goal = false
    render(clonedMaze) // eslint-disable-line no-use-before-define

    // reset
    setTimeout(() => {
      delete clonedMaze[goalPoint[0]][goalPoint[1]].goal
      delete clonedMaze[startPoint[0]][startPoint[1]].start
      render(clonedMaze) // eslint-disable-line no-use-before-define
      goal = null
      start = null
    }, 1000)
  }

  // handle a click
  function clickHandler (cell, cloned) {
    const clonedMaze = cloned
    const cellEl = cell
    const row = parseInt(cellEl.dataset.row, 10)
    const column = parseInt(cellEl.dataset.column, 10)

    if (!start) {
      start = [row, column]
      clonedMaze[row][column].start = true
      render(clonedMaze) // eslint-disable-line no-use-before-define
    } else if (!goal) {
      goal = [row, column]
      clonedMaze[row][column].goal = true

      // solve
      const path = solver.solve(start, goal)
      // draw
      if (solver.path.length) {
        tracePath(path, clonedMaze)
      } else {
        noPath(start, goal, clonedMaze)
      }
    }
  }

  /* render the whole screen with each change */
  function render (mapped) {
    // create a deep copy of the maze to be modified and rendered
    const clonedMaze = mapped.map(row => row.map((column) => {
      const obj = Object.assign({}, column)
      return obj
    }))

    // will be removed and reappended.
    const mazeEl = window.document.createElement('DIV')
    mazeEl.id = 'maze'
    mazeEl.className = 'maze'

    const tableEl = window.document.createElement('TABLE')

    clonedMaze.forEach((row, rowIndex) => {
      const rowEl = window.document.createElement('TR')

      row.forEach((column, columnIndex) => {
        const cellEl = window.document.createElement('TD')
        cellEl.dataset.row = rowIndex
        cellEl.dataset.column = columnIndex

        // only clicks on open spaces allowed
        if (!clonedMaze[rowIndex][columnIndex].value) {
          cellEl.addEventListener('click', () => {
            clickHandler(cellEl, clonedMaze)
          })
        }

        // UI variations of cells
        const val = clonedMaze[rowIndex][columnIndex].value
        cellEl.innerHTML = numberToEmoji(val)
        if (!val) {
          cellEl.style.cursor = 'pointer'
        } else {
          cellEl.style.cursor = 'none'
        }

        if (clonedMaze[rowIndex][columnIndex].goal) {
          cellEl.style.color = 'darkblue'
          cellEl.innerHTML = '&#9679'
          cellEl.style.backgroundColor = '#eeeeff'
        }

        if (clonedMaze[rowIndex][columnIndex].goal === false) {
          cellEl.style.color = 'darkblue'
          cellEl.innerHTML = 'X'
          cellEl.style.backgroundColor = '#eeeeff'
        }

        if (clonedMaze[rowIndex][columnIndex].start) {
          cellEl.style.color = 'blue'
          cellEl.innerHTML = '&#9679'
          cellEl.style.backgroundColor = '#eeeeff'
        }

        if (clonedMaze[rowIndex][columnIndex].path) {
          cellEl.style.color = 'blue'
          cellEl.innerHTML = '&#9679'
          cellEl.style.backgroundColor = '#eeeeff'
        }

        rowEl.appendChild(cellEl)
      })

      tableEl.appendChild(rowEl)
    })

    mazeEl.appendChild(tableEl)

    const parent = window.document.getElementById('vanilla-parent') || window.document.body

    const existing = window.document.getElementById('maze')
    if (existing) parent.removeChild(existing)

    parent.appendChild(mazeEl)
  }

  // render it
  render(solver.mappedMaze)
}

/* listen to the loader */
window.document.addEventListener('mazed', (e) => {
  vanilla(e.detail.solver)
})
