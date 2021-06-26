import {
  hslToHexNum,
  hslToHexString,
  hexStringToHsl,
  hexNumToHsl,
  lerpColor,
  buildTrail
} from "../../src/utils/colorUtils";
import {CELL_INACTIVE_DARK_MODE, CELL_INACTIVE_LIGHT_MODE} from "../../src/components/app";

describe('colorUtils', () => {

  describe('hslToHexString', () => {

    test('#000000', () => {
      expect(hslToHexString({h:0,s:0,l:0})).toEqual('#000000');
    });

    test('#808080', () => {
      expect(hslToHexString({h:0,s:0,l:50})).toEqual('#808080');
    });

    test('#ffffff', () => {
      expect(hslToHexString({h:0,s:0,l:100})).toEqual('#ffffff');
    });

    test('#ff0000', () => {
      expect(hslToHexString({h:0,s:100,l:50})).toEqual('#ff0000');
    });

    test('#00ff00', () => {
      expect(hslToHexString({h:120,s:100,l:50})).toEqual('#00ff00');
    });

    test('#0000ff', () => {
      expect(hslToHexString({h:240,s:100,l:50})).toEqual('#0000ff');
    });
  });
  
  describe('hslToHexNum', () => {

    test('0x000000', () => {
      expect(hslToHexNum({h:0,s:0,l:0})).toEqual(0x000000);
    });

    test('0x808080', () => {
      expect(hslToHexNum({h:0,s:0,l:50})).toEqual(0x808080);
    });

    test('0xffffff', () => {
      expect(hslToHexNum({h:0,s:0,l:100})).toEqual(0xffffff);
    });

    test('0xff0000', () => {
      expect(hslToHexNum({h:0,s:100,l:50})).toEqual(0xff0000);
    });

    test('0x00ff00', () => {
      expect(hslToHexNum({h:120,s:100,l:50})).toEqual(0x00ff00);
    });

    test('0x0000ff', () => {
      expect(hslToHexNum({h:240,s:100,l:50})).toEqual(0x0000ff);
    });
  });
  
  describe('hexStringToHsl', () => {

    test('{h:0,s:0,l:0}', () => {
      expect(hexStringToHsl('#000000')).toEqual({h: 0, s: 0, l: 0});
    });

    test('{h:0,s:0,l:50.2}', () => {
      expect(hexStringToHsl('#808080')).toEqual({h: 0, s: 0, l: 50.2});
    });

    test('{h:0,s:0,l:100}', () => {
      expect(hexStringToHsl('#ffffff')).toEqual({h: 0, s: 0, l: 100});
    });

    test('{h:0,s:100,l:50}', () => {
      expect(hexStringToHsl('#ff0000')).toEqual({h: 0, s: 100, l: 50});
    });

    test('{h:120,s:100,l:50}', () => {
      expect(hexStringToHsl('#00ff00')).toEqual({h: 120, s: 100, l: 50});
    });

    test('{h:240,s:100,l:50}', () => {
      expect(hexStringToHsl('#0000ff')).toEqual({h: 240, s: 100, l: 50});
    });
  });

  describe('hexNumToHsl', () => {

    test('{h:0,s:0,l:0}', () => {
      expect(hexNumToHsl(0x000000)).toEqual({h: 0, s: 0, l: 0});
    });

    test('{h:0,s:0,l:50.2}', () => {
      expect(hexNumToHsl(0x808080)).toEqual({h: 0, s: 0, l: 50.2});
    });

    test('{h:0,s:0,l:100}', () => {
      expect(hexNumToHsl(0xffffff)).toEqual({h: 0, s: 0, l: 100});
    });

    test('{h:0,s:100,l:50}', () => {
      expect(hexNumToHsl(0xff0000)).toEqual({h: 0, s: 100, l: 50});
    });

    test('{h:120,s:100,l:50}', () => {
      expect(hexNumToHsl(0x00ff00)).toEqual({h: 120, s: 100, l: 50});
    });

    test('{h:240,s:100,l:50}', () => {
      expect(hexNumToHsl(0x0000ff)).toEqual({h: 240, s: 100, l: 50});
    });
  });

  describe('lerpColor', () => {

    test('0x000000', () => {
      expect(lerpColor(0x000000, 0xffffff, 0)).toEqual(0x000000);
    });

    test('0x7f7f7f', () => {
      expect(lerpColor(0x000000, 0xffffff, 0.5)).toEqual(0x7f7f7f);
    });

    test('0xffffff', () => {
      expect(lerpColor(0x000000, 0xffffff, 1)).toEqual(0xffffff);
    });
  });

  describe('buildTrail', () => {

    describe('background dark', () => {

      test('size 1', () => {
        expect(buildTrail(157, 0, 1, CELL_INACTIVE_DARK_MODE)).toEqual({
          colors: [{h:157,s:100,l:50}],
          size: 1
        });
      });

      test('size 2', () => {
        expect(buildTrail(157, 0, 2, CELL_INACTIVE_DARK_MODE)).toEqual({
          colors: [{h:157,s:100,l:50}, {h:0,s:52,l:17}],
          size: 2
        });
      });

      test('size 3', () => {
        expect(buildTrail(157, 0, 3, CELL_INACTIVE_DARK_MODE)).toEqual({
          colors: [{h:157,s:100,l:50}, {h:78,s:55,l:20}, {h:0,s:50,l:15}],
          size: 3
        });
      });
    });

    describe('background light', () => {

      test('size 1', () => {
        expect(buildTrail(157, 0, 1, CELL_INACTIVE_LIGHT_MODE)).toEqual({
          colors: [{h:157,s:100,l:30}],
          size: 1
        });
      });

      test('size 2', () => {
        expect(buildTrail(157, 0, 2, CELL_INACTIVE_LIGHT_MODE)).toEqual({
          colors: [{h:157,s:100,l:30}, {h:0,s:72,l:82}],
          size: 2
        });
      });

      test('size 3', () => {
        expect(buildTrail(157, 0, 3, CELL_INACTIVE_LIGHT_MODE)).toEqual({
          colors: [{h:157,s:100,l:30}, {h:78,s:75,l:80}, {h:0,s:70,l:85}],
          size: 3
        });
      });
    });
  });
});
