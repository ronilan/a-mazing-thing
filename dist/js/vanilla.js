!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=13)}({13:function(e,t){function n(e){const{mappedMaze:t}=e;let n=null,o=null;function r(r,a){const u=a,c=r,d=parseInt(c.dataset.row,10),i=parseInt(c.dataset.column,10);if(n){if(!o){o=[d,i],u[d][i].goal=!0;const r=e.solve(n,o);e.path.length?function(e,r){const a=[...e],u=r,c=setInterval(()=>{if(a.length){const e=a.shift();u[e.row][e.column].path=!0,l(u)}else clearInterval(c),setTimeout(()=>{l(t),n=null,o=null},1e3)},133)}(r,u):function(e,t,r){const a=r;a[t[0]][t[1]].goal=!1,l(a),setTimeout(()=>{delete a[t[0]][t[1]].goal,delete a[e[0]][e[1]].start,l(a),o=null,n=null},1e3)}(n,o,u)}}else n=[d,i],u[d][i].start=!0,l(u)}function l(e){const t=e.map(e=>e.map(e=>{return Object.assign({},e)})),n=window.document.createElement("DIV");n.id="maze",n.className="maze";const o=window.document.createElement("TABLE");t.forEach((e,n)=>{const l=window.document.createElement("TR");e.forEach((e,o)=>{const a=window.document.createElement("TD");a.dataset.row=n,a.dataset.column=o,t[n][o].value||a.addEventListener("click",()=>{r(a,t)});const u=t[n][o].value;a.innerHTML=function(e){let t="&#127794;";return e||(t="&sdot;"),1===e&&(t="&#127794;"),2===e&&(t="&#127795;"),3===e&&(t="&#127796;"),4===e&&(t="&#127968;"),5===e&&(t="&#127797;"),t}(u),a.style.cursor=u?"none":"pointer",t[n][o].goal&&(a.style.color="darkblue",a.innerHTML="&#9679",a.style.backgroundColor="#eeeeff"),!1===t[n][o].goal&&(a.style.color="darkblue",a.innerHTML="X",a.style.backgroundColor="#eeeeff"),t[n][o].start&&(a.style.color="blue",a.innerHTML="&#9679",a.style.backgroundColor="#eeeeff"),t[n][o].path&&(a.style.color="blue",a.innerHTML="&#9679",a.style.backgroundColor="#eeeeff"),l.appendChild(a)}),o.appendChild(l)}),n.appendChild(o);const l=window.document.getElementById("vanilla-parent")||window.document.body,a=window.document.getElementById("maze");a&&l.removeChild(a),l.appendChild(n)}l(e.mappedMaze)}window.document.addEventListener("mazed",e=>{n(e.detail.solver)})}});