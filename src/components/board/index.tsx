import { FunctionalComponent, h, JSX } from 'preact';
import style from './style.css';
import Cell from "../cell";

const Board: FunctionalComponent<{ cellData: number[]; cellSize: number }> = ({ cellData, cellSize=30 }) => {

  const cells = (): JSX.Element[] => {
    return cellData.map(d => <Cell isActive={d === 1} size={cellSize} />);
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
