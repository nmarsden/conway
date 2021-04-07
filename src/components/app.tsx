import { Component, h } from 'preact';
import Board from './board';
import {Simulator} from "../utils/simulator";

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

type AppProps = {
};

type AppState = {
  cellData: number[];
};

class App extends Component<AppProps, AppState> {

  timer: any;

  constructor(props: AppProps) {
    super(props);
    this.state = { cellData: simulator.initialState() };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ cellData: simulator.nextGeneration() });
    }, SPEED);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div id="app">
        <Board cellData={ this.state.cellData } />
      </div>
    );
  }
}

export default App;
