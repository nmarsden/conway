import {Simulator} from "./simulator";
import {Component} from "preact";

export class NextGenStateUpdater {
  app: Component;
  simulator: Simulator;
  speed: number;
  timerHandle: number | undefined;

  constructor(component: Component, simulator: Simulator, speed: number) {
    this.app = component;
    this.simulator = simulator;
    this.speed = speed;
  }

  public start(): void {
    this.clearTimer();
    this.timerHandle = window.setInterval(() => {
      this.app.setState({generation: this.simulator.nextGeneration()});
    }, this.speed);
  }

  public stop(): void {
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.timerHandle) {
      window.clearInterval(this.timerHandle);
    }
    this.timerHandle = undefined;
  }
}
