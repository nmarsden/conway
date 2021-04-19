import {Component, h} from 'preact';
import style from './style.css';
import {Pattern, SORTED_PATTERN_NAMES} from "../../utils/simulator";

type PatternDropdownProps = {
    value: Pattern;
    onChanged: (pattern: Pattern) => void;
};

type PatternDropdownState = {
    isOpen: boolean;
};

class PatternDropdown extends Component<PatternDropdownProps, PatternDropdownState> {

    constructor(props: PatternDropdownProps) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    private onButtonClicked = (): void => {
        this.setState({ isOpen: !this.state.isOpen})
    };

    private onButtonBlur = (): void => {
        this.setState({ isOpen: false})
    }

    private patternSelectedHandler = (pattern: string): () => void => {
        return (): void => {
            this.setState({ isOpen: false });
            this.props.onChanged((Pattern as never)[pattern]);
        }
    }

    private patternDisplayName(pattern: string): string {
        return pattern.replace(/_/g, ' ');
    }

    render(): JSX.Element {
        return (
          <div>
              <button className={style['button']}
                      tabIndex={0}
                      onBlur={this.onButtonBlur}
                      onClick={this.onButtonClicked}>{this.patternDisplayName(Pattern[this.props.value])}
              </button>
              {this.state.isOpen ? (
              <div className={style['menu']}>
                { SORTED_PATTERN_NAMES.map( patternName => (
                  <div className={style['menu-item']} onMouseDown={this.patternSelectedHandler(patternName)}>{this.patternDisplayName(patternName)}</div>
                ))}
              </div>) : ''}
          </div>
        );
    }
}

export default PatternDropdown;
