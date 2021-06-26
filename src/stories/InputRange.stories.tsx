import {h} from 'preact';
import {InputRange} from '../components/inputRange';

export default {
  title: 'InputRange',
  component: InputRange,
  parameters: {
    layout: 'fullscreen'
  }
};

export const Example = (): JSX.Element => <InputRange min={1}
                                                      max={10}
                                                      value={5}
                                                      onChanged={(): void => { /* do nothing */ }} />;
