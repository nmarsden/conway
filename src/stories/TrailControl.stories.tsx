import {h} from 'preact';
import {TrailControl} from '../components/trailControl';
import {DEFAULT_SETTINGS} from "../components/app";

export default {
  title: 'Example/TrailControl',
  component: TrailControl,
  parameters: {
    layout: 'fullscreen'
  }
};

export const Example = () => <TrailControl trail={DEFAULT_SETTINGS.trail}
                                           onChanged={(): void => { /* do nothing */ }} />;
