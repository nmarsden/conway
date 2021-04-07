type SimulatorSettings = {
  numColumns: number;
  numRows: number;
}

const PATTERNS = {
  blinker: [
    '   ',
    '***'
  ],
  glider: [
    '*  ',
    ' **',
    '** '
  ],
  lightweightSpaceship: [
    '*  * ',
    '    *',
    '*   *',
    ' ****'
  ]
}

export class Simulator {
  private settings: SimulatorSettings;
  private cellData: number[];

  constructor(settings: SimulatorSettings) {
    this.settings = settings;
    this.cellData = [];
  }

  initialState(): number[] {
    this.cellData = this.initialCellData();
    return [...this.cellData];
  }

  nextGeneration(): number[] {
    const updatedCellData = [...this.cellData];
    for(let col=0; col<this.settings.numColumns; col++) {
      for(let row=0; row<this.settings.numRows; row++) {
        updatedCellData[this.toIndex(col, row)] = (this.isActive(col, row) ? 1 : 0);
      }
    }
    this.cellData = updatedCellData;
    return [...this.cellData];
  }

  private applyPattern(cellDataToUpdate: number[], pattern: string[]): void {
    const patternWidth = pattern[0].length;
    const patternHeight = pattern.length;

    for (let col=0; col<patternWidth; col++) {
      for (let row=0; row<patternHeight; row++) {
        if (pattern[row].split('')[col] === '*') {
          cellDataToUpdate[this.toIndex(col, row)] = 1;
        }
      }
    }
  }

  private initialCellData(): number[] {
    const newCellData = new Array(this.settings.numColumns * this.settings.numRows).fill(0);

    // this.applyPattern(newCellData, PATTERNS['blinker']);
    this.applyPattern(newCellData, PATTERNS['glider']);
    // this.applyPattern(newCellData, PATTERNS['lightweightSpaceship']);

    return newCellData;
  }

  private toIndex(col: number, row: number): number {
    const c = (col < 0) ? (this.settings.numColumns - 1) : (col === this.settings.numColumns) ? 0 : col;
    const r = (row < 0) ? (this.settings.numRows - 1) : (row === this.settings.numRows) ? 0 : row;
    return (this.settings.numColumns * r) + c;
  }

  private cellValue(col: number, row: number): number {
    return this.cellData[this.toIndex(col, row)];
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