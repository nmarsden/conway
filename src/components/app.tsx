import {Component, h} from 'preact';
import {Generation, Simulator} from "../utils/simulator";
import {NextGenStateUpdater} from "../utils/nextGenStateUpdater";
import SettingsModal, {Settings} from "./settingsModal";
import SettingsButton from "./settingsButton";
import Board from './board';

const SPEED = 5;
const CELL_SIZE = 50;

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
    window.addEventListener("resize", this.init);
    this.init();
  }

  init = (): void => {
    const simulator = this.initSimulator();
    this.initAppState(simulator);
    this.initNextGenStateUpdater(simulator, SPEED);
  };

  private initSimulator(): Simulator {
    const pageWidth = (document.documentElement.clientWidth || document.body.clientWidth);
    const pageHeight = (document.documentElement.clientHeight || document.body.clientHeight);
    const numColumns = Math.floor(pageWidth / CELL_SIZE);
    const numRows = Math.floor(pageHeight / CELL_SIZE);

    return new Simulator({
      numColumns,
      numRows
    });
  }

  private initAppState(simulator: Simulator): void {
    this.state = {
      settings: {
        speed: SPEED
      },
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
    this.setState({ settings });

    nextGenStateUpdater.setSpeed(settings.speed);
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
        <Board cellData={this.state.generation.cellData} cellSize={CELL_SIZE} />
        { this.state.isSettingsModalOpen ? <SettingsModal settings={this.state.settings} onSettingsChanged={this.settingsChanged} /> : '' }
        <SettingsButton onClicked={this.settingsButtonClicked} />
      </div>
    );
  }
}

export default App;
