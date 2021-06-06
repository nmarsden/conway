import { h } from 'preact';
// See: https://github.com/preactjs/enzyme-adapter-preact-pure
import {shallow, ShallowWrapper} from 'enzyme';
import {InputRange} from "../../src/components/inputRange";

describe('InputRange', () => {
    let context: ShallowWrapper;
    const onChangedHandler = (value: number): void => { };

    beforeEach( () => {
        context = shallow(<InputRange
          value={5}
            min={0}
            max={10}
            onChanged={onChangedHandler} />);
    });

    test('should show value', () => {
        expect(context.find('.value').text()).toEqual('5');
    });
});
