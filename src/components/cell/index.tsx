import {FunctionalComponent, h} from 'preact';
import style from './style.css';
import classNames from "classnames";

const Cell: FunctionalComponent<{ isActive: boolean }> = ({ isActive}) => {
    return (
      <div class={classNames(style.cell, {[style.active]: isActive})} />
    );
};

export default Cell;
