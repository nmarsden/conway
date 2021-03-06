import {Component, createRef, h} from 'preact';
import {Pattern, SORTED_PATTERN_NAMES} from "../../utils/simulator";
import {FlickingEvent, SelectEvent, FlickingPanel} from "@egjs/flicking";
import Flicking from "@egjs/preact-flicking";
import {PatternColors, PatternPreview} from "../patternPreview";

export type PatternSelectorProps = {
  value: Pattern;
  patternColors: PatternColors;
  onChanged: (pattern: Pattern) => void;
  disabled: boolean;
};

type PatternItem = {
  pattern: Pattern;
  isSelected: boolean;
  isVisible: boolean;
}

type PatternSelectorState = {
  patternItems: PatternItem[];
};

type Range = {
  min: number;
  max: number;
}

export class PatternSelector extends Component<PatternSelectorProps, PatternSelectorState> {

  ref = createRef();

  constructor(props: PatternSelectorProps) {
    super(props);
    this.state = {
      patternItems: SORTED_PATTERN_NAMES.map(patternName => {
        const pattern = (Pattern as never)[patternName];
        return {
          pattern,
          isSelected: (pattern === this.props.value),
          isVisible: false
        };
      })
    }

    window.addEventListener("resize", () => this.resetVisibleItems());
  }

  componentDidMount(): void {
    this.updateVisibility(this.state.patternItems);
  }

  componentDidUpdate(prevProps: Readonly<PatternSelectorProps>): void {
      if (prevProps.value !== this.props.value) {
        if (this.ref.current) {
          this.ref.current.moveTo(this.getPatternIndex(this.props.value));
          this.updatePatternItemsState(this.props.value);
        }
      }
  }

  updateVisibility = (patternItems: PatternItem[]): void => {
    if (this.ref.current) {
      const visiblePanels: FlickingPanel[] = this.ref.current.getVisiblePanels();
      const visiblePanelIndexes = visiblePanels.map(panel => panel.getIndex());

      patternItems.forEach((patternItem, index) => {
        patternItem.isVisible = visiblePanelIndexes.includes(index);
      })
    }
  }

  resetVisibleItems(): void {
    const updatedPatternItems = [...this.state.patternItems];
    this.updateVisibility(updatedPatternItems);
    this.setState({patternItems: updatedPatternItems});
  }

  getPatternIndex = (pattern: Pattern): number => {
    return this.state.patternItems.findIndex(patternItem => patternItem.pattern === pattern);
  }

  inRange = (n: number, range: Range): boolean => {
    return n >= range.min && n <= range.max;
  }

  updatePatternItemsState = (selectedPattern: Pattern): void => {
    const updatedPatternItems = [ ...this.state.patternItems ];
    updatedPatternItems.forEach(item => item.isSelected = (item.pattern === selectedPattern));
    this.setState( { patternItems: updatedPatternItems });
  }

  render(): JSX.Element {
    const defaultIndex = this.getPatternIndex(this.props.value);
    return (
      <Flicking
        ref={this.ref}
        tag="div"
        viewportTag="div"
        cameraTag="div"
        // onNeedPanel={(e: NeedPanelEvent) => {
        // }}
        // onMoveStart={(e: FlickingEvent) => {
        // }}
        onMove={(e: FlickingEvent): void => {
          const flicking = e.currentTarget;

          const updatedPatternItems = [ ...this.state.patternItems ];
          flicking.getAllPanels(true).forEach((panel, i) => {
            updatedPatternItems[i].isVisible = (panel.getOutsetProgress() > -1 && panel.getOutsetProgress() < 1);
          })
          this.setState( { patternItems: updatedPatternItems });
        }}
        // onMoveEnd={(e: FlickingEvent) => {
        // }}
        // onHoldStart={(e: FlickingEvent) => {
        // }}
        // onHoldEnd={(e: FlickingEvent) => {
        // }}
        // onRestore={(e: FlickingEvent) => {
        // }}
        // onVisibleChange={(e: VisibleChangeEvent) => {
        // }}
        onSelect={(e: SelectEvent): void => {
          const selectedPattern = this.state.patternItems[e.index].pattern;

          this.updatePatternItemsState(selectedPattern);
          this.props.onChanged(selectedPattern);
        }}
        // onChange={(e: ChangeEvent) => {
        // }}
        classPrefix="eg-flick"
        deceleration={0.00075}
        horizontal={true}
        circular={false}
        infinite={false}
        infiniteThreshold={0}
        lastIndex={Infinity}
        threshold={70}
        duration={100}
        panelEffect={(x): number => 1 - Math.pow(1 - x, 3)} // easeOutCubic
        defaultIndex={defaultIndex}
        inputType={["touch", "mouse"]}
        thresholdAngle={45}
        bounce={10}
        autoResize={true}
        adaptive={false}
        zIndex={2000}
        bound={true}
        overflow={false}
        hanger={"50%"}
        anchor={"50%"}
        gap={20}
        moveType={{type: "snap", count: 8}}
        collectStatistics={false}
        renderOnlyVisible={true}
        isEqualSize={true}
        isConstantSize={true}
        hwAccelerable={true}
      >
        {this.state.patternItems.map((patternItem, index) => {
          return <PatternPreview
            key={index}
            pattern={patternItem.pattern}
            patternColors={this.props.patternColors}
            isSelected={patternItem.isSelected}
            isVisible={patternItem.isVisible}
          />
        })}
      </Flicking>
    );
  }
}
