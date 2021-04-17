// eslint-disable-next-line @typescript-eslint/camelcase
export enum Pattern { Blinker, Pulsar, Glider, Lightweight_Spaceship, Gosper_Glider_Gun, Flotilla }

type SimulatorSettings = {
  numColumns: number;
  numRows: number;
  pattern: Pattern;
}

export type Generation = {
  num: number;
  cellData: number[];
}

const PATTERNS = {
  [Pattern.Blinker]: [
    '     ',
    '  *  ',
    '  *  ',
    '  *  ',
    '     '
  ],
  [Pattern.Pulsar]: [
    '               ',
    '   ***   ***   ',
    '               ',
    ' *    * *    * ',
    ' *    * *    * ',
    ' *    * *    * ',
    '   ***   ***   ',
    '               ',
    '   ***   ***   ',
    ' *    * *    * ',
    ' *    * *    * ',
    ' *    * *    * ',
    '               ',
    '   ***   ***   ',
    '               '
  ],
  [Pattern.Glider]: [
    '     ',
    ' *   ',
    '  ** ',
    ' **  ',
    '     '
  ],
  [Pattern.Lightweight_Spaceship]: [
    '       ',
    ' *  *  ',
    '     * ',
    ' *   * ',
    '  **** ',
    '       '
  ],
  [Pattern.Gosper_Glider_Gun]: [
    '                                      ',
    '                         *            ',
    '                       * *            ',
    '             **      **            ** ',
    '            *   *    **            ** ',
    ' **        *     *   **               ',
    ' **        *   * **    * *            ',
    '           *     *       *            ',
    '            *   *                     ',
    '             **                       ',
    '                                      '
  ],
  [Pattern.Flotilla]: [
    '                 ',
    '     ****        ',
    '    ******       ',
    '   ** ****       ',
    '    **           ',
    '                 ',
    '            **   ',
    '  *            * ',
    ' *             * ',
    ' *               ',
    ' **************  ',
    '                 ',
    '                 ',
    '     ****        ',
    '    ******       ',
    '   ** ****       ',
    '    **           ',
    '                 '
  ]
}

export class Simulator {
  private settings: SimulatorSettings;
  private generation: Generation;

  constructor(settings: SimulatorSettings) {
    this.settings = settings;
    this.generation = { num: 0, cellData: [] };
  }

  initialGeneration(): Generation {
    this.generation = { num: 1, cellData: this.initialCellData() };
    return { ...this.generation };
  }

  private getCurrentGenCellDataWithoutHistory(): number[]  {
    return this.generation.cellData.map(c => c === this.generation.num ? 1 : 0);
  }

  private getCurrentGenCellDataWithHistory(historySize: number): number[]  {
    const genCutoff = Math.max(0, this.generation.num - historySize - 1);

    return this.generation.cellData.map(c => c > genCutoff ? (this.generation.num - c + 1) : 0);
  }

  nextGeneration(historySize: number): Generation {
    const currentGenCellData = this.getCurrentGenCellDataWithoutHistory();
    const nextGenCellData = [...currentGenCellData];
    for(let col=0; col<this.settings.numColumns; col++) {
      for(let row=0; row<this.settings.numRows; row++) {
        nextGenCellData[this.toIndex(col, row)] = (this.isActive(currentGenCellData, col, row) ? 1 : 0);
      }
    }
    const nextGenNum = this.generation.num + 1;
    this.generation = {
      num: nextGenNum,
      cellData: this.generation.cellData.map((c, i) => nextGenCellData[i] === 1 ? nextGenNum : c)
    };
    return {
      num: nextGenNum,
      cellData: this.getCurrentGenCellDataWithHistory(historySize)
    }
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
    this.applyPattern(newCellData, PATTERNS[this.settings.pattern]);
    return newCellData;
  }

  private toIndex(col: number, row: number): number {
    const c = (col < 0) ? (this.settings.numColumns - 1) : (col === this.settings.numColumns) ? 0 : col;
    const r = (row < 0) ? (this.settings.numRows - 1) : (row === this.settings.numRows) ? 0 : row;
    return (this.settings.numColumns * r) + c;
  }

  private cellValue(cellData: number[], col: number, row: number): number {
    return cellData[this.toIndex(col, row)];
  }

  private activeNeighbourCount(cellData: number[], col: number, row: number): number {
    let count = 0;
    count += this.cellValue(cellData,col - 1, row - 1);
    count += this.cellValue(cellData,col, row - 1);
    count += this.cellValue(cellData,col + 1, row - 1);

    count += this.cellValue(cellData,col - 1, row);
    count += this.cellValue(cellData,col + 1, row);

    count += this.cellValue(cellData,col - 1, row + 1);
    count += this.cellValue(cellData,col, row + 1);
    count += this.cellValue(cellData,col + 1, row + 1);
    return count;
  }

  private isActive(cellData: number[], col: number, row: number): boolean {
    const neighbourCount = this.activeNeighbourCount(cellData,col, row);
    if (this.cellValue(cellData,col,row) === 1) {
      return (neighbourCount === 2 || neighbourCount === 3);
    }
    return (neighbourCount === 3);
  }

}