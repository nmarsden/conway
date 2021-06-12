import {h} from 'preact';
import {PatternSelector} from '../components/patternSelector';
import {Pattern} from "../utils/simulator";

export default {
  title: 'Example/PatternSelector',
  component: PatternSelector,
  parameters: {
    layout: 'fullscreen'
  }
};

export const Example = () => <PatternSelector value={Pattern.Glider}
                                              disabled={false}
                                              onChanged={(): void => { /* do nothing */ }} />;