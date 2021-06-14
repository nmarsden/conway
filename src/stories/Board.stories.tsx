import {h} from 'preact';
import {Board} from '../components/board';
import {PatternProvider} from '../utils/patternProvider';
import {Pattern} from "../utils/simulator";
import {DEFAULT_SETTINGS} from "../components/app";

export default {
  title: 'Example/Board',
  component: Board
};

const cellData = PatternProvider.getPatternData(Pattern.Glider, 10, 10);

export const Example = () => <Board isSmoothCamera={true}
                                    trail={DEFAULT_SETTINGS.trail}
                                    boardHeight={200}
                                    boardWidth={200}
                                    isFullScreen={false}
                                    numColumns={10}
                                    numRows={10}
                                    cellData={cellData}
                                    cellSize={20}
                                    speed={10} />;
