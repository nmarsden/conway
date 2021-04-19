import {Component, h} from 'preact';
import style from './style.css';
import {getPatternDisplayName, Pattern} from "../../utils/simulator";

type InfoProps = {
  pattern: Pattern;
  generationNum: number;
};

type InfoState = {};

class Info extends Component<InfoProps, InfoState> {

  render(): JSX.Element {
    return (
      <div class={style['info']}>
        <div class={style['pattern']}>{getPatternDisplayName(this.props.pattern)}</div>
        <div class={style['generationNum']}>generation #<span>{this.props.generationNum}</span></div>
      </div>
    );
  }
}

export default Info;
