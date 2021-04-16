import {FunctionalComponent, h} from 'preact';
import style from './style.css';

const backgroundColor = (active: number, maxActive: number): string => {
    const alpha = active === 1 ? 1 : (0.1 + (0.5 * (1 - (active / maxActive))));
    return active === 0 ? 'transparent' : `rgba(17, 101, 222, ${alpha.toFixed(3)})`;
}

const Cell: FunctionalComponent<{ size: number; active: number; maxActive: number }>
  = ({ size=30, active, maxActive}) => {
    const styles = `width:${size}px; height:${size}px; background-color:${backgroundColor(active, maxActive)};`;
    return (
      <div style={styles} className={style['cell']} />
    );
};

export default Cell;
