import {Simulator} from "./simulator";
import {Component} from "preact";

export class NextGenStateUpdater {
  app: Component;
  simulator: Simulator;
  speed: number;
  timerHandle: number | undefined;
  isActive: boolean;

  constructor(component: Component, simulator: Simulator, speed: number) {
    this.app = component;
    this.simulator = simulator;
    this.speed = speed;
    this.isActive = false;
  }

  public start(): void {
    this.isActive = true;
    this.clearTimer();

    if (this.speed === 0) {
      return;
    }
    this.timerHandle = window.setInterval(() => {
      this.app.setState({generation: this.simulator.nextGeneration()});
    }, 1000 / this.speed);
  }

  public stop(): void {
    this.isActive = false;
    this.clearTimer();
  }

  public setSpeed(speed: number): void {
    if (this.speed !== speed) {
      this.speed = speed;
      if (this.isActive) {
        this.start();
      }
    }
  }

  private clearTimer(): void {
    if (this.timerHandle) {
      window.clearInterval(this.timerHandle);
    }
    this.timerHandle = undefined;
  }
}
