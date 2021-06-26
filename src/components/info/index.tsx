import {Component, h} from 'preact';
import style from './style.css';
import {getPatternDisplayName, Pattern} from "../../utils/simulator";
import {AnimateOnChange} from "../animateOnChange";

export type InfoProps = {
  pattern: Pattern;
  generationNum: number;
};

type InfoState = {
  animate: boolean;
};

export class Info extends Component<InfoProps, InfoState> {

  constructor(props: InfoProps) {
    super(props);
    this.state = {
      animate: false
    };
  }

  componentDidUpdate(prevProps: Readonly<InfoProps>): void {
    if (prevProps.pattern !== this.props.pattern) {
      this.updateAnimateState();
    }
  }

  updateAnimateState = (): void => {
    this.setState( { animate: true }, () => {
      window.setTimeout(() => this.setState({ animate: false }), 100);
    });
  }

  render(): JSX.Element {
    const { pattern, generationNum } = this.props;
    return (
      <AnimateOnChange
        baseClassName={style['info']}
        animationClassName={style['info--hide']}
        animate={this.state.animate}>
        <div className={style['pattern']}>{getPatternDisplayName(pattern)}</div>
        <div className={style['generationNum']}>generation #<span>{generationNum}</span></div>
      </AnimateOnChange>
    );
  }
}
