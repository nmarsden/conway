import {Component, h} from 'preact';
import style from './style.css';
import {buildTrail, hslToHexString} from "../../utils/colorUtils";
import {ColorPicker} from "../colorPicker";
import {Trail} from "../../utils/settings";
import {BoardColors} from "../board";

export type TrailControlProps = {
  colors: BoardColors;
  onChanged: (trail: Trail) => void;
};

type TrailControlState = {
  trail: Trail;
  startHue: number;
  endHue: number;
};

export class TrailControl extends Component<TrailControlProps, TrailControlState> {

  constructor(props: TrailControlProps) {
    super(props);
    this.state = {
      trail: this.props.colors.activeCellTrail,
      startHue: this.props.colors.activeCellTrail.colors[0].h,
      endHue: this.props.colors.activeCellTrail.colors[this.props.colors.activeCellTrail.size - 1].h
    };
  }

  componentDidUpdate(previousProps: Readonly<TrailControlProps>): void {
    if (this.props.colors !== previousProps.colors) {
      this.updateStateWithTrail(this.props.colors.activeCellTrail);
    }
  }

  updateStateWithTrail(trail: Trail): void {
    this.setState({trail});
  }

  onTrailStartHueChanged = (hue: number): void => {
    const trail = buildTrail(hue, this.state.endHue, this.state.trail.size, this.props.colors.inactiveCell);

    this.props.onChanged(trail);

    this.setState({trail, startHue: hue});
  };

  onTrailEndHueChanged = (hue: number): void => {
    const trail = buildTrail(this.state.startHue, hue, this.state.trail.size, this.props.colors.inactiveCell);

    this.props.onChanged(trail);

    this.setState({trail, endHue: hue});
  };

  onTrailSizeChanged = (event: Event): void => {
    const trailSize: number = parseInt((event.target as HTMLInputElement).value, 10);
    const trail = buildTrail(this.state.startHue, this.state.endHue, trailSize, this.props.colors.inactiveCell);

    this.props.onChanged(trail);

    this.setState({trail});
  }

  render(): JSX.Element {
    return (
      <div class={style['trail-control']}>
        <div class={style['color-pickers']}>
          <ColorPicker
            hue={this.state.startHue}
            onChanged={this.onTrailStartHueChanged} />
          <div className={style['trail-size']}>{this.state.trail.size}</div>
          <ColorPicker
            hue={this.state.endHue}
            onChanged={this.onTrailEndHueChanged} />
        </div>
        <div className={style['input-range']}>
          <input className={style['input']}
                 type="range"
                 min={1}
                 max={40}
                 value={this.state.trail.size}
                 onInput={this.onTrailSizeChanged} />
        </div>
        <div class={style['trail-preview']}>
          {Array.from(this.state.trail.colors, (hsl) => {
              return (<div class={style['trail-preview-cell']} style={{ background: hslToHexString(hsl) }} />);
          })}
        </div>
      </div>
    );
  }
}
