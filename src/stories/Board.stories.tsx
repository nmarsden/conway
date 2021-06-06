import '../style/index.css';
import {h} from 'preact';
import {Board} from '../components/board';
import {PatternProvider} from '../utils/patternProvider';
import {Pattern} from "../utils/simulator";

export default {
  title: 'Example/Board',
  component: Board
};

const cellData = PatternProvider.getPatternData(Pattern.Glider, 10, 10);

export const Example = () => <Board isSmoothCamera={true}
                                    activeCellColor={{ h:157, s:71, l:60 }}
                                    boardHeight={200}
                                    boardWidth={200}
                                    isFullScreen={false}
                                    numColumns={10}
                                    numRows={10}
                                    maxActive={1}
                                    cellData={cellData}
                                    cellSize={20} />;
