import {Component, h} from 'preact';
import style from './style.css';
import classNames from "classnames";

export type ThemeToggleProps = {
  isDark: boolean;
  onThemeChanged: (isDark: boolean) => void;
};

type ThemeToggleState = {
};

export class ThemeToggle extends Component<ThemeToggleProps, ThemeToggleState> {

  constructor(props: ThemeToggleProps) {
    super(props);
    this.state = {
    }
  }

  buttonClicked = (): void => {
    this.props.onThemeChanged(!this.props.isDark);
  };

  render(): JSX.Element {
    return (
      <button class={classNames(style['button'], {[style['is-dark']]: this.props.isDark})}
              onClick={this.buttonClicked}>
        <div className={style['switch-container']}>
          <div className={style['switch']} />
        </div>
      </button>
    );
  }
}
