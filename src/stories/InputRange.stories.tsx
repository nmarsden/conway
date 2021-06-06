import '../style/index.css';
import {h} from 'preact';
import {InputRange} from '../components/inputRange';

export default {
  title: 'Example/InputRange',
  component: InputRange
};

export const Example = () => <InputRange min={1}
                                         max={10}
                                         value={5}
                                         onChanged={(): void => { /* do nothing */ }} />;
