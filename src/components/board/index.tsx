import { FunctionalComponent, h } from 'preact';
import { useState } from "preact/hooks";
import style from './style.css';
import Cell from "../cell";

const CELL_SIZE:number = 30;

const Board: FunctionalComponent = () => {

  const pageWidth = 300;
  const pageHeight = 300;
  const numColumns = Math.floor(pageWidth / CELL_SIZE);
  const numRows = Math.floor(pageHeight / CELL_SIZE);
  const numCells = numColumns * numRows;

  let initialCellData = ():number[] => {
    const newCellData = new Array(numCells).fill(0);
    // -- blinker --
    // newCellData[23] = 1;
    // newCellData[24] = 1;
    // newCellData[25] = 1;

    // -- glider
    newCellData[23] = 1;
    newCellData[34] = 1;
    newCellData[42] = 1;
    newCellData[43] = 1;
    newCellData[44] = 1;

    return newCellData;
  }

  const [cellData, setCellData] = useState(initialCellData());

  let toIndex = (col:number, row:number):number => {
    const c = (col < 0) ? (numColumns - 1) : (col === numColumns) ? 0 : col;
    const r = (row < 0) ? (numRows - 1) : (row === numRows) ? 0 : row;
    return (numColumns * r) + c;
  }

  let cellValue = (col:number, row:number):number => {
    return cellData[toIndex(col, row)];
  }

  let activeNeighbourCount = (col:number, row:number):number => {
    let count = 0;
    count += cellValue(col - 1, row - 1);
    count += cellValue(col, row - 1);
    count += cellValue(col + 1, row - 1);

    count += cellValue(col - 1, row);
    count += cellValue(col + 1, row);

    count += cellValue(col - 1, row + 1);
    count += cellValue(col, row + 1);
    count += cellValue(col + 1, row + 1);
    return count;
  }

  let isActive = (col:number, row:number):boolean => {
    const neighbourCount = activeNeighbourCount(col, row);
    if (cellValue(col,row) === 1) {
      return (neighbourCount === 2 || neighbourCount === 3);
    } else {
      return (neighbourCount === 3);
    }
  }

  let nextGeneration = () => {
    let updatedCellData = [...cellData];
    for(let col=0; col<numColumns; col++) {
      for(let row=0; row<numRows; row++) {
        updatedCellData[toIndex(col, row)] = (isActive(col, row) ? 1 : 0);
      }
    }
    setCellData(updatedCellData);
  }

  setTimeout(nextGeneration,1000);

  let cells = () => {
    return cellData.map(d => <Cell isActive={d === 1}></Cell>);
  };

  return (
    <div class={style['board-container']}>
      { cells() }
    </div>
  );
};

export default Board;
