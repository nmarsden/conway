import { FunctionalComponent, h, JSX } from 'preact';
import style from './style.css';
import Cell from "../cell";

const Board: FunctionalComponent<{ cellData: number[] }> = ({ cellData }) => {

  const cells = (): JSX.Element[] => {
    return cellData.map(d => <Cell isActive={d === 1} />);
  };

  return (
    <div class={style['board-container']}>
      { cells() }
    </div>
  );
};

export default Board;
