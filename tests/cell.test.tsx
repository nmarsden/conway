import { h } from 'preact';
import Cell from '../src/components/cell';
// See: https://github.com/preactjs/enzyme-adapter-preact-pure
import { shallow } from 'enzyme';

describe('Cell', () => {
    test('renders a cell', () => {
        const context = shallow(<Cell />);
        expect(context.find('div').prop('className')).toBe('cell');
    });
});
