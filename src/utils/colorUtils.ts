import * as PIXI from "pixi.js";
import {Trail} from "./settings";

export type HSLColor = {h: number; s: number; l: number };

export function hslToHexString({h,s,l}: HSLColor): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number): string => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  const hexString = `#${f(0)}${f(8)}${f(4)}`
  return hexString;
}

export function hslToHexNum(color: HSLColor): number {
  return PIXI.utils.string2hex(hslToHexString(color));
}

export function hexStringToHsl(H: string): HSLColor {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = parseInt(H[1] + H[1], 16);
    g = parseInt(H[2] + H[2], 16);
    b = parseInt(H[3] + H[3], 16);
  } else if (H.length == 7) {
    r = parseInt(H[1] + H[2], 16);
    g = parseInt(H[3] + H[4], 16);
    b = parseInt(H[5] + H[6], 16);
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r,g,b),
    cmax = Math.max(r,g,b),
    delta = cmax - cmin
  let h = 0,
    s = 0,
    l = 0;

  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

export function hexNumToHsl(hexNum: number): HSLColor {
  return hexStringToHsl(PIXI.utils.hex2string(hexNum));
}

export function lerpColor(ah: number, bh: number, amount: number): number {

  if (ah === bh || amount === 1) {
    return bh;
  }
  const ar = ah >> 16;
  const ag = ah >> 8 & 0xff;
  const ab = ah & 0xff;

  const br = bh >> 16;
  const bg = bh >> 8 & 0xff;
  const bb = bh & 0xff;

  const rr = ar + amount * (br - ar);
  const rg = ag + amount * (bg - ag);
  const rb = ab + amount * (bb - ab);

  return (rr << 16) + (rg << 8) + (rb | 0);
}

export function buildTrail(startHue: number, endHue: number, size: number, background: HSLColor): Trail {
  const colors: HSLColor[] = [];
  let h, s, l;
  const hueShift = size === 1 ? 0 : (endHue - startHue) / (size - 1);
  const isDarkTheme = background.l < 50;
  if (isDarkTheme) {
    for (let i = 0; i < size; i++) {
      h = (i === 0) ? startHue : Math.floor(startHue + (hueShift * i));
      s = (i === 0) ? 100 : Math.floor(45 + (15 * (1 - (i / size))));
      l = (i === 0) ? 50 : Math.floor(10 + (15 * (1 - (i / size))));

      colors.push({h, s, l})
    }
  } else {
    for (let i = 0; i < size; i++) {
      h = (i === 0) ? startHue : Math.floor(startHue + (hueShift * i));
      s = (i === 0) ? 100 : Math.floor(65 + (15 * (1 - (i / size))));
      l = (i === 0) ? 30 : Math.floor(75 + (15 * (i / size)));

      colors.push({h, s, l})
    }
  }
  return {
    colors,
    size
  }
}

export function rebuildTrail(trail: Trail, background: HSLColor): Trail {
  const startHue = trail.colors[0].h;
  const endHue = trail.colors[trail.colors.length-1].h;
  return buildTrail(startHue, endHue, trail.colors.length, background);
}
