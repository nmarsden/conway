import {Component, h} from 'preact';
import style from './style.css';
import {Pattern} from "../../utils/simulator";
import classNames from "classnames";
import PatternSelector from "../patternSelector";
import {AppMode, Settings} from "../../utils/settings";

type SettingsModalProps = {
  isOpen: boolean;
  settings: Settings;
  onSettingsChanged: (settings: Settings) => void;
  onClosed: () => void;
};

type SettingsModalState = {
  isDemoMode: boolean;
};

class SettingsModal extends Component<SettingsModalProps, SettingsModalState> {

  constructor(props: SettingsModalProps) {
    super(props);
    this.state = {
      isDemoMode: props.settings.mode === AppMode.Demo
    }
  }

  onModeChanged = (mode: AppMode): (event: Event) => void => {
    return (_: Event): void => {
      this.setState({ isDemoMode: mode === AppMode.Demo })
      this.props.onSettingsChanged({...this.props.settings, mode})
    };
  }

  onSpeedChanged = (event: Event): void => {
    const speed: number = parseInt((event.target as HTMLInputElement).value, 10);
    this.props.onSettingsChanged({...this.props.settings, speed})
  };

  onCellSizeChanged = (event: Event): void => {
    const cellSize: number = parseInt((event.target as HTMLInputElement).value, 10);
    this.props.onSettingsChanged({...this.props.settings, cellSize})
  };

  onTrailSizeChanged = (event: Event): void => {
    const trailSize: number = parseInt((event.target as HTMLInputElement).value, 10);
    this.props.onSettingsChanged({...this.props.settings, trailSize})
  };

  onPatternChanged = (pattern: Pattern): void => {
    this.props.onSettingsChanged({...this.props.settings, pattern})
  };

  preventModalContainerClick = (event: Event): void => {
    event.stopPropagation();
  };

  render(): JSX.Element {
    return (
      <div className={classNames(style['modal-container'], { [style['is-open']]: this.props.isOpen })} onClick={this.props.onClosed}>
        <div class={style['modal']} onClick={this.preventModalContainerClick}>
          <button class={style['close-button']} onClick={this.props.onClosed} />
          <div class={style['heading']}>Settings</div>
          <div class={style['body']}>
            {/*<div class={style['field']}>*/}
            {/*  <div class={style['field-label']}>Mode:</div>*/}
            {/*  <div class={style['field-value']}>*/}
            {/*    <div class={style['radio-input-container']}>*/}
            {/*      <input*/}
            {/*        id={AppMode[AppMode.Demo]}*/}
            {/*        class={style['radio-input']}*/}
            {/*        name="mode"*/}
            {/*        type="radio"*/}
            {/*        checked={this.props.settings.mode === AppMode.Demo} />*/}
            {/*      <label*/}
            {/*        id={AppMode[AppMode.Demo]}*/}
            {/*        onClick={this.onModeChanged(AppMode.Demo)}>{AppMode[AppMode.Demo]}</label>*/}
            {/*      <input*/}
            {/*        id={AppMode[AppMode.Custom]}*/}
            {/*        class={style['radio-input']}*/}
            {/*        name="mode"*/}
            {/*        type="radio"*/}
            {/*        checked={this.props.settings.mode === AppMode.Custom} />*/}
            {/*      <label*/}
            {/*        id={AppMode[AppMode.Custom]}*/}
            {/*        onClick={this.onModeChanged(AppMode.Custom)}>{AppMode[AppMode.Custom]}</label>*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*</div>*/}
            <div class={classNames(style['field'], style['field-large'], { [style['field-disabled']]: this.state.isDemoMode })} key="patternField">
              <div class={style['field-label']}>Pattern:</div>
              <div class={style['field-value']}>
                <PatternSelector
                  disabled={this.state.isDemoMode}
                  value={this.props.settings.pattern}
                  onChanged={this.onPatternChanged} />
              </div>
            </div>
            <div class={classNames(style['field'], { [style['field-disabled']]: this.state.isDemoMode })}>
              <div class={style['field-label']}>Speed: <span
                class={style['field-value']}>{this.props.settings.speed}</span></div>
              <div class={style['field-value']}>
                <input type="range"
                       min="0"
                       max="10"
                       disabled={this.state.isDemoMode}
                       value={this.props.settings.speed}
                       onInput={this.onSpeedChanged} />
              </div>
            </div>
            {/*<div className={style['field']}>*/}
            {/*  <div className={style['field-label']}>Cell Size: <span*/}
            {/*    className={style['field-value']}>{this.props.settings.cellSize}</span></div>*/}
            {/*  <div className={style['field-value']}>*/}
            {/*    <input type="range" min="10" max="100" step="5" value={this.props.settings.cellSize}*/}
            {/*           onInput={this.onCellSizeChanged} />*/}
            {/*  </div>*/}
            {/*</div>*/}
            <div className={classNames(style['field'], { [style['field-disabled']]: this.state.isDemoMode })}>
              <div className={style['field-label']}>Trail: <span
                className={style['field-value']}>{this.props.settings.trailSize}</span></div>
              <div className={style['field-value']}>
                <input type="range"
                       min="0"
                       max="40"
                       disabled={this.state.isDemoMode}
                       value={this.props.settings.trailSize}
                       onInput={this.onTrailSizeChanged} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsModal;
