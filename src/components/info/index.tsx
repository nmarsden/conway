import {FunctionComponent, h} from 'preact';
import style from './style.css';
import {getPatternDisplayName, Pattern} from "../../utils/simulator";

export type InfoProps = {
  pattern: Pattern;
  generationNum: number;
};

export const Info: FunctionComponent<InfoProps> = ({ pattern, generationNum }) => {
  return (
    <div className={style['info']}>
      <div className={style['pattern']}>{getPatternDisplayName(pattern)}</div>
      <div className={style['generationNum']}>generation #<span>{generationNum}</span></div>
    </div>
  );
};
