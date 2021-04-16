import { FunctionalComponent, h, JSX } from 'preact';
import style from './style.css';
import Cell from "../cell";

const Board: FunctionalComponent<{ cellData: number[]; maxActive: number; cellSize: number }>
  = ({ cellData, maxActive, cellSize=30 }) => {

  const cells = (): JSX.Element[] => {
    return cellData.map(n => <Cell active={n} maxActive={maxActive} size={cellSize} />);
  };

  return (
    <div class={style['board-container']}>
      <div className={style['board']}>
        { cells() }
      </div>
    </div>
  );
};

export default Board;
