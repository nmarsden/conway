import { h } from 'preact';
// See: https://github.com/preactjs/enzyme-adapter-preact-pure
import {shallow, ShallowWrapper} from 'enzyme';
import SettingsButton from "../../src/components/settingsButton";

describe('SettingsButton', () => {
    let context: ShallowWrapper;
    let isClickHandlerCalled = false;
    const clickHandler = (): void => {
        isClickHandlerCalled = true;
    };

    beforeEach( () => {
        context = shallow(<SettingsButton onClicked={clickHandler} />);
    });

    test('should have class button', () => {
        expect(context.find('button').hasClass('button')).toBeTruthy();
    });

    test('should call clickHandler when clicked', () => {
        context.find('button').simulate('click');
        expect(isClickHandlerCalled).toBeTruthy();
    });
});
