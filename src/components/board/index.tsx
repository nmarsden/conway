import { FunctionalComponent, h } from 'preact';
import style from './style.css';
import Cell from "../cell";

const CELL_SIZE:number = 30;

const Board: FunctionalComponent = () => {

  const pageWidth = 300;
  const pageHeight = 300;
  const numColumns = Math.floor(pageWidth / CELL_SIZE);
  const numRows = Math.floor(pageHeight / CELL_SIZE);
  const numCells = numColumns * numRows;
  const cellData:number[] = new Array(numCells).fill(0);

  let cells = () => {
    return cellData.map(d => <Cell></Cell>);
  };

  return (
    <div class={style['board-container']}>
      { cells() }
    </div>
  );
};

export default Board;
