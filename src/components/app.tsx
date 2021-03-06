import {Component, h} from 'preact';
import {Generation, Pattern, Simulator, SORTED_PATTERN_NAMES} from "../utils/simulator";
import {NextGenStateUpdater} from "../utils/nextGenStateUpdater";
import {AppMode, Settings} from "../utils/settings";
import {Info} from "./info";
import {Board} from './board';
import {ControlBar} from "./controlBar";
import {ThemeToggle} from "./themeToggle";
import {Themer} from "../utils/themer";
import {buildTrail, hexNumToHsl, rebuildTrail} from "../utils/colorUtils";
import {About} from "./about";
import {Loading} from "./loading";

export const NUM_COLUMNS = 100;
export const NUM_ROWS = 100;
export const TRAIL_START_HUE = 157;
export const TRAIL_END_HUE = 0;
export const CELL_INACTIVE_LIGHT_MODE = hexNumToHsl(0xF0F0F0); // {h:0,s:0,l:94.1}
export const CELL_INACTIVE_DARK_MODE = hexNumToHsl(0x1A1A1A);  // {h:0,s:0,l:10}

export const DEFAULT_SETTINGS: Settings = {
  mode: AppMode.Auto,
  speed: 10,
  cellSize: 20,
  pattern: Pattern.Glider,
  colors: {
    inactiveCell: CELL_INACTIVE_DARK_MODE,
    activeCellTrail: buildTrail(TRAIL_START_HUE, TRAIL_END_HUE, 20, CELL_INACTIVE_DARK_MODE)
  },
  isDarkTheme: true,
}

type AppProps = {};

type AppState = {
  settings: Settings;
  generation: Generation;
  numColumns: number;
  numRows: number;
  isSmoothCamera: boolean;
  isLoading: boolean;
};

let nextGenStateUpdater: NextGenStateUpdater;

class App extends Component<AppProps, AppState> {

  private simulator: Simulator | undefined;
  private autoTimerHandle: number | undefined;

  constructor(props: AppProps) {
    super(props);
    this.initSettings(DEFAULT_SETTINGS);
  }

  startAutoMode(): void {
    this.autoTimerHandle = window.setInterval(() => {
      if (this.state.generation.num > 100) {
        this.settingsChanged({...this.state.settings, pattern: this.nextPattern(this.state.settings.pattern)})
      }
    }, 100);
  }

  stopAutoMode(): void {
    if (this.autoTimerHandle) {
      window.clearInterval(this.autoTimerHandle);
    }
    this.autoTimerHandle = undefined;
  }

  initSettings = (settings: Settings): void => {
    if (settings.mode === AppMode.Auto) {
      this.startAutoMode();
    }
    this.simulator = this.initSimulator(settings.pattern);
    this.initAppState(settings, this.simulator);
    this.initNextGenStateUpdater(this.simulator, settings.speed, settings.colors.activeCellTrail.size);
  };

  private initSimulator(pattern: Pattern): Simulator {
    return new Simulator({
      numColumns: NUM_COLUMNS,
      numRows: NUM_ROWS,
      pattern
    });
  }

  private initAppState(settings: Settings, simulator: Simulator): void {
    this.state = {
      settings,
      generation: simulator.initialGeneration(),
      numColumns: simulator.getSettings().numColumns,
      numRows: simulator.getSettings().numRows,
      isSmoothCamera: true,
      isLoading: true
    };
  }

  private initNextGenStateUpdater(simulator: Simulator, speed: number, trailSize: number): void {
    if (nextGenStateUpdater) {
      nextGenStateUpdater.stop();
    }
    nextGenStateUpdater = new NextGenStateUpdater(this, simulator, speed, trailSize);
    nextGenStateUpdater.start();
  }

  themeChanged = (isDarkTheme: boolean): void => {
    Themer.updateTheme(isDarkTheme);
    const inactiveCell = isDarkTheme ? CELL_INACTIVE_DARK_MODE : CELL_INACTIVE_LIGHT_MODE;
    const colors = {
      inactiveCell,
      activeCellTrail: rebuildTrail(this.state.settings.colors.activeCellTrail, inactiveCell)
    }

    this.setState({ settings: {
        ...this.state.settings,
        isDarkTheme,
        colors
    }});
  }

  settingsChanged = (settings: Settings): void => {
    const cellSizeChanged = (settings.cellSize !== this.state.settings.cellSize);
    const patternChanged = (settings.pattern !== this.state.settings.pattern);
    const modeChanged = (settings.mode !== this.state.settings.mode);
    const trailSizeChanged = (settings.colors.activeCellTrail.size !== this.state.settings.colors.activeCellTrail.size);

    if (modeChanged) {
      this.updateMode(settings.mode);
    }

    if (patternChanged) {
      this.disableSmoothCamera();
    }

    if (trailSizeChanged) {
      const generation = this.simulator?.currentGeneration(settings.colors.activeCellTrail.size - 1);
      this.setState({generation});
    }

    if (cellSizeChanged || patternChanged) {
      this.resetSimulation(settings.cellSize, settings.pattern);
    }
    else {
      this.setState({settings});
      nextGenStateUpdater.setSpeed(settings.speed);
      nextGenStateUpdater.setTrailSize(settings.colors.activeCellTrail.size);
    }
  }

  updateMode(mode: AppMode): void {
    if (mode === AppMode.Auto) {
      this.startAutoMode();
    } else {
      this.stopAutoMode();
    }
  }

  resetSimulation(cellSize: number, pattern: Pattern): void {
    this.simulator = this.initSimulator(pattern);
    this.setState({
      settings: { ...this.state.settings, cellSize, pattern },
      generation: this.simulator.initialGeneration(),
      numColumns: this.simulator.getSettings().numColumns,
      numRows: this.simulator.getSettings().numRows
    });
    this.initNextGenStateUpdater(this.simulator, this.state.settings.speed, this.state.settings.colors.activeCellTrail.size);
  }

  disableSmoothCamera = (): void  => {
      this.setState( { isSmoothCamera: false });
  }

  enableSmoothCamera = (): void  => {
      this.setState( { isSmoothCamera: true });
  }

  componentDidUpdate(previousProps: Readonly<AppProps>, previousState: Readonly<AppState>): void {
    if (!previousState.isSmoothCamera) {
      this.enableSmoothCamera();
    }
  }

  componentWillUnmount(): void {
    nextGenStateUpdater.stop();
  }

  onBoardReady = (): void => {
    this.setState( { isLoading: false });
  }

  render(): JSX.Element {
    return (
      <div id="app">
        <Loading isShown={this.state.isLoading} />
        <Info pattern={this.state.settings.pattern}
              generationNum={this.state.generation.num}
        />
        <Board numColumns={this.state.numColumns}
               numRows={this.state.numRows}
               cellData={this.state.generation.cellData}
               colors={this.state.settings.colors}
               cellSize={this.state.settings.cellSize}
               isFullScreen={true}
               boardWidth={0}
               boardHeight={0}
               isSmoothCamera={this.state.isSmoothCamera}
               speed={this.state.settings.speed}
               onReady={this.onBoardReady}
        />
        <ThemeToggle isDark={this.state.settings.isDarkTheme} onThemeChanged={this.themeChanged} />
        <ControlBar settings={this.state.settings}
                    onSettingsChanged={this.settingsChanged} />
        <About />
      </div>
    );
  }

  private nextPattern(pattern: Pattern): Pattern {
    const index = SORTED_PATTERN_NAMES.indexOf(Pattern[pattern]);
    const nextIndex = (index + 1) % SORTED_PATTERN_NAMES.length;
    const nextPattern = SORTED_PATTERN_NAMES[nextIndex];
    return (Pattern as never)[nextPattern];
  }
}

export default App;
