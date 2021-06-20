import {Component, h} from 'preact';
import {Generation, Pattern, Simulator, SORTED_PATTERN_NAMES} from "../utils/simulator";
import {NextGenStateUpdater} from "../utils/nextGenStateUpdater";
import {AppMode, Settings} from "../utils/settings";
import {Info} from "./info";
import {Board} from './board';
import {ControlBar} from "./controlBar";
import {buildTrail} from "./trailControl";

export const NUM_COLUMNS = 100;
export const NUM_ROWS = 100;
const TRAIL_START_HUE = 157;
const TRAIL_END_HUE = 0;

export const DEFAULT_SETTINGS: Settings = {
  mode: AppMode.Auto,
  speed: 10,
  cellSize: 20,
  pattern: Pattern.Glider,
  trail: buildTrail(TRAIL_START_HUE, TRAIL_END_HUE, 20)
}

type AppProps = {};

type AppState = {
  settings: Settings;
  generation: Generation;
  numColumns: number;
  numRows: number;
  isSmoothCamera: boolean;
};

let nextGenStateUpdater: NextGenStateUpdater;

class App extends Component<AppProps, AppState> {

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
    const simulator = this.initSimulator(settings.pattern);
    this.initAppState(settings, simulator);
    this.initNextGenStateUpdater(simulator, settings.speed, settings.trail.size);
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
      isSmoothCamera: true
    };
  }

  private initNextGenStateUpdater(simulator: Simulator, speed: number, trailSize: number): void {
    if (nextGenStateUpdater) {
      nextGenStateUpdater.stop();
    }
    nextGenStateUpdater = new NextGenStateUpdater(this, simulator, speed, trailSize);
    nextGenStateUpdater.start();
  }

  settingsChanged = (settings: Settings): void => {
    const cellSizeChanged = (settings.cellSize !== this.state.settings.cellSize);
    const patternChanged = (settings.pattern !== this.state.settings.pattern);
    const modeChanged = (settings.mode !== this.state.settings.mode);

    if (modeChanged) {
      this.updateMode(settings.mode);
    }

    if (patternChanged) {
      this.disableSmoothCamera();
    }

    if (cellSizeChanged || patternChanged) {
      this.resetSimulation(settings.cellSize, settings.pattern);
    }
    else {
      this.setState({settings});
      nextGenStateUpdater.setSpeed(settings.speed);
      nextGenStateUpdater.setTrailSize(settings.trail.size);
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
    const simulator = this.initSimulator(pattern);
    this.setState({
      settings: { ...this.state.settings, cellSize, pattern },
      generation: simulator.initialGeneration(),
      numColumns: simulator.getSettings().numColumns,
      numRows: simulator.getSettings().numRows
    });
    this.initNextGenStateUpdater(simulator, this.state.settings.speed, this.state.settings.trail.size);
  }

  disableSmoothCamera = (): void  => {
      this.setState( { isSmoothCamera: false });
  }

  enableSmoothCamera = (): void  => {
      this.setState( { isSmoothCamera: true });
  }

  componentDidUpdate(previousProps: Readonly<AppProps>, previousState: Readonly<AppState>) {
    if (!previousState.isSmoothCamera) {
      this.enableSmoothCamera();
    }
  }

  componentWillUnmount(): void {
    nextGenStateUpdater.stop();
  }

  render(): JSX.Element {
    return (
      <div id="app">
        <Info pattern={this.state.settings.pattern}
              generationNum={this.state.generation.num}
        />
        <Board numColumns={this.state.numColumns}
               numRows={this.state.numRows}
               cellData={this.state.generation.cellData}
               trail={this.state.settings.trail}
               cellSize={this.state.settings.cellSize}
               isFullScreen={true}
               boardWidth={0}
               boardHeight={0}
               isSmoothCamera={this.state.isSmoothCamera}
               speed={this.state.settings.speed}
        />
        <ControlBar settings={this.state.settings}
                    onSettingsChanged={this.settingsChanged} />
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
