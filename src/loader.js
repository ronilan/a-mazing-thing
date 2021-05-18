import AStarSolver from './AStarSolver'
import { mazeFromFileNameinHash, mazeFromRandom } from './maze-generators'

/**
* init - anachronistically initializes a maze, and a solver for that maze.
* dispatch document level event with solver as payload.
*/
async function init () {
  let json = await mazeFromFileNameinHash()
  if (!json) json = mazeFromRandom(window.mazeRows, window.mazeColumns)

  const solver = new AStarSolver(json.maze)

  const event = new window.CustomEvent('mazed', { detail: { solver } })
  window.document.dispatchEvent(event)
}

init()
