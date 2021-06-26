import {Pattern, PATTERN_DATA} from "./simulator";

export type PatternDimensions = {
  numColumns: number;
  numRows: number;
};

export class PatternProvider {

  public static getPatternDimensions(pattern: Pattern): PatternDimensions {
    if (pattern === Pattern.Random) {
      return {
        numColumns: 10,
        numRows: 10
      }
    }
    const patternData = PATTERN_DATA[pattern];
    const patternWidth = patternData[0].length;
    const patternHeight = patternData.length;
    return {
      numColumns: patternWidth,
      numRows: patternHeight
    }
  }

  public static getPatternData(pattern: Pattern, numColumns: number, numRows: number): number[] {
    const newCellData = new Array(numColumns * numRows).fill(0);
    this.applyPatternData(newCellData, numColumns, numRows, this.getPatternOrRandomData(pattern, numColumns, numRows));
    return newCellData;
  }

  private static applyPatternData(cellDataToUpdate: number[], numColumns: number, numRows: number, patternData: string[]): void {
    const patternWidth = patternData[0].length;
    const patternHeight = patternData.length;
    const patternColOffset = Math.floor((numColumns - patternWidth) / 2);
    const patternRowOffset = Math.floor((numRows - patternHeight) / 2);

    for (let col = 0; col < patternWidth; col++) {
      for (let row = 0; row < patternHeight; row++) {
        if (patternData[row].split('')[col] === '*') {
          cellDataToUpdate[this.toIndex(patternColOffset + col, patternRowOffset + row, numColumns, numRows)] = 1;
        }
      }
    }
  }

  private static getPatternOrRandomData(pattern: Pattern, numColumns: number, numRows: number): string[] {
    if (pattern === Pattern.Random) {
      return this.generateRandomPatternData(numColumns, numRows);
    }
    return PATTERN_DATA[pattern];
  }

  private static generateRandomPatternData(numColumns: number, numRows: number): string[] {
    const patternStrings: string[] = [];
    for (let row = 0; row < numRows; row++) {
      let patternRow = '';
      for (let col = 0; col < numColumns; col++) {
        patternRow += (Math.random() > 0.8) ? '*' : ' ';
      }
      patternStrings.push(patternRow);
    }
    return patternStrings;
  }

  private static toIndex(col: number, row: number, numColumns: number, numRows: number): number {
    const c = (col < 0) ? (numColumns - 1) : (col === numColumns) ? 0 : col;
    const r = (row < 0) ? (numRows - 1) : (row === numRows) ? 0 : row;
    return (numColumns * r) + c;
  }

}