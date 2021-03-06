import {Component, h, JSX} from 'preact';
import * as PIXI from 'pixi.js'
import {HSLColor, hslToHexNum, lerpColor} from "../../utils/colorUtils";
import {Trail} from "../../utils/settings";

PIXI.utils.skipHello();
const loader = PIXI.Loader.shared;

const FRAMES_PER_SECOND = 60;  // Valid values are 60,30,20,15,10...
const FRAME_MIN_TIME = (1000/60) * (60 / FRAMES_PER_SECOND) - (1000/60) * 0.5;

export type BoardColors = {
  inactiveCell: HSLColor;
  activeCellTrail: Trail;
};

export type BoardProps = {
  numColumns: number;
  numRows: number;
  cellData: number[];
  colors: BoardColors;
  cellSize: number;
  isFullScreen: boolean;
  boardWidth: number;
  boardHeight: number;
  isSmoothCamera: boolean;
  speed: number;
  onReady?: () => void;
};

type BoardState = {};

export class Board extends Component<BoardProps, BoardState> {

  private _rafId: number | undefined;
  private numColumns: number;
  private numRows: number;
  private cellSize: number;
  private colors: BoardColors;
  private renderer?: PIXI.Renderer;
  private scene?: PIXI.Container;
  private cellsContainer?: PIXI.Container;
  private cells?: Array<PIXI.Sprite>;
  private inactiveTint: number;
  private activeTints?: Map<number, number>;
  private sceneTransform: { x: number; y: number; scale: number};
  private lastDrawTime: number;
  private isSmoothCamera: boolean;
  private animationTimeTaken: number;
  private backgroundImage?: PIXI.Sprite;
  private cellData: number[];

  constructor(props: BoardProps) {
    super(props);

    // For best perf & minimal GC overhead,
    // we avoid using actual state / setState
    // for animated properties.
    this.numColumns = props.numColumns;
    this.numRows = props.numRows;
    this.cellSize = props.cellSize;
    this.colors = props.colors;
    this.inactiveTint = hslToHexNum(props.colors.inactiveCell);
    this.sceneTransform = { x:0, y:0, scale:1 };
    this.lastDrawTime = window.performance.now();
    this.isSmoothCamera = props.isSmoothCamera;
    this.animationTimeTaken = 0;
    this.cellData = props.cellData;

    if (props.isFullScreen) {
      window.addEventListener("resize", () => this.resetRendererSize());
    }
  }

  componentDidMount(): void {
    this.scene = new PIXI.Container();
    this.scene.sortableChildren = true;

    this.renderer = this.createRenderer();

    this.resetTints();
    this.resetRendererSize();
    this.resetScene();

    // this.logWebGLSupport();

    this._rafId = window.requestAnimationFrame(this.draw);

    if (!this.props.isFullScreen && this.props.onReady) {
      this.props.onReady();
    }
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

  resetTints(): void {
    this.inactiveTint = hslToHexNum(this.colors.inactiveCell);
    this.activeTints = new Map();
    for (let active=1; active <= this.colors.activeCellTrail.size; active++) {
      this.activeTints.set(active, hslToHexNum(this.colors.activeCellTrail.colors[active-1]));
    }
    if (this.backgroundImage) {
      this.backgroundImage.tint = this.inactiveTint;
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

  initBackgroundGrid(): void {
    if (this.props.isFullScreen && !this.backgroundImage) {
      loader.add('grid', 'assets/images/grid.svg').load(this.onAssetsLoaded)
    }
  }

  onAssetsLoaded = (loader: any, resources: any): void => {
    this.backgroundImage = PIXI.Sprite.from(resources.grid.texture);
    this.backgroundImage.tint = this.inactiveTint;

    const background = new PIXI.Container();
    background.zIndex = 0;
    background.addChild(this.backgroundImage);
    this.scene?.addChild(background);

    if (this.props.onReady) {
      this.props.onReady();
    }
  };

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
      sprite.visible = false;

      cellSprites.push(sprite);
    }
    return cellSprites;
  }

  resetScene(): void {
    this.initBackgroundGrid();

    // remove cellsContainer from scene
    if (this.cellsContainer) {
      this.scene?.removeChild(this.cellsContainer);
    }

    // add cells to scene
    this.cells = this.createCellSprites();
    this.cellsContainer = new PIXI.Container();
    this.cellsContainer.zIndex = 1;
    for (const cell of this.cells) {
      this.cellsContainer.addChild(cell);
    }
    this.scene?.addChild(this.cellsContainer);
  }

  resetAnimationTimeTakenIfNecessary(): void {
    if (this.cellData !== this.props.cellData || this.colors !== this.props.colors) {
      this.cellData = this.props.cellData;
      this.animationTimeTaken = 0;
    }
  }

  resetTintsIfNecessary(): void {
    if (this.colors !== this.props.colors) {
      this.colors = this.props.colors;
      this.resetTints();
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
          this.cells[i].tint = this.inactiveTint;
          this.cells[i].visible = false;
        } else {
          this.cells[i].tint = this.activeTints.get(cellValue) as number;
          this.cells[i].visible = true;
        }
      }
    }
  }

  updateCellSpriteTintsWithLerp(lerpAmount: number): void {
    if (this.cells && this.activeTints) {
      for (let i = 0; i < this.props.cellData.length; i++) {
        const cellValue = this.props.cellData[i];
        if (cellValue === 0) {
          const newTint = lerpColor(this.cells[i].tint, this.inactiveTint, lerpAmount);
          this.cells[i].tint = newTint;
          this.cells[i].visible = (newTint !== this.inactiveTint);
        } else {
          this.cells[i].tint = lerpColor(this.cells[i].tint, this.activeTints.get(cellValue) as number, lerpAmount);
          this.cells[i].visible = true;
        }
      }
    }
  }

  updateSceneTransform(): void {
    if (this.renderer && this.cells) {
      const PADDING = 10 * this.cellSize;
      const MIN_SCALE = 0.01;
      const MAX_SCALE = 10;

      // determine bounds of currently & historically active cells (minX, minY, maxX & maxY) with padding
      let minX = Number.MAX_VALUE;
      let maxX = 0;
      let minY = Number.MAX_VALUE;
      let maxY = 0;
      for (let i = 0; i < this.props.cellData.length; i++) {
        if (this.props.cellData[i] !== 0) {
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
    const timeDelta = time - this.lastDrawTime;

    if (timeDelta < FRAME_MIN_TIME) {
      this._rafId = window.requestAnimationFrame(this.draw);
      return;
    }
    this.lastDrawTime = time;

    this.resetAnimationTimeTakenIfNecessary();
    this.resetTintsIfNecessary();
    this.resetRenderSizeAndSceneIfNecessary();

    this.updateSceneTransform();
    this.updateSmoothCamera();

    // Update transform closer to desired transform based on timeDelta and rate
    const RATE = 1;
    const t = this.isSmoothCamera ? (RATE * (timeDelta / 1000)) : 1;

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

    this._rafId = window.requestAnimationFrame(this.draw);
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
