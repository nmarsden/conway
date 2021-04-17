import { h } from 'preact';
import Cell from '../../src/components/cell';
// See: https://github.com/preactjs/enzyme-adapter-preact-pure
import {shallow, ShallowWrapper} from 'enzyme';

describe('Cell', () => {
    const EXPECTED_YOUNGEST_COLOR = 'hsl(157.00, 71.00%, 60.00%);';
    const EXPECTED_OLDEST_COLOR = 'hsl(-43.00, 81.00%, 10.00%);';

    describe('when size 20', () => {
        let context: ShallowWrapper;

        beforeEach( () => {
            context = shallow(<Cell size={20} active={1} maxActive={10} />);
        });

        test('should have width and height of 20px', () => {
            expect(context.find('div').prop('style')).toContain(`width:20px; height:20px;`);
        });
    });

    describe('when active is 1', () => {
        let context: ShallowWrapper;

        beforeEach( () => {
            context = shallow(<Cell size={10} active={1} maxActive={10} />);
        });

        test('should have youngest background color', () => {
            expect(context.find('div').prop('style')).toContain(`background-color:${EXPECTED_YOUNGEST_COLOR}`);
        });
    });

    describe('when active is maxActive', () => {
        let context: ShallowWrapper;

        beforeEach( () => {
            context = shallow(<Cell size={10} active={10} maxActive={10} />);
        });

        test('should have oldest background color', () => {
            expect(context.find('div').prop('style')).toContain(`background-color:${EXPECTED_OLDEST_COLOR}`);
        });
    });

    describe('when not active', () => {
        let context: ShallowWrapper;

        beforeEach( () => {
            context = shallow(<Cell size={10} active={0} maxActive={10} />);
        });

        test('should have transparent background-color', () => {
            expect(context.find('div').prop('style')).toContain('background-color:transparent');
        });
    });
});
