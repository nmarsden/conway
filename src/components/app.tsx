import {Component, h} from 'preact';
import {Generation, Pattern, Simulator} from "../utils/simulator";
import {NextGenStateUpdater} from "../utils/nextGenStateUpdater";
import SettingsModal, {Settings} from "./settingsModal";
import SettingsButton from "./settingsButton";
import Info from "./info";
import Board from './board';

const DEFAULT_SETTINGS: Settings = {
  speed: 10,
  cellSize: 20,
  pattern: Pattern.Glider,
  trailSize: 20
}

type AppProps = {};

type AppState = {
  settings: Settings;
  generation: Generation;
  isSettingsModalOpen: boolean;
  numColumns: number;
  numRows: number;
};

let nextGenStateUpdater: NextGenStateUpdater;

class App extends Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    window.addEventListener("resize", () => this.updateSettings(this.state.settings));
    this.initSettings(DEFAULT_SETTINGS);
  }

  initSettings = (settings: Settings): void => {
    const simulator = this.initSimulator(settings.cellSize, settings.pattern);
    this.initAppState(settings, simulator);
    this.initNextGenStateUpdater(simulator, settings.speed, settings.trailSize);
  };

  updateSettings = (settings: Settings): void => {
    const simulator = this.initSimulator(settings.cellSize, settings.pattern);
    this.updateAppState(settings, simulator);
    this.initNextGenStateUpdater(simulator, settings.speed, settings.trailSize);
  };

  private initSimulator(cellSize: number, pattern: Pattern): Simulator {
    const pageWidth = (document.documentElement.clientWidth || document.body.clientWidth);
    const pageHeight = (document.documentElement.clientHeight || document.body.clientHeight);
    const numColumns = Math.floor(pageWidth / cellSize);
    const numRows = Math.floor(pageHeight / cellSize);

    return new Simulator({
      numColumns,
      numRows,
      pattern
    });
  }

  private initAppState(settings: Settings, simulator: Simulator): void {
    this.state = {
      settings,
      generation: simulator.initialGeneration(),
      isSettingsModalOpen: false,
      numColumns: simulator.getSettings().numColumns,
      numRows: simulator.getSettings().numRows
    };
  }

  private updateAppState(settings: Settings, simulator: Simulator): void {
    this.setState({
      settings,
      generation: simulator.initialGeneration(),
      numColumns: simulator.getSettings().numColumns,
      numRows: simulator.getSettings().numRows
    });
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

    if (cellSizeChanged || patternChanged) {
      this.resetSimulation(settings.cellSize, settings.pattern);
    }
    else {
      this.setState({settings});
      nextGenStateUpdater.setSpeed(settings.speed);
      nextGenStateUpdater.setTrailSize(settings.trailSize);
    }
  }

  resetSimulation(cellSize: number, pattern: Pattern): void {
    const simulator = this.initSimulator(cellSize, pattern);
    this.setState({
      settings: { ...this.state.settings, cellSize, pattern },
      generation: simulator.initialGeneration(),
      numColumns: simulator.getSettings().numColumns,
      numRows: simulator.getSettings().numRows
    });
    this.initNextGenStateUpdater(simulator, this.state.settings.speed, this.state.settings.trailSize);
  }

  settingsButtonClicked = (): void => {
    this.setState( { isSettingsModalOpen: !this.state.isSettingsModalOpen });
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
               maxActive={this.state.settings.trailSize + 1}
               cellSize={this.state.settings.cellSize}
        />
        { this.state.isSettingsModalOpen ? <SettingsModal settings={this.state.settings}
                                                          onSettingsChanged={this.settingsChanged} /> : '' }
        <SettingsButton onClicked={this.settingsButtonClicked} />
      </div>
    );
  }
}

export default App;
