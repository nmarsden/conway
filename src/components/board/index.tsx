import {Component, h, JSX} from 'preact';
import * as PIXI from 'pixi.js'
import {hslToHexNum, lerpColor} from "../../utils/colorUtils";
import {Trail} from "../../utils/settings";

PIXI.utils.skipHello();

const CELL_INACTIVE_ALPHA = 0.5;

type BoardProps = {
  numColumns: number;
  numRows: number;
  cellData: number[];
  trail: Trail;
  cellSize: number;
  isFullScreen: boolean;
  boardWidth: number;
  boardHeight: number;
  isSmoothCamera: boolean;
  speed: number;
};

type BoardState = {};

export class Board extends Component<BoardProps, BoardState> {

  private _rafId: number | undefined;
  private numColumns: number;
  private numRows: number;
  private cellSize: number;
  private trail: Trail;
  private renderer?: PIXI.Renderer;
  private scene?: PIXI.Container;
  private cells?: Array<PIXI.Sprite>;
  private activeTints?: Map<number, number>;
  private sceneTransform: { x: number; y: number; scale: number};
  private lastDrawTime?: number;
  private isSmoothCamera: boolean;
  private animationTimeTaken: number;
  private cellData: number[];

  constructor(props: BoardProps) {
    super(props);

    // For best perf & minimal GC overhead,
    // we avoid using actual state / setState
    // for animated properties.
    this.numColumns = props.numColumns;
    this.numRows = props.numRows;
    this.cellSize = props.cellSize;
    this.trail = props.trail;
    this.sceneTransform = { x:0, y:0, scale:1 };
    this.isSmoothCamera = props.isSmoothCamera;
    this.animationTimeTaken = 0;
    this.cellData = props.cellData;

    if (props.isFullScreen) {
      window.addEventListener("resize", () => this.resetRendererSize());
    }
  }

  componentDidMount(): void {
    this.scene = new PIXI.Container();
    this.renderer = this.createRenderer();

    this.resetActiveTints();
    this.resetRendererSize();
    this.resetScene();

    // this.logWebGLSupport();

    this._rafId = window.requestAnimationFrame(this.draw);
  }

  componentWillUnmount(): void {
    if (this._rafId) {
      window.cancelAnimationFrame(this._rafId);
    }
    this.scene?.destroy(true);
    this.renderer?.destroy(true);
  }

  createRenderer(): PIXI.Renderer {
    const canvas = (this.base as HTMLCanvasElement);

    return PIXI.autoDetectRenderer({
      view: canvas,
      antialias: true,
      backgroundAlpha: 0,
      resolution: 1
    }) as PIXI.Renderer;
  }

  resetActiveTints(): void {
    this.activeTints = new Map();
    for (let active=1; active <= this.trail.size; active++) {
      this.activeTints.set(active, hslToHexNum(this.trail.colors[active-1]));
    }
  }

  resetRendererSize(): void {
    const fullScreenWidth = (document.documentElement.clientWidth || document.body.clientWidth);
    const fullScreenHeight = (document.documentElement.clientHeight || document.body.clientHeight);
    const pageWidth = (this.props.isFullScreen) ? fullScreenWidth : this.props.boardWidth;
    const pageHeight = (this.props.isFullScreen) ? fullScreenHeight : this.props.boardHeight;

    this.renderer?.resize(
      pageWidth,
      pageHeight
    );
  }

  createCellSprites(): PIXI.Sprite[] {
    const rectSize = this.cellSize - 2;
    const cellGraphic = new PIXI.Graphics();
    cellGraphic.beginFill(0xFFFFFF);
    cellGraphic.drawRect(0, 0, rectSize, rectSize);
    cellGraphic.endFill();
    const cellTexture = this.renderer?.generateTexture(cellGraphic, PIXI.SCALE_MODES.LINEAR, 1);
    const numCells = this.numRows * this.numColumns;

    const cellSprites = [];
    for (let i=0; i< numCells; i++) {
      const row = Math.floor(i / this.props.numColumns);
      const col = i % this.numColumns;
      const x = (col * this.props.cellSize) + 1;
      const y = (row * this.props.cellSize) + 1;

      const sprite = new PIXI.Sprite(cellTexture)
      sprite.position.x = x;
      sprite.position.y = y;
      sprite.alpha = 0;

      cellSprites.push(sprite);
    }
    return cellSprites;
  }

  resetScene(): void {
    // remove all children from scene
    this.scene?.removeChildren();

    // add cells to scene
    this.cells = this.createCellSprites();
    const cellsContainer = new PIXI.Container();
    for (const cell of this.cells) {
      cellsContainer.addChild(cell);
    }
    this.scene?.addChild(cellsContainer);
  }

  resetAnimationTimeTakenIfNecessary(): void {
    if (this.cellData !== this.props.cellData || this.trail !== this.props.trail) {
      this.cellData = this.props.cellData;
      this.animationTimeTaken = 0;
    }
  }

  resetActiveTintsIfNecessary(): void {
    if (this.trail !== this.props.trail) {
      this.trail = this.props.trail;
      this.resetActiveTints();
    }
  }

  resetRenderSizeAndSceneIfNecessary(): void {
    if (this.numColumns !== this.props.numColumns
      || this.numRows !== this.props.numRows
      || this.cellSize !== this.props.cellSize) {
      this.numColumns = this.props.numColumns;
      this.numRows = this.props.numRows;
      this.cellSize = this.props.cellSize;

      this.resetScene();
    }
  }

  updateCellSpriteTints(): void {
    if (this.cells && this.activeTints) {
      for (let i = 0; i < this.props.cellData.length; i++) {
        const cellValue = this.props.cellData[i];
        if (cellValue === 0) {
          this.cells[i].tint = 0x303030;
          this.cells[i].alpha = CELL_INACTIVE_ALPHA;
        } else {
          this.cells[i].tint = this.activeTints.get(cellValue) as number;
          this.cells[i].alpha = 1;
        }
      }
    }
  }

  updateCellSpriteTintsWithLerp(lerpAmount: number): void {
    if (this.cells && this.activeTints) {
      for (let i = 0; i < this.props.cellData.length; i++) {
        const cellValue = this.props.cellData[i];
        if (cellValue === 0) {
          this.cells[i].tint = lerpColor(this.cells[i].tint, 0x303030, lerpAmount);
          this.cells[i].alpha = this.lerp(this.cells[i].alpha, CELL_INACTIVE_ALPHA, lerpAmount);
        } else {
          this.cells[i].tint = lerpColor(this.cells[i].tint, this.activeTints.get(cellValue) as number, lerpAmount);
          this.cells[i].alpha = this.lerp(this.cells[i].alpha, 1, lerpAmount);
        }
      }
    }
  }

  updateSceneTransform(): void {
    if (this.renderer && this.cells) {
      const PADDING = 10 * this.cellSize;
      const MIN_SCALE = 0.01;
      const MAX_SCALE = 10;

      // determine bounds of active cells (minX, minY, maxX & maxY) with padding
      // Note: both values 1 & 2 are included in bounds to try and prevent the bounds constantly changing for a repeating pattern (eg. blinker)
      let minX = Number.MAX_VALUE;
      let maxX = 0;
      let minY = Number.MAX_VALUE;
      let maxY = 0;
      for (let i = 0; i < this.props.cellData.length; i++) {
        if (this.props.cellData[i] === 1 || this.props.cellData[i] === 2) {
          const cellX = this.cells[i].x;
          if (cellX < minX) {
            minX = cellX;
          }
          if (cellX > maxX) {
            maxX = cellX;
          }
          const cellY = this.cells[i].y;
          if (cellY < minY) {
            minY = cellY;
          }
          if (cellY > maxY) {
            maxY = cellY;
          }
        }
      }
      minX = Math.max(0, minX - PADDING);
      maxX = Math.min(this.numColumns * this.cellSize, maxX + this.cellSize + PADDING);
      minY = Math.max(0, minY - PADDING);
      maxY = Math.min(this.numRows * this.cellSize, maxY + this.cellSize + PADDING);

      // determine scale
      const viewWidth = (maxX - minX);
      const viewHeight = (maxY - minY);
      const screenWidth = this.renderer.width;
      const screenHeight = this.renderer.height;
      const screenRatio = screenWidth / screenHeight;
      const scaleX = this.clamp(screenWidth / viewWidth, MIN_SCALE, MAX_SCALE);
      const scaleY = this.clamp(screenHeight / viewHeight, MIN_SCALE, MAX_SCALE);
      const scale = Math.min(scaleX, scaleY);

      // adjust minX/minY according to scale
      if (scaleX < scaleY) {
        // adjust minY for scaleX
        const adjustedViewHeight = viewWidth / screenRatio;
        minY = minY - (adjustedViewHeight - viewHeight) / 2;
      } else {
        // adjust minX for scaleY
        const adjustedViewWidth = screenRatio * viewHeight;
        minX = minX - (adjustedViewWidth - viewWidth) / 2;
      }

      // Set scene transform (x, y, & scale)
      const x = scale * (- minX);
      const y = scale * (- minY);
      this.sceneTransform = { x, y, scale };
    }
  }

  updateSmoothCamera(): void {
    if (this.isSmoothCamera !== this.props.isSmoothCamera) {
      this.isSmoothCamera = this.props.isSmoothCamera;
    }
  }

  draw: FrameRequestCallback = (time) => {
    this._rafId = window.requestAnimationFrame(this.draw);

    this.resetAnimationTimeTakenIfNecessary();
    this.resetActiveTintsIfNecessary();
    this.resetRenderSizeAndSceneIfNecessary();

    this.updateSceneTransform();
    this.updateSmoothCamera();

    // Update transform closer to desired transform based on timeDelta and rate
    const RATE = 1;
    const timeDelta = (typeof this.lastDrawTime === 'undefined') ? 0 : (time - this.lastDrawTime);
    const t = this.isSmoothCamera ? (RATE * (timeDelta / 1000)) : 1;

    this.lastDrawTime = time;

    if (this.scene) {
      const x = this.lerp(this.scene.position.x, this.sceneTransform.x, t);
      const y = this.lerp(this.scene.position.y, this.sceneTransform.y, t);
      const scale = this.lerp(this.scene.scale.x, this.sceneTransform.scale, t);

      this.scene?.setTransform(x, y, scale, scale);
    }

    if (this.isSmoothCamera) {
      // Animate cell colors with an ease-in cubic transition
      this.animationTimeTaken = this.animationTimeTaken + timeDelta;
      if (this.animationTimeTaken < 1100) {
        const tColor = this.props.speed === 0 ? 1 : Math.min(this.animationTimeTaken / (1000 / this.props.speed), 1);
        this.updateCellSpriteTintsWithLerp(tColor * tColor * tColor);
      }
    } else {
      this.updateCellSpriteTints();
    }

    this.renderer?.render(this.scene as PIXI.IRenderableObject);
  }

  lerp (start: number, end: number, amount: number): number {
    return (1-amount)*start+amount*end
  }

  clamp (num: number, a: number, b: number): number {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
  }

  logWebGLSupport(): void {
    console.log('isWebGLSupported?', PIXI.utils.isWebGLSupported());
    if (this.renderer && this.renderer.type == PIXI.RENDERER_TYPE.WEBGL){
      console.log('Using WebGL');
    } else {
      console.log('Using Canvas');
    }
  }

  render(): JSX.Element {
    return <canvas />
  }
}
