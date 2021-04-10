import {Component, h} from 'preact';
import style from './style.css';

export type Settings = {
  speed: number;
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
    this.props.onSettingsChanged({ speed })
  };

  render() {
    return (
      <div class={style['modal-container']}>
        <div class={style['modal']}>
          <div class={style['heading']}>Settings</div>
          <div class={style['body']}>
            <div className={style['field']}>
              <div className={style['field-label']}>Speed: <span
                className={style['field-value']}>{this.props.settings.speed}</span></div>
              <div className={style['field-value']}>
                <input type="range" id="volume" name="volume" min="0" max="10" value={this.props.settings.speed}
                       onInput={this.onSpeedChanged} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsModal;
