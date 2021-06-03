import {Component, h, Fragment} from 'preact';
import style from './style.css';
import {Pattern} from "../../utils/simulator";
import classNames from "classnames";
import PatternSelector from "../patternSelector";
import {AppMode, Settings} from "../../utils/settings";
import InputRange from "../inputRange";

type ControlBarProps = {
  settings: Settings;
  onSettingsChanged: (settings: Settings) => void;
  onClosed: () => void;
};

enum Control { None, Pattern, Speed, Trail}

const CONTROL_NAMES = (Object.keys(Control).map(key => (Control as any)[key]).filter(value => typeof value === 'string') as string[]);

const getControlName = (control: Control): string => {
  return CONTROL_NAMES[control].replace(/_/g, ' ');
}

type ControlBarState = {
  isOpen: boolean;
  isDemoMode: boolean;
  modalContent: Control;
  activeButton: Control;
};


class ControlBar extends Component<ControlBarProps, ControlBarState> {

  constructor(props: ControlBarProps) {
    super(props);
    this.state = {
      isOpen: false,
      isDemoMode: props.settings.mode === AppMode.Demo,
      modalContent: Control.Pattern,
      activeButton: Control.None
    }
  }

  toggleControlBarButtonClicked = (): void => {
    const isOpen = !this.state.isOpen;
    const activeButton = Control.None;

    this.setState({isOpen, activeButton});
  };

  controlButtonClickedHandler = (control: Control): () => void => {
    return (): void => {
      const modalContent = control;
      const activeButton = (this.state.activeButton === control) ? Control.None : control;

      this.setState({activeButton, modalContent});
    };
  };

  modalCloseButtonClicked = (): void => {
    const activeButton = Control.None;

    this.setState({activeButton});
  };

  onModeChanged = (mode: AppMode): (event: Event) => void => {
    return (_: Event): void => {
      this.setState({isDemoMode: mode === AppMode.Demo})
      this.props.onSettingsChanged({...this.props.settings, mode})
    };
  }

  onSpeedChanged = (speed: number): void => {
    this.props.onSettingsChanged({...this.props.settings, speed})
  };

  onCellSizeChanged = (event: Event): void => {
    const cellSize: number = parseInt((event.target as HTMLInputElement).value, 10);
    this.props.onSettingsChanged({...this.props.settings, cellSize})
  };

  onTrailSizeChanged = (trailSize: number): void => {
    this.props.onSettingsChanged({...this.props.settings, trailSize})
  };

  onPatternChanged = (pattern: Pattern): void => {
    this.props.onSettingsChanged({...this.props.settings, pattern})
  };

  preventModalContainerClick = (event: Event): void => {
    event.stopPropagation();
  };

  controlHeadingClassNames = (renderedControl: Control, modalContent: Control): string => {
    return classNames(style['heading'], {
      [style['is-shown']]: renderedControl === modalContent,
      [style['is-hidden']]: renderedControl !== modalContent,
    });
  }

  renderControlHeading(modalContent: Control): JSX.Element {
    return (<div class={style['heading-wrapper']}>
              <div className={this.controlHeadingClassNames(Control.Pattern, modalContent)}>{getControlName(modalContent)}</div>
              <div className={this.controlHeadingClassNames(Control.Speed, modalContent)}>{getControlName(modalContent)}</div>
              <div className={this.controlHeadingClassNames(Control.Trail, modalContent)}>{getControlName(modalContent)}</div>
            </div>);
  }

  controlClassNames = (renderedControl: Control, activeControl: Control): string => {
    return classNames(style['control'],
      {
        [style['is-shown']]: activeControl !== Control.None && renderedControl === activeControl,
        [style['left']]: activeControl !== Control.None && renderedControl.valueOf() < activeControl.valueOf(),
        [style['right']]: activeControl !== Control.None && renderedControl.valueOf() > activeControl.valueOf(),
      });
  }

  renderControl(activeControl: Control): JSX.Element {
    return (<Fragment>
      <div class={this.controlClassNames(Control.Pattern, activeControl)}>
        <PatternSelector
          disabled={false}
          value={this.props.settings.pattern}
          onChanged={this.onPatternChanged} />
      </div>
      <div className={this.controlClassNames(Control.Speed, activeControl)}>
        <InputRange
          value={this.props.settings.speed}
          min={0}
          max={10}
          onChanged={this.onSpeedChanged} />
      </div>
      <div className={this.controlClassNames(Control.Trail, activeControl)}>
        <InputRange
          value={this.props.settings.trailSize}
          min={0}
          max={40}
          onChanged={this.onTrailSizeChanged} />
      </div>
      </Fragment>);
  }

  render(): JSX.Element {
    return (
      <Fragment>
        <div class={classNames(style['modal'], {[style['is-open']]: this.state.activeButton !== Control.None})}>
          {this.renderControlHeading(this.state.modalContent)}
          <div class={style['body']}>
            <div class={classNames(style['field'], style['field-large'])} key="patternField">
              <div class={style['field-value']}>{this.renderControl(this.state.activeButton)}</div>
            </div>
          </div>
          <button className={style['close-button']} onClick={this.modalCloseButtonClicked} />
        </div>
        <div class={classNames(style['control-bar'], {[style['is-open']]: this.state.isOpen})}
             onClick={this.props.onClosed}>
          <button class={classNames(style['button'], style['pattern'], {[style['active']]: this.state.activeButton === Control.Pattern})}
                  onClick={this.controlButtonClickedHandler(Control.Pattern)}> </button>
          <button class={classNames(style['button'], style['speed'], {[style['active']]: this.state.activeButton === Control.Speed})}
                  onClick={this.controlButtonClickedHandler(Control.Speed)}> </button>
          <button class={classNames(style['button'], style['trail'], {[style['active']]: this.state.activeButton === Control.Trail})}
                  onClick={this.controlButtonClickedHandler(Control.Trail)}> </button>
        </div>
        <button class={classNames(style['button'], style['toggleControlsButton'])}
                onClick={this.toggleControlBarButtonClicked}>
          <span class={classNames(style['gear'], {[style['is-open']]: this.state.isOpen})}> </span>
        </button>
      </Fragment>
    );
  }
}

export default ControlBar;
