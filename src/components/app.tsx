import { FunctionalComponent, h } from 'preact';
import Board from './board';
import {useState} from "preact/hooks";
import {Simulator} from "../utils/simulator";

const simulator = new Simulator();

const App: FunctionalComponent = () => {

  const [cellData, setCellData] = useState(simulator.initialState());

  const nextGeneration = (): void => {
    setCellData(simulator.nextGeneration());
  }

  setTimeout(nextGeneration,1000);

  return (
    <div id="app">
      <Board cellData={ cellData } />
    </div>
  );
};

export default App;
