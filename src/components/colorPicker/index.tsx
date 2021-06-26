import {h, Fragment, Component} from "preact";
import style from './style.css';
import {HexColorPicker} from "react-colorful";
import {hexStringToHsl, hslToHexString} from "../../utils/colorUtils";
import classNames from "classnames";

export type ColorPickerProps = {
  hue: number;
  onChanged: (hue: number) => void;
};

type ColorPickerState = {
  selectedColor: string;
  isOpen: boolean;
  popupPosition: { top: number; left: number };
};
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function throttle(fn: (...args: any) => void, wait: number): (...args: any) => void {
  let isCalled = false;

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  return (...args: any): void => {
    if (!isCalled){
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      fn.apply(this, args);
      isCalled = true;
      setTimeout(() => {
        isCalled = false;
      }, wait)
    }
  };
}

export class ColorPicker extends Component<ColorPickerProps, ColorPickerState> {

  constructor(props: ColorPickerProps) {
    super(props);
    this.state = {
      selectedColor: hslToHexString({ h: this.props.hue, s: 100, l: 50 }),
      isOpen: false,
      popupPosition: { top: 0, left: 0 }
    };
  }

  onButtonClicked = (): void => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  onOverlayClicked = (): void => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  onColorChanged = (newColor: string): void => {
    this.setState({ selectedColor: newColor })
    this.props.onChanged(hexStringToHsl(newColor).h);
  };

  onColorChangedThrottle = throttle(this.onColorChanged, 100);

  render(): JSX.Element {
    return (<Fragment>
            <div class={classNames(style['overlay'], { [style['is-open']]: this.state.isOpen })}
                 onClick={this.onOverlayClicked} />
            <div class={style['color-picker-container']}>
              <button class={style['button']}
                      style={{ backgroundColor: this.state.selectedColor }}
                      onClick={this.onButtonClicked} />
              <div class={classNames(style['color-picker'], { [style['is-open']]: this.state.isOpen })}>
                <div class={style['pointer']} />
                <div class={style['body']}>
                  <HexColorPicker color={this.state.selectedColor} onChange={this.onColorChangedThrottle} />
                </div>
              </div>
            </div>
          </Fragment>);
  }
}
