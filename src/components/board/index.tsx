import {Component, h, JSX} from 'preact';

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

  private canvas: HTMLCanvasElement | undefined;
  private ctx: CanvasRenderingContext2D | null | undefined;
  private _rafId: number | undefined;
  private numColumns: number;
  private numRows: number;
  private cellSize: number;
  private offset: {x: number; y: number};

  constructor(props: BoardProps) {
    super(props);

    // For best perf & minimal GC overhead,
    // we avoid using actual state / setState
    // for animated properties.
    this.numColumns = props.numColumns;
    this.numRows = props.numRows;
    this.cellSize = props.cellSize;
    this.offset = this.calcOffset(this.numColumns, this.numRows, this.cellSize);
  }

  calcOffset(numColumns: number, numRows: number, cellSize: number): {x: number; y: number} {
    const pageWidth = (document.documentElement.clientWidth || document.body.clientWidth);
    const pageHeight = (document.documentElement.clientHeight || document.body.clientHeight);
    return {
      x: Math.floor((pageWidth - (numColumns * cellSize)) / 2),
      y: Math.floor((pageHeight - (numRows * cellSize)) / 2),
    }
  }

  setCanvasDimensions(): void {
    if (this.canvas) {
      this.canvas.width = (this.offset.x * 2) + this.cellSize * this.numColumns;
      this.canvas.height = (this.offset.y * 2) + this.cellSize * this.numRows;
      this.ctx = this.canvas.getContext('2d');
    }
  }

  componentDidMount(): void {
    this.canvas = (this.base as HTMLCanvasElement);
    this.setCanvasDimensions();

    this._rafId = window.requestAnimationFrame(this.draw);
  }

  backgroundColorHSL(active: number, maxActive: number, activeColor: HSLColor): string {
    const hue = active === 1 ? activeColor.h : ((activeColor.h - 200) + (200 * ( 1 - (active / maxActive))));
    const saturation = active === 1 ? activeColor.s : ((activeColor.s) + (10 * (active / maxActive)));
    const lightness = active === 1 ? activeColor.l : ((activeColor.l - 50) + (30 * (1 - (active / maxActive))));
    return active === 0 ? 'transparent' : `hsl(${hue.toFixed(2)}, ${saturation.toFixed(2)}%, ${lightness.toFixed(2)}%)`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  draw: FrameRequestCallback = (time) => {
    this._rafId = window.requestAnimationFrame(this.draw);

    if (this.canvas && this.ctx) {

      if (this.numColumns !== this.props.numColumns
        || this.numRows !== this.props.numRows
        || this.cellSize !== this.props.cellSize) {
        this.numColumns = this.props.numColumns;
        this.numRows = this.props.numRows;
        this.cellSize = this.props.cellSize;
        this.offset = this.calcOffset(this.numColumns, this.numRows, this.cellSize);
        this.setCanvasDimensions();
      }
      const maxX = this.offset.x + this.props.numColumns * this.props.cellSize;
      const maxY = this.offset.y + this.props.numRows * this.props.cellSize;

      // Clear
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw grid
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = 'rgb(51,51,51)';
      for (let x=this.offset.x; x<=maxX; x += this.props.cellSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, this.offset.y);
        this.ctx.lineTo(x, maxY);
        this.ctx.stroke();
      }
      for (let y=this.offset.y; y<=maxY; y += this.props.cellSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x, y);
        this.ctx.lineTo(maxX, y);
        this.ctx.stroke();
      }

      // Draw cells
      for (let i=0; i<this.props.cellData.length; i++) {
          const cellValue = this.props.cellData[i];
          if (cellValue > 0) {
            this.ctx.fillStyle = this.backgroundColorHSL(cellValue, this.props.maxActive, DEFAULT_CELL_COLOR)

            const row = Math.floor(i / this.props.numColumns);
            const col = i % this.numColumns;
            const x = this.offset.x + (col * this.props.cellSize) + 1;
            const y = this.offset.y + (row * this.props.cellSize) + 1;
            const rectSize = this.props.cellSize - 2;
            this.ctx.fillRect(x, y, rectSize, rectSize);
          }
      }
    }
  }

  render(): JSX.Element {
    return <canvas />
  }
}

export default Board;
