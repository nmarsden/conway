import {FunctionalComponent, h} from 'preact';
import style from './style.css';

const backgroundColorRGBA = (active: number, maxActive: number): string => {
    const alpha = active === 1 ? 1 : (0.1 + (0.5 * (1 - (active / maxActive))));
    return active === 0 ? 'transparent' : `rgba(17, 101, 222, ${alpha.toFixed(3)})`;
}

const backgroundColorHSL = (active: number, maxActive: number): string => {
    // const activeColor: {h: number; s: number; l: number } = { h:200, s:71, l:60 }; // blue
    // const activeColor: {h: number; s: number; l: number } = { h:1, s:71, l:60 }; // red
    const activeColor: {h: number; s: number; l: number } = { h:157, s:71, l:60 }; // green

    const hue = active === 1 ? activeColor.h : ((activeColor.h - 200) + (200 * ( 1 - (active / maxActive))));
    const saturation = active === 1 ? activeColor.s : ((activeColor.s) + (10 * (active / maxActive)));
    const lightness = active === 1 ? activeColor.l : ((activeColor.l - 50) + (30 * (1 - (active / maxActive))));
    return active === 0 ? 'transparent' : `hsl(${hue.toFixed(2)}, ${saturation.toFixed(2)}%, ${lightness.toFixed(2)}%)`;
}

const Cell: FunctionalComponent<{ size: number; active: number; maxActive: number }>
  = ({ size=30, active, maxActive}) => {
    const styles = `width:${size}px; height:${size}px; background-color:${backgroundColorHSL(active, maxActive)};`;
    return (
      <div style={styles} className={style['cell']} />
    );
};

export default Cell;
