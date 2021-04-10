import {Component, h} from 'preact';
import style from './style.css';

type SettingsButtonProps = {
    onClicked: () => void;
};

type SettingsButtonState = {
};

class SettingsButton extends Component<SettingsButtonProps, SettingsButtonState> {

    constructor(props: SettingsButtonProps) {
        super(props);
    }

    onButtonClicked = (): void => {
        this.props.onClicked();
    };

    render() {
        return (
          <button class={style['button']} onClick={this.onButtonClicked} />
        );
    }
}

export default SettingsButton;
