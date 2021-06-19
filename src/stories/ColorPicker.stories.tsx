import {h} from 'preact';
import {ColorPicker} from '../components/colorPicker';

export default {
  title: 'ColorPicker',
  component: ColorPicker
};

export const Example = () => <ColorPicker hue={10}
                                          onChanged={(): void => { /* do nothing */ } } />

