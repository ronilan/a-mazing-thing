!function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=14)}({14:function(t,e,n){"use strict";n.r(e);class r{constructor(t){this.maze=t,this.path=[],this.start=[],this.goal=[],this.mappedMaze=this._mapMaze()}_mapMaze(){return this.maze.map((t,e)=>{return t.map((t,n)=>({row:e,column:n,parent:null,value:t,f:0,g:0,h:0}))})}_huristicDistance(t,e){return Math.abs(t[0]-e[0])+Math.abs(t[1]-e[1])}_findNeighbours(t){const e=this.mappedMaze,{row:n,column:r}=t,i=[];return void 0!==e[n+1]&&i.push(e[n+1][r]),void 0!==e[n][r+1]&&i.push(e[n][r+1]),void 0!==e[n-1]&&i.push(e[n-1][r]),void 0!==e[n][r-1]&&i.push(e[n][r-1]),i}_findPath(t){const e=[];let n=t;for(;n.parent;)e.push(n),n=n.parent;e.push(n),this.path=e.reverse()}solve(t,e){if(t.every(t=>this.start.includes(t))&&e.every(t=>this.goal.includes(t))&&this.path.length)return this.path;this.start=t,this.goal=e,this.path=[],this.mappedMaze=this._mapMaze();const n=[];let r=[this.mappedMaze[t[0]][t[1]]];for(;r.length>0&&r.length<500;){const t=r.reduce((t,e)=>e.f<t.f?e:t);if(t.row===e[0]&&t.column===e[1]){this._findPath(t);break}r=r.filter(e=>e!==t),n.push(t);const i=this._findNeighbours(t);for(let a=0;a<i.length;a+=1){const o=i[a];let s=!1;-1!==n.indexOf(o)||t.value||(-1===r.indexOf(o)&&(s=!0,r.push(o)),t.g+1<o.g&&(s=!0),s&&(o.parent=t,o.g=t.g+1,o.h=this._huristicDistance([o.row,o.column],e),o.f=o.g+o.h))}}return this.path}}!async function(){let t=await async function(){if(window.location.hash)try{const t=await window.fetch(`./mazes/${window.location.hash.substring(1)}.json`);return await t.json()}catch(t){return null}return null}();t||(t=function(t=null,e=null){const n=t||parseInt((window.innerWidth-30)/30,10),r=e||parseInt((window.innerHeight-30)/30,10);return{maze:new Array(r).fill(null).map(()=>new Array(n).fill(null).map(()=>Math.floor(3*Math.random())?0:Math.floor(10*Math.random())+1))}}());const e=new r(t.maze),n=new window.CustomEvent("mazed",{detail:{solver:e}});window.document.dispatchEvent(n)}()}});