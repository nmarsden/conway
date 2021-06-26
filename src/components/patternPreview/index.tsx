import style from './style.css';
import classNames from "classnames";
import {Component, h} from 'preact';
import {getPatternDisplayName, Pattern} from "../../utils/simulator";
import {Board} from "../board";
import {PatternProvider} from "../../utils/patternProvider";
import {Trail} from "../../utils/settings";
import {HSLColor} from "../../utils/colorUtils";

export type PatternPreviewProps = {
  pattern: Pattern;
  patternColors: PatternColors;
  isSelected: boolean;
  isVisible: boolean;
};

export type PatternColors = {
  boardColor: HSLColor;
  selectedColor: HSLColor;
  unselectedColor: HSLColor;
}

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

  trail(isSelected: boolean, patternColors: PatternColors): Trail {
    const color = isSelected ? patternColors.selectedColor : patternColors.unselectedColor;
    return { size: 1, colors: [ color ] }
  }

  render(): JSX.Element {
    return (
      <div class={classNames(style['pattern-preview'], {[style['selected']]: this.props.isSelected})}>
        {this.props.isVisible ?
          <Board numColumns={this.state.numColumns}
                 numRows={this.state.numRows}
                 cellData={this.state.cellData}
                 colors={{
                   inactiveCell: this.props.patternColors.boardColor,
                   activeCellTrail: this.trail(this.props.isSelected, this.props.patternColors)
                 }}
                 cellSize={20}
                 isFullScreen={false}
                 boardWidth={80}
                 boardHeight={80}
                 isSmoothCamera={false}
                 speed={10}
          />
          :
          <div />
        }
        <div className={style['patternName']}>{this.state.patternName}</div>
      </div>
    );
  }
}
