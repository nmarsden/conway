/* eslint-disable */
fs = require('fs');

const NUM_ROWS = 100;
const NUM_COLUMNS = 100;
const CELL_SIZE  = 20;
const GAP_SIZE = 2;
const MARGIN = 1;
const TOTAL_WIDTH = NUM_COLUMNS * CELL_SIZE;
const TOTAL_HEIGHT = NUM_ROWS * CELL_SIZE;
const COLOR = "white";

let elements = '\n';
let elementSize = CELL_SIZE - GAP_SIZE;
for (let x=MARGIN; x<TOTAL_WIDTH; x=x+CELL_SIZE) {
    for (let y=MARGIN; y<TOTAL_HEIGHT; y=y+CELL_SIZE) {
        elements += `    <rect x="${x}" y="${y}" width="${elementSize}" height="${elementSize}" stroke="none" fill="${COLOR}"/>\n`
    }
}

const data = `<svg width="${TOTAL_WIDTH}" height="${TOTAL_HEIGHT}" viewBox="0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <g fill="transparent">${elements}  </g>
</svg>`;

fs.writeFile('src/assets/images/grid.svg', data, () => {});