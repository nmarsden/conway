import {h} from 'preact';
import {PatternPreview} from '../components/patternPreview';
import {Pattern} from "../utils/simulator";

export default {
  title: 'Example/PatternPreview',
  component: PatternPreview
};

export const Selected = () => <PatternPreview isSelected={true}
                                              isVisible={true}
                                              pattern={Pattern.Glider} />;

export const Unselected = () => <PatternPreview isSelected={false}
                                                isVisible={true}
                                                pattern={Pattern.Glider} />;
