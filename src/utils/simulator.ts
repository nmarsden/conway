const CELL_SIZE = 30;
const pageWidth = 300;
const pageHeight = 300;
const numColumns = Math.floor(pageWidth / CELL_SIZE);
const numRows = Math.floor(pageHeight / CELL_SIZE);
const numCells = numColumns * numRows;

export class Simulator {

  private cellData: number[];

  constructor() {
    this.cellData = Simulator.initialCellData();
  }

  initialState(): number[] {
    return [...this.cellData];
  }

  nextGeneration(): number[] {
    const updatedCellData = [...this.cellData];
    for(let col=0; col<numColumns; col++) {
      for(let row=0; row<numRows; row++) {
        updatedCellData[Simulator.toIndex(col, row)] = (this.isActive(col, row) ? 1 : 0);
      }
    }
    this.cellData = updatedCellData;
    return [...this.cellData];
  }

  private static initialCellData(): number[] {
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

  private static toIndex(col: number, row: number): number {
    const c = (col < 0) ? (numColumns - 1) : (col === numColumns) ? 0 : col;
    const r = (row < 0) ? (numRows - 1) : (row === numRows) ? 0 : row;
    return (numColumns * r) + c;
  }

  private cellValue(col: number, row: number): number {
    return this.cellData[Simulator.toIndex(col, row)];
  }

  private activeNeighbourCount(col: number, row: number): number {
    let count = 0;
    count += this.cellValue(col - 1, row - 1);
    count += this.cellValue(col, row - 1);
    count += this.cellValue(col + 1, row - 1);

    count += this.cellValue(col - 1, row);
    count += this.cellValue(col + 1, row);

    count += this.cellValue(col - 1, row + 1);
    count += this.cellValue(col, row + 1);
    count += this.cellValue(col + 1, row + 1);
    return count;
  }

  private isActive(col: number, row: number): boolean {
    const neighbourCount = this.activeNeighbourCount(col, row);
    if (this.cellValue(col,row) === 1) {
      return (neighbourCount === 2 || neighbourCount === 3);
    }
    return (neighbourCount === 3);
  }

}