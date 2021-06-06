import '../style/index.css';
import {h} from 'preact';
import {Info} from '../components/info';
import {Pattern} from "../utils/simulator";

export default {
  title: 'Example/Info',
  component: Info
};

export const Example = () => <Info
                                pattern={Pattern.Glider}
                                generationNum={5} />;
