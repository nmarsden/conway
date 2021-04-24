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
  private offset: {x: number; y: number};
  private renderer?: PIXI.Renderer;
  private scene?: PIXI.Container;
  private cells?: Array<PIXI.Sprite>;
  private activeTints?: Map<number, number>;

  constructor(props: BoardProps) {
    super(props);

    // For best perf & minimal GC overhead,
    // we avoid using actual state / setState
    // for animated properties.
    this.numColumns = props.numColumns;
    this.numRows = props.numRows;
    this.cellSize = props.cellSize;
    this.maxActive = props.maxActive;
    this.offset = this.calcOffset(this.numColumns, this.numRows, this.cellSize);
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

  calcOffset(numColumns: number, numRows: number, cellSize: number): {x: number; y: number} {
    const pageWidth = (document.documentElement.clientWidth || document.body.clientWidth);
    const pageHeight = (document.documentElement.clientHeight || document.body.clientHeight);
    return {
      x: Math.floor((pageWidth - (numColumns * cellSize)) / 2),
      y: Math.floor((pageHeight - (numRows * cellSize)) / 2),
    }
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
    this.renderer?.resize(
      (this.offset.x * 2) + this.cellSize * this.numColumns,
      (this.offset.y * 2) + this.cellSize * this.numRows
    );
  }

  createGridGraphic(): PIXI.Graphics {
    const maxX = this.offset.x + this.numColumns * this.cellSize;
    const maxY = this.offset.y + this.numRows * this.cellSize;

    const grid = new PIXI.Graphics();
    grid.lineStyle(1, 0x333333);

    for (let x=this.offset.x; x<=maxX; x += this.cellSize) {
      grid.moveTo(x, this.offset.y);
      grid.lineTo(x, maxY);
    }
    for (let y=this.offset.y; y<=maxY; y += this.cellSize) {
      grid.moveTo(this.offset.x, y);
      grid.lineTo(maxX, y);
    }
    return grid;
  }

  createCellSprites(): PIXI.Sprite[] {
    const rectSize = this.cellSize - 2;
    const cellGraphic = new PIXI.Graphics();
    cellGraphic.beginFill(0xFFFFFF);
    cellGraphic.drawRect(0, 0, rectSize, rectSize);
    cellGraphic.endFill();
    const cellTexture = this.renderer?.generateTexture(cellGraphic);
    const numCells = this.numRows * this.numColumns;

    const cellSprites = [];
    for (let i=0; i< numCells; i++) {
      const row = Math.floor(i / this.props.numColumns);
      const col = i % this.numColumns;
      const x = this.offset.x + (col * this.props.cellSize) + 1;
      const y = this.offset.y + (row * this.props.cellSize) + 1;

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

    // add grid to scene
    this.scene?.addChild(this.createGridGraphic());

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
      this.offset = this.calcOffset(this.numColumns, this.numRows, this.cellSize);

      this.resetRendererSize();
      this.resetScene();
    }
  }

  updateCellSpriteTints(): void {
    if (this.cells && this.activeTints) {
      for (let i = 0; i < this.props.cellData.length; i++) {
        const cellValue = this.props.cellData[i];
        if (cellValue === 0) {
          this.cells[i].tint = 0x000000;
          this.cells[i].alpha = 0;
        } else {
          this.cells[i].tint = this.activeTints.get(cellValue) as number;
          this.cells[i].alpha = 1;
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  draw: FrameRequestCallback = (time) => {
    this._rafId = window.requestAnimationFrame(this.draw);

    this.resetActiveTintsIfNecessary();
    this.resetRenderSizeAndSceneIfNecessary();

    this.updateCellSpriteTints();

    this.renderer?.render(this.scene as PIXI.IRenderableObject);
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
