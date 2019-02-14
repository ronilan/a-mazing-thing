# A* Mazing Thing

## What is this?

This repo a demo of an [A* pathfinding algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm) encapsulated as an ES6 JavaScript Class.

There are two interactive demos included, one written in Vanilla JavaScript and one written using the [BlocklLike.js](https://github.com/ronilan/BlockLike) (https://www.blocklike.org) educational library.

Mazes can either be generated at random or loaded from a predefined file.

## Live Demos
Generated:

- [BlockLike based, full screen, random obstacles](https://www.ronilan.com/a-mazing-thing/blocklike.html)

- [Vanilla JS based, full screen, random obstacles](https://www.ronilan.com/a-mazing-thing/vanilla.html)

Loaded:

- [BlockLike based, loaded from file](https://www.ronilan.com/a-mazing-thing/blocklike.html#1)

- [Vanilla JS based, loaded from file](https://www.ronilan.com/a-mazing-thing/vanilla.html#4)
 
Accessing those pages will generate a maze. 

First click sets the start point, second click sets the end point and the maze is then solved using the A* algorithm. 

The animation is for illustration only and it happens only after computation has completed. When animation is done the maze will reset itself and await new start and end points.

All obstacles are emoji. They will differ in look between devices.

## Develop

Make sure to have [Node.js](https://nodejs.org) installed.

Clone the repo.

In a terminal:

```sh
npm install
npm start
```
To build:
```sh
npm run build
```
To watch for changes:
```sh
npm run watch
```

## Make your own mazes

A maze is defined as a json object with (at least) one key "maze", which has as value a two-dimensional array of numbers. Any cell in the array that contains a 0 (or null, or empty string) is considered passable. Any other value is an obstacle.

This is a maze:
```
{"maze":[
  [1,0,1,1,1,1,1],
  [1,0,0,0,0,0,1],
  [1,1,1,1,1,0,1],
  [1,0,0,0,0,0,1],
  [1,0,1,1,1,1,1]
]}
```

There are two ways you can design your own mazes:
1. Create a maze json file. 
Examples are at the ```dist/mazes folder```.
2. Create an ASCII maze.
Use the + -- | notation. Examples are at the ```drafts``` folder. Use the converter script to generate a maze json. From project root: ```node scripts/convert.js drafts/3.txt > dist/mazes/3.json```

## Authors

[Ron Ilan](https://www.ronilan.com)

## License
[MIT](https://en.wikipedia.org/wiki/MIT_License)

###### Fabriqué au Canada : Made in Canada