import {Component, h, JSX} from 'preact';
import * as PIXI from 'pixi.js'

PIXI.utils.skipHello();

type HSLColor = {h: number; s: number; l: number };

const DEFAULT_CELL_COLOR: HSLColor = { h:157, s:71, l:60 }; // green

type BoardProps = {
  numColumns: number;
  numRows: number;
  cellData: number[];
  maxActive: number;
  cellSize: number;
};

type BoardState = {};

class Board extends Component<BoardProps, BoardState> {

  private _rafId: number | undefined;
  private numColumns: number;
  private numRows: number;
  private cellSize: number;
  private maxActive: number;
  private renderer?: PIXI.Renderer;
  private scene?: PIXI.Container;
  private cells?: Array<PIXI.Sprite>;
  private activeTints?: Map<number, number>;
  private sceneTransform: { x: number; y: number; scale: number};
  private lastDrawTime?: number;

  constructor(props: BoardProps) {
    super(props);

    // For best perf & minimal GC overhead,
    // we avoid using actual state / setState
    // for animated properties.
    this.numColumns = props.numColumns;
    this.numRows = props.numRows;
    this.cellSize = props.cellSize;
    this.maxActive = props.maxActive;
    this.sceneTransform = { x:0, y:0, scale:1 };

    window.addEventListener("resize", () => this.resetRendererSize());
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

  createRenderer(): PIXI.Renderer {
    const canvas = (this.base as HTMLCanvasElement);

    return PIXI.autoDetectRenderer({
      view: canvas,
      antialias: true,
      backgroundAlpha: 0,
      resolution: 1
    }) as PIXI.Renderer;
  }

  hslToHex({ h, s, l, }: { h: number; s: number; l: number }): number {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number): string => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return PIXI.utils.string2hex(`#${f(0)}${f(8)}${f(4)}`);
  }

  activeHSLColor(active: number, maxActive: number, activeColor: HSLColor): { h: number; s: number; l: number } {
    const hue = active === 1 ? activeColor.h : ((activeColor.h - 200) + (200 * ( 1 - (active / maxActive))));
    const saturation = active === 1 ? activeColor.s : ((activeColor.s) + (10 * (active / maxActive)));
    const lightness = active === 1 ? activeColor.l : ((activeColor.l - 50) + (30 * (1 - (active / maxActive))));
    return active === 0 ? { h:0, s:0, l:0 } : { h: hue, s: saturation, l: lightness };
  }

  resetActiveTints(): void {
    this.activeTints = new Map();
    for (let active=1; active <= this.maxActive; active++) {
      const hsl = this.activeHSLColor(active, this.maxActive, DEFAULT_CELL_COLOR);
      this.activeTints.set(active, this.hslToHex(hsl));
    }
  }

  resetRendererSize(): void {
    const pageWidth = (document.documentElement.clientWidth || document.body.clientWidth);
    const pageHeight = (document.documentElement.clientHeight || document.body.clientHeight);
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

  resetActiveTintsIfNecessary(): void {
    if (this.maxActive !== this.props.maxActive) {
      this.maxActive = this.props.maxActive;
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
          this.cells[i].alpha = 0.25;
        } else {
          this.cells[i].tint = this.activeTints.get(cellValue) as number;
          this.cells[i].alpha = 1;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  draw: FrameRequestCallback = (time) => {
    this._rafId = window.requestAnimationFrame(this.draw);

    this.resetActiveTintsIfNecessary();
    this.resetRenderSizeAndSceneIfNecessary();

    this.updateCellSpriteTints();
    this.updateSceneTransform();

    // Update transform closer to desired transform based on timeDelta and rate
    const RATE = 1;
    const timeDelta = (typeof this.lastDrawTime === 'undefined') ? 0 : (time - this.lastDrawTime);
    const t = RATE * (timeDelta / 1000);

    this.lastDrawTime = time;

    if (this.scene) {
      const x = this.lerp(this.scene.position.x, this.sceneTransform.x, t);
      const y = this.lerp(this.scene.position.y, this.sceneTransform.y, t);
      const scale = this.lerp(this.scene.scale.x, this.sceneTransform.scale, t);

      this.scene?.setTransform(x, y, scale, scale);
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

export default Board;
