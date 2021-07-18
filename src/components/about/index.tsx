import {Component, Fragment, h} from 'preact';
import style from './style.css';
import classNames from "classnames";

export type AboutProps = {
};

type Slide = {
  heading: string;
  content: string;
  renderDiagram: () => JSX.Element;
}

type Cell = {
  isAlive: boolean;
  isCenter: boolean;
}

type BoardRenderer = () => JSX.Element;

type AboutState = {
  isModalOpen: boolean;
  activeSlideIndex: number;
  slides: Slide[];
};

const NO_DIAGRAM = (): JSX.Element => <Fragment />

const to3x3Cells = (nums: number[]): Cell[][] => {
    const cells: Cell[][] = [];
    let row: Cell[];
    nums.forEach((num, index) => {
      if (index % 3 === 0) {
        row = [];
        cells.push(row);
      }
      row.push({ isAlive: num === 1, isCenter: index === 4 });
    });
    return cells;
}

const renderBoard = (cells: Cell[][]): JSX.Element =>
  <div className={style['board']}>
    { cells.map(row => {
      return <div className={style['board-row']}>
        { row.map(cell => <div className={classNames(style['board-cell'],
          {
            [style['is-alive']]: cell.isAlive,
            [style['is-center']]: cell.isCenter
          })} />) }
      </div>
    })}
  </div>

const render3x3Board = (nums: number[]): JSX.Element => renderBoard(to3x3Cells(nums));

const renderArrow = (): JSX.Element =>
  <div className={style['arrow']}>
    <div className={style['arrow-body']} />
    <div className={style['arrow-point']} />
  </div>

const renderBoards = (renderBoard1: BoardRenderer, renderBoard2: BoardRenderer): JSX.Element =>
  <div className={style['diagram']}>
    { renderBoard1() }
    { renderArrow() }
    { renderBoard2() }
  </div>

const renderDiagram = (nums1: number[], nums2: number[]): JSX.Element =>
   renderBoards(() => render3x3Board(nums1), () => render3x3Board(nums2));

const LONELINESS_DIAGRAM = (): JSX.Element =>
    renderDiagram([
      1, 0, 0,
      0, 1, 0,
      0, 0, 0
    ],[
      1, 0, 0,
      0, 0, 0,
      0, 0, 0
    ]);

const OVERCROWDING_DIAGRAM = (): JSX.Element =>
    renderDiagram([
      1, 1, 0,
      0, 1, 1,
      0, 1, 0
    ],[
      1, 1, 0,
      0, 0, 1,
      0, 1, 0
    ]);

const REPRODUCTION_DIAGRAM = (): JSX.Element =>
    renderDiagram([
      1, 0, 0,
      0, 0, 1,
      0, 1, 0
    ],[
      1, 0, 0,
      0, 1, 1,
      0, 1, 0
    ]);

const STASIS_DIAGRAM = (): JSX.Element =>
    renderDiagram([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ],[
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ]);

export class About extends Component<AboutProps, AboutState> {

  constructor(props: AboutProps) {
    super(props);
    this.state = {
      isModalOpen: false,
      activeSlideIndex: 0,
      slides: [
        {
          heading: 'What is it?',
          content: 'The Game of Life is not a game in the conventional sense.\n' +
            '\n' +
            'There are no players, and no winning or losing. Once the "pieces" are placed in the starting position, the rules determine everything that happens later.\n' +
            '\n' +
            'Nevertheless, Life is full of surprises! In most cases, it is impossible to look at a starting position (or pattern) and see what will happen in the future.\n' +
            '\n' +
            'The only way to find out is to follow the rules of the game.',
          renderDiagram: NO_DIAGRAM
        },
        {
          heading: 'The Rules',
          content: 'The Game of Life is played on a grid of square cells. \n' +
            '\n' +
            'A cell can be live or dead. \n' +
            '\n' +
            'A live cell is shown by putting a marker on its square. \n' +
            'A dead cell is shown by leaving the square empty. \n' +
            '\n' +
            'Each cell in the grid has a neighborhood consisting of the eight cells in every direction including diagonals.\n' +
            '\n' +
            'To apply one step of the rules, we count the number of live neighbors for each cell. \n' +
            '\n' +
            'What happens next depends on this number.',
          renderDiagram: NO_DIAGRAM
        },
        {
          heading: 'Rule 1: Loneliness',
          content: 'A cell with less than 2 adjoining cells dies',
          renderDiagram: LONELINESS_DIAGRAM
        },
        {
          heading: 'Rule 2: Stasis',
          content: 'A cell with exactly 2 adjoining cells remains the same',
          renderDiagram: STASIS_DIAGRAM
        },
        {
          heading: 'Rule 3: Overcrowding',
          content: ' A cell with more than 3 adjoining cells dies',
          renderDiagram: OVERCROWDING_DIAGRAM
        },
        {
          heading: 'Rule 4: Reproduction',
          content: 'An empty cell with exactly 3 adjoining cells comes alive',
          renderDiagram: REPRODUCTION_DIAGRAM
        }
      ]
    };
  }

  infoButtonClicked = (): void => {
    this.setState({isModalOpen: true, activeSlideIndex: 0});
  }

  modalCloseButtonClicked = (): void => {
    this.setState({isModalOpen: false});
  };

  pageButtonClicked = (slideIndex: number): () => void => {
    return () => {
      this.setState({activeSlideIndex: slideIndex});
    }
  };

  previousButtonClicked = (): void => {
    this.setState({activeSlideIndex: this.state.activeSlideIndex - 1});
  };

  nextButtonClicked = (): void => {
    this.setState({activeSlideIndex: this.state.activeSlideIndex + 1});
  };

  isPreviousSlide = (): boolean => {
    return this.state.activeSlideIndex > 0;
  }

  isNextSlide = (): boolean => {
    return this.state.activeSlideIndex < this.state.slides.length - 1;
  }

  render(): JSX.Element {
    return (
      <Fragment>
        <button className={classNames(style['info-button'], {[style['is-hidden']]: this.state.isModalOpen})} onClick={this.infoButtonClicked} />
        <div className={classNames(style['modal'], {[style['is-open']]: this.state.isModalOpen})}>
          <button className={style['close-button']} onClick={this.modalCloseButtonClicked} />
          <div className={style['header']}>Conway's Game of Life</div>
          <div className={style['body']}>
            <div>
            { this.state.slides.map( (slide, index) =>
              <div className={classNames(style['slide'], {[style['is-slide-active']]: index === this.state.activeSlideIndex})}>
                <div className={style['slide-heading']}>{slide.heading}</div>
                <div className={style['slide-content']}>{slide.content}</div>
                <div className={style['slide-diagram']}>{slide.renderDiagram()}</div>
              </div>
            )}
            </div>
            <div className={style['slide-buttons-container']}>
              <div className={style['slide-buttons']}>
                <button
                  className={classNames(style['slide-button'], style['previous'], {[style['is-disabled']]: !this.isPreviousSlide()})}
                  onClick={this.previousButtonClicked} />
                { this.state.slides.map( (slide, index) =>
                  <button
                    className={classNames(style['slide-button'], style['page'], {[style['is-active']]: index === this.state.activeSlideIndex})}
                    onClick={this.pageButtonClicked(index)} />
                )}
                <button
                  className={classNames(style['slide-button'], style['next'], {[style['is-disabled']]: !this.isNextSlide()})}
                  onClick={this.nextButtonClicked} />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
