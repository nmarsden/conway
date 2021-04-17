import {FunctionalComponent, h} from 'preact';
import style from './style.css';

export type HSLColor = {h: number; s: number; l: number };

export const DEFAULT_CELL_COLOR: HSLColor = { h:157, s:71, l:60 }; // green

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const backgroundColorRGBA = (active: number, maxActive: number): string => {
    const alpha = active === 1 ? 1 : (0.1 + (0.5 * (1 - (active / maxActive))));
    return active === 0 ? 'transparent' : `rgba(17, 101, 222, ${alpha.toFixed(3)})`;
}

const backgroundColorHSL = (active: number, maxActive: number, activeColor: HSLColor): string => {
    const hue = active === 1 ? activeColor.h : ((activeColor.h - 200) + (200 * ( 1 - (active / maxActive))));
    const saturation = active === 1 ? activeColor.s : ((activeColor.s) + (10 * (active / maxActive)));
    const lightness = active === 1 ? activeColor.l : ((activeColor.l - 50) + (30 * (1 - (active / maxActive))));
    return active === 0 ? 'transparent' : `hsl(${hue.toFixed(2)}, ${saturation.toFixed(2)}%, ${lightness.toFixed(2)}%)`;
}

const Cell: FunctionalComponent<{ size: number; active: number; maxActive: number; color?: HSLColor }>
  = ({ size=30, active, maxActive, color = DEFAULT_CELL_COLOR}) => {
    const styles = `width:${size}px; height:${size}px; background-color:${backgroundColorHSL(active, maxActive, color)};`;
    return (
      <div style={styles} className={style['cell']} />
    );
};

export default Cell;
