import {FunctionalComponent, h} from 'preact';
import style from './style.css';
import classNames from "classnames";

const Cell: FunctionalComponent<{ size: number; isActive: boolean }> = ({ size=30, isActive}) => {
    const sizeStyles = `width:${size}px; height:${size}px;`;
    return (
      <div style={sizeStyles} class={classNames(style.cell, {[style.active]: isActive})} />
    );
};

export default Cell;
