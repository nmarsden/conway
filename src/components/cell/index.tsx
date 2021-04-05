import {FunctionalComponent, h, RenderableProps} from 'preact';
import style from './style.css';

const Cell: FunctionalComponent = (props:RenderableProps<any>) => {
    return (
      <div class={style['cell']}></div>
    );
};

export default Cell;
