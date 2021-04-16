import {Component, h} from 'preact';
import {Generation, Pattern, Simulator} from "../utils/simulator";
import {NextGenStateUpdater} from "../utils/nextGenStateUpdater";
import SettingsModal, {Settings} from "./settingsModal";
import SettingsButton from "./settingsButton";
import Board from './board';

const DEFAULT_SETTINGS: Settings = {
  speed: 5,
  cellSize: 50,
  pattern: Pattern.Glider,
  trailSize: 10
}

type AppProps = {};

type AppState = {
  settings: Settings;
  generation: Generation;
  isSettingsModalOpen: boolean;
};

let nextGenStateUpdater: NextGenStateUpdater;

class App extends Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    console.log('App constructor!');
    window.addEventListener("resize", () => this.init(this.state.settings));
    this.init(DEFAULT_SETTINGS);
  }

  init = (settings: Settings): void => {
    const simulator = this.initSimulator(settings.cellSize, settings.pattern, settings.trailSize);
    this.initAppState(settings, simulator);
    this.initNextGenStateUpdater(simulator, settings.speed);
  };

  private initSimulator(cellSize: number, pattern: Pattern, historySize: number): Simulator {
    const pageWidth = (document.documentElement.clientWidth || document.body.clientWidth);
    const pageHeight = (document.documentElement.clientHeight || document.body.clientHeight);
    const numColumns = Math.floor(pageWidth / cellSize);
    const numRows = Math.floor(pageHeight / cellSize);

    return new Simulator({
      numColumns,
      numRows,
      pattern,
      historySize
    });
  }

  private initAppState(settings: Settings, simulator: Simulator): void {
    this.state = {
      settings,
      generation: simulator.initialGeneration(),
      isSettingsModalOpen: false
    };
  }

  private initNextGenStateUpdater(simulator: Simulator, speed: number): void {
    if (nextGenStateUpdater) {
      nextGenStateUpdater.stop();
    }
    nextGenStateUpdater = new NextGenStateUpdater(this, simulator, speed);
    nextGenStateUpdater.start();
  }

  settingsChanged = (settings: Settings): void => {
    const cellSizeChanged = (settings.cellSize !== this.state.settings.cellSize);
    const patternChanged = (settings.pattern !== this.state.settings.pattern);
    const trailSizeChanged = (settings.trailSize !== this.state.settings.trailSize);

    if (cellSizeChanged || patternChanged || trailSizeChanged) {
      this.resetSimulation(settings.cellSize, settings.pattern, settings.trailSize);
    }
    else {
      this.setState({settings});
      nextGenStateUpdater.setSpeed(settings.speed);
    }
  }

  resetSimulation(cellSize: number, pattern: Pattern, trailSize: number): void {
    const simulator = this.initSimulator(cellSize, pattern, trailSize);
    this.setState({
      settings: { ...this.state.settings, cellSize, pattern, trailSize },
      generation: simulator.initialGeneration()
    });
    this.initNextGenStateUpdater(simulator, this.state.settings.speed);
  }

  settingsButtonClicked = (): void => {
    this.setState( { isSettingsModalOpen: !this.state.isSettingsModalOpen });
  }

  componentDidMount() {
    console.log('App Did Mount!');
  }

  componentWillUnmount() {
    console.log('App Will Unmount!');
    nextGenStateUpdater.stop();
  }

  render() {
    // console.log('App render! generation:', this.state.generation.num);
    return (
      <div id="app">
        <Board cellData={this.state.generation.cellData}
               maxActive={this.state.settings.trailSize + 1}
               cellSize={this.state.settings.cellSize} />
        { this.state.isSettingsModalOpen ? <SettingsModal settings={this.state.settings}
                                                          onSettingsChanged={this.settingsChanged} /> : '' }
        <SettingsButton onClicked={this.settingsButtonClicked} />
      </div>
    );
  }
}

export default App;
