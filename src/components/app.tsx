import {Component, h} from 'preact';
import {Generation, Simulator} from "../utils/simulator";
import {NextGenStateUpdater} from "../utils/nextGenStateUpdater";
import SettingsModal, {Settings} from "./settingsModal";
import SettingsButton from "./settingsButton";
import Board from './board';

const DEFAULT_SETTINGS: Settings = {
  speed: 5,
  cellSize: 50
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
    const simulator = this.initSimulator(settings.cellSize);
    this.initAppState(settings, simulator);
    this.initNextGenStateUpdater(simulator, settings.speed);
  };

  private initSimulator(cellSize: number): Simulator {
    const pageWidth = (document.documentElement.clientWidth || document.body.clientWidth);
    const pageHeight = (document.documentElement.clientHeight || document.body.clientHeight);
    const numColumns = Math.floor(pageWidth / cellSize);
    const numRows = Math.floor(pageHeight / cellSize);

    return new Simulator({
      numColumns,
      numRows
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
    if (cellSizeChanged) {
      this.updateCellSize(settings.cellSize);
    }
    else {
      this.setState({settings});
      nextGenStateUpdater.setSpeed(settings.speed);
    }
  }

  updateCellSize(cellSize: number): void {
    const simulator = this.initSimulator(cellSize);
    this.setState({
      settings: { ...this.state.settings, cellSize },
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
        <Board cellData={this.state.generation.cellData} cellSize={this.state.settings.cellSize} />
        { this.state.isSettingsModalOpen ? <SettingsModal settings={this.state.settings} onSettingsChanged={this.settingsChanged} /> : '' }
        <SettingsButton onClicked={this.settingsButtonClicked} />
      </div>
    );
  }
}

export default App;
