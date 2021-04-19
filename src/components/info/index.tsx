import {h} from 'preact';
import style from './style.css';
import {getPatternDisplayName, Pattern} from "../../utils/simulator";

type InfoProps = {
  pattern: Pattern;
  generationNum: number;
};

function Info({pattern, generationNum}: InfoProps): JSX.Element {
  return (
    <div class={style['info']}>
      <div class={style['pattern']}>{getPatternDisplayName(pattern)}</div>
      <div class={style['generationNum']}>generation #<span>{generationNum}</span></div>
    </div>
  );
}

export default Info;
