import {Pattern} from "./simulator";
import {HSLColor} from "./colorUtils";

export enum AppMode { Auto,Custom }

export type Trail = {
  colors: HSLColor[];
  size: number;
}

export type Settings = {
  mode: AppMode;
  speed: number;
  cellSize: number;
  pattern: Pattern;
  trail: Trail;
}
