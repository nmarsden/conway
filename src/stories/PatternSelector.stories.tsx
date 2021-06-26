import {h} from 'preact';
import {PatternSelector} from '../components/patternSelector';
import {Pattern} from "../utils/simulator";
import {PATTERN_COLORS_DARK} from "../components/controlBar";

export default {
  title: 'PatternSelector',
  component: PatternSelector,
  parameters: {
    layout: 'fullscreen'
  }
};

export const Example = (): JSX.Element => <PatternSelector value={Pattern.Glider}
                                              patternColors={PATTERN_COLORS_DARK}
                                              disabled={false}
                                              onChanged={(): void => { /* do nothing */ }} />;
