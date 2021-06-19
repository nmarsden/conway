import {h} from 'preact';
import {Info, InfoProps} from '../components/info';
import {Pattern, SORTED_PATTERN_NAMES} from "../utils/simulator";
import {Meta, Story} from "@storybook/preact";

export default {
  title: 'Info',
  component: Info,
  argTypes: {
    pattern: {
      options: SORTED_PATTERN_NAMES,
      control: { type: 'select' }
    }
  },
  args: {
    pattern: SORTED_PATTERN_NAMES[0],
    generationNum: 5
  }
} as unknown as Meta;

type InfoStoryArgs = Omit<InfoProps, "pattern"> & { pattern: string };

const infoProps = (args: InfoStoryArgs): InfoProps => {
  const {pattern, ...rest} = args;
  return {
    pattern: (Pattern as never)[pattern],
    ...rest
  }
}

const Template: Story<InfoStoryArgs> = (args) => <Info {...infoProps(args)} />;

export const Example = Template.bind({});
