import style from './style.css';
import classNames from "classnames";
import {Component, h} from 'preact';
import {getPatternDisplayName, Pattern} from "../../utils/simulator";
import {Board} from "../board";
import {PatternProvider} from "../../utils/patternProvider";

const SELECTED_CELL_COLOR = {h: 157, s: 71, l: 60}; // green
const UNSELECTED_CELL_COLOR = {h: 0, s: 0, l: 100}; // white

export type PatternPreviewProps = {
  pattern: Pattern;
  isSelected: boolean;
  isVisible: boolean;
};

type PatternPreviewState = {
  patternName: string;
  numColumns: number;
  numRows: number;
  cellData: number[];
};

export class PatternPreview extends Component<PatternPreviewProps, PatternPreviewState> {

  constructor(props: PatternPreviewProps) {
    super(props);
    const patternDimensions = PatternProvider.getPatternDimensions(props.pattern);
    const patternSize = Math.max(patternDimensions.numRows, patternDimensions.numColumns);
    this.state = {
      patternName: getPatternDisplayName(props.pattern),
      numColumns: patternSize,
      numRows: patternSize,
      cellData: PatternProvider.getPatternData(props.pattern, patternSize, patternSize)
    }
  }

  render(): JSX.Element {
    return (
      <div class={classNames(style['pattern-preview'], {[style['selected']]: this.props.isSelected})}>
        {this.props.isVisible ?
          <Board numColumns={this.state.numColumns}
                 numRows={this.state.numRows}
                 cellData={this.state.cellData}
                 maxActive={1}
                 cellSize={20}
                 isFullScreen={false}
                 boardWidth={80}
                 boardHeight={80}
                 activeCellColor={this.props.isSelected ? SELECTED_CELL_COLOR : UNSELECTED_CELL_COLOR}
                 isSmoothCamera={false}
          />
          :
          <div />
        }
        <div className={style['patternName']}>{this.state.patternName}</div>
      </div>
    );
  }
}
