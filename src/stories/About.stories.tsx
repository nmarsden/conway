import {h} from 'preact';
import {About} from '../components/about';
import {Meta} from "@storybook/preact";

export default {
  title: 'About',
  component: About,
  parameters: {
    layout: 'fullscreen'
  },
} as unknown as Meta;

export const Example = (): JSX.Element => <About />;
