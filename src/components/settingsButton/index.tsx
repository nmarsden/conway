import {Component, h} from 'preact';
import style from './style.css';

type SettingsButtonProps = {
    onClicked: () => void;
};

type SettingsButtonState = {
};

class SettingsButton extends Component<SettingsButtonProps, SettingsButtonState> {

    onButtonClicked = (): void => {
        this.props.onClicked();
    };

    render(): JSX.Element {
        return (
          <button class={style['button']} onClick={this.onButtonClicked} />
        );
    }
}

export default SettingsButton;
