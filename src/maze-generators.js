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
export async function mazeFromFileNameinHash() {
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
export function mazeFromRandom(rows = null, columns = null) {
  const needColumns = columns || parseInt(((window.innerWidth - 30) / 30), 10);
  const needRows = rows || parseInt(((window.innerHeight - 30) / 30), 10);

  const json = {
    maze: new Array(needRows).fill(null).map(() => new Array(needColumns).fill(null).map(() => {
      const ratio = Math.floor(Math.random() * 3); // how many obstacles per space
      if (!ratio) return Math.floor(Math.random() * 10) + 1; // randomize obstacles
      return 0;
    })),
  };

  return json;
}
