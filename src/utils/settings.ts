import {Pattern} from "./simulator";

export enum AppMode { Auto,Custom }

export type Settings = {
  mode: AppMode;
  speed: number;
  cellSize: number;
  pattern: Pattern;
  trailSize: number;
}
