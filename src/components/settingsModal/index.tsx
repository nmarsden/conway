import {Component, h} from 'preact';
import style from './style.css';
import {Pattern} from "../../utils/simulator";
import PatternDropdown from "../patternDropdown";

export type Settings = {
  speed: number;
  cellSize: number;
  pattern: Pattern;
  trailSize: number;
}

type SettingsModalProps = {
  settings: Settings;
  onSettingsChanged: (settings: Settings) => void;
};

type SettingsModalState = {
};

class SettingsModal extends Component<SettingsModalProps, SettingsModalState> {

  constructor(props: SettingsModalProps) {
    super(props);
  }

  onSpeedChanged = (event: Event): void => {
    const speed: number = parseInt((event.target as HTMLInputElement).value, 10);
    this.props.onSettingsChanged({ ...this.props.settings, speed })
  };

  onCellSizeChanged = (event: Event): void => {
    const cellSize: number = parseInt((event.target as HTMLInputElement).value, 10);
    this.props.onSettingsChanged({ ...this.props.settings, cellSize })
  };

  onTrailSizeChanged = (event: Event): void => {
    const trailSize: number = parseInt((event.target as HTMLInputElement).value, 10);
    this.props.onSettingsChanged({ ...this.props.settings, trailSize })
  };

  onPatternChanged = (pattern: Pattern): void => {
    this.props.onSettingsChanged({ ...this.props.settings, pattern })
  };

  render() {
    return (
      <div class={style['modal-container']}>
        <div class={style['modal']}>
          <div class={style['heading']}>Settings</div>
          <div class={style['body']}>
            <div className={style['field']} key="patternField">
              <div className={style['field-label']}>Pattern:</div>
              <div className={style['field-value']}>
                <PatternDropdown value={this.props.settings.pattern} onChanged={this.onPatternChanged} />
              </div>
            </div>
            <div className={style['field']}>
              <div className={style['field-label']}>Speed: <span
                className={style['field-value']}>{this.props.settings.speed}</span></div>
              <div className={style['field-value']}>
                <input type="range" min="0" max="10" value={this.props.settings.speed}
                       onInput={this.onSpeedChanged} />
              </div>
            </div>
            <div className={style['field']}>
              <div className={style['field-label']}>Cell Size: <span
                className={style['field-value']}>{this.props.settings.cellSize}</span></div>
              <div className={style['field-value']}>
                <input type="range" min="10" max="100" step="5" value={this.props.settings.cellSize}
                       onInput={this.onCellSizeChanged} />
              </div>
            </div>
            <div className={style['field']}>
              <div className={style['field-label']}>Trail: <span
                className={style['field-value']}>{this.props.settings.trailSize}</span></div>
              <div className={style['field-value']}>
                <input type="range" min="0" max="20" value={this.props.settings.trailSize}
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
