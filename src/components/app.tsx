import {Component, h} from 'preact';
import {Generation, Simulator} from "../utils/simulator";
import Board from './board';

const SPEED = 500;
const CELL_SIZE = 30;
const pageWidth = window.innerWidth;
const pageHeight = window.innerHeight;
const numColumns = Math.floor(pageWidth / CELL_SIZE);
const numRows = Math.floor(pageHeight / CELL_SIZE);

const simulator = new Simulator({
  numColumns,
  numRows
});

type AppProps = {};

type AppState = {
  generation: Generation;
};

class App extends Component<AppProps, AppState> {

  timer: any;

  constructor(props: AppProps) {
    console.log('App constructor!');
    super(props);
    this.state = {generation: simulator.initialGeneration()};
    this.timer = setInterval(() => {
      this.setState({generation: simulator.nextGeneration()});
    }, SPEED);
  }

  componentDidMount() {
    console.log('App Did Mount!');
  }

  componentWillUnmount() {
    console.log('App Will Unmount!');
    clearInterval(this.timer);
  }

  render() {
    console.log('App render! generation:', this.state.generation.num);
    return (
      <div id="app">
        <Board cellData={this.state.generation.cellData} />
      </div>
    );
  }
}

export default App;
