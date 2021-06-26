import {h} from 'preact';
import {TrailControl} from '../components/trailControl';
import {DEFAULT_SETTINGS} from "../components/app";
import {Meta} from "@storybook/preact";

export default {
  title: 'TrailControl',
  component: TrailControl,
  parameters: {
    layout: 'fullscreen'
  },
} as unknown as Meta;

export const Example = (): JSX.Element => <TrailControl colors={DEFAULT_SETTINGS.colors}
                                                        onChanged={(): void => { /* do nothing */ }} />;
