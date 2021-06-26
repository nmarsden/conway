import {h} from 'preact';
import {Board, BoardProps} from '../components/board';
import {Pattern, SORTED_PATTERN_NAMES} from "../utils/simulator";
import {Meta, Story} from "@storybook/preact";
import {PatternProvider} from "../utils/patternProvider";
import {DEFAULT_SETTINGS, NUM_COLUMNS, NUM_ROWS} from "../components/app";

export default {
  title: 'Board',
  component: Board,
  argTypes: {
    pattern: {
      options: SORTED_PATTERN_NAMES,
      control: { type: 'select' }
    }
  },
  args: {
    pattern: SORTED_PATTERN_NAMES[0],
    isSmoothCamera: true,
    isFullScreen: true
  }
} as unknown as Meta;

type BoardStoryArgs = { pattern: string; isSmoothCamera: boolean; isFullScreen: boolean };

const boardProps = (args: BoardStoryArgs): BoardProps => {
  const {pattern, ...rest} = args;
  return {
    cellData: PatternProvider.getPatternData((Pattern as never)[pattern], NUM_COLUMNS, NUM_ROWS),
    numColumns: NUM_COLUMNS,
    numRows: NUM_ROWS,
    colors: DEFAULT_SETTINGS.colors,
    cellSize: 20,
    boardWidth: NUM_COLUMNS,
    boardHeight: NUM_ROWS,
    speed: 10,
    ...rest
  }
}

const Template: Story<BoardStoryArgs> = (args) => <Board {...boardProps(args)} />;

export const Example = Template.bind({});
