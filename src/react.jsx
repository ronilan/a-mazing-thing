import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// Cell component
function Cell (props) {
  const {
    item, handleClick
  } = props

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

  let htmlString = numberToEmoji(item.value)
  if (item.path || item.start || item.goal) htmlString = '&#9679'
  if (item.goal === false) htmlString = 'X'

  const clickable = classNames({
    clickable: true,
    start: item.start && true,
    goal: (item.goal === false || item.goal) && true,
    path: item.path && true
  })

  if (!item.value) {
    return (
      <td className={clickable} onClick={handleClick}>
        <span dangerouslySetInnerHTML={{ __html: htmlString }} />
      </td>
    )
  }

  return (
    <td className="not-clickable">
      <span dangerouslySetInnerHTML={{ __html: htmlString }} />
    </td>
  )
}

Cell.propTypes = {
  item: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired
}

// Maze component
class Maze extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mappedMaze: null,
      solver: null,
      start: null,
      goal: null,
      path: [],
      drawing: false
    }

    this.gotMaze = this.gotMaze.bind(this)
  }

  componentDidMount () {
    window.document.addEventListener('mazed', this.gotMaze)
  }

  // all animation logic
  componentDidUpdate () {
    const {
      start, goal, path, mappedMaze, solver, drawing
    } = this.state

    // user is done selecting
    if (start && goal) {
      // solve
      if (!solver.path.length && !drawing) {
        this.setState({ path: [...solver.solve(start, goal)], drawing: true })
      }
    }

    // timed drawign mode
    if (drawing) {
      if (solver.path.length) {
        // something to draw
        if (path.length) {
          const item = path.shift()
          mappedMaze[item.row][item.column].path = true
          // wait before each "update". This allows rendering to happen.
          setTimeout(() => {
            this.setState({ mappedMaze, path, drawing: true })
          }, 100) // note: react render takes "unknown" time
        }
        // nothing more to draw
        if (drawing && !path.length) {
          setTimeout(() => {
            this.setState({
              start: null, goal: null, mappedMaze: solver.mappedMaze, drawing: false
            }, () => { solver.path.length = 0 })
          }, 1000)
        }
      } else if (goal) {
        mappedMaze[goal[0]][goal[1]].goal = false
        this.setState({ mappedMaze, goal: false })

        // reset goal and start
        setTimeout(() => {
          delete mappedMaze[goal[0]][goal[1]].goal
          delete mappedMaze[start[0]][start[1]].start
          this.setState({
            mappedMaze, start: null, goal: null, drawing: false
          })
        }, 1000)
      }
    }
  }

  componentWillUnmount () {
    window.document.removeEventListener('mazed', this.gotMaze)
  }

  gotMaze (e) {
    this.setState({
      solver: e.detail.solver,
      mappedMaze: e.detail.solver.mappedMaze
    })
  }

  handleClick (item) {
    const { start, mappedMaze, drawing } = this.state

    if (!start && !drawing) {
      mappedMaze[item.row][item.column].start = true
      this.setState({ mappedMaze, start: [item.row, item.column] })
    } else if (!drawing) {
      mappedMaze[item.row][item.column].goal = true
      this.setState({ mappedMaze, goal: [item.row, item.column] })
    }
  }

  render () {
    const { mappedMaze } = this.state

    const renderedTable = mappedMaze && mappedMaze.map((row) => {
      const renderedRow = row.map((item) => {
        const key = `${item.row}-${item.column}`
        return (
          <Cell
            key={key}
            item={item}
            handleClick={() => { this.handleClick(item) }}
          />
        )
      })

      return (<tr key={Math.random().toString(36).substring(2, 15)}>{renderedRow}</tr>)
    })

    return (
      <table>
        <tbody>
          {renderedTable}
        </tbody>
      </table>
    )
  }
}

ReactDOM.render(<Maze />, window.document.getElementById('react-parent'))
