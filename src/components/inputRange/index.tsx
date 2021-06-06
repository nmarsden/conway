import {Component, h} from 'preact';
import style from './style.css';

export type InputRangeProps = {
  value: number;
  min: number;
  max: number;
  onChanged: (value: number) => void;
};

type InputRangeState = {
};

export class InputRange extends Component<InputRangeProps, InputRangeState> {

  constructor(props: InputRangeProps) {
    super(props);
    this.state = {};
  }

  onValuedChanged = (event: Event): void => {
    const value: number = parseInt((event.target as HTMLInputElement).value, 10);
    this.props.onChanged(value);
  };

  render(): JSX.Element {
    return (
      <div class={style['input-range-container']}>
        <div class={style['value']}>{this.props.value}</div>
        <input class={style['input']}
               type="range"
               min={this.props.min}
               max={this.props.max}
               value={this.props.value}
               onInput={this.onValuedChanged} />
      </div>
    );
  }
}
