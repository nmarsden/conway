import {h} from 'preact';
import {PatternPreview, PatternPreviewProps} from '../components/patternPreview';
import {Pattern, SORTED_PATTERN_NAMES} from "../utils/simulator";
import {Meta, Story} from "@storybook/preact";
import {PATTERN_COLORS_DARK} from "../components/controlBar";

export default {
  title: 'PatternPreview',
  component: PatternPreview,
  argTypes: {
    pattern: {
      options: SORTED_PATTERN_NAMES,
      control: { type: 'select' }
    }
  },
  args: {
    pattern: SORTED_PATTERN_NAMES[0],
    isSelected: false
  }
} as unknown as Meta;

type PatternPreviewStoryArgs = { pattern: string; isSelected: boolean };

const patternPreviewProps = (args: PatternPreviewStoryArgs): PatternPreviewProps => {
  const {pattern, ...rest} = args;
  return {
    pattern: (Pattern as never)[pattern],
    patternColors: PATTERN_COLORS_DARK,
    isVisible: true,
    ...rest  }
}

const Template: Story<PatternPreviewStoryArgs> = (args) => <PatternPreview {...patternPreviewProps(args)} />;

export const Example = Template.bind({});
