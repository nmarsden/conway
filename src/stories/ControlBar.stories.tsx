import '../style/index.css';
import {h} from 'preact';
import {ControlBar} from '../components/controlBar';
import {AppMode} from "../utils/settings";
import {Pattern} from "../utils/simulator";

export default {
  title: 'Example/ControlBar',
  component: ControlBar
};

export const Example = () => <ControlBar settings={{
                                            mode: AppMode.Auto,
                                            cellSize: 20,
                                            trailSize: 40,
                                            speed: 10,
                                            pattern: Pattern.Glider
                                         }}
                                         onSettingsChanged={(): void => { /* do nothing */}} />;

