import {Pattern, Simulator} from "../../src/utils/simulator";

describe('Simulator', () => {

  const NUM_ROWS = 6;
  const NUM_COLUMNS = 6;
  const PATTERN = Pattern.Glider

  const cellDataToString = (cellData: number[]): string[] => {
    const str = cellData.map(c => c === 0 ? '_' : c.toString(10)).join('');
    const rows = [];
    for (let i = 0; i < str.length; i += NUM_COLUMNS) {
      rows.push(str.substring(i, i + NUM_COLUMNS));
    }
    return rows;
  };

  describe('when simulating without history', () => {
    let simulator: Simulator;

    beforeEach(() => {
      simulator = new Simulator({numColumns: NUM_COLUMNS, numRows: NUM_ROWS, pattern: PATTERN});
    });

    test('should simulate gen 1', () => {
      expect(cellDataToString(simulator.initialGeneration().cellData)).toEqual([
        '______',
        '_1____',
        '__11__',
        '_11___',
        '______',
        '______',
      ]);
    });

    test('should simulate gen 2', () => {
      simulator.initialGeneration();
      expect(cellDataToString(simulator.nextGeneration(0).cellData)).toEqual([
        '______',
        '__1___',
        '___1__',
        '_111__',
        '______',
        '______',
      ]);
    });

    test('should simulate gen 3', () => {
      simulator.initialGeneration();
      simulator.nextGeneration(0)
      expect(cellDataToString(simulator.nextGeneration(0).cellData)).toEqual([
        '______',
        '______',
        '_1_1__',
        '__11__',
        '__1___',
        '______',
      ]);
    });
  });

  describe('when simulating with history of 2', () => {
    let simulator: Simulator;

    beforeEach(() => {
      simulator = new Simulator({numColumns: NUM_COLUMNS, numRows: NUM_ROWS, pattern: PATTERN});
    });

    test('should simulate gen 2', () => {
      simulator.initialGeneration();
      expect(cellDataToString(simulator.nextGeneration(2).cellData)).toEqual([
        '______',
        '_21___',
        '__21__',
        '_111__',
        '______',
        '______',
      ]);
    });

    test('should simulate gen 3', () => {
      simulator.initialGeneration();
      simulator.nextGeneration(2)
      expect(cellDataToString(simulator.nextGeneration(2).cellData)).toEqual([
        '______',
        '_32___',
        '_131__',
        '_211__',
        '__1___',
        '______',
      ]);
    });
  });
});
