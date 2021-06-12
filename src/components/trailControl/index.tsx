import {Component, h} from 'preact';
import style from './style.css';
import {HSLColor, hslToHexString} from "../../utils/colorUtils";
import {ColorPicker} from "../colorPicker";
import {Trail} from "../../utils/settings";

export function buildTrail(startHue: number, endHue: number, size: number): Trail {
  const colors: HSLColor[] = [];
  let h, s, l;
  const hueShift = (endHue - startHue) / size;
  for (let i=0; i<size; i++) {
    h = (i === 0) ? startHue : Math.floor(startHue + (hueShift * i));
    s = 100;
    l = (i === 0) ? 50 : Math.floor(10 + (15 * (1 - (i / size))));
    colors.push({ h, s, l })
  }
  // console.log('------------------');
  // console.log('startHue', startHue);
  // console.log('endHue', endHue);
  // console.table(colors);
  return {
    colors,
    size
  }
}

export type TrailControlProps = {
  trail: Trail;
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
      trail: this.props.trail,
      startHue: this.props.trail.colors[0].h,
      endHue: this.props.trail.colors[this.props.trail.size - 1].h
    };
  }

  onTrailStartHueChanged = (hue: number): void => {
    const trail = buildTrail(hue, this.state.endHue, this.state.trail.size);

    this.props.onChanged(trail);

    this.setState({trail, startHue: hue});
  };

  onTrailEndHueChanged = (hue: number): void => {
    const trail = buildTrail(this.state.startHue, hue, this.state.trail.size);

    this.props.onChanged(trail);

    this.setState({trail, endHue: hue});
  };

  onTrailSizeChanged = (event: Event): void => {
    const trailSize: number = parseInt((event.target as HTMLInputElement).value, 10);
    const trail = buildTrail(this.state.startHue, this.state.endHue, trailSize);

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
