import {h} from 'preact';
import {ControlBar} from '../components/controlBar';
import {DEFAULT_SETTINGS} from "../components/app";

export default {
  title: 'ControlBar',
  component: ControlBar,
  parameters: {
    layout: 'fullscreen'
  }
};

export const Example = () => <ControlBar settings={DEFAULT_SETTINGS}
                                         onSettingsChanged={(): void => { /* do nothing */}} />;

