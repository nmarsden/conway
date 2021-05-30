import {Component, createRef, h} from 'preact';
import {Pattern, SORTED_PATTERN_NAMES} from "../../utils/simulator";
import {FlickingEvent, SelectEvent, FlickingPanel} from "@egjs/flicking";
import Flicking from "@egjs/preact-flicking";
import PatternPreview from "../patternPreview";

type PatternSelectorProps = {
  value: Pattern;
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

class PatternSelector extends Component<PatternSelectorProps, PatternSelectorState> {

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
        onMove={(e: FlickingEvent) => {
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
        onSelect={(e: SelectEvent) => {
          const selectedPattern = this.state.patternItems[e.index].pattern;
          const updatedPatternItems = [ ...this.state.patternItems ];
          updatedPatternItems.forEach(item => item.isSelected = (item.pattern === selectedPattern));
          this.setState( { patternItems: updatedPatternItems });

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
        panelEffect={x => 1 - Math.pow(1 - x, 3)} // easeOutCubic
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
            isSelected={patternItem.isSelected}
            isVisible={patternItem.isVisible}
          />
        })}
      </Flicking>
    );
  }
}

export default PatternSelector;
