import {h} from 'preact';
import {Loading, LoadingProps} from '../components/loading';
import {Meta, Story} from "@storybook/preact";

export default {
  title: 'Loading',
  component: Loading,
  args: {
    isShown: true
  }
} as unknown as Meta;

const Template: Story<LoadingProps> = (args) => {
  const props = {
    isShown: args.isShown
  };
  return <Loading {...props} />;
}

export const Example = Template.bind({});
